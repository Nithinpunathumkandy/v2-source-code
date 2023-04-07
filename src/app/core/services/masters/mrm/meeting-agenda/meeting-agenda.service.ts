import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingAgenda,MeetingAgendaDetails,MeetingAgendaPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-agenda';
import{MeetingAgendaMasterStore} from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingAgendaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingAgendaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingAgendaMasterStore.currentPage}`;
        if (MeetingAgendaMasterStore.orderBy) params += `&order_by=${MeetingAgendaMasterStore.orderItem}&order=${MeetingAgendaMasterStore.orderBy}`;
      }
      if(MeetingAgendaMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingAgendaMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingAgendaPaginationResponse>('/meeting-agendas' + (params ? params : '')).pipe(
        map((res: MeetingAgendaPaginationResponse) => {
          MeetingAgendaMasterStore.setMeetingAgenda(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<MeetingAgenda[]> {
      return this._http.get<MeetingAgenda[]>('/meeting-agendas').pipe((
        map((res:MeetingAgenda[])=>{
          MeetingAgendaMasterStore.setAllMeetingAgenda(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<MeetingAgendaDetails> {
      return this._http.get<MeetingAgendaDetails>('/meeting-agendas/'+id).pipe((
        map((res:MeetingAgendaDetails)=>{
          MeetingAgendaMasterStore.setIndividualMeetingAgenda(res);
          return res;
        })
      ))
    }
    saveItem(item: any) {
      return this._http.post('/meeting-agendas', item).pipe(
        map((res:any )=> {
          MeetingAgendaMasterStore.setLastInsertedId(res['id']);
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/meeting-agendas/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/meeting-agendas/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              MeetingAgendaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/meeting-agendas/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-agendas/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-agendas/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_agenda')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-agendas/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingAgendaList(type:string, text:string) {
      if (!MeetingAgendaMasterStore.orderBy) {
        MeetingAgendaMasterStore.orderBy = 'asc';
        MeetingAgendaMasterStore.orderItem = type;
      }
      else{
        if (MeetingAgendaMasterStore.orderItem == type) {
          if(MeetingAgendaMasterStore.orderBy == 'asc') MeetingAgendaMasterStore.orderBy = 'desc';
          else MeetingAgendaMasterStore.orderBy = 'asc'
        }
        else{
          MeetingAgendaMasterStore.orderBy = 'asc';
          MeetingAgendaMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    // this.getItems(false,`&q=${text}`,true).subscribe();
    }

    searchTextAgenda(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingAgendaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MeetingAgendaMasterStore.currentPage}`;
        if (MeetingAgendaMasterStore.orderBy) params += `&order_by=meeting_agendas.title&order=${MeetingAgendaMasterStore.orderBy}`;
      }
      if(MeetingAgendaMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingAgendaMasterStore.searchText;
      if(additionalParams)
        params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingAgendaPaginationResponse>('/meeting-agendas' + (params ? params : '')).pipe(
        map((res: MeetingAgendaPaginationResponse) => {
      
          return res;
        })
      );
    }

    
    selectRequiredAgenda(issues){
   
      MeetingAgendaMasterStore.addSelectedAgenda(issues);
    }

}
