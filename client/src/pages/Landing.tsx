// import React from 'react';
import poster from "../assets/bananaFlix.jpg";
import './Landing.css';

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
