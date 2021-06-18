import {Component, OnInit, ViewChild, AfterContentInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {BingoUser} from '../interfaces/bingo-user';
import {BingoWindowComponent} from '../bingo-window/bingo-window.component';
import {Router} from '@angular/router';
import {BingoUserService} from '../services/bingo-user.service';
import {BingoCardService} from '../services/bingo-card.service';

@Component({
  selector: 'app-bingo-start',
  templateUrl: './bingo-start.component.html',
  styleUrls: ['../app.component.scss', './bingo-start.component.scss']
})
export class BingoStartComponent implements OnInit, AfterContentInit {
  faBars = faBars;
  bingoUser: BingoUser;
  @ViewChild(BingoWindowComponent)
  bingoWindow: BingoWindowComponent = new BingoWindowComponent();

  constructor(private route: Router, private bingoUserService: BingoUserService, private bingoCardService: BingoCardService) {
  }

  ngOnInit(): void {
    this.bingoUser = {
      id: localStorage.getItem('userid'),
      username: localStorage.getItem('username'),
      backgroundColor: localStorage.getItem('backgroundColor')
    };
    console.log(`The user ID is ${this.bingoUser.id} from localStorage in bingo-start component on init.`);
    if (this.bingoUser.id !== '') {
      this.bingoUserService.get(this.bingoUser.id).subscribe(
        value => {
          this.bingoUser = value;
        },
        error => {
          this.bingoUser = null;
          console.log(error.message);
        }
      );
    }
  }

  ngAfterContentInit(): void {
  }

  participate(): void {
    this.bingoWindow.showWindow('Beste deelnemer, kun je hier je naam invullen?', true, 'ask-username');
  }

  windowClosed(event: string, inputValue: string): void {
    if (inputValue === '') {
      this.participate();
    } else if (event !== 'close') {
      if (event === 'submit') {
        const newBingoUser = {id: '', backgroundColor: '#2e366c', username: inputValue};
        this.route.navigate(['/play']).then(() => {
          this.bingoCardService.create(newBingoUser).subscribe(
            value => {
              localStorage.clear();
              console.log(`Created new user with username: ${value.bingoUser.username} from bingo-start component.`);
              localStorage.setItem('userid', value.bingoUser.id);
              localStorage.setItem('username', value.bingoUser.username);
              localStorage.setItem('backgroundColor', value.bingoUser.backgroundColor);
              this.bingoUser = value.bingoUser;
            },
            error => {
              this.bingoUser = null;
              console.log(error.message);
            });
        });
      }
    }
  }
}
