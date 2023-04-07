import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {AddUser} from "src/app/core/models/human-capital/users/add-user";
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuthService } from "src/app/core/auth/services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _authService: AuthService) { }

    saveItem(user) {
      return this._http.post('/users', user).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','create_success');
          return res;
        })
      );
    }

    updateItem(id, user): Observable<any> {
      return this._http.put('/users/' + id, user).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          if(id == AuthStore.user.id)                       // Checking if logged in user. If yes, reload user/me api
            this._authService.populate().subscribe();
         // this.getItems().subscribe();
          return res;
        })
      );
    }

    uploadImage(params){
      return this._http.post('/settings/temp/file',params).pipe(
        map(res => {
          return res;
        })
      );
    }

    getPreviewUrl(preview){
      return this._http.get('/settings/temp/file/'+preview,{ responseType: 'blob' });
      
    }

    validatePassword(params){
      return this._http.post('/check-password',params).pipe(
        map(res => {
          return res;
        })
      );
    }

  
    setImageDetails(imageDetails,url){
      AddUserStore.setImageDetails(imageDetails,url);
    }

    getImageDetails(type){
      return AddUserStore.getProductImageDetailsByType(type);
    }
  
  
}
