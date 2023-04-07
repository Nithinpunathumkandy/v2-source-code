import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProcessGroups,ProcessGroupsPaginationResponse} from '../../../../models/masters/bpm/process-groups'
import {ProcessGroupsMasterStore} from '../../../../../stores/masters/bpm/process-groups-master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProcessGroupsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }



  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProcessGroupsPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ProcessGroupsMasterStore.currentPage}`;
      if (ProcessGroupsMasterStore.orderBy)
        params += `&order_by=${ProcessGroupsMasterStore.orderItem}&order=${ProcessGroupsMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(ProcessGroupsMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProcessGroupsMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http
      .get<ProcessGroupsPaginationResponse>('/process-groups'+(params ? params : ''))
      .pipe(
        map((res: ProcessGroupsPaginationResponse) => {
          ProcessGroupsMasterStore.setProcessGroups(res);
          return res;
        })
      );
  }

  updateItem(id, item: ProcessGroups): Observable<any> {
    return this._http.put('/process-groups/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: ProcessGroups) {
    return this._http.post('/process-groups', item).pipe(
      map(res => {
        ProcessGroupsMasterStore.setLastInsertedProcessGroup(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/process-groups/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_group_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/process-groups/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_group')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/process-groups/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/process-groups/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/process-groups/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/process-groups/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/process-groups/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProcessGroupsMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortprocessGroupList(type:string, text:string) {
    if (!ProcessGroupsMasterStore.orderBy) {
      ProcessGroupsMasterStore.orderBy = 'asc';
      ProcessGroupsMasterStore.orderItem = type;
    }
    else{
      if (ProcessGroupsMasterStore.orderItem == type) {
        if(ProcessGroupsMasterStore.orderBy == 'asc') ProcessGroupsMasterStore.orderBy = 'desc';
        else ProcessGroupsMasterStore.orderBy = 'asc'
      }
      else{
        ProcessGroupsMasterStore.orderBy = 'asc';
        ProcessGroupsMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
