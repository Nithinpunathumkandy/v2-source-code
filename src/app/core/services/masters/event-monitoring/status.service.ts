import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {StatusPaginationResponse,StatusSingle} from 'src/app/core/models/masters/event-monitoring/status';
import {StatusMasterStore} from 'src/app/stores/masters/event-monitoring/status-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<StatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StatusMasterStore.currentPage}`;
      if (StatusMasterStore.orderBy)
        params += `&order_by=${StatusMasterStore.orderItem}&order=${StatusMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(StatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+StatusMasterStore.searchText;

    
    return this._http
      .get<StatusPaginationResponse>('/event-statuses'+(params ? params : ''))
      .pipe(
        map((res: StatusPaginationResponse) => {
          StatusMasterStore.setStatus(res);
          return res;
        })
      );
  }

  getItem(id): Observable<StatusSingle> {
		return this._http.get<StatusSingle>('/event-statuses/' + id).pipe(
			map((res: StatusSingle) => {
				StatusMasterStore.setIndividualStatus(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-statuses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-statuses', item).pipe(
      map(res => {
        StatusMasterStore.setLastInsertedstatus(res['id']);
        this._utilityService.showSuccessMessage('success','event_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('status')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-statuses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-statuses/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            StatusMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortStatusList(type:string, text:string) {
    if (!StatusMasterStore.orderBy) {
      StatusMasterStore.orderBy = 'asc';
      StatusMasterStore.orderItem = type;
    }
    else{
      if (StatusMasterStore.orderItem == type) {
        if(StatusMasterStore.orderBy == 'asc') StatusMasterStore.orderBy = 'desc';
        else StatusMasterStore.orderBy = 'asc'
      }
      else{
        StatusMasterStore.orderBy = 'asc';
        StatusMasterStore.orderItem = type;
      }
    }
  }
}
