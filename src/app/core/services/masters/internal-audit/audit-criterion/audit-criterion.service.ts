import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditCriterion,AuditCriterionPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-criterion';
import{AuditCriterionMasterStore} from 'src/app/stores/masters/internal-audit/audit-criterion-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditCriterionService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    

 getItems(getAll: boolean = false,additionalParams?:string,is_all: boolean = false): Observable<AuditCriterionPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditCriterionMasterStore.currentPage}`;
        if (AuditCriterionMasterStore.orderBy) params += `&order_by=${AuditCriterionMasterStore.orderItem}&order=${AuditCriterionMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditCriterionMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditCriterionMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<AuditCriterionPaginationResponse>('/audit-criteria' + (params ? params : '')).pipe(
        map((res: AuditCriterionPaginationResponse) => {
          AuditCriterionMasterStore.setAuditCriteria(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AuditCriterion[]>{
      return this._http.get<AuditCriterion[]>('/audit-criteria?is_all=true').pipe(
        map((res: AuditCriterion[]) => {
          
          AuditCriterionMasterStore.setAllAuditCriteria(res);
          return res;
        })
      );
    }

    saveItem(item: AuditCriterion) {
      return this._http.post('/audit-criteria', item).pipe(
        map((res:any )=> {
           AuditCriterionMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: AuditCriterion): Observable<any> {
      return this._http.put('/audit-criteria/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/audit-criteria/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              AuditCriterionMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/audit-criteria/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/audit-criteria/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/audit-criteria/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_criterion_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/audit-criteria/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/audit-criteria/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
  
    exportToExcel() {
      this._http.get('/audit-criteria/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_criteria')+".xlsx");
        }
      )
    }

    sortAuditCriterialList(type:string, text:string) {
      if (!AuditCriterionMasterStore.orderBy) {
        AuditCriterionMasterStore.orderBy = 'asc';
        AuditCriterionMasterStore.orderItem = type;
      }
      else{
        if (AuditCriterionMasterStore.orderItem == type) {
          if(AuditCriterionMasterStore.orderBy == 'asc') AuditCriterionMasterStore.orderBy = 'desc';
          else AuditCriterionMasterStore.orderBy = 'asc'
        }
        else{
          AuditCriterionMasterStore.orderBy = 'asc';
          AuditCriterionMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}

