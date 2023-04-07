import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsoUnsafeActionObservedGroup, JsoUnsafeActionObservedGroupPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-observed-group';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JsoUnsafeActionObservedGroupMasterStore } from 'src/app/stores/masters/jso/unsafe-action-observed-group-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class UnsafeActionObservedGroupService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<JsoUnsafeActionObservedGroupPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoUnsafeActionObservedGroupMasterStore.currentPage}`;
      if (JsoUnsafeActionObservedGroupMasterStore.orderBy) params += `&order_by=${JsoUnsafeActionObservedGroupMasterStore.orderItem}&order=${JsoUnsafeActionObservedGroupMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(JsoUnsafeActionObservedGroupMasterStore.searchText) params += (params ? '&q=' : '?q=')+JsoUnsafeActionObservedGroupMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<JsoUnsafeActionObservedGroupPaginationResponse>('/unsafe-action-observed-groups' + (params ? params : '')).pipe(
      map((res: JsoUnsafeActionObservedGroupPaginationResponse) => {
        JsoUnsafeActionObservedGroupMasterStore.setJsoUnsafeActionObservedGroup(res);
        return res;
      })
    );
  }
  saveItem(item: JsoUnsafeActionObservedGroup) {
    return this._http.post('/unsafe-action-observed-groups', item).pipe(
      map((res:any )=> {
        JsoUnsafeActionObservedGroupMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: JsoUnsafeActionObservedGroup): Observable<any> {
    return this._http.put('/unsafe-action-observed-groups/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/unsafe-action-observed-groups/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            JsoUnsafeActionObservedGroupMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/unsafe-action-observed-groups/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/unsafe-action-observed-groups/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/unsafe-action-observed-groups/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_observed_group_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/unsafe-action-observed-groups/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_observed_group')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/unsafe-action-observed-groups/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/unsafe-action-observed-groups/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortUnsafeActionObservedGrouplList(type:string, text:string) {
    if (!JsoUnsafeActionObservedGroupMasterStore.orderBy) {
      JsoUnsafeActionObservedGroupMasterStore.orderBy = 'asc';
      JsoUnsafeActionObservedGroupMasterStore.orderItem = type;
    }
    else{
      if (JsoUnsafeActionObservedGroupMasterStore.orderItem == type) {
        if(JsoUnsafeActionObservedGroupMasterStore.orderBy == 'asc') JsoUnsafeActionObservedGroupMasterStore.orderBy = 'desc';
        else JsoUnsafeActionObservedGroupMasterStore.orderBy = 'asc'
      }
      else{
        JsoUnsafeActionObservedGroupMasterStore.orderBy = 'asc';
        JsoUnsafeActionObservedGroupMasterStore.orderItem = type;
      }
    }
  }
}
