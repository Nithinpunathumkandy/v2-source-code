import { Injectable } from '@angular/core';

import { cyberIncidentIA } from 'src/app/core/models/cyber-incident/cyber-incident-ia-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { CyberIncidentIAStore } from 'src/app/stores/cyber-incident/cyber-incident-ia-store';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentIaService {

  CyberIncidentIAStore=CyberIncidentIAStore
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(id:number): Observable<cyberIncidentIA> {
      
      return this._http.get<cyberIncidentIA>('/cyber-incident/cyber-incidents/'+id+'/impact-analyses').pipe(
        map((res: cyberIncidentIA) => {
          CyberIncidentIAStore.setIA(res);
          return res;
        })
      );
   
    }

    saveItem(id,item) {
      return this._http.post('/cyber-incident/cyber-incidents/'+id+'/impact-analyses', {"impact_analysis_details":item}).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', `ia_updated`);
          return res;
        })
      );
    }

    getIACategories(): Observable<any> {
      
      return this._http.get<any>('/cyber-incident-impact-analysis-categories').pipe(
        map((res: any) => {
          //CyberIncidentIAStore.setIACategories(res);
          return res;
        })
      );
   
    }

   
}
