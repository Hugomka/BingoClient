import { Component, OnInit } from '@angular/core';
import {BingoMill} from '../interfaces/bingo-mill';
import {BingoMillService} from '../services/bingo-mill.service';
import {BingoCardType} from '../enums/bingo-card-type';

@Component({
  selector: 'app-bingo-ball',
  templateUrl: './bingo-ball.component.html',
  styleUrls: ['../app.component.scss', './bingo-ball.component.scss']
})
export class BingoBallComponent implements OnInit{
  bingoMill: BingoMill;
  drawnNumber: number;
  drawnNumbers: number[] = [];
  minimumNumber = 1;
  paused = false;
  timerCounter = 15;


  constructor(private bingoMillService?: BingoMillService ) {
    this.bingoMill = {
      id: '',
      drawNumbers: '',
      bingoCardType: BingoCardType.normal,
      maximumNumber: 75,
      minimumNumber: 1
    };
  }

  async ngOnInit(): Promise<void> {
    this.bingoMill = await this.bingoMillService.open(this.bingoMill).toPromise();
    console.log(`BingoMill opened with id: ${this.bingoMill.id}`);
    console.log(`Loading BingoMill's draw numbers: ${this.bingoMill.drawNumbers}`);
    if (this.bingoMill.drawNumbers !== '') {
      const drawnNumbersInString: string[] = this.bingoMill.drawNumbers.split(';').join('').split('#');
      this.drawnNumbers = drawnNumbersInString.slice(1).map(Number);
      this.drawnNumber = this.drawnNumbers[this.drawnNumbers.length - 1];
    }
    console.log(`Drawn numbers: ${this.drawnNumbers}`);
  }

  async drawNumber(): Promise<void> {
    const min = this.bingoMill.minimumNumber;
    const max = this.bingoMill.maximumNumber;
    let justDraw: number;
    justDraw = await this.bingoMillService.drawNumber(this.bingoMill).toPromise();
    if (justDraw === 0) {
      while (true) {
        justDraw = Math.floor(Math.random() * max + min);
        if (this.drawnNumbers.length >= max) {
          break;
        }
        if (!this.containNumber(justDraw)) {
          break;
        }
      }
      this.drawnNumbers.push(justDraw);
    }
    this.drawnNumber = justDraw;
  }

  containNumber(num: number): boolean {
    for (const i of this.drawnNumbers) {
      if (num === i) {
        return true;
      }
    }
    return false;
  }

  pause(paused: boolean): void {
    this.paused = paused;
    this.bingoMillService.pause(this.bingoMill, paused);
  }
}
