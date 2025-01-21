import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import directionMemberService from "../../services/users/admin/adminDirectionMemberService";
import { DirectionMember } from "../../models/crud/DirectionMember";

const ManageDirectionMembers: React.FC = () => {
    const [directionMembers, setDirectionMembers] = useState<DirectionMember[]>([]);
    const [newDirectionMember, setNewDirectionMember] = useState<DirectionMember>({
        id: 0,
        name: "",
    });
    const [editingDirectionMember, setEditingDirectionMember] = useState<DirectionMember | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<DirectionMember | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDirectionMembers = async () => {
        try {
            const members = await directionMemberService.getDirectionMembers();
            setDirectionMembers(members);
        } catch (error) {
            console.error("Error fetching direction members:", error);
        }
    };

    const filteredDirectionMembers = useMemo(() => {
        return directionMembers.filter((member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [directionMembers, searchTerm]);

    const handleCreateDirectionMember = async () => {
        try {
            if (!newDirectionMember.name) {
                alert("Name is required.");
                return;
            }
            await directionMemberService.createDirectionMember(newDirectionMember);
            fetchDirectionMembers();
            setNewDirectionMember({ id: 0, name: "" });
        } catch (error) {
            console.error("Error creating direction member:", error);
        }
    };

    const handleUpdateDirectionMember = async () => {
        try {
            if (!editingDirectionMember) return;
            await directionMemberService.updateDirectionMember(editingDirectionMember);
            fetchDirectionMembers();
            setEditingDirectionMember(null);
        } catch (error) {
            console.error("Error updating direction member:", error);
        }
    };

    const handleDeleteDirectionMember = async () => {
        try {
            if (!deleteConfirmation) return;
            await directionMemberService.deleteDirectionMember(deleteConfirmation.id);
            fetchDirectionMembers();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting direction member:", error);
        }
    };

    useEffect(() => {
        fetchDirectionMembers();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Manage Direction Members</h1>
                        <p className="mt-2 text-lg opacity-90">Manage members of the direction</p>
                        <p className="mt-1">Total Members: {directionMembers.length}</p>
                    </div>
                </div>
            </div>

            {/* Member Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Direction Member</h2>

                    <input
                        type="text"
                        placeholder="Enter member name"
                        value={newDirectionMember.name}
                        onChange={(e) =>
                            setNewDirectionMember({ ...newDirectionMember, name: e.target.value })
                        }
                        className="w-full mb-3 p-3"
                    />

                    <button onClick={handleCreateDirectionMember} className="w-full p-3 bg-primary text-white">
                        Create Member
                    </button>
                </div>

                {/* Search Members Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Members</h3>
                    <input
                        type="text"
                        placeholder="Search by member name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Members List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Members List</h3>
                {filteredDirectionMembers.length === 0 ? (
                    <p>No members found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDirectionMembers.map((member) => (
                            <div key={member.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>{member.name}</p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingDirectionMember(member)}
                                        className="p-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(member)}
                                        className="p-2 bg-red-500 text-white rounded-lg"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Member Modal */}
            {editingDirectionMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-text-dark">Edit Member</h2>
                            <button
                                onClick={() => setEditingDirectionMember(null)}
                                className="p-2 text-text-dark hover:text-red-500"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Member Name */}
                        <div className="mb-4">
                            <label htmlFor="editDirectionMember" className="block text-sm font-medium mb-2">
                                Member Name
                            </label>
                            <input
                                id="editDirectionMember"
                                type="text"
                                value={editingDirectionMember.name}
                                onChange={(e) =>
                                    setEditingDirectionMember({
                                        ...editingDirectionMember,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-primary"
                            />
                        </div>

                        {/* Update Button */}
                        <button
                            onClick={handleUpdateDirectionMember}
                            className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">
                            Are you sure you want to delete this member?
                        </h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteDirectionMember}
                                className="p-3 bg-red-500 text-white rounded-lg"
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

export default ManageDirectionMembers;
