export const searchMovies = (apiKey: string, query: string) => {
    return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
  };