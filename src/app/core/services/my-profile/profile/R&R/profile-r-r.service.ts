import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProfileRR, ProfileRRPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-r-r';
import { ProfileRRStore } from 'src/app/stores/my-profile/profile/profile-r-r-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
@Injectable({
  providedIn: 'root'
})
export class ProfileRRService {

  constructor(private _http:HttpClient) { }

  // getItems(){
  //   return this._http.get('users/me/roles-and-responsibilities').pipe(
  //     map((res ) => {
  //       return res;
  //     })
  //   );
  // }

  getprofileRR(getAll: boolean = false): Observable<ProfileRRPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProfileRRStore.currentPage}`;
     }
    return this._http.get<ProfileRRPaginationResponse>('/users/me/roles-and-responsibilities' + (params ? params : '')).pipe(
      map((res: ProfileRRPaginationResponse) => {
        ProfileRRStore.setProfileRR(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<ProfileRR> {
    return this._http.get<ProfileRR>('/users/'+UsersStore.user_id+'/roles-and-responsibilities/' + id).pipe(
      map((res: ProfileRR) => {
        ProfileRRStore.setIndividualRoleDetails(res);
        return res;
      })
    );
  }
}
