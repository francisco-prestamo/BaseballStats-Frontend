import apiClient from "../../config/apiClient";
import { Team } from "../../../models/crud/Team";
import {Dt} from "../../../models/crud/Dt.ts";


const TEAMS_URL = "/teams";
const DT_URL = "/dt";

const adminTeamService = {
    // Get all teams
    getTeams: async (): Promise<Team[]> => {
        const response = await apiClient.get(TEAMS_URL);
        return response.data;
    },

    // Create a new team
    createTeam: async (teamData: Omit<Team, 'id'>): Promise<Team> => {
        const response = await apiClient.post(TEAMS_URL, teamData);
        return response.data;
    },

    // Update an existing team
    updateTeam: async (team: Team): Promise<Team> => {
        const response = await apiClient.put(`${TEAMS_URL}/${team.id}`, team);
        return response.data;
    },

    // Delete a team
    deleteTeam: async (teamId: number): Promise<void> => {
        await apiClient.delete(`${TEAMS_URL}/${teamId}`);
    },

    // Get all dt
    getDts: async (): Promise<Dt[]> => {
        const response = await apiClient.get(DT_URL);
        return response.data;
    },
};

export default adminTeamService;