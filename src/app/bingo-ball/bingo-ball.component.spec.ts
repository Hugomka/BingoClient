import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoBallComponent } from './bingo-ball.component';

describe('BingoBallComponent', () => {
  let component: BingoBallComponent;
  let fixture: ComponentFixture<BingoBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoBallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
