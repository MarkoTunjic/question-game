import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { InitQuestionGame } from './store/question-game.actions';

@Injectable({
  providedIn: 'root',
})
export class GameResolverService {
  private readonly store = inject(Store);

  resolve(route: ActivatedRouteSnapshot) {
    const gameId = route.paramMap.get('gameId')!;
    return this.store.dispatch(new InitQuestionGame(gameId));
  }
}
