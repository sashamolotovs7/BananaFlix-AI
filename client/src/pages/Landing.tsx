// import React from 'react';
import { useEffect } from "react";
import poster from "../assets/bananaFlix.jpg";
import './Landing.css';
import Auth from "../utils/auth";

// interface LandingProps {
//     setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
//     setActiveTab: React.Dispatch<React.SetStateAction<string>>;
// }

// Landing component
const Landing = ({
    // Props for the Landing component - needed for the modal
    setShowModal, // Function to set the state of the modal visibility
    setActiveTab // Function to set the active tab in the modal
}: {
    // Type definitions for typescript
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>; // set the state of a boolean value
    setActiveTab: React.Dispatch<React.SetStateAction<string>>; // set the state of a string value
}) => {
    // Redirect if user is already logged in
    useEffect(() => {
      if (Auth.loggedIn()) {
        window.location.href = "/trending";
      }
    }, []);
    
    return (
        <div className="container1">
            <img className="poster" src={poster} alt="banana-poster" />
            <div className="content">
                <h1>BananaFlix</h1>
                <h2>Peel back the layers of great cinema!</h2>
                <p>Sign up to search for your favorite movies and TV shows!</p>
                <div className="button-container">
                    <button
                        className="land-btn"
                        onClick={() => {
                            console.log("Login button clicked!"); //check for click
                            setActiveTab("login"); // Set the active tab to login
                            setShowModal(true); // Show the modal for login
                        }}>
                        Login
                    </button>
                    <button
                        className="land-btn"
                        onClick={() => {
                            console.log("Sign Up button clicked!"); //check for click
                            setActiveTab("signup"); // Set the active tab to signup
                            setShowModal(true); // Show the modal for signup
                        }}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;

