import { gql } from 'graphql-tag';

const createOrderMutation = gql`
  mutation createOrder($products: [ID!]!, $userId: ID!) {
    createOrder(input: { userId: $userId, products: $products }) {
      id
      amount
      products {
        amount
        quantity
        product {
          id
          uuid
          price
          description
        }
      }
      status
    }
  }
`;

const sendFacturaDirectaOrder = gql`
  mutation sendFacturaDirectaOrder($lines: [OrderLines!]!, $orderId: ID!) {
    sendFacturaDirectaOrder(input: { orderId: $orderId, lines: $lines })
  }
`;

export { createOrderMutation, sendFacturaDirectaOrder };
