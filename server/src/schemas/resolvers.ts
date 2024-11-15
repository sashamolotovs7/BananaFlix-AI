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
  },
};

export default resolvers;
