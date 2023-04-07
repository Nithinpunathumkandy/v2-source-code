import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {RiskTypePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-type';
import{RiskTypeMasterStore} from 'src/app/stores/masters/risk-management/risk-type-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskTypeMasterStore.currentPage}`;
        if (RiskTypeMasterStore.orderBy) params += `&order_by=${RiskTypeMasterStore.orderItem}&order=${RiskTypeMasterStore.orderBy}`;
      }
      if(RiskTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskTypeMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskTypePaginationResponse>('/risk-types' + (params ? params : '')).pipe(
        map((res: RiskTypePaginationResponse) => {
          RiskTypeMasterStore.setRiskType(res);
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_type_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_type_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskTypeList(type:string, text:string) {
      if (!RiskTypeMasterStore.orderBy) {
        RiskTypeMasterStore.orderBy = 'asc';
        RiskTypeMasterStore.orderItem = type;
      }
      else{
        if (RiskTypeMasterStore.orderItem == type) {
          if(RiskTypeMasterStore.orderBy == 'asc') RiskTypeMasterStore.orderBy = 'desc';
          else RiskTypeMasterStore.orderBy = 'asc'
        }
        else{
          RiskTypeMasterStore.orderBy = 'asc';
          RiskTypeMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
