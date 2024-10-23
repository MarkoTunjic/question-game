import { Action, State, StateContext } from '@ngxs/store';
import { Game } from '../../../../local-storage/models/game.model';
import { inject, Injectable } from '@angular/core';
import { InitQuestionGame } from './question-game.actions';
import { GamesLocalService } from '../../../../local-storage/games-local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionGamesLocalService } from '../../../../local-storage/question-game-local-storage.service';

interface QuestionGameStateModel {
  game: Game | null;
  currentQuestionGameId: string | null;
}

const defaults: QuestionGameStateModel = {
  game: null,
  currentQuestionGameId: null,
};

@State<QuestionGameStateModel>({
  name: 'questionGame',
  defaults,
})
@Injectable()
export class QuestionGameState {
  private readonly gamesService = inject(GamesLocalService);
  private readonly questionGamesService = inject(QuestionGamesLocalService);

  private readonly route = inject(ActivatedRoute);

  @Action(InitQuestionGame)
  initQuestionGame(
    ctx: StateContext<QuestionGameStateModel>,
    action: InitQuestionGame
  ) {
    const { gameId } = action;
    let currentQuestionGameId =
      this.questionGamesService.findQuestionGameByGameId(gameId)?.id;
    if (currentQuestionGameId == undefined) {
      currentQuestionGameId =
        this.questionGamesService.createQuestionGame(gameId);
    }

    ctx.patchState({
      game: this.gamesService.getGameById(gameId),
      currentQuestionGameId,
    });
  }
}
