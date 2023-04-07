import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventClosurePaginationResponse, indivitualEventClosure , EventClosureWorkflow , WorkflowHistoryPagination  } from 'src/app/core/models/event-monitoring/event-closure';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class EventClosureEventDetailsService {
  EventClosureMainStore=EventClosureMainStore;
  EventsStore=EventsStore;
  constructor(
    private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService,
    
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventClosurePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventClosureMainStore.currentPage}`;
			if (EventClosureMainStore.orderBy) params += `&order_by=event_closure.title&order=${EventClosureMainStore.orderBy}`;
		}
		if (EventClosureMainStore.searchText) params += (params ? '&q=' : '?q=') + EventClosureMainStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<EventClosurePaginationResponse>('/events/'+EventsStore.selectedEventId+'/event-closures' + (params ? params : '')).pipe(
			map((res: EventClosurePaginationResponse) => {
				EventClosureMainStore.setEventClosure(res);
				return res;
			})
		);
	}

	getClosureItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventClosurePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventClosureMainStore.currentPage}`;
			if (EventClosureMainStore.orderBy) params += `&order_by=event_title&order=${EventClosureMainStore.orderBy}`;
		}
		if (EventClosureMainStore.searchText) params += (params ? '&q=' : '?q=') + EventClosureMainStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_closure' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<EventClosurePaginationResponse>('/event-closures' + (params ? params : '')).pipe(
			map((res: EventClosurePaginationResponse) => {
				EventClosureMainStore.setEventClosure(res);
				return res;
			})
		);
	}

  getItem(id): Observable<indivitualEventClosure> {
		return this._http.get<indivitualEventClosure>('/events/'+EventsStore.selectedEventId+'/event-closures/'+ id).pipe(
			map((res: indivitualEventClosure) => {
				EventClosureMainStore.setIndivitualEventClosure(res)
				return res;
			})
		);
	}

	saveClosure(item,type){
		return this._http.post('/events/'+EventsStore.selectedEventId+'/event-closures', item).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success','event_closure_saved');
			this.getItems().subscribe();
		
			return res;
		  })
		);
	  }

	  updateClosure(id:number, item: any,type:string): Observable<any> {
		return this._http.put('/events/'+EventsStore.selectedEventId+'/event-closures/' + id, item).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success','event_closure_updated');
			this.getItems(false,null,true).subscribe();
			this.getItem(id).subscribe();
			return res;
		  })
		);
	  }


	  deleteEventClosure(id){
		return this._http.delete('/events/'+EventsStore.selectedEventId+'/event-closures/' + id).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success', 'event_closure_deleted');
			this.getItems().subscribe();
			return res;
		  })
		);
	  }

	  getWorkflow(id): Observable<EventClosureWorkflow[]> {
		return this._http
		  .get<EventClosureWorkflow[]>('/event-closures/' + id + '/workflow')
		  .pipe(
			map((res: EventClosureWorkflow[]) => {
				EventClosureMainStore.setEventClosureWorkflow(res);
			  return res;
			})
		  );
	  }

	  getHistory(id): Observable<WorkflowHistoryPagination> {
		let params = '';
		params = `?page=${EventClosureMainStore.currentWorkflowPage}`;
		return this._http.get<WorkflowHistoryPagination>('/event-closures/'+id+'/workflow-history' + (params ? params : '')).pipe(
		  map((res: WorkflowHistoryPagination) => {
			EventClosureMainStore.setWorkflowHistory(res);
			return res;
		  })
		);
	  }
	
	  submitClosures(id,item?) {
		return this._http.put('/event-closures/' + id+'/submit',id,item).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'event_closure_submitted_successfully');			
			return res;
		  })
		);
	  }
	
	  approveClosures(id,comment?) {
		return this._http.put('/event-closures/' + id+'/approve',comment).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'events_closure_approved_successfuly');
			this.getItems(id).subscribe();
			return res;
		  })
		);
	  }
	
	  revertClosures(id,data) {
		return this._http.put('/event-closures/' + id+'/revert',data).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'events_closure_reverted_successfuly');
			this.getItems(id).subscribe();
			return res;
		  })
		);
	  }
	  
	  rejectClosures(id,data) {
		return this._http.put('/event-closures/' + id+'/reject',data).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'event_closure_rejected_successfuly');
			this.getItems(id).subscribe();
			return res;
		  })
		);
	  }

	  exportToExcel() {
		let params=''
		if(EventClosureMainStore.searchText) params += (params ? '&q=' : '?q=')+EventClosureMainStore.searchText;
		if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_change_request' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get(`/event-closures/export`+(params ? params : ''),{ responseType: 'blob' as 'json' } ).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_closure')+".xlsx");
		  }
		)
	  }

	  deleteEventClosureListing(id){
		return this._http.delete('/events/'+EventsStore.selectedEventId+'/event-closures/' + id).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success', 'event_closure_deleted');
			//this.getItems().subscribe();
			return res;
		  })
		);
	  }

	  sortList(type:string, text:string) {
		if (!EventClosureMainStore.orderBy) {
			EventClosureMainStore.orderBy = 'desc';
			EventClosureMainStore.orderItem = type;
		}
		else{
		  if (EventClosureMainStore.orderItem == type) {
			if(EventClosureMainStore.orderBy == 'desc') EventClosureMainStore.orderBy = 'asc';
			else EventClosureMainStore.orderBy = 'desc'
		  }
		  else{
			EventClosureMainStore.orderBy = 'desc';
			EventClosureMainStore.orderItem = type;
		  }
		}
	  }

}
