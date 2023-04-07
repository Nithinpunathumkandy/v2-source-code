import { Injectable } from '@angular/core';
import {ExternalAudit,ExternalAuditPaginationResponse} from 'src/app/core/models/external-audit/external-audit/external-audit';
import{ExternalAuditMasterStore} from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class ExternalAuditService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }


    getItems(getAll: boolean = false,additionalParams?:string,status=false): Observable<ExternalAuditPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ExternalAuditMasterStore.currentPage}`;
        if (ExternalAuditMasterStore.orderBy) params += `&order_by=${ExternalAuditMasterStore.orderItem}&order=${ExternalAuditMasterStore.orderBy}`;
      }
     
      if(additionalParams) params += additionalParams;
      if(ExternalAuditMasterStore.searchText) params += (params ? '&q=' : '?q=')+ExternalAuditMasterStore.searchText;
      if(status) params += (params ? '&' : '?') + 'status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'ea_audit' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ExternalAuditPaginationResponse>('/external-audits' + (params ? params : '')).pipe(
        map((res: ExternalAuditPaginationResponse) => {
          ExternalAuditMasterStore.setExternalAudit(res);
          return res;
        })
      );
   
    }


    setDocumentDetails(imageDetails,url){
      ExternalAuditMasterStore.setDocumentDetails(imageDetails,url);
    }


    saveItem(item: ExternalAudit) {
      return this._http.post('/external-audits', item).pipe(
        map((res:any )=> {
          ExternalAuditMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('Success!', 'external_audit_add');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: ExternalAudit): Observable<any> {
      return this._http.put('/external-audits/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_audit_update');
          this.getItems().subscribe();
          return res;
        })
      );
    }



    getItem(id): Observable<ExternalAudit> {
      return this._http.get<ExternalAudit>('/external-audits/'+id).pipe((
        map((res:ExternalAudit)=>{
          ExternalAuditMasterStore.setIndividualExternalAuditItem(res);
          return res;
        })
      ))
    }

    saveAuditId(id:number){
      ExternalAuditMasterStore.setAuditId(id);}


    getAllItems(): Observable<ExternalAudit[]>{
      return this._http.get<ExternalAudit[]>('/external-audits?is_all=true').pipe(
        map((res: ExternalAudit[]) => {
          
          ExternalAuditMasterStore.setAllExternalAudits(res);
          return res;
        })
      );
    }


    delete(id: number) {
      return this._http.delete('/external-audits/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_audit_delete');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              ExternalAuditMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/external-audits/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_audit_ activate');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/external-audits/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_audit_deactivate');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/external-audits/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('external_audit_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (ExternalAuditMasterStore.orderBy) params += `?order=${ExternalAuditMasterStore.orderBy}`;
      if (ExternalAuditMasterStore.orderItem) params += `&order_by=${ExternalAuditMasterStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'ea_audit' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/external-audits/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('external_audit')+".xlsx");
        }
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/external-audits/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','external_audit_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortExternalAuditlList(type:string, text:string) {
      if (!ExternalAuditMasterStore.orderBy) {
        ExternalAuditMasterStore.orderBy = 'asc';
        ExternalAuditMasterStore.orderItem = type;
      }
      else{
        if (ExternalAuditMasterStore.orderItem == type) {
          if(ExternalAuditMasterStore.orderBy == 'asc') ExternalAuditMasterStore.orderBy = 'desc';
          else ExternalAuditMasterStore.orderBy = 'asc'
        }
        else{
          ExternalAuditMasterStore.orderBy = 'asc';
          ExternalAuditMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
    

}
