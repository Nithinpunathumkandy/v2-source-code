import { Injectable } from '@angular/core';
import { CSAAssessmentsStore } from 'src/app/stores/audit-management/am-csa/csa-assessments.store';
import { HttpClient } from '@angular/common/http';
import { AssessmentPaginationResponse, Checklist, IndividualAssessment } from 'src/app/core/models/business-assessments/assessments/assessments';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';

@Injectable({
  providedIn: 'root'
})
export class AmCsaAssessmentService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }


  getItems(getAll: boolean = false, additionalParams?: string): Observable<AssessmentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CSAAssessmentsStore.currentPage}`;
      if (CSAAssessmentsStore.orderBy) params += `&order=${CSAAssessmentsStore.orderBy}`;
      if (CSAAssessmentsStore.orderItem) params += `&order_by=${CSAAssessmentsStore.orderItem}`;
      if (CSAAssessmentsStore.searchText) params += `&q=${CSAAssessmentsStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssessmentPaginationResponse>('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates' + (params ? params : '')).pipe(
      map((res: AssessmentPaginationResponse) => {
        CSAAssessmentsStore.setAssessmentDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualAssessment> {
    return this._http.get<IndividualAssessment>('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates/'+id).pipe(
      map((res: IndividualAssessment) => {
        CSAAssessmentsStore.setIndividualAssessmentDetails(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  getChecklist(assessment_id,id: number): Observable<Checklist> {
    return this._http.get<Checklist>('/business-assessments/'+assessment_id+'/contents/' + id+'/checklists').pipe(
      map((res: Checklist) => {
        CSAAssessmentsStore.setChecklist(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  updateItem(id:number, assessment): Observable<any> {
    return this._http.put('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates/'+id, assessment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_updated');
        
        this.getItem(CSAAssessmentsStore.assessmentId).subscribe();

        return res;
      })
    );
  }

  saveItem(assessment): Observable<any> {
    return this._http.post('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates', assessment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  publishAssessment(id:number): Observable<any> {
    return this._http.put('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/submit', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_published');
        
        // this.getItem(CSAAssessmentsStore.assessmentId).subscribe();

        return res;
      })
    );
  }

  answerAssessment(id:number): Observable<any> {
    return this._http.put('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/submit-answer', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_answer_submitted');
        
        // this.getItem(CSAAssessmentsStore.assessmentId).subscribe();

        return res;
      })
    );
  }
  
  saveAnswer(id,saveData): Observable<any> {
    return this._http.post('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates/'+id+'/add-answers', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','answer_saved');
        // this.getSavedItem(CSAAssessmentsStore.assessmentId).subscribe();
        return res;
      })
    );
  }

  updateAnswer(id,saveData): Observable<any> {
    return this._http.put('/am-audit-control-self-assessments/'+AmCSAStore.csaId+'/updates/'+id+'/edit-answers', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','answer_updated');
        // this.getSavedItem(CSAAssessmentsStore.assessmentId).subscribe(res=>{
        //   this.setAssessmentDetails(res);
        // });
        
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

  

  setImageDetails(imageDetails,url,type,clause_number,id){
    CSAAssessmentsStore.setChecklistImageDetails(imageDetails,url,type,clause_number,id);
  }

  // getImageDetails(type){
  //   return CSAAssessmentsStore.getChecklistImageDetailsByType();
  // }

  setSelectedImageDetails(imageDetails,type){
    CSAAssessmentsStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return CSAAssessmentsStore.getDocumentDetails;
  }

  getSavedItem(id: number): Observable<IndividualAssessment> {
    return this._http.get<IndividualAssessment>('/business-assessments/' + id).pipe(
      map((res: IndividualAssessment) => {
        CSAAssessmentsStore.setSavedAssessmentDetails(res);
        // AssessmentStore.updateAssessment(res)
        return res;
      })
    );
  }

  setAssessmentDetails(savedItem){
    CSAAssessmentsStore.individualAssessmentDetails.total_checklist_count = savedItem.total_checklist_count;
    CSAAssessmentsStore.individualAssessmentDetails.answered_checklist_count = savedItem.answered_checklist_count;
    CSAAssessmentsStore.individualAssessmentDetails.score = savedItem.score;
    let count = 0;
    for(let i=0;i<savedItem.document_contents.length;i++){
      if(savedItem.document_contents[i].id == CSAAssessmentsStore.currentAssessment){
        count++;
        CSAAssessmentsStore.individualAssessmentDetails.document_contents[i].score = savedItem.document_contents[i].score;
        CSAAssessmentsStore.individualAssessmentDetails.document_contents[i].is_completed = savedItem.document_contents[i].is_completed;
        // console.log(CSAAssessmentsStore.individualAssessmentDetails.document_contents[i].child);
      }
      if(count!=0)
      break;
    }
    // console.log( CSAAssessmentsStore.individualAssessmentDetails);
  }
}
