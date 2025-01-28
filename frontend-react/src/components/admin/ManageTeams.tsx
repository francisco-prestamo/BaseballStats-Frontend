import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit, FaSearch, FaUsers } from "react-icons/fa";
import adminTeamService from "../../services/users/admin/adminTeamService";
import {Team} from "../../models/crud/Team.ts";
import {Dt} from "../../models/crud/Dt.ts";

const ManageTeams: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeam, setNewTeam] = useState<Team>({
        id: 0,
        name: "",
        initials: "",
        color: "",
        representedEntity: "",
        dtId: 0,
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

    const filteredDts = useMemo(() => {
        return dtList.filter((dt) =>
            dt.username.toLowerCase().includes(dtSearchTerm.toLowerCase())
        );
    }, [dtList, dtSearchTerm]);

    const handleCreateTeam = async () => {
        try {
            if (!newTeam.name || !newTeam.initials || !newTeam.color || !newTeam.representedEntity || newTeam.dtId <= 0) {
                alert("All fields are required to create a team");
                return;
            }
            await adminTeamService.createTeam(newTeam);
            fetchTeams();
            setNewTeam({ id:0, name: "", initials: "", color: "", representedEntity: "", dtId: 0 });
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
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Team Management</h1>
                        <div className="mt-2 text-lg md:text-xl opacity-90">
                            <p>Manage Teams and Technical Directors</p>
                            <p className="mt-1">Total Teams: {teams.length}</p>
                        </div>
                    </div>
                    <FaUsers className="text-6xl text-text-light opacity-80"/>
                </div>
            </div>

            {/* Team Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Create New Team
                    </h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newTeam.name}
                            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Initials"
                            value={newTeam.initials}
                            onChange={(e) => setNewTeam({ ...newTeam, initials: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="color"
                            value={newTeam.color}
                            onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Represented Identity"
                            value={newTeam.representedEntity}
                            onChange={(e) => setNewTeam({ ...newTeam, representedEntity: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search DT..."
                                value={searchDt}
                                onChange={(e) => setSearchDt(e.target.value)}
                                className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50"/>
                        </div>
                        <select
                            value={newTeam.dtId}
                            onChange={(e) => setNewTeam({ ...newTeam, dtId: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select a DT</option>
                            {filteredDtList.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                    {dt.username}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleCreateTeam}
                            className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                        >
                            Create Team
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Search Teams
                    </h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or initials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50"/>
                    </div>
                </div>
            </div>

            {/* Teams List */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Teams List
                </h3>
                {filteredTeams.length === 0 ? (
                    <p className="text-text-dark/70 dark:text-text-light/70">No teams found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="group flex items-center justify-between p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:shadow-xl border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                            >
                                <div>
                                    <p className="font-semibold text-text-dark dark:text-text-light">{team.name}</p>
                                    <p className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        {team.initials}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingTeam(team)}
                                        className="p-2 rounded-lg bg-primary/10 dark:bg-primary-lighter/10 hover:bg-primary/20 dark:hover:bg-primary-lighter/20 transition-all duration-300"
                                    >
                                        <FaEdit className="text-primary dark:text-primary-lighter"/>
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(team.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                                    >
                                        <FaTrash className="text-red-500 dark:text-red-300"/>
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
                                Edit Team: {editingTeam.name}
                            </h2>
                            <FaTimes
                                className="text-xl text-text-dark dark:text-text-light cursor-pointer"
                                onClick={() => setEditingTeam(null)}
                            />
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Team Name"
                                value={editingTeam.name}
                                onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Initials"
                                value={editingTeam.initials}
                                onChange={(e) => setEditingTeam({ ...editingTeam, initials: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="color"
                                value={editingTeam.color}
                                onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Represented Identity"
                                value={editingTeam.representedEntity}
                                onChange={(e) => setEditingTeam({ ...editingTeam, representedEntity: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Director..."
                                    value={dtSearchTerm}
                                    onChange={(e) => setDtSearchTerm(e.target.value)}
                                    className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50"/>
                                {filteredDts.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white dark:bg-primary shadow-lg rounded-lg max-h-40 overflow-y-auto z-10">
                                        {filteredDts.map((dt) => (
                                            <div
                                                key={dt.id}
                                                onClick={() => {
                                                    setEditingTeam({ ...editingTeam, dtId: dt.id });
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
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUpdateTeam}
                                    className="w-full p-3 bg-primary text-text-light rounded-lg hover:bg-primary-light transition-all duration-300"
                                >
                                    Update Team
                                </button>
                                <button
                                    onClick={() => setEditingTeam(null)}
                                    className="w-full p-3 bg-red-500 text-text-light rounded-lg hover:bg-red-600 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Team Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4">
                            Are you sure you want to delete this team?
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteTeam}
                                className="w-full p-3 bg-red-500 text-text-light rounded-lg hover:bg-red-600 transition-all duration-300"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="w-full p-3 bg-primary text-text-light rounded-lg hover:bg-primary-light transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTeams;