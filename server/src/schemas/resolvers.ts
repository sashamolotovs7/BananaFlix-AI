// Updated resolvers.ts with fixes for Node16 moduleResolution
import User from '../models/User.js';  // Added '.js' for Node16 module resolution
import { AuthenticationError, signToken } from '../services/auth.js';  // Added '.js'
import Movie from '../models/Movie.js';  // Added '.js'
import { Types } from 'mongoose';

// Define the context type for your resolvers
interface ResolverContext {
  user?: {
    _id: string;
    username: string;
    email: string;
    password: string;
    movieCount: number;
  };
}

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const resolvers = {
  Query: {
    me: async (_: unknown, { filter }: { filter?: { type: string } }, context: ResolverContext) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');

      const filters = filter ? { /* Add filtering logic if needed */ } : {};
      return await User.findOne({ _id: context.user._id })
        .populate({ path: 'nextUpMovies', match: filters })
        .populate({ path: 'seenItMovies', match: filters });
    },
    trendingMovies: async () => {
      const response = await fetch(
        `${BASE_URL}/trending/movie/day?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
          },
        }
      );
      const { results } = await response.json();

      return results.map((movie: any) => ({
        adult: movie.adult,
        backdropPath: movie.backdrop_path,
        genreIds: movie.genre_ids,
        id: movie.id,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        title: movie.title,
        video: movie.video,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        mediaType: movie.media_type,
      }));
    },

    trendingTVShows: async () => {
      const response = await fetch(
        `${BASE_URL}/trending/tv/day?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
          },
        }
      );
      const { results } = await response.json();

      return results.map((show: any) => ({
        adult: show.adult,
        backdropPath: show.backdrop_path,
        genreIds: show.genre_ids,
        id: show.id,
        originalLanguage: show.original_language,
        originalName: show.original_name,
        overview: show.overview,
        popularity: show.popularity,
        posterPath: show.poster_path,
        firstAirDate: show.first_air_date,
        name: show.name,
        voteAverage: show.vote_average,
        voteCount: show.vote_count,
        mediaType: show.media_type,
      }));
    },
  },

  Mutation: {
    addUser: async (
      _: unknown,
      { input }: { input: { username: string; email: string; password: string } }
    ) => {
      const user = await User.create(input);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_: unknown, { email, password }: any) => {
      const user = await User.findOne({ $or: [{ username: email }, { email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user.username, email, user._id);
      return { token, user };
    },

    async removeMovie(_: unknown, { movieId }: { movieId: string }, context: ResolverContext) {
      if (!context.user) throw new AuthenticationError('You must be logged in!');

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { 
          $pull: { 
            nextUpMovies: new Types.ObjectId(movieId), 
            seenItMovies: new Types.ObjectId(movieId) 
          } 
        },
        { new: true }
      ).populate('nextUpMovies seenItMovies');

      if (!updatedUser) {
        throw new Error("Couldn't remove movie");
      }

      // Remove the movie from the database if it's no longer referenced by any user
      const movieInUse = await User.findOne({ 
        $or: [
          { nextUpMovies: { $in: [new Types.ObjectId(movieId)] } },
          { seenItMovies: { $in: [new Types.ObjectId(movieId)] } }
        ]
      });
      
      if (!movieInUse) {
        await Movie.findByIdAndDelete(movieId);
      }

      return updatedUser;
    },

    rateMovie: async (_: unknown, { movieId, rating }: { movieId: string; rating: number }, context: ResolverContext) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $set: {
              'movieRatings.$[elem].rating': rating,
            },
          },
          {
            arrayFilters: [{ 'elem.movieId': movieId }],
            new: true,
          }
        );

        if (!updatedUser) {
          throw new Error("Couldn't update the rating");
        }

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    async saveNextUpMovie(_: unknown, { input }: { input: { 
      movieId: string; 
      title: string; 
      overview: string; 
      posterPath: string; 
      releaseDate: string; 
      voteAverage: number 
    } }, context: ResolverContext) {
      if (!context.user) throw new AuthenticationError('You must be logged in.');

      let movie = await Movie.findOne({ movieId: input.movieId });
      if (!movie) {
        movie = await Movie.create(input);
      }

      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { nextUpMovies: movie._id } },
        { new: true }
      ).populate('nextUpMovies');

      return user;
    },

    async saveSeenItMovie(_: unknown, { input }: { input: { 
      movieId: string; 
      title: string; 
      overview: string; 
      posterPath: string; 
      releaseDate: string; 
      voteAverage: number 
    } }, context: ResolverContext) {
      if (!context.user) throw new AuthenticationError('You must be logged in.');

      let movie = await Movie.findOne({ movieId: input.movieId });
      if (!movie) {
        movie = await Movie.create(input);
      }

      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { seenItMovies: movie._id } },
        { new: true }
      ).populate('seenItMovies');

      return user;
    },

    async saveNextUpTrending(
      _: unknown, 
      { input }: { input: { 
        movieId: string; 
        title: string; 
        overview: string; 
        posterPath: string; 
        releaseDate: string; 
        voteAverage: number; 
        mediaType: string 
      } }, 
      context: ResolverContext
    ) {
      if (!context.user) throw new AuthenticationError('You must be logged in.');

      let movie = await Movie.findOne({ movieId: input.movieId });
      if (!movie) {
        movie = await Movie.create(input);
      }

      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { nextUpMovies: movie._id } },
        { new: true }
      ).populate('nextUpMovies');

      return user;
    },

    async saveSeenItTrending(
      _: unknown, 
      { input }: { input: { 
        movieId: string; 
        title: string; 
        overview: string; 
        posterPath: string; 
        releaseDate: string; 
        voteAverage: number; 
        mediaType: string 
      } }, 
      context: ResolverContext
    ) {
      if (!context.user) throw new AuthenticationError('You must be logged in.');

      let movie = await Movie.findOne({ movieId: input.movieId });
      if (!movie) {
        movie = await Movie.create(input);
      }

      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { seenItMovies: movie._id } },
        { new: true }
      ).populate('seenItMovies');

      return user;
    }    
  },
};

export default resolvers;
