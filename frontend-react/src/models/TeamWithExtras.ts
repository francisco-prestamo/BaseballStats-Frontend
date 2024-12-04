import {Team} from "./Team.ts";

export interface TeamWithExtras extends Team{
    winGames: number;
    loseGames: number;
    totalRuns: number;
}