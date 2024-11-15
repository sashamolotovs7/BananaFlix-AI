import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    # Signup accepts username, email, and password, and returns Auth with token and user
    signup(username: String!, email: String!, password: String!): Auth

    # Login accepts username and password, and returns Auth with token and user
    login(username: String!, password: String!): Auth
  }

  type Query {
    me: User
  }
`;

export default typeDefs;
