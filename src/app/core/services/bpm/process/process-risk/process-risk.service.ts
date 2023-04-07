import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from "rxjs/operators";
import {ProcessRisks,ProcessRiskPaginationResponse} from 'src/app/core/models/bpm/process/process_risk'
import { ProcessRiskStore } from '../../../../../stores/bpm/process/process_risk.store'
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import {ProcessStore} from 'src/app/stores/bpm/process/processes.store'
@Injectable({
  providedIn: 'root'
})
export class ProcessRiskService {

  constructor(private _http: HttpClient) { }

  getAllItems(getAll: boolean = false, resparams: string = '',status:boolean = false): Observable<ProcessRiskPaginationResponse> {
    let params = "";
    // isFunctional: boolean = false 
    // if (isFunctional)
    //   params = '?is_functional=true';
    // else
    //   params = '?is_corporate=true';
    if (!getAll) {
      params = `?page=${ProcessRiskStore.currentPage}`;
      if (ProcessRiskStore.orderBy) params += `&order=${ProcessRiskStore.orderBy}&order_by=${ProcessRiskStore.orderItem}`;
    }
    if (resparams) params += resparams;
    if(ProcessRiskStore.searchText) params += (params ? '&q=' : '?q=')+ProcessRiskStore.searchText;
    if (status) params += `&status=all`;
    console.log(params)
    if(RightSidebarLayoutStore.filterPageTag = 'risk' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<ProcessRiskPaginationResponse>('/processes/'+ ProcessStore.process_id + '/risks'+(params ? params : ''))
      .pipe(
        map((res: ProcessRiskPaginationResponse) => {
          ProcessRiskStore.setProcessesRisks(res);
          return res;
        })
      );
  }
}
