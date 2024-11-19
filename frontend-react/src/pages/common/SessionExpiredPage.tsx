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
        <div>
            <h1>Session Expired</h1>
            <p>
                Your session has expired. Please log in again to continue.
            </p>
            <button onClick={handleLoginRedirect}>
                Go to Home Page
            </button>
        </div>
    );
};

export default SessionExpiredPage;