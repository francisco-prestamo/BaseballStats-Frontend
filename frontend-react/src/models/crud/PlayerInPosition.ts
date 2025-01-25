import { Player } from "./Player";

export interface PlayerInPosition {
  player: Player;
  position: string;
  effectiveness?: number;
}
