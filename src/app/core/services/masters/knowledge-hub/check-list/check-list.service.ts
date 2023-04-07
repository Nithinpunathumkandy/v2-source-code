import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KhCheckList, KhCheckListPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/check-list';
import { KhCheckListMasterStore } from 'src/app/stores/masters/knowledge-hub/check-list-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all:boolean = false): Observable<KhCheckListPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KhCheckListMasterStore.currentPage}`;
      if (KhCheckListMasterStore.orderBy) params += `&order_by=${KhCheckListMasterStore.orderItem}&order=${KhCheckListMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(KhCheckListMasterStore.searchText) params += (params ? '&q=' : '?q=')+KhCheckListMasterStore.searchText;
    return this._http.get<KhCheckListPaginationResponse>('/knowledge-hub/checklists' + (params ? params : '')).pipe(
      map((res: KhCheckListPaginationResponse) => {

        KhCheckListMasterStore.setKnowledgeHub(res);
        return res;}
      ))
  }

  getAllItems():Observable<KhCheckList[]> {
    return this._http.get<KhCheckList[]>('/knowledge-hub/checklists').pipe((
     map((res:KhCheckList[]) => {

      KhCheckListMasterStore.setAllKnowledgeHub(res);
      return res;
     }) 
    ))
  }

  saveItem(item){
    return this._http.post('/knowledge-hub/checklists', item).pipe((
      map((res:any)=>{
        KhCheckListMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'knowledge_hub_checklist_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    ))
  }

  updateItem(id:number,item:KhCheckList): Observable<any> {
    return this._http.put('/knowledge-hub/checklists/' + id,item).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','knowledge_hub_checklist_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    ))
  }

  delete(id:number){
    return this._http.delete('/knowledge-hub/checklists/' + id).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','knowledge_hub_checklist_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            KhCheckListMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    ))
  }

  activate(id: number) {
    return this._http.put('/knowledge-hub/checklists/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'knowledge_hub_checklist_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/knowledge-hub/checklists/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'knowledge_hub_checklist_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/knowledge-hub/checklists/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('knowledge_hub_checklist_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/knowledge-hub/checklists/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('knowledge_hub_checklist')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/knowledge-hub/checklists/share',data).pipe(
      map((res:any )=> {
        // this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/knowledge-hub/checklists/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','knowledge_hub_checklist_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortAuditChecklList(type:string, text:string) {
    if (!KhCheckListMasterStore.orderBy) {
      KhCheckListMasterStore.orderBy = 'asc';
      KhCheckListMasterStore.orderItem = type;
    }
    else{
      if (KhCheckListMasterStore.orderItem == type) {
        if(KhCheckListMasterStore.orderBy == 'asc') KhCheckListMasterStore.orderBy = 'desc';
        else KhCheckListMasterStore.orderBy = 'asc'
      }
      else{
        KhCheckListMasterStore.orderBy = 'asc';
        KhCheckListMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}


