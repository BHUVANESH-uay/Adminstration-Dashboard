// src/pages/Home.js
import React from 'react';
import Navbar from '../components/Navbar'; 
import Dashboard from '../components/Dashboard';
import '../components/home.css'; 


const Home = () => {
    return (
        <div>
            <Navbar />
            <Dashboard />
        </div>
    );
};

export default Home;
