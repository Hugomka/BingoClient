import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class BingoService {
  protected URL = environment.apiUrl;

  handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      if (error instanceof HttpErrorResponse) {
        console.error(`${operation} failed — status ${error.status}: ${error.message}`);
      } else {
        console.error(`${operation} failed:`, error);
      }
      return of(result as T);
    };
  }
}
