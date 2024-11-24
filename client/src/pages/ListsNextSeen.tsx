import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_MOVIE_LISTS } from '../utils/mutations';
import './ListsNextSeen.css'; // Ensure this file contains your custom styles
import './Trending.css'; // Use the styles from Trending page

const ListsNextSeen: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_MOVIE_LISTS);

  // State for current and applied selections
  const [nextUpSelections, setNextUpSelections] = useState<string[]>([]);
  const [seenItSelections, setSeenItSelections] = useState<string[]>([]);
  const [appliedNextUpSelections, setAppliedNextUpSelections] = useState<string[]>([]);
  const [appliedSeenItSelections, setAppliedSeenItSelections] = useState<string[]>([]);

  // State to toggle the filter dropdowns
  const [showNextUpFilter, setShowNextUpFilter] = useState<boolean>(false);
  const [showSeenItFilter, setShowSeenItFilter] = useState<boolean>(false);

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading movie lists: {error.message}</p>;

  // Destructure data for movies
  const { nextUpMovies = [], seenItMovies = [] } = data?.me || {};

  // Handle checkbox selection
  const handleCheckboxChange = (
    id: string,
    setSelections: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelections((prevSelections) =>
      prevSelections.includes(id)
        ? prevSelections.filter((item) => item !== id) // Remove if already selected
        : [...prevSelections, id] // Add to selection
    );
  };

  // Apply button logic: Apply current selections to active selections
  const handleApply = (
    selections: string[],
    setAppliedSelections: React.Dispatch<React.SetStateAction<string[]>>,
    setFilter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setAppliedSelections(selections); // Update active selections
    setFilter(false); // Collapse the dropdown after applying
  };

  return (
    <div className="container-lg py-5">
      {/* Next Up Movies Section */}
      <div className="list-section">
        <h2 className="mb-4">Next Up Movies</h2>
        <button
          className="filter-toggle btn btn-outline-primary mb-3"
          onClick={() => setShowNextUpFilter(!showNextUpFilter)}
        >
          {showNextUpFilter ? 'Hide Filter' : 'Filter'}
        </button>
        {showNextUpFilter && (
          <div className="filter-options">
            {/* List of Next Up movies with checkboxes */}
            {nextUpMovies.map((movie: any) => (
              <div key={movie._id} className="filter-item d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={nextUpSelections.includes(movie._id)}
                  onChange={() => handleCheckboxChange(movie._id, setNextUpSelections)}
                  className="me-2"
                />
                <label>{movie.title}</label>
              </div>
            ))}
            <button
              className="apply-button btn btn-outline-primary"
              onClick={() =>
                handleApply(nextUpSelections, setAppliedNextUpSelections, setShowNextUpFilter)
              }
            >
              Apply
            </button>
          </div>
        )}
        <div className="movie-grid row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
          {/* Display Next Up movies based on applied selections */}
          {nextUpMovies
            .filter(
              (movie: any) =>
                appliedNextUpSelections.length === 0 || appliedNextUpSelections.includes(movie._id)
            )
            .map((movie: any) => (
              <div key={movie._id} className="col">
                <div className="card shadow-sm border-0">
                  <img
                    src={movie.posterPath || ''}
                    alt={movie.title}
                    className="card-img-top"
                    style={{ borderRadius: '8px' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">{movie.overview}</p>
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
            ))}
        </div>
      </div>

      {/* Seen It Movies Section */}
      <div className="list-section seen-it mt-5">
        <h2 className="mb-4">Seen It Movies</h2>
        <button
          className="filter-toggle btn btn-outline-primary mb-3"
          onClick={() => setShowSeenItFilter(!showSeenItFilter)}
        >
          {showSeenItFilter ? 'Hide Filter' : 'Filter'}
        </button>
        {showSeenItFilter && (
          <div className="filter-options">
            {/* List of Seen It movies with checkboxes */}
            {seenItMovies.map((movie: any) => (
              <div key={movie._id} className="filter-item d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={seenItSelections.includes(movie._id)}
                  onChange={() => handleCheckboxChange(movie._id, setSeenItSelections)}
                  className="me-2"
                />
                <label>{movie.title}</label>
              </div>
            ))}
            <button
              className="apply-button btn btn-outline-primary"
              onClick={() =>
                handleApply(seenItSelections, setAppliedSeenItSelections, setShowSeenItFilter)
              }
            >
              Apply
            </button>
          </div>
        )}
        <div className="movie-grid row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
          {/* Display Seen It movies based on applied selections */}
          {seenItMovies
            .filter(
              (movie: any) =>
                appliedSeenItSelections.length === 0 || appliedSeenItSelections.includes(movie._id)
            )
            .map((movie: any) => (
              <div key={movie._id} className="col">
                <div className="card shadow-sm border-0">
                  <img
                    src={movie.posterPath || ''}
                    alt={movie.title}
                    className="card-img-top"
                    style={{ borderRadius: '8px' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">{movie.overview}</p>
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListsNextSeen;
