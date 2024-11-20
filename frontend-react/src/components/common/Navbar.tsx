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
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleProfileClick = () => {
        setIsMenuOpen(false);
        navigate('/profile');
    };

    return (
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-20 w-4/5 max-w-6xl bg-bg-light/50 dark:bg-bg-dark/50 backdrop-blur-[10px] rounded-xl border border-secondary/20 dark:border-primary/20 shadow-lg px-6 py-4">
            <div className="flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xl font-bold text-primary dark:text-text-light hover:text-primary-light transition-colors"
                >
                    Icon
                </Link>

                <ul className="hidden md:flex items-center space-x-6">
                    <li>
                        <Link
                            to="/"
                            className="text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <Link
                                to="/seasons"
                                className="text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                            >
                                Seasons
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors"
                    >
                        {theme === 'light' ? <FaMoon className="text-primary"/> : <FaSun className="text-text-light"/>}
                    </button>

                    {!isAuthenticated ? (
                        <button
                            onClick={onLoginClick}
                            className="p-2 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors"
                        >
                            <FaUserPlus className="text-primary dark:text-text-light"/>
                        </button>
                    ) : (
                        <button
                            onClick={handleProfileClick}
                            className="p-2 rounded-full bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors"
                        >
                            <FaUser className="text-primary dark:text-text-light"/>
                        </button>
                    )}

                    <button
                        className="md:hidden"
                        onClick={toggleMenu}
                    >
                        <span className="block w-6 h-0.5 bg-text-dark dark:bg-text-light mb-1"></span>
                        <span className="block w-6 h-0.5 bg-text-dark dark:bg-text-light mb-1"></span>
                        <span className="block w-6 h-0.5 bg-text-dark dark:bg-text-light"></span>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <ul className="md:hidden bg-bg-light/50 dark:bg-bg-dark/50 backdrop-blur-[10px] rounded-xl border border-secondary/20 dark:border-primary/20 shadow-lg py-4 px-4 mt-2">
                    <li>
                        <Link
                            to="/"
                            className="block py-2 text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <Link
                                to="/seasons"
                                className="block py-2 text-text-dark dark:text-text-light hover:text-primary-light transition-colors"
                            >
                                Seasons
                            </Link>
                        </li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;