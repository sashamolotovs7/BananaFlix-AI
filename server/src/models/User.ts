// server/src/models/User.ts
import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose'; // You still need this for Types.ObjectId

export type MovieRef = { type: Types.ObjectId; ref: 'Movie' };

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  isCorrectPassword: (password: string) => Promise<boolean>;
  nextUpMovies: MovieRef[];
  seenItMovies: MovieRef[];
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    nextUpMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }], 
    seenItMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = model<UserDocument>('User', userSchema);

export default User;