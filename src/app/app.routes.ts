import { Routes } from '@angular/router';
import { BingoStartComponent } from './bingo-start/bingo-start.component';
import { BingoCardComponent } from './bingo-card/bingo-card.component';
import { BingoMillComponent } from './bingo-mill/bingo-mill.component';
import { BingoSettingComponent } from './bingo-setting/bingo-setting.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: BingoStartComponent, canActivate: [AuthGuard] },
  { path: 'play', component: BingoCardComponent, canActivate: [AuthGuard] },
  { path: 'lead', component: BingoMillComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: BingoSettingComponent, canActivate: [AuthGuard] }
];

