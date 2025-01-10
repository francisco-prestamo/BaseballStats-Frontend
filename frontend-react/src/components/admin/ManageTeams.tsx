import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit, FaSearch, FaUsers } from "react-icons/fa";
import adminTeamService from "../../services/users/admin/adminTeamService";
import {Team} from "../../models/crud/Team.ts";
import {Dt} from "../../models/crud/Dt.ts";

const ManageTeams: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeam, setNewTeam] = useState<Omit<Team, 'id'>>({
        name: "",
        initials: "",
        color: "",
        representedIdentity: "",
        DtId: 0,
    });
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

    const [dtList, setDtList] = useState<Dt[]>([]);
    const [searchDt, setSearchDt] = useState("");
    const [dtSearchTerm, setDtSearchTerm] = useState("");

    // Filtering states
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTeams = async () => {
        try {
            const response = await adminTeamService.getTeams();
            setTeams(response);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchDtList = async () => {
        try {
            const response = await adminTeamService.getDts();
            setDtList(response);
        } catch (error) {
            console.error("Error fetching dt list:", error);
        }
    };

    const filteredDtList = useMemo(() => {
        return dtList.filter((dt) =>
            dt.username.toLowerCase().includes(searchDt.toLowerCase())
        );
    }, [dtList, searchDt]);

    const filteredTeams = useMemo(() => {
        return teams.filter((team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.initials.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teams, searchTerm]);

    // Filter DTs based on search term for editing
    const filteredDts = useMemo(() => {
        return dtList.filter((dt) =>
            dt.username.toLowerCase().includes(dtSearchTerm.toLowerCase())
        );
    }, [dtList, dtSearchTerm]);

    const handleCreateTeam = async () => {
        try {
            if (!newTeam.name || !newTeam.initials || !newTeam.color || !newTeam.representedIdentity || newTeam.DtId <= 0) {
                alert("All fields are required to create a team");
                return;
            }
            await adminTeamService.createTeam(newTeam);
            fetchTeams();
            setNewTeam({ name: "", initials: "", color: "", representedIdentity: "", DtId: 0 });
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    const handleUpdateTeam = async () => {
        try {
            if (!editingTeam) return;
            await adminTeamService.updateTeam(editingTeam);
            fetchTeams();
            setEditingTeam(null);
        } catch (error) {
            console.error("Error updating team:", error);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminTeamService.deleteTeam(deleteConfirmation);
            fetchTeams();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchDtList();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Team Management</h1>
                        <p className="mt-2 text-lg opacity-90">
                            Manage Teams
                        </p>
                        <p className="mt-1">Total Teams: {teams.length}</p>
                    </div>
                    <FaUsers className="text-6xl text-text-light opacity-80"/>
                </div>
            </div>

            {/* Team Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Team</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="text"
                        placeholder="Initials"
                        value={newTeam.initials}
                        onChange={(e) => setNewTeam({ ...newTeam, initials: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="text"
                        placeholder="Color"
                        value={newTeam.color}
                        onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="text"
                        placeholder="Represented Identity"
                        value={newTeam.representedIdentity}
                        onChange={(e) => setNewTeam({ ...newTeam, representedIdentity: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <div>
                        <input
                            type="text"
                            placeholder="Search DT..."
                            value={searchDt}
                            onChange={(e) => setSearchDt(e.target.value)}
                            className="w-full mb-3 p-3"
                        />
                        <select
                            value={newTeam.DtId}
                            onChange={(e) => setNewTeam({ ...newTeam, DtId: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        >
                            <option value={0}>Select a DT</option>
                            {filteredDtList.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                    {dt.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleCreateTeam} className="w-full p-3 bg-primary text-white">
                        Create Team
                    </button>
                </div>

                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Teams</h3>
                    <input
                        type="text"
                        placeholder="Search by name or initials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Teams List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Teams List</h3>
                {filteredTeams.length === 0 ? (
                    <p>No teams found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTeams.map((team) => (
                            <div key={team.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>{team.name}</p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingTeam(team)}
                                        className="p-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(team.id)}
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

            {/* Edit Team Modal */}
            {editingTeam && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light">
                                Edit Team
                            </h2>
                            <button
                                onClick={() => setEditingTeam(null)}
                                className="p-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-primary/30 transition-colors"
                            >
                                <FaTimes className="text-text-dark/70 dark:text-text-light/70" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Team Name"
                                value={editingTeam.name}
                                onChange={(e) =>
                                    setEditingTeam({ ...editingTeam, name: e.target.value })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Initials"
                                value={editingTeam.initials}
                                onChange={(e) =>
                                    setEditingTeam({ ...editingTeam, initials: e.target.value })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="color"
                                value={editingTeam.color}
                                onChange={(e) =>
                                    setEditingTeam({ ...editingTeam, color: e.target.value })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Represented Identity"
                                value={editingTeam.representedIdentity}
                                onChange={(e) =>
                                    setEditingTeam({ ...editingTeam, representedIdentity: e.target.value })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            {/* Dt Selector */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Director..."
                                    value={dtSearchTerm}
                                    onChange={(e) => setDtSearchTerm(e.target.value)}
                                    className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50" />
                                {filteredDts.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white dark:bg-primary shadow-lg rounded-lg max-h-40 overflow-y-auto z-10">
                                        {filteredDts.map((dt) => (
                                            <div
                                                key={dt.id}
                                                onClick={() => {
                                                    setEditingTeam({ ...editingTeam, DtId: dt.id });
                                                    setDtSearchTerm(dt.username);
                                                }}
                                                className="p-2 hover:bg-primary/10 dark:hover:bg-primary-lighter cursor-pointer"
                                            >
                                                {dt.username}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleUpdateTeam}
                                className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                            >
                                Update Team
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Team Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-2xl font-semibold mb-4 text-text-dark dark:text-text-light">
                            Confirm Deletion
                        </h2>
                        <p className="mb-6 text-text-dark/70 dark:text-text-light/70">
                            Are you sure you want to delete the team with ID {deleteConfirmation}?
                        </p>
                        <div className="flex space-x-4"><button
                            onClick={() => setDeleteConfirmation(null)}
                            className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 dark:bg-primary/30 dark:hover:bg-primary/50 transition-colors"
                        >
                            Cancel
                        </button>
                            <button
                                onClick={handleDeleteTeam}
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

export default ManageTeams;
