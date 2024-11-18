import './Trending.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Movie } from '../models/Movie';
import { TVShow } from '../models/TvShow';

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

function Trending() {
  const { loading: moviesLoading, error: moviesError, data: moviesData } = useQuery(TRENDING_MOVIES);
  const { loading: showsLoading, error: showsError, data: showsData } = useQuery(TRENDING_TV_SHOWS);

  const [expanded, setExpanded] = useState<number | null>(null); // Track expanded movie/show

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id); // Toggle the expanded state
  };

  if (moviesLoading || showsLoading) return <p>Loading...</p>;
  if (moviesError) return <p>Error loading movies: {moviesError.message}</p>;
  if (showsError) return <p>Error loading TV shows: {showsError.message}</p>;

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Trending Movies (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
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
                      className="btn btn-link p-0"
                      onClick={() => toggleExpanded(movie.id)}
                    >
                      {expanded === movie.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <p className="text-muted">{new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p className="card-text">
                  <small className="text-muted">Rating: {movie.voteAverage}/10</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1 className="mt-5 mb-4">Trending TV Shows (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
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
                      className="btn btn-link  p-0"
                      onClick={() => toggleExpanded(show.id)}
                    >
                      {expanded === show.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <p className="text-muted">{new Date(show.firstAirDate).toLocaleDateString()}</p>
                <p className="card-text">
                  <small className="text-muted">Rating: {show.voteAverage}/10</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
