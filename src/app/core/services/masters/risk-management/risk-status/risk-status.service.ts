import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskStatusPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-status';
import{RiskStatusMasterStore} from 'src/app/stores/masters/risk-management/risk-status-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskStatusMasterStore.currentPage}`;
        if (RiskStatusMasterStore.orderBy) params += `&order_by=${RiskStatusMasterStore.orderItem}&order=${RiskStatusMasterStore.orderBy}`;
      }
      if(RiskStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskStatusPaginationResponse>('/risk-statuses' + (params ? params : '')).pipe(
        map((res: RiskStatusPaginationResponse) => {
          RiskStatusMasterStore.setRiskStatus(res);
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/risk-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_status')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskStatusList(type:string, text:string) {
      if (!RiskStatusMasterStore.orderBy) {
        RiskStatusMasterStore.orderBy = 'asc';
        RiskStatusMasterStore.orderItem = type;
      }
      else{
        if (RiskStatusMasterStore.orderItem == type) {
          if(RiskStatusMasterStore.orderBy == 'asc') RiskStatusMasterStore.orderBy = 'desc';
          else RiskStatusMasterStore.orderBy = 'asc'
        }
        else{
          RiskStatusMasterStore.orderBy = 'asc';
          RiskStatusMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
