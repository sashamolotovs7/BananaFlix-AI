import './Trending.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Movie } from '../models/Movie';
import { TVShow } from '../models/TvShow';
import { 
  saveNextUpMovieIds, 
  getNextUpMovieIds, 
  saveSeenItMovieIds, 
  getSeenItMovieIds 
} from '../utils/localStorage'; // Assuming you have these utility functions

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

  // LocalStorage state for Next Up and Seen It
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  // Function to toggle expanded description
  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id); // Toggle the expanded state
  };

  // Functions to handle adding to "Next Up" and "Seen It"
  const handleAddToNextUp = (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    if (!savedNextUpMovieIds.includes(movieId)) {
      setSavedNextUpMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveNextUpMovieIds(updated); // Save to local storage
        return updated;
      });
    }
  };

  const handleSaveSeenIt = (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    if (!savedSeenItMovieIds.includes(movieId)) {
      setSavedSeenItMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveSeenItMovieIds(updated); // Save to local storage
        return updated;
      });
    }
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
                    {/* Star icon and rating */}
                    Rating: {movie.voteAverage.toFixed(1)}/10
                  </small>
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  {/* "Next Up" Button */}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleAddToNextUp(movie)}
                    disabled={savedNextUpMovieIds.includes(movie.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(movie.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>

                  {/* "Seen It" Button */}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleSaveSeenIt(movie)}
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
                    {/* Star icon and rating */}
                    Rating: {show.voteAverage.toFixed(1)}/10
                  </small>
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  {/* "Next Up" Button */}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleAddToNextUp(show)}
                    disabled={savedNextUpMovieIds.includes(show.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(show.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>

                  {/* "Seen It" Button */}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleSaveSeenIt(show)}
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

