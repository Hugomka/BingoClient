import {Observable, of} from 'rxjs';

export class BingoService {
  protected URL = 'http://localhost:8080/api';

  handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation}: ${error}`);
      return of(result as T);
    };
  }
}
