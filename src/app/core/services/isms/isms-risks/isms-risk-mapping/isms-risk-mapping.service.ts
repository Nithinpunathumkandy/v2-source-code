import { Injectable } from '@angular/core';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { RiskMapping, RiskMappingPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-mapping';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskMappingStore } from 'src/app/stores/isms/isms-risks/isms-risk-mapping.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskMappingService {

  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskMapping> {
    let params = '';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(IsmsRisksStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskMappingStore.searchText;
    return this._http.get<RiskMapping>('/isms-risks/'+IsmsRisksStore.riskId+'/mapping').pipe(
      map((res: RiskMapping) => {
        IsmsRiskMappingStore.setRiskMappingDetails(res);
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any>{
   
      return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/issue-mapping', saveData).pipe(
        map(res => {
          // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
          // this.getItems().subscribe();
          return res;
        })
      );
    
  }

  
  saveProcessForMapping(saveData): Observable<any>{
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveLocationForMapping(saveData): Observable<any>{
   
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/location-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
}


saveProjectForMapping(saveData): Observable<any>{
   
  return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/project-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveProductForMapping(saveData): Observable<any>{
   
  return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/product-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveControlForMapping(saveData): Observable<any>{
   
  return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/control-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveCustomerForMapping(saveData): Observable<any>{
   
  return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/customer-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveObjectiveForMapping(saveData): Observable<any>{
   
  return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/strategic-objective-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}


  deleteProcessMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/process-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_process_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/issue-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_issues_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteLocationMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/location-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_locations_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/project-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_project_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/product-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_product_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteCustomerMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/customer-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_customer_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteObjectiveMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/strategic-objective-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_objective_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteControlMapping(id) {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId+'/control-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'isms_risk_control_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/mapping/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_mapping')+".xlsx");
      }
    )
  }
}
