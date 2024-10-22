import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Game } from '../../../../local-storage/models/game.model';
import {
  CreateNewGame,
  InitGames,
  ToggleGameCreationMode,
} from './games-overview.actions';
import { LocalService } from '../../../../local-storage/local-storage.service';

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
  private readonly localStorageService = inject(LocalService);

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
      action.player2
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
}
