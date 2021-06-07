import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoStartComponent } from './bingo-start.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BingoWindowComponent } from '../bingo-window/bingo-window.component';

describe('BingoStartComponent', () => {
  let component: BingoStartComponent;
  let fixture: ComponentFixture<BingoStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoStartComponent, BingoWindowComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, FontAwesomeModule ]
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
