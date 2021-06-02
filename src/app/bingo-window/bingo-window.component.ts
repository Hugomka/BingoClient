import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bingo-window',
  templateUrl: './bingo-window.component.html',
  styleUrls: ['../app.component.scss', './bingo-window.component.scss']
})
export class BingoWindowComponent implements OnInit {
  isShow: boolean;
  needInput: boolean;
  inputValue = '';
  content: string;
  callbackId: string;
  faTimes = faTimes;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onWindowClose: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.inputValue.length > 0) {
      this.hide();
      this.onWindowClose.emit(['submit', this.inputValue]);
    }
    else {
      console.log('The input is empty');
    }
  }

  onKey(event: any): void {
    this.inputValue = event.target.value;
    if (event.keyCode === 13) {
      this.submit();
    }
  }

  showWindow(content: string, needInput: boolean, callbackId: string): void {
    this.content = content;
    this.needInput = needInput;
    this.callbackId = callbackId;
    this.isShow = true;
  }

  hide(): void {
    this.isShow = false;
    this.onWindowClose.emit(['close', this.callbackId]);
  }
}
