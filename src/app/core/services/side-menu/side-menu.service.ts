import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OrganizationModuleGroup } from 'src/app/core/models/settings/organization-modules';
import { SideMenuStore } from "src/app/stores/side-menu.store";

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  constructor(private _http: HttpClient) { }

  getAllItems(params?:string): Observable<OrganizationModuleGroup[]> {
    return this._http.get<OrganizationModuleGroup[]>('/settings/module-settings' + (params ? params : '')).pipe(
      map((res: OrganizationModuleGroup[]) => {
        for(let i of res){
          i.isEnabled = i.active == 1 ? true : false;
          for(let j of i.modules){
            j.isEnabled = j.active == 1 ? true : false;
          }
        }
        console.log(res);
        SideMenuStore.setSideMenuItems(res);
        return res;
      })
    );
  }

}
