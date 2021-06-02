import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { BingoUser } from '../interfaces/bingo-user';
import { BingoService } from './bingo.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BingoUserService extends BingoService {

  private rootUrl = `${this.URL}/bingoUser`;

  constructor(private http: HttpClient) {
    super();
  }

  create(bingoUser: BingoUser): Observable<BingoUser> {
    const url = `${this.rootUrl}/create`;
    return this.http.post<BingoUser>(url, bingoUser).pipe(
      catchError(this.handleError<BingoUser>('createBingoUser'))
    );
  }

  get(id: string): Observable<BingoUser> {
    const url = `${this.rootUrl}/${id}`;
    return this.http.get<BingoUser>(url).pipe(
      catchError(this.handleError<BingoUser>(`getBingoUser id=${id}`))
    );
  }
}
