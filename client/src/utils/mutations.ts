import { gql } from '@apollo/client';

// Mutation for logging in a user
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation for adding a new user (signup)
export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      user {
        _id
        username
      }
      token
    }
  }
`;




export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;

// Mutation for saving a movie to the next up list
export const SAVE_NEXT_UP_MOVIE = gql`
  mutation saveNextUp($input: MovieInput!) {
    saveNextUp(input: $input) {
      movieId
      title
      overview
      posterPath
      releaseDate
      voteAverage
    }
  }
`;
