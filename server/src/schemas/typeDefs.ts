import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Movie {
    movieId: ID!
    title: String!
    overview: String!
    posterPath: String
    releaseDate: String
    voteAverage: Float
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedMovies: [Movie]
    nextUpMovies: [String]
    seenMovies: [String]
    movieRatings: [MovieRating]
  }

  type Auth {
    token: String!
    user: User
  }

  type MovieRating {
    movieId: String!
    rating: Float
  }

  type Query {
    me: User
  }

  input MovieInput {
    movieId: ID!
    title: String!
    overview: String!
    posterPath: String
    releaseDate: String
    voteAverage: Float
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveSeenItMovie(movieId: ID!, details: MovieInput!): User
    saveNextUpMovie(movieId: ID!, details: MovieInput!): User
    removeMovie(movieId: String!): User
    markAsNextUp(movieId: String!): User
    markAsSeen(movieId: String!): User
    rateMovie(movieId: String!, rating: Float!): User
  }
`;

export default typeDefs;
