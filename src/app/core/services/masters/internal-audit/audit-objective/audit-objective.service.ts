import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditObjective, AuditObjectivePaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-objective';
import { AuditObjectiveMasterStore } from 'src/app/stores/masters/internal-audit/audit-objective-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditObjectiveService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<AuditObjectivePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditObjectiveMasterStore.currentPage}`;
      if (AuditObjectiveMasterStore.orderBy) params += `&order_by=${AuditObjectiveMasterStore.orderItem}&order=${AuditObjectiveMasterStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(AuditObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditObjectiveMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<AuditObjectivePaginationResponse>('/audit-objectives' + (params ? params : '')).pipe(
      map((res: AuditObjectivePaginationResponse) => {
        AuditObjectiveMasterStore.setAuditObjective(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<AuditObjective[]>{
    return this._http.get<AuditObjective[]>('/audit-objectives?is_all=true').pipe(
      map((res: AuditObjective[]) => {
        
        AuditObjectiveMasterStore.setAllAuditObjective(res);
        return res;
      })
    );
  }

  saveItem(item: AuditObjective) {
    return this._http.post('/audit-objectives', item).pipe(
      map((res:any )=> {
         AuditObjectiveMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true)
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: AuditObjective): Observable<any> {
    return this._http.put('/audit-objectives/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/audit-objectives/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            AuditObjectiveMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/audit-objectives/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/audit-objectives/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/audit-objectives/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_objective_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/audit-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_objectives')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/audit-objectives/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/audit-objectives/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortAuditObjectivelList(type:string, text:string) {
    if (!AuditObjectiveMasterStore.orderBy) {
      AuditObjectiveMasterStore.orderBy = 'asc';
      AuditObjectiveMasterStore.orderItem = type;
    }
    else{
      if (AuditObjectiveMasterStore.orderItem == type) {
        if(AuditObjectiveMasterStore.orderBy == 'asc') AuditObjectiveMasterStore.orderBy = 'desc';
        else AuditObjectiveMasterStore.orderBy = 'asc'
      }
      else{
        AuditObjectiveMasterStore.orderBy = 'asc';
        AuditObjectiveMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
  
}


