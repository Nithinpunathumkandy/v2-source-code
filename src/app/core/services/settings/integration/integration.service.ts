import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { IntegrationPaginationResponse} from 'src/app/core/models/settings/integration-model';
import { IntegrationStore } from 'src/app/stores/settings/integration-strore';
@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  IntegrationStore=IntegrationStore;
  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }


  getAllItems(): Observable<IntegrationPaginationResponse>{

    return this._http.get<IntegrationPaginationResponse>('/integrations?status=all').pipe(
      map(res => {
        IntegrationStore.setIntegration(res);
        return res;
      })
    );
  }

  deactivate(id,type): Observable<any>{
    return this._http.put<any>('/integrations/'+id+'/deactivate','').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success',type+'_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  activate(id,type): Observable<any>{
    return this._http.put<any>('/integrations/'+id+'/activate','').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success',type+'_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }
}
