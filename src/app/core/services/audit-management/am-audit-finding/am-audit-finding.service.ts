import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { AmFinding, AmFindingPaginationResponse } from "src/app/core/models/audit-management/am-audit-finding/am-audit-finding";

import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditFindingService {

 
  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }
  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmFindingPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditFindingStore.currentPage}`;
      if (AmAuditFindingStore.orderBy) params += `&order=${AmAuditFindingStore.orderBy}`;
      if (AmAuditFindingStore.orderItem) params += `&order_by=${AmAuditFindingStore.orderItem}`;
      if (AmAuditFindingStore.searchText) params += `&q=${AmAuditFindingStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_fieldwork_finding' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString); 
  
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_finding' && RightSidebarLayoutStore.filtersAsQueryString)   
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString); 
      
    return this._http.get<AmFindingPaginationResponse>('/am-audit-findings'+ (params ? params : '')).pipe(
        map((res: AmFindingPaginationResponse) => {
          AmAuditFindingStore.setAuditFindingDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmFinding> {
    return this._http.get<AmFinding>('/am-audit-findings/' + id).pipe(
      map((res: AmFinding) => {
        AmAuditFindingStore.setIndividualAuditFindingDetails(res);
        return res;
      })
    );
  }

  updateItem(id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audit-findings/'+ id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_finding_updated');
        if(AmAuditFieldWorkStore.auditFieldWorkId){
          this.getItems(false,'am_audit_ids='+AmAuditFieldWorkStore.auditFieldWorkId).subscribe();
        }
        else{
          this.getItems().subscribe();
        }
        this.getItem(id).subscribe();

        return res;
      })
    );
  }

  
  saveItem(audit): Observable<any> {
    return this._http.post('/am-audit-findings', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_finding_added');
        if(AmAuditFieldWorkStore.auditFieldWorkId){
          this.getItems(false,'am_audit_ids='+AmAuditFieldWorkStore.auditFieldWorkId).subscribe();
        }
        else{
          this.getItems().subscribe();
        }
        this.getItem(res['id']).subscribe();
        
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-findings/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_finding_deleted');
        if(AmAuditFieldWorkStore.auditFieldWorkId){
          this.getItems(false,'am_audit_ids='+AmAuditFieldWorkStore.auditFieldWorkId).subscribe();
        }
        else{
          this.getItems().subscribe();
        }
        return res;
      })
    );
  }

  closeAuditFinding(id:number){
    return this._http.put('/am-audit-findings/'+id+'/close', null).pipe(
      map((res:any )=> {
        
        this._utilityService.showSuccessMessage('success', 'am_finding_close_message');
    
        this.getItem(id).subscribe();
        return res;
      })
    );
  }
  
	setDocumentDetails(imageDetails, url) {
		AmAuditFindingStore.setDocumentDetails(imageDetails, url);
	}

  
     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditFindingList(type, callList: boolean = true) {
        if (!AmAuditFindingStore.orderBy) {
          AmAuditFindingStore.orderBy = 'asc';
          AmAuditFindingStore.orderItem = type;
        }
        else {
          if (AmAuditFindingStore.orderItem == type) {
            if (AmAuditFindingStore.orderBy == 'asc') AmAuditFindingStore.orderBy = 'desc';
            else AmAuditFindingStore.orderBy = 'asc'
          }
          else {
            AmAuditFindingStore.orderBy = 'asc';
            AmAuditFindingStore.orderItem = type;
          }
        }
        if (callList)
          this.getItems().subscribe();
      }

      generateTemplate() {
        this._http.get('/am-audit-findings/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_findings_template')+".xlsx");     

          }
        )
      }
    
      exportToExcel(additionalParams?) {
        let params = '';
        if (AmAuditFindingStore.orderBy) params += `?order=${AmAuditFindingStore.orderBy}`;
        if (AmAuditFindingStore.orderItem) params += `&order_by=${AmAuditFindingStore.orderItem}`;
        if (RightSidebarLayoutStore.filterPageTag == 'am_audit_fieldwork_finding' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString); 
      
        if (RightSidebarLayoutStore.filterPageTag == 'am_audit_finding' && RightSidebarLayoutStore.filtersAsQueryString)   
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString); 
        if(additionalParams){
          params = (params=='')?('?'+additionalParams):(params+'&'+additionalParams);
        }    
          this._http.get('/am-audit-findings/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_findings')+".xlsx");     
              SubMenuItemStore.exportClicked=false;
            }
          )
        
       
      }
    

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-audit-findings/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_audit_field_work_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  saveAuditFindingId(id){
    AmAuditFindingStore.setAuditFindingId(id)
  }

}
