import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userType: string | null;
    login: (token: string, userType: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [userType, setUserType] = useState<string | null>(localStorage.getItem('userType'));

    const login = (token: string, userType: string) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', userType);
        setIsAuthenticated(true);
        setUserType(userType);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        setIsAuthenticated(false);
        setUserType(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};