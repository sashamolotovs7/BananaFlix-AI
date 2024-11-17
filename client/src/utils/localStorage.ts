// localStorage.ts

// Functions for Next Up movies
export const getNextUpMovieIds = (): string[] => {
    const nextUpMovieIds = localStorage.getItem('next_up_movies');
    return nextUpMovieIds ? JSON.parse(nextUpMovieIds) : [];
  };
  
  export const saveNextUpMovieIds = (movieIdArr: string[]): void => {
    if (movieIdArr.length) {
      localStorage.setItem('next_up_movies', JSON.stringify(movieIdArr));
    } else {
      localStorage.removeItem('next_up_movies');
    }
  };
  
  export const removeNextUpMovieId = (movieId: string): boolean => {
    const nextUpMovieIds = getNextUpMovieIds();
    if (!nextUpMovieIds.includes(movieId)) return false;
  
    const updatedNextUpMovieIds = nextUpMovieIds.filter(id => id !== movieId);
    saveNextUpMovieIds(updatedNextUpMovieIds);
    return true;
  };
  
  // Functions for Seen It movies
  export const getSeenItMovieIds = (): string[] => {
    const seenItMovieIds = localStorage.getItem('seen_it_movies');
    return seenItMovieIds ? JSON.parse(seenItMovieIds) : [];
  };
  
  export const saveSeenItMovieIds = (movieIdArr: string[]): void => {
    if (movieIdArr.length) {
      localStorage.setItem('seen_it_movies', JSON.stringify(movieIdArr));
    } else {
      localStorage.removeItem('seen_it_movies');
    }
  };
  
  export const removeSeenItMovieId = (movieId: string): boolean => {
    const seenItMovieIds = getSeenItMovieIds();
    if (!seenItMovieIds.includes(movieId)) return false;
  
    const updatedSeenItMovieIds = seenItMovieIds.filter(id => id !== movieId);
    saveSeenItMovieIds(updatedSeenItMovieIds);
    return true;
  };
  