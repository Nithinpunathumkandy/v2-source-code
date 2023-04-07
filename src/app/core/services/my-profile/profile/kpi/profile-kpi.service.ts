import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileKPI, ProfileKPIPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-kpi';
import { ProfileKPIStore } from 'src/app/stores/my-profile/profile/profile-kpi-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';

@Injectable({
  providedIn: 'root'
})
export class ProfileKpiService {

  constructor(private _http:HttpClient) { }

  // getItems(){
  //   return this._http.get('/users/me/kpi').pipe(
  //     map((res ) => {
  //       // MyProfileProfileStore.setProfile(res);
  //       return res;
  //     })
  //   );
  // }

  getProfileKPI(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProfileKPIPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProfileKPIStore.currentPage}`;
    }
    return this._http.get<ProfileKPIPaginationResponse>('/users/me/kpi' + (params ? params : '')).pipe(
      map((res: ProfileKPIPaginationResponse) => {
        ProfileKPIStore.setProfileKPI(res);
        return res;
      })
    );
  }

  getItemById(kpiId: number): Observable<ProfileKPI>{
    return this._http.get<ProfileKPI>('/users/me/kpi/' + kpiId).pipe(
      map((res: ProfileKPI) => {
        ProfileKPIStore.setIndividualProfileKpi(res)
      return res;
    }))
  }
  
}
