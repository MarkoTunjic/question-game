import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Game } from '../../../../local-storage/models/game.model';
import { inject, Injectable } from '@angular/core';
import {
  BackToGamesOverview,
  InitQuestionGame,
  SubmitPlayerQuestions,
} from './question-game.actions';
import { GamesLocalService } from '../../../../local-storage/games-local-storage.service';
import { QuestionGamesLocalService } from '../../../../local-storage/question-game-local-storage.service';
import { Router } from '@angular/router';
import { QuestionGameModel } from '../../../../local-storage/models/question-game.model';

interface QuestionGameStateModel {
  game: Game | null;
  currentQuestionGame: QuestionGameModel | null;
}

const defaults: QuestionGameStateModel = {
  game: null,
  currentQuestionGame: null,
};

@State<QuestionGameStateModel>({
  name: 'questionGame',
  defaults,
})
@Injectable()
export class QuestionGameState {
  private readonly gamesService = inject(GamesLocalService);
  private readonly questionGamesService = inject(QuestionGamesLocalService);
  private readonly router = inject(Router);

  @Selector()
  static player1InputtedQuestions(state: QuestionGameStateModel): boolean {
    return state.currentQuestionGame?.player1Questions != null;
  }

  @Selector()
  static player2InputtedQuestions(state: QuestionGameStateModel): boolean {
    return state.currentQuestionGame?.player2Questions != null;
  }

  @Selector()
  static getGame(state: QuestionGameStateModel): Game | null {
    return state.game;
  }

  @Action(InitQuestionGame)
  initQuestionGame(
    ctx: StateContext<QuestionGameStateModel>,
    action: InitQuestionGame
  ) {
    const { gameId } = action;
    let currentQuestionGame =
      this.questionGamesService.findQuestionGameByGameId(gameId);
    if (currentQuestionGame == undefined) {
      currentQuestionGame =
        this.questionGamesService.createQuestionGame(gameId);
    }

    ctx.patchState({
      game: this.gamesService.getGameById(gameId),
      currentQuestionGame,
    });
  }

  @Action(BackToGamesOverview)
  backToGamesOverview() {
    void this.router.navigate(['']);
  }

  @Action(SubmitPlayerQuestions)
  submitPlayerQuestions(
    ctx: StateContext<QuestionGameStateModel>,
    action: SubmitPlayerQuestions
  ) {
    const { currentQuestionGame, game } = ctx.getState();
    if (currentQuestionGame?.player1Questions == null) {
      this.questionGamesService.submitPlayer1Questions(
        game?.id!,
        action.questions
      );
    } else {
      this.questionGamesService.submitPlayer2Questions(
        game?.id!,
        action.questions
      );
    }

    ctx.patchState({
      currentQuestionGame: this.questionGamesService.findQuestionGameByGameId(
        game?.id!
      ),
    });
  }
}
