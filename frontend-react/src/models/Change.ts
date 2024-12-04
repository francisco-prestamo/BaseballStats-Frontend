import {PlayerInPosition} from "./PlayerInPosition.ts";

export interface Change {
    id: number;
    playerOut: PlayerInPosition;
    playerIn: PlayerInPosition;
    time: Date;
}