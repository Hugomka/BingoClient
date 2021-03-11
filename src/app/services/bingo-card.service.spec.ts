import { TestBed } from '@angular/core/testing';

import { BingoCardService } from './bingo-card.service';

describe('BingoCardService', () => {
  let service: BingoCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BingoCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
