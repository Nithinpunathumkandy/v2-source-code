import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MSAuditFindingCATypesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-types-store';
import { MSAuditFindingCATypesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-finding-ca-types";
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditFindingCaTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MSAuditFindingCATypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MSAuditFindingCATypesMasterStore.currentPage}`;
        if (MSAuditFindingCATypesMasterStore.orderBy) params += `&order_by=${MSAuditFindingCATypesMasterStore.orderItem}&order=${MSAuditFindingCATypesMasterStore.orderBy}`;
      }
      if(MSAuditFindingCATypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+MSAuditFindingCATypesMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MSAuditFindingCATypesPaginationResponse>('/ms-audit-finding-corrective-action-types' + (params ? params : '')).pipe(
        map((res: MSAuditFindingCATypesPaginationResponse) => {
          MSAuditFindingCATypesMasterStore.setMSAuditFindingCATypes(res);
          return res;
        })
      );
    }

    // getItem(id: number): Observable<MSAuditFindingCATypes> {
    //   return this._http.get<MSAuditFindingCATypes>('/ms-audit-finding-corrective-action-types/' + id).pipe(
    //     map((res: MSAuditFindingCATypes) => {
    //       MSAuditFindingCATypesMasterStore.updateMSAuditFindingCATypes(res)
    //       return res;
    //     })
    //   );
    // }

    // activate(id: number) {
    //   return this._http.put('/ms-audit-finding-corrective-action-types/' + id + '/activate', null).pipe(
    //     map(res => {
    //       this._utilityService.showSuccessMessage('success', 'ms_audit_finding_corrective_action_types_activated');
    //       this.getItems(false,null,true).subscribe();
    //       return res;
    //     })
    //   );
    // }
  
    // deactivate(id: number) {
    //   return this._http.put('/ms-audit-finding-corrective-action-types/' + id + '/deactivate', null).pipe(
    //     map(res => {
    //       this._utilityService.showSuccessMessage('success', 'ms_audit_finding_corrective_action_types_deactivated');
    //       this.getItems(false,null,true).subscribe();
    //       return res;
    //     })
    //   );
    // }

    exportToExcel() {
      this._http.get('/ms-audit-finding-corrective-action-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_finding_corrective_action_types') + ".xlsx");
        }
      )
    }

    sortList(type:string, text:string) {
      if (!MSAuditFindingCATypesMasterStore.orderBy) {
        MSAuditFindingCATypesMasterStore.orderBy = 'asc';
        MSAuditFindingCATypesMasterStore.orderItem = type;
      }
      else{
        if (MSAuditFindingCATypesMasterStore.orderItem == type) {
          if(MSAuditFindingCATypesMasterStore.orderBy == 'asc') MSAuditFindingCATypesMasterStore.orderBy = 'desc';
          else MSAuditFindingCATypesMasterStore.orderBy = 'asc'
        }
        else{
          MSAuditFindingCATypesMasterStore.orderBy = 'asc';
          MSAuditFindingCATypesMasterStore.orderItem = type;
        }
      }
    }
}
