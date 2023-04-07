import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MilestonResponse, InduvalMilestone,Milestone, MilestonHistoryResponse, MilestoneHistory, IndivitualMilestones} from 'src/app/core/models/event-monitoring/events/event-monitoring-modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { map } from 'rxjs/operators';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

@Injectable({
  providedIn: 'root'
})
export class EventMilestoneService {
z
  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MilestonResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${EventMilestoneStore.currentPage}`;
        if (EventMilestoneStore.orderBy) params += `&order_by=${EventMilestoneStore.orderItem}&order=${EventMilestoneStore.orderBy}`;
      }
      if (EventMilestoneStore.searchText) params += (params ? '&q=' : '?q=') + EventMilestoneStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<MilestonResponse>('/events/'+EventsStore.selectedEventId+'/milestones' + (params ? params : '')).pipe(
        map((res: MilestonResponse) => {
          EventMilestoneStore.setmilestone(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<Milestone[]> {
      return this._http.get<Milestone[]>(`/events/${EventsStore.selectedEventId}/milestones?is_all=true`).pipe((
        map((res:Milestone[])=>{
          EventMilestoneStore.setMilestones(res);
          return res;
        })
      ))
    }
  
    getMilestones(params?:string){
      return this._http.get<MilestonResponse>('/events/'+EventsStore.selectedEventId+'+/milestones/' + (params? params: '')).pipe(
        map((res: MilestonResponse) => {
          EventMilestoneStore.setmilestone(res);
          return res;
        })
      );
    }

    getMilestonsHistory(){
      return this._http.get<MilestoneHistory>('/events/'+EventsStore.selectedEventId+'/milestone-progress-history' ).pipe(
        map((res: MilestoneHistory) => {
          EventMilestoneStore.setMileStoneHistory(res['data']);
          return res;
        })
      );
    }

    getInduvalMilestons(id){
      return this._http.get<InduvalMilestone>('/events/'+EventsStore.selectedEventId+'/milestones/'+id).pipe(
        map((res: InduvalMilestone) => {
          // EventMonitoringStore.setmilestone(res['data']);
          return res;
        })
      );
    }
  
    saveMileston(item){
      return this._http.post('/events/'+EventsStore.selectedEventId+'/milestones', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'event_milestone_created_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
  
    updateMileston(item,id){
      return this._http.put('/events/'+EventsStore.selectedEventId+'/milestones/'+id, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'event_milestone_updated_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deleteMileston(id){
      return this._http.delete('/events/'+EventsStore.selectedEventId+'/milestones/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'event_milestone_deleted_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    // milestone progress
    getMilestonProgress(id,params?:string){
      return this._http.get<MilestonResponse>('/events/'+EventsStore.selectedEventId+'/milestones' + id + (params? params: '')).pipe(
        map((res: MilestonResponse) => {
          EventMilestoneStore.setmilestone(res);
          return res;
        })
      );
    }

    saveMilestonProgress(item){
      return this._http.post('/events/'+EventsStore.selectedEventId+'/milestones' , item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'milestone_progress_created_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }


    deleteMilestonProgress(id){
      return this._http.delete('/events/'+EventsStore.selectedEventId+'/milestones/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'milestone_progress_deleted_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }
}
