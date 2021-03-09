import { Component, OnInit } from '@angular/core';
import {faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bingo-setting',
  templateUrl: './bingo-setting.component.html',
  styleUrls: ['../app.component.scss', './bingo-setting.component.scss']
})
export class BingoSettingComponent implements OnInit {
  faHome = faHome;
  constructor() { }

  ngOnInit(): void {
  }

}
