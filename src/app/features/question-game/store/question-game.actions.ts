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

export class SubmitPlayerPoints {
  static readonly type = '[QuestionGame] SubmitPlayerPoints';

  constructor(public points: number) {}
}

export class UnansweredQuestion {
  static readonly type = '[QuestionGame] UnansweredQuestion';

  constructor() {}
}

export class UnoReverseUsed {
  static readonly type = '[QuestionGame] UnoReverseUsed';

  constructor() {}
}
