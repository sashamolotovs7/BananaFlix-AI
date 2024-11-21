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
    movieId: {
        type: String,
        required: true,
        unique: true
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

const Movie = model<MovieDocument>('Movie', movieSchema);

export default Movie;
