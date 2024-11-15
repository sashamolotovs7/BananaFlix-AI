<<<<<<< HEAD
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Secret key for JWT; use environment variable for security
const secretKey = process.env.JWT_SECRET || 'defaultSecret';

const resolvers = {
  Query: {
    // Resolver for fetching the current user's profile information
    me: async (_: unknown, __: unknown, { user }: { user: any }) => {
      if (!user) {
        console.error('Authentication error: User is not logged in.');
        throw new Error('You need to be logged in!');
      }
      try {
        const foundUser = await User.findById(user.id);
        if (!foundUser) {
          console.error('User not found in database.');
          throw new Error('User not found');
        }
        return foundUser;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user information.');
      }
    },
  },
  Mutation: {
    // Resolver for logging in a user
    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      try {
        console.log('Attempting login for email:', email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          console.error('Login error: User not found with email:', email);
          throw new Error('Invalid email or password');
        }

        // Check if the password matches
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.error('Login error: Incorrect password for email:', email);
          throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
          expiresIn: '1h',
        });

        console.log('Login successful for email:', email);
        return { token, user };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during login:', error.message);
        } else {
          console.error('Unknown error during login:', error);
        }
        throw new Error('Failed to login');
      }
    },
    
    // Resolver for registering a new user
    addUser: async (
      _: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      try {
        console.log('Attempting to add user with email:', email);
        
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.error('Registration error: Email already in use:', email);
          throw new Error('Email is already in use');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        // Generate JWT token for the new user
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, secretKey, {
          expiresIn: '1h',
        });

        console.log('User registration successful for email:', email);
        return { token, user: newUser };
      } catch (error) {
        console.error('Error during user registration:', error);
        throw new Error('Failed to add user');
      }
    },
    
    // Resolver for saving a book to the user's profile
    saveBook: async (_: unknown, { book }: { book: any }, { user }: { user: any }) => {
      if (!user) {
        console.error('Authentication error: User must be logged in to save a book.');
        throw new Error('You need to be logged in!');
      }
      console.log('User trying to save book:', user.id);
      console.log('Book data received:', book);
      
      try {
        console.log('Attempting to save book for user:', user.id);
        
        // Update user with new book in savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { $addToSet: { savedBooks: book } }, // `addToSet` ensures the book is not duplicated
          { new: true } // `new: true` ensures we get the updated document
        );

        if (!updatedUser) {
          console.error('Failed to save book: User not found:', user.id);
          throw new Error('User not found');
        }

        console.log('Book saved successfully for user:', user.id);
        return updatedUser;
      } catch (error) {
        console.error('Error saving book:', error);
        throw new Error('Failed to save book');
      }
    },
    
    // Resolver for deleting a book from the user's saved books
    deleteBook: async (_: unknown, { bookId }: { bookId: string }, { user }: { user: any }) => {
      if (!user) {
        console.error('Authentication error: User must be logged in to delete a book.');
        throw new Error('You need to be logged in!');
      }

      try {
        console.log('Attempting to delete book with ID:', bookId, 'for user:', user.id);
        
        // Update user by removing the book with the specified bookId
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          console.error('Failed to delete book: User not found:', user.id);
          throw new Error('User not found');
        }

        console.log('Book deleted successfully for user:', user.id);
        return updatedUser;
      } catch (error) {
        console.error('Error deleting book:', error);
        throw new Error('Failed to delete book');
      }
    },
=======
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
>>>>>>> main
  },
};

export default resolvers;
