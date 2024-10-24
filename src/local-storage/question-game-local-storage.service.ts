import { Injectable } from '@angular/core';
import { QuestionGameModel } from './models/question-game.model';

const QUESTION_GAMES_LOCAL_STORAGE_KEY = 'question_games';

@Injectable({
  providedIn: 'root',
})
export class QuestionGamesLocalService {
  findQuestionGameByGameId(gameId: string): QuestionGameModel | undefined {
    const questionGameString = localStorage.getItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY
    );
    if (questionGameString == null) {
      return undefined;
    }
    const questionGames = JSON.parse(questionGameString) as QuestionGameModel[];
    return questionGames.find((game) => game.gameId === gameId);
  }

  private getQuestionGames(): QuestionGameModel[] {
    const questionGameString = localStorage.getItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY
    );
    if (questionGameString == null) {
      return [];
    }
    return JSON.parse(questionGameString) as QuestionGameModel[];
  }

  createQuestionGame(gameId: string): QuestionGameModel {
    const questionGameString = localStorage.getItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY
    );
    let questionGames: QuestionGameModel[];
    if (questionGameString == null) {
      questionGames = [];
    } else {
      questionGames = JSON.parse(questionGameString) as QuestionGameModel[];
    }
    const newId = crypto.randomUUID();
    let newQuestionGame: QuestionGameModel = {
      gameId,
      id: newId,
      player1AnsweredCurrentQuestion: false,
      player2AnsweredCurrentQuestion: false,
      player1Score: 0,
      player2Score: 0,
      questionNumber: 0,
      player1Questions: undefined,
      player2Questions: undefined,
      currentPlayerUsedUnoReverse: false,
    };
    questionGames.push(newQuestionGame);

    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
    return newQuestionGame;
  }

  submitPlayer1Questions(gameId: string, questions: string[]) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player1Questions = questions;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  submitPlayer2Questions(gameId: string, questions: string[]) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player2Questions = questions;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  submitPlayer2Points(gameId: string, points: number) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player2AnsweredCurrentQuestion = true;
    questionGame.player2Score += points;
    questionGame.currentPlayerUsedUnoReverse = false;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  submitPlayer1Points(gameId: string, points: number) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player1AnsweredCurrentQuestion = true;
    questionGame.player1Score += points;
    questionGame.currentPlayerUsedUnoReverse = false;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  nextQuestion(gameId: string) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.questionNumber += 1;
    questionGame.currentPlayerUsedUnoReverse = false;
    questionGame.player1AnsweredCurrentQuestion = false;
    questionGame.player2AnsweredCurrentQuestion = false;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  player1UsedUnoReverse(gameId: string) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player1Score -= 1;
    questionGame.currentPlayerUsedUnoReverse = true;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }

  player2UsedUnoReverse(gameId: string) {
    const questionGame = this.findQuestionGameByGameId(gameId)!;
    let questionGames = this.getQuestionGames();
    questionGames = questionGames.filter((game) => game.id !== questionGame.id);
    questionGame.player2Score -= 1;
    questionGame.currentPlayerUsedUnoReverse = true;

    questionGames.push(questionGame);
    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
  }
}
