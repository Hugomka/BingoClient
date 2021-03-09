import { Component, OnInit } from '@angular/core';
import {MockBingoCard} from '../mock-bingo-card';
import {getNumber} from '../interfaces/bingo-row';
import {faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bingo-card',
  templateUrl: './bingo-card.component.html',
  styleUrls: ['../app.component.scss', './bingo-card.component.scss']
})
export class BingoCardComponent implements OnInit {

  bingoCard = MockBingoCard;
  drawNumber = '16';
  faHome = faHome;

  constructor() { }

  ngOnInit(): void {
  }

  get(numbers: string, index: number): string {
    return getNumber(numbers, index);
  }
}
