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
    <div className="container-lg py-5">
      <h1 className="mb-4">Trending Movies (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {moviesData.trendingMovies.map((movie: Movie) => (
          <div key={movie.id} className="col">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M22.6,10.3c-0.2,4.3-2,8.3-5,11.3c-3.1,3.1-5.8,4.5-9.3,4.9C8.1,26.6,8,26.7,8,26.8c0,0.2,0.1,0.3,0.2,0.3
                        c4.4,2,8.8,1.1,12.4-2.5c3.7-3.8,4.5-9.6,2.1-14.2C22.6,10.4,22.6,10.3,22.6,10.3z"
                        fill="#FDDB3A"
                      />
                      <path
                        d="M22.6,8.2c0.2,0,0.3,0,0.4,0l1-3c0.1-0.3,0-0.5-0.1-0.7C23.7,4.2,23.2,4,22.6,4H22l0.4,4.2
                        C22.5,8.2,22.5,8.2,22.6,8.2z"
                        fill="#00FF00"
                      />
                      <path
                        d="M25.8,5.9C26.1,5,26,4.1,25.5,3.4C24.9,2.5,23.8,2,22.6,2h-1.1c-0.4,0-0.8,0.2-1.1,0.5C20.1,2.9,19.9,3.4,20,4l0.6,6
                        c-0.1,3.9-1.6,7.5-4.4,10.2c-2.8,2.8-5.1,4-8.1,4.3c-1.1,0.1-2,0.9-2.1,1.9c-0.2,1,0.4,2,1.3,2.5c1.8,0.8,3.6,1.2,5.4,1.2
                        c3.3,0,6.6-1.4,9.3-4.1c4.2-4.3,5.3-10.9,2.5-16.2L25.8,5.9z M22.6,4c0.6,0,1.1,0.2,1.3,0.5C24,4.7,24.1,4.9,24,5.2l-1,3
                        c-0.1,0-0.2,0-0.4,0c-0.1,0-0.1,0-0.2,0L22,4H22.6z M20.6,24.6c-3.6,3.6-8,4.5-12.4,2.5C8.1,27.1,8,27,8,26.8c0-0.1,0.1-0.2,0.3-0.3
                        c3.5-0.4,6.2-1.8,9.3-4.9c3-3,4.8-7,5-11.3c0,0,0,0.1,0.1,0.1C25.1,15,24.3,20.8,20.6,24.6z"
                        fill="#231f20"
                      />
                    </svg>
                      Rating: {movie.voteAverage.toFixed(1)}/10
                    </small>
                  </p>
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
                  {show.releaseDate &&
                    new Date(show.releaseDate).toLocaleDateString()}
                </div>
                <p className="card-text">
                  <small className="rating text-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M22.6,10.3c-0.2,4.3-2,8.3-5,11.3c-3.1,3.1-5.8,4.5-9.3,4.9C8.1,26.6,8,26.7,8,26.8c0,0.2,0.1,0.3,0.2,0.3
                      c4.4,2,8.8,1.1,12.4-2.5c3.7-3.8,4.5-9.6,2.1-14.2C22.6,10.4,22.6,10.3,22.6,10.3z"
                      fill="#FDDB3A"
                    />
                    <path
                      d="M22.6,8.2c0.2,0,0.3,0,0.4,0l1-3c0.1-0.3,0-0.5-0.1-0.7C23.7,4.2,23.2,4,22.6,4H22l0.4,4.2
                      C22.5,8.2,22.5,8.2,22.6,8.2z"
                      fill="#00FF00"
                    />
                    <path
                      d="M25.8,5.9C26.1,5,26,4.1,25.5,3.4C24.9,2.5,23.8,2,22.6,2h-1.1c-0.4,0-0.8,0.2-1.1,0.5C20.1,2.9,19.9,3.4,20,4l0.6,6
                      c-0.1,3.9-1.6,7.5-4.4,10.2c-2.8,2.8-5.1,4-8.1,4.3c-1.1,0.1-2,0.9-2.1,1.9c-0.2,1,0.4,2,1.3,2.5c1.8,0.8,3.6,1.2,5.4,1.2
                      c3.3,0,6.6-1.4,9.3-4.1c4.2-4.3,5.3-10.9,2.5-16.2L25.8,5.9z M22.6,4c0.6,0,1.1,0.2,1.3,0.5C24,4.7,24.1,4.9,24,5.2l-1,3
                      c-0.1,0-0.2,0-0.4,0c-0.1,0-0.1,0-0.2,0L22,4H22.6z M20.6,24.6c-3.6,3.6-8,4.5-12.4,2.5C8.1,27.1,8,27,8,26.8c0-0.1,0.1-0.2,0.3-0.3
                      c3.5-0.4,6.2-1.8,9.3-4.9c3-3,4.8-7,5-11.3c0,0,0,0.1,0.1,0.1C25.1,15,24.3,20.8,20.6,24.6z"
                      fill="#231f20"
                    />
                  </svg>
                    Rating: {show.voteAverage.toFixed(1)}/10
                  </small>
                </p>
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
