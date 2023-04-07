import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRole, UserRolePaginationResponse } from '../../../../models/human-capital/users/user-role';
import { map } from 'rxjs/operators';
import { UserRoleStore } from 'src/app/stores/human-capital/users/user-role.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,) { }

  getItems(getAll: boolean = false): Observable<UserRolePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${UserRoleStore.currentPage}`;
     }

    return this._http.get<UserRolePaginationResponse>('/users/'+UsersStore.user_id+'/roles-and-responsibilities' + (params ? params : '')).pipe(
      map((res: UserRolePaginationResponse) => {
        res['data'].forEach((element,index)=> {
            element['is_accordion_active']=false; 
        });
        UserRoleStore.setUserRoleDetails(res);
        return res;
      })
    );
  }

  

  getItem(id: number): Observable<UserRole> {
    return this._http.get<UserRole>('/users/'+UsersStore.user_id+'/roles-and-responsibilities/' + id).pipe(
      map((res: UserRole) => {
        res['is_accordion_active'] = true;
        UserRoleStore.updateUserRole(res);
        UserRoleStore.setIndividualRoleDetails(res);
        return res;
      })
    );
  }

  updateItem(id, item: UserRole): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/roles-and-responsibilities/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems().subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item: UserRole) {
    return this._http.post('/users/'+UsersStore.user_id+'/roles-and-responsibilities', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/users/'+UsersStore.user_id+'/roles-and-responsibilities/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  

 
  setSelectedDocumentDetails(imageDetails,type){
    UserRoleStore.setSelectedDocumentDetails(imageDetails);
  }

 
  setDocumentDetails(imageDetails,url,type){
    UserRoleStore.setDocumentDetails(imageDetails,url,type);
  }

  setaccordion(index,value){
        UserRoleStore.userRoleDetails[index]['is_accordion_active']=value;
        if(value==true){
          for(let i=0;i<UserRoleStore.userRoleDetails.length;i++){
            if(i!=index){
              UserRoleStore.userRoleDetails[index]['is_accordion_active']=false;
            }
          }
        }
  }



 
}
