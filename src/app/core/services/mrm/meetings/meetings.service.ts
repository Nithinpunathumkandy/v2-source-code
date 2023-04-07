import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualMeetings, MeetingsPaginationResponse } from 'src/app/core/models/mrm/meetings/meetings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    ) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<MeetingsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingsStore.currentPage}&status=all`;
        if (MeetingsStore.orderBy) params += `&order_by=${MeetingsStore.orderItem}&order=${MeetingsStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(MeetingsStore.searchText) params += (params ? '&q=' : '?q=')+MeetingsStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'meeting' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<MeetingsPaginationResponse>('/meetings' + (params ? params : '')).pipe(
        map((res: MeetingsPaginationResponse) => {
          MeetingsStore.setMeetings(res);    
          return res;
        })
      );
    } 
    
    getItem(id: number): Observable<IndividualMeetings> {
      return this._http.get<IndividualMeetings>('/meetings/' + id).pipe(
        map((res: IndividualMeetings) => {
          MeetingsStore.setIndividualMeetingsDetails(res);
          return res;
        })
      );
    }

  saveItem(data): Observable<any> {
    return this._http.post('/meetings', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_is_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  saveUnplannedItem(data): Observable<any> {
    return this._http.post('/unplanned-meetings', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_is_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(meeting_id:number, data: IndividualMeetings): Observable<any> {
    return this._http.put('/meetings/'+ meeting_id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  updateMOM(mom_id:number, data): Observable<any> {
    return this._http.put('/meetings/'+MeetingsStore.meetingsId+'/minutes/'+mom_id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mom_has_been_updated');
        this.getItem(MeetingsStore.meetingsId).subscribe();
        return res;
      })
    );
  }

  addMOM(data): Observable<any> {
    return this._http.post('/meetings/'+MeetingsStore.meetingsId+'/minutes', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mom_has_been_added');
        this.getItem(MeetingsStore.meetingsId).subscribe();
        return res;
      })
    );
  }

  updateUnplanned(meeting_id:number, data: IndividualMeetings): Observable<any> {
    return this._http.put('/unplanned-meetings/'+ meeting_id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  deleteUnplanned(id: number) {
    return this._http.delete('/unplanned-meetings/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_has_been_deleted');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            MeetingsStore.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/meetings/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_has_been_deleted');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            MeetingsStore.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  deleteMOM(meetingId: number,id:number) {
    return this._http.delete('/meetings/'+meetingId+'/minutes/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mom_has_been_deleted');
        return res;
      })
    );
  }

  getSearchItems(additionalParams:string){
    let params='';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    return this._http.get<MeetingsPaginationResponse>('/meetings' + (params ? params : '')).pipe(
      map((res: MeetingsPaginationResponse) => {
        MeetingsStore.setMeetings(res); 

        return res;
      })
    );
  }

  saveMeetingId(id:number){
    MeetingsStore.setMeetingsId(id);
  }

  sortMeetingsList(type:string, text:string) {
    if (!MeetingsStore.orderBy) {
      MeetingsStore.orderBy = 'desc';
      MeetingsStore.orderItem = type;
    }
    else{
      if (MeetingsStore.orderItem == type) {
        if(MeetingsStore.orderBy == 'desc') MeetingsStore.orderBy = 'asc';
        else MeetingsStore.orderBy = 'desc'
      }
      else{
        MeetingsStore.orderBy = 'desc';
        MeetingsStore.orderItem = type;
      }
    }
  }

  generateTemplate() {
    this._http.get('/meetings/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meetings_template')+".xlsx");

      }
    )
  }

  exportToExcel() {
    let params = '';
    if (MeetingsStore.orderBy) params += `?order=${MeetingsStore.orderBy}`;
    if (MeetingsStore.orderItem) params += `&order_by=${MeetingsStore.orderItem}`;
    // if (MeetingsStore.searchText) params += `&q=${MeetingsStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'meeting' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/meetings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meetings')+".xlsx");
      }
    )
  }

  setDocumentDetails(imageDetails,url){
    MeetingsStore.setDocumentDetails(imageDetails,url);
  }

  meetingPlanGetMeetingItemId(meetingPlanId: number): Observable<MeetingsPaginationResponse> {
    return this._http.get<MeetingsPaginationResponse>('/meetings?meeting_plan_ids=' + meetingPlanId).pipe(
      map((res: MeetingsPaginationResponse) => {
        MeetingsStore.setMeetings(res); 
        return res;
      })
    );
  }

  minutesSave(meetingId,data): Observable<any> {
    return this._http.post(`/meetings/${meetingId}/minutes`, data).pipe(
      map(res => {
        this.getItem(meetingId).subscribe();
        return res;
      })
    );
  }

  minutesUpdate(meetingId,data,minuteId): Observable<any> {
    return this._http.put(`/meetings/${meetingId}/minutes/${minuteId}`, data).pipe(
      map(res => {
        this.getItem(meetingId).subscribe();
        return res;
      })
    );
  }

  minutesSaveUnPlanned(meetingId,data): Observable<any> {
    return this._http.post(`/unplanned-meetings/${meetingId}/minutes`, data).pipe(
      map(res => {
        this.getItem(meetingId).subscribe();
        return res;
      })
    );
  }

  minutesUpdateUnPlanned(meetingId,data,minuteId): Observable<any> {
    return this._http.put(`/unplanned-meetings/${meetingId}/minutes/${minuteId}`, data).pipe(
      map(res => {
        this.getItem(meetingId).subscribe();
        return res;
      })
    );
  }

  minutesDelete(meetingId,minuteId): Observable<any> {
    return this._http.delete(`/meetings/${meetingId}/minutes/${minuteId}`).pipe(
      map(res => {
        this.getItem(meetingId).subscribe();
        return res;
      })
    );
  }

  selectRequiredMeeting(issues){
   
		MeetingsStore.addSelectedMeetings(issues);
	  }

}
