import { GameTypes } from '../../app/features/games-overview/game-types.model';

export interface Game {
  id: string;
  name: string;
  player1: string;
  player2: string;
  gameType: GameTypes;
  numberOfQuestions: number;
}
