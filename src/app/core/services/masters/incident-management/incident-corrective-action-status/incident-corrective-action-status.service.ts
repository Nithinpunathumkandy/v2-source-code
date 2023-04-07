import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/incident-management/incident-corrective-action-status-store';
import { IncidentCorrectiveActionStatus, IncidentCorrectiveActionStatusPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-corrective-action-status';

@Injectable({
  providedIn: 'root'
})
export class IncidentCorrectiveActionStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Incident Corrective avtio Status List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IncidentCorrectiveActionStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IncidentCorrectiveActionStatusMasterStore.currentPage}`;
        if (IncidentCorrectiveActionStatusMasterStore.orderBy) params += `&order_by=${IncidentCorrectiveActionStatusMasterStore.orderItem}&order=${IncidentCorrectiveActionStatusMasterStore.orderBy}`;
      }
      if(IncidentCorrectiveActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentCorrectiveActionStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<IncidentCorrectiveActionStatusPaginationResponse>('/incident-corrective-action-statuses' + (params ? params : '')).pipe(
        map((res: IncidentCorrectiveActionStatusPaginationResponse) => {
          IncidentCorrectiveActionStatusMasterStore.setIncidentCorrectiveActionStatus(res);
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting All Incident Corrective avtio Status List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    getAllItems(): Observable<IncidentCorrectiveActionStatus[]> {
      return this._http.get<IncidentCorrectiveActionStatus[]>('/incident-corrective-action-statuses').pipe((
        map((res:IncidentCorrectiveActionStatus[])=>{
          IncidentCorrectiveActionStatusMasterStore.setAllIncidentCorrectiveActionStatus(res);
          return res;
        })
      ))
    }

   /**
   * @description
   * This method is used for activate the Incident Corrective Ctive Status
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    activate(id: number) {
      return this._http.put('/incident-corrective-action-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_corrective_action_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
   /**
   * @description
   * This method is used for deactivate the Incident Corrective Ctive Status
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    deactivate(id: number) {
      return this._http.put('/incident-corrective-action-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_corrective_action_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

   /**
   * @description
   * this method is used for export Incident Corrective Ctive Status data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    exportToExcel() {
      this._http.get('/incident-corrective-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_corrective_action_status')
          +".xlsx");
        }
      )
    }

    /**
   * @description
   * this method is used for share Incident Corrective Ctive Status data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof IncidentCorrectiveActionStatusService
   */
    shareData(data){
      return this._http.post('/incident-corrective-action-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','common_share_toast');
          return res;
        })
      )
    }

    sortIncidentCorrectiveActionStatusList(type:string, text:string) {
      if (!IncidentCorrectiveActionStatusMasterStore.orderBy) {
        IncidentCorrectiveActionStatusMasterStore.orderBy = 'asc';
        IncidentCorrectiveActionStatusMasterStore.orderItem = type;
      }
      else{
        if (IncidentCorrectiveActionStatusMasterStore.orderItem == type) {
          if(IncidentCorrectiveActionStatusMasterStore.orderBy == 'asc') IncidentCorrectiveActionStatusMasterStore.orderBy = 'desc';
          else IncidentCorrectiveActionStatusMasterStore.orderBy = 'asc'
        }
        else{
          IncidentCorrectiveActionStatusMasterStore.orderBy = 'asc';
          IncidentCorrectiveActionStatusMasterStore.orderItem = type;
        }
      }
    }
}
