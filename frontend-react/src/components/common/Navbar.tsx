import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useAuth } from '../../authContext';
import { FaUser } from 'react-icons/fa';
import {FaUserPlus} from "react-icons/fa6";

const Navbar: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleModal = () => {
        setShowLoginModal(!showLoginModal);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileClick = () => {
        toggleMenu();
        navigate('/profile');
    };


    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className={'navbar-logo'}>
                        <Link to="/" className="navbar-icon-link">
                            <span className="navbar-icon">Icon</span>
                        </Link>
                    </div>

                    <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                        <li><Link to="/" onClick={toggleMenu} className="navbar-link">Home</Link></li>
                    </ul>

                    <div className="auth-search-container">
                        {!isAuthenticated ? (
                            <button onClick={toggleModal} className="login-button">
                                <FaUserPlus className="icon" />
                            </button>
                        ) : (
                            <button onClick={handleProfileClick} className="profile-link">
                                <FaUser className="icon" />
                            </button>
                        )}
                    </div>

                    <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {showLoginModal && <LoginModal closeModal={toggleModal}/>}
        </>
    );
};

export default Navbar;