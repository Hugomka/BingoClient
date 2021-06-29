import {Component, OnInit, ViewChild} from '@angular/core';
import {faHome, faPauseCircle, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import {BingoBallComponent} from '../bingo-ball/bingo-ball.component';

@Component({
  selector: 'app-bingo-mill',
  templateUrl: './bingo-mill.component.html',
  styleUrls: ['../app.component.scss', './bingo-mill.component.scss']
})
export class BingoMillComponent implements OnInit {
  faHome = faHome;
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
  }

  ngOnInit(): void {}

  fillNumbers(rowIndex: number): number[] {
    const min = this.bingoBallComponent.bingoMill.minimumNumber;
    const max = this.bingoBallComponent.bingoMill.maximumNumber + 1;
    const from = rowIndex * 10 + min;
    const to = from + 10;
    if (max > to) {
      return Array.from(Array(to - from), (x, i) => i + from);
    } else {
      return Array.from(Array(max - from), (x, i) => i + from);
    }
  }

  amountRows(): number[] {
    const min = this.bingoBallComponent.bingoMill.minimumNumber;
    const max = this.bingoBallComponent.bingoMill.maximumNumber + 1;
    let rows = Math.floor((max - min) / 10);
    if ((max - min) % 10 > 0) {
      rows += 1;
    }
    return Array.from(Array(rows), (x, i) => i);
  }

  startTimer(): void {
    this.bingoBallComponent.pause(false);
    console.log('Game continued');
  }

  pauseTimer(): void {
    this.bingoBallComponent.pause(true);
    console.log('Game paused');
  }
}
