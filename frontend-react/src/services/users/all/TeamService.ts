import apiClient from "../../config/apiClient";
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";
import { PlayerInPosition } from "../../../models/PlayerInPosition";

const TEAMS_URL = "/teams";

export const fetchTeamInfo = async (teamId: string): Promise<Team> => {
  const response = await apiClient.get(`${TEAMS_URL}/${teamId}`);
  return response.data;
};

export const fetchTeamGamesInThisSeries = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<Game[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/team/${teamId}/serie/${seasonId}/${seriesId}/games`
  );
  return response.data;
};

export const fetchTeamStarPlayers = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<PlayerInPosition[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/team/${teamId}/serie/${seasonId}/${seriesId}/star-players`
  );

  return response.data;
};

export const fetchTeamPlayersInASerie = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<Player[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/team/${teamId}/serie/${seasonId}/${seriesId}/players`
  );

  return response.data;
};
