import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements Resolve<any> {
  constructor(private _http: HttpClient) { }

  resolve(): Observable<any> {
    return this._http.get<any>('/users/me/activities').pipe(
      map((res: any) => {
        AuthStore.setUserPermissions(res);
        return res;
      })
    );
  }


}
