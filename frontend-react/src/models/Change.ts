import {PlayerInPosition} from "./PlayerInPosition.ts";

export interface Change {
    id: string;
    playerOut: PlayerInPosition;
    playerIn: PlayerInPosition;
    time: Date;
}