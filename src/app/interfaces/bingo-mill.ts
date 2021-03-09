import {CardType} from '../enums/card-type';

export interface BingoMill {
  minimumNumber: number;
  maximumNumber: number;
  cardType: CardType;
}
