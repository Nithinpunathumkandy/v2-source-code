import { Injectable } from '@angular/core';
import { Certificate} from 'src/app/core/models/human-capital/users/user-certificate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {UserCertificateStore} from 'src/app/stores/human-capital/users/user-profile/user-certificate.store';

@Injectable({
  providedIn: 'root'
})
export class UserCertificateService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  getCertificate(params?:number): Observable<Certificate> {
    return this.getCertificateById(params).pipe(
      map((res: Certificate) => {
        
        UserCertificateStore.setCertificate(res['data']);
        return res;
      })
    );
  }

  getCertificateById(id:number): Observable<Certificate> {
    return this._http.get<Certificate>('/users/'+id+'/certificates');
  }

  deleteCertificate(id: number,user_id:number): Observable<any> {
    return this._http.delete('/users/'+user_id+'/certificates/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getCertificate(user_id).subscribe();
        return res;
      })
    );
  }

  updateCertificate(id:number,user_id:number, certificate: Certificate): Observable<any> {
    return this._http.put('/users/'+ user_id+'/certificates/'+id, certificate).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        
        this.getCertificate(user_id).subscribe();

        return res;
      })
    );
  }

  saveCertificate(user_id:number,certificate): Observable<any> {
    return this._http.post('/users/'+user_id+'/certificates', certificate).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getCertificate(user_id).subscribe();
        return res;
      })
    );
  }

  setImageDetails(imageDetails,url,type){
    UserCertificateStore.setImageDetails(imageDetails,url,type);
  }

}
