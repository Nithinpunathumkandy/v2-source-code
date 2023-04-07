import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QlikService {

  constructor(private _http: HttpClient) { }

  getQlikTicketAuth(): Observable<any> {
    return this._http.get('/qlik/ticket').pipe((
      map((res: any) => {
        return res;
      })
    ))
  }
}
