import {BingoCard} from './interfaces/bingo-card';

export class Mockup {
  addNumbers: number[] = [];

  mockBingoCard: BingoCard = {
    id: '00000000-0000-0000-0000-000000000000',
    bingoRows: [
      {
        id: '00000000-0000-0000-0000-000000000001',
        numbers: `${this.rnd(1, 15)}, ${this.rnd(16, 30)}, ${this.rnd(31, 45)}, ${this.rnd(46, 60)}, ${this.rnd(61, 75)}`
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        numbers: `${this.rnd(1, 15)}, ${this.rnd(16, 30)}, ${this.rnd(31, 45)}, ${this.rnd(46, 60)}, ${this.rnd(61, 75)}`
      },
      {id: '00000000-0000-0000-0000-000000000003', numbers: `${this.rnd(1, 15)}, ${this.rnd(16, 30)}, *, ${this.rnd(46, 60)}, ${this.rnd(61, 75)}`},
      {
        id: '00000000-0000-0000-0000-000000000004',
        numbers: `${this.rnd(1, 15)}, ${this.rnd(16, 30)}, ${this.rnd(31, 45)}, ${this.rnd(46, 60)}, ${this.rnd(61, 75)}`
      },
      {id: '00000000-0000-0000-0000-000000000005', numbers: `${this.rnd(1, 15)}, ${this.rnd(16, 30)}, ${this.rnd(31, 45)}, ${this.rnd(46, 60)}, ${this.rnd(61, 75)}`}
    ],
    bingoUser: {
      id: '00000000-0000-0000-0000-000000000006',
      username: 'MockUser',
      backgroundColor: '#2e366c'
    }
  };

  rnd(min: number, max: number): number {
    while (true) {
      const num = Math.floor(Math.random() * max + min);
      if (!this.addNumbers.includes(num)) {
        this.addNumbers.push(num);
        return num;
      }
    }
  }

}
