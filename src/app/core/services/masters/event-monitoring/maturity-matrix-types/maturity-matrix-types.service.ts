import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EventMatrixTypePaginationResponse , EventMatrixTypeSingle } from "src/app/core/models/masters/event-monitoring/event-maturity-matrix-types";
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventMatrixTypeMasterStore } from 'src/app/stores/masters/event-monitoring/event-maturity-matrix-types-store';

@Injectable({
  providedIn: 'root'
})
export class MaturityMatrixTypesService {  

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EventMatrixTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventMatrixTypeMasterStore.currentPage}`;
      if (EventMatrixTypeMasterStore.orderBy)
        params += `&order_by=${EventMatrixTypeMasterStore.orderItem}&order=${EventMatrixTypeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventMatrixTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventMatrixTypeMasterStore.searchText;    
    return this._http
      .get<EventMatrixTypePaginationResponse>('/event-maturity-matrix-types'+(params ? params : ''))
      .pipe(
        map((res: EventMatrixTypePaginationResponse) => {
          EventMatrixTypeMasterStore.setEventMatrixType(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventMatrixTypeSingle> {
		return this._http.get<EventMatrixTypeSingle>('/event-maturity-matrix-types/' + id).pipe(
			map((res: EventMatrixTypeSingle) => {
				EventMatrixTypeMasterStore.setIndividualEventMatrixType(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-maturity-matrix-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-maturity-matrix-types', item).pipe(
      map(res => {
        EventMatrixTypeMasterStore.setLastInsertedeventMatrixType(res['id']);
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  } 

  activate(id: number) {
    return this._http.put('/event-maturity-matrix-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-maturity-matrix-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-maturity-matrix-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EventMatrixTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortMaturityMatrixTypesList(type:string, text:string) {
    if (!EventMatrixTypeMasterStore.orderBy) {
      EventMatrixTypeMasterStore.orderBy = 'asc';
      EventMatrixTypeMasterStore.orderItem = type;
    }
    else{
      if (EventMatrixTypeMasterStore.orderItem == type) {
        if(EventMatrixTypeMasterStore.orderBy == 'asc') EventMatrixTypeMasterStore.orderBy = 'desc';
        else EventMatrixTypeMasterStore.orderBy = 'asc'
      }
      else{
        EventMatrixTypeMasterStore.orderBy = 'asc';
        EventMatrixTypeMasterStore.orderItem = type;
      }
    }
  }
}
