import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { MSAuditFindingCAStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-statuses-store';
import { MSAuditFindingCAStatusesPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-finding-ca-statuses';

@Injectable({
  providedIn: 'root'
})
export class MsAuditFindingCaStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MSAuditFindingCAStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MSAuditFindingCAStatusesMasterStore.currentPage}`;
        if (MSAuditFindingCAStatusesMasterStore.orderBy) params += `&order_by=${MSAuditFindingCAStatusesMasterStore.orderItem}&order=${MSAuditFindingCAStatusesMasterStore.orderBy}`;
      }
      if(MSAuditFindingCAStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=')+MSAuditFindingCAStatusesMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MSAuditFindingCAStatusesPaginationResponse>('/ms-audit-finding-corrective-action-statuses' + (params ? params : '')).pipe(
        map((res: MSAuditFindingCAStatusesPaginationResponse) => {
          MSAuditFindingCAStatusesMasterStore.setMSAuditFindingCAStatuses(res);
          return res;
        })
      );
    }

    // getItem(id: number): Observable<MSAuditFindingCAStatuses> {
    //   return this._http.get<MSAuditFindingCAStatuses>('/ms-audit-finding-corrective-action-statuses/' + id).pipe(
    //     map((res: MSAuditFindingCAStatuses) => {
    //       MSAuditFindingCAStatusesMasterStore.updateMSAuditFindingCAStatuses(res)
    //       return res;
    //     })
    //   );
    // }

    // activate(id: number) {
    //   return this._http.put('/ms-audit-finding-corrective-action-statuses/' + id + '/activate', null).pipe(
    //     map(res => {
    //       this._utilityService.showSuccessMessage('success', 'activate_success');
    //       this.getItems(false,null,true).subscribe();
    //       return res;
    //     })
    //   );
    // }
  
    // deactivate(id: number) {
    //   return this._http.put('/ms-audit-finding-corrective-action-statuses/' + id + '/deactivate', null).pipe(
    //     map(res => {
    //       this._utilityService.showSuccessMessage('success', 'deactivate_success');
    //       this.getItems(false,null,true).subscribe();
    //       return res;
    //     })
    //   );
    // }

    exportToExcel() {
      this._http.get('/ms-audit-finding-corrective-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_finding_corrective_action_types') + ".xlsx");
        }
      )
    }

    sortList(type:string, text:string) {
      if (!MSAuditFindingCAStatusesMasterStore.orderBy) {
        MSAuditFindingCAStatusesMasterStore.orderBy = 'asc';
        MSAuditFindingCAStatusesMasterStore.orderItem = type;
      }
      else{
        if (MSAuditFindingCAStatusesMasterStore.orderItem == type) {
          if(MSAuditFindingCAStatusesMasterStore.orderBy == 'asc') MSAuditFindingCAStatusesMasterStore.orderBy = 'desc';
          else MSAuditFindingCAStatusesMasterStore.orderBy = 'asc'
        }
        else{
          MSAuditFindingCAStatusesMasterStore.orderBy = 'asc';
          MSAuditFindingCAStatusesMasterStore.orderItem = type;
        }
      }
    }
}
