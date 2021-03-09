import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoStartComponent } from './bingo-start.component';

describe('BingoStartComponent', () => {
  let component: BingoStartComponent;
  let fixture: ComponentFixture<BingoStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
