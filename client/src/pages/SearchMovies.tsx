import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';

const API_KEY = 'e6810719cd94c3e532b5975ed70d5830';

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  }, [savedMovieIds]);

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
