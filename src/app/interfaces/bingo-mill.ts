import {BingoCardType} from '../enums/bingo-card-type';

export interface BingoMill {
  id: string;
  drawNumbers: string;
  minimumNumber: number;
  maximumNumber: number;
  bingoCardType: BingoCardType;
}
