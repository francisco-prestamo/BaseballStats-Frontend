import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { FaUser, FaMoon, FaSun, FaUserPlus } from 'react-icons/fa';

interface NavbarProps {
    toggleTheme: () => void;
    theme: string;
    onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, theme, onLoginClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated ,userType} = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleProfileClick = () => {
        setIsMenuOpen(false);
        navigate('/profile');
    };

    return (
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-20 w-4/5 max-w-6xl bg-bg-light/70 dark:bg-bg-dark/70 backdrop-blur-md rounded-xl border border-secondary/30 dark:border-primary/30 shadow-lg px-8 py-5">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl mr-12 font-bold text-primary dark:text-text-light hover:text-primary-light transition-colors"
                >
                    Icon
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center space-x-8">
                    <li>
                        <Link
                            to="/"
                            className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <>
                            <li>
                                <Link
                                    to="/reports"
                                    className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Seasons
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/seasons"
                                    className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Seasons
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/series"
                                    className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Series
                                </Link>
                            </li>
                            {userType == "admin" && (
                                <li>
                                    <Link
                                        to="/admin"
                                        className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                    >
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>

                {/* Action Buttons */}
                <div className="flex items-center space-x-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors shadow-md"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? (
                            <FaMoon className="text-xl text-primary" />
                        ) : (
                            <FaSun className="text-xl text-text-light" />
                        )}
                    </button>

                    {/* Authentication Buttons */}
                    {!isAuthenticated ? (
                        <button
                            onClick={onLoginClick}
                            className="p-3 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors shadow-md"
                            aria-label="Login"
                        >
                            <FaUserPlus className="text-xl text-primary dark:text-text-light" />
                        </button>
                    ) : (
                        <button
                            onClick={handleProfileClick}
                            className="p-3 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors shadow-md"
                            aria-label="Profile"
                        >
                            <FaUser className="text-xl text-primary dark:text-text-light" />
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex flex-col items-center justify-center space-y-1"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <span className="block w-8 h-1 bg-text-dark dark:bg-text-light rounded"></span>
                        <span className="block w-8 h-1 bg-text-dark dark:bg-text-light rounded"></span>
                        <span className="block w-8 h-1 bg-text-dark dark:bg-text-light rounded"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <ul className="md:hidden bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-md rounded-xl border border-secondary/30 dark:border-primary/30 shadow-lg py-4 px-6 mt-3 space-y-4">
                    <li>
                        <Link
                            to="/"
                            onClick={toggleMenu}
                            className="block text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <>
                            <li>
                                <Link
                                    to="/reports"
                                    onClick={toggleMenu}
                                    className="block text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Seasons
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/seasons"
                                    onClick={toggleMenu}
                                    className="block text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Seasons
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/series"
                                    onClick={toggleMenu}
                                    className="block text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                >
                                    Series
                                </Link>
                            </li>
                            {userType == "admin" && (
                                <li>
                                    <Link
                                        to="/admin"
                                        onClick={toggleMenu}
                                        className="text-lg font-medium text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                                    >
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
