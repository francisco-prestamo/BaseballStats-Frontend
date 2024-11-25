import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../authContext";

const SessionExpiredPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLoginRedirect = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="container mx-auto flex flex-col justify-center items-center h-screen bg-bg-light dark:bg-primary-light">
            {/* Card Wrapper */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg border border-primary-lighter/20 max-w-md text-center">
                <h1 className="text-4xl font-bold text-text-light mb-4">Session Expired</h1>
                <p className="text-lg text-text-light mb-6">
                    Your session has expired. Please log in again to continue.
                </p>
                <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-3 bg-secondary-lightest dark:bg-primary rounded-lg text-primary dark:text-primary-lighter font-medium hover:bg-secondary-light dark:hover:bg-primary-light transition-colors border border-primary-lighter/20"
                >
                    Go to Home Page
                </button>
            </div>
        </div>
    );
};

export default SessionExpiredPage;