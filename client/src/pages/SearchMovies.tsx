import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@apollo/client';
// import Auth from '../utils/auth';
import {
  saveNextUpMovieIds,
  getNextUpMovieIds,
  // saveSeenItMovieIds,
  // getSeenItMovieIds,
} from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';
import { SAVE_NEXT_UP_MOVIE} from '../utils/mutations';


// const API_KEY = import.meta.env.REACT_APP_SEARCH_API_KEY;
// console.log(API_KEY);
const API_KEY = '3cf3a21f6ab6a535c48817d1aa4df009'
// const API_KEY = process.env.SEARCH_TMDB_API_KEY;

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  // const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  const [saveNextUpMovie] = useMutation(SAVE_NEXT_UP_MOVIE);
  // const [saveSeenItMovie] = useMutation(SAVE_SEEN_IT_MOVIE);

  useEffect(() => {
    saveNextUpMovieIds(savedNextUpMovieIds);
    // saveSeenItMovieIds(savedSeenItMovieIds);
  }, [savedNextUpMovieIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      const response = await searchMovies(API_KEY, searchInput);
      console.log(response);
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
    
    // Create the details object to match MovieInput
    const details = {
        movieId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
    };
    console.log('details:', details);

    try {
        console.log('saveNextUp called:', movie.id);
        await saveNextUpMovie({
            variables: { input: details }, // Use the structured `details` object
        });
        
        setSavedNextUpMovieIds([...savedNextUpMovieIds, movie.id.toString()]); // Use `movie.id`
    } catch (error) {
        console.error('Error saving movie to Next Up:', error);
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
        <p>API KEY = {API_KEY}</p>
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
            <button >Seen It</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
