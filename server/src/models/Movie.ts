import { Schema, model, type Document } from 'mongoose';

export interface MovieDocument extends Document {
    movieId: string;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: Number;
}


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
