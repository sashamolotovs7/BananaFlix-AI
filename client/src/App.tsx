import { useState } from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/NavBar';
import Landing from './pages/Landing';
import SearchMovies from './pages/SearchMovies';
import Trending from './pages/Trending';
// import Saved from './pages/Saved';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('login'); // State to manage active tab

  return (
    <ApolloProvider client={client}>
      <>
        {/* Pass activeTab and setActiveTab to Navbar */}
        {/* This is needed for the Modal to be shared between files */}
        <Navbar
          showModal={showModal}
          setShowModal={setShowModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Defined specific Routes and remove the explicit Outlet (for modal element)*/}
        <Routes>
          {/* Landing page route */}
          <Route
            path="/"
            element={
              <Landing setShowModal={setShowModal} setActiveTab={setActiveTab} />
            }
          />
          {/* Other routes */}
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/trending" element={<Trending />} />
          {/* <Route path="/saved" element={<Saved />} /> */}
        </Routes>
      </>
    </ApolloProvider>
  );
}


export default App;
