import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ChecklistPaginationResponse,ChecklistSingle} from 'src/app/core/models/masters/event-monitoring/checklist';
import {ChecklistMasterStore} from 'src/app/stores/masters/event-monitoring/checklist-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ChecklistPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ChecklistMasterStore.currentPage}`;
      if (ChecklistMasterStore.orderBy)
        params += `&order_by=${ChecklistMasterStore.orderItem}&order=${ChecklistMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ChecklistMasterStore.searchText) params += (params ? '&q=' : '?q=')+ChecklistMasterStore.searchText;

    
    return this._http
      .get<ChecklistPaginationResponse>('/event-checklists'+(params ? params : ''))
      .pipe(
        map((res: ChecklistPaginationResponse) => {
          ChecklistMasterStore.setChecklist(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ChecklistSingle> {
		return this._http.get<ChecklistSingle>('/event-checklists/' + id).pipe(
			map((res: ChecklistSingle) => {
				ChecklistMasterStore.setIndividualChecklist(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-checklists/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-checklists', item).pipe(
      map(res => {
        ChecklistMasterStore.setLastInsertedchecklist(res['id']);
        this._utilityService.showSuccessMessage('success','event_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-checklists/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-checklists/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('checklist')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-checklists/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-checklists/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-checklists/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-checklists/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-checklists/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ChecklistMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortChecklistList(type:string, text:string) {
    if (!ChecklistMasterStore.orderBy) {
      ChecklistMasterStore.orderBy = 'asc';
      ChecklistMasterStore.orderItem = type;
    }
    else{
      if (ChecklistMasterStore.orderItem == type) {
        if(ChecklistMasterStore.orderBy == 'asc') ChecklistMasterStore.orderBy = 'desc';
        else ChecklistMasterStore.orderBy = 'asc'
      }
      else{
        ChecklistMasterStore.orderBy = 'asc';
        ChecklistMasterStore.orderItem = type;
      }
    }
  }
}

