import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config';

const resolvers = {
  Mutation: {
    signup: async (_: any, { username, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

      return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token,
      };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Incorrect password');
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
      };
    }
  }
};

export default resolvers;
