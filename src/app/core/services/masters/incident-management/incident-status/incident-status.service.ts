import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {IncidentStatus, IncidentStatusPaginationResponse} from 'src/app/core/models/masters/incident-management/incident-status';
import {IncidentStatusMasterStore} from 'src/app/stores/masters/incident-management/incident-status-master-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IncidentStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentStatusMasterStore.currentPage}`;
      if (IncidentStatusMasterStore.orderBy) params += `&order_by=${IncidentStatusMasterStore.orderItem}&order=${IncidentStatusMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(IncidentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentStatusMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<IncidentStatusPaginationResponse>('/incident-statuses' + (params ? params : '')).pipe(
      map((res: IncidentStatusPaginationResponse) => {
        IncidentStatusMasterStore.setIncidentStatus(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<IncidentStatus[]>{
    return this._http.get<IncidentStatus[]>('/incident-statuses?is_all=true').pipe(
      map((res: IncidentStatus[]) => {
        
        IncidentStatusMasterStore.setAllIncidentStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/incident-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_status')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/incident-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_status_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_status_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortIncidentStatuslList(type:string, text:string) {
    if (!IncidentStatusMasterStore.orderBy) {
      IncidentStatusMasterStore.orderBy = 'asc';
      IncidentStatusMasterStore.orderItem = type;
    }
    else{
      if (IncidentStatusMasterStore.orderItem == type) {
        if(IncidentStatusMasterStore.orderBy == 'asc') IncidentStatusMasterStore.orderBy = 'desc';
        else IncidentStatusMasterStore.orderBy = 'asc'
      }
      else{
        IncidentStatusMasterStore.orderBy = 'asc';
        IncidentStatusMasterStore.orderItem = type;
      }
    }
  }
}
