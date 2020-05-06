import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { Card, Heading, Loader, Paragraph, Table } from '@8base/boost';

class ClientDetails extends Component {
  renderOrder = data => {
    const orderItems = data.items[0].orderItems.items;
    return (
      <>
        <Heading type="h5">Delivery address : {data.items[0].address}</Heading>

        <Table>
          <Table.Header columns="repeat(3, 1fr)">
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
          </Table.Header>
          <Table.Body data={orderItems}>
            {order => (
              <Table.BodyRow columns="repeat(3, 1fr)" key={order.id}>
                <Table.BodyCell>{order.product.name}</Table.BodyCell>
                <Table.BodyCell>{order.quantity}</Table.BodyCell>
                <Table.BodyCell>{Math.floor(order.product.price * order.quantity)}</Table.BodyCell>
              </Table.BodyRow>
            )}
          </Table.Body>
        </Table>
      </>
    );
  };

  renderBody = data => (
    <Card padding="md" stretch>
      <Card.Header>
        <Heading type="h3">{`${data.firstName} ${data.lastName}`}</Heading>
      </Card.Header>
      <Card.Body padding="none">
        <Card.Section>
          <Paragraph>Birthday: {data.birthday}</Paragraph>
          <Paragraph>Email : {data.email}</Paragraph>
        </Card.Section>
        <Card.Section>
          <Heading type="h4" text="Orders" />
          {data.orders.items.length ? this.renderOrder(data.orders) : 'No orders'}
        </Card.Section>
      </Card.Body>
    </Card>
  );
  render() {
    const {
      clientDetails: { clientsList, loading },
    } = this.props;
    const rendered = loading ? <Loader stretch /> : this.renderBody(clientsList.items[0]);
    return <>{rendered}</>;
  }
}

ClientDetails = graphql(sharedGraphQL.CLIENT_QUERY, {
  name: 'clientDetails',
  options: props => ({
    variables: {
      filter: { id: { equals: props.computedMatch.params.id } },
    },
  }),
})(ClientDetails);

export default ClientDetails;
