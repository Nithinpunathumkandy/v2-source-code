import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelfAssessmentStatus,SelfAssessmentStatusPaginationResponse } from 'src/app/core/models/masters/audit-management/am-audit-control-self-assessment-update-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SelfAssessmentStatusMasterStore } from 'src/app/stores/masters/audit-management/am-audit-control-self-assessment-update-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditControlSelfAssessmentUpdateStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<SelfAssessmentStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${SelfAssessmentStatusMasterStore.currentPage}`;
        if (SelfAssessmentStatusMasterStore.orderBy) params += `&order_by=${SelfAssessmentStatusMasterStore.orderItem}&order=${SelfAssessmentStatusMasterStore.orderBy}`;
      }
      if(SelfAssessmentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+SelfAssessmentStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<SelfAssessmentStatusPaginationResponse>('/am-audit-control-self-assessment-update-statuses' + (params ? params : '')).pipe(
        map((res: SelfAssessmentStatusPaginationResponse) => {
          SelfAssessmentStatusMasterStore.setSelfAssessmentStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<SelfAssessmentStatus> {
      return this._http.get<SelfAssessmentStatus>('/am-audit-control-self-assessment-update-statuses/' + id).pipe(
        map((res: SelfAssessmentStatus) => {
          SelfAssessmentStatusMasterStore.updateSelfAssessmentStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/am-audit-control-self-assessment-update-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/am-audit-control-self-assessment-update-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/am-audit-control-self-assessment-update-statuses', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_control_self_assessment_status') + ".xlsx");
        }
      )
    }


    sortSelfAssessmentStatusList(type:string, text:string) {
      if (!SelfAssessmentStatusMasterStore.orderBy) {
        SelfAssessmentStatusMasterStore.orderBy = 'asc';
        SelfAssessmentStatusMasterStore.orderItem = type;
      }
      else{
        if (SelfAssessmentStatusMasterStore.orderItem == type) {
          if(SelfAssessmentStatusMasterStore.orderBy == 'asc') SelfAssessmentStatusMasterStore.orderBy = 'desc';
          else SelfAssessmentStatusMasterStore.orderBy = 'asc'
        }
        else{
          SelfAssessmentStatusMasterStore.orderBy = 'asc';
          SelfAssessmentStatusMasterStore.orderItem = type;
        }
      }
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/am-audit-control-self-assessment-update-statuses/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
}
