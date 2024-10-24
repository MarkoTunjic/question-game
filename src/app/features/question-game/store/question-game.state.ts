import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Game } from '../../../../local-storage/models/game.model';
import { inject, Injectable } from '@angular/core';
import {
  BackToGamesOverview,
  InitQuestionGame,
  SubmitPlayerPoints,
  SubmitPlayerQuestions,
  UnansweredQuestion,
  UnoReverseUsed,
} from './question-game.actions';
import { GamesLocalService } from '../../../../local-storage/games-local-storage.service';
import { QuestionGamesLocalService } from '../../../../local-storage/question-game-local-storage.service';
import { Router } from '@angular/router';
import { QuestionGameModel } from '../../../../local-storage/models/question-game.model';

interface QuestionGameStateModel {
  game: Game | undefined;
  currentQuestionGame: QuestionGameModel | undefined;
}

const defaults: QuestionGameStateModel = {
  game: undefined,
  currentQuestionGame: undefined,
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
  static getCurrentQuestion(state: QuestionGameStateModel): string | undefined {
    if (
      state.currentQuestionGame?.player1Questions == undefined ||
      state.currentQuestionGame?.player2Questions == undefined
    ) {
      return undefined;
    }
    if (!state.currentQuestionGame?.player2AnsweredCurrentQuestion) {
      return state.currentQuestionGame.player1Questions![
        state.currentQuestionGame.questionNumber
      ];
    }
    return state.currentQuestionGame?.player2Questions![
      state.currentQuestionGame.questionNumber
    ];
  }

  @Selector()
  static getCurrentPlayer(state: QuestionGameStateModel): string | undefined {
    if (!state.currentQuestionGame?.player2AnsweredCurrentQuestion) {
      return state.game?.player2;
    }
    return state.game?.player1;
  }

  @Selector()
  static getPlayer1Score(state: QuestionGameStateModel): number | undefined {
    return state.currentQuestionGame?.player1Score;
  }

  @Selector()
  static getPlayer2Score(state: QuestionGameStateModel): number | undefined {
    return state.currentQuestionGame?.player2Score;
  }

  @Selector()
  static getWinner(state: QuestionGameStateModel): string | undefined {
    if (
      state.currentQuestionGame?.player1Score ===
      state.currentQuestionGame?.player2Score
    ) {
      return 'Draw!';
    }

    if (
      state.currentQuestionGame?.player1Score! >
      state.currentQuestionGame?.player2Score!
    ) {
      return state.game?.player1 + ' is the WINNER!';
    }

    return state.game?.player2 + ' is the WINNER!';
  }

  @Selector()
  static isGameOver(state: QuestionGameStateModel): boolean | undefined {
    if (!state.game || !state.currentQuestionGame) {
      return false;
    }
    return (
      (state.currentQuestionGame?.questionNumber ===
        state.game.numberOfQuestions! - 1 &&
        state.currentQuestionGame?.player1AnsweredCurrentQuestion &&
        state.currentQuestionGame.player2AnsweredCurrentQuestion) ||
      state.currentQuestionGame.questionNumber >= state.game.numberOfQuestions!
    );
  }

  @Selector()
  static getGame(state: QuestionGameStateModel): Game | undefined {
    return state.game;
  }

  @Selector()
  static currentPlayerUsedUnoReverse(
    state: QuestionGameStateModel
  ): boolean | undefined {
    return state.currentQuestionGame?.currentPlayerUsedUnoReverse;
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

  @Action(SubmitPlayerPoints)
  submitPlayerPoints(
    ctx: StateContext<QuestionGameStateModel>,
    action: SubmitPlayerPoints
  ) {
    const { currentQuestionGame, game } = ctx.getState();
    const { points } = action;
    if (!currentQuestionGame?.player2AnsweredCurrentQuestion) {
      this.questionGamesService.submitPlayer2Points(game?.id!, points);
    } else if (!currentQuestionGame?.player1AnsweredCurrentQuestion) {
      this.questionGamesService.submitPlayer1Points(game?.id!, points);
      this.questionGamesService.nextQuestion(game?.id!);
    }

    ctx.patchState({
      currentQuestionGame: this.questionGamesService.findQuestionGameByGameId(
        game?.id!
      ),
    });
  }

  @Action(UnansweredQuestion)
  unansweredQuestion(ctx: StateContext<QuestionGameStateModel>) {
    const { currentQuestionGame, game } = ctx.getState();
    if (!currentQuestionGame?.player2AnsweredCurrentQuestion) {
      this.questionGamesService.submitPlayer2Points(game?.id!, 0);
    } else if (!currentQuestionGame?.player1AnsweredCurrentQuestion) {
      this.questionGamesService.submitPlayer1Points(game?.id!, 0);
      this.questionGamesService.nextQuestion(game?.id!);
    }

    ctx.patchState({
      currentQuestionGame: this.questionGamesService.findQuestionGameByGameId(
        game?.id!
      ),
    });
  }

  @Action(UnoReverseUsed)
  unoReverseUsed(ctx: StateContext<QuestionGameStateModel>) {
    const { currentQuestionGame, game } = ctx.getState();
    if (!currentQuestionGame?.player2AnsweredCurrentQuestion) {
      this.questionGamesService.player1UsedUnoReverse(game?.id!);
    } else if (!currentQuestionGame?.player1AnsweredCurrentQuestion) {
      this.questionGamesService.player2UsedUnoReverse(game?.id!);
    }

    ctx.patchState({
      currentQuestionGame: this.questionGamesService.findQuestionGameByGameId(
        game?.id!
      ),
    });
  }
}
