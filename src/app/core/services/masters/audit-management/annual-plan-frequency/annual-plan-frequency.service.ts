import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnnualPlanFrequencyPaginationResponse } from 'src/app/core/models/masters/audit-management/annual-plan-frequency';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AnnualPlanFrequencyMasterStore } from 'src/app/stores/masters/audit-management/annual-plan-frequency-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AnnualPlanFrequencyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AnnualPlanFrequencyPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AnnualPlanFrequencyMasterStore.currentPage}`;
      if (AnnualPlanFrequencyMasterStore.orderBy) params += `&order_by=${AnnualPlanFrequencyMasterStore.orderItem}&order=${AnnualPlanFrequencyMasterStore.orderBy}`;
    }
    if(AnnualPlanFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+AnnualPlanFrequencyMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AnnualPlanFrequencyPaginationResponse>('/am-annual-plan-frequencies' + (params ? params : '')).pipe(
      map((res: AnnualPlanFrequencyPaginationResponse) => {
        AnnualPlanFrequencyMasterStore.setAnnualPlanFrequency(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/am-annual-plan-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_annual_plan_frequency')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/am-annual-plan-frequencies/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/am-annual-plan-frequencies/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortAnnualPlanFrequencyList(type:string, text:string) {
    if (!AnnualPlanFrequencyMasterStore.orderBy) {
      AnnualPlanFrequencyMasterStore.orderBy = 'asc';
      AnnualPlanFrequencyMasterStore.orderItem = type;
    }
    else{
      if (AnnualPlanFrequencyMasterStore.orderItem == type) {
        if(AnnualPlanFrequencyMasterStore.orderBy == 'asc') AnnualPlanFrequencyMasterStore.orderBy = 'desc';
        else AnnualPlanFrequencyMasterStore.orderBy = 'asc'
      }
      else{
        AnnualPlanFrequencyMasterStore.orderBy = 'asc';
        AnnualPlanFrequencyMasterStore.orderItem = type;
      }
    }
  }
}
