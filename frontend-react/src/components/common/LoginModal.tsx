import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { login, register } from '../../services/authService';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-light dark:bg-primary-light rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute right-4 top-4 text-text-dark dark:text-text-light hover:opacity-70 transition-opacity"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-6 text-text-dark dark:text-text-light">
                    {isRegisterMode ? 'Register' : 'Login'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-text-dark dark:text-text-light mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 rounded-md bg-secondary-lightest dark:bg-primary text-text-dark dark:text-text-light border border-primary-lighter dark:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-lighter"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-text-dark dark:text-text-light mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 rounded-md bg-secondary-lightest dark:bg-primary text-text-dark dark:text-text-light border border-primary-lighter dark:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-lighter"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary dark:bg-primary-light text-text-light py-2 rounded-md hover:bg-primary-light dark:hover:bg-primary transition-colors duration-200"
                    >
                        {isRegisterMode ? 'Register' : 'Login'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                        className="w-full text-primary dark:text-text-light hover:underline mt-4"
                    >
                        {isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;