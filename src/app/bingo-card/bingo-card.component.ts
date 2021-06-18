import {Component, OnInit, ViewChild} from '@angular/core';
import {faHome, faToggleOn, faToggleOff, faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {BingoCardService} from '../services/bingo-card.service';
import {BingoBallComponent} from '../bingo-ball/bingo-ball.component';
import {BingoCard} from '../interfaces/bingo-card';

@Component({
  selector: 'app-bingo-card',
  templateUrl: './bingo-card.component.html',
  styleUrls: ['../app.component.scss', './bingo-card.component.scss']
})
export class BingoCardComponent implements OnInit {
  bingoCard: BingoCard = {id: '', bingoUser: {id: '', username: '', backgroundColor: ''}, bingoRows: []};
  drawNumber = '';
  faHome = faHome;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faBullhorn = faBullhorn;
  stampedNumbers = [];
  automatic = true;
  winner = false;
  @ViewChild(BingoBallComponent)
  bingoBallComponent = new BingoBallComponent();

  constructor(private bingoCardService: BingoCardService) {
  }

  ngOnInit(): void {
  }

  stamp(num: string): void {
    if (this.isStamped(num)) {
      this.stampedNumbers.forEach((value, index) => {
        if (value === num) {
          this.stampedNumbers.splice(index, 1);
        }
      });
    }
    else {
      this.stampedNumbers.push(num);
    }
  }

  isStamped(num: string): boolean {
    for (const value of this.stampedNumbers) {
      if (value === num) {
        return true;
      }
    }
    return false;
  }

  toggleAutomatic(): void {
    this.automatic = !this.automatic;
  }

  callBingo(): void {
    this.bingoCardService.callBingo(this.bingoCard).subscribe(winner => this.winner = winner);
  }

  getDrawnNumbers(): string {
    let numbers = '';
    const s = '&nbsp;';
    const ds = '<div class="circle">';
    const de = '</div>';
    for (const num of this.bingoBallComponent.drawnNumbers) {
      if (num !== this.bingoBallComponent.drawnNumber) {
        if (num < 10) {
          numbers = `${ds}${s}${num}${s} ${numbers}${de}`;
        }
        else {
          numbers = `${ds}${num} ${numbers}${de}`;
        }
      }
    }
    return numbers;
  }
}
