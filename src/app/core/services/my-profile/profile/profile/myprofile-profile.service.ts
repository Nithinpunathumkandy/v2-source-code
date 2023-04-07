import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Qualification } from 'src/app/core/models/human-capital/users/user-qualification';
import { Experience } from 'src/app/core/models/human-capital/users/user-work-experience';
import { profile } from 'src/app/core/models/my-profile/profile/myprofile-profile.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProfileCertificateStore } from 'src/app/stores/my-profile/profile/profile-certificate-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';

@Injectable({
  providedIn: 'root'
})
export class MyprofileProfileService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _authService: AuthService) { }

  getItems():Observable<profile>{
    return this._http.get<profile>('/users/me/profile').pipe(
      map((res : profile) => {
        MyProfileProfileStore.setProfile(res);
        return res;
      })
    );
  }

  updateQualification(id:number,qualification: Qualification): Observable<any> {
    return this._http.put('/users/me/qualification/'+id, qualification).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'qualification_updated');
        return res;
      })
    );
  }

  saveQualification(qualification): Observable<any> {
    return this._http.post('/users/me/qualification', qualification).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'qualification_added');
        return res;
      })
    );
  }

  updateWorkExperience(id:number, work: Experience): Observable<any> {
    return this._http.put('/users/me/work-experience/'+id, work).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_experience_updated');
        return res;
      })
    );
  }

  saveWorkExperience(work): Observable<any> {
    return this._http.post('/users/me/work-experience', work).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_experience_added');
        return res;
      })
    );
  }

  setImageDetails(imageDetails,url){
    MyProfileProfileStore.setImageDetails(imageDetails,url);
  }

  setCertificateImageDetails(imageDetails,url,type){
    ProfileCertificateStore.setCertificateImageDetails(imageDetails,url,type);
  }

  updateCertificate(id:number, certificate): Observable<any> {
    return this._http.put('/users/me/certificates/'+id, certificate).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'certificate_updated');
        return res;
      })
    );
  }

  saveCertificate(certificate): Observable<any> {
    return this._http.post('/users/me/certificates', certificate).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'certificate_added');
        return res;
      })
    );
  }

  deleteCertificate(id: number): Observable<any> {
    return this._http.delete('/users/me/certificates/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'certificate_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteWork(id: number): Observable<any> {
    return this._http.delete('/users/me/work-experience/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_experience_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteQualification(id: number): Observable<any> {
    return this._http.delete('/users/me/qualification/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'qualification_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateProfile(id:number,item){
    return this._http.put('/users/me/profile', item).pipe(
      map(res => {
        if(id == AuthStore.user.id)
            this._authService.populate().subscribe();
        this._utilityService.showSuccessMessage('success', 'profile_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }
}
