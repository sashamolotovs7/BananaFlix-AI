import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Landing from './pages/Landing';
import Trending from './pages/Trending';
// import SignupForm from './components/SignupForm'
// import LoginForm from './components/LoginForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Landing />
      }, 
      {
        path: '/trending',
        element: <Trending />
      },
      // {
      //   path: '/signup',
      //   element: <SignupForm handleModalClose={() =>  setShowModal(false) } />
      // },
      // {
      //   path: '/login',
      //   element: <LoginForm handleModalClose={() => { /* handle modal close logic */ }} />
      // }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
