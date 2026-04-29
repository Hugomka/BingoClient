import { Routes } from '@angular/router';
import { BingoStartComponent } from './bingo-start/bingo-start.component';
import { BingoCardComponent } from './bingo-card/bingo-card.component';
import { BingoMillComponent } from './bingo-mill/bingo-mill.component';
import { BingoSettingComponent } from './bingo-setting/bingo-setting.component';

export const routes: Routes = [
  { path: '', component: BingoStartComponent },
  { path: 'play', component: BingoCardComponent },
  { path: 'lead', component: BingoMillComponent },
  { path: 'setting', component: BingoSettingComponent }
];

