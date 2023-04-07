import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {DimensionPaginationResponse,DimensionSingle} from 'src/app/core/models/masters/event-monitoring/dimension';
import {DimensionMasterStore} from 'src/app/stores/masters/event-monitoring/dimension-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DimensionService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<DimensionPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DimensionMasterStore.currentPage}`;
      if (DimensionMasterStore.orderBy)
        params += `&order_by=${DimensionMasterStore.orderItem}&order=${DimensionMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(DimensionMasterStore.searchText) params += (params ? '&q=' : '?q=')+DimensionMasterStore.searchText;

    
    return this._http
      .get<DimensionPaginationResponse>('/event-dimensions'+(params ? params : ''))
      .pipe(
        map((res: DimensionPaginationResponse) => {
          DimensionMasterStore.setDimension(res);
          return res;
        })
      );
  }

  getItem(id): Observable<DimensionSingle> {
		return this._http.get<DimensionSingle>('/event-dimensions/' + id).pipe(
			map((res: DimensionSingle) => {
				DimensionMasterStore.setIndividualDimension(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-dimensions/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_dimension_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-dimensions', item).pipe(
      map(res => {
        DimensionMasterStore.setLastInserteddimension(res['id']);
        this._utilityService.showSuccessMessage('success','event_dimension_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-dimensions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_dimension_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-dimensions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_dimension')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-dimensions/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-dimensions/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_dimension_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-dimensions/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_dimension_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-dimensions/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_dimension_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-dimensions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_dimension_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            DimensionMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortDimensionList(type:string, text:string) {
    if (!DimensionMasterStore.orderBy) {
      DimensionMasterStore.orderBy = 'asc';
      DimensionMasterStore.orderItem = type;
    }
    else{
      if (DimensionMasterStore.orderItem == type) {
        if(DimensionMasterStore.orderBy == 'asc') DimensionMasterStore.orderBy = 'desc';
        else DimensionMasterStore.orderBy = 'asc'
      }
      else{
        DimensionMasterStore.orderBy = 'asc';
        DimensionMasterStore.orderItem = type;
      }
    }
  }
}
