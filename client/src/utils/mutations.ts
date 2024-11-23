import { gql } from '@apollo/client';

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

export const SAVE_NEXT_UP_MOVIE = gql`
  mutation saveNextUpMovie($input: MovieInput!) {
    saveNextUpMovie(input: $input) {
      nextUpMovies {
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

export const SAVE_SEEN_IT_MOVIE = gql`
  mutation saveSeenItMovie($input: MovieInput!) {
    saveSeenItMovie(input: $input) {
      seenItMovies {
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
export const GET_USER_MOVIE_LISTS = gql`
  query getUserMovieLists {
    me {
      nextUpMovies {
        _id
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
      seenItMovies {
        _id
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
    }
  }
`;