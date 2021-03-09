import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BingoCardComponent } from './bingo-card/bingo-card.component';
import { AppRoutingModule } from './app-routing.module';
import { BingoMillComponent } from './bingo-mill/bingo-mill.component';
import { BingoSettingComponent } from './bingo-setting/bingo-setting.component';
import { BingoStartComponent } from './bingo-start/bingo-start.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    BingoCardComponent,
    BingoMillComponent,
    BingoSettingComponent,
    BingoStartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
