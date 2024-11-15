import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

// render fix ?
import { fileURLToPath } from 'url';
import { dirname } from 'path'
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// End render fix ?

// Create a new Apollo Server instance with our schema
const server = new ApolloServer({
  typeDefs,
  resolvers
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
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

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
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Call the function to start the server
startApolloServer();
