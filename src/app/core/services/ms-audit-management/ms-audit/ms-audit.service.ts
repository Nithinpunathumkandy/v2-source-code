import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditPlansPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-plans/ms-audit-plans';
import { MsAuditDetails, MsAuditPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditService {
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  MsAuditPlansStore=MsAuditPlansStore
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditStore.currentPage}&status=all`;
      if (MsAuditStore.orderBy) params += `&order_by=${MsAuditStore.orderItem}&order=${MsAuditStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditStore.searchText;
     if(RightSidebarLayoutStore.filterPageTag == 'ms_audits' && RightSidebarLayoutStore.filtersAsQueryString)
     params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MsAuditPaginationResponse>('/ms-audits' + (params ? params : '')).pipe(
      map((res: MsAuditPaginationResponse) => {
        MsAuditStore.setMsAudit(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<MsAuditDetails> {
    return this._http.get<MsAuditDetails>(`/ms-audits/${id}`).pipe(
      map((res: MsAuditDetails) => {
        MsAuditStore.setIndividualMsAuditDetails(res);
        MsAuditPlansStore.setMsAuditPlansId(res.ms_audit_plan?.id)
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/ms-audits`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_created');
        this.getItems().subscribe();
        return res;
      })
    );
  }
  
  updateItem(Id:number, data: MsAuditDetails): Observable<any> {
    return this._http.put(`/ms-audits/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete("/ms-audits/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "ms_audit_deleted");
        this.getItems().subscribe((resp) => {
          if (resp.from == null) {
            MsAuditStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  markAuditDateUpdate(Id,data): Observable<any> {
    return this._http.put(`/ms-audits/${Id}/complete`,data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'date_has_been_updated');
        this.getItem(Id).subscribe();
        return res;
      })
    );
  }

  openMeeting(Id,data): Observable<any> {
    return this._http.put(`/ms-audits/${Id}/opening-meeting`,data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'participants_added');
        this.getItem(Id).subscribe();
        return res;
      })
    );
  }


  exportToExcel(getAll: boolean = false, additionalParams?: string) {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditStore.currentPage}&status=all`;
      if (MsAuditStore.orderBy) params += `&order_by=${MsAuditStore.orderItem}&order=${MsAuditStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'ms_audits' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/ms-audits/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audits')+".xlsx");
      }
    )
  }

 

  sortList(type:string, text:string) {
    if (!MsAuditStore.orderBy) {
      MsAuditStore.orderBy = 'desc';
      MsAuditStore.orderItem = type;
    }
    else{
      if (MsAuditStore.orderItem == type) {
        if(MsAuditStore.orderBy == 'desc') MsAuditStore.orderBy = 'asc';
        else MsAuditStore.orderBy = 'desc'
      }
      else{
        MsAuditStore.orderBy = 'desc';
        MsAuditStore.orderItem = type;
      }
    }
  }

  selectRequired(items){// for mapping
    MsAuditStore.addSelecteditems(items);
  }
}
