import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MilestonResponse, EventsResponse, ScopeOfWorkResponse, ExpectedOutcomeResponse, DeliverableResponse, StrategicAlignmentResponse,InduvalMilestone,StakeholderPaginationResponse, ObjectiveResponse} from 'src/app/core/models/event-monitoring/events/event-monitoring-modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';


@Injectable({
  providedIn: 'root'
})
export class EventScopeService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }


  
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<EventsResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventMonitoringStore.currentPage}`;
      if (EventMonitoringStore.orderBy) params += `&order_by=${EventMonitoringStore.orderItem}&order=${EventMonitoringStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(EventMonitoringStore.searchText) params += (params ? '&q=' : '?q=')+EventMonitoringStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_monitor' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventsResponse>('/events/' + EventsStore.selectedEventId + '/scopes' + (params ? params : '')).pipe(
      map((res: EventsResponse) => {
        EventMonitoringStore.setEvents(res);
        return res;
      }) 
    );
 
  }

  generateTemplate() {
    this._http.get('/events/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('Project Template') +".xlsx");
      }
    )
  }

  exportToExcel(params:string='') {
    this._http.get('/events/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Projects') +".xlsx");
      }
    )
  }

  importToExcel(params:string='') {
    this._http.get('/events/import'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Projects') +".xlsx");
      }
    )
  }

  save(item){
    return this._http.post('/events/' + EventsStore.selectedEventId + '/scopes', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Event created successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  update(item , id){
    return this._http.put('/events/' + EventsStore.selectedEventId + '/scopes/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Event updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id){
    return this._http.delete('/events/' + EventsStore.selectedEventId + '/scopes/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Event deleted successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getItem(id){
    return this._http.get('/events/' + EventsStore.selectedEventId + '/scopes/'+id).pipe(
      map((res:any )=> {
        EventMonitoringStore.setIndividualEventDetails(res)
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getScopes(params?:string){
    return this._http.get<ScopeOfWorkResponse>('/events/'+EventsStore.selectedEventId+'/scopes' + (params? params: '')).pipe(
      map((res: ScopeOfWorkResponse) => {
        EventMonitoringStore.setScopeOfWorks(res);
        return res;
      })
    );
  }

  saveScope(item,type){
    let typeMsg = ''
    if(type == 'scope'){
      typeMsg = 'in scope'
    }else if (type =='exclusion'){
      typeMsg = 'exclusion'
    }else {
      typeMsg = 'assumption'
    }
    return this._http.post('/events/'+EventsStore.selectedEventId+'/scopes', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Event '+typeMsg+' created successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateScope(item,id,type){
    let typeMsg = ''
    if(type == 'scope'){
      typeMsg = 'in scope'
    }else if (type =='exclusion'){
      typeMsg = 'exclusion'
    }else {
      typeMsg = 'assumption'
    }
    return this._http.put('/events/'+EventsStore.selectedEventId+'/scopes/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Event '+typeMsg+' updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteScope(id,type){
    let typeMsg = ''
    if(type == 'scope'){
      typeMsg = 'in_scope'
    }else if (type =='exclusion'){
      typeMsg = 'exclusion'
    }else {
      typeMsg = 'assumption'
    }
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/scopes/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', `event_${typeMsg}_deleted`);//Event '+typeMsg+' deleted successfuly
        // this.getItems().subscribe(); event_in_scope_deleted
        return res;
      })
    );
  }

  getOutcomes(params?:string){
    return this._http.get<ScopeOfWorkResponse>('/events/'+EventsStore.selectedEventId+'/expected-outcomes' + (params? params: '')).pipe(
      map((res: ExpectedOutcomeResponse) => {
        EventMonitoringStore.setExpectedOutcomes(res['data']);
        return res;
      })
    );
  }

  saveOutcome(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/expected-outcomes', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome created successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateOutcome(item,id){
    return this._http.put('/events/'+EventsStore.selectedEventId+'/expected-outcomes/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteOutcome(id){
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/expected-outcomes/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome deleted successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getDeliverables(params?:string){
    return this._http.get<DeliverableResponse>('/events/'+EventsStore.selectedEventId+'/deliverables' + (params? params: '')).pipe(
      map((res: DeliverableResponse) => {
        EventMonitoringStore.setDeliverables(res['data']);
        return res;
      })
    );
  }

  saveDeliverable(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/deliverables', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables created successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateDeliverable(item,id){
    return this._http.put('/events/'+EventsStore.selectedEventId+'/deliverables/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteDeliverable(id){
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/deliverables/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables deleted successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  getStrategicAlignments(params?:string){
    return this._http.get<any>('/events/'+EventsStore.selectedEventId+'/strategic-alignaments' + (params? params: '')).pipe(
      map((res) => {
        EventMonitoringStore.setStrategicAlignments(res);
        return res;
      })
    );
  }

  saveStrategicAlignment(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/strategic-alignaments', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment created successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateStrategicAlignment(item,id){
    return this._http.put('/events/'+EventsStore.selectedEventId+'/strategic-alignaments/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteStrategicAlignment(id){
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/strategic-alignaments/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment deleted successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getObjectives(id,params?:string){
    return this._http.get<ObjectiveResponse>('/events/'+EventsStore.selectedEventId+'/strategic-alignaments/project-themes/'+id + (params? params: '')).pipe(
      map((res: ObjectiveResponse) => {
        EventMonitoringStore.setThemeObjectives(res['objectives']);
        return res;
      })
    );
  }

  getItemStakeholder(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StakeholderPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${StakeholderStore.currentPage}`;
			if (StakeholderStore.orderBy) params += `&order_by=stakeholder.title&order=${StakeholderStore.orderBy}`;
		}
		if (StakeholderStore.searchText) params += (params ? '&q=' : '?q=') + StakeholderStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StakeholderPaginationResponse>('/events/'+EventsStore.selectedEventId+'/stakeholders' + (params ? params : '')).pipe(
			map((res: StakeholderPaginationResponse) => {
				StakeholderStore.setStakeholder(res);
				return res;
			})
		);
	}

  getStakeholder(params?:string){
    return this._http.get<StakeholderPaginationResponse>('/events/'+EventsStore.selectedEventId+'/stakeholders' + (params? params: '')).pipe(
      map((res: StakeholderPaginationResponse) => {
        StakeholderStore.setStakeholder(res);
        return res;
      })
    );
  }

  
  saveStakeholder(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/stakeholders', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateStakeholder(item,id){
    return this._http.put('/events/'+EventsStore.selectedEventId+'/stakeholders/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteStakeholder(id){
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/stakeholders/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  sortProjects(type:string, text:string) {
    if (!EventMonitoringStore.orderBy) {
      EventMonitoringStore.orderBy = 'asc';
      EventMonitoringStore.orderItem = type;
    }
    else{
      if (EventMonitoringStore.orderItem == type) {
        if(EventMonitoringStore.orderBy == 'asc') EventMonitoringStore.orderBy = 'desc';
        else EventMonitoringStore.orderBy = 'asc'
      }
      else{
        EventMonitoringStore.orderBy = 'asc';
        EventMonitoringStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }

  sortStakeholderList(type: string, text: string) {
		if (!StakeholderStore.orderBy) {
			StakeholderStore.orderBy = 'asc';
			StakeholderStore.orderItem = type;
		}
		else {
			if (StakeholderStore.orderItem == type) {
				if (StakeholderStore.orderBy == 'asc') StakeholderStore.orderBy = 'desc';
				else StakeholderStore.orderBy = 'asc'
			}
			else {
				StakeholderStore.orderBy = 'asc';
				StakeholderStore.orderItem = type;
			}
		}
  }
}
