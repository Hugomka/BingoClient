import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BingoMillComponent } from './bingo-mill.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BingoBallComponent } from '../bingo-ball/bingo-ball.component';
import { provideRouter } from '@angular/router';

describe('BingoMillComponent', () => {
  let component: BingoMillComponent;
  let fixture: ComponentFixture<BingoMillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BingoMillComponent, BingoBallComponent, FontAwesomeModule ],
      providers: [ provideRouter([]) ]
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
