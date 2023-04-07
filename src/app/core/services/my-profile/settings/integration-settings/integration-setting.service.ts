import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntegrationSettings } from 'src/app/core/models/my-profile/settings/integration-settings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IntegrationSettingStore } from 'src/app/stores/my-profile/settings/integration-settings.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationSettingService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

  getIntegration(params?:number): Observable<IntegrationSettings[]> {
    return this._http.get<IntegrationSettings[]>('/users/me/integrations').pipe(
      map((res: IntegrationSettings[]) => {
        
        IntegrationSettingStore.setIntegration(res);
        return res;
      })
    );
  }

  authorize(id): Observable<any> {
    return this._http.get<IntegrationSettings[]>('/users/me/integrations/'+ id +'/authorize-url').pipe(
      map((res: IntegrationSettings[]) => {
        //IntegrationSettingStore.setIntegration(res);
        return res;
      })
    );
}

unauthorize(id): Observable<any> { 
  return this._http.put('/users/me/integrations/'+ id +'/un-authorize' ,id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'password_reset_successful');
      return res;
    })
  );
}

getIcon(id){
  
    return environment.apiBasePath+ '/settings/integration/'+id+'/icon?height=100&width=100';
}
}
