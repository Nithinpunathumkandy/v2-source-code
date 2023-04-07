import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ControlAssessmentDetailsPaginationResponse, controlAssessmentDetails } from 'src/app/core/models/business-assessments/control-assessment/control-assessment-inner-details';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';

@Injectable({
  providedIn: 'root'
})
export class ControlAssessmentInnerDetailsService {
  ControlAssessmentStore=ControlAssessmentStore;
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ControlAssessmentDetailsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlAssessmentDetailsStore.currentPage}`;
      if (ControlAssessmentDetailsStore.orderBy) params += `&order=${ControlAssessmentDetailsStore.orderBy}`;
      if (ControlAssessmentDetailsStore.orderItem) params += `&order_by=${ControlAssessmentDetailsStore.orderItem}`;
      if (ControlAssessmentDetailsStore.searchText) params += `&q=${ControlAssessmentDetailsStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<ControlAssessmentDetailsPaginationResponse>('/control-assessments' + (params ? params : '')).pipe(
      map((res: ControlAssessmentDetailsPaginationResponse) => {
        ControlAssessmentDetailsStore.setControlAssessmentDetails(res);
        return res;
      })
    );
  }

  getItem(id: number,params?): Observable<controlAssessmentDetails> {
    return this._http.get<controlAssessmentDetails>('/control-assessments/'+ id+(params ? params : '')).pipe(
      map((res: controlAssessmentDetails) => {
        ControlAssessmentDetailsStore.setInnerControlAsessmentDetails(res);
        // FrameworkStore.updateFramework(res)
        return res;
      })
    );
  }

  getChildClauses(params): Observable<any> {
    return this._http.get<any>('/control-assessment-contents'+(params ? params : '')).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateItem(control_assessment_id:number, framework): Observable<any> {
    return this._http.put('/control-assessments/'+ control_assessment_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_assessment_updated');
        this.getItems(false,'status=all'+'&document_ids='+ControlAssessmentStore?.docDetails?.id).subscribe();
        //this.getItem(control_assessment_id).subscribe();

        return res;
      })
    );
  }

  updateAssessment(controlId:number, frameworkId,assessmentId): Observable<any> {
    return this._http.put('/control-assessments/'+assessmentId+'/control/'+controlId+'/updates', {"business_assessment_framework_option_id":frameworkId}).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_updated');
        
        //this.getItems(false,'status=all&document_version_ids='+ControlAssessmentStore?.docversionId).subscribe();
        //this.getItem(assessmentId).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/control-assessments', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_assessment_added');
        this.getItems(false,'status=all'+'&document_ids='+ControlAssessmentStore?.docDetails?.id).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/control-assessments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_assessment_deleted');
        return res;
      })
    );
  }



  generateTemplate() {
    this._http.get('/control-assessments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_assessment_template')+".xlsx");     

      }
    )
  }

  exportToExcel(params) {
    this._http.get('/control-assessments/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_assessment')+".xlsx");     

      }
    )
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortAssessmentList(type, callList: boolean = true) {
    if (!ControlAssessmentDetailsStore.orderBy) {
      ControlAssessmentDetailsStore.orderBy = 'asc';
      ControlAssessmentDetailsStore.orderItem = type;
    }
    else {
      if (ControlAssessmentDetailsStore.orderItem == type) {
        if (ControlAssessmentDetailsStore.orderBy == 'asc') ControlAssessmentDetailsStore.orderBy = 'desc';
        else ControlAssessmentDetailsStore.orderBy = 'asc'
      }
      else {
        ControlAssessmentDetailsStore.orderBy = 'asc';
        ControlAssessmentDetailsStore.orderItem = type;
      }
    }
    if (callList)
    this.getItems(false,'status=all&document_version_ids='+ControlAssessmentStore?.docversionId).subscribe();
  }
}
