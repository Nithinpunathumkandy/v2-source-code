import { Injectable } from '@angular/core';
import { Qualification} from 'src/app/core/models/human-capital/users/user-qualification';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {UserQualificationStore} from 'src/app/stores/human-capital/users/user-profile/user-qualification.store';

@Injectable({
  providedIn: 'root'
})
export class UserQualificationService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  getQualification(params?:number): Observable<Qualification> {
    return this.getQualificationById(params).pipe(
      map((res: Qualification) => {  
        UserQualificationStore.setQualification(res['data']);
        return res;
      })
    );
  }


  getQualificationById(id:number): Observable<Qualification> {
    return this._http.get<Qualification>('/users/'+id+'/qualifications');
  }

  deleteQualification(id: number,user_id:number): Observable<any> {
    return this._http.delete('/users/'+user_id+'/qualifications/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getQualification(user_id).subscribe();
        return res;
      })
    );
  }

  updateQualification(id:number,user_id:number, qualification: Qualification): Observable<any> {
    return this._http.put('/users/'+ user_id+'/qualifications/'+id, qualification).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        
        this.getQualification(user_id).subscribe();

        return res;
      })
    );
  }

  saveQualification(user_id:number,qualification): Observable<any> {
    return this._http.post('/users/'+user_id+'/qualifications', qualification).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getQualification(user_id).subscribe();
        return res;
      })
    );
  }

}
