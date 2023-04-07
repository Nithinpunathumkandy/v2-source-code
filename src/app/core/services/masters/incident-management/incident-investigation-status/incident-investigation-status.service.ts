import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentInvestigationStatusPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-investigation-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-investigation-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentInvestigationStatusService {

  constructor(private _http:HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IncidentInvestigationStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentInvestigationStatusMasterStore.currentPage}`;
      if (IncidentInvestigationStatusMasterStore.orderBy) params += `&order_by=${IncidentInvestigationStatusMasterStore.orderItem}&order=${IncidentInvestigationStatusMasterStore.orderBy}`;
    }
    if(IncidentInvestigationStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentInvestigationStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<IncidentInvestigationStatusPaginationResponse>('/incident-investigation-statuses' + (params ? params : '')).pipe(
      map((res: IncidentInvestigationStatusPaginationResponse) => {
        IncidentInvestigationStatusMasterStore.setIncidentInvestigationStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/incident-investigation-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_investigation_status')
        +".xlsx");
      }
    )
  }

  sortIncidentInvestigationStatusList(type:string, text:string) {
    if (!IncidentInvestigationStatusMasterStore.orderBy) {
      IncidentInvestigationStatusMasterStore.orderBy = 'asc';
      IncidentInvestigationStatusMasterStore.orderItem = type;
    }
    else{
      if (IncidentInvestigationStatusMasterStore.orderItem == type) {
        if(IncidentInvestigationStatusMasterStore.orderBy == 'asc') IncidentInvestigationStatusMasterStore.orderBy = 'desc';
        else IncidentInvestigationStatusMasterStore.orderBy = 'asc'
      }
      else{
        IncidentInvestigationStatusMasterStore.orderBy = 'asc';
        IncidentInvestigationStatusMasterStore.orderItem = type;
      }
    }
  }
}
