import { Injectable } from '@angular/core';
import { RiskMapping, RiskMappingPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-mapping';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { BcmRiskMappingStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-mapping.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';

@Injectable({
  providedIn: 'root'
})
export class BcmRiskMappingService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskMapping> {
    let params = '';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(BcmRiskAssessmentStore.searchText) params += (params ? '&q=' : '?q=')+BcmRiskMappingStore.searchText;
    return this._http.get<RiskMapping>('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/mapping').pipe(
      map((res: RiskMapping) => {
        BcmRiskMappingStore.setRiskMappingDetails(res);
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any>{
   
      return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/issue-mapping', saveData).pipe(
        map(res => {
          // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
          // this.getItems().subscribe();
          return res;
        })
      );
    
  }

  
  saveProcessForMapping(saveData): Observable<any>{
    return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveLocationForMapping(saveData): Observable<any>{
   
    return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/location-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
}


saveProjectForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/project-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveProductForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/product-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveControlForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/control-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveCustomerForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/customer-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveFocusAreaMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/focus-area-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveObjectiveForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/strategic-objective-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveAssetsForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/asset-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveServiceForMapping(saveData): Observable<any>{
   
  return this._http.post('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/service-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}


  deleteProcessMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/process-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/issue-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteLocationMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/location-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteServiceMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/service-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/project-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/product-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteCustomerMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/customer-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteObjectiveMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/strategic-objective-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteAssetsMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/asset-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteControlMapping(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/control-mapping',id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteFocusArea(id) {
    return this._http.put('/bcm-risks/' + BcmRiskAssessmentStore.selectedId+'/focus-area-mapping',id).pipe(
      map(res => {
        this.getItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/mapping/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_mapping')+".xlsx");
      }
    )
  }
}
