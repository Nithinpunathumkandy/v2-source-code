import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssessmentPaginationResponse, Checklist, IndividualAssessment } from 'src/app/core/models/business-assessments/assessments/assessments';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AssessmentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssessmentsStore.currentPage}`;
      if (AssessmentsStore.orderBy) params += `&order=${AssessmentsStore.orderBy}`;
      if (AssessmentsStore.orderItem) params += `&order_by=${AssessmentsStore.orderItem}`;
      if (AssessmentsStore.searchText) params += `&q=${AssessmentsStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'assessment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssessmentPaginationResponse>('/business-assessments' + (params ? params : '')).pipe(
      map((res: AssessmentPaginationResponse) => {
        AssessmentsStore.setAssessmentDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualAssessment> {
    return this._http.get<IndividualAssessment>('/business-assessments/' + id).pipe(
      map((res: IndividualAssessment) => {
        AssessmentsStore.setIndividualAssessmentDetails(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  getChecklist(assessment_id,id: number): Observable<Checklist> {
    return this._http.get<Checklist>('/business-assessments/'+assessment_id+'/contents/' + id+'/checklists').pipe(
      map((res: Checklist) => {
        AssessmentsStore.setChecklist(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  updateItem(assessment_id:number, assessment): Observable<any> {
    return this._http.put('/business-assessments/'+ assessment_id, assessment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_updated');
        
        this.getItem(AssessmentsStore.assessmentId).subscribe();

        return res;
      })
    );
  }

  saveItem(assessment): Observable<any> {
    return this._http.post('/business-assessments', assessment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  publishAssessment(assessment_id:number): Observable<any> {
    return this._http.put('/business-assessments/'+ assessment_id+'/submit', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_published');
        
        this.getItem(AssessmentsStore.assessmentId).subscribe();

        return res;
      })
    );
  }
  
  saveChecklist(checklistData): Observable<any> {
    return this._http.post('/business-assessment-checklists', checklistData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_saved');
        this.getSavedItem(AssessmentsStore.assessmentId).subscribe();
        return res;
      })
    );
  }

  updateChecklist(checklistData,checklist_id): Observable<any> {
    return this._http.put('/business-assessment-checklists/'+checklist_id, checklistData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_saved');
        this.getSavedItem(AssessmentsStore.assessmentId).subscribe(res=>{
          this.setAssessmentDetails(res);
        });
        
        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete('/business-assessments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/business-assessments/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_activated');
        this.getItems(false).subscribe();
        
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/business-assessments/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_deactivated');
        this.getItems(false).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/business-assessments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessments_template')+".xlsx");
      }
    )
  }

  exportToExcel() {

    let params = '';
    if (AssessmentsStore.orderBy) params += `?order=${AssessmentsStore.orderBy}`;
    if (AssessmentsStore.orderItem) params += `&order_by=${AssessmentsStore.orderItem}`;
    // if (AssessmentsStore.searchText) params += `&q=${AssessmentsStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'assessment' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/business-assessments/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessments')+".xlsx");

      }
    )
  }

  
       /**
   * Sort Assessment List
   * @param type Sort By Variable
   */
  sortAssessmentList(type, callList: boolean = true) {
    if (!AssessmentsStore.orderBy) {
      AssessmentsStore.orderBy = 'asc';
      AssessmentsStore.orderItem = type;
    }
    else {
      if (AssessmentsStore.orderItem == type) {
        if (AssessmentsStore.orderBy == 'asc') AssessmentsStore.orderBy = 'desc';
        else AssessmentsStore.orderBy = 'asc'
      }
      else {
        AssessmentsStore.orderBy = 'asc';
        AssessmentsStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }


  setImageDetails(imageDetails,url,type,clause_number,id){
    AssessmentsStore.setChecklistImageDetails(imageDetails,url,type,clause_number,id);
  }

  // getImageDetails(type){
  //   return AssessmentsStore.getChecklistImageDetailsByType();
  // }

  setSelectedImageDetails(imageDetails,type){
    AssessmentsStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return AssessmentsStore.getDocumentDetails;
  }

  getSavedItem(id: number): Observable<IndividualAssessment> {
    return this._http.get<IndividualAssessment>('/business-assessments/' + id).pipe(
      map((res: IndividualAssessment) => {
        AssessmentsStore.setSavedAssessmentDetails(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  setAssessmentDetails(savedItem){
    AssessmentsStore.individualAssessmentDetails.total_checklist_count = savedItem.total_checklist_count;
    AssessmentsStore.individualAssessmentDetails.answered_checklist_count = savedItem.answered_checklist_count;
    AssessmentsStore.individualAssessmentDetails.score = savedItem.score;
    let count = 0;
    for(let i=0;i<savedItem.document_contents.length;i++){
      if(savedItem.document_contents[i].id == AssessmentsStore.currentAssessment){
        count++;
        AssessmentsStore.individualAssessmentDetails.document_contents[i].score = savedItem.document_contents[i].score;
        AssessmentsStore.individualAssessmentDetails.document_contents[i].is_completed = savedItem.document_contents[i].is_completed;
        // console.log(AssessmentsStore.individualAssessmentDetails.document_contents[i].child);
      }
      if(count!=0)
      break;
    }
    // console.log( AssessmentsStore.individualAssessmentDetails);
  }

}
