import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { Integration } from 'src/app/core/models/human-capital/users/user-setting';
import { UserIntegrationStore } from 'src/app/stores/human-capital/users/user-setting/user-integration.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserIntegrationService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getIntegration(params?:number): Observable<Integration[]> {
    return this._http.get<Integration[]>('/users/'+UsersStore.user_id+'/integrations').pipe(
      map((res: Integration[]) => {
        
        UserIntegrationStore.setIntegration(res);
        return res;
      })
    );
  }

authorize(id): Observable<any> {
  
    return this._http.get<Integration[]>('/users/'+UsersStore.user_id+'/integrations/'+id+'/authorize-url').pipe(
      map((res: Integration[]) => {
        
        UserIntegrationStore.setIntegration(res);
        return res;
      })
    );
}

unauthorize(id): Observable<any> {
  
  return this._http.put('/users/'+UsersStore.user_id+'/integrations/'+id+'/un-authorize' ,id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success','password_reset_successful');
      return res;
    })
  );
}

getIcon(id){
  
    return environment.apiBasePath+ '/settings/integration/'+id+'/icon?height=100&width=100';
}
}
