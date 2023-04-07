import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private _http:HttpClient) { }

  changePassword(item){
    return this._http.post('/change-password',item).pipe(
      map((res ) => {
        return res;
      })
    );
  }
}
