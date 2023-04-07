import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AclRole, AclRolePaginationResponse,Acl } from 'src/app/core/models/acl/acl';
import { map } from 'rxjs/operators';
import { AclStore } from 'src/app/stores/acl/acl.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AclService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false,extraParms?): Observable<AclRolePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AclStore.currentPage}`;
     }
     if(extraParms){
      if(params) params += `&${extraParms}`;
      else params += `?${extraParms}`;
    }

    return this._http.get<AclRolePaginationResponse>('/roles' + (params ? params : '')).pipe(
      map((res: AclRolePaginationResponse) => {
        AclStore.setAclRoleDetails(res);
        return res;
      })
    );
  }

  

  getItem(id: number): Observable<AclRole> {
    return this._http.get<AclRole>('/roles/' + id).pipe(
      map((res: AclRole) => {
        AclStore.updateAclRole(res);
        AclStore.setIndividualRoleDetails(res);
        return res;
      })
    );
  }

  getRoleActivities(role_id){
    return this._http.get<Acl[]>('/roles/' + role_id).pipe(
      map((res: Acl[]) => {
        AclStore.setRoleActivities(res);
        return res;
      })
    );
  }

  updateItem(id, item: AclRole): Observable<any> {
    return this._http.put('/roles/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'role_updated');
        this.getItems().subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item: AclRole) {
    return this._http.post('/roles', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'role_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  saveActivity(id,item) {
    return this._http.put('/roles/' + id+'/activities', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'activity_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/roles/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'role_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  searchItem(params){
    return this.getItems(false,params ? params : '').pipe(
      map((res: AclRolePaginationResponse) => {
        AclStore.setAclRoleDetails(res);
        return res;
      })
    );
  }

  UpdateAllUsers(item: AclRole) {
    return this._http.post('/roles/set-activities-all-users', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'activity_set_to_all_users');
        this.getItems().subscribe();
        return res;
      })
    );
  }
}
