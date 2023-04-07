import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BpmProcessMapping } from 'src/app/core/models/bpm/process/bpm-process-mapping';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BpmProcessMappingStore } from 'src/app/stores/bpm/process/bpm-process-mapping-store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';

@Injectable({
  providedIn: 'root'
})
export class BpmProcessMappingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getBpmProcessMaping(id) {
    return this._http.get<BpmProcessMapping>('/process/' + id + '/mapping').pipe((
      map((res: BpmProcessMapping) => {
        BpmProcessMappingStore.setBpmProcessMapingDetails(res);
        return res;
      })
    ))
  }

  saveIssueMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    console.log(id)
    return this._http.put('/process/' + ProcessStore.process_id + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_issue');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveComplianceMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/compliance-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteComplianceMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/compliance-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_compliance');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveIncidentMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/incident-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIncidentMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/incident-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_incident');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveMeetingMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/meeting-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteMeetingMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/meeting-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_meeting');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveTrainingMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/training-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteTrainingMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/training-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_training');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveKpiMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/kpi-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteKpiMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/kpi-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_kpi');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveProductMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/product-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }


  deleteProductMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/product-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_product');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveAssetMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/asset-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteAssetMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/asset-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_asset');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveServiceMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/service-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteServiceMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/service-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_service');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }
  saveControlMapping(saveData): Observable<any> {
    return this._http.post('/process/' + ProcessStore.process_id + '/control-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteControlMapping(id) {
    return this._http.put('/process/' + ProcessStore.process_id + '/control-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg_training');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

}
