import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { Access, AccessibleOrganizationLevels } from 'src/app/core/models/human-capital/users/user-setting';
import { UserAccessStore } from 'src/app/stores/human-capital/users/user-setting/user-access.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(params?:string): Observable<Access[]> {
      return this._http.get<Access[]>('/users/'+UsersStore.user_id+'/accesses/'+(params?params:'')).pipe(
        map((res: Access[]) => {
          UserAccessStore.setAccesses(res,params);
          if(UsersStore.user_id == AuthStore.user.id)
            UserAccessStore.setLoggedUserAccesses(res,params);
          return res;
        })
      );

      
    }

    saveItem(data) {
      return this._http.put('/users/'+UsersStore.user_id+'/accesses', data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          return res;
        })
      );
    }

    getUserAccessConfiguration(params?:string): Observable<Access[]> {
      return this._http.get<Access[]>('/users/'+AuthStore.user.id+'/accesses/'+(params?params:'')).pipe(
        map((res: Access[]) => {
          UserAccessStore.setLoggedUserAccesses(res,params);
          return res;
        })
      );
    }

    getAccessibleOrganizations(): Observable<AccessibleOrganizationLevels[]>{
      return this._http.get<AccessibleOrganizationLevels[]>('/users/me/organizations').pipe(
        map((res: any) => {
          return res;
        })
      );
    }

    getAccessibleDivisions(): Observable<AccessibleOrganizationLevels[]>{
      return this._http.get<AccessibleOrganizationLevels[]>('/users/me/divisions').pipe(
        map((res: any) => {
          UserAccessStore.setAccessibleDivisions(res);
          return res;
        })
      );
    }

    getAccessibleDepartments(): Observable<AccessibleOrganizationLevels[]>{
      return this._http.get<AccessibleOrganizationLevels[]>('/users/me/departments').pipe(
        map((res: any) => {
          UserAccessStore.setAccessibleDepartments(res);
          return res;
        })
      );
    }

    getAccessibleSections(): Observable<AccessibleOrganizationLevels[]>{
      return this._http.get<AccessibleOrganizationLevels[]>('/users/me/sections').pipe(
        map((res: any) => {
          UserAccessStore.setAccessibleSections(res);
          return res;
        })
      );
    }

    getAccessibleSubSections(): Observable<AccessibleOrganizationLevels[]>{
      return this._http.get<AccessibleOrganizationLevels[]>('/users/me/sub-sections').pipe(
        map((res: any) => {
          UserAccessStore.setAccessibleSubSection(res);
          return res;
        })
      );
    }

}
