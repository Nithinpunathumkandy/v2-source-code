import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditNonConfirmitiesPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities'
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditNonConfirmitiesStore } from 'src/app/stores/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class MsAuditNonConfirmitiesService {


  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditNonConfirmitiesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditNonConfirmitiesStore.currentPage}&status=all`;
      if (MsAuditNonConfirmitiesStore.orderBy) params += `&order_by=${MsAuditNonConfirmitiesStore.orderItem}&order=${MsAuditNonConfirmitiesStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditNonConfirmitiesStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditNonConfirmitiesStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_non_confirmities' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MsAuditNonConfirmitiesPaginationResponse>('/ms-audit-findings' + (params ? params : '')).pipe(
      map((res: MsAuditNonConfirmitiesPaginationResponse) => {
        MsAuditNonConfirmitiesStore.setMsAuditNonConfirmities(res);
        return res;
      })
    );
  }

  exportToExcel() {
    let params = '';
    if (MsAuditNonConfirmitiesStore.orderBy) params += `?order=${MsAuditNonConfirmitiesStore.orderBy}`;
    if (MsAuditNonConfirmitiesStore.orderItem) params += `&order_by=${MsAuditNonConfirmitiesStore.orderItem}`;
    // if (MsAuditPlansStore.searchText) params += `&q=${MsAuditPlansStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_non_confirmities' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/ms-audit-findings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('findings')+".xlsx");
      }
    )
  }

  sortList(type:string, text:string) {
    if (!MsAuditNonConfirmitiesStore.orderBy) {
      MsAuditNonConfirmitiesStore.orderBy = 'desc';
      MsAuditNonConfirmitiesStore.orderItem = type;
    }
    else{
      if (MsAuditNonConfirmitiesStore.orderItem == type) {
        if(MsAuditNonConfirmitiesStore.orderBy == 'desc') MsAuditNonConfirmitiesStore.orderBy = 'asc';
        else MsAuditNonConfirmitiesStore.orderBy = 'desc'
      }
      else{
        MsAuditNonConfirmitiesStore.orderBy = 'desc';
        MsAuditNonConfirmitiesStore.orderItem = type;
      }
    }
  }

  selectRequired(items){// for mapping
    MsAuditNonConfirmitiesStore.addSelecteditems(items);
  }

}
