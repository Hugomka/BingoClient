import { TestBed } from '@angular/core/testing';

import { BingoSettingService } from './bingo-setting.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoSettingService', () => {
  let service: BingoSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BingoSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
