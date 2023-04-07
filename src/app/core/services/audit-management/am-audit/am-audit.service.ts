import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditProgressResponse } from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work';
import { AmAudit, AmAuditPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-audit';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AmAuditService {

  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }

  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmAuditPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditsStore.currentPage}`;
      if (AmAuditsStore.orderBy) params += `&order=${AmAuditsStore.orderBy}`;
      if (AmAuditsStore.orderItem) params += `&order_by=${AmAuditsStore.orderItem}`;
      if (AmAuditsStore.searchText) params += `&q=${AmAuditsStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }

    if (RightSidebarLayoutStore.filterPageTag == 'am_audit' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmAuditPaginationResponse>('/am-audits' + (params ? params : '')).pipe(
        map((res: AmAuditPaginationResponse) => {
          AmAuditsStore.setAuditDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmAudit> {
    return this._http.get<AmAudit>('/am-audits/' + id).pipe(
      map((res: AmAudit) => {
        AmAuditsStore.setIndividualAuditDetails(res);
        return res;
      })
    );
  }

  updateItem(audit_plan_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audits/'+ audit_plan_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_updated');
        
        this.getItems().subscribe();
        this.getItem(res['id']).subscribe();

        return res;
      })
    );
  }

  
  saveItem(audit): Observable<any> {
    return this._http.post('/am-audits', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_added');
        this.getItems().subscribe();
        this.getItem(res['id']).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audits/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditList(type, callList: boolean = true) {
        if (!AmAuditsStore.orderBy) {
          AmAuditsStore.orderBy = 'asc';
          AmAuditsStore.orderItem = type;
        }
        else {
          if (AmAuditsStore.orderItem == type) {
            if (AmAuditsStore.orderBy == 'asc') AmAuditsStore.orderBy = 'desc';
            else AmAuditsStore.orderBy = 'asc'
          }
          else {
            AmAuditsStore.orderBy = 'asc';
            AmAuditsStore.orderItem = type;
          }
        }
        if (callList)
          this.getItems().subscribe();
      }

      generateTemplate() {
        this._http.get('/am-audits/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_template')+".xlsx");     
          }
        )
      }
    
      exportToExcel() {
        let params = '';
        if (AmAuditsStore.orderBy) params += `?order=${AmAuditsStore.orderBy}`;
        if (AmAuditsStore.orderItem) params += `&order_by=${AmAuditsStore.orderItem}`;
        if (RightSidebarLayoutStore.filterPageTag == 'am_audit' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString); 
          this._http.get('/am-audits/export'+params, { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit')+".xlsx");     
              SubMenuItemStore.exportClicked=false;
            }
          )
        
       
      }
    

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-audits/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_audit_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  
  getAmAuditProgress(id: number): Observable<AmAuditProgressResponse> {
    return this._http.get<AmAuditProgressResponse>('/am-audits/'+ id +'/details-completion').pipe(
      map((res: AmAuditProgressResponse) => {
        AmAuditsStore.setAuditProgress(res);
        return res;
      })
    ); 
}


  saveAuditId(id){
    AmAuditsStore.setAuditId(id)
  }
}
