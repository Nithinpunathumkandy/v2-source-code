import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContractMapping } from 'src/app/core/models/compliance-management/compliance-mapping/compliance-mapping';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SLAContractMappingStore } from 'src/app/stores/compliance-management/sla-contract-mapping/sla-contract-mapping-store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';

@Injectable({
  providedIn: 'root'
})
export class SlaContractMappingService {

  constructor(
    private _http: HttpClient,
    private _utilityService:UtilityService
  ) { }

  getContractMapping(id) {
    return this._http.get<ContractMapping>('/sla-and-contracts/' + id + '/mapping').pipe((
      map((res: ContractMapping) => {
        SLAContractMappingStore.setSLAContractMappingDetails(res);
        return res;
      })
    ))
  }

  saveIssueMapping(saveData): Observable<any> {
    return this._http.post('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProcessMapping(saveData): Observable<any> {
    return this._http.post('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/process-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveRiskMapping(saveData): Observable<any> {
    return this._http.post('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/risk-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );

  }

  saveAuditFindingMapping(saveData): Observable<any> {
    return this._http.post('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/audit-finding-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_sla_contract_issues_remove_success_message');
        //this.getComplianceMaping(SLAContractStore.sla_contract_id).subscribe();
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/process-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_sla_contract_process_remove_success_message');
        //this.getComplianceMaping(SLAContractStore.sla_contract_id).subscribe();
        return res;
      })
    );
  }

  deleteRiskMapping(id) {
    return this._http.put('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/risk-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_sla_contract_risk_remove_success_message');
        //this.getComplianceMaping(SLAContractStore.sla_contract_id).subscribe();
        return res;
      })
    );
  }

  deleteAuditFindingMapping(id) {
    return this._http.put('/sla-and-contracts/' + SLAContractStore.sla_contract_id + '/audit-finding-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_sla_contract_finding_remove_success_message');
        //this.getComplianceMaping(SLAContractStore.sla_contract_id).subscribe();
        return res;
      })
    );
  }

}

