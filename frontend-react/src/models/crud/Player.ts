// Player.ts
export interface Player {
  id: number; // This is the player's CI (Carné de Identidad)
  name: string;
  age: number;
  yearsOfExperience: number;
  battingAverage?: number;
}
