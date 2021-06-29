import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import { faHome, faShare } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {BingoSettingService} from '../services/bingo-setting.service';
import {BingoUser} from '../interfaces/bingo-user';

@Component({
  selector: 'app-bingo-setting',
  templateUrl: './bingo-setting.component.html',
  styleUrls: ['../app.component.scss', './bingo-setting.component.scss']
})
export class BingoSettingComponent implements OnInit, AfterViewInit {
  faHome = faHome;
  faReturn = faShare;
  bingoUser: BingoUser;
  constructor(private router: Router,
              private bingoSettingService: BingoSettingService,
              private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.bingoUser = {
      id: localStorage.getItem('id'),
      username: localStorage.getItem('username'),
      backgroundColor: localStorage.getItem('backgroundColor')
    };
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.bingoUser.backgroundColor;
  }

  async saveAndReturn(): Promise<void> {
    await localStorage.setItem('username', this.bingoUser.username);
    await localStorage.setItem('backgroundColor', this.bingoUser.backgroundColor);
    this.router.navigate(['']).then(() => {
      this.bingoSettingService.update(this.bingoUser);
      window.location.reload();
    });
  }
}
