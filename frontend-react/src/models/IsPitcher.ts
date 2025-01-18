import {Player} from "./Player.ts";
import {Pitcher} from "./Pitcher.ts";

export interface IsPitcher{
    player: Player | null;
    pitcher: Pitcher | null;
}