export interface QuestionGameUpdateModel {
  player1Questions: string[] | null;
  player2Questions: string[] | null;
  player1Score: number;
  player2Score: number;
  player1AnsweredCurrentQuestion: boolean;
  player2AnsweredCurrentQuestion: boolean;
  questionNumber: number;
}
