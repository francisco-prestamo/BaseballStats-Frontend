import apiClient from "../../config/apiClient";
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";

const TEAMS_URL = "/team";

export const fetchTeamInfo = async (
  teamId: string,
  serieId: string
): Promise<Team> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/serie/${serieId}`
  );
  return response.data;
};

export const fetchTeamGamesInThisSeries = async (
  teamId: string,
  serieId: string
): Promise<Game[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/serie/${serieId}`
  );
  return response.data;
};

export const fetchTeamStarPlayers = async (
  teamId: string,
  serieId: string
): Promise<Player[]> => {
  const response = await apiClient.get(
    `${TEAMS_URL}/${teamId}/serie/${serieId}`
  );

  return response.data;
};
