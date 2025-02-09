export interface Game {
    id: number;
    team1Id: number;
    team2Id: number;
    seasonId: number;
    seriesId: number;
    date: string;
    winTeam: boolean;
    team1Runs: number;
    team2Runs: number;
}