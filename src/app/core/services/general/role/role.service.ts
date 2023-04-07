import { Injectable } from '@angular/core';
import {Role} from 'src/app/core/models/general/role';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {RoleStore} from 'src/app/stores/general/role.store'


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _http:HttpClient) { }

  getRoles(getAll: boolean = false): Observable<Role> {
    let params = '';
    if (!getAll) {
      //params = `?page=${RoleStore.currentPage}`;
       }

    return this._http.get<Role>('/acl/roles' + (params ? params : '')).pipe(
      map((res: Role) => {
        RoleStore.setRole(res['data']);
        return res;
      })
    );
  }
}
