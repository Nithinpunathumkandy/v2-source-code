import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  MatrixPlanPaginationResponse, MatrixPlanDetails,MatrixType} from "src/app/core/models/event-monitoring/event-maturity-matrix/maturity-matrix-plan"
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class MaturityMatrixService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }
  
    getPlanItems(additionalParams?:string,is_all:boolean = false): Observable<MatrixPlanPaginationResponse> {
    let params = '';
    params = `?page=${MaturityMatrixPlanStore.currentPage}`;
    if (MaturityMatrixPlanStore.orderBy)
        params += `&order_by=${MaturityMatrixPlanStore.orderItem}&order=${MaturityMatrixPlanStore.orderBy}`;
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(MaturityMatrixPlanStore.searchText) params += (params ? '&q=' : '?q=')+MaturityMatrixPlanStore.searchText;
    return this._http
      .get<MatrixPlanPaginationResponse>('/maturity-matrix-plans'+(params ? params : ''))
      .pipe(
        map((res: MatrixPlanPaginationResponse) => {
          MaturityMatrixPlanStore.setMatrixPlanList(res);
          return res;
        })
      );
  }

  getPlanItem(id) : Observable<MatrixPlanDetails>{
    return this._http.get<MatrixPlanDetails>('/maturity-matrix-plans/' +id).pipe(
      map((res: MatrixPlanDetails) => {
        MaturityMatrixPlanStore.setMatrixPlanDetails(res)
        return res;
      })
    );
  }

  getAsessmentChart(id,typeId) : Observable<any>{
    if(!typeId)
    {
      typeId="";
    }
    return this._http.get<any>('/maturity-matrix-plans/' +id+'/assessment-chart?type_id='+typeId).pipe(
      map((res: any) => {
        MaturityMatrixPlanStore.setMatrixPlanAsessmentChart(res)
        return res;
      })
    );
  }

  updatePlanItem(item, id): Observable<any> {
    return this._http.put('/maturity-matrix-plans/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','matrix_plan_updated');
        this.getPlanItems(null,true).subscribe();
        this.getPlanItem(id).subscribe();
        return res;
      })
    );
  }

  savePlanItem(item) {
    return this._http.post('/maturity-matrix-plans', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','matrix_plan_added');
        if(this._helperService.checkMasterUrl()) this.getPlanItems(null,true);
        else this.getPlanItems().subscribe();
        return res;
      })
    );
  }

  generatePlanTemplate() {
    this._http.get('/events/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('matrix_plan_template')+".xlsx");
      }
    )
  }

  exportPlanToExcel() {
    this._http.get('/events/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('matrix_plan')+".xlsx");
      }
    )
  }

  deletePlan(id: number) {
    return this._http.delete('/maturity-matrix-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','matrix_plan_deleted');
        this.getPlanItems(null,true).subscribe(resp=>{
          if(resp.from==null){
            MaturityMatrixPlanStore.setCurrentPage(resp.current_page-1);
            this.getPlanItems(null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  getMatrixType()
  {
    return this._http.get<MatrixType>('/maturity-matrices').pipe(
      map((res: MatrixType) => {
        MaturityMatrixPlanStore.setMatrixType(res)
        return res;
      })
    );
  }

  getMatrixTypeAsessment(id)
  {
    return this._http.get<MatrixType>('/maturity-matrix-plans/'+id+'/assessments').pipe(
      map((res: MatrixType) => {
        MaturityMatrixPlanStore.setMatrixAsessment(res)
        return res;
      })
    );
  }

  matrixConfirmAsessment(planId,asessmentId,data)
  {
    return this._http.put<any>('/maturity-matrix-plans/'+planId+'/assessments/'+asessmentId,data).pipe(
      map((res: any) => {
        //MaturityMatrixPlanStore.setMatrixAsessment(res)
        this._utilityService.showSuccessMessage('success','matrix_asessment_parameter_success');
       this.getMatrixTypeAsessment(planId).subscribe();

        return res;
      })
    );
  }
 

  sortMatrixPlanList(type:string) {
    if (!MaturityMatrixPlanStore.orderBy) {
      MaturityMatrixPlanStore.orderBy = 'asc';
      MaturityMatrixPlanStore.orderItem = type;
    }
    else{
      if (MaturityMatrixPlanStore.orderItem == type) {
        if(MaturityMatrixPlanStore.orderBy == 'asc') MaturityMatrixPlanStore.orderBy = 'desc';
        else MaturityMatrixPlanStore.orderBy = 'asc'
      }
      else{
        MaturityMatrixPlanStore.orderBy = 'asc';
        MaturityMatrixPlanStore.orderItem = type;
      }
    }
  }
}
