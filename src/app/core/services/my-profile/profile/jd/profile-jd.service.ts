import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileJDDetails, ProfileJDPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-jd';
import { ProfileJDStore } from 'src/app/stores/my-profile/profile/profile-jd-store';

@Injectable({
  providedIn: 'root'
})
export class ProfileJdService {

  constructor(private _http:HttpClient) { }

  // getItems(){
  //   return this._http.get('/users/me/jd').pipe(
  //     map((res ) => {
  //       // MyProfileProfileStore.setProfile(res);
  //       return res;
  //     })
  //   );
  // }

  getProfileJD(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProfileJDPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProfileJDStore.currentPage}`;
    }
    return this._http.get<ProfileJDPaginationResponse>('/users/me/jd' + (params ? params : '')).pipe(
      map((res: ProfileJDPaginationResponse) => {
        ProfileJDStore.setProfileJD(res);
        return res;
      })
    );
  }

  getItemById(id:number): Observable<ProfileJDDetails> {
    return this._http.get<ProfileJDDetails>('/users/me/jd/' + id).pipe(map((res) => {
      ProfileJDStore.setProfileJDDetails(res)
      return res;
    }))
  }
}
