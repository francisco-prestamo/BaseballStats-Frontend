import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaUsers } from "react-icons/fa";
import adminDirectService from "../../services/users/admin/adminDirectService";
import { DirectionMember } from "../../models/crud/DirectionMember";
import { Team } from "../../models/Team";
import adminTeamService from "../../services/users/admin/adminTeamService";

interface Direct {
    directionMemberId: number;
    teamId: number;
}

const ManageDirects: React.FC = () => {
    const [directs, setDirects] = useState<Direct[]>([]);
    const [directionMembers, setDirectionMembers] = useState<DirectionMember[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [newDirect, setNewDirect] = useState<Direct>({
        directionMemberId: 0,
        teamId: 0,
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState<Direct | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDirects = async () => {
        try {
            const response = await adminDirectService.getDirects();
            setDirects(response);
        } catch (error) {
            console.error("Error fetching directs:", error);
        }
    };

    const fetchMembersAndTeams = async () => {
        try {
            // const members = await adminDirectService.getDirectionMembers();
            const members = [{ id: 5, name: "Francisco" }]
            const teams = await adminTeamService.getTeams();
            setDirectionMembers(members);
            setTeams(teams);
        } catch (error) {
            console.error("Error fetching members or teams:", error);
        }
    };

    const filteredDirects = useMemo(() => {
        return directs.filter(
            (direct) =>
                directionMembers.find((dm) => dm.id === direct.directionMemberId)?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                teams.find((t) => t.id === direct.teamId)?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [directs, directionMembers, teams, searchTerm]);

    const handleCreateDirect = async () => {
        try {
            if (!newDirect.directionMemberId || !newDirect.teamId) {
                alert("Both Direction Member and Team are required.");
                return;
            }
            await adminDirectService.createDirect(newDirect);
            fetchDirects();
            setNewDirect({ directionMemberId: 0, teamId: 0 });
        } catch (error) {
            console.error("Error creating direct:", error);
        }
    };

    const handleDeleteDirect = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminDirectService.deleteDirect(deleteConfirmation);
            fetchDirects();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting direct:", error);
        }
    };

    useEffect(() => {
        fetchDirects();
        fetchMembersAndTeams();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Manage Directs</h1>
                        <p className="mt-2 text-lg opacity-90">Manage directs between Direction Members and Teams</p>
                        <p className="mt-1">Total Directs: {directs.length}</p>
                    </div>
                    <FaUsers className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Direct Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Direct</h2>

                    <select
                        value={newDirect.directionMemberId}
                        onChange={(e) =>
                            setNewDirect({ ...newDirect, directionMemberId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value={0}>Select Direction Member</option>
                        {directionMembers.map((dm) => (
                            <option key={dm.id} value={dm.id}>
                                {dm.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={newDirect.teamId}
                        onChange={(e) =>
                            setNewDirect({ ...newDirect, teamId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value={0}>Select Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleCreateDirect} className="w-full p-3 bg-primary text-white">
                        Create Direct
                    </button>
                </div>

                {/* Search Directs Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Directs</h3>
                    <input
                        type="text"
                        placeholder="Search by member or team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Directs List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Directs List</h3>
                {filteredDirects.length === 0 ? (
                    <p>No directs found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDirects.map((direct) => (
                            <div key={`${direct.directionMemberId}-${direct.teamId}`} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>
                                    {directionMembers.find((dm) => dm.id === direct.directionMemberId)?.name}
                                    → {teams.find((t) => t.id === direct.teamId)?.name}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setDeleteConfirmation(direct)}
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


            {/* Delete Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">
                            Are you sure you want to delete this direct?
                        </h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteDirect}
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

export default ManageDirects;
