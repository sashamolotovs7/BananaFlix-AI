import './Trending.css';
import { gql, useQuery } from '@apollo/client';
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

function Trending() {
  const { loading: moviesLoading, error: moviesError, data: moviesData } = useQuery(TRENDING_MOVIES);
  const { loading: showsLoading, error: showsError, data: showsData } = useQuery(TRENDING_TV_SHOWS);

  const [expanded, setExpanded] = useState<number | null>(null); // Expanded movie/show description
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const saveToNextUp = async (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    if (savedNextUpMovieIds.includes(movieId)) return;

    try {
      const response = await fetch('/api/movies/next-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!response.ok) throw new Error('Failed to save movie to Next Up');
      setSavedNextUpMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveNextUpMovieIds(updated); // Save to local storage
        return updated;
      });
      console.log('Movie saved to Next Up:', await response.json());
    } catch (error) {
      console.error('Error saving movie to Next Up:', error);
    }
  };

  const saveToSeenIt = async (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();
    if (savedSeenItMovieIds.includes(movieId)) return;

    try {
      const response = await fetch('/api/movies/seen-it', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!response.ok) throw new Error('Failed to save movie to Seen It');
      setSavedSeenItMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveSeenItMovieIds(updated); // Save to local storage
        return updated;
      });
      console.log('Movie saved to Seen It:', await response.json());
    } catch (error) {
      console.error('Error saving movie to Seen It:', error);
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
