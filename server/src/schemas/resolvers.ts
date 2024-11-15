import { User} from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

// interface UserArgs {
//   username: string;
// }

// interface BookArgs {
//   bookId: string;
// }

// interface AddBookArgs {
//   input: {
//     bookId: string;
//     authors: string[];
//     description: string;
//     title: string;
//     image: string;
//     link: string;
//   }
// }

const resolvers = {
  Query: {
    // Future development
    // ----------------------------------------------------------
    // users: async () => {
    //   return User.find().populate('books');
    // },
    // user: async (_parent: any, { username }: UserArgs) => {
    //   return User.findOne({ username }).populate('books');
    // },
    // books: async () => {
    //   return await Book.find().sort({ createdAt: -1 });
    // },
    // book: async (_parent: any, { bookId }: BookArgs) => {
    //   return await Book.findOne({ _id: bookId });
    // },
    // ----------------------------------------------------------
    me: async (_parent: any, _args: any, context: any) => {
      // console.log('Context:', context);
      console.log('User:', context.user);

      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // saveBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
    //   if (context.user) {
    //     console.log('Received book data:', input); // log

    //     try {
    //       // Create the book
    //       const book = await Book.create(input);
    //       console.log('Created book:', book); // log

    //       // Update the user and add the book to their savedBooks
    //       const updatedUser = await User.findByIdAndUpdate(
    //         context.user._id,
    //         { $addToSet: { savedBooks: book._id } },
    //         { new: true, runValidators: true }
    //       ).populate('savedBooks');

    //       console.log('Updated user:', updatedUser); // log

    //       if (!updatedUser) {
    //         throw new Error('User not found');
    //       }

    //       // Return the newly created book, not the user
    //       return book;
    //     } catch (error) {
    //       console.error('Error in saveBook mutation:', error);
    //       throw new Error('Failed to save the book');
    //     }
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },

    // removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
    //   if (context.user) {
    //     try {
    //       // Find the book by bookId, not _id
    //       const book = await Book.findOneAndDelete({ bookId: bookId });

    //       if (!book) {
    //         throw new Error('No book found with this ID.');
    //       }

    //       // Remove the book from the user's savedBooks
    //       const updatedUser = await User.findByIdAndUpdate(
    //         context.user._id,
    //         { $pull: { savedBooks: book._id } },
    //         { new: true }
    //       ).populate('savedBooks');

    //       if (!updatedUser) {
    //         throw new Error('User not found');
    //       }

    //       console.log('Book removed:', book);
    //       console.log('Updated user:', updatedUser);

    //       return book; // Return the book that was removed
    //     } catch (error) {
    //       console.error('Error in removeBook mutation:', error);
    //       throw new Error('Failed to remove the book');
    //     }
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
  },
};

export default resolvers;
