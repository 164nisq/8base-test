import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, ModalContext, InputField, DateInputField, SelectField } from '@8base/boost';
import { Query, graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const getClientsOptions = (clients = []) => {
  const testLog = clients.map(item => ({
    value: item.id,
    label: item.firstName,
  }));
  return testLog;
};

const getProductsOptions = (orders = []) => {
  const testLog = orders.map(item => ({
    label: item.product.name,
    value: item.id,
  }));
  return testLog;
};
const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async data => {
    await this.props.orderCreate({ variables: { data: { ...data } } });
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Order" onClose={this.onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Query query={sharedGraphQL.ORDERS_CLIENTS_QUERY}>
              {({ data, loading }) => {
                return (
                  <Field
                    name="client"
                    label="Client"
                    placeholder="Select a client"
                    component={SelectField}
                    loading={loading}
                    options={loading ? [] : getClientsOptions(data.clientsList.items)}
                    stretch
                  />
                );
              }}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field name="address" label="Address" type="text" placeholder="Enter address" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDt" label="Delivery Date" component={DateInputField} withTime />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" type="text" placeholder="Comment" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Query query={sharedGraphQL.ORDERS_PRODUCTS_QUERY}>
              {({ data, loading }) => (
                <Field
                  name="product"
                  label="Product"
                  placeholder="Select a product"
                  component={SelectField}
                  loading={loading}
                  options={loading ? [] : getProductsOptions(data.orderItemsList.items)}
                  stretch
                />
              )}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field
              name="status"
              label="Status"
              placeholder="Select a status"
              component={SelectField}
              options={[
                { label: 'Opened', value: 'Paid' },
                { label: 'ReadyToDelivery', value: 'ReadyToDelivery' },
                { label: 'Delivering', value: 'Delivering' },
                { label: 'Closed', value: 'Closed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
              stretch
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Create Order
        </Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ORDER_CREATE_DIALOG_ID} size="sm">
        <Form type="CREATE" tableSchemaName="Orders" onSubmit={this.onSubmit}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDERS_CREATE_MUTATION, {
  name: 'orderCreate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfully created',
    },
  },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };
