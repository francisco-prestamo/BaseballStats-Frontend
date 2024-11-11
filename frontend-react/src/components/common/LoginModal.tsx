import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { login } from '../../services/api';

interface LoginModalProps {
    closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token, userType } = await login(username, password);
            authLogin(token, userType);  // Pass both token and userType
            closeModal();
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={closeModal}>&times;</button>
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
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
                    <button type="submit" className="submit-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;