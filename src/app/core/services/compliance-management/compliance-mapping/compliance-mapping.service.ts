import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceMapping } from 'src/app/core/models/compliance-management/compliance-mapping/compliance-mapping';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceMappingStore } from 'src/app/stores/compliance-management/compliance-mapping/compliance-mapping-store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';

@Injectable({
  providedIn: 'root'
})
export class ComplianceMappingService {

  constructor(
    private _http: HttpClient,
    private _utilityService:UtilityService
  ) { }

  getComplianceMaping(id) {
    return this._http.get<ComplianceMapping>('/compliance-registers/' + id + '/mapping').pipe((
      map((res: ComplianceMapping) => {
        ComplianceMappingStore.setComplianceMappingDetails(res);
        return res;
      })
    ))
  }

  saveIssueMapping(saveData): Observable<any> {
    return this._http.post('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProcessMapping(saveData): Observable<any> {
    return this._http.post('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/process-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveRiskMapping(saveData): Observable<any> {
    return this._http.post('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/risk-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );

  }

  saveAuditFindingMapping(saveData): Observable<any> {
    return this._http.post('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/audit-finding-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_compliance_issues_remove_success_message');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/process-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'compliance_process_remove_success_message');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  deleteRiskMapping(id) {
    return this._http.put('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/risk-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_compliance_risk_remove_success_message');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

  deleteAuditFindingMapping(id) {
    return this._http.put('/compliance-registers/' + ComplianceRegisterStore.complianceRegisterId + '/audit-finding-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'compliance_finding_remove_success_message');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }

}
