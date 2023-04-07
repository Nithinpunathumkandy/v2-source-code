import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AmMeeting, AmMeetingPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-audit-meeting';
import { AmAuditMeetingStore } from 'src/app/stores/audit-management/am-audit/am-audit-meeting.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditMeetingService {

  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService
    ) { }
  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmMeetingPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditMeetingStore.currentPage}`;
      if (AmAuditMeetingStore.orderBy) params += `&order=${AmAuditMeetingStore.orderBy}`;
      if (AmAuditMeetingStore.orderItem) params += `&order_by=${AmAuditMeetingStore.orderItem}`;
      if (AmAuditMeetingStore.searchText) params += `&q=${AmAuditMeetingStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_meeting' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmMeetingPaginationResponse>('/am-audits/'+AmAuditsStore.auditId+'/meetings'+ (params ? params : '')).pipe(
        map((res: AmMeetingPaginationResponse) => {
          AmAuditMeetingStore.setAuditMeetingDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmMeeting> {
    return this._http.get<AmMeeting>('/am-audits/'+AmAuditsStore.auditId+'/meetings/' + id).pipe(
      map((res: AmMeeting) => {
        AmAuditMeetingStore.setIndividualAuditMeetingDetails(res);
        return res;
      })
    );
  }

  updateItem(request_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audits/'+AmAuditsStore.auditId+'/meetings/'+ request_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_meeting_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  
  saveItem(audit): Observable<any> {
    return this._http.post('/am-audits/'+AmAuditsStore.auditId+'/meetings', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_meeting_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audits/'+AmAuditsStore.auditId+'/meetings/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_meeting_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
  exportToExcel() {
    let params = '';
    if (AmAuditMeetingStore.orderBy) params += `?order=${AmAuditMeetingStore.orderBy}`;
    if (AmAuditMeetingStore.orderItem) params += `&order_by=${AmAuditMeetingStore.orderItem}`;
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_meeting' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);     
    this._http.get('/am-audits/'+AmAuditsStore.auditId+'/meetings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_meetings')+".xlsx");     
        SubMenuItemStore.exportClicked=false;
      }
    )
  }

  
	setDocumentDetails(imageDetails, url) {
		AmAuditMeetingStore.setDocumentDetails(imageDetails, url);
	}
}
