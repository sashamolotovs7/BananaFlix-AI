import { Link } from "react-router-dom";
import poster from '../assets/bananaFlix.jpg';
import './Landing.css';

const Landing = () => {
    return (
        <div className='container1'>
            <img className='poster' src={poster} alt='banana-poster' />
            <div className='content'>
                <h1>BananaFlix</h1>
                <h2>Watch a movie, eat a banana</h2>
                <p>Sign up to search for your favorite movies and TV shows!</p>
                <div className='button-container'>
                    <Link to="/login">
                        <button className='land-btn'>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button className='land-btn'>Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
