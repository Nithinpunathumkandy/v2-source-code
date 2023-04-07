import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CyberIncidentStatuses, CyberIncidentStatusesPaginationResponse } from 'src/app/core/models/masters/cyber-incident/cyber-incident-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentStatusMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }


    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CyberIncidentStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${CyberIncidentStatusMasterStore.currentPage}`;
      if (CyberIncidentStatusMasterStore.orderBy) params += `&order=${CyberIncidentStatusMasterStore.orderBy}`;
      if (CyberIncidentStatusMasterStore.orderItem) params += `&order_by=${CyberIncidentStatusMasterStore.orderItem}`;
      if (CyberIncidentStatusMasterStore.searchText) params += `&q=${CyberIncidentStatusMasterStore.searchText}`;
      }
      if (CyberIncidentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + CyberIncidentStatusMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<CyberIncidentStatusesPaginationResponse>('/cyber-incident-statuses' + (params ? params : '')).pipe(
        map((res: CyberIncidentStatusesPaginationResponse) => {
          CyberIncidentStatusMasterStore.setCyberIncidentStatus(res);
          return res;
        })
      );
    }


    // getAllItems(): Observable<CyberIncidentStatuses[]> {
    //   return this._http.get<CyberIncidentStatuses[]>('/cyber-incident-statuses').pipe((
    //     map((res:CyberIncidentStatuses[])=>{
    //       CyberIncidentStatusMasterStore.setAllCyberIncidentStatuses(res);
    //       return res;
    //     })
    //   ))
    // }


    exportToExcel() {
      this._http.get('/cyber-incident-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_statuses')
          +".xlsx");
        }
      )
    }

    activate(id: number) {
      return this._http.put('/cyber-incident-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    
    deactivate(id: number) {
      return this._http.put('/cyber-incident-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }



    sortCyberIncidentStatusesList(type:string, text:string) {
      if (!CyberIncidentStatusMasterStore.orderBy) {
        CyberIncidentStatusMasterStore.orderBy = 'asc';
        CyberIncidentStatusMasterStore.orderItem = type;
      }
      else{
        if (CyberIncidentStatusMasterStore.orderItem == type) {
          if(CyberIncidentStatusMasterStore.orderBy == 'asc') CyberIncidentStatusMasterStore.orderBy = 'desc';
          else CyberIncidentStatusMasterStore.orderBy = 'asc'
        }
        else{
          CyberIncidentStatusMasterStore.orderBy = 'asc';
          CyberIncidentStatusMasterStore.orderItem = type;
        }
      }
    }
}
