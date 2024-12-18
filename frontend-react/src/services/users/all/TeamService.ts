import apiClient from "../../config/apiClient";
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";
import { PlayerInPosition } from "../../../models/PlayerInPosition";

const TEAMS_URL = "/team";

export const fetchTeamInfo = async (
  teamId: string,
  seriesId: string
): Promise<Team> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/series/${seriesId}`
  );
  return response.data;
};

export const fetchTeamGamesInThisSeries = async (
  teamId: string,
  seriesId: string
): Promise<Game[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/series/${seriesId}/games`
  );
  return response.data;
};

export const fetchTeamStarPlayers = async (
  teamId: string,
  seriesId: string
): Promise<PlayerInPosition[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/series/${seriesId}/star-players`
  );

  return response.data;
};

export const fetchTeamPlayersInASeason = async (
  teamId: string,
  seriesId: string
): Promise<Player[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/series/${seriesId}/players`
  );

  return response.data;
};
