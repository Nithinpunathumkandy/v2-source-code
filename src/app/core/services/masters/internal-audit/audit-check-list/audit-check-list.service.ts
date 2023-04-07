import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditCheckList, AuditCheckListPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-check-list';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditCheckListService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all:boolean = false): Observable<AuditCheckListPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditCheckListMasterStore.currentPage}`;
      if (AuditCheckListMasterStore.orderBy) params += `&order_by=${AuditCheckListMasterStore.orderItem}&order=${AuditCheckListMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(AuditCheckListMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditCheckListMasterStore.searchText;
    return this._http.get<AuditCheckListPaginationResponse>('/checklists' + (params ? params : '')).pipe(
      map((res: AuditCheckListPaginationResponse) => {

        AuditCheckListMasterStore.setAuditCheckList(res);
        return res;}
      ))
  }

  getAllItems():Observable<AuditCheckList[]> {
    return this._http.get<AuditCheckList[]>('/checklists').pipe((
     map((res:AuditCheckList[]) => {

      AuditCheckListMasterStore.setAllAuditCheckList(res);
      return res;
     }) 
    ))
  }

  saveItem(item){
    return this._http.post('/checklists', item).pipe((
      map((res:any)=>{
        AuditCheckListMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    ))
  }

  updateItem(id:number,item:AuditCheckList): Observable<any> {
    return this._http.put('/checklists/' + id,item).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    ))
  }

  delete(id:number){
    return this._http.delete('/checklists/' + id).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            AuditCheckListMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    ))
  }

  activate(id: number) {
    return this._http.put('/checklists/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/checklists/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/checklists/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('checklist_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/checklists/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('checklists')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/checklists/share',data).pipe(
      map((res:any )=> {
        // this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/checklists/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortAuditChecklList(type:string, text:string) {
    if (!AuditCheckListMasterStore.orderBy) {
      AuditCheckListMasterStore.orderBy = 'asc';
      AuditCheckListMasterStore.orderItem = type;
    }
    else{
      if (AuditCheckListMasterStore.orderItem == type) {
        if(AuditCheckListMasterStore.orderBy == 'asc') AuditCheckListMasterStore.orderBy = 'desc';
        else AuditCheckListMasterStore.orderBy = 'asc'
      }
      else{
        AuditCheckListMasterStore.orderBy = 'asc';
        AuditCheckListMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}


