import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { OrganizationOverview, OrganizationOverviewPaginationResponse } from 'src/app/core/models/organization/organization-overview/organization-overview';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { environment } from 'src/environments/environment';
// import { EventStakeholderStore } from 'src/app/stores/event-monitoring/events/event-stakeholder-store';
// import { StakeholderDetails , OrganizationOverviewPaginationResponse } from 'src/app/core/models/event-monitoring/events/event-stakeholder';

@Injectable({
  providedIn: 'root'
})
export class OrganizationOverviewService  {
  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(params?:string): Observable<OrganizationOverview[]> {

    return this._http.get<OrganizationOverview[]>(`/user-guides` + (params ? params : '')).pipe(
      map((res) => {
        OrganizationOverviewStore.setOverview(res);
        return res;
        
      })
    );
    
  }

  // Get Request - Get Branch Details by Id
  getInfoById(id):Observable<OrganizationOverview>{
    return this._http.get('/user-guides/' + id).pipe(
      map((res:OrganizationOverview) => {
        // res.view_more = false;
        OrganizationOverviewStore.setSelectedInfoDetails(res);
        return res;
      })
    );
  }

  getOverviewDetails(params: string) {
    return this._http.get<OrganizationOverview>(`/user-guides${params}`).pipe((
      map((res: OrganizationOverview) => {
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post(`/user-guides`, item).pipe(
      map((res: any) => {  
        this._utilityService.showSuccessMessage('success', 'create_success');    
        return res;
      })
    );
  }

  updateItem(id:number,item) {
    return this._http.put(`/user-guides/` + id, item).pipe(
      map((res: any) => {  
        this._utilityService.showSuccessMessage('success', 'update_success');    
        return res;
      })
    );
  }

  // updateItem(id, item): Observable<any> {
  //   return this._http.put(`/events/${EventsStore.selectedEventId}/stakeholders/${id}`, item).pipe(
  //     map(res => {
  //       this._utilityService.showSuccessMessage('success', 'event_stakeholder_updated');
  //       this.getItems(null,true).subscribe();
  //       return res;
  //     })
  //   );
  // }

  // delete(id: number) {
  //   return this._http.delete(`/events/${EventsStore.selectedEventId}/stakeholders/${id}`).pipe(
  //     map(res => {
  //       this._utilityService.showSuccessMessage('success', 'event_stakeholder_deleted');
  //       this.getItems(null,true).subscribe();
  //       return res;
  //     })
  //   );
  // }
  getThumbnailPreview(type,token, h?: number, w?: number) {
    if (type == 'overview')
    return environment.apiBasePath+ '/settings/files/user-overview-image/thumbnail?token='+token;
  }

  deleteItem(id: number){
    return this._http.delete('/user-guides/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        return res;
      })
    );
  }

  setImageDetails(imageDetails,url,type){
    OrganizationOverviewStore.setFileDetails(imageDetails,url,type);
  }

  getImageDetails(type){
    return OrganizationOverviewStore.getFileDetailsByType(type);
  }

}





