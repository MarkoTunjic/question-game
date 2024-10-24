import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Game } from '../../../local-storage/models/game.model';
import { Observable } from 'rxjs';
import { QuestionGameState } from './store/question-game.state';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  BackToGamesOverview,
  SubmitPlayerPoints,
  SubmitPlayerQuestions,
  UnansweredQuestion,
  UnoReverseUsed,
} from './store/question-game.actions';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-question-game',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './question-game.component.html',
})
export class QuestionGameComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  game$: Observable<Game | undefined> = this.store.select(
    QuestionGameState.getGame
  );
  player1InputtedQuestions$: Observable<boolean> = this.store.select(
    QuestionGameState.player1InputtedQuestions
  );
  player2InputtedQuestions$: Observable<boolean> = this.store.select(
    QuestionGameState.player2InputtedQuestions
  );
  currentPlayerUsedUnoReverse$: Observable<boolean | undefined> =
    this.store.select(QuestionGameState.currentPlayerUsedUnoReverse);
  currentQuestion$: Observable<string | undefined> = this.store.select(
    QuestionGameState.getCurrentQuestion
  );
  currentPlayer$: Observable<string | undefined> = this.store.select(
    QuestionGameState.getCurrentPlayer
  );
  isGameOver$: Observable<boolean | undefined> = this.store.select(
    QuestionGameState.isGameOver
  );
  player1Score$: Observable<number | undefined> = this.store.select(
    QuestionGameState.getPlayer1Score
  );
  player2Score$: Observable<number | undefined> = this.store.select(
    QuestionGameState.getPlayer2Score
  );
  winner$: Observable<string | undefined> = this.store.select(
    QuestionGameState.getWinner
  );

  playerQuestions = new FormGroup({
    questions: new FormArray<FormControl<string | null>>([]),
  });

  pointsControl = new FormControl<number>(1, [
    Validators.required,
    Validators.max(3),
    Validators.min(1),
  ]);

  ngOnInit(): void {
    this.game$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((game) => {
      let controls: FormControl<string | null>[] = [];
      for (let i = 0; i < game?.numberOfQuestions!; i++) {
        controls.push(new FormControl<string>('', Validators.required));
      }
      this.playerQuestions = new FormGroup({
        questions: new FormArray(controls),
      });
    });
  }

  onBackButtonClick() {
    this.store.dispatch(new BackToGamesOverview());
  }

  onQuestionsSubmit() {
    this.store.dispatch(
      new SubmitPlayerQuestions(
        this.playerQuestions.controls.questions.controls.map(
          (control) => control.value!
        )
      )
    );
    this.playerQuestions.reset();
  }

  onPointsSubmit() {
    this.store.dispatch(new SubmitPlayerPoints(this.pointsControl.value!));
  }

  onUnanswered() {
    this.store.dispatch(new UnansweredQuestion());
  }

  onUnoReverse() {
    this.store.dispatch(new UnoReverseUsed());
  }
}
