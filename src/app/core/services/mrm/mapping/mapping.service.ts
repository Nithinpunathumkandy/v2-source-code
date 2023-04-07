import { Injectable } from '@angular/core';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { Mapping } from 'src/app/core/models/mrm/meeting-plan/mapping';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService) { }
    
  getItems(getAll: boolean = false, additionalParams?: string): Observable<Mapping> {
    let params = '';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(MeetingPlanStore.searchText) params += (params ? '&q=' : '?q=')+MappingStore.searchText;
    return this._http.get<Mapping>('/meeting-plans/'+ MeetingPlanStore.meetingPlanId +'/mapping').pipe(
      map((res: Mapping) => {
        MappingStore.setMappingDetails(res);
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any>{
    
    return this._http.post('/meeting-plans/'+ MeetingPlanStore.meetingPlanId +'/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProcessForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/process-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveRiskForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/risk-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveControlsForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/control-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProjectsForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/project-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProductsForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/product-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveCustomersForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/customer-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveObjectiveForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/strategic-objective-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveFindingsForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/findings-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveNonConfomityFindingsForMapping(saveData): Observable<any>{
    return this._http.post('/meeting-plans/'+MeetingPlanStore.meetingPlanId +'/non-conformity-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/meeting-plans/' + MeetingPlanStore.meetingPlanId +'/issue-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'issue_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/process-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'process_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteRiskMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/risk-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteControlMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/control-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'control_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/project-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/product-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'product_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteCustomertMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/customer-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteObjectivetMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/strategic-objective-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_objective_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteFindingsMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/findings-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'audit_finding_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteNonConformityFindingsMapping(id) {
    return this._http.put('/meeting-plans/' +MeetingPlanStore.meetingPlanId +'/non-conformity-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'non_conformity_deleted_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

}
