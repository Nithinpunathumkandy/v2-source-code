import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingPlanStatus,MeetingPlanStatusPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-plan-status';
import{MeetingPlanStatusMasterStore} from 'src/app/stores/masters/mrm/meeting-plan-status-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingPlanStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingPlanStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingPlanStatusMasterStore.currentPage}`;
        if (MeetingPlanStatusMasterStore.orderBy) params += `&order_by=${MeetingPlanStatusMasterStore.orderItem}&order=${MeetingPlanStatusMasterStore.orderBy}`;
      }
      if(MeetingPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingPlanStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingPlanStatusPaginationResponse>('/meeting-plan-statuses' + (params ? params : '')).pipe(
        map((res: MeetingPlanStatusPaginationResponse) => {
          MeetingPlanStatusMasterStore.setMeetingPlanStatus(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<MeetingPlanStatus[]> {
      return this._http.get<MeetingPlanStatus[]>('/meeting-plan-statuses').pipe((
        map((res:MeetingPlanStatus[])=>{
          MeetingPlanStatusMasterStore.setAllMeetingPlanStatus(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/meeting-plan-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-plan-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_plan_status')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-plan-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingPlanStatusList(type:string, text:string) {
      if (!MeetingPlanStatusMasterStore.orderBy) {
        MeetingPlanStatusMasterStore.orderBy = 'asc';
        MeetingPlanStatusMasterStore.orderItem = type;
      }
      else{
        if (MeetingPlanStatusMasterStore.orderItem == type) {
          if(MeetingPlanStatusMasterStore.orderBy == 'asc') MeetingPlanStatusMasterStore.orderBy = 'desc';
          else MeetingPlanStatusMasterStore.orderBy = 'asc'
        }
        else{
          MeetingPlanStatusMasterStore.orderBy = 'asc';
          MeetingPlanStatusMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    // this.getItems(false,`&q=${text}`,true).subscribe();
    }
}
