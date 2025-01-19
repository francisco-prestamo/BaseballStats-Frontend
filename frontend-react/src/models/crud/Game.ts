export interface Game {
    id: number;
    idTeam1: number;
    idTeam2: number;
    idSeason: number;
    idSerie: number;
    date: Date;
    winTeam: boolean;
    team1Runs: number;
    team2Runs: number;
}