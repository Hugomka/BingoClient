import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {BingoCard} from '../interfaces/bingo-card';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {MockBingoCard} from '../mock-bingo-card';
import {BingoService} from './bingo.service';

@Injectable({
  providedIn: 'root'
})
export class BingoCardService extends BingoService {

  private rootUrl = `${this.URL}/bingoCard`;

  constructor(private http: HttpClient) {
    super();
  }

  create(): Observable<BingoCard> {
    const url = `${this.rootUrl}/create`;
    return this.http.get<BingoCard>(url).pipe(
      catchError(this.handleError<BingoCard>('createBingoCard', MockBingoCard))
    );
  }

  update(bingoCard: BingoCard): Observable<BingoCard> {
    const url = `${this.rootUrl}/update`;
    return this.http.patch<BingoCard>(url, bingoCard).pipe(
      catchError(this.handleError<BingoCard>('updateBingoCard'))
    );
  }

  getAll(): Observable<BingoCard[]> {
    const url = `${this.rootUrl}/`;
    return this.http.get<BingoCard[]>(url).pipe(
      catchError(this.handleError<BingoCard[]>('getAllBingoCards', []))
    );
  }

  get(id: string): Observable<BingoCard> {
    const url = `${this.rootUrl}/${id}`;
    return this.http.get<BingoCard>(url).pipe(
      catchError(this.handleError<BingoCard>(`getBingoCard id=${id}`))
    );
  }

  delete(id: string): Observable<boolean> {
    const url = `${this.rootUrl}/${id}`;
    return this.http.delete<boolean>(url).pipe(
      catchError(this.handleError<boolean>(`deleteBingoCard id=${id}`, false))
    );
  }



  callBingo(bingoCard: BingoCard): Observable<boolean> {
    const url = `${this.rootUrl}/${bingoCard.id}?callBingo`;
    return this.http.get<boolean>(url).pipe(
      catchError(this.handleError<boolean>(`callBingo id ${bingoCard.id}`, false))
    );
  }
}
