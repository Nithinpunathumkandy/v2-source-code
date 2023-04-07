import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventClosurePaginationResponse, indivitualEventClosure , EventClosureWorkflow , WorkflowHistoryPagination } from 'src/app/core/models/event-monitoring/event-closure';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventClosureStore } from 'src/app/stores/event-monitoring/event-closure-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { environment } from 'src/environments/environment';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventClosureService {

  constructor(
    private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService,
    
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventClosurePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventClosureStore.currentPage}`;
			if (EventClosureStore.orderBy) params += `&order_by=event_closure.title&order=${EventClosureStore.orderBy}`;
		}
		if (EventClosureStore.searchText) params += (params ? '&q=' : '?q=') + EventClosureStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<EventClosurePaginationResponse>('/events/'+EventsStore.selectedEventId+'/event-closure-checklist-details' + (params ? params : '')).pipe(
			map((res: EventClosurePaginationResponse) => {
				EventClosureStore.setEventClosure(res);
				return res;
			})
		);
	}

	getClosureItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventClosurePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventClosureStore.currentPage}`;
			if (EventClosureStore.orderBy) params += `&order_by=event_title&order=${EventClosureStore.orderBy}`;
		}
		if (EventClosureStore.searchText) params += (params ? '&q=' : '?q=') + EventClosureStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_closure' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<EventClosurePaginationResponse>('/event-closures' + (params ? params : '')).pipe(
			map((res: EventClosurePaginationResponse) => {
				EventClosureStore.setEventClosure(res);
				return res;
			})
		);
	}

	getItem(id): Observable<indivitualEventClosure> {
		return this._http.get<indivitualEventClosure>('/events/'+EventsStore.selectedEventId+'/event-closure-checklist-details/'+ id).pipe(
			map((res: indivitualEventClosure) => {
				EventClosureStore.setIndivitualEventClosure(res)
				return res;
			})
		);
	}

	saveClosure(item,type){
		return this._http.post('/events/'+EventsStore.selectedEventId+'/event-closure-checklist-details', item).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success','event_closure_checklist_saved');
			this.getItems().subscribe();
			if(type=='Add FromSubMenu')
			{
				this.getClosureItems().subscribe();
			}
			return res;
		  })
		);
	  }

	  updateClosure(id:number, item: any,type:string): Observable<any> {
		return this._http.put('/events/'+EventsStore.selectedEventId+'/event-closure-checklist-details/' + id, item).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success','event_closure_updated');
			this.getItems(false,null,true).subscribe();
			if(type=='Edit FromSubMenu')
			{
				this.getClosureItems(false,null,true).subscribe();
			}
			return res;
		  })
		);
	  }


	  deleteEventClosure(id){
		return this._http.delete('/events/'+EventsStore.selectedEventId+'/event-closure-checklist-details/' + id).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success', 'event_closure_checklist_deleted');
			this.getItems().subscribe();
			return res;
		  })
		);
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

	  getWorkflow(id): Observable<EventClosureWorkflow[]> {
		return this._http
		  .get<EventClosureWorkflow[]>('/event-closures/' + id + '/workflow')
		  .pipe(
			map((res: EventClosureWorkflow[]) => {
			  EventClosureStore.setEventClosureWorkflow(res);
			  return res;
			})
		  );
	  }


	 //Get Thumbnail Preview according to type and token
     getThumbnailPreview(type, token, h?: number, w?: number) {
		switch(type){
		  case 'event-closure-document': return environment.apiBasePath+ '/event-monitoring/files/event-closure/thumbnail?token='+token;
		  break;
		}
	  }

	  getHistory(id): Observable<WorkflowHistoryPagination> {
		let params = '';
		params = `?page=${EventClosureStore.currentWorkflowPage}`;
		return this._http.get<WorkflowHistoryPagination>('/event-closures/'+id+'/workflow-history' + (params ? params : '')).pipe(
		  map((res: WorkflowHistoryPagination) => {
			EventClosureStore.setWorkflowHistory(res);
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
		if(EventClosureStore.searchText) params += (params ? '&q=' : '?q=')+EventClosureStore.searchText;
		if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_change_request' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get(`/event-closures/export`+(params ? params : ''),{ responseType: 'blob' as 'json' } ).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_closure_checklist')+".xlsx");
		  }
		)
	  }

	  sortList(type:string, text:string) {
		if (!EventClosureStore.orderBy) {
			EventClosureStore.orderBy = 'desc';
			EventClosureStore.orderItem = type;
		}
		else{
		  if (EventClosureStore.orderItem == type) {
			if(EventClosureStore.orderBy == 'desc') EventClosureStore.orderBy = 'asc';
			else EventClosureStore.orderBy = 'desc'
		  }
		  else{
			EventClosureStore.orderBy = 'desc';
			EventClosureStore.orderItem = type;
		  }
		}
	  }
}
