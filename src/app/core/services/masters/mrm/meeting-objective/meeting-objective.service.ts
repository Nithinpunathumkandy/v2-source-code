import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingObjective,MeetingObjectivePaginationResponse } from 'src/app/core/models/masters/mrm/meeting-objective';
import{MeetingObjectiveMasterStore} from 'src/app/stores/masters/mrm/meeting-objective-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingObjectiveService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingObjectivePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingObjectiveMasterStore.currentPage}`;
        if (MeetingObjectiveMasterStore.orderBy) params += `&order_by=${MeetingObjectiveMasterStore.orderItem}&order=${MeetingObjectiveMasterStore.orderBy}`;
      }
      if(MeetingObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingObjectiveMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingObjectivePaginationResponse>('/meeting-objectives' + (params ? params : '')).pipe(
        map((res: MeetingObjectivePaginationResponse) => {
          MeetingObjectiveMasterStore.setMeetingObjective(res);
          return res;
        })
      );
    }


    getAllItems(): Observable<MeetingObjective[]> {
      return this._http.get<MeetingObjective[]>('/meeting-objectives').pipe((
        map((res:MeetingObjective[])=>{
          MeetingObjectiveMasterStore.setAllMeetingObjective(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<MeetingObjective> {
      return this._http.get<MeetingObjective>('/meeting-objectives/'+id).pipe((
        map((res:MeetingObjective)=>{
          MeetingObjectiveMasterStore.setIndividualMeetingObjective(res);
          return res;
        })
      ))
    }
    saveItem(item: any) {
      return this._http.post('/meeting-objectives', item).pipe(
        map((res:any )=> {
          MeetingObjectiveMasterStore.setLastInsertedId(res['id']);
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/meeting-objectives/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/meeting-objectives/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              MeetingObjectiveMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/meeting-objectives/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-objectives/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_objectives')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-objectives/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingObjectiveList(type:string, text:string) {
      if (!MeetingObjectiveMasterStore.orderBy) {
        MeetingObjectiveMasterStore.orderBy = 'asc';
        MeetingObjectiveMasterStore.orderItem = type;
      }
      else{
        if (MeetingObjectiveMasterStore.orderItem == type) {
          if(MeetingObjectiveMasterStore.orderBy == 'asc') MeetingObjectiveMasterStore.orderBy = 'desc';
          else MeetingObjectiveMasterStore.orderBy = 'asc'
        }
        else{
          MeetingObjectiveMasterStore.orderBy = 'asc';
          MeetingObjectiveMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    // this.getItems(false,`&q=${text}`,true).subscribe();
    }

    searchTextObjective(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingObjectivePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingObjectiveMasterStore.currentPage}`;
        if (MeetingObjectiveMasterStore.orderBy) params += `&order_by=meeting_objectives.title&order=${MeetingObjectiveMasterStore.orderBy}`;
      }
      if(MeetingObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingObjectiveMasterStore.searchText;
      if(additionalParams)
        params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingObjectivePaginationResponse>('/meeting-objectives' + (params ? params : '')).pipe(
        map((res: MeetingObjectivePaginationResponse) => {

          return res;
        })
      );
    }

    selectRequiredObjective(issues){
   
      MeetingObjectiveMasterStore.addSelectedObjective(issues);
    }
}
