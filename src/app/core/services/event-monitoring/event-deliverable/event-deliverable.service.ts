import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliverablePaginationResponse } from 'src/app/core/models/event-monitoring/events/event-deliverable';
import { Deliverable } from 'src/app/core/models/event-monitoring/events/event-deliverable';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DeliverableMasterStore } from 'src/app/stores/event-monitoring/events/event-deliverable-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventDeliverableService {

  constructor(private _http: HttpClient,

    private _utilityService: UtilityService) { }

    
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<DeliverablePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DeliverableMasterStore.currentPage}`;
      if (DeliverableMasterStore.orderBy) params += `&order_by=Deliverables.title&order=${DeliverableMasterStore.orderBy}`;
    }
    if (DeliverableMasterStore.searchText) params += (params ? '&q=' : '?q=') + DeliverableMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<DeliverablePaginationResponse>('/events/' + EventsStore.selectedEventId + '/deliverables' + (params ? params : '')).pipe(
      map((res: DeliverablePaginationResponse) => {
        DeliverableMasterStore.setDeliverable(res);
        return res;
      })
    );
  }

  
  getItemById(): Observable<Deliverable> {
    return this._http.get<Deliverable>('/events/' + EventsStore.selectedEventId + '/deliverables').pipe((
      map((res: Deliverable) => {
        DeliverableMasterStore.setIndividualDeliverable(res);
        console.log(res);
        
        return res;
      })
    ))
  }

  saveDeliverable(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/deliverables', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'event_deliverable_created_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/events/' + EventsStore.selectedEventId + '/deliverables/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'event_deliverable_updated_message');
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/events/' + EventsStore.selectedEventId + '/deliverables/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_deliverable_deleted_message');
        this.getItems().subscribe(resp => {
          if (resp.from == null) {
            DeliverableMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }

}





