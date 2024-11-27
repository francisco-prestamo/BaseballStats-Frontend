import React, { useState, useEffect, useMemo } from "react";
import {FaTimes, FaTrash, FaEdit, FaSearch, FaPlus } from "react-icons/fa";
import adminUserService from "../../services/users/admin/adminUserService.ts";
import { User } from "../../models/User.ts";

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User>({ username: "", userType: "admin" });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await adminUserService.getUsers();
            setUsers(response);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Memoized and filtered users
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            // Filter by search term
            (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userType.toLowerCase().includes(searchTerm.toLowerCase())) &&
            // Filter by user type if selected
            (!selectedUserType || user.userType === selectedUserType)
        );
    }, [users, searchTerm, selectedUserType]);

    // Group users by type
    const groupedUsers = useMemo(() => {
        return filteredUsers.reduce((acc, user) => {
            if (!acc[user.userType]) {
                acc[user.userType] = [];
            }
            acc[user.userType].push(user);
            return acc;
        }, {} as Record<string, User[]>);
    }, [filteredUsers]);

    const handleRegisterUser = async () => {
        try {
            // Ensure password is included when registering
            if (!newUser.password) {
                alert("Please provide a password");
                return;
            }
            await adminUserService.registerUser(newUser);
            fetchUsers();
            // Reset form
            setNewUser({ username: "", userType: "admin" });
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            if (!editingUser) return;
            await adminUserService.updateUser(editingUser);
            fetchUsers();
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminUserService.deleteUser(deleteConfirmation);
            fetchUsers();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary dark:text-text-light">
                User Management
            </h1>

            <div
                className="bg-bg-light/70 dark:bg-bg-dark/70 backdrop-blur-md rounded-xl border border-secondary/30 dark:border-primary/30 shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light">
                    Register New User
                </h2>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="flex-grow p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password || ''}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="flex-grow p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                        value={newUser.userType}
                        onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
                        className="p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="admin">Admin</option>
                        <option value="technicalDirector">Technical Director</option>
                        <option value="journalist">Journalist</option>
                    </select>
                    <button
                        onClick={handleRegisterUser}
                        className="p-3 rounded-lg bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors flex items-center justify-center"
                    >
                        <FaPlus className="text-white dark:text-text-light"/>
                    </button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 flex space-x-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FaSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50"/>
                </div>
                <select
                    value={selectedUserType || ""}
                    onChange={(e) => setSelectedUserType(e.target.value || null)}
                    className="p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All User Types</option>
                    <option value="admin">Admin</option>
                    <option value="technicalDirector">Technical Director</option>
                    <option value="journalist">Journalist</option>
                </select>
            </div>

            {/* Grouped User List */}
            {Object.entries(groupedUsers).map(([userType, typeUsers]) => (
                <div
                    key={userType}
                    className="bg-bg-light/70 dark:bg-bg-dark/70 backdrop-blur-md rounded-xl border border-secondary/30 dark:border-primary/30 shadow-lg p-6 mb-6"
                >
                    <h2 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light capitalize">
                        {userType.replace(/([A-Z])/g, ' $1')} Users
                    </h2>
                    <div className="space-y-4">
                        {typeUsers.length === 0 ? (
                            <p className="text-text-dark/70 dark:text-text-light/70">
                                No users found in this category.
                            </p>
                        ) : (
                            typeUsers.map((user) => (
                                <div
                                    key={user.username}
                                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-primary/10 rounded-lg border border-secondary/30 dark:border-primary/30"
                                >
                                    <div>
                                        <p className="font-medium text-text-dark dark:text-text-light">
                                            {user.username}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setEditingUser({...user})}
                                            className="p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 dark:bg-primary/30 dark:hover:bg-primary/50 transition-colors"
                                        >
                                            <FaEdit className="text-text-dark/70 dark:text-text-light/70"/>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmation(user.username)}
                                            className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 transition-colors"
                                        >
                                            <FaTrash className="text-red-700 dark:text-red-300"/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-text-dark dark:text-text-light">
                                Edit User
                            </h2>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="p-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-primary/30 transition-colors"
                            >
                                <FaTimes className="text-text-dark/70 dark:text-text-light/70"/>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <select
                                value={editingUser.userType}
                                onChange={(e) => setEditingUser({...editingUser, userType: e.target.value})}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="admin">Admin</option>
                                <option value="technicalDirector">Technical Director</option>
                                <option value="journalist">Journalist</option>
                            </select>
                            <button
                                onClick={handleUpdateUser}
                                className="w-full p-3 rounded-lg bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light transition-colors"
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light">
                            Confirm Deletion
                        </h2>
                        <p className="mb-6 text-text-dark/70 dark:text-text-light/70">
                            Are you sure you want to delete the user "{deleteConfirmation}"?
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 dark:bg-primary/30 dark:hover:bg-primary/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="flex-grow p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;