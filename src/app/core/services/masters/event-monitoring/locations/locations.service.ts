import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {LocationsPaginationResponse,LocationsSingle} from 'src/app/core/models/masters/event-monitoring/locations';
import {LocationsMasterStore} from 'src/app/stores/masters/event-monitoring/locations-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<LocationsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${LocationsMasterStore.currentPage}`;
      if (LocationsMasterStore.orderBy)
        params += `&order_by=${LocationsMasterStore.orderItem}&order=${LocationsMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(LocationsMasterStore.searchText) params += (params ? '&q=' : '?q=')+LocationsMasterStore.searchText;

    
    return this._http
      .get<LocationsPaginationResponse>('/locations'+(params ? params : ''))
      .pipe(
        map((res: LocationsPaginationResponse) => {
          LocationsMasterStore.setLocations(res);
          return res;
        })
      );
  }

  getItem(id): Observable<LocationsSingle> {
		return this._http.get<LocationsSingle>('/event-locations/' + id).pipe(
			map((res: LocationsSingle) => {
				LocationsMasterStore.setIndividualLocations(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-locations/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_location_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-locations', item).pipe(
      map(res => {
        LocationsMasterStore.setLastInsertedlocations(res['id']);
        this._utilityService.showSuccessMessage('success','event_location_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-locations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-locations/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('locations')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-locations/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-locations/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-locations/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-locations/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-locations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_location_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            LocationsMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortLocationsList(type:string, text:string) {
    if (!LocationsMasterStore.orderBy) {
      LocationsMasterStore.orderBy = 'asc';
      LocationsMasterStore.orderItem = type;
    }
    else{
      if (LocationsMasterStore.orderItem == type) {
        if(LocationsMasterStore.orderBy == 'asc') LocationsMasterStore.orderBy = 'desc';
        else LocationsMasterStore.orderBy = 'asc'
      }
      else{
        LocationsMasterStore.orderBy = 'asc';
        LocationsMasterStore.orderItem = type;
      }
    }
  }
}
