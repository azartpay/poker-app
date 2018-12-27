import { Card } from "./card-interface";

export interface Player {
  id?: number;
  name: string;
  hand: Card[];
}
