import {BingoRow} from './bingo-row';
import {BingoUser} from './bingo-user';

export interface BingoCard {
  id: string;
  bingoRows: BingoRow[];
  bingoUser: BingoUser;
}
