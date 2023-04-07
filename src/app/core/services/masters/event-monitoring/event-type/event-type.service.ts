import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {EventTypePaginationResponse,EventTypeSingle} from 'src/app/core/models/masters/event-monitoring/event-type'
import {EventTypeMasterStore} from 'src/app/stores/masters/event-monitoring/event-type-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EventTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventTypeMasterStore.currentPage}`;
      if (EventTypeMasterStore.orderBy)
        params += `&order_by=${EventTypeMasterStore.orderItem}&order=${EventTypeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventTypeMasterStore.searchText;

    
    return this._http
      .get<EventTypePaginationResponse>('/event-types'+(params ? params : ''))
      .pipe(
        map((res: EventTypePaginationResponse) => {
          EventTypeMasterStore.setEventType(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventTypeSingle> {
		return this._http.get<EventTypeSingle>('/event-types/' + id).pipe(
			map((res: EventTypeSingle) => {
				EventTypeMasterStore.setIndividualEventType(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-types', item).pipe(
      map(res => {
        EventTypeMasterStore.setLastInsertedeventType(res['id']);
        this._utilityService.showSuccessMessage('success','event_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EventTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortEventTypeList(type:string, text:string) {
    if (!EventTypeMasterStore.orderBy) {
      EventTypeMasterStore.orderBy = 'asc';
      EventTypeMasterStore.orderItem = type;
    }
    else{
      if (EventTypeMasterStore.orderItem == type) {
        if(EventTypeMasterStore.orderBy == 'asc') EventTypeMasterStore.orderBy = 'desc';
        else EventTypeMasterStore.orderBy = 'asc'
      }
      else{
        EventTypeMasterStore.orderBy = 'asc';
        EventTypeMasterStore.orderItem = type;
      }
    }
  }
}
