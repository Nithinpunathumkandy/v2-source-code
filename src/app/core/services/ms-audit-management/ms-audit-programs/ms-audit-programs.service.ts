import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditPrograms, MsAuditProgramsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-programs/ms-audit-programs';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class MsAuditProgramsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditProgramsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditProgramsStore.currentPage}&status=all`;
      if (MsAuditProgramsStore.orderBy) params += `&order_by=${MsAuditProgramsStore.orderItem}&order=${MsAuditProgramsStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditProgramsStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditProgramsStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_porgrams' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MsAuditProgramsPaginationResponse>('/ms-audit-programs' + (params ? params : '')).pipe(
      map((res: MsAuditProgramsPaginationResponse) => {
        MsAuditProgramsStore.setMsAuditPrograms(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<MsAuditPrograms> {
    return this._http.get<MsAuditPrograms>(`/ms-audit-programs/${id}`).pipe(
      map((res: MsAuditPrograms) => {
        MsAuditProgramsStore.setIndividualMsAuditPrgramsDetails(res);
        return res;
      })
    );
  }

  getFindingStatus(id: number): Observable<any> {
    return this._http.get<any>(`/dashboard/ms-audit-finding-by-statuses?ms_audit_program_ids=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getTeams(id: number): Observable<any> {
    return this._http.get<MsAuditPrograms>(`/ms-team-by-category/${id}`).pipe(
      map((res: any) => {
        
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/ms-audit-programs`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_programs_created_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(Id:number, data: MsAuditPrograms): Observable<any> {
    return this._http.put(`/ms-audit-programs/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_programs_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete("/ms-audit-programs/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "ms_audit_programs_deleted_successfully");
        this.getItems().subscribe((resp) => {
          if (resp.from == null) {
            MsAuditProgramsStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/ms-audit-programs/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_programs_template') +".xlsx");
      }
    )
  }

  exportToExcel(params?) {
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_porgrams' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/ms-audit-programs/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_programs') + ".xlsx");
      }
    )
  }

  sortList(type:string, text:string) {
    if (!MsAuditProgramsStore.orderBy) {
      MsAuditProgramsStore.orderBy = 'desc';
      MsAuditProgramsStore.orderItem = type;
    }
    else{
      if (MsAuditProgramsStore.orderItem == type) {
        if(MsAuditProgramsStore.orderBy == 'desc') MsAuditProgramsStore.orderBy = 'asc';
        else MsAuditProgramsStore.orderBy = 'desc'
      }
      else{
        MsAuditProgramsStore.orderBy = 'desc';
        MsAuditProgramsStore.orderItem = type;
      }
    }
  }
}
