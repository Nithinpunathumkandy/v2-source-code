import { Injectable } from '@angular/core';
import { Experience} from 'src/app/core/models/human-capital/users/user-work-experience';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {UserWorkExperienceStore} from 'src/app/stores/human-capital/users/user-profile/user-work-experience.store';

@Injectable({
  providedIn: 'root'
})
export class UserWorkExperienceService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  getWorkExperience(params?:number): Observable<Experience> {
    return this.getWorkExperienceById(params).pipe(
      map((res: Experience) => {
        
        UserWorkExperienceStore.setExperience(res['data']);
        return res;
      })
    );
  }

  getWorkExperienceById(id:number): Observable<Experience> {
    return this._http.get<Experience>('/users/'+id+'/work-experiences');
  }

  
  updateWorkExperience(id:number,user_id:number, work: Experience): Observable<any> {
    return this._http.put('/users/'+ user_id+'/work-experiences/'+id, work).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        
        this.getWorkExperience(user_id).subscribe();

        return res;
      })
    );
  }

  saveWorkExperience(user_id:number,work): Observable<any> {
    return this._http.post('/users/'+user_id+'/work-experiences', work).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getWorkExperience(user_id).subscribe();
        return res;
      })
    );
  }

  deleteWork(id: number,user_id:number): Observable<any> {
    return this._http.delete('/users/'+user_id+'/work-experiences/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getWorkExperience(user_id).subscribe();
        return res;
      })
    );
  }


}
