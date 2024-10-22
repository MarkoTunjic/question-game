import { Routes } from '@angular/router';
import { GamesOverviewComponent } from './features/games-overview/games-overview.component';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

export const routes: Routes = [
  {
    path: '',
    component: GamesOverviewComponent,
    providers: [importProvidersFrom(NgxsModule.forFeature([]))],
  },
];
