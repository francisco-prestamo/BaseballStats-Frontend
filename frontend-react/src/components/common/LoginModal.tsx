import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { login, register } from '../../services/api';

interface LoginModalProps {
    closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegisterMode) {
                const { token, userType } = await register(username, password);
                authLogin(token, userType);
            } else {
                const { token, userType } = await login(username, password);
                authLogin(token, userType);
            }
            closeModal();
        } catch (error) {
            console.error(isRegisterMode ? 'Registration failed' : 'Login failed', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={closeModal}>&times;</button>
                <h2>{isRegisterMode ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        {isRegisterMode ? 'Register' : 'Login'}
                    </button>
                </form>
                <button
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="toggle-button"
                >
                    {isRegisterMode ? 'Login' : "Register"}
                </button>
            </div>
        </div>
    );
};

export default LoginModal;