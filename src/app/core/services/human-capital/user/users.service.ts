import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';
import { Users,UserPaginationResponse,UserCount, UserRole, RolePaginationResponse } from 'src/app/core/models/human-capital/users/users';
import { IndividualUser } from 'src/app/core/models/human-capital/users/users';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';




@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }

  getAllItems(params:string=''): Observable<UserPaginationResponse> {
    if(UsersStore.searchText){
      params += (params ? '&q=' : '?q=')+UsersStore.searchText;
      // this.getUserCount();
    } 
    if(RightSidebarLayoutStore.filterPageTag == 'users' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<UserPaginationResponse>('/users'+ (params ? params : '')).pipe(
      map((res: UserPaginationResponse) => {
          UsersStore.setUsers(res);
          
          // this.getUserCount();
        return res;
      })
    );
  }


  getItem(params?): Observable<Users[]> {
    return this._http.get<Users[]>('/users'+ (params ? params : ''));
  }

  getUsersWithoutFilter(params:string=''): Observable<UserPaginationResponse>{
    return this._http.get<UserPaginationResponse>('/users'+ (params ? params : '')).pipe(
      map((res: UserPaginationResponse) => {
        UsersStore.unfilteredUsers = res.data;
        return res;
      })
    );
  }
  getItemById(params?:number): Observable<IndividualUser> {
    return this.getIndividualItem(params).pipe(
      map((res: IndividualUser) => {
        UsersStore.setIndividualUser(res);
        return res;
      })
    );
  }

  getItemByDesignation(designationId){
    return this._http.get<UserPaginationResponse>('/designations/'+designationId+'/users' ).pipe(
      map((res: UserPaginationResponse) => {
          UsersStore.setUsers(res);
        return res;
      })
    );
  }


  saveUserId(id:number){
    UsersStore.setUserId(id);
  }

  getIndividualItem(id:number): Observable<IndividualUser> {
    return this._http.get<IndividualUser>('/users/'+id);
  }

  userStatus(status:string,Id) {
   
    return this._http.put('/users/'+Id+'/'+status, Id).pipe(
      map(res => {
        if(status=='deactivate')
        this._utilityService.showSuccessMessage('success','deactivate_success');
        else
        this._utilityService.showSuccessMessage('success','activate_success');
        
        //this.getAllItems('?page=1&designation_ids=1&limit=16').subscribe();
        this.getItemById(Id).subscribe();
        return res;
      })
    );
  }

  deleteUser(user_id:number){
    return this._http.delete('/users/'+user_id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        return res;
      })
    );
  }

  uploadImage(params){
    return this._http.post('/settings/temp/file',params).pipe(
      map(res => {
        return res;
      })
    );
  }

  getPreviewUrl(preview){
    return this._http.get('/settings/temp/file/'+preview,{ responseType: 'blob' });
    
  }

  setImageDetails(imageDetails,url,type){
    UsersStore.setImageDetails(imageDetails,url,type);
  }

  searchUsers(params){
    return this.getAllItems(params ? params : '').pipe(
      map((res: UserPaginationResponse) => {
        UsersStore.setUsers(res);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/users/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('users_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'users' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/users/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('users')+".xlsx");
      }
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/users/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        // this.getAllItems(null).subscribe();
        return res;
      })
    )
  }

  editSubmenu(){
    if (UsersStore.individual_user_loaded && UsersStore.usersProfile) {
        if (UsersStore.individualUser.status.id == 1) {
            var subMenuItems = [
                {activityName: 'UPDATE_USER', submenuItem: {type: 'edit_modal'}},
                {activityName: 'DELETE_USER', submenuItem: {type: 'delete'}},
                {activityName: 'DEACTIVATE_USER', submenuItem: {type: 'deactivate'}},
                {activityName: null, submenuItem: {type: 'close',path:'../'}},
              ]
        }
        else {
          
    var subMenuItems = [
      {activityName: 'UPDATE_USER', submenuItem: {type: 'edit_modal'}},
      {activityName: 'DELETE_USER', submenuItem: {type: 'delete'}},
      {activityName: 'ACTIVATE_USER', submenuItem: {type: 'activate'}},
      {activityName: null, submenuItem: {type: 'close',path:'../'}},
    ]
        }
        this._helperService.checkSubMenuItemPermissions(200,subMenuItems);
        // SubMenuItemStore.addSubMenu({ type: 'close', path: '../' });
      }
     
}

getUserCount(){
  let params='';
  if(UsersStore.searchText) params = '?q='+UsersStore.searchText;
  if(RightSidebarLayoutStore.filterPageTag == 'users' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
 if(UsersStore.selectedStatus!=null){
   params= (params == '') ? ('?status='+UsersStore.selectedStatus) :(params + '&status='+UsersStore.selectedStatus)
 }
 else{
  params= (params == '') ? ('?status=all') :(params + '&status=all')
 }
  return this._http.get<UserCount>('/users/total-count'+(params?params:'')).pipe(
    map((res) => {
      UsersStore.setUserCount(res);
      return res;
    })
  );
}

getRoles(params:string=''): Observable<RolePaginationResponse>{
  return this._http.get<RolePaginationResponse>('/roles'+(params?params:'')).pipe(
    map((res: RolePaginationResponse) => {
      UsersStore.usersRoles = res.data;
      return res;
    })
  );
}

  sortList(type:string, text:string) {
    if (!UsersStore.orderBy) {
      UsersStore.orderBy = 'desc';
      UsersStore.orderItem = type;
    }
    else{
      if (UsersStore.orderItem == type) {
        if(UsersStore.orderBy == 'desc') UsersStore.orderBy = 'asc';
        else UsersStore.orderBy = 'desc'
      }
      else{
        UsersStore.orderBy = 'desc';
        UsersStore.orderItem = type;
      }
    }
  }



}
