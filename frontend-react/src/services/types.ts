export interface Season {
    id: string;
}

export interface Series {
    id: string;
    idSeason: string;
    name: string;
    startDate: Date;
    endDate: Date;
}

export interface Team {
    id: string;
    name: string;
    initials: string;
    color: string;
    winGames: number;
    loseGames: number;
    totalRuns: number;
}

export interface Game {
    id: string;
    team1: Team;
    team2: Team;
    date: Date;
    winTeam: boolean;
    team1Runs: number;
    team2Runs: number;
}

export interface Player {
    id: string;
    name: string;
}

export interface PlayerInPosition {
    player: Player;
    position: string;
    team: string;
}

export interface Change {
    id: string;
    playerOut: PlayerInPosition;
    playerIn: PlayerInPosition;
    time: Date;
}