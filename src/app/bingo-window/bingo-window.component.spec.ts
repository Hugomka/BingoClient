import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoWindowComponent } from './bingo-window.component';

describe('BingoWindowComponent', () => {
  let component: BingoWindowComponent;
  let fixture: ComponentFixture<BingoWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoWindowComponent ]
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
