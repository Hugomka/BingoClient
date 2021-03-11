import {Component, OnInit, ViewChild} from '@angular/core';
import {faHome, faPauseCircle, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import {BingoMill} from '../interfaces/bingo-mill';
import {BingoBallComponent} from '../bingo-ball/bingo-ball.component';
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
  faPlay = faPlayCircle;
  faPause = faPauseCircle;
  winner1: string;
  winner2: string;
  winner3: string;
  winnerFull: string;

  @ViewChild(BingoBallComponent)
  bingoBallComponent: BingoBallComponent = new BingoBallComponent();

  constructor() {
    this.bingoMill = {
      cardType: CardType.default,
      maximumNumber: 75,
      minimumNumber: 1
    };
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

  startTimer(): void {
    this.bingoBallComponent.paused = false;
  }

  pauseTimer(): void {
    this.bingoBallComponent.paused = true;
  }
}
