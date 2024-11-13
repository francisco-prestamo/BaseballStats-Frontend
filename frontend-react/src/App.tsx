import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Navbar from "./components/common/Navbar";
import Home from './pages/common/Home';
import Profile from './pages/users/all/Profile.tsx';
import PrivateRoute from './components/common/PrivateRoute';
import SeasonsPage from "./pages/users/all/SeasonsPage";
import SeasonDetailPage from "./pages/users/all/SeasonDetailsPage";
import SerieDetailPage from "./pages/users/all/SerieDetailPage";
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
                                path="/seasons"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <SeasonsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/seasons/:seasonId"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <SeasonDetailPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/series/:seasonId/:serieId"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <SerieDetailPage />
                                    </PrivateRoute>
                                }
                            />
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