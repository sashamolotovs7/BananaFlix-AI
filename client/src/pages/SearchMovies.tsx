import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Auth from '../utils/auth';
import { saveNextUpMovieIds, getNextUpMovieIds, getSeenItMovieIds } from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';
import { useMutation } from '@apollo/client';
import { SAVE_NEXT_UP_MOVIE, SAVE_SEEN_IT_MOVIE } from '../utils/mutations';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedSeenItMovieIds, setSeenItMovieIds] = useState(getSeenItMovieIds());
  const [savedNextUpMovieIds, setNextUpMovieIds] = useState(getNextUpMovieIds());

  const [savedSeenItMovie] = useMutation(SAVE_SEEN_IT_MOVIE);
  const [savedNextUpMovie] = useMutation(SAVE_NEXT_UP_MOVIE);

  useEffect(() => {
    const fetchData = () => {
      savedSeenItMovieIds(savedSeenItMovieIds);
      savedNextUpMovieIds(savedNextUpMovieIds);
    };
    fetchData(); 
  }, []);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      const response = await searchMovies(API_KEY, searchInput);
      if (!response.ok) throw new Error('Failed to fetch movies.');

      const data = await response.json();
      const movieData = data.results.map((movie: any) => ({
        movieId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '', // Default to an empty string if no image is available
      }));

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToNextUp = (movieId: string) => {
    if (savedMovieIds.includes(movieId)) return;
    setSavedMovieIds([...savedMovieIds, movieId]);
    // Additional logic to save "Next Up" movie (e.g., send data to a database)
  };

  const handleSeenIt = (movieId: string) => {
    console.log(`Movie ID ${movieId} marked as seen.`);
    // Additional logic for "Seen it" functionality, e.g., update a list in the database
  };

  return (
  <>
   <div></div>
   </>
  );
};

export default SearchMovies;
