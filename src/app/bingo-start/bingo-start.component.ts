import {Component, OnInit, ViewChild, AfterContentInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {BingoUser} from '../interfaces/bingo-user';
import {BingoWindowComponent} from '../bingo-window/bingo-window.component';
import {Router} from '@angular/router';
import {BingoUserService} from '../services/bingo-user.service';

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

  constructor(private route: Router, private bingoUserService: BingoUserService) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
  }

  participate(): void {
    this.bingoWindow.showWindow('Beste deelnemer, kun je hier je naam invullen?', true, 'ask-username');
  }

  windowClosed(event: string, inputValue: string): void {
    if (inputValue === '') {
      this.participate();
    }
    else if (event !== 'close') {
      // todo: fix exception for failed creating user
      if (event === 'submit') {
        const newBingoUser = { id: '', backgroundColor: '#2e366c', username: inputValue };
        this.route.navigate(['/play']).then(() => {
          this.bingoUserService.create(newBingoUser).subscribe(value => this.bingoUser = value, error => this.bingoUser = null);
          if (this.bingoUser !== null) {
            console.log(`User with name ${inputValue} is created`);
          }
          else {
            console.log(`Error: User is not created.`);
          }
        });
      }
    }
  }
}
