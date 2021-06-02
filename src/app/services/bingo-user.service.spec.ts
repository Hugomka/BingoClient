import { TestBed } from '@angular/core/testing';

import { BingoUserService } from './bingo-user.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoUserService', () => {
  let service: BingoUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BingoUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
