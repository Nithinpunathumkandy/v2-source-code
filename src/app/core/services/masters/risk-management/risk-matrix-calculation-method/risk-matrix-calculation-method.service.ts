import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {RiskMatrixCalculationMethodPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-matrix-calculation-method';
import{RiskMatrixCalculationMethodMasterStore} from 'src/app/stores/masters/risk-management/risk-matrix-calculation-method-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskMatrixCalculationMethodService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskMatrixCalculationMethodPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskMatrixCalculationMethodMasterStore.currentPage}`;
        if (RiskMatrixCalculationMethodMasterStore.orderBy) params += `&order_by=${RiskMatrixCalculationMethodMasterStore.orderItem}&order=${RiskMatrixCalculationMethodMasterStore.orderBy}`;
      }
      if(RiskMatrixCalculationMethodMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskMatrixCalculationMethodMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskMatrixCalculationMethodPaginationResponse>('/risk-matrix-calculation-methods' + (params ? params : '')).pipe(
        map((res: RiskMatrixCalculationMethodPaginationResponse) => {
          RiskMatrixCalculationMethodMasterStore.setRiskMatrixCalculationMethod(res);
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-matrix-calculation-methods/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_matrix_calculation_method_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-matrix-calculation-methods/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_matrix_calculation_method_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-matrix-calculation-methods/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_matrix_calculation_methods')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-matrix-calculation-methods/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskMatrixCalculationMethodList(type:string, text:string) {
      if (!RiskMatrixCalculationMethodMasterStore.orderBy) {
        RiskMatrixCalculationMethodMasterStore.orderBy = 'asc';
        RiskMatrixCalculationMethodMasterStore.orderItem = type;
      }
      else{
        if (RiskMatrixCalculationMethodMasterStore.orderItem == type) {
          if(RiskMatrixCalculationMethodMasterStore.orderBy == 'asc') RiskMatrixCalculationMethodMasterStore.orderBy = 'desc';
          else RiskMatrixCalculationMethodMasterStore.orderBy = 'asc'
        }
        else{
          RiskMatrixCalculationMethodMasterStore.orderBy = 'asc';
          RiskMatrixCalculationMethodMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
