import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

export default typeDefs;
