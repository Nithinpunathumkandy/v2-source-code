import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BcsStatusPaginationResponse } from 'src/app/core/models/masters/bcm/bcs-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcsStatusMasterStore } from 'src/app/stores/masters/bcm/bcs-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcsStatusService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<BcsStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcsStatusMasterStore.currentPage}`;
      if (BcsStatusMasterStore.orderBy) params += `&order_by=${BcsStatusMasterStore.orderItem}&order=${BcsStatusMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (BcsStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + BcsStatusMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<BcsStatusPaginationResponse>('/bcs-statuses' + (params ? params : '')).pipe(
      map((res: BcsStatusPaginationResponse) => {
        BcsStatusMasterStore.setBcsStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/bcs-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcs_statuses') + ".xlsx");
      }
    )
  }

  sortBcsStatus(type: string, text: string) {
    if (!BcsStatusMasterStore.orderBy) {
      BcsStatusMasterStore.orderBy = 'asc';
      BcsStatusMasterStore.orderItem = type;
    }
    else {
      if (BcsStatusMasterStore.orderItem == type) {
        if (BcsStatusMasterStore.orderBy == 'asc') BcsStatusMasterStore.orderBy = 'desc';
        else BcsStatusMasterStore.orderBy = 'asc'
      }
      else {
        BcsStatusMasterStore.orderBy = 'asc';
        BcsStatusMasterStore.orderItem = type;
      }
    }
  }
}
