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

  createQuestionGame(gameId: string): string {
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
    questionGames.push({
      gameId,
      id: newId,
      player1AnsweredCurrentQuestion: false,
      player2AnsweredCurrentQuestion: false,
      player1Score: 0,
      player2Score: 0,
      questionNumber: 0,
      player1Questions: null,
      player2Questions: null,
    });

    localStorage.setItem(
      QUESTION_GAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(questionGames)
    );
    return newId;
  }
}
