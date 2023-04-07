import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectAssistantManagers, ProjectManagers, ProjectMembers } from 'src/app/core/models/project-management/project-details/project-team/project-team';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';

@Injectable({
  providedIn: 'root'
})
export class ProjectTeamService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }


   /**
   * @description
   * This method is used for getting  project managers details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectTeamService
   */
    getProjectManagers(projectId: number) : Observable<ProjectManagers>{
      return this._http.get<ProjectManagers>(`/project-monitor/projects/${projectId}/project-managers`).pipe(
        map((res: ProjectManagers) => {
          ProjectTeamStore.setProjectManagers(res)
          return res;
        })
      );
    } 
    
       /**
   * @description
   * This method is used for getting  project assistant members details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectTeamService
   */
        getProjectAssistantManagers(projectId: number) : Observable<ProjectAssistantManagers>{
          return this._http.get<ProjectAssistantManagers>(`/project-monitor/projects/${projectId}/project-assistant-managers`).pipe(
            map((res: ProjectAssistantManagers) => {
              ProjectTeamStore.setProjectAssistantManagers(res)
              return res;
            })
          );
        }  

   /**
   * @description
   * This method is used for getting project members details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectTeamService
   */
    getProjectMembers(projectId: number) : Observable<ProjectMembers>{
      return this._http.get<ProjectMembers>(`/project-monitor/projects/${projectId}/project-members`).pipe(
        map((res: ProjectMembers) => {
          ProjectTeamStore.setProjectMembers(res)
          return res;
        })
      );
    }  
        

   /**
   * @description
   * this method is used for creating project teams
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectTeamService
   */  
  saveProjectTeam(projectId: number,item: any,type){
    let message 
    if(type == 'Edit'){
      message = 'project team updated successfully'
    }else {
      message = 'project_team_saved'
    }
    return this._http.post(`/project-monitor/projects/${projectId}/project-users`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success',message);
        this.getProjectManagers(projectId).subscribe();
        this.getProjectMembers(projectId).subscribe();
        this.getProjectAssistantManagers(projectId).subscribe();
        return res;
      })
    );
  }



}


