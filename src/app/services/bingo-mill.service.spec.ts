import { TestBed } from '@angular/core/testing';

import { BingoMillService } from './bingo-mill.service';

describe('BingoMillService', () => {
  let service: BingoMillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BingoMillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
