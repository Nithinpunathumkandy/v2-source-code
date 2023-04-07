import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventWorkflowDetail, EventWorkflowDetails, EventWorkflowHistoryPaginationResponse, EventWorkflowPaginationResponse, ModuleGroupsResponse } from 'src/app/core/models/event-monitoring/event-workflow/event-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/event-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_role_has_been_added');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/event-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_team_has_been_added');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/event-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_head_of_unit_has_been_added');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }


  saveDesignationAdd(item: any,id) {
    return this._http.post('/event-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_designation_has_been_added');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/event-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_user_has_been_added');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/event-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow_section_event');
        this.getItem(EventWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getAllItems(params:string): Observable<any[]>{
    if(EventWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+EventWorkflowStore.searchText;
    return this._http.get<any[]>('/event-workflows'+ (params ? params : '')).pipe(
      map((res: any[]) => {
        EventWorkflowStore.setAllEventTemplate(res["data"]);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<EventWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventWorkflowStore.currentPage}&status=all`;
      if (EventWorkflowStore.orderBy) params += `&order_by=${EventWorkflowStore.orderItem}&order=${EventWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(EventWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+EventWorkflowStore.searchText;
    return this._http.get<EventWorkflowPaginationResponse>('/event-workflows' + (params ? params : '')).pipe(
      map((res: EventWorkflowPaginationResponse) => {
        EventWorkflowStore.setEventWorkflow(res);
        return res;
      })
    );
  }

  getItem(id): Observable<EventWorkflowDetails> {
    return this._http.get<EventWorkflowDetails>('/event-workflows/'+id).pipe((
      map((res:EventWorkflowDetails)=>{
        EventWorkflowStore.setIndividualEventTemplate(res);
        return res;
      })
    ))
  }

  delete(id: number) {
    return this._http.delete('/event-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_work_flow_deleted_main');
        this.getAllItems('?module_group_ids=4000').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/event-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        this.getAllItems('?module_group_ids=4000').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        this.getAllItems('?module_group_ids=4000').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/event-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_workflow_template')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-workflows/export?module_group_ids=4000', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_workflows')+".xlsx");     

      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/event-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'event_workflow_add');
        this.getAllItems('?module_group_ids=4000').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/event-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'event_workflow_update');
      this.getAllItems('?module_group_ids=4000').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        EventWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }

  getWorkflow(id): Observable<EventWorkflowDetail> {
    return this._http.get<EventWorkflowDetail>('/events/'+id+'/workflow').pipe((
      map((res:EventWorkflowDetail)=>{
        EventWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<EventWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${EventWorkflowStore.currentPage}`;
    return this._http.get<EventWorkflowHistoryPaginationResponse>('/events/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: EventWorkflowHistoryPaginationResponse) => {
        EventWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitEvent(id,item?) {
    return this._http.put('/events/' + id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_submitted_successfully');
        
        return res;
      })
    );
  }

  approveEvent(id,comment) {
    return this._http.put('/events/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_approved_successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertEvent(id,data) {
    return this._http.put('/events/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_reverted_successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectEvent(id,data) {
    return this._http.put('/events/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_rejected_successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
