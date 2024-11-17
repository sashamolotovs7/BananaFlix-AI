import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server';
import { signToken } from '../services/auth.js';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  movieCount: number;
}


interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError('Could not find user');
      return await User.findOne({ _id: context.user._id });
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

    login: async (_: any, { email, password }: any) => {
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

    saveMovie: async (_: any, { input }: any, context: any) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedMovies: input } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          throw new AuthenticationError('Failed to save the book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeMovie: async (_: any, { movieId }: { movieId: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedMovies: { movieId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new AuthenticationError("Couldn't find user with this id!");
        }

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    markAsNextUp: async (_: any, { movieId }: { movieId: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { nextUpMovies: movieId } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    markAsSeen: async (_: any, { movieId }: { movieId: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { seenMovies: movieId } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    rateMovie: async (_: any, { movieId, rating }: { movieId: string; rating: number }, context: Context) => {
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

        // If rating does not exist, add a new rating entry
        if (!updatedUser) {
          throw new Error("Couldn't update the rating");
        }

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
