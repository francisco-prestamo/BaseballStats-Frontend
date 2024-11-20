import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../authContext";
import { BiUser, BiLogOut, BiCog } from "react-icons/bi";


const Profile: React.FC = () => {
    const { logout, userType } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        {
            icon: <BiCog className="w-6 h-6" />,
            title: "Settings",
            description: "Manage your account settings and preferences",
            action: () => {}
        }
    ];

    return (
        <div className="container mx-auto p-4 space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center text-text-light">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <BiUser className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Profile</h1>
                            <p className="text-xl mt-2 opacity-90">Account Type: {userType}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <BiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Menu Options */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Account Management
                </h3>
                <div className="space-y-3">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className="w-full flex items-center justify-between p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:bg-secondary-light dark:hover:bg-primary-light transition-all duration-200 group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-primary dark:text-primary-lighter">
                                    {item.icon}
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-text-dark dark:text-text-light">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            <BiLogOut className="w-5 h-5 text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;