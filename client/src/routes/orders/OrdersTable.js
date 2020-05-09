import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import * as R from 'ramda';
import { TableBuilder, Dropdown, Icon, Menu, withModal, Heading, Link } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { product } from 'ramda';
import { Link as RouterLink } from 'react-router-dom';

const ORDERS_TABLE_COLUMNS = [
  { name: 'client', title: 'Client', sortEnable: true },
  { name: 'address', title: 'Address', sortEnable: true },
  { name: 'deliveryDt', title: 'DeliveryDt', sortEnable: false },
  { name: 'comment', title: 'Comment', sortEnable: false },
  { name: 'status', title: 'Status' },
  { name: 'actions', width: '60px', sortEnable: false },
];

class OrdersTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;
    openModal(OrderCreateDialog.id);
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;
    let rendered = String(data[column.name]);
    let totalPrice = 0;

    switch (column.name) {
      case 'client': {
        rendered = (
          <Link tagName={RouterLink} to={`/orders/${data.id}`}>
            {R.pathOr('Unititled', ['client', 'firstName'], data)}
          </Link>
        );

        break;
      }
      case 'address': {
        rendered = R.pathOr('Unititled', ['address'], data);
        break;
      }
      case 'deliveryDt': {
        rendered = R.pathOr('Unititled', ['deliveryDt'], data);
        break;
      }
      case 'comment': {
        rendered = R.pathOr('Unititled', ['comment'], data);
        break;
      }
      case 'status': {
        rendered = R.pathOr('Unititled', ['status'], data);
        break;
      }
      case 'actions': {
        rendered = (
          <Dropdown defaultOpen={false}>
            <Dropdown.Head>
              <Icon name="More" color="LIGHT_GRAY2" />
            </Dropdown.Head>
            <Dropdown.Body pin="right">
              {({ closeDropdown }) => (
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      openModal(OrderDeleteDialog.id, { id: data.id });
                      closeDropdown();
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              )}
            </Dropdown.Body>
          </Dropdown>
        );
        break;
      }
      default: {
        break;
      }
    }

    return rendered;
  };

  renderTable = ({ data, loading }) => {
    const { tableState, onChange, openModal } = this.props;
    const total = R.pathOr(null, ['ordersList', 'count'], data);
    const tableData = R.pathOr([], ['ordersList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);
    return (
      <TableBuilder
        columns={ORDERS_TABLE_COLUMNS}
        data={tableData}
        loading={loading}
        action="Create Order"
        onActionClick={this.onActionClick}
        tableState={finalTableState}
        onChange={onChange}
        renderCell={this.renderCell}
        withPagination
      />
    );
  };

  render() {
    const { tableState } = this.props;
    const skip = (tableState.pagination.page - 1) * tableState.pagination.pageSize;
    const first = tableState.pagination.pageSize;
    const orderBy = R.propOr([], ['sort'], tableState).map(({ name, order }) => `${name}_${order}`);
    return (
      <>
        <Query query={sharedGraphQL.ORDERS_LIST_QUERY} variables={{ orderBy, skip, first }}>
          {this.renderTable}
        </Query>
      </>
    );
  }
}

OrdersTable = compose(
  withModal,
  withStateHandlers(
    { tableState: { pagination: { page: 1, pageSize: 20 } } },
    {
      onChange: ({ tableState }) => value => ({
        tableState: {
          ...tableState,
          ...value,
        },
      }),
    }
  )
)(OrdersTable);

export { OrdersTable };
