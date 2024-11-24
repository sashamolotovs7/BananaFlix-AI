import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import { authenticateToken } from './services/auth.js';
import { OpenAI } from 'openai';
import Movie from './models/Movie.js';
import db from './config/connection.js';
import cors from 'cors';
import type { Request, Response } from 'express';

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import OpenAI API key
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs: await import('./schemas/index.js').then((m) => m.typeDefs),
  resolvers: await import('./schemas/index.js').then((m) => m.resolvers),
});

// Function to start the Apollo Server and set up Express
const startApolloServer = async () => {
  await server.start();
  await db(); // Connect to database

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());

  app.use(
    '/graphql',
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // Route to save a movie to "Next Up"
  app.post('/api/movies/next-up', async (req: Request, res: Response) => {
    const movieData = req.body;
    if (!movieData.movieId) {
      return res.status(400).json({ error: 'Movie ID is required.' });
    }

    try {
      let movie = await Movie.findOne({ movieId: movieData.movieId });
      if (!movie) {
        movie = await Movie.create(movieData);
      }
      return res.status(201).json({ message: 'Movie added to Next Up', movie });
    } catch (error) {
      console.error('Error saving movie to Next Up:', error);
      return res.status(500).json({ error: 'Failed to save movie to Next Up.' });
    }
  });

  // Route to save a movie to "Seen It"
  app.post('/api/movies/seen-it', async (req: Request, res: Response) => {
    const movieData = req.body;
    if (!movieData.movieId) {
      return res.status(400).json({ error: 'Movie ID is required.' });
    }

    try {
      let movie = await Movie.findOne({ movieId: movieData.movieId });
      if (!movie) {
        movie = await Movie.create(movieData);
      }
      return res.status(201).json({ message: 'Movie added to Seen It', movie });
    } catch (error) {
      console.error('Error saving movie to Seen It:', error);
      return res.status(500).json({ error: 'Failed to save movie to Seen It.' });
    }
  });

  // OpenAI Assistant Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    try {
      const assistant = await openai.beta.assistants.create({
        model: 'gpt-3.5-turbo',
        instructions:
          'You are a helpful assistant for a banana-themed movie website. Use banana puns where possible.',
        name: 'MovieBot',
      });
      console.log('Assistant created:', assistant.id);

      const thread = await openai.beta.threads.create();
      console.log('Thread created:', thread.id);

      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });
      console.log('Assistant run created:', run.id);

      let runStatus = run.status;
      let attempt = 0;

      while ((runStatus === 'queued' || runStatus === 'in_progress') && attempt < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        runStatus = updatedRun.status;
        attempt++;
      }

      if (runStatus === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        const botResponse =
          messages.data[0]?.content.find((msg) => msg.type === 'text')?.text?.value ||
          'No response received.';
        return res.json({ response: botResponse });
      }

      return res.status(500).json({ error: 'Assistant run did not complete in time.' });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return res.status(500).json({ error: 'Error communicating with OpenAI.' });
    }
  });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Movie app is running on port ${PORT}!`);
    console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
