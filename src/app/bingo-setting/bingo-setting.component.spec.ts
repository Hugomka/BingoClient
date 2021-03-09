import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoSettingComponent } from './bingo-setting.component';

describe('BingoSettingComponent', () => {
  let component: BingoSettingComponent;
  let fixture: ComponentFixture<BingoSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
