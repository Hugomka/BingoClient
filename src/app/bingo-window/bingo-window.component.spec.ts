import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoWindowComponent } from './bingo-window.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('BingoWindowComponent', () => {
  let component: BingoWindowComponent;
  let fixture: ComponentFixture<BingoWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoWindowComponent ],
      imports: [ FontAwesomeModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
