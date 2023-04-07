import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingType,MeetingTypePaginationResponse } from 'src/app/core/models/masters/mrm/meeting-type';
import{MeetingTypeMasterStore} from 'src/app/stores/masters/mrm/meeting-type-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingTypeMasterStore.currentPage}`;
        if (MeetingTypeMasterStore.orderBy) params += `&order_by=${MeetingTypeMasterStore.orderItem}&order=${MeetingTypeMasterStore.orderBy}`;
      }
      if(MeetingTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingTypeMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingTypePaginationResponse>('/meeting-types' + (params ? params : '')).pipe(
        map((res: MeetingTypePaginationResponse) => {
          MeetingTypeMasterStore.setMeetingType(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<MeetingType[]> {
      return this._http.get<MeetingType[]>('/meeting-types').pipe((
        map((res:MeetingType[])=>{
          MeetingTypeMasterStore.setAllMeetingType(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/meeting-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingTypeList(type:string, text:string) {
      if (!MeetingTypeMasterStore.orderBy) {
        MeetingTypeMasterStore.orderBy = 'asc';
        MeetingTypeMasterStore.orderItem = type;
      }
      else{
        if (MeetingTypeMasterStore.orderItem == type) {
          if(MeetingTypeMasterStore.orderBy == 'asc') MeetingTypeMasterStore.orderBy = 'desc';
          else MeetingTypeMasterStore.orderBy = 'asc'
        }
        else{
          MeetingTypeMasterStore.orderBy = 'asc';
          MeetingTypeMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    // this.getItems(false,`&q=${text}`,true).subscribe();
    }
}
