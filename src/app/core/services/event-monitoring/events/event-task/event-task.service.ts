import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from '../../../../../stores/event-monitoring/events/event.store';
import { EventTaskStore } from 'src/app/stores/event-monitoring/events/event-task.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { EventTaskPaginationResponse, EventTaskDetails, HistoryPaginationData, HistoryData } from 'src/app/core/models/event-monitoring/events/event-task';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { environment } from 'src/environments/environment';
import { TaskHistoryStore } from 'src/app/stores/event-monitoring/events/event-task-history-store';

@Injectable({
  providedIn: 'root'
})
export class EventTaskService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(additionalParams?: string, is_all: boolean = false): Observable<EventTaskPaginationResponse> {
    let params = '';
    params = `?page=${EventTaskStore.currentPage}`;
    if (EventTaskStore.orderBy)
      params += `&order_by=${EventTaskStore.orderItem}&order=${EventTaskStore.orderBy}`;
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventTaskStore.searchText) params += (params ? '&q=' : '?q=') + EventTaskStore.searchText;
    return this._http.get<EventTaskPaginationResponse>(`/events/${EventsStore.selectedEventId}/tasks` + (params ? params : '')).pipe(
      map((res) => {
        EventTaskStore.setEventTaskList(res);
        return res;
      })
    );
  }

  getItemsTaskList(additionalParams?: string, is_all: boolean = false): Observable<EventTaskPaginationResponse> {
    let params = '';
    params = `?page=${EventTaskStore.currentPage}`;
    if (EventTaskStore.orderBy)
      params += `&order_by=${EventTaskStore.orderItem}&order=${EventTaskStore.orderBy}`;
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventTaskStore.searchText) params += (params ? '&q=' : '?q=') + EventTaskStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_tasks' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventTaskPaginationResponse>(`/event-tasks` + (params ? params : '')).pipe(
      map((res) => {
        EventTaskStore.setEventTaskList(res);
        return res;
      })
    );
  }

  getTaskDetails(id) {
    return this._http.get<EventTaskDetails>(`/events/${EventsStore.selectedEventId}/tasks/${id}`).pipe((
      map((res: EventTaskDetails) => {
        EventTaskStore.setIndividualEventTaskDetails(res);
        return res;
      })
    ))
  }

  saveItem(item,type?,id?,task_phase?) {
    return this._http.post(`/events/${id}/tasks`, item).pipe(
      map((res: any) => {        
        //if (this._helperService.checkMasterUrl()) this.getItems(`&task_phase_id=${item.task_phase_id}`).subscribe();
        if(type =='Add' || type =='Edit' ){
          this._utilityService.showSuccessMessage('success', `event_task_${task_phase}_created`);
          this.getItems(`&task_phase_id=${item.task_phase_id}`).subscribe();
        }
        else{
          this.getItemsTaskList().subscribe();
          this._utilityService.showSuccessMessage('success', 'event_task_added');
        }
        return res;
      })
    );
  }

  updateItem(id, item , type? , task_phase?): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/tasks/${id}`, item).pipe(
      map(res => {        
        // this.getItems(`&task_phase_id=${item.task_phase_id}`).subscribe();
         if(type =='Add' || type =='Edit'){
          this._utilityService.showSuccessMessage('success', `event_task_${task_phase}_updated`);
          this.getItems(`&task_phase_id=${item.task_phase_id}`).subscribe();
        }
        else{
          this._utilityService.showSuccessMessage('success', 'event_task_updated');
          this.getItemsTaskList().subscribe();
        }
        return res;
      })
    );
  }

  delete(id: number,task_phase?) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/tasks/${id}`).pipe(
      map(res => {
        if(task_phase){
          this._utilityService.showSuccessMessage('success', `event_task_${task_phase}_deleted`);
        }else{
          this._utilityService.showSuccessMessage('success', 'event_task_deleted');
        }        
        return res;
      })
    );
  }

  deleteTaskListing(id: number) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/tasks/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_task_deleted');
        this.getItemsTaskList().subscribe();
        return res;
      })
    );
  }

  updateTaskPercentage(id:number,data): Observable<any> { //api/v1/events/5/tasks/7/percentage-completion
    return this._http.put(`/events/${EventsStore.selectedEventId}/tasks/${id}/percentage-completion`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('successfully', 'task_percentage_updated_successfully');                
        return res;
      })
    );
  }

  exportToExcel() {
		let params=''
		if(EventTaskStore.searchText) params += (params ? '&q=' : '?q=')+EventTaskStore.searchText;
		if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_tasks' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get(`/event-tasks/export`+(params ? params : ''),{ responseType: 'blob' as 'json' } ).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_task')+".xlsx");
		  }
		)
	  }

    getHistory(id: number): Observable<HistoryData[]> {
      let params = '';
      params = (params == '') ? params + `?page=${TaskHistoryStore.currentPage}` : params + `&page=${TaskHistoryStore.currentPage}`;
      params = params + '&order_by=created_at&order=desc&limit=5';
      return this._http.get<HistoryData[]>(`/events/${EventsStore.selectedEventId}/tasks/${id}/updates` + (params ? params : '')).pipe(
        map((res: HistoryData[]) => {
          TaskHistoryStore.setHistory(res);
          return res;
        })
      );
    }
  
  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch (type) {
      case 'event-task': return environment.apiBasePath + '/event-monitoring/files/event-tasks/thumbnail?token=' + token;
        break;
    }
  }

  sortList(type:string, text:string) {
		if (!EventTaskStore.orderBy) {
			EventTaskStore.orderBy = 'asc';
			EventTaskStore.orderItem = type;
		}
		else{
		  if (EventTaskStore.orderItem == type) {
			if(EventTaskStore.orderBy == 'asc') EventTaskStore.orderBy = 'desc';
			else EventTaskStore.orderBy = 'asc'
		  }
		  else{
        EventTaskStore.orderBy = 'asc';
        EventTaskStore.orderItem = type;
		  }
		}
	  }
}
