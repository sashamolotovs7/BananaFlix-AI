import { useState, useEffect, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import {
  saveNextUpMovieIds,
  getNextUpMovieIds,
  saveSeenItMovieIds,
  getSeenItMovieIds,
} from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';
import { SAVE_NEXT_UP_MOVIE, SAVE_SEEN_IT_MOVIE } from '../utils/mutations';
import './SearchMovies.css';

const API_KEY = import.meta.env.VITE_REACT_APP_TMDB_API_KEY;

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const [saveNextUpMovie] = useMutation(SAVE_NEXT_UP_MOVIE);
  const [saveSeenItMovie] = useMutation(SAVE_SEEN_IT_MOVIE);

  useEffect(() => {
    console.log('Effect triggered, updating local storage:', { savedNextUpMovieIds, savedSeenItMovieIds });
    saveNextUpMovieIds(savedNextUpMovieIds);
    saveSeenItMovieIds(savedSeenItMovieIds);
  }, [savedNextUpMovieIds, savedSeenItMovieIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted with input:', searchInput);
    if (!searchInput) return;

    try {
      const response = await searchMovies(API_KEY, searchInput);
      if (!response.ok) throw new Error('Failed to fetch movies.');

      const data = await response.json();
      const movieData = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        mediaType: 'movie',
      }));

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  };

  const handleAddToNextUp = async (movie: Movie) => {
    console.log('Attempting to add to Next Up:', movie.id, movie.title);
    if (savedNextUpMovieIds.includes(movie.id.toString())) {
      console.log('Movie already in Next Up:', movie.id);
      return;
    }

    const details = {
      movieId: movie.id.toString(),
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      mediaType: movie.mediaType || 'movie',
      category: 'next-up',
    };

    try {
      await saveNextUpMovie({ variables: { input: details } });
      setSavedNextUpMovieIds([...savedNextUpMovieIds, movie.id.toString()]);
      console.log('Successfully added movie to Next Up:', movie.id);
    } catch (error) {
      console.error('Error saving movie to Next Up:', error);
    }
  };

  const handleSaveSeenIt = async (movie: Movie) => {
    console.log('Attempting to mark as Seen:', movie.id, movie.title);
    if (savedSeenItMovieIds.includes(movie.id.toString())) {
      console.log('Movie already marked as Seen:', movie.id);
      return;
    }

    const details = {
      movieId: movie.id.toString(),
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      mediaType: movie.mediaType || 'movie',
      category: 'seen-it',
    };

    try {
      await saveSeenItMovie({ variables: { input: details } });
      setSavedSeenItMovieIds([...savedSeenItMovieIds, movie.id.toString()]);
      console.log('Successfully marked movie as Seen:', movie.id);
    } catch (error) {
      console.error('Error saving movie to Seen It:', error);
    }
  };

  const truncateText = (text: string, length: number) =>
    text.length > length ? text.substring(0, length) + '...' : text;

  return (
    <div className="search-movies">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Stream Dreams Start Here 🍌"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" type="submit">Search</button>
      </form>

      <div className="container-lg py-5">
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
          {searchedMovies.map((movie) => (
            <div key={movie.id} className="col">
              <div className="card shadow-sm border-0">
                <img
                  src={movie.posterPath || undefined}
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
                      onClick={() => handleAddToNextUp(movie)}
                      disabled={savedNextUpMovieIds.includes(movie.id.toString())}
                    >
                      {savedNextUpMovieIds.includes(movie.id.toString())
                        ? 'Added to Next Up'
                        : 'Add to Next Up'}
                    </button>
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
      </div>
    </div>
  );
};

export default SearchMovies;
