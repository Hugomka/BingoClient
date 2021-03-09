import { NgModule } from '@angular/core';
import {BingoCardComponent} from './bingo-card/bingo-card.component';
import {BingoMillComponent} from './bingo-mill/bingo-mill.component';
import {BingoSettingComponent} from './bingo-setting/bingo-setting.component';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BingoStartComponent} from './bingo-start/bingo-start.component';

const routes: Routes = [
  { path: '', component: BingoStartComponent },
  { path: 'play', component: BingoCardComponent },
  { path: 'lead', component: BingoMillComponent },
  { path: 'setting', component: BingoSettingComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
