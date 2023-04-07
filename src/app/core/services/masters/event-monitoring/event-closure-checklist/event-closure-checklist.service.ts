import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {EventClosureChecklistPaginationResponse,EventClosureChecklistSingle} from 'src/app/core/models/masters/event-monitoring/event-closure-checklist'
import {EventClosureChecklistMasterStore} from 'src/app/stores/masters/event-monitoring/event-closure-checklist-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class EventClosureChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EventClosureChecklistPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventClosureChecklistMasterStore.currentPage}`;
      if (EventClosureChecklistMasterStore.orderBy)
        params += `&order_by=${EventClosureChecklistMasterStore.orderItem}&order=${EventClosureChecklistMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventClosureChecklistMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventClosureChecklistMasterStore.searchText;

    
    return this._http
      .get<EventClosureChecklistPaginationResponse>('/event-closure-checklists'+(params ? params : ''))
      .pipe(
        map((res: EventClosureChecklistPaginationResponse) => {
          EventClosureChecklistMasterStore.setEventClosureChecklist(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventClosureChecklistSingle> {
		return this._http.get<EventClosureChecklistSingle>('/event-closure-checklists/' + id).pipe(
			map((res: EventClosureChecklistSingle) => {
				EventClosureChecklistMasterStore.setIndividualEventClosureChecklist(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-closure-checklists/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_closure_checklist_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-closure-checklists', item).pipe(
      map(res => {
        EventClosureChecklistMasterStore.setLastInsertedeventClosureChecklist(res['id']);
        this._utilityService.showSuccessMessage('success','event_closure_checklist_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-closure-checklists/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_closure_checklist_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-closure-checklists/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_closure_checklist')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-closure-checklists/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-closure-checklists/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_closure_checklist_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-closure-checklists/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_closure_checklist_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-closure-checklists/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_closure_checklist_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-closure-checklists/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_closure_checklist_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EventClosureChecklistMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortEventClosureChecklistList(type:string, text:string) {
    if (!EventClosureChecklistMasterStore.orderBy) {
      EventClosureChecklistMasterStore.orderBy = 'asc';
      EventClosureChecklistMasterStore.orderItem = type;
    }
    else{
      if (EventClosureChecklistMasterStore.orderItem == type) {
        if(EventClosureChecklistMasterStore.orderBy == 'asc') EventClosureChecklistMasterStore.orderBy = 'desc';
        else EventClosureChecklistMasterStore.orderBy = 'asc'
      }
      else{
        EventClosureChecklistMasterStore.orderBy = 'asc';
        EventClosureChecklistMasterStore.orderItem = type;
      }
    }
  }
}
