export interface QuestionGameModel {
  id: string;
  gameId: string;
  player1Questions: string[] | undefined;
  player2Questions: string[] | undefined;
  player1Score: number;
  player2Score: number;
  player1AnsweredCurrentQuestion: boolean;
  player2AnsweredCurrentQuestion: boolean;
  questionNumber: number;
  currentPlayerUsedUnoReverse: boolean;
}
