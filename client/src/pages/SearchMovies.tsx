import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import {
  saveNextUpMovieIds,
  getNextUpMovieIds,
  saveSeenItMovieIds,
  getSeenItMovieIds,
} from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';
import { SAVE_NEXT_UP_MOVIE, SAVE_SEEN_IT_MOVIE } from '../utils/mutations';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  const [saveNextUpMovie] = useMutation(SAVE_NEXT_UP_MOVIE);
  const [saveSeenItMovie] = useMutation(SAVE_SEEN_IT_MOVIE);

  useEffect(() => {
    saveNextUpMovieIds(savedNextUpMovieIds);
    saveSeenItMovieIds(savedSeenItMovieIds);
  }, [savedNextUpMovieIds, savedSeenItMovieIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      const response = await searchMovies(API_KEY, searchInput);
      if (!response.ok) throw new Error('Failed to fetch movies.');

      const data = await response.json();
      const movieData = data.results.map((movie: any) => ({
        id: movie.id, // Use `id` here
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '', // Default to an empty string if no image is available
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
      }));

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToNextUp = async (movie: Movie) => {
    if (savedNextUpMovieIds.includes(movie.id.toString())) return; // Corrected to `movie.id`

    try {
      await saveNextUpMovie({
        variables: { movieId: movie.id, details: movie }, // Use `movie.id`
      });
      setSavedNextUpMovieIds([...savedNextUpMovieIds, movie.id.toString()]); // Use `movie.id`
    } catch (error) {
      console.error('Error saving movie to Next Up:', error);
    }
  };

  const handleSeenIt = async (movie: Movie) => {
    if (savedSeenItMovieIds.includes(movie.id.toString())) return; // Corrected to `movie.id`

    try {
      await saveSeenItMovie({
        variables: { movieId: movie.id, details: movie }, // Use `movie.id`
      });
      setSavedSeenItMovieIds([...savedSeenItMovieIds, movie.id.toString()]); // Use `movie.id`
    } catch (error) {
      console.error('Error saving movie to Seen It:', error);
    }
  };

  return (
    <div className="search-movies">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for a movie"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="movie-results">
        {searchedMovies.map((movie) => (
          <div key={movie.id} className="movie-card"> {/* Use `movie.id` */}
            <img src={movie.posterPath?.toString()} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
            <p>Release Date: {movie.releaseDate}</p>
            <p>Rating: {movie.voteAverage}</p>
            <button onClick={() => handleAddToNextUp(movie)}>Add to Next Up</button>
            <button onClick={() => handleSeenIt(movie)}>Seen It</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;