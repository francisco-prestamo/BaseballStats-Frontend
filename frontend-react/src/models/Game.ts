import {Team} from "./Team.ts";

export interface Game {
    id: string;
    team1: Team;
    team2: Team;
    date: Date;
    winTeam: boolean;
    team1Runs: number;
    team2Runs: number;
}