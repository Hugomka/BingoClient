import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {faHome, faShare} from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink} from '@angular/router';
import {BingoSettingService} from '../services/bingo-setting.service';
import {BingoUser} from '../interfaces/bingo-user';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  selector: 'app-bingo-setting',
  templateUrl: './bingo-setting.component.html',
  styleUrls: ['../app.component.scss', './bingo-setting.component.scss']
})
export class BingoSettingComponent implements OnInit {
  faHome = faHome;
  faReturn = faShare;

  bingoUser: BingoUser = {
    id: '',
    username: '',
    backgroundColor: '#2e366c'
  };

  minimumNumber = 1;
  maximumNumber = 75;
  cardType: 'default' | 'random' | 'special' = 'default';

  colorOptions: string[] = ['#2e366c', '#114b11', '#75286b', '#b2cefe', '#bbed91', '#f0d0f0'];

  constructor(
    private router: Router,
    private bingoSettingService: BingoSettingService
  ) {
  }

  ngOnInit(): void {
    this.bingoUser = {
      id: localStorage.getItem('userId') ?? '',
      username: localStorage.getItem('username') ?? '',
      backgroundColor: localStorage.getItem('backgroundColor') ?? '#2e366c'
    };
  }

  selectBackgroundColor(color: string): void {
    this.bingoUser.backgroundColor = color;
  }

  saveAndReturn(): void {
    localStorage.setItem('username', this.bingoUser.username);
    localStorage.setItem('backgroundColor', this.bingoUser.backgroundColor);

    if (!this.bingoUser.id) {
      this.router.navigate(['']);
      return;
    }

    this.bingoSettingService.update(this.bingoUser).subscribe({
      next: () => this.router.navigate(['']),
      error: () => this.router.navigate(['']),
    });
  }
}
