import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {RiskTreatmentStatuses, RiskTreatmentStatusesPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-treatment-statuses';
import {RiskTreatmentStatusesMasterStore} from 'src/app/stores/masters/risk-management/risk-treatment-statuses-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskTreatmentStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskTreatmentStatusesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${RiskTreatmentStatusesMasterStore.currentPage}`;
      if (RiskTreatmentStatusesMasterStore.orderBy) params += `&order_by=${RiskTreatmentStatusesMasterStore.orderItem}&order=${RiskTreatmentStatusesMasterStore.orderBy}`;
    }
    if(RiskTreatmentStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskTreatmentStatusesMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<RiskTreatmentStatusesPaginationResponse>('/risk-treatment-statuses' + (params ? params : '')).pipe(
      map((res: RiskTreatmentStatusesPaginationResponse) => {
        RiskTreatmentStatusesMasterStore.setRiskTreatmentStatuses(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<RiskTreatmentStatuses[]> {
    return this._http.get<RiskTreatmentStatuses[]>('/risk-treatment-statuses').pipe((
      map((res:RiskTreatmentStatuses[])=>{
        RiskTreatmentStatusesMasterStore.setAllRiskTreatmentStatuses(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<RiskTreatmentStatuses> {
    return this._http.get<RiskTreatmentStatuses>('/risk-treatment-statuses/'+id).pipe((
      map((res:RiskTreatmentStatuses)=>{
        RiskTreatmentStatusesMasterStore.setIndividualRiskTreatmentStatuses(res);
        return res;
      })
    ))
  }

  sortRiskTreatmentStatusesList(type:string, text:string) {
    if (!RiskTreatmentStatusesMasterStore.orderBy) {
      RiskTreatmentStatusesMasterStore.orderBy = 'asc';
      RiskTreatmentStatusesMasterStore.orderItem = type;
    }
    else{
      if (RiskTreatmentStatusesMasterStore.orderItem == type) {
        if(RiskTreatmentStatusesMasterStore.orderBy == 'asc') RiskTreatmentStatusesMasterStore.orderBy = 'desc';
        else RiskTreatmentStatusesMasterStore.orderBy = 'asc'
      }
      else{
        RiskTreatmentStatusesMasterStore.orderBy = 'asc';
        RiskTreatmentStatusesMasterStore.orderItem = type;
      }
    }
  }
}