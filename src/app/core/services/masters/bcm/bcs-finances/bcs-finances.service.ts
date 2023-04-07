import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BcsFinancePaginationResponse } from 'src/app/core/models/masters/bcm/bcs-finances';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcsFinanceMasterStore } from 'src/app/stores/masters/bcm/bcs-finances-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcsFinancesService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<BcsFinancePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcsFinanceMasterStore.currentPage}`;
      if (BcsFinanceMasterStore.orderBy) params += `&order_by=${BcsFinanceMasterStore.orderItem}&order=${BcsFinanceMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (BcsFinanceMasterStore.searchText) params += (params ? '&q=' : '?q=') + BcsFinanceMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<BcsFinancePaginationResponse>('/bcs-finances' + (params ? params : '')).pipe(
      map((res: BcsFinancePaginationResponse) => {
        BcsFinanceMasterStore.setBcsFinance(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/bcs-finances/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcs_finances') + ".xlsx");
      }
    )
  }

  sortBcsStatus(type: string, text: string) {
    if (!BcsFinanceMasterStore.orderBy) {
      BcsFinanceMasterStore.orderBy = 'asc';
      BcsFinanceMasterStore.orderItem = type;
    }
    else {
      if (BcsFinanceMasterStore.orderItem == type) {
        if (BcsFinanceMasterStore.orderBy == 'asc') BcsFinanceMasterStore.orderBy = 'desc';
        else BcsFinanceMasterStore.orderBy = 'asc'
      }
      else {
        BcsFinanceMasterStore.orderBy = 'asc';
        BcsFinanceMasterStore.orderItem = type;
      }
    }
  }
}
