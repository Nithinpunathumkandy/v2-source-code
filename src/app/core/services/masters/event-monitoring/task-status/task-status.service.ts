import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {TaskstatusPaginationResponse,TaskstatusSingle} from 'src/app/core/models/masters/event-monitoring/task-status';
import {TaskstatusMasterStore} from 'src/app/stores/masters/event-monitoring/task-status-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<TaskstatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TaskstatusMasterStore.currentPage}`;
      if (TaskstatusMasterStore.orderBy)
        params += `&order_by=${TaskstatusMasterStore.orderItem}&order=${TaskstatusMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&taskstatus=all'
    if(TaskstatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+TaskstatusMasterStore.searchText;

    
    return this._http
      .get<TaskstatusPaginationResponse>('/event-task-statuses'+(params ? params : ''))
      .pipe(
        map((res: TaskstatusPaginationResponse) => {
          TaskstatusMasterStore.setTaskstatus(res);
          return res;
        })
      );
  }

  getItem(id): Observable<TaskstatusSingle> {
		return this._http.get<TaskstatusSingle>('/event-task-statuses/' + id).pipe(
			map((res: TaskstatusSingle) => {
				TaskstatusMasterStore.setIndividualTaskstatus(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-task-statuses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-task-statuses', item).pipe(
      map(res => {
        TaskstatusMasterStore.setLastInsertedtaskstatus(res['id']);
        this._utilityService.showSuccessMessage('success','event_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-task-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-task-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('taskstatus')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-task-statuses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-task-statuses/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-task-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-task-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-task-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            TaskstatusMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortTaskstatusList(type:string, text:string) {
    if (!TaskstatusMasterStore.orderBy) {
      TaskstatusMasterStore.orderBy = 'asc';
      TaskstatusMasterStore.orderItem = type;
    }
    else{
      if (TaskstatusMasterStore.orderItem == type) {
        if(TaskstatusMasterStore.orderBy == 'asc') TaskstatusMasterStore.orderBy = 'desc';
        else TaskstatusMasterStore.orderBy = 'asc'
      }
      else{
        TaskstatusMasterStore.orderBy = 'asc';
        TaskstatusMasterStore.orderItem = type;
      }
    }
  }
}
