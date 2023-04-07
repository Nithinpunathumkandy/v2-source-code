import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {EventMaturityMatrixParameterPaginationResponse,EventMaturityMatrixParameterSingle} from 'src/app/core/models/masters/event-monitoring/event-maturity-matrix-parameter'
import {EventMaturityMatrixParameterMasterStore} from 'src/app/stores/masters/event-monitoring/event-maturity-matrix-parameter-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class EventMaturityMatrixParameterService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EventMaturityMatrixParameterPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventMaturityMatrixParameterMasterStore.currentPage}`;
      if (EventMaturityMatrixParameterMasterStore.orderBy)
        params += `&order_by=${EventMaturityMatrixParameterMasterStore.orderItem}&order=${EventMaturityMatrixParameterMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventMaturityMatrixParameterMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventMaturityMatrixParameterMasterStore.searchText;

    
    return this._http
      .get<EventMaturityMatrixParameterPaginationResponse>('/event-maturity-matrix-parameters'+(params ? params : ''))
      .pipe(
        map((res: EventMaturityMatrixParameterPaginationResponse) => {
          EventMaturityMatrixParameterMasterStore.setEventMaturityMatrixParameter(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventMaturityMatrixParameterSingle> {
		return this._http.get<EventMaturityMatrixParameterSingle>('/event-maturity-matrix-parameters/' + id).pipe(
			map((res: EventMaturityMatrixParameterSingle) => {
				EventMaturityMatrixParameterMasterStore.setIndividualEventMaturityMatrixParameter(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-maturity-matrix-parameters/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-maturity-matrix-parameters', item).pipe(
      map(res => {
        EventMaturityMatrixParameterMasterStore.setLastInsertedeventMaturityMatrixParameter(res['id']);
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-maturity-matrix-parameters/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_maturity_matrix_parameter_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-maturity-matrix-parameters/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_maturity_matrix_parameter')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-maturity-matrix-parameters/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('event-maturity-matrix-parameters/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-maturity-matrix-parameters/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-maturity-matrix-parameters/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-maturity-matrix-parameters/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_parameter_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EventMaturityMatrixParameterMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortEventMaturityMatrixParameterList(type:string, text:string) {
    if (!EventMaturityMatrixParameterMasterStore.orderBy) {
      EventMaturityMatrixParameterMasterStore.orderBy = 'asc';
      EventMaturityMatrixParameterMasterStore.orderItem = type;
    }
    else{
      if (EventMaturityMatrixParameterMasterStore.orderItem == type) {
        if(EventMaturityMatrixParameterMasterStore.orderBy == 'asc') EventMaturityMatrixParameterMasterStore.orderBy = 'desc';
        else EventMaturityMatrixParameterMasterStore.orderBy = 'asc'
      }
      else{
        EventMaturityMatrixParameterMasterStore.orderBy = 'asc';
        EventMaturityMatrixParameterMasterStore.orderItem = type;
      }
    }
  }
}
