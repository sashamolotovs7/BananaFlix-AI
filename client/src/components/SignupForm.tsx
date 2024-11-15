import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// import { createUser } from '../utils/API'; // no longer needed
import Auth from '../utils/auth';
// import  User from '../../../server/src/models/User.js'; // change to import the apollo model? - not needed

// imported useMutation hook
import { useMutation } from '@apollo/client';
// imported mutation
import { ADD_USER } from '../utils/mutations';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const SignupForm = ({}: { handleModalClose: () => void }) => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: ''}); // remove savedBooks
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  // set up useMutation hook
  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    console.log('Attempting to add user with data:', userFormData);
    const { data } = await addUser({
      variables: { 
        input: {
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password
        } 
      },
    });
    console.log('Response from addUser mutation:', data);

    // enhanced login check
    if (data && data.addUser && data.addUser.token) {
      Auth.login(data.addUser.token);
      console.log('Sign up successful');
    } else {
      console.error('Unexpected response structure:', data);
      setShowAlert(true);
    }

    // enhanced error handling
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      if ('graphQLErrors' in err) {
        console.error('GraphQL Errors:', err.graphQLErrors);
      }
      if ('networkError' in err && err.networkError) {
        console.error('Network error details:', err.networkError);
      }
    }
    setShowAlert(true);
  }
  
  // reset form state
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>

    </>
  );
};

export default SignupForm;
