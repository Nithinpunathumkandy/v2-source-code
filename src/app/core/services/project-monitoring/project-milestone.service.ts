import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MilestonResponse, ProjectsResponse, ScopeOfWorkResponse, ExpectedOutcomeResponse, DeliverableResponse, StrategicAlignmentResponse,InduvalMilestone,StakeholderPaginationResponse, ObjectiveResponse, MilestonHistoryResponse, MilestoneHistory} from 'src/app/core/models/project-monitoring/project-monitoring.modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';
import { HelperServiceService } from '../general/helper-service/helper-service.service';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';

@Injectable({
  providedIn: 'root'
})
export class ProjectMilestoneService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getMilestons(params?:string){
      return this._http.get<MilestonHistoryResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones' + (params? params: '')).pipe(
        map((res: MilestonHistoryResponse) => {
          ProjectMilestoneStore.setMilestones(res['data']);
          return res;
        })
      );
    }

    getMilestonsHistory(){
      return this._http.get<MilestoneHistory>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestone-progress-history' ).pipe(
        map((res: MilestoneHistory) => {
          ProjectMilestoneStore.setMileStoneHistory(res['data']);
          return res;
        })
      );
    }
  
    getInduvalMilestons(id){
      return this._http.get<InduvalMilestone>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id).pipe(
        map((res: InduvalMilestone) => {
          // ProjectMonitoringStore.setMilestones(res['data']);
          return res;
        })
      );
    }
  
    saveMileston(item){
      return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Milestone updated successfuly');
          // this.getItems().subscribe();
          return res;
        })
      );
    }
  
  
    updateMileston(item,id){
      return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Milestone updated successfuly');
          // this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deleteMileston(id){
      return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Milestone deleted successfuly');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    // milestone progress
    getMilestonProgress(id,params?:string){
      return this._http.get<MilestonResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones' + id + (params? params: '')).pipe(
        map((res: MilestonResponse) => {
          ProjectMilestoneStore.setMilestones(res['data']);
          return res;
        })
      );
    }
    saveMilestonProgress(item,id){
      return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/' + id,item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Milestone Progress updated successfuly');
          // this.getItems().subscribe();
          return res;
        })
      );
    }
    // updateMilestonProgress(item,id){
    //   return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id, item).pipe(
    //     map((res:any )=> {
    //       this._utilityService.showSuccessMessage('Success!', 'Milestone Progress updated successfuly');
    //       // this.getItems().subscribe();
    //       return res;
    //     })
    //   );
    // }
    deleteMilestonProgress(id){
      return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Milestone Progress deleted successfuly');
          // this.getItems().subscribe();
          return res;
        })
      );
    }
}
