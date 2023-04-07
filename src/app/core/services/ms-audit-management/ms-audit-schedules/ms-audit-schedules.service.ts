import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditSchedules, MsAuditSchedulesPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-schedules/ms-audit-schedules';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditSchedulesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditSchedulesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditSchedulesStore.currentPage}&status=all`;
      if (MsAuditSchedulesStore.orderBy) params += `&order_by=${MsAuditSchedulesStore.orderItem}&order=${MsAuditSchedulesStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditSchedulesStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditSchedulesStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_schedules' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MsAuditSchedulesPaginationResponse>('/ms-audit-schedules' + (params ? params : '')).pipe(
      map((res: MsAuditSchedulesPaginationResponse) => {
        MsAuditSchedulesStore.setMsAuditSchedules(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<MsAuditSchedules> {
    return this._http.get<MsAuditSchedules>(`/ms-audit-schedules/${id}`).pipe(
      map((res: MsAuditSchedules) => {
        MsAuditSchedulesStore.setIndividualMsAuditSchedulesDetails(res);
        return res;
      })
    );
  }

  saveAudit(data,id): Observable<any> {
    return this._http.put(`/ms-audit-schedules/`+id+'/start-audit', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'auited_successfully');
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/ms-audit-schedules`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_schedules_created_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(Id:number, data: MsAuditSchedules): Observable<any> {
    return this._http.put(`/ms-audit-schedules/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_schedules_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number,params?:string) {
    return this._http.delete("/ms-audit-schedules/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "ms_audit_schedules_deleted_successfully");
        this.getItems(false,params).subscribe((resp) => {
          if (resp.from == null) {
            MsAuditSchedulesStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false,params).subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/ms-audit-schedules/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_schedules_template')+".xlsx");
      }
    )
  }

  exportToExcel(params?) {
     params = '';
    if(MsAuditSchedulesStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditSchedulesStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_schedules' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/ms-audit-schedules/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('audit_schedules')+".xlsx");
      }
    )
  }

  update(Id, data): Observable<any> {
    return this._http.post(`/ms-audit-schedules/${Id}/updates`,data).pipe(
      map(res => {
          this._utilityService.showSuccessMessage('success', 'ms_audit_schedules_updated_successfully');
        return res;
      })
    );
  }


  sortList(type:string, text:string) {
    if (!MsAuditSchedulesStore.orderBy) {
      MsAuditSchedulesStore.orderBy = 'desc';
      MsAuditSchedulesStore.orderItem = type;
    }
    else{
      if (MsAuditSchedulesStore.orderItem == type) {
        if(MsAuditSchedulesStore.orderBy == 'desc') MsAuditSchedulesStore.orderBy = 'asc';
        else MsAuditSchedulesStore.orderBy = 'desc'
      }
      else{
        MsAuditSchedulesStore.orderBy = 'desc';
        MsAuditSchedulesStore.orderItem = type;
      }
    }
  }
}
