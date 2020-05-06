import React, { Component } from 'react';
import * as R from 'ramda';
import { Card, Heading } from '@8base/boost';
import { Query } from '@apollo/react-components';

import * as sharedGraphQL from 'shared/graphql';

class OrdersTotal extends Component {
  renderTotal = ({ data }) => {
    const tableData = R.pathOr([], ['orderItemsList', 'items'], data);
    const price = tableData.reduce((total, currValue) => {
      if (currValue.product) {
        return total + Math.floor(currValue.quantity * currValue.product.price);
      }
      return total;
    }, 0);
    return (
      <Heading padding="md" type="h4">
        Total : {price}
      </Heading>
    );
  };
  render() {
    return <Query query={sharedGraphQL.ORDERS_PRICE_QUERY}>{this.renderTotal}</Query>;
  }
}

export default OrdersTotal;
