import { Injectable } from '@angular/core';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RiskMapping, RiskMappingPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-mapping';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskMappingStore } from 'src/app/stores/risk-management/risks/risk-mapping.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class RiskMappingService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskMapping> {
    let params = '';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(RisksStore.searchText) params += (params ? '&q=' : '?q=')+RiskMappingStore.searchText;
    return this._http.get<RiskMapping>('/risks/'+RisksStore.riskId+'/mapping').pipe(
      map((res: RiskMapping) => {
        RiskMappingStore.setRiskMappingDetails(res);
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any>{
   
      return this._http.post('/risks/'+RisksStore.riskId+'/issue-mapping', saveData).pipe(
        map(res => {
          // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
          // this.getItems().subscribe();
          return res;
        })
      );
    
  }

  
  saveProcessForMapping(saveData): Observable<any>{
    return this._http.post('/risks/'+RisksStore.riskId+'/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveLocationForMapping(saveData): Observable<any>{
   
    return this._http.post('/risks/'+RisksStore.riskId+'/location-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
}


saveProjectForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/project-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveProductForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/product-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveControlForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/control-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveIncidentForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/incident-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveCustomerForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/customer-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveObjectiveForMapping(saveData): Observable<any>{
   
  return this._http.post('/risks/'+RisksStore.riskId+'/strategic-objective-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}


  deleteProcessMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/process-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/issue-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteLocationMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/location-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/project-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/product-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteCustomerMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/customer-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteObjectiveMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/strategic-objective-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteControlMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/control-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIncidentMapping(id) {
    return this._http.put('/risks/' + RisksStore.riskId+'/incident-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/risks/'+RisksStore.riskId+'/mapping/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_mapping')+".xlsx");
      }
    )
  }
}
