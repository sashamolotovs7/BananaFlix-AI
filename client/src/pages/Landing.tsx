// import React from 'react';
import { useEffect } from "react";
import poster from "../assets/bananaFlix.jpg";
import './Landing.css';
import Auth from "../utils/auth";

// interface LandingProps {
//     setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
//     setActiveTab: React.Dispatch<React.SetStateAction<string>>;
// }

const Landing = ({
    setShowModal,
    setActiveTab
}: {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
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
                <h2>Watch a movie, eat a banana</h2>
                <p>Sign up to search for your favorite movies and TV shows!</p>
                <div className="button-container">
                    <button
                        className="land-btn"
                        onClick={() => {
                            console.log("Login button clicked!");
                            setActiveTab("login");
                            setShowModal(true)
                        }}>
                        Login
                    </button>
                    <button
                        className="land-btn"
                        onClick={() => {
                            console.log("Sign Up button clicked!");
                            setActiveTab("signup");
                            setShowModal(true);
                        }}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;

