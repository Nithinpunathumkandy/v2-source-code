import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsmsRiskMatrixCalculationMethod, IsmsRiskMatrixCalculationMethodPaginationResponse } from 'src/app/core/models/masters/Isms/isms-risk-matrix-calculation-method';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskMatrixCalculationMethodMasterStore } from 'src/app/stores/masters/Isms/isms-risk-matrix-calculation-method-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskMatrixCalculationMethodService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IsmsRiskMatrixCalculationMethodPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsRiskMatrixCalculationMethodMasterStore.currentPage}`;
      if (IsmsRiskMatrixCalculationMethodMasterStore.orderBy) params += `&order_by=${IsmsRiskMatrixCalculationMethodMasterStore.orderItem}&order=${IsmsRiskMatrixCalculationMethodMasterStore.orderBy}`;
    }
    if(IsmsRiskMatrixCalculationMethodMasterStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskMatrixCalculationMethodMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<IsmsRiskMatrixCalculationMethodPaginationResponse>('/isms-risk-matrix-calculation-methods' + (params ? params : '')).pipe(
      map((res: IsmsRiskMatrixCalculationMethodPaginationResponse) => {
        IsmsRiskMatrixCalculationMethodMasterStore.setIsmsRiskMatrixCalculationMethod(res);
        return res;
      })
    );
  }


  exportToExcel() {
    this._http.get('/isms-risk-matrix-calculation-methods/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_matrix_calculation_methods')+".xlsx");
      }
    )
  }


  searchIsmsRiskMatrixCalculationMethod(params){
    return this.getItems(params ? params : '').pipe(
      map((res: IsmsRiskMatrixCalculationMethodPaginationResponse) => {
        IsmsRiskMatrixCalculationMethodMasterStore.setIsmsRiskMatrixCalculationMethod(res);
        return res;
      })
    );
  }

  sortIsmsRiskMatrixCalculationMethodList(type:string, text:string) {
    if (!IsmsRiskMatrixCalculationMethodMasterStore.orderBy) {
      IsmsRiskMatrixCalculationMethodMasterStore.orderBy = 'asc';
      IsmsRiskMatrixCalculationMethodMasterStore.orderItem = type;
    }
    else{
      if (IsmsRiskMatrixCalculationMethodMasterStore.orderItem == type) {
        if(IsmsRiskMatrixCalculationMethodMasterStore.orderBy == 'asc') IsmsRiskMatrixCalculationMethodMasterStore.orderBy = 'desc';
        else IsmsRiskMatrixCalculationMethodMasterStore.orderBy = 'asc'
      }
      else{
        IsmsRiskMatrixCalculationMethodMasterStore.orderBy = 'asc';
        IsmsRiskMatrixCalculationMethodMasterStore.orderItem = type;
      }
    }
   
  }
}

