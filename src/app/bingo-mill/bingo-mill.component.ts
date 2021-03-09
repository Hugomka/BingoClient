import {Component, OnInit} from '@angular/core';
import {faHome, faPauseCircle, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import {BingoMill} from '../interfaces/bingo-mill';
import {CardType} from '../enums/card-type';

@Component({
  selector: 'app-bingo-mill',
  templateUrl: './bingo-mill.component.html',
  styleUrls: ['../app.component.scss', './bingo-mill.component.scss']
})
export class BingoMillComponent implements OnInit {
  faHome = faHome;
  bingoMill: BingoMill;
  participantsCounter = 0;
  timerCounter = 15;
  paused = false;
  faPlay = faPlayCircle;
  faPause = faPauseCircle;
  drawnNumber: number;
  winner1: string;
  winner2: string;
  winner3: string;
  winnerFull: string;

  drawnNumbers: number[] = [];

  constructor() {
    this.bingoMill = { cardType: CardType.default, minimumNumber: 1, maximumNumber: 75};
  }

  ngOnInit(): void {
  }

  fillNumbers(rowIndex: number): number[] {
    const min = this.bingoMill.minimumNumber;
    const max = this.bingoMill.maximumNumber + 1;
    const from = rowIndex * 10 + min;
    const to = from + 10;
    if (max > to) {
      return Array.from(Array(to - from), (x, i) => i + from);
    } else {
      return Array.from(Array(max - from), (x, i) => i + from);
    }
  }

  amountRows(): number[] {
    const min = this.bingoMill.minimumNumber;
    const max = this.bingoMill.maximumNumber + 1;
    let rows = Math.floor((max - min) / 10);
    if ((max - min) % 10 > 0) {
      rows += 1;
    }
    return Array.from(Array(rows), (x, i) => i);
  }

  drawNumber(): void {
    const min = this.bingoMill.minimumNumber;
    const max = this.bingoMill.maximumNumber + 1;
    let justDraw;
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

  startTimer(): void {
    this.paused = false;
  }

  pauseTimer(): void {
    this.paused = true;
  }
}
