import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ProfileDetails, Profile } from "src/app/core/models/organization/business_profile/profile/profile";
import { ProfileStore } from 'src/app/stores/organization/business_profile/profile/profile.store';
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // getAllItems(): Observable<ProfileDetails[]> {
  //   return this.getItems().pipe(
  //     map((res: ProfileDetails[]) => {
  //       ProfileStore.setProfileDetails(res['data']);
  //       return res;
  //     })
  //   );
  // }
  
  // getItems(params?: string): Observable<ProfileDetails[]> {
  //   return this._http.get<ProfileDetails[]>('/business-profiles' + (params ? params : ''));
  // }

  // saveItem(item: ProfileDetails) {
  //   return this._http.post('/business-profiles', item).pipe(
  //     map(res => {
  //       this._utilityService.showSuccessMessage('Success!', 'New Profile has been created!');
  //       this.getAllItems().subscribe();
  //       return res;
  //     })
  //   );
  // }

  // getPreviewUrl(preview,profile_id,type){
  //   if(type == 'logo')
  //     return this._http.get('/business-profiles/'+ profile_id +'/logo-preview',{ responseType: 'blob' });
  //   else
  //     return this._http.get('/business-profiles/'+profile_id+'/brouchure-thumbnail',{ responseType: 'blob' });
  // }

  downloadBrochure(id,filename){
    this._http.get('/business-profiles/'+ id +'/brouchure-download', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, filename);
      }
    )
  }

  updateItem(id, item: ProfileDetails): Observable<any> {
    return this._http.put('/business-profiles/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getItem().subscribe();
        return res;
      })
    );
  }

  // setOrganizationProfile(profileDetails){
  //   for(let i of profileDetails){
  //     if(i.hasOwnProperty('is_primary') && i.is_primary == 1){
  //       ProfileStore.setProfileDetails(i);
  //       break;
  //     }
  //   }
  // }

  getPrimaryOrganization(): number{
    return ProfileStore.organizationId;
  }

  getItem(id?:number,storevalue:boolean = false): Observable<Profile>{
    return this._http.get<Profile>('/business-profiles/' + (id ? id : '1'))
    .pipe(map((res:Profile) => {
        if(storevalue)
          ProfileStore.setOrganizationProfile(res);
        return res;
      })
    );
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/business-profiles/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('business_profile_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    this._http.get('/business-profiles/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('business_profile')+'.xlsx');
      }
    )
  }

  setFileDetails(fileDetails,url,type){ 
    ProfileStore.setFileDetails(fileDetails,url,type);
  }

  getFileDetails(type){
    return ProfileStore.getFileDetailsByType(type);
  }

  getBrochureDetails(){
    return ProfileStore.getBrochureDetails;
  }

  getProfileDetailsStore():Profile{
    return ProfileStore.organizationProfile;
  }

}
