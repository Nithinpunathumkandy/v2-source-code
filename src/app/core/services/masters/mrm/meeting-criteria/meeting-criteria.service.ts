import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingCriteria,MeetingCriteriaPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-criteria';
import{MeetingCriteriaMasterStore} from 'src/app/stores/masters/mrm/meeting-criteria-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingCriteriaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingCriteriaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingCriteriaMasterStore.currentPage}`;
        if (MeetingCriteriaMasterStore.orderBy) params += `&order_by=${MeetingCriteriaMasterStore.orderItem}&order=${MeetingCriteriaMasterStore.orderBy}`;
      }
      if(MeetingCriteriaMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingCriteriaMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingCriteriaPaginationResponse>('/meeting-criteria' + (params ? params : '')).pipe(
        map((res: MeetingCriteriaPaginationResponse) => {
          MeetingCriteriaMasterStore.setMeetingCriteria(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<MeetingCriteria[]> {
      return this._http.get<MeetingCriteria[]>('/meeting-criteria').pipe((
        map((res:MeetingCriteria[])=>{
          MeetingCriteriaMasterStore.setAllMeetingCriteria(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<MeetingCriteria> {
      return this._http.get<MeetingCriteria>('/meeting-criteria/'+id).pipe((
        map((res:MeetingCriteria)=>{
          MeetingCriteriaMasterStore.setIndividualMeetingCriteria(res);
          return res;
        })
      ))
    }
    saveItem(item: any) {
      return this._http.post('/meeting-criteria', item).pipe(
        map((res:any )=> {
          MeetingCriteriaMasterStore.setLastInsertedId(res['id']);
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/meeting-criteria/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/meeting-criteria/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              MeetingCriteriaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/meeting-criteria/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-criteria/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-criteria/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_criteria')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-criteria/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingCriteriaList(type:string, text:string) {
      if (!MeetingCriteriaMasterStore.orderBy) {
        MeetingCriteriaMasterStore.orderBy = 'asc';
        MeetingCriteriaMasterStore.orderItem = type;
      }
      else{
        if (MeetingCriteriaMasterStore.orderItem == type) {
          if(MeetingCriteriaMasterStore.orderBy == 'asc') MeetingCriteriaMasterStore.orderBy = 'desc';
          else MeetingCriteriaMasterStore.orderBy = 'asc'
        }
        else{
          MeetingCriteriaMasterStore.orderBy = 'asc';
          MeetingCriteriaMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    // this.getItems(false,`&q=${text}`,true).subscribe();
    }

    searchTextCriteria(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingCriteriaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingCriteriaMasterStore.currentPage}`;
        if (MeetingCriteriaMasterStore.orderBy) params += `&order_by=meeting_criteria.title&order=${MeetingCriteriaMasterStore.orderBy}`;
      }
      if(MeetingCriteriaMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingCriteriaMasterStore.searchText;
      if(additionalParams)
        params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingCriteriaPaginationResponse>('/meeting-criteria' + (params ? params : '')).pipe(
        map((res: MeetingCriteriaPaginationResponse) => {
      
          return res;
        })
      );
    }

    selectRequiredCriteria(issues){
   
      MeetingCriteriaMasterStore.addSelectedCriteria(issues);
    }
}
