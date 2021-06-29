import {Component, OnInit, ViewChild} from '@angular/core';
import {faHome, faToggleOn, faToggleOff, faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {BingoCardService} from '../services/bingo-card.service';
import {BingoBallComponent} from '../bingo-ball/bingo-ball.component';
import {BingoCard} from '../interfaces/bingo-card';
import {BingoUser} from '../interfaces/bingo-user';

@Component({
  selector: 'app-bingo-card',
  templateUrl: './bingo-card.component.html',
  styleUrls: ['../app.component.scss', './bingo-card.component.scss']
})
export class BingoCardComponent implements OnInit {
  bingoCard: BingoCard;
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

  async ngOnInit(): Promise<void> {
    const bingoUser: BingoUser = {
      id: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      backgroundColor: localStorage.getItem('backgroundColor')
    };
    this.bingoCard = {id: localStorage.getItem('cardId'), bingoUser, bingoRows: []};
    if (this.bingoCard.id === undefined || this.bingoCard.id === null || this.bingoCard.id === '') {
      this.bingoCard = await this.bingoCardService.create(bingoUser).toPromise();
      console.log(`Creating a new bingo card with id ${this.bingoCard.id}.`);
      await localStorage.setItem('cardId', this.bingoCard.id);
    } else {
      this.bingoCard = await this.bingoCardService.get(this.bingoCard.id).toPromise();
      console.log(`Getting a existed bingo card with id ${this.bingoCard.id}.`);
    }
    this.autoStamp();
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

  autoStamp(): void {
    if (this.automatic) {
      if (this.stampedNumbers.length > 0) {
        this.stamp(`${this.bingoBallComponent.drawnNumber}`);
      }
      else {
        this.bingoBallComponent.drawnNumbers.forEach(n => {
          this.stamp(`${n}`);
        });
      }
    }
  }

  async callBingo(): Promise<void> {
    this.winner = await this.bingoCardService.callBingo(this.bingoCard).toPromise();
  }
}
