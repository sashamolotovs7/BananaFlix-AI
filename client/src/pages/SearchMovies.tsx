import { useState, useEffect, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { 
  saveNextUpMovieIds,
  getNextUpMovieIds,
  saveSeenItMovieIds,
  getSeenItMovieIds
} from '../utils/localStorage';
import type { Movie } from '../models/Movie';
import { searchMovies } from '../utils/API';
import { SAVE_NEXT_UP_MOVIE, SAVE_SEEN_IT_MOVIE } from '../utils/mutations';
import './SearchMovies.css';
import Auth from '../utils/auth';


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
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
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
    if (savedNextUpMovieIds.includes(movie.id.toString())) return;
  
    const details = {
      movieId: movie.id.toString(),
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
    };
  
    try {
      await saveNextUpMovie({ variables: { input: details } });
      setSavedNextUpMovieIds([...savedNextUpMovieIds, movie.id.toString()]);
    } catch (error) {
      console.error('Error saving movie to Next Up:', error);
    }
  };
  
  const handleSaveSeenIt = async (movie: Movie) => {
    if (savedSeenItMovieIds.includes(movie.id.toString())) return;
  
    const details = {
      movieId: movie.id.toString(),
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
    };
  
    try {
      await saveSeenItMovie({ variables: { input: details } });
      setSavedSeenItMovieIds([...savedSeenItMovieIds, movie.id.toString()]);
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
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAddToNextUp(movie)}
                      disabled={savedNextUpMovieIds.includes(movie.id.toString()) || !Auth.loggedIn()}
                    >
                      {savedNextUpMovieIds.includes(movie.id.toString())
                        ? 'Added to Next Up'
                        : 'Add to Next Up'}
                    </button>
                    <button

                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleSaveSeenIt(movie)}
                      disabled={savedSeenItMovieIds.includes(movie.id.toString()) || !Auth.loggedIn()}
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

