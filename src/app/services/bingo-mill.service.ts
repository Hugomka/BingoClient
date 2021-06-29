import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BingoMill} from '../interfaces/bingo-mill';
import {BingoService} from './bingo.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BingoMillService extends BingoService {

  private rootUrl = `${this.URL}/bingoMill`;

  constructor(private http: HttpClient) {
    super();
  }

  open(bingoMill: BingoMill): Observable<BingoMill> {
    const url = `${this.rootUrl}/open`;
    return this.http.post<BingoMill>(url, bingoMill).pipe(
      catchError(this.handleError<BingoMill>('openBingoMill'))
    );
  }

  get(id: string): Observable<BingoMill> {
    const url = `${this.rootUrl}/${id}`;
    return this.http.get<BingoMill>(url).pipe(
      catchError(this.handleError<BingoMill>('continueBingoMill'))
    );
  }

  update(bingoMill: BingoMill): Observable<BingoMill> {
    const url = `${this.rootUrl}/update`;
    return this.http.patch<BingoMill>(url, bingoMill).pipe(
      catchError(this.handleError<BingoMill>('updateBingoMill', bingoMill))
    );
  }

  close(id: string): Observable<boolean> {
    const url = `${this.rootUrl}/${id}`;
    return this.http.delete<boolean>(url).pipe(
      catchError(this.handleError<boolean>('closeBingoMill', false))
    );
  }

  drawNumber(bingoMill: BingoMill ): Observable<number> {
    const url = `${this.rootUrl}/${bingoMill.id}/draw`;
    return this.http.get<number>(url).pipe(
      catchError(this.handleError<number>('drawNumberBingoMill', 0))
    );
  }

  pause(bingoMill: BingoMill, pause): void {
    const url = `${this.rootUrl}/${bingoMill.id}?pause=${pause}`;
    this.http.get<BingoMill>(url).pipe(
      catchError(this.handleError('pauseBingo'))
    );
  }
}
