import { Injectable } from '@angular/core';
import { ExternalAuditTypes,ExternalAuditTypesPaginationResponse } from 'src/app/core/models/masters/external-audit/external-audit-types';
import {ExternalAuditTypesMasterStore} from 'src/app/stores/masters/external-audit/external-audit-types-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ExternalAuditTypesService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ExternalAuditTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ExternalAuditTypesMasterStore.currentPage}`;
        if (ExternalAuditTypesMasterStore.orderBy) params += `&order_by=${ExternalAuditTypesMasterStore.orderItem}&order=${ExternalAuditTypesMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(ExternalAuditTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+ExternalAuditTypesMasterStore.searchText;
      return this._http.get<ExternalAuditTypesPaginationResponse>('/external-audit-types' + (params ? params : '')).pipe(
        map((res: ExternalAuditTypesPaginationResponse) => {
          ExternalAuditTypesMasterStore.setExternalAuditType(res);
          return res;
        })
      );
   
    }

    

    getAllItems(): Observable<ExternalAuditTypes[]>{
      return this._http.get<ExternalAuditTypes[]>('/external-audit-types?is_all=true').pipe(
        map((res: ExternalAuditTypes[]) => {
          
          ExternalAuditTypesMasterStore.setAllExternalAuditTypes(res);
          return res;
        })
      );
    }

    saveItem(item: ExternalAuditTypes) {
      return this._http.post('/external-audit-types', item).pipe(
        map((res:any )=> {
          ExternalAuditTypesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'create_success');
          // if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
          // else this.getItems().subscribe();
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: ExternalAuditTypes): Observable<any> {
      return this._http.put('/external-audit-types/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/external-audit-types/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ExternalAuditTypesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/external-audit-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/external-audit-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/external-audit-types/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('external_audit_type_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/external-audit-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('external_audit_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/external-audit-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/external-audit-types/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortExternalAuditTypeslList(type:string, text:string) {
      if (!ExternalAuditTypesMasterStore.orderBy) {
        ExternalAuditTypesMasterStore.orderBy = 'asc';
        ExternalAuditTypesMasterStore.orderItem = type;
      }
      else{
        if (ExternalAuditTypesMasterStore.orderItem == type) {
          if(ExternalAuditTypesMasterStore.orderBy == 'asc') ExternalAuditTypesMasterStore.orderBy = 'desc';
          else ExternalAuditTypesMasterStore.orderBy = 'asc'
        }
        else{
          ExternalAuditTypesMasterStore.orderBy = 'asc';
          ExternalAuditTypesMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}



