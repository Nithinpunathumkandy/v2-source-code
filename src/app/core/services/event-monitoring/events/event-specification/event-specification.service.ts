import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventsPaginationResponse, EventDetails } from 'src/app/core/models/event-monitoring/events/events';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventsSpecificationStore } from 'src/app/stores/event-monitoring/specification-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { SpecificationDetails } from 'src/app/core/models/event-monitoring/events/events-specification';

@Injectable({
  providedIn: 'root'
})
export class EventSpecificationService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }
  
  getItems(additionalParams?:string,is_all:boolean = false): Observable<EventsPaginationResponse> {
    let params = '';
    params = `?page=${EventsSpecificationStore.currentPage}`;
    if (EventsSpecificationStore.orderBy)
        params += `&order_by=${EventsSpecificationStore.orderItem}&order=${EventsSpecificationStore.orderBy}`;
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventsSpecificationStore.searchText) params += (params ? '&q=' : '?q=')+EventsSpecificationStore.searchText;
    return this._http
      .get<EventsPaginationResponse>(`/events/${EventsStore.selectedEventId}/specifications`+(params ? params : ''))
      .pipe(
        map((res) => {
          EventsSpecificationStore.setSpecificationList(res);
          return res;
        })
      );
  }

  getItem(id) : Observable<SpecificationDetails[]>{
    return this._http.get<SpecificationDetails[]>(`/events/${EventsStore.selectedEventId}/specifications/` +id).pipe(
      map((res: SpecificationDetails[]) => {
        EventsSpecificationStore.setSpecificationDetails(res)
        return res;
      })
    );
  }

  updateItem(item, id): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/specifications/` + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_specification_updated');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/specifications`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','events_specification_added');
        if(this._helperService.checkMasterUrl()) this.getItems(null,true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/events/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_specification_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/events/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_specification')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/events/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_specification_activated');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/events/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_specification_deactivated');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/events/' + EventsStore.selectedEventId + '/specifications/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_specification_deleted');
        this.getItems(null,true).subscribe(resp=>{
          if(resp.from==null){
            EventsStore.setCurrentPage(resp.current_page-1);
            this.getItems(null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sorteventsList(type:string) {
    if (!EventsStore.orderBy) {
      EventsStore.orderBy = 'asc';
      EventsStore.orderItem = type;
    }
    else{
      if (EventsStore.orderItem == type) {
        if(EventsStore.orderBy == 'asc') EventsStore.orderBy = 'desc';
        else EventsStore.orderBy = 'asc'
      }
      else{
        EventsStore.orderBy = 'asc';
        EventsStore.orderItem = type;
      }
    }
  }
  
}
