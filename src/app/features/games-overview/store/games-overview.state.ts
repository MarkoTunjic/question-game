import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Game } from '../../../../local-storage/models/game.model';
import {
  CreateNewGame,
  GameSelected,
  InitGames,
  ToggleGameCreationMode,
} from './games-overview.actions';
import { GamesLocalService } from '../../../../local-storage/games-local-storage.service';
import { GameTypes } from '../game-types.model';
import { Router } from '@angular/router';

interface GamesOverviewStateModel {
  games: Game[];
  gameCreatingMode: boolean;
}

const defaults: GamesOverviewStateModel = {
  games: [],
  gameCreatingMode: false,
};

@State<GamesOverviewStateModel>({
  name: 'gamesOverview',
  defaults,
})
@Injectable()
export class GamesOverviewState {
  private readonly localStorageService = inject(GamesLocalService);
  private readonly router = inject(Router);

  @Selector()
  static getGames(state: GamesOverviewStateModel): Game[] {
    return state.games;
  }

  @Selector()
  static isGameBeingCreated(state: GamesOverviewStateModel): boolean {
    return state.gameCreatingMode;
  }

  @Action(InitGames)
  initGames(ctx: StateContext<GamesOverviewStateModel>) {
    ctx.patchState({
      games: this.localStorageService.getGames(),
    });
  }

  @Action(CreateNewGame)
  createNewGame(
    ctx: StateContext<GamesOverviewStateModel>,
    action: CreateNewGame
  ) {
    this.localStorageService.saveGame(
      action.name,
      action.player1,
      action.player2,
      action.gameType,
      action.numberOfQuestions
    );

    ctx.patchState({
      games: this.localStorageService.getGames(),
      gameCreatingMode: false,
    });
  }

  @Action(ToggleGameCreationMode)
  cancelCreating(ctx: StateContext<GamesOverviewStateModel>) {
    const { gameCreatingMode } = ctx.getState();
    ctx.patchState({
      gameCreatingMode: !gameCreatingMode,
    });
  }

  @Action(GameSelected)
  gameSelected(
    ctx: StateContext<GamesOverviewStateModel>,
    action: GameSelected
  ) {
    const { games } = ctx.getState();
    const selectedGame = games.find((game) => game.id === action.gameId);

    switch (selectedGame?.gameType) {
      case GameTypes.QUESTIONS:
        void this.router.navigate([`games/question-game/${action.gameId}`]);
        break;
      case GameTypes.TWO_TRUTHS_ONE_LIE:
        break;
    }
  }
}
