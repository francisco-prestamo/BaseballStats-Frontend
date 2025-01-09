import apiClient from "../../config/apiClient";
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";
import { PlayerInPosition } from "../../../models/PlayerInPosition";

const TEAMS_URL = "/teams";

export const fetchTeamInfo = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<Team> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${seasonId}/${seriesId}/${teamId}/`
  );
  return response.data;
};

export const fetchTeamGamesInThisSeries = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<Game[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${seasonId}/${seriesId}/${teamId}/games`
  );
  return response.data;
};

export const fetchTeamStarPlayers = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<PlayerInPosition[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${seasonId}/${seriesId}/${teamId}/star-players`
  );

  return response.data;
};

export const fetchTeamPlayersInASeason = async (
  seasonId: string,
  seriesId: string,
  teamId: string
): Promise<Player[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${seasonId}/${seriesId}/${teamId}/players`
  );

  return response.data;
};
