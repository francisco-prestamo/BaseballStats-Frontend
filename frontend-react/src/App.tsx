import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Navbar from "./components/common/Navbar";
import Home from './pages/common/Home';
import Profile from './pages/users/all/Profile.tsx';
import PrivateRoute from './components/common/PrivateRoute';

import './App.css';

const App: React.FC = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar toggleTheme={toggleTheme} theme={theme} />
                    <div className="container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;