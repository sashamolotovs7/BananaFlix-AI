import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import { authenticateToken } from './services/auth.js';
import { OpenAI } from 'openai';

dotenv.config();

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import type { Request, Response } from 'express';

import cors from 'cors';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//import key
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Create a new Apollo Server instance with our schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo Server and set up Express
const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();
  // Connect to the database
  await db();

  // Set up the port for the server
  const PORT = process.env.PORT || 3001;
  // Create an Express application
  const app = express();

  // Middleware to parse URL-encoded bodies
  app.use(express.urlencoded({ extended: false }));
  // Middleware to parse JSON bodies
  app.use(express.json());

  // Set up the GraphQL endpoint with authentication
  app.use(
    '/graphql',
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  //connect port 3000 to 3001
  app.use(cors());

  // OpenAI Assistant Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
  
    try {
      // Step 1: Create an Assistant (if dynamic creation is required)
      const assistant = await openai.beta.assistants.create({
        model: 'gpt-3.5-turbo',
        instructions: 'You are a helpful assistant for my website. The website is Banana themed, where users can log in , search for movies, save movies to watch lists, and review movies. You are there to help users find good movies and tv shows. You can be light hearted and funny. Insert banana puns whenever possible',
        name: 'MovieBot',
      });
      console.log('Assistant created:', assistant.id);
  
      // Step 2: Create a Thread
      const thread = await openai.beta.threads.create();
      console.log('Thread created:', thread.id);
  
      // Step 3: Add User Message to the Thread
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message,
      });
  
      // Step 4: Run the Assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });
      console.log('Assistant run created:', run.id);

      // Step 5: Poll the Run Status and Retrieve Responses
      let runStatus = run.status;
      let maxAttempts = 10; // Limit polling attempts to avoid infinite loop
      let attempt = 0;
  
      while ((runStatus === 'queued' || runStatus === 'in_progress') && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second between polls
        const updatedRun = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        runStatus = updatedRun.status;
        attempt++;
      }
  
      if (runStatus === 'completed') {
        // Fetch messages from the thread
        const messages = await openai.beta.threads.messages.list(thread.id);
        console.log('Messages retrieved:', messages.data);
        // hell of a path to get to the string from response object
        const botResponse = messages.data[0]?.content.find((msg) => msg.type === 'text')?.text?.value || 'No response received.';
        console.log('Bot response:', botResponse);
        return res.json({ response: botResponse });
      }
  
      // If the run status is not completed within the polling attempts
      return res.status(500).json({ error: 'Assistant run did not complete in time.' });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return res.status(500).json({ error: 'Error communicating with OpenAI.' });
    }
  });
  

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Serve the React app for any unmatched routes
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`🌍 Movie app is running on port ${PORT}!`);
    console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    console.log(`🤖 Assistant endpoint available at http://localhost:${PORT}/api/chat`);
  });
};

// Call the function to start the server
startApolloServer();
