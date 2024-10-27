import { inject, Injectable } from '@angular/core';
import { Game } from './models/game.model';
import { GameTypes } from '../app/features/games-overview/game-types.model';
import { QuestionGamesLocalService } from './question-game-local-storage.service';

const GAMES_LOCAL_STORAGE_KEY = 'games';

@Injectable({
  providedIn: 'root',
})
export class GamesLocalService {
  private readonly questionGameService = inject(QuestionGamesLocalService);

  public saveGame(
    name: string,
    player1: string,
    player2: string,
    gameType: GameTypes,
    numberOfQuestions: number
  ): string {
    const gamesString = localStorage.getItem(GAMES_LOCAL_STORAGE_KEY);
    let games: Game[];
    if (gamesString == null) {
      games = [];
    } else {
      games = JSON.parse(gamesString) as Game[];
    }
    const newId = crypto.randomUUID();
    games.push({
      id: newId,
      name,
      player1,
      player2,
      gameType,
      numberOfQuestions,
    });
    localStorage.setItem(GAMES_LOCAL_STORAGE_KEY, JSON.stringify(games));
    return newId;
  }

  public getGames(): Game[] {
    const gamesString = localStorage.getItem(GAMES_LOCAL_STORAGE_KEY);
    if (gamesString == null) {
      return [];
    }
    return JSON.parse(gamesString) as Game[];
  }

  public getGameById(gameId: string): Game {
    const games = this.getGames();
    return games.find((game) => game.id === gameId)!;
  }

  public removeGame(gameId: string) {
    const gamesString = localStorage.getItem(GAMES_LOCAL_STORAGE_KEY);
    if (gamesString == null) {
      return;
    }
    const games = JSON.parse(gamesString) as Map<string, Game>;
    games.delete(gameId);
  }

  public deleteAll() {
    localStorage.removeItem(GAMES_LOCAL_STORAGE_KEY);
  }

  public deleteById(gameId: string) {
    const games = this.getGames();
    let withoutDeleted = games.filter((game) => game.id !== gameId);
    this.questionGameService.deleteByGameId(gameId);

    localStorage.setItem(
      GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(withoutDeleted)
    );
  }
}
