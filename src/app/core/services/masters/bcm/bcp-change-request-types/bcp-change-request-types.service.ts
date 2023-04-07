import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BCPChangeRequestTypesPaginationResponse } from 'src/app/core/models/masters/bcm/bcp-change-request-types';
import { BCPChangeRequestTypeMasterStore } from 'src/app/stores/masters/bcm/bcp-change-request-type.store';

@Injectable({
  providedIn: 'root'
})
export class BcpChangeRequestTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BCPChangeRequestTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${BCPChangeRequestTypeMasterStore.currentPage}`;
        if (BCPChangeRequestTypeMasterStore.orderBy) params += `&order=${BCPChangeRequestTypeMasterStore.orderBy}`;
        if (BCPChangeRequestTypeMasterStore.orderItem) params += `&order_by=${BCPChangeRequestTypeMasterStore.orderItem}`;
      }
      if (BCPChangeRequestTypeMasterStore.searchText) params += (params ? '&q=' : '?q=') + BCPChangeRequestTypeMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<BCPChangeRequestTypesPaginationResponse>('/bcp-change-request-types' + (params ? params : '')).pipe(
        map((res: BCPChangeRequestTypesPaginationResponse) => {
          BCPChangeRequestTypeMasterStore.setBCPChangeRequestTypes(res);
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/bcp-change-request-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcp_change_request_types')
          +".xlsx");
        }
      )
    }



    sortBusinessContinuityPlanStatusList(type:string, text:string) {
      if (!BCPChangeRequestTypeMasterStore.orderBy) {
        BCPChangeRequestTypeMasterStore.orderBy = 'asc';
        BCPChangeRequestTypeMasterStore.orderItem = type;
      }
      else{
        if (BCPChangeRequestTypeMasterStore.orderItem == type) {
          if(BCPChangeRequestTypeMasterStore.orderBy == 'asc') BCPChangeRequestTypeMasterStore.orderBy = 'desc';
          else BCPChangeRequestTypeMasterStore.orderBy = 'asc'
        }
        else{
          BCPChangeRequestTypeMasterStore.orderBy = 'asc';
          BCPChangeRequestTypeMasterStore.orderItem = type;
        }
      }
    }
}
