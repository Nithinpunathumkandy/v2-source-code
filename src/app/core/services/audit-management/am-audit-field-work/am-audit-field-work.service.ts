import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse, AmAuditProgress, AmAuditProgressResponse} from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class AmAuditFieldWorkService {

 
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }

  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmAuditFieldWorkPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditFieldWorkStore.currentPage}`;
      if (AmAuditFieldWorkStore.orderBy) params += `&order=${AmAuditFieldWorkStore.orderBy}`;
      if (AmAuditFieldWorkStore.orderItem) params += `&order_by=${AmAuditFieldWorkStore.orderItem}`;
      if (AmAuditFieldWorkStore.searchText) params += `&q=${AmAuditFieldWorkStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag = 'am_audit_field_work' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmAuditFieldWorkPaginationResponse>('/am-audit-field-works' + (params ? params : '')).pipe(
        map((res: AmAuditFieldWorkPaginationResponse) => {
          AmAuditFieldWorkStore.setAuditFieldWorkDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmAuditFieldWork> {
    return this._http.get<AmAuditFieldWork>('/am-audit-field-works/' + id).pipe(
      map((res: AmAuditFieldWork) => {
        AmAuditFieldWorkStore.setIndividualAuditFieldWorkDetails(res);
        return res;
      })
    );
  }

  updateItem(audit_plan_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audit-field-works/'+ audit_plan_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_field_work_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  
  saveItem(auditFieldWork): Observable<any> {
    return this._http.post('/am-audit-field-works', auditFieldWork).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_field_work_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-field-works/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_field_work_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditFieldWorkList(type, callList: boolean = true) {
        if (!AmAuditFieldWorkStore.orderBy) {
          AmAuditFieldWorkStore.orderBy = 'asc';
          AmAuditFieldWorkStore.orderItem = type;
        }
        else {
          if (AmAuditFieldWorkStore.orderItem == type) {
            if (AmAuditFieldWorkStore.orderBy == 'asc') AmAuditFieldWorkStore.orderBy = 'desc';
            else AmAuditFieldWorkStore.orderBy = 'asc'
          }
          else {
            AmAuditFieldWorkStore.orderBy = 'asc';
            AmAuditFieldWorkStore.orderItem = type;
          }
        }
        if (callList)
          this.getItems().subscribe();
      }

      generateTemplate() {
        this._http.get('/am-audit-field-works/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, "audit-field-works.xlsx");
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_field_works_template')+".xlsx");     
          }
        )
      }
    
      exportToExcel() {
        let params = '';
        if (AmAuditFieldWorkStore.orderBy) params += `?order=${AmAuditFieldWorkStore.orderBy}`;
        if (AmAuditFieldWorkStore.orderItem) params += `&order_by=${AmAuditFieldWorkStore.orderItem}`;
        if(RightSidebarLayoutStore.filterPageTag = 'am_audit_field_work' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
          this._http.get('/am-audit-field-works/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_field_works')+".xlsx");     
              SubMenuItemStore.exportClicked=false;
            }
          )
        
       
      }
    

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-audit-field-works/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_audit_field_work_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  saveAuditFieldWorkId(id){
    AmAuditFieldWorkStore.setAuditFieldWorkId(id)
  }

  getAmAuditProgress(id: number): Observable<AmAuditProgressResponse> {
      return this._http.get<AmAuditProgressResponse>('/am-audits/'+ id +'/progress').pipe(
        map((res: AmAuditProgressResponse) => {
          AmAuditFieldWorkStore.setAmAuditProgress(res);
          return res;
        })
      ); 
  }


}
