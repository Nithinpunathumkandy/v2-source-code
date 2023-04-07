import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {PeriodicityPaginationResponse,PeriodicitySingle} from 'src/app/core/models/masters/event-monitoring/periodicity'
import {PeriodicityMasterStore} from 'src/app/stores/masters/event-monitoring/periodicity-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class PeriodicityService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<PeriodicityPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${PeriodicityMasterStore.currentPage}`;
      if (PeriodicityMasterStore.orderBy)
        params += `&order_by=${PeriodicityMasterStore.orderItem}&order=${PeriodicityMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(PeriodicityMasterStore.searchText) params += (params ? '&q=' : '?q=')+PeriodicityMasterStore.searchText;

    
    return this._http
      .get<PeriodicityPaginationResponse>('/event-periodicities'+(params ? params : ''))
      .pipe(
        map((res: PeriodicityPaginationResponse) => {
          PeriodicityMasterStore.setPeriodicity(res);
          return res;
        })
      );
  }

  getItem(id): Observable<PeriodicitySingle> {
		return this._http.get<PeriodicitySingle>('/event-periodicities/' + id).pipe(
			map((res: PeriodicitySingle) => {
				PeriodicityMasterStore.setIndividualPeriodicity(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-periodicities/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','periodicity_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-periodicities', item).pipe(
      map(res => {
        PeriodicityMasterStore.setLastInsertedperiodicity(res['id']);
        this._utilityService.showSuccessMessage('success','periodicity_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-periodicities/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('periodicity_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-periodicities/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('periodicity')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-periodicities/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-periodicities/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','periodicity_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-periodicities/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','periodicity_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-periodicities/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','periodicity_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-periodicities/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','periodicity_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            PeriodicityMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortPeriodicityList(type:string, text:string) {
    if (!PeriodicityMasterStore.orderBy) {
      PeriodicityMasterStore.orderBy = 'asc';
      PeriodicityMasterStore.orderItem = type;
    }
    else{
      if (PeriodicityMasterStore.orderItem == type) {
        if(PeriodicityMasterStore.orderBy == 'asc') PeriodicityMasterStore.orderBy = 'desc';
        else PeriodicityMasterStore.orderBy = 'asc'
      }
      else{
        PeriodicityMasterStore.orderBy = 'asc';
        PeriodicityMasterStore.orderItem = type;
      }
    }
  }
}