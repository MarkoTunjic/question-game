export class InitQuestionGame {
  static readonly type = '[QuestionGame] InitQuestionGame';

  constructor(public gameId: string) {}
}

export class BackToGamesOverview {
  static readonly type = '[QuestionGame] BackToGamesOverview';
}

export class SubmitPlayerQuestions {
  static readonly type = '[QuestionGame] SubmitPlayerQuestions';

  constructor(public questions: string[]) {}
}
