// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../context/UserContext'; // Import UserContext
import './Navbar.css'; // Import the new CSS file for Navbar styles

const Navbar = () => {
    const { user, setUser } = useContext(UserContext); // Access user from context
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        setUser(null); // Clear user context
        localStorage.removeItem('token'); // Clear token from local storage
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li><Link to="/home" className="navbar-link">Home</Link></li>
                <li><Link to="/employees" className="navbar-link">Employee List</Link></li>
            </ul>
            <div className="navbar-user">
                {user ? (
                    <>
                        <span className="navbar-username">{user.username}</span> {/* Display username */}
                        <button onClick={handleLogout} className="navbar-logout">
                            Logout
                        </button>
                    </>
                ) : null}
            </div>
        </nav>
    );
};

export default Navbar;
