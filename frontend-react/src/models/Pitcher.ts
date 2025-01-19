import {Player} from "./Player.ts";

export interface Pitcher extends Player {
    gamesWonNumber: number;
    gamesLostNumber: number;
    rightHanded: boolean;
    allowedRunsAvg: number;
}