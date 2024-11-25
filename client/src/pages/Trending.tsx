import './Trending.css';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { Movie } from '../models/Movie';
import { TVShow } from '../models/TvShow';
import {
  saveNextUpMovieIds,
  getNextUpMovieIds,
  saveSeenItMovieIds,
  getSeenItMovieIds,
} from '../utils/localStorage';

const TRENDING_MOVIES = gql`
  query GetTrendingMovies {
    trendingMovies {
      id
      title
      posterPath
      backdropPath
      overview
      releaseDate
      voteAverage
      mediaType
    }
  }
`;

const TRENDING_TV_SHOWS = gql`
  query GetTrendingTVShows {
    trendingTVShows {
      id
      name
      posterPath
      backdropPath
      overview
      firstAirDate
      voteAverage
      mediaType
    }
  }
`;

const SAVE_NEXT_UP_TRENDING = gql`
  mutation SaveNextUpTrending($input: MovieInput!) {
    saveNextUpTrending(input: $input) {
      _id
      username
      nextUpMovies {
        _id
        title
      }
    }
  }
`;

const SAVE_SEEN_IT_TRENDING = gql`
  mutation SaveSeenItTrending($input: MovieInput!) {
    saveSeenItTrending(input: $input) {
      _id
      username
      seenItMovies {
        _id
        title
      }
    }
  }
`;

function Trending() {
  const { loading: moviesLoading, error: moviesError, data: moviesData } = useQuery(TRENDING_MOVIES);
  const { loading: showsLoading, error: showsError, data: showsData } = useQuery(TRENDING_TV_SHOWS);
  const [client] = useState(useApolloClient());

  const [expanded, setExpanded] = useState<number | null>(null); 
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const saveToNextUp = async (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    console.log("Attempting to add to Next Up from Trending:", movieId, movie.title || movie.name);
    if (savedNextUpMovieIds.includes(movieId)) {
      console.log("Movie already in Next Up from Trending:", movieId);
      return;
    }

    try {
      await client.mutate({
        mutation: SAVE_NEXT_UP_TRENDING,
        variables: {
          input: {
            movieId: movie.id,
            title: movie.title || movie.name,
            overview: movie.overview,
            posterPath: movie.posterPath,
            releaseDate: movie.releaseDate || movie.firstAirDate,
            voteAverage: movie.voteAverage,
            mediaType: movie.mediaType,
            category: "General"  // Add this with a default or fetch from movie if available
          }
        }
      });
      setSavedNextUpMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveNextUpMovieIds(updated);
        return updated;
      });
      console.log("Successfully added to Next Up from Trending:", movieId);
    } catch (error) {
      console.error('Error saving movie to Next Up from Trending:', error);
    }
  };

  const saveToSeenIt = async (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    console.log("Attempting to mark as Seen from Trending:", movieId, movie.title || movie.name);
    if (savedSeenItMovieIds.includes(movieId)) {
      console.log("Movie already marked as Seen from Trending:", movieId);
      return;
    }

    try {
      await client.mutate({
        mutation: SAVE_SEEN_IT_TRENDING,
        variables: {
          input: {
            movieId: movie.id,
            title: movie.title || movie.name,
            overview: movie.overview,
            posterPath: movie.posterPath,
            releaseDate: movie.releaseDate || movie.firstAirDate,
            voteAverage: movie.voteAverage,
            mediaType: movie.mediaType,
            category: "General"  // Add this with a default or fetch from movie if available
          }
        }
      });
      setSavedSeenItMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveSeenItMovieIds(updated);
        return updated;
      });
      console.log("Successfully marked as Seen from Trending:", movieId);
    } catch (error) {
      console.error('Error saving movie to Seen It from Trending:', error);
    }
  };

  const truncateText = (text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text;

  if (moviesLoading || showsLoading) return <p>Loading...</p>;
  if (moviesError) return <p>Error loading movies: {moviesError.message}</p>;
  if (showsError) return <p>Error loading TV shows: {showsError.message}</p>;

  return (
    <div className="container-lg py-5">
      <h1 className="mb-4">Trending Movies (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {moviesData.trendingMovies.map((movie: Movie) => (
          <div key={movie.id} className="col">
            <div className="card shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                alt={movie.title}
                className="card-img-top"
                style={{ borderRadius: '8px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  {expanded === movie.id
                    ? movie.overview
                    : truncateText(movie.overview, 50)}
                  {movie.overview.length > 50 && (
                    <button
                      className="btn btn-link p-0 read-more"
                      onClick={() => toggleExpanded(movie.id)}
                    >
                      {expanded === movie.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <div className="text-muted">
                  {movie.releaseDate &&
                    new Date(movie.releaseDate).toLocaleDateString()}
                </div>
                <p className="card-text">
                  <small className="rating text-muted">
                    Rating: {movie.voteAverage.toFixed(1)}/10
                  </small>
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => saveToNextUp(movie)}
                    disabled={savedNextUpMovieIds.includes(movie.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(movie.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => saveToSeenIt(movie)}
                    disabled={savedSeenItMovieIds.includes(movie.id.toString())}
                  >
                    {savedSeenItMovieIds.includes(movie.id.toString())
                      ? 'Seen It'
                      : 'Mark as Seen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1 className="mt-5 mb-4">Trending TV Shows (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {showsData.trendingTVShows.map((show: TVShow) => (
          <div key={show.id} className="col">
            <div className="card shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${show.posterPath}`}
                alt={show.name}
                className="card-img-top"
                style={{ borderRadius: '8px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{show.name}</h5>
                <p className="card-text">
                  {expanded === show.id
                    ? show.overview
                    : truncateText(show.overview, 50)}
                  {show.overview.length > 50 && (
                    <button
                      className="btn btn-link p-0 read-more"
                      onClick={() => toggleExpanded(show.id)}
                    >
                      {expanded === show.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <div className="text-muted">
                  {show.firstAirDate &&
                    new Date(show.firstAirDate).toLocaleDateString()}
                </div>
                <p className="card-text">
                  <small className="rating text-muted">
                    Rating: {show.voteAverage.toFixed(1)}/10
                  </small>
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => saveToNextUp(show)}
                    disabled={savedNextUpMovieIds.includes(show.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(show.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => saveToSeenIt(show)}
                    disabled={savedSeenItMovieIds.includes(show.id.toString())}
                  >
                    {savedSeenItMovieIds.includes(show.id.toString())
                      ? 'Seen It'
                      : 'Mark as Seen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;