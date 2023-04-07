import { Injectable } from '@angular/core';
import { AmAuditInformationRequestStore } from 'src/app/stores/audit-management/am-audit/am-audit-information-request.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAudit, AmAuditPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-audit';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AmInformationRequest, AmInformationRequestPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-information-request';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AmAuditInformationRequestService {

  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }
  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmInformationRequestPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditInformationRequestStore.currentPage}`;
      if (AmAuditInformationRequestStore.orderBy) params += `&order=${AmAuditInformationRequestStore.orderBy}`;
      if (AmAuditInformationRequestStore.orderItem) params += `&order_by=${AmAuditInformationRequestStore.orderItem}`;
      if (AmAuditInformationRequestStore.searchText) params += `&q=${AmAuditInformationRequestStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_info_request' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmInformationRequestPaginationResponse>('/am-audits/'+AmAuditsStore.auditId+'/information-requests'+ (params ? params : '')).pipe(
        map((res: AmInformationRequestPaginationResponse) => {
          AmAuditInformationRequestStore.setAuditDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmInformationRequest> {
    return this._http.get<AmInformationRequest>('/am-audits/'+AmAuditsStore.auditId+'/information-requests/' + id).pipe(
      map((res: AmInformationRequest) => {
        AmAuditInformationRequestStore.setIndividualAuditDetails(res);
        return res;
      })
    );
  }

  closeInformationRequest(id: number) {
    return this._http.put('/am-audits/'+AmAuditsStore.auditId+'/information-requests/'+id+'/close','').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'am_audit_information_request_closed');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  updateItem(request_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audits/'+AmAuditsStore.auditId+'/information-requests/'+ request_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_information_request_updated');
        
        this.getItems().subscribe();
     
        return res;
      })
    );
  }

  
  saveItem(audit): Observable<any> {
    return this._http.post('/am-audits/'+AmAuditsStore.auditId+'/information-requests', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_information_request_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audits/'+AmAuditsStore.auditId+'/information-requests/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_information_request_deleted');
         return res;
      })
    );
  }

  exportToExcel() {
    let params = '';
    if (AmAuditInformationRequestStore.orderBy) params += `?order=${AmAuditInformationRequestStore.orderBy}`;
    if (AmAuditInformationRequestStore.orderItem) params += `&order_by=${AmAuditInformationRequestStore.orderItem}`;
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_info_request' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);  
    this._http.get('/am-audits/'+AmAuditsStore.auditId+'/information-requests/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_information_request')+".xlsx");     
        SubMenuItemStore.exportClicked=false;
      }
    )
  }

  
	setDocumentDetails(imageDetails, url) {
		AmAuditInformationRequestStore.setDocumentDetails(imageDetails, url);
	}
}
