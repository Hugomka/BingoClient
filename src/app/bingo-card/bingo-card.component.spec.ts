import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoCardComponent } from './bingo-card.component';
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { BingoBallComponent } from '../bingo-ball/bingo-ball.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoCardComponent', () => {
  let component: BingoCardComponent;
  let fixture: ComponentFixture<BingoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoCardComponent, BingoBallComponent, FaIconComponent ],
      imports: [ HttpClientTestingModule, FontAwesomeModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
