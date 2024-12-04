import {Player} from "./Player.ts";

export interface PlayerInPosition {
    player: Player;
    position: string;
    team: number;
}