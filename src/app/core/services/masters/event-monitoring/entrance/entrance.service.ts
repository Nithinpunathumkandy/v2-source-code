import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {EntrancePaginationResponse,EntranceSingle} from 'src/app/core/models/masters/event-monitoring/entrance'
import {EntranceMasterStore} from 'src/app/stores/masters/event-monitoring/entrance-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class EntranceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EntrancePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EntranceMasterStore.currentPage}`;
      if (EntranceMasterStore.orderBy)
        params += `&order_by=${EntranceMasterStore.orderItem}&order=${EntranceMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EntranceMasterStore.searchText) params += (params ? '&q=' : '?q=')+EntranceMasterStore.searchText;

    
    return this._http
      .get<EntrancePaginationResponse>('/event-entrances'+(params ? params : ''))
      .pipe(
        map((res: EntrancePaginationResponse) => {
          EntranceMasterStore.setEntrance(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EntranceSingle> {
		return this._http.get<EntranceSingle>('/event-entrances/' + id).pipe(
			map((res: EntranceSingle) => {
				EntranceMasterStore.setIndividualEntrance(res)
				return res;
			})
		);
	}

  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-entrances/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','entrance_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-entrances', item).pipe(
      map(res => {
        EntranceMasterStore.setLastInsertedentrance(res['id']);
        this._utilityService.showSuccessMessage('success','entrance_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-entrances/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('entrance_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-entrances/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('entrance')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-entrances/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-entrances/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','entrance_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-entrances/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','entrance_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-entrances/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','entrance_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-entrances/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','entrance_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EntranceMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortEntranceList(type:string, text:string) {
    if (!EntranceMasterStore.orderBy) {
      EntranceMasterStore.orderBy = 'asc';
      EntranceMasterStore.orderItem = type;
    }
    else{
      if (EntranceMasterStore.orderItem == type) {
        if(EntranceMasterStore.orderBy == 'asc') EntranceMasterStore.orderBy = 'desc';
        else EntranceMasterStore.orderBy = 'asc'
      }
      else{
        EntranceMasterStore.orderBy = 'asc';
        EntranceMasterStore.orderItem = type;
      }
    }
  }
}
