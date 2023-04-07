import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {TargetAudiencePaginationResponse,TargetAudienceSingle} from 'src/app/core/models/masters/event-monitoring/target-audience'
import {TargetAudienceMasterStore} from 'src/app/stores/masters/event-monitoring/target-audience-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class TargetAudienceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<TargetAudiencePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TargetAudienceMasterStore.currentPage}`;
      if (TargetAudienceMasterStore.orderBy)
        params += `&order_by=${TargetAudienceMasterStore.orderItem}&order=${TargetAudienceMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(TargetAudienceMasterStore.searchText) params += (params ? '&q=' : '?q=')+TargetAudienceMasterStore.searchText;

    
    return this._http
      .get<TargetAudiencePaginationResponse>('/event-target-audiences'+(params ? params : ''))
      .pipe(
        map((res: TargetAudiencePaginationResponse) => {
          TargetAudienceMasterStore.setTargetAudience(res);
          return res;
        })
      );
  }

  getItem(id): Observable<TargetAudienceSingle> {
		return this._http.get<TargetAudienceSingle>('/event-target-audiences/' + id).pipe(
			map((res: TargetAudienceSingle) => {
				TargetAudienceMasterStore.setIndividualTargetAudience(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-target-audiences/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','target_audience_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-target-audiences', item).pipe(
      map(res => {
        TargetAudienceMasterStore.setLastInsertedtargetAudience(res['id']);
        this._utilityService.showSuccessMessage('success','target_audience_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-target-audiences/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('target_audience_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-target-audiences/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('target_audience')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-target-audiences/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-target-audiences/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','target_audience_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-target-audiences/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','target_audience_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-target-audiences/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','target_audience_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-target-audiences/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','target_audience_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            TargetAudienceMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortTargetAudienceList(type:string, text:string) {
    if (!TargetAudienceMasterStore.orderBy) {
      TargetAudienceMasterStore.orderBy = 'asc';
      TargetAudienceMasterStore.orderItem = type;
    }
    else{
      if (TargetAudienceMasterStore.orderItem == type) {
        if(TargetAudienceMasterStore.orderBy == 'asc') TargetAudienceMasterStore.orderBy = 'desc';
        else TargetAudienceMasterStore.orderBy = 'asc'
      }
      else{
        TargetAudienceMasterStore.orderBy = 'asc';
        TargetAudienceMasterStore.orderItem = type;
      }
    }
  }
}
