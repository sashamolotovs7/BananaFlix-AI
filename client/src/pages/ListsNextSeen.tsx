import { useQuery } from '@apollo/client';
import { GET_USER_MOVIE_LISTS } from '../utils/mutations';
import './ListsNextSeen.css';

const ListsNextSeen: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_MOVIE_LISTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading movie lists: {error.message}</p>;

  const { nextUpMovies, seenItMovies } = data?.me || { nextUpMovies: [], seenItMovies: [] };

  return (
    <div className="lists-next-seen">
      <div className="list-section">
        <h2>Next Up Movies</h2>
        <div className="movie-grid">
          {nextUpMovies.length > 0 ? (
            nextUpMovies.map((movie: any) => (
              <div key={movie._id} className="movie-card">
                <img src={movie.posterPath || ''} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <p>Release Date: {movie.releaseDate}</p>
                <p>Rating: {movie.voteAverage?.toFixed(1)}/10</p>
              </div>
            ))
          ) : (
            <p>No movies added to Next Up yet.</p>
          )}
        </div>
      </div>

      <div className="list-section">
        <h2>Seen It Movies</h2>
        <div className="movie-grid">
          {seenItMovies.length > 0 ? (
            seenItMovies.map((movie: any) => (
              <div key={movie._id} className="movie-card">
                <img src={movie.posterPath || ''} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <p>Release Date: {movie.releaseDate}</p>
                <p>Rating: {movie.voteAverage?.toFixed(1)}/10</p>
              </div>
            ))
          ) : (
            <p>No movies marked as Seen It yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListsNextSeen;
