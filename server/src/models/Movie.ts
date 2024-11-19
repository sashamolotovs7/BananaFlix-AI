import { Schema, model, type Document } from 'mongoose';

export interface MovieDocument extends Document {
    movieId: string;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: Number;
}

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const movieSchema = new Schema<MovieDocument>({
    // saved book id from GoogleBooks
    movieId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    overview:
    {
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


});

// we want model type, not just the schema
const Movie = model<MovieDocument>('Movie', movieSchema);

export default Movie;
