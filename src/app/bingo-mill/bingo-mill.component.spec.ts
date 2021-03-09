import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoMillComponent } from './bingo-mill.component';

describe('BingoMillComponent', () => {
  let component: BingoMillComponent;
  let fixture: ComponentFixture<BingoMillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoMillComponent ]
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
