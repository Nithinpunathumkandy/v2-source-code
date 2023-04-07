import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Assessment,AssessmentResult, AssessmentPaginationResponse,Result,UserAssessment } from 'src/app/core/models/human-capital/assessment/assessment';
import { map } from 'rxjs/operators';
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<AssessmentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssessmentStore.currentPage}`;
      // console.log(AssessmentStore.orderBy);
      if (AssessmentStore.orderBy) params += `&order_by=${AssessmentStore.orderItem}&order=${AssessmentStore.orderBy}`;
    }
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(AssessmentStore.searchText) params += (params ? '&q=' : '?q=')+AssessmentStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'hc_assessment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssessmentPaginationResponse>('/assessments' + (params ? params : '')).pipe(
      map((res: AssessmentPaginationResponse) => {
        AssessmentStore.setAssessments(res);
        return res;
      })
    );
  }

  saveAnswer(user_id:number,item){
    return this._http.post('/users/'+user_id+'/competency-assessments', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'submit_success');
        this.getItems().subscribe();
        return res;
      })
    );

  }

  updateAnswer(user_id:number,item,assessment_id){
    return this._http.put('/users/'+user_id+'/competency-assessments/'+assessment_id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems().subscribe();
        return res;
      })
    );

  }

  getUserAssessments(user_id){
    return this._http.get<UserAssessment[]>('/users/'+user_id+'/competency-assessments?order_by=competencies.title&order=asc').pipe(
      map((res: UserAssessment[]) => {
        AssessmentStore.setUserAssessments(res);
        return res;
      })
    );
  }

  getResult(user_id,assessment_id){
    return this._http.get<AssessmentResult>('/users/'+user_id+'/competency-assessments/' + assessment_id).pipe(
      map((res: AssessmentResult) => {
        AssessmentStore.setResult(res);
        return res;
      })
    );
  }

  delete(user_id,id: number) {
    return this._http.delete('/users/'+user_id+'/competency-assessments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems().subscribe();
        //this.setSelected(position,true,true);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/assessments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('assessment_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
		if (AssessmentStore.orderBy) params += `?order=${AssessmentStore.orderBy}`;
		if (AssessmentStore.orderItem) params += `&order_by=${AssessmentStore.orderItem}`;
		if(RightSidebarLayoutStore.filterPageTag == 'hc_assessment' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/assessments/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('assessment')+".xlsx");
      }
    )
  }

  sortAssessmentList(type:string, text:string) {
    if (!AssessmentStore.orderBy) {
      AssessmentStore.orderBy = 'asc';
      AssessmentStore.orderItem = type;
    }
    else{
      if (AssessmentStore.orderItem == type) {
        if(AssessmentStore.orderBy == 'asc') AssessmentStore.orderBy = 'desc';
        else AssessmentStore.orderBy = 'asc'
      }
      else{
        AssessmentStore.orderBy = 'asc';
        AssessmentStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems().subscribe();
  else
  this.getItems(false,`&q=${text}`).subscribe();
  }

  
}
