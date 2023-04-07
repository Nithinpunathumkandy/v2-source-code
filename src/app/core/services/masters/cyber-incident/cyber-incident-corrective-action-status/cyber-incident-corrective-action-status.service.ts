import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CyberIncidentCorrectiveActionStatuses, CyberIncidentCorrectiveActionStatusesPaginationResponse } from 'src/app/core/models/masters/cyber-incident/cyber-incident-corrective-action-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-corrective-action-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentCorrectiveActionStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }


    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CyberIncidentCorrectiveActionStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${CyberIncidentCorrectiveActionStatusMasterStore.currentPage}`;
      if (CyberIncidentCorrectiveActionStatusMasterStore.orderBy) params += `&order=${CyberIncidentCorrectiveActionStatusMasterStore.orderBy}`;
      if (CyberIncidentCorrectiveActionStatusMasterStore.orderItem) params += `&order_by=${CyberIncidentCorrectiveActionStatusMasterStore.orderItem}`;
      if (CyberIncidentCorrectiveActionStatusMasterStore.searchText) params += `&q=${CyberIncidentCorrectiveActionStatusMasterStore.searchText}`;
      }
      if (CyberIncidentCorrectiveActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + CyberIncidentCorrectiveActionStatusMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<CyberIncidentCorrectiveActionStatusesPaginationResponse>('/cyber-incident-corrective-action-statuses' + (params ? params : '')).pipe(
        map((res: CyberIncidentCorrectiveActionStatusesPaginationResponse) => {
          CyberIncidentCorrectiveActionStatusMasterStore.setCyberIncidentCorrectiveActionStatus(res);
          return res;
        })
      );
    }


    // getAllItems(): Observable<CyberIncidentCorrectiveActionStatuses[]> {
    //   return this._http.get<CyberIncidentCorrectiveActionStatuses[]>('/cyber-incident-corrective-action-statuses').pipe((
    //     map((res:CyberIncidentCorrectiveActionStatuses[])=>{
    //       CyberIncidentCorrectiveActionStatusMasterStore.setAllCyberIncidentCorrectiveActionStatuses(res);
    //       return res;
    //     })
    //   ))
    // }


    exportToExcel() {
      this._http.get('/cyber-incident-corrective-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_corrective_action_statuses')
          +".xlsx");
        }
      )
    }

    activate(id: number) {
      return this._http.put('/cyber-incident-corrective-action-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    
    deactivate(id: number) {
      return this._http.put('/cyber-incident-corrective-action-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }



    sortCyberIncidentCorrectiveActionStatusesList(type:string, text:string) {
      if (!CyberIncidentCorrectiveActionStatusMasterStore.orderBy) {
        CyberIncidentCorrectiveActionStatusMasterStore.orderBy = 'asc';
        CyberIncidentCorrectiveActionStatusMasterStore.orderItem = type;
      }
      else{
        if (CyberIncidentCorrectiveActionStatusMasterStore.orderItem == type) {
          if(CyberIncidentCorrectiveActionStatusMasterStore.orderBy == 'asc') CyberIncidentCorrectiveActionStatusMasterStore.orderBy = 'desc';
          else CyberIncidentCorrectiveActionStatusMasterStore.orderBy = 'asc'
        }
        else{
          CyberIncidentCorrectiveActionStatusMasterStore.orderBy = 'asc';
          CyberIncidentCorrectiveActionStatusMasterStore.orderItem = type;
        }
      }
    }
}
