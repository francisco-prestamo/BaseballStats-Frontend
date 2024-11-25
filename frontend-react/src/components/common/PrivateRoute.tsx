import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../authContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredUserType?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
    const { isAuthenticated, userType } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requiredUserType && (userType !== requiredUserType && requiredUserType !== 'allAuthenticated')) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;