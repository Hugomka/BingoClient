import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {BingoUser} from '../interfaces/bingo-user';
import {BingoWindowComponent} from '../bingo-window/bingo-window.component';
import {Router} from '@angular/router';
import {BingoUserService} from '../services/bingo-user.service';
import {BingoMillService} from '../services/bingo-mill.service';
import {BingoMill} from '../interfaces/bingo-mill';
import {BingoCardType} from '../enums/bingo-card-type';

@Component({
  selector: 'app-bingo-start',
  templateUrl: './bingo-start.component.html',
  styleUrls: ['../app.component.scss', './bingo-start.component.scss']
})
export class BingoStartComponent implements OnInit, AfterContentInit {
  faBars = faBars;
  bingoUser: BingoUser;
  bingoMill: BingoMill;
  @ViewChild(BingoWindowComponent)
  bingoWindow: BingoWindowComponent = new BingoWindowComponent();

  constructor(private route: Router, private bingoUserService: BingoUserService, private bingoMillService: BingoMillService) {
  }

  async ngOnInit(): Promise<void> {
    this.bingoUser = {
      id: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      backgroundColor: localStorage.getItem('backgroundColor')
    };
    console.log(`The bingo user ID is ${this.bingoUser.id} from localStorage in bingo-start component on init.`);
    if (localStorage.getItem('millId') === null) {
      const newMill: BingoMill = {id: '', bingoCardType: BingoCardType.normal, drawNumbers: '', minimumNumber: 1, maximumNumber: 75};
      this.bingoMill = await this.bingoMillService.open(newMill).toPromise();
      localStorage.setItem('millId', this.bingoMill.id);
    }
    else {
      this.bingoMill = await this.bingoMillService.get(localStorage.getItem('millId')).toPromise();
    }
    console.log(`The bingo mill ID is ${this.bingoMill.id} from localStorage in bingo-start component on init.`);
  }

  ngAfterContentInit(): void {
  }

  participate(): void {
    if (this.bingoUser.id === null) {
      this.bingoWindow.showWindow('Beste deelnemer, kun je hier je naam invullen?', true, 'ask-username');
    } else {
      this.route.navigate(['/play']).then();
    }
  }

  async windowClosed(event: string, inputValue: string): Promise<void> {
    if (inputValue === '') {
      this.participate();
    } else if (event !== 'close') {
      if (event === 'submit') {
        let newBingoUser: BingoUser = {id: '', backgroundColor: '#2e366c', username: inputValue};
        newBingoUser = await this.bingoUserService.create(newBingoUser).toPromise();
        await localStorage.clear();
        console.log(`Created new user with username: ${newBingoUser.username} from bingo-start component.`);
        await localStorage.setItem('userId', newBingoUser.id);
        await localStorage.setItem('username', newBingoUser.username);
        await localStorage.setItem('backgroundColor', newBingoUser.backgroundColor);
        this.route.navigate(['/play']).then();
      }
    }
  }
}
