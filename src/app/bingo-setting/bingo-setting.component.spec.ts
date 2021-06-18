import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoSettingComponent } from './bingo-setting.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BingoSettingComponent', () => {
  let component: BingoSettingComponent;
  let fixture: ComponentFixture<BingoSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoSettingComponent ],
      imports: [ FontAwesomeModule, RouterTestingModule, HttpClientTestingModule ]
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
