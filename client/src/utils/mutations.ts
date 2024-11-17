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

export const SAVE_SEEN_IT_MOVIE = gql`
  mutation SaveSeenItMovie($movieId: ID!, $details: MovieInput!) {
    saveSeenItMovie(movieId: $movieId, details: $details) {
      _id
      username
      seenIt {
        movieId
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
    }
  }
`;


export const SAVE_NEXT_UP_MOVIE = gql`
  mutation SaveNextUpMovie($movieId: ID!, $details: MovieInput!) {
    saveNextUpMovie(movieId: $movieId, details: $details) {
      _id
      username
      savedNextUpMovies {
        movieId
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
    }
  }
`;

// Mutation for removing a book from a user's collection
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
