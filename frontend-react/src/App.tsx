import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Navbar from "./components/common/Navbar.tsx";
import Home from './pages/common/Home';
import Profile from './pages/users/Profile';
import PrivateRoute from './components/common/PrivateRoute';

import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
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