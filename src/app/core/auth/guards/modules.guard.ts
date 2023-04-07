import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Injectable({
  providedIn: 'root'
})
export class ModulesGuard implements Resolve<any> {
  constructor(private _http: HttpClient) { }

  resolve(): Observable<any> {
    return this._http.get<any>('/module-settings?side_menu=true').pipe(
      map((res: any) => {
        for(let i of res){
            i.isEnabled = i.active == 1 ? true : false;
            for(let j of i.modules){
              j.isEnabled = j.active == 1 ? true : false;
            }
        }
        OrganizationModulesStore.setOrganizationModules(res);
        return res;
      })
    );
  }


}
