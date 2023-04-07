import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExternalUsers, IndividualExternalUsers } from 'src/app/core/models/project-management/project-details/project-team/external-users';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ExternalUsersStore } from 'src/app/stores/project-monitoring/external-users-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';

@Injectable({
  providedIn: 'root'
})
export class ExternalUsersService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

   /**
   * @description
   * This method is used for getting project members details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectTeamService
   */
    getItems() : Observable<ExternalUsers>{
      return this._http.get<ExternalUsers>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/project-external-users`).pipe(
        map((res: ExternalUsers) => {
          ExternalUsersStore.setExternalUsers(res['data'])
          return res;
        })
      );
    }  

   /**
   * @description
   * This method is used for getting individual external user details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ExternalUsersService
   */
    getItem(projectId: number,documentId: number) : Observable<IndividualExternalUsers>{
      return this._http.get<IndividualExternalUsers>(`/project-monitor/projects/${projectId}/external-users/${documentId}`).pipe(
        map((res: IndividualExternalUsers) => {
          ExternalUsersStore.setIndividualExternalUsers(res)
          return res;
        })
      );
    }  

   /**
   * @description
   * this method is used for creating external user
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExternalUsersService
   */  
  saveExternalUser(projectId: number,item: any){
    return this._http.post(`/project-monitor/projects/${projectId}/add-external-users`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','external_users_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating external user
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExternalUsersService
   */  
  updateExternalUser(projectId: number, documentId: number, item: any): Observable<any> {
    return this._http.put(`/project-monitor/projects/${projectId}/external-users/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'external_users_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting external user
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ExternalUsersService
   */  
  deleteExternalUser(projectId: number, documentId: number){
    return this._http.delete(`/project-monitor/projects/${projectId}/external-users/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'external_users_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

}


