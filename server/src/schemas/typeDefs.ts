<<<<<<< HEAD
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

=======
import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  
>>>>>>> main
  type Auth {
    token: ID!
    user: User
  }
<<<<<<< HEAD

  type Mutation {
    # Signup accepts username, email, and password, and returns Auth with token and user
    signup(username: String!, email: String!, password: String!): Auth

    # Login accepts username and password, and returns Auth with token and user
    login(username: String!, password: String!): Auth
  }

  type Query {
    me: User
  }
=======
    
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    bookId: ID!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    books: [Book]!
    book(bookId: ID!): Book
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): Book
    removeBook(bookId: ID!): Book
  }
>>>>>>> main
`;

export default typeDefs;
