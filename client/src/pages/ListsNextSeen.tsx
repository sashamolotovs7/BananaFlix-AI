import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MOVIE_LISTS, REMOVE_MOVIE } from '../utils/mutations';
import './ListsNextSeen.css';

const ListsNextSeen: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER_MOVIE_LISTS);
  const [removeMovie] = useMutation(REMOVE_MOVIE);

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
    console.log(`Applied selections:`, selections);
  };

  const handleDeleteSelected = async (listType: 'nextUp' | 'seenIt') => {
    const selections = listType === 'nextUp' ? nextUpSelections : seenItSelections;

    try {
      for (const movieId of selections) {
        const { data } = await removeMovie({ variables: { movieId } });
        // Here you might want to check if the movie was actually removed from the list
        if (!data?.removeMovie) {
          throw new Error(`Failed to remove movie with id ${movieId}`);
        }
      }
      // Clear the local selections after deletion
      if (listType === 'nextUp') {
        setNextUpSelections([]);
        setAppliedNextUpSelections([]);
      } else {
        setSeenItSelections([]);
        setAppliedSeenItSelections([]);
      }
      console.log(`Movies successfully removed from ${listType} list.`);
      // Refetch data to update the list
      await refetch();
    } catch (error) {
      console.error(`Error deleting movies from ${listType}:`, error);
      alert(`Failed to delete movies from ${listType} list. Please try again.`);
    }
  };

  return (
    <div className="lists-next-seen">
      {/* Next Up Movies Section */}
      <div className="list-section">
        <h2>Next Up Movies</h2>
        <button
          className="filter-toggle"
          onClick={() => setShowNextUpFilter(!showNextUpFilter)}
        >
          {showNextUpFilter ? 'Hide Filter' : 'Filter'}
        </button>
        {showNextUpFilter && (
          <div className="filter-options">
            {/* List of Next Up movies with checkboxes */}
            {nextUpMovies.map((movie: any) => (
              <div key={movie._id} className="filter-item">
                <label>
                  <input
                    type="checkbox"
                    checked={nextUpSelections.includes(movie._id)}
                    onChange={() => handleCheckboxChange(movie._id, setNextUpSelections)}
                  />
                  {movie.title || 'Untitled'}
                </label>
              </div>
            ))}
            <button
              className="apply-button"
              onClick={() =>
                handleApply(nextUpSelections, setAppliedNextUpSelections, setShowNextUpFilter)
              }
            >
              Apply
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteSelected('nextUp')}
            >
              Delete
            </button>
          </div>
        )}
        <div className="movie-grid">
          {/* Display Next Up movies based on applied selections */}
          {nextUpMovies
            .filter(
              (movie: any) =>
                appliedNextUpSelections.length === 0 || appliedNextUpSelections.includes(movie._id)
            )
            .map((movie: any) => (
              <div key={movie._id} className="movie-card">
                <img src={movie.posterPath || ''} alt={movie.title || 'Untitled'} />
                <h3>{movie.title || 'Untitled'}</h3>
                <p>{movie.overview}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Seen It Movies Section */}
      <div className="list-section seen-it">
        <h2>Seen It Movies</h2>
        <button
          className="filter-toggle"
          onClick={() => setShowSeenItFilter(!showSeenItFilter)}
        >
          {showSeenItFilter ? 'Hide Filter' : 'Filter'}
        </button>
        {showSeenItFilter && (
          <div className="filter-options">
            {/* List of Seen It movies with checkboxes */}
            {seenItMovies.map((movie: any) => (
              <div key={movie._id} className="filter-item">
                <label>
                  <input
                    type="checkbox"
                    checked={seenItSelections.includes(movie._id)}
                    onChange={() => handleCheckboxChange(movie._id, setSeenItSelections)}
                  />
                  {movie.title || 'Untitled'}
                </label>
              </div>
            ))}
            <button
              className="apply-button"
              onClick={() =>
                handleApply(seenItSelections, setAppliedSeenItSelections, setShowSeenItFilter)
              }
            >
              Apply
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteSelected('seenIt')}
            >
              Delete
            </button>
          </div>
        )}
        <div className="movie-grid">
          {/* Display Seen It movies based on applied selections */}
          {seenItMovies
            .filter(
              (movie: any) =>
                appliedSeenItSelections.length === 0 || appliedSeenItSelections.includes(movie._id)
            )
            .map((movie: any) => (
              <div key={movie._id} className="movie-card">
                <img src={movie.posterPath || ''} alt={movie.title || 'Untitled'} />
                <h3>{movie.title || 'Untitled'}</h3>
                <p>{movie.overview}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListsNextSeen;