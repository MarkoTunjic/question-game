import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { InitQuestionGame } from './store/question-game.actions';

@Component({
  selector: 'app-question-game',
  standalone: true,
  imports: [],
  templateUrl: './question-game.component.html',
})
export class QuestionGameComponent {
  private readonly store = inject(Store);
}
