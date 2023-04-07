import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnnualPlanFrequencyItemPaginationResponse } from 'src/app/core/models/masters/audit-management/annual-audit-plan-frequency-item';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AnnualPlanFrequencyItemMasterStore } from 'src/app/stores/masters/audit-management/annual-audit-plan-frequency-item-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AnnualAuditPlanFrequencyItemService {

  constructor(

    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AnnualPlanFrequencyItemPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AnnualPlanFrequencyItemMasterStore.currentPage}`;
      if (AnnualPlanFrequencyItemMasterStore.orderBy) params += `&order_by=${AnnualPlanFrequencyItemMasterStore.orderItem}&order=${AnnualPlanFrequencyItemMasterStore.orderBy}`;
    }
    if(AnnualPlanFrequencyItemMasterStore.searchText) params += (params ? '&q=' : '?q=')+AnnualPlanFrequencyItemMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AnnualPlanFrequencyItemPaginationResponse>('/am-annual-plan-frequency-items' + (params ? params : '')).pipe(
      map((res: AnnualPlanFrequencyItemPaginationResponse) => {
        AnnualPlanFrequencyItemMasterStore.setAnnualPlanFrequencyItem(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/am-annual-plan-frequency-items/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_annual_plan_frequency_item')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/am-annual-plan-frequency-items/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/am-annual-plan-frequency-items/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortAnnualPlanFrequencyItemList(type:string, text:string) {
    if (!AnnualPlanFrequencyItemMasterStore.orderBy) {
      AnnualPlanFrequencyItemMasterStore.orderBy = 'asc';
      AnnualPlanFrequencyItemMasterStore.orderItem = type;
    }
    else{
      if (AnnualPlanFrequencyItemMasterStore.orderItem == type) {
        if(AnnualPlanFrequencyItemMasterStore.orderBy == 'asc') AnnualPlanFrequencyItemMasterStore.orderBy = 'desc';
        else AnnualPlanFrequencyItemMasterStore.orderBy = 'asc'
      }
      else{
        AnnualPlanFrequencyItemMasterStore.orderBy = 'asc';
        AnnualPlanFrequencyItemMasterStore.orderItem = type;
      }
    }
  }
}
