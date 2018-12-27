import { Card } from "./card-interface";

export enum STAGES {
  DEAL = 'deal',
  FLOP = 'flop',
  TURN = 'turn',
  RIVER = 'river',
  SHOWDOWN = 'showdown'
};


export interface Game {
  id: number;
  deck : Card[]
  players : any[],
  nextStage: STAGES,
  communityCards : Card[]
}
