import { TestBed } from '@angular/core/testing';

import { BingoCardService } from './bingo-card.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoCardService', () => {
  let service: BingoCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BingoCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
