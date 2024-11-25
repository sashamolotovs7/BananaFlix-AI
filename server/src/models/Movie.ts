import { Schema, model, type Document } from 'mongoose';

export interface MovieDocument extends Document {
  movieId: string;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  category: string; // Either 'next-up' or 'seen-it'
}

const movieSchema = new Schema<MovieDocument>(
  {
    movieId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
    },
    posterPath: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
    category: {
      type: String,
      enum: ['next-up', 'seen-it'],
      required: true,
    },
  },
  {
    timestamps: true, // This adds 'createdAt' and 'updatedAt' fields automatically
  }
);

const Movie = model<MovieDocument>('Movie', movieSchema);

export default Movie;
