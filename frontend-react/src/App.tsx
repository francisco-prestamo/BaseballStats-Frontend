import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Navbar from './components/common/Navbar';
import Home from './pages/common/Home';
import Profile from './pages/users/all/Profile';
import PrivateRoute from './components/common/PrivateRoute';
import SeasonsPage from './pages/users/all/SeasonsPage';
import SeasonDetailPage from './pages/users/all/SeasonDetailsPage';
import SerieDetailPage from './pages/users/all/SerieDetailPage';
import GameDetailsPage from './pages/users/all/GameDetailsPage';
import SessionExpiredPage from './pages/common/SessionExpiredPage';
import LoginModal from './components/common/LoginModal';
import SeriesPage from "./pages/users/all/SeriesPage.tsx";
import AdminPage from "./pages/users/admin/AdminPage";

const App: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen transition-all bg-bg-light dark:bg-bg-dark text-text-dark dark:text-text-light">
                    <Navbar toggleTheme={toggleTheme} theme={theme} onLoginClick={toggleLoginModal} />
                    <div className="container mx-auto px-4 py-6 pt-32">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/session-expired" element={<SessionExpiredPage />} />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
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
                                path="/series"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <SeriesPage />
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
                                path="/games/:gameId/:seasonId/:serieId"
                                element={
                                    <PrivateRoute requiredUserType="allAuthenticated">
                                        <GameDetailsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/seasons"
                                element={
                                    <PrivateRoute requiredUserType="admin">
                                        <AdminPage />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                    {isLoginModalOpen && <LoginModal closeModal={toggleLoginModal} />}
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;