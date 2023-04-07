import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {CommunicationPaginationResponse,CommunicationSingle} from 'src/app/core/models/masters/event-monitoring/communication';
import {CommunicationMasterStore} from 'src/app/stores/masters/event-monitoring/communication-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<CommunicationPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CommunicationMasterStore.currentPage}`;
      if (CommunicationMasterStore.orderBy)
        params += `&order_by=${CommunicationMasterStore.orderItem}&order=${CommunicationMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(CommunicationMasterStore.searchText) params += (params ? '&q=' : '?q=')+CommunicationMasterStore.searchText;

    
    return this._http
      .get<CommunicationPaginationResponse>('/event-communication-channels'+(params ? params : ''))
      .pipe(
        map((res: CommunicationPaginationResponse) => {
          CommunicationMasterStore.setCommunication(res);
          return res;
        })
      );
  }

  getItem(id): Observable<CommunicationSingle> {
		return this._http.get<CommunicationSingle>('/event-communication-channels/' + id).pipe(
			map((res: CommunicationSingle) => {
				CommunicationMasterStore.setIndividualCommunication(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-communication-channels/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-communication-channels', item).pipe(
      map(res => {
        CommunicationMasterStore.setLastInsertedcommunication(res['id']);
        this._utilityService.showSuccessMessage('success','communication_channel_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-communication-channels/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-communication-channels/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('communication')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-communication-channels/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-communication-channels/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-communication-channels/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-communication-channels/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-communication-channels/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            CommunicationMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortCommunicationList(type:string, text:string) {
    if (!CommunicationMasterStore.orderBy) {
      CommunicationMasterStore.orderBy = 'asc';
      CommunicationMasterStore.orderItem = type;
    }
    else{
      if (CommunicationMasterStore.orderItem == type) {
        if(CommunicationMasterStore.orderBy == 'asc') CommunicationMasterStore.orderBy = 'desc';
        else CommunicationMasterStore.orderBy = 'asc'
      }
      else{
        CommunicationMasterStore.orderBy = 'asc';
        CommunicationMasterStore.orderItem = type;
      }
    }
  }
}
