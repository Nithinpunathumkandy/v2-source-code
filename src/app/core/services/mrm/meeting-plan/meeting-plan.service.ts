import { Injectable } from '@angular/core';
import {MeetingPlanPaginationResponse,IndividualMeetingPlan} from 'src/app/core/models/mrm/meeting-plan/meeting-plan';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActionPlan } from 'src/app/core/models/mrm/dashboard/mrm-dashboard';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class MeetingPlanService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<MeetingPlanPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingPlanStore.currentPage}&status=all`;
        if (MeetingPlanStore.orderBy) params += `&order_by=${MeetingPlanStore.orderItem}&order=${MeetingPlanStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(MeetingPlanStore.searchText) params += (params ? '&q=' : '?q=')+MeetingPlanStore.searchText;
      console.log(RightSidebarLayoutStore.filterPageTag);
      console.log(RightSidebarLayoutStore.filtersAsQueryString);
      if(RightSidebarLayoutStore.filterPageTag == 'meeting_plan' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<MeetingPlanPaginationResponse>('/meeting-plans' + (params ? params : '')).pipe(
        map((res: MeetingPlanPaginationResponse) => {
          MeetingPlanStore.setMeetingPlan(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<IndividualMeetingPlan> {
      return this._http.get<IndividualMeetingPlan>('/meeting-plans/' + id).pipe(
        map((res: IndividualMeetingPlan) => {
          MeetingPlanStore.setIndividualMeetingPlanDetails(res);
          MeetingPlanStore.updateMeetingPlan(res)
          return res;
        })
      );
    }

    saveItem(data): Observable<any> {
      return this._http.post('/meeting-plans', data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_is_added');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(meetingPlan_id:number, data: IndividualMeetingPlan): Observable<any> {
      return this._http.put('/meeting-plans/'+ meetingPlan_id, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_has_been_updated');
          
          this.getItems().subscribe();
  
          return res;
        })
      );
    }

    savePlanInfo(data): Observable<any> {
      return this._http.post('/meeting-plans', data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_is_added');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    updatePlanInfo(meetingPlan_id:number, data): Observable<any> {
      return this._http.put('/meeting-plans/'+ meetingPlan_id, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_has_been_updated');
          
          // this.getItems().subscribe();
  
          return res;
        })
      );
    }

    saveParticipents(data): Observable<any> {
      return this._http.put('/meeting-plans/participants/'+MeetingPlanStore.selecetdMeetingPlanId, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_participants_added');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    saveMappings(data): Observable<any> {
      return this._http.put('/meeting-plans/mappings/'+MeetingPlanStore.selecetdMeetingPlanId, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_mappings_added');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    saveAgendas(data): Observable<any> {
      return this._http.put('/meeting-plans/agendas/'+MeetingPlanStore.selecetdMeetingPlanId, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_agendas_added');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/meeting-plans/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_has_been_deleted');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              MeetingPlanStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/meeting-plans/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_activated');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-plans/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_deactivated');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    
    generateTemplate() {
      this._http.get('/meeting-plans/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_plan_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (MeetingPlanStore.orderBy) params += `?order=${MeetingPlanStore.orderBy}`;
      if (MeetingPlanStore.orderItem) params += `&order_by=${MeetingPlanStore.orderItem}`;
      // if (MeetingPlanStore.searchText) params += `&q=${MeetingPlanStore.searchText}`;
      if(RightSidebarLayoutStore.filterPageTag == 'meeting_plan' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/meeting-plans/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_plan')+".xlsx");
        }
      )
    }

    saveMeetingPlanId(id:number){
      MeetingPlanStore.setMeetingPlanId(id);
    }

    setDocumentDetails(imageDetails,url){
      MeetingPlanStore.setDocumentDetails(imageDetails,url);
    }
   

    selectRequiredRisk(issues){
   
      MeetingPlanStore.addSelectedRisk(issues);
    }
  
    

    sortMeetingPlanList(type:string, text:string) {
      if (!MeetingPlanStore.orderBy) {
        MeetingPlanStore.orderBy = 'desc';
        MeetingPlanStore.orderItem = type;
      }
      else{
        if (MeetingPlanStore.orderItem == type) {
          if(MeetingPlanStore.orderBy == 'desc') MeetingPlanStore.orderBy = 'asc';
          else MeetingPlanStore.orderBy = 'desc'
        }
        else{
          MeetingPlanStore.orderBy = 'desc';
          MeetingPlanStore.orderItem = type;
        }
      }
    }

    savePartcipation(data,id): Observable<any> {
      return this._http.put('/meeting-plans/'+id+'/participants', data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_participants_added');
          this.getItem(MeetingPlanStore?.meetingPlanId).subscribe();
          return res;
        })
      );
    }

    deletePartcipation(meetingPlanId,userId): Observable<any> {
      return this._http.delete('/meeting-plans/'+meetingPlanId+'/participants/'+userId).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_participants_deleted');
          
          return res;
        })
      );
    }

    publishMeetingPlan(meetingPlanId): Observable<any> {
      return this._http.put('/meeting-plans/'+meetingPlanId+'/publish',meetingPlanId).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_published');
          SubMenuItemStore.cancelClicked  = false;
          return res;
        })
      );
    }

    meetingPlanresponse(meetingPlanId,type): Observable<any> {
      return this._http.put(`/meeting-plans/${meetingPlanId}/response?${type}=1`,type).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'response_successfully');
          SubMenuItemStore.cancelClicked = false;
          return res;
        })
      );
    }

    meetingPlanCancel(meetingPlanId,data): Observable<any> {
      return this._http.put(`/meeting-plans/${meetingPlanId}/cancel`,data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_cancel_successfully');
          SubMenuItemStore.cancelClicked  = false;
          return res;
        })
      );
    }

    meetingPlanDateUpdate(meetingPlanId,data): Observable<any> {
      return this._http.put(`/meeting-plans/${meetingPlanId}/change-time`,data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'meeting_plan_has_been_updated');
          this.getItem(meetingPlanId).subscribe();
          return res;
        })
      );
    }

    getActionPlanCount(actionPlanId): Observable<ActionPlan> {
      let params = '';
      if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ActionPlan>('/meeting-action-plans/'+actionPlanId +'/status-counts'+(params?params:'')).pipe((
        map((res:ActionPlan)=>{
          console.log(res)
          // MeetingPlanStore.setActionPlan(res);
          return res;
        })
      ))
    }

}
