import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileTrainingPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-training';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileTrainingStore } from 'src/app/stores/my-profile/profile/profile-training-store';

@Injectable({
  providedIn: 'root'
})
export class ProfileTrainingService {

  constructor( 
      private _http: HttpClient,
      private _utilityService: UtilityService
  ) { }

  getProfileTraining(id:number, getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProfileTrainingPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProfileTrainingStore.currentPage}`;
    }
    return this._http.get<ProfileTrainingPaginationResponse>('/users/'+ id +'/trainings'+ (params ? params : '') ).pipe(
      map((res: ProfileTrainingPaginationResponse) => {
        ProfileTrainingStore.setProfileTraining(res);
        return res;
      })
    );
  }

  onAccept(id){
    return this._http.put('/users/me/trainings/'+ id+ '/accept',null).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success','on_accept');
        return res;
      })
    );
  }
  onReject(id){
    return this._http.put('/users/me/trainings/'+ id+ '/reject',null).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success','on_reject');
        return res;
      })
    );
  }
}
