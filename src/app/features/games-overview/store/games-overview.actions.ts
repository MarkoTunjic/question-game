import { GameTypes } from '../game-types.model';

export class InitGames {
  static readonly type = '[GamesOverview] InitGames';
}

export class CreateNewGame {
  static readonly type = '[GamesOverview] CreateNewGame';

  constructor(
    public name: string,
    public player1: string,
    public player2: string,
    public gameType: GameTypes
  ) {}
}

export class ToggleGameCreationMode {
  static readonly type = '[GamesOverview] ToggleGameCreationMode';
}

export class GameSelected {
  static readonly type = '[GamesOverview] GameSelected';

  constructor(public gameId: string) {}
}
