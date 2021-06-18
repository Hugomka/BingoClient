import { Injectable } from '@angular/core';
import {BingoUserService} from './bingo-user.service';
import {BingoUser} from '../interfaces/bingo-user';

@Injectable({
  providedIn: 'root'
})
export class BingoSettingService {

  constructor(private bingoUserService: BingoUserService) { }

  update(bingoUser: BingoUser): any {
    return this.bingoUserService.update(bingoUser);
  }
}
