import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {RangePaginationResponse,RangeSingle} from 'src/app/core/models/masters/event-monitoring/range';
import {RangeMasterStore} from 'src/app/stores/masters/event-monitoring/range-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<RangePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${RangeMasterStore.currentPage}`;
      if (RangeMasterStore.orderBy)
        params += `&order_by=${RangeMasterStore.orderItem}&order=${RangeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(RangeMasterStore.searchText) params += (params ? '&q=' : '?q=')+RangeMasterStore.searchText;

    
    return this._http
      .get<RangePaginationResponse>('/event-ranges'+(params ? params : ''))
      .pipe(
        map((res: RangePaginationResponse) => {
          RangeMasterStore.setRange(res);
          return res;
        })
      );
  }

  getItem(id): Observable<RangeSingle> {
		return this._http.get<RangeSingle>('/event-ranges/' + id).pipe(
			map((res: RangeSingle) => {
				RangeMasterStore.setIndividualRange(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-ranges/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','range_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-ranges', item).pipe(
      map(res => {
        RangeMasterStore.setLastInsertedrange(res['id']);
        this._utilityService.showSuccessMessage('success','range_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-ranges/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('range_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-ranges/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_range')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-ranges/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-ranges/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','range_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-ranges/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','range_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-ranges/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','range_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-ranges/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','range_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            RangeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortRangeList(type:string, text:string) {
    if (!RangeMasterStore.orderBy) {
      RangeMasterStore.orderBy = 'asc';
      RangeMasterStore.orderItem = type;
    }
    else{
      if (RangeMasterStore.orderItem == type) {
        if(RangeMasterStore.orderBy == 'asc') RangeMasterStore.orderBy = 'desc';
        else RangeMasterStore.orderBy = 'asc'
      }
      else{
        RangeMasterStore.orderBy = 'asc';
        RangeMasterStore.orderItem = type;
      }
    }
  }
}
