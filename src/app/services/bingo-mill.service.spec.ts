import { TestBed } from '@angular/core/testing';

import { BingoMillService } from './bingo-mill.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoMillService', () => {
  let service: BingoMillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BingoMillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
