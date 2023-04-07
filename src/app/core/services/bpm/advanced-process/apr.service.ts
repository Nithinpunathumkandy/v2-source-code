import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { AdvancedProcessDiscovery, ProcessWithActivities } from 'src/app/core/models/bpm/process/advance-process';

@Injectable({
  providedIn: 'root'
})
export class AprService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
  // Save Critical process operation
  saveProcessOperations(item: any) {
    return this._http.post('/process-critical-operations', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'critical_process_operation_saved');
        return res;
      })
    );
  }
  updateProcessOperations(id:number,item: any) {
    return this._http.put('/process-critical-operations/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'critical_process_operation_updated');
        return res;
      })
    );
  }
  saveResourceLevelInformation(item: any) {
    return this._http.post('/resource-level-informations', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'resource_level_information_saved');
        return res;
      })
    );
  }
  updateResourceLevelInformation(id:number,item: any) {
    return this._http.put('/resource-level-informations/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'resource_level_information_updated');
        return res;
      })
    );
  }
  savApplicationTools(item: any) {
    return this._http.post('/process-application-tools', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'application_tools_saved');
        return res;
      })
    );
  }
  updateApplicationTools(id:number,item: any) {
    return this._http.put('/process-application-tools/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'application_tools_updated');
        return res;
      })
    );
  }
// save assets
  saveAssets(item: any) {
    return this._http.post('/process-assets', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Assets saved successfully');
        return res;
      })
    );
  }
  updateAssets(id:number,item: any) {
    return this._http.put('/process-assets/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Assets saved successfully');
        return res;
      })
    );
  }
  // Save Dependencies
  saveDependencies(item: any) {
    return this._http.post('/process-dependencies', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'dependencies_saved');
        return res;
      })
    );
  }
  updateDependencies(id:number,item: any) {
    return this._http.put('/process-dependencies/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'dependencies_updated');
        return res;
      })
    );
  }
  saveVitalRecords(item: any) {
    return this._http.post('/process-vital-records', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'vital_records_saved');
        return res;
      })
    );
  }
  updateVitalRecords(id:number,item: any) {
    return this._http.put('/process-vital-records/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'vital_records_updated');
        return res;
      })
    );
  }
  deleteVital(id: number) {
    return this._http.delete("/process-vital-records/" + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'vital_records_deleted');
        this.getProcessRecoveries().subscribe()
        return res;
      })
    );
  }
  getProcessRecoveries(): Observable<AdvancedProcessDiscovery> {
    let params = "";
    return this._http.get<AdvancedProcessDiscovery>('/advanced-process-recoveries/'+ ProcessStore.process_id)
      .pipe(map((res: AdvancedProcessDiscovery) => {
          AdvanceProcessStore.setProcessDiscovery(res)
          return res;
        })
      );
  }
  getProcessWithActivities(): Observable<ProcessWithActivities[]> {
    let params = "";
    return this._http.get<ProcessWithActivities[]>('/process-with-activities')
      .pipe(map((res: ProcessWithActivities[]) => {
          AdvanceProcessStore.setProcessWithActivities(res)
          return res;
        })
      );
  }

  getAllProcessWithActivities(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<ProcessWithActivities[]> {
    let params = '';
    // if (!getAll) {
    //   params = `?page=${AuditItemTypeMasterStore.currentPage}`;
    //   if (AuditItemTypeMasterStore.orderBy) params += `&order_by=auditable_item_types.title&order=${AuditItemTypeMasterStore.orderBy}`;

    // }

    if (additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    return this._http.get<ProcessWithActivities[]>('/process-with-activities' + (params ? params : '')).pipe(
      map((res: ProcessWithActivities[]) => {

        AdvanceProcessStore.setProcessWithActivities(res);
        return res;
      })
    );
  }
}
