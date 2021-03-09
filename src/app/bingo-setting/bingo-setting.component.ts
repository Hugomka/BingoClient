import { Component, OnInit } from '@angular/core';
import {faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bingo-setting',
  templateUrl: './bingo-setting.component.html',
  styleUrls: ['./bingo-setting.component.css']
})
export class BingoSettingComponent implements OnInit {
  faHome = faHome;
  constructor() { }

  ngOnInit(): void {
  }

}
