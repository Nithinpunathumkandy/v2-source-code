import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import {RiskTreatment,IndividualRiskTreatment,RiskSummary, HistoryData} from 'src/app/core/models/risk-management/risks/risk-treatment';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { IndividualTestAndExercise, ScenarioPaginationResponse, Solutions, SolutionsPaginationResponse, TestAndExercisePaginationResponse } from 'src/app/core/models/bcm/test-and-exercise/test-and-exercise';
import { CallTreeUsers } from 'src/app/core/models/bcm/bcp/bcp-calltree';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { TestActionPlanStore } from 'src/app/stores/bcm/test-exercise/test-exercise-action-plan-store';
import { IncidentCorrectiveAction } from "src/app/core/models/incident-management/incident/corrective-action/incident-corrective-action";
import { HistoryResponse } from 'src/app/core/models/mrm/action-plans/action-plans';
@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }


  getItems(getAll: boolean = false, additionalParams?: string): Observable<TestAndExercisePaginationResponse> {
    let params = '';
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params=='')?params+`?page=${TestAndExerciseStore.currentPage}`:params+`&page=${TestAndExerciseStore.currentPage}`;
      if (TestAndExerciseStore.orderBy) params += `&order=${TestAndExerciseStore.orderBy}`;
      if (TestAndExerciseStore.orderItem) params += `&order_by=${TestAndExerciseStore.orderItem}`;
      if (TestAndExerciseStore.searchText) params += `&q=${TestAndExerciseStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_test_and_excercise' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TestAndExercisePaginationResponse>('/test-and-exercises'+(params?params:'')).pipe(
      map((res: TestAndExercisePaginationResponse) => {
        TestAndExerciseStore.setTestEndExercise(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItem(id: number,params?:string): Observable<IndividualTestAndExercise> {
    return this._http.get<IndividualTestAndExercise>('/test-and-exercises/'+id+(params?params:'')).pipe(
      map((res: IndividualTestAndExercise) => {
        TestAndExerciseStore.setIndividualTestAndExercise(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getUpdateData(id: number): Observable<HistoryData> {
    let params='';
    params = (params=='')?params+`?page=${TestAndExerciseStore.historyCurrentPage}`:params+`&page=${TestAndExerciseStore.historyCurrentPage}`;
    params=params+'&order_by=created_at&order=desc&limit=5';
    return this._http.get<HistoryData>('/test-and-exercises/'+id+'/updates'+(params?params:'')).pipe(
      map((res: HistoryData) => {
        TestAndExerciseStore.setTreatmentUpdateData(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateTreatmentStatus(id,updateData): Observable<any> {
    return this._http.post('/test-and-exercises/'+id+'/updates', updateData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_updated');
        this.getItems(false,'').subscribe(res=>{
          this.getItem(id,'?risk_id='+TestAndExerciseStore.selectedId).subscribe();
          // this._utilityService.detectChanges(this._cdr)
        })
        

        return res;
      })
    );
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/test-and-exercises/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }
  saveItem(saveData): Observable<any> {
    return this._http.post('/test-and-exercises', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_created');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveControlPlan(saveData): Observable<any> {
    return this._http.put('/risks/' + TestAndExerciseStore.selectedId + '/control-plan', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_control_plan_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  delete(id: number) {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'custom-header': 'true' })
    // };
    return this._http.delete('/test-and-exercises/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getSummary(params?): Observable<RiskSummary> {
    return this._http.get<RiskSummary>('/test-and-exercises/summary'+(params?params:'')).pipe(
      map((res: RiskSummary) => {
        TestAndExerciseStore.setSummaryDetails(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getBcpCallTree(params?): Observable<CallTreeUsers[]> {
    return this._http.get<CallTreeUsers[]>('/bcp-call-tree'+(params?params:'')).pipe(
      map((res: CallTreeUsers[]) => {
        TestAndExerciseStore.setBcpCallTree(res);
        return res;
      })
    );
  }

  getScenarios(params?): Observable<ScenarioPaginationResponse> {
    return this._http.get<ScenarioPaginationResponse>('/test-and-exercises/list-risks'+(params?params:'')).pipe(
      map((res: ScenarioPaginationResponse) => {
        TestAndExerciseStore.setBcpScenario(res);
        return res;
      })
    );
  }

  getSolutions(params?): Observable<SolutionsPaginationResponse> {
    return this._http.get<SolutionsPaginationResponse>('/bc-strategy-solutions'+(params?params:'')).pipe(
      map((res: SolutionsPaginationResponse) => {
        TestAndExerciseStore.setBcpSolutions(res);
        return res;
      })
    );
  }

  // closeTreatment(){
    closeTreatment(id): Observable<any> {
      return this._http.put('/test-and-exercises/'+id+'/close', id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'test_and_exercise_closed');
  
          this.getItem(id,'?risk_id='+TestAndExerciseStore.selectedId).subscribe();
  
          return res;
        })
      );
    // }
  }

  setImageDetails(imageDetails,url,type){
    TestAndExerciseStore.setDocumentImageDetails(imageDetails,url,type);
  }

  setSelectedImageDetails(imageDetails,type){
    TestAndExerciseStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return TestAndExerciseStore.getDocumentDetails;
  }

  sortRiskTreatmentList(type, callList: boolean = true) {
    if (!TestAndExerciseStore.orderBy) {
      TestAndExerciseStore.orderBy = 'asc';
      TestAndExerciseStore.orderItem = type;
    }
    else {
      if (TestAndExerciseStore.orderItem == type) {
        if (TestAndExerciseStore.orderBy == 'asc') TestAndExerciseStore.orderBy = 'desc';
        else TestAndExerciseStore.orderBy = 'asc'
      }
      else {
        TestAndExerciseStore.orderBy = 'asc';
        TestAndExerciseStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'').subscribe();
  }

  sortActionPlanList(type, callList: boolean = true) {
    if (!TestActionPlanStore.orderBy) {
      TestActionPlanStore.orderBy = 'asc';
      TestActionPlanStore.orderItem = type;
    }
    else {
      if (TestActionPlanStore.orderItem == type) {
        if (TestActionPlanStore.orderBy == 'asc') TestActionPlanStore.orderBy = 'desc';
        else TestActionPlanStore.orderBy = 'asc'
      }
      else {
        TestActionPlanStore.orderBy = 'asc';
        TestActionPlanStore.orderItem = type;
      }
    }
    // if (callList)
    //   this.getActionPlan(false,'').subscribe();
  }
  generateTemplate() {
    this._http.get('/test-and-exercises/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (TestAndExerciseStore.orderBy) params += `?order=${TestAndExerciseStore.orderBy}`;
    if (TestAndExerciseStore.orderItem) params += `&order_by=${TestAndExerciseStore.orderItem}`;
    // if (TestAndExerciseStore.searchText) params += `&q=${TestAndExerciseStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_test_and_excercise' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/test-and-exercises/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise') + ".xlsx");
      }
    )
  }
  addActionPlan(saveData){
    return this._http.post('/test-and-exercise-action-plans', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_action_plan_created');

        this.getActionPlan().subscribe();
        return res;
      })
    );
  }

  getActionPlan(getAll: boolean = false, additionalParams?: string): Observable<TestAndExercisePaginationResponse> {
    let params = '';
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params=='')?params+`?page=${TestActionPlanStore.currentPage}`:params+`&page=${TestActionPlanStore.currentPage}`;
      if (TestActionPlanStore.orderBy) params += `&order=${TestActionPlanStore.orderBy}`;
      if (TestActionPlanStore.orderItem) params += `&order_by=${TestActionPlanStore.orderItem}`;
      if (TestActionPlanStore.searchText) params += `&q=${TestActionPlanStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    return this._http.get<TestAndExercisePaginationResponse>('/test-and-exercise-action-plans'+(params?params:'')).pipe(
      map((res: TestAndExercisePaginationResponse) => {
        TestActionPlanStore.setTestActionPlan(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getActionPlanData(id: number,params?:string): Observable<IncidentCorrectiveAction> {
    return this._http.get<IncidentCorrectiveAction>('/test-and-exercise-action-plans/'+id+(params?params:'')).pipe(
      map((res: IncidentCorrectiveAction) => {
        TestActionPlanStore.setIndividualTestActionPlan(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }
  updateActionPlan(id,saveData): Observable<any> {
    return this._http.put('/test-and-exercise-action-plans/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_updated');

        this.getActionPlan().subscribe();

        return res;
      })
    );
  }
  deleteActionPlan(id: number) {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'custom-header': 'true' })
    // };
    return this._http.delete('/test-and-exercise-action-plans/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_deleted');
        this.getActionPlan().subscribe();
        return res;
      })
    );
  }
 
  updateActionPlanStatus(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/test-and-exercise-action-plan/" + actionplanId + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "action_plan_status_updated"
          );
          this.getActionPlan().subscribe();
          return res;
        })
      );
  }
  getHistory(actionplanId: number): Observable<HistoryResponse> {
    let params = '';
    params = `?page=${TestActionPlanStore.currentPage}`;
    if (TestActionPlanStore.orderBy) params += `&order_by=${TestActionPlanStore.historyOrderItem}&order=${TestActionPlanStore.historyOrderBy}`;

    return this._http.get<HistoryResponse>("/test-and-exercise-action-plan/" + actionplanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        TestActionPlanStore.setHistory(res);
        return res;
      })
    );
  }
}
