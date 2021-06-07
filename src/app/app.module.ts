import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BingoCardComponent } from './bingo-card/bingo-card.component';
import { AppRoutingModule } from './app-routing.module';
import { BingoMillComponent } from './bingo-mill/bingo-mill.component';
import { BingoSettingComponent } from './bingo-setting/bingo-setting.component';
import { BingoStartComponent } from './bingo-start/bingo-start.component';
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { BingoBallComponent } from './bingo-ball/bingo-ball.component';
import {HttpClientModule} from '@angular/common/http';
import {BingoWindowComponent} from './bingo-window/bingo-window.component';

@NgModule({
  declarations: [
    AppComponent,
    BingoCardComponent,
    BingoMillComponent,
    BingoSettingComponent,
    BingoStartComponent,
    BingoBallComponent,
    BingoWindowComponent,
    FaIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
