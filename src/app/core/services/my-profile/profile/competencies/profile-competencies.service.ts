import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompetencyDetail } from 'src/app/core/models/my-profile/profile/profile-competencies';
import { ProfileCompetenciesStore } from 'src/app/stores/my-profile/profile/profile-competencies-store';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompetenciesService {

  constructor(private _http:HttpClient) { }

  getItems(){
    return this._http.get('/users/me/competencies').pipe(
      map((res ) => {
        ProfileCompetenciesStore.setProfileCompetency(res);
        return res;
      })
    );
  }

  getItemById(competencyId: number): Observable<CompetencyDetail[]>{
    return this._http.get<CompetencyDetail[]>('/users/me/competencies/' + competencyId).pipe(
      map((res: CompetencyDetail[]) => {
        ProfileCompetenciesStore.setIndividualCompetency(res);
      return res;
    }))
  }
}
