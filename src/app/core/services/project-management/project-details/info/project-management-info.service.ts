import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { projectDetailStore } from 'src/app/stores/project-management/project-details/project-details.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementInfoService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  
  getSubProjectDetails(id){
    return this._http.get('/projects/' + id).pipe(
      map((res:any)=>{
        projectDetailStore.setSubProjectDetails(res);
        return res;
      })
    )
  }
  

  saveProjectInfo(item) {
    return this._http.post(`/projects/${ProjectsStore.selectedProjectID}/activities`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','project_activity_added');
        if(this._helperService.checkMasterUrl()) 
        this.getSubProjectDetails(true);
        return res;
      })
    );
  }

  updateProjectInfo(id , item) {
    return this._http.put(`/projects/${ProjectsStore.selectedProjectID}/activities/${id}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','project_activity_updated'); 
        if(this._helperService.checkMasterUrl()) 
        this.getSubProjectDetails(true);
        return res;
      })
    );
  }

  deleteProjectInfo(id){
    return this._http.delete(`/projects/${ProjectsStore.selectedProjectID}/activities/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','project_acvtivity_deleted');
        return res;
      })
    );
  }


}
