import { Component, inject, OnInit } from '@angular/core';
import { GamesOverviewState } from './store/games-overview.state';
import { Observable } from 'rxjs';
import { Game } from '../../../local-storage/models/game.model';
import { Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  CreateNewGame,
  InitGames,
  ToggleGameCreationMode,
} from './store/games-overview.actions';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface GameForm {
  name: FormControl<string | null>;
  player1: FormControl<string | null>;
  player2: FormControl<string | null>;
}

@Component({
  selector: 'app-games-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './games-overview.component.html',
})
export class GamesOverviewComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  games$: Observable<Game[]> = this.store.select(GamesOverviewState.getGames);
  isGameBeingCreated$: Observable<boolean> = this.store.select(
    GamesOverviewState.isGameBeingCreated
  );

  public form: FormGroup<GameForm> = this.fb.group({
    name: ['', Validators.required],
    player1: ['', Validators.required],
    player2: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.dispatch(new InitGames());
  }

  onToggleGameCreationMode() {
    if (this.store.selectSnapshot(GamesOverviewState.isGameBeingCreated)) {
      this.form.reset();
    }
    this.store.dispatch(new ToggleGameCreationMode());
  }

  onGameSubmit() {
    this.store.dispatch(
      new CreateNewGame(
        this.form.controls.name.value!,
        this.form.controls.player1.value!,
        this.form.controls.player2.value!
      )
    );
    this.form.reset();
  }
}
