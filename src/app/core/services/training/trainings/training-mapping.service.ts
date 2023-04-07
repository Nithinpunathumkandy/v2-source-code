import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrainingMapping } from 'src/app/core/models/training/trainings/training-mapping';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrainingMappingStore } from 'src/app/stores/training/trainings/training-mapping';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

@Injectable({
  providedIn: 'root'
})
export class TrainingMappingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getTrainingMaping(id) {
    return this._http.get<TrainingMapping>('/trainings/' + id + '/mapping').pipe((
      map((res: TrainingMapping) => {
        TrainingMappingStore.setTrainingMappingDetails(res);
        return res;
      })
    ))
  }

  saveIssueMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    console.log(id)
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_issue');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveComplianceMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/compliance-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteComplianceMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/compliance-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_compliance');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveIncidentMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/incident-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIncidentMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/incident-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_incident');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveMeetingMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/meeting-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteMeetingMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/meeting-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_meeting');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveProductMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/product-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }


  deleteProductMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/product-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_product');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveAssetMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/asset-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteAssetMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/asset-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_asset');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  saveServiceMapping(saveData): Observable<any> {
    return this._http.post('/trainings/' + TrainingsStore.training_id + '/service-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteServiceMapping(id) {
    return this._http.put('/trainings/' + TrainingsStore.training_id + '/service-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'training_mapping_delete_msg_service');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }


}
