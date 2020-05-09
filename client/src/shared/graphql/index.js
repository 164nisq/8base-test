import gql from 'graphql-tag';

export const USERS_LIST_QUERY = gql`
  query UsersList {
    usersList {
      items {
        id
        firstName
        lastName
      }
    }
  }
`;
export const CLIENTS_LIST_QUERY = gql`
  query ClientsList($orderBy: [ClientOrderBy], $skip: Int, $first: Int) {
    clientsList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
      }
      count
    }
  }
`;

export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

export const CLIENTS_UPDATE_MUTATION = gql`
  mutation ClientsUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const CLIENTS_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CLIENT_QUERY = gql`
  query Client($filter: ClientFilter) {
    clientsList(filter: $filter) {
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
        orders {
          items {
            address
            status
            orderItems {
              items {
                product {
                  price
                  name
                }
                quantity
              }
            }
          }
        }
      }
      count
    }
  }
`;

//-------Orders----------------

export const ORDERS_LIST_QUERY = gql`
  query OrdersList($orderBy: [OrderOrderBy], $skip: Int, $first: Int) {
    ordersList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        client {
          firstName
        }
        address
        deliveryDt
        comment
        status
      }
      count
    }
  }
`;

export const ORDERS_PRICE_QUERY = gql`
  query OrdersPrice {
    orderItemsList {
      items {
        quantity
        product {
          price
        }
      }
    }
  }
`;

export const ORDERS_CLIENTS_QUERY = gql`
  query ClientsList {
    clientsList {
      items {
        id
        firstName
      }
    }
  }
`;

export const ORDERS_PRODUCTS_QUERY = gql`
  query ProductList {
    orderItemsList {
      items {
        id
        product {
          name
        }
      }
    }
  }
`;

export const ORDERS_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
      orderItems {
        items {
          id
          quantity
        }
      }
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ORDER_QUERY = gql`
  query Client($filter: OrderFilter) {
    ordersList(filter: $filter) {
      items {
        id
        client {
          firstName
          lastName
          phone
          email
        }
        orderItems {
          items {
            product {
              name
              price
            }
            quantity
          }
        }
      }
    }
  }
`;

//-----------Products
export const PRODUCTS_LIST_QUERY = gql`
  query ProductsList($orderBy: [ProductOrderBy], $skip: Int, $first: Int) {
    productsList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        picture {
          id
          fileId
          downloadUrl
          shareUrl
          previewUrl
          filename
          uploadUrl
        }
        name
        description
        price
      }
      count
    }
  }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(data: { id: $id }) {
      success
    }
  }
`;
