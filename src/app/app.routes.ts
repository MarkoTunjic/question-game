import { Routes } from '@angular/router';
import { GamesOverviewComponent } from './features/games-overview/games-overview.component';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { GamesOverviewState } from './features/games-overview/store/games-overview.state';
import { QuestionGameComponent } from './features/question-game/question-game.component';
import { QuestionGameState } from './features/question-game/store/question-game.state';
import { GameResolverService } from './features/question-game/game-resolver.service';

export const routes: Routes = [
  {
    path: '',
    component: GamesOverviewComponent,
    providers: [
      importProvidersFrom(NgxsModule.forFeature([GamesOverviewState])),
    ],
  },
  {
    path: 'games/question-game/:gameId',
    component: QuestionGameComponent,
    providers: [
      importProvidersFrom(NgxsModule.forFeature([QuestionGameState])),
    ],
    resolve: { game: GameResolverService },
  },
];
