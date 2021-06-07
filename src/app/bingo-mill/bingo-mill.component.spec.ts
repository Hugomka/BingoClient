import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoMillComponent } from './bingo-mill.component';
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from '../app-routing.module';
import { BingoBallComponent } from '../bingo-ball/bingo-ball.component';

describe('BingoMillComponent', () => {
  let component: BingoMillComponent;
  let fixture: ComponentFixture<BingoMillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoMillComponent, BingoBallComponent, FaIconComponent ],
      imports: [ AppRoutingModule, FontAwesomeModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoMillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
