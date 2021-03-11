import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bingo-ball',
  templateUrl: './bingo-ball.component.html',
  styleUrls: ['./bingo-ball.component.scss']
})
export class BingoBallComponent implements OnInit {
  drawnNumber: number;
  drawnNumbers: number[] = [];
  minimumNumber = 1;
  maximumNumber = 75;
  paused = false;
  timerCounter = 15;

  constructor() {
  }

  ngOnInit(): void {
  }

  drawNumber(): void {
    const min = this.minimumNumber;
    const max = this.maximumNumber + 1;
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
}
