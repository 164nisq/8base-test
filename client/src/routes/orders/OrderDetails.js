import React, { Component } from 'react';
import { Query, graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { Card, Heading, Loader, Paragraph, Table, Paper } from '@8base/boost';

class OrderDetails extends Component {
  renderOrder = data => {
    return (
      <>
        <Table>
          <Table.Header columns="repeat(3, 1fr)">
            <Table.HeaderCell>Product Name</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
          </Table.Header>
          <Table.Body data={data}>
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
        <Heading type="h3" text="Order details" />
      </Card.Header>
      <Card.Body padding="none">
        <Card.Section>
          <Paragraph>First Name: {data.client.firstName}</Paragraph>
          <Paragraph>LastName: {data.client.lastName}</Paragraph>
          <Paragraph>Email : {data.client.email}</Paragraph>
          <Paragraph>Email : {data.client.phone}</Paragraph>
        </Card.Section>
        <Card.Section>
          <Heading type="h4" text="Order Items" />
          {data.orderItems.items.length ? this.renderOrder(data.orderItems.items) : 'No orders'}
        </Card.Section>
      </Card.Body>
    </Card>
  );
  render() {
    const {
      orderDetails: { ordersList, loading },
    } = this.props;
    const rendered = loading ? <Loader stretch /> : this.renderBody(ordersList.items[0]);
    return <>{rendered}</>;
  }
}

OrderDetails = graphql(sharedGraphQL.ORDER_QUERY, {
  name: 'orderDetails',
  options: props => ({
    variables: {
      filter: { id: { equals: props.computedMatch.params.id } },
    },
  }),
})(OrderDetails);

export default OrderDetails;
