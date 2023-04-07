import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventTeamsStore } from 'src/app/stores/event-monitoring/event-team-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { ExternalUsers, IndividualExternalUsers } from 'src/app/core/models/event-monitoring/events/event-external-users';
import { ExternalUsersStore } from 'src/app/stores/event-monitoring/events/event-external-user.store';

@Injectable({
  providedIn: 'root'
})
export class EventTeamService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }
  
  getItem() : Observable<any>{
    return this._http.get<any>(`/events/${EventsStore.selectedEventId}`).pipe(
      map((res: any) => {
        EventsStore.setEventDetails(res);
        this.getAssistantManagers().subscribe();
      
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/event-users` + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','events_team_updated');
        //this.getItem().subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/event-users`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','events_team_added');
        //console.log(EventsStore.selectedEventId)
       //this.getItem().subscribe();
        return res;
      })
    );
  }

  getAssistantManagers(){
    return this._http.get<any>(`/events/${EventsStore.selectedEventId}/event-assistant-managers`).pipe(
      map((res: any) => {
        EventTeamsStore.setAssistantManagers(res)
        this.getMembers().subscribe();
        return res;
      })
    );
  }

  getMembers(){
    return this._http.get<any>(`/events/${EventsStore.selectedEventId}/event-members`).pipe(
      map((res: any) => {
        EventTeamsStore.setMembers(res)
        return res;
      })
    );
  }

  updateEventMember(id: number, data: any): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/event-members/${id}`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'external_users_updated');
         this.getMembers().subscribe();
        return res;
      })
    );
  }

  deleteEventMember(id: number){
    return this._http.delete(`/events/${EventsStore.selectedEventId}/event-members/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_member_deleted');
        this.getMembers().subscribe();
        return res;
      })
    );
  }

  getSecondaryOwners(){
    return this._http.get<any>(`/events/${EventsStore.selectedEventId}/event-secondary-owners`).pipe(
      map((res: any) => {
        EventTeamsStore.setSecondaryOwners(res)
        return res;
      })
    );
  }

  saveSecondaryOwner(data){
    return this._http.post<any>(`/events/${EventsStore.selectedEventId}/add-event-secondary-owners`,data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success','secondary_owners_updated');
        this.getSecondaryOwners().subscribe();
        return res;
      })
    );
  }

externalUserGetItems() : Observable<ExternalUsers>{
    return this._http.get<ExternalUsers>(`/events/${EventsStore.selectedEventId}/external-users`).pipe(
      map((res: ExternalUsers) => {
        ExternalUsersStore.setExternalUsers(res['data'])
        return res;
      })
    );
  }  

  saveExternalUser(item: any){
    return this._http.post(`/events/${EventsStore.selectedEventId}/external-users`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','external_users_saved');
         this.externalUserGetItems().subscribe();
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
  updateExternalUser(documentId: number, item: any): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/external-users/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'external_users_updated');
         this.externalUserGetItems().subscribe();
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
  deleteExternalUser(documentId: number){
    return this._http.delete(`/events/${EventsStore.selectedEventId}/external-users/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'external_users_deleted');
        this.getItem().subscribe();
        return res;
      })
    );
  }
}
