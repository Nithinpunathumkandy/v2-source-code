import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
import { AmFindingRCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-rca.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
// import {AmFindingRCAStore} from 'src/app/stores/risk-management/am-audit-findings/am-finding-rca.store';
// import { AmAuditFindingStore } from 'src/app/stores/risk-management/am-audit-findings/risks.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditFindingRcaService {

 
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(id:number , params?: string ): Observable<RootCauseAnalysisPaginationResponse>{
    return this._http.get<RootCauseAnalysisPaginationResponse>('/am-audit-findings/'+id+'/root-cause-analyses').pipe(
      map((res: RootCauseAnalysisPaginationResponse) => {
        
        AmFindingRCAStore.setRCA(res);
        return res;
      })
    );
  } 


  saveItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.post('/am-audit-findings/'+AmAuditFindingStore.auditFindingId+'/root-cause-analyses', item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'add_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  updateItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.put('/am-audit-findings/'+AmAuditFindingStore.auditFindingId+'/root-cause-analyses/'+id, item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'update_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  delete(findings_id:number, id: number) {
    return this._http.delete('/am-audit-findings/'+AmAuditFindingStore.auditFindingId+'/root-cause-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_rca');
            this.getItems(findings_id).subscribe();
        return res;
      })
    );
  }


  generateTemplate(id:number) {
    this._http.get('/am-audit-findings/'+AmAuditFindingStore.auditFindingId+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_finding_rca_template')+".xlsx");     
      }
    )
  }

  exportToExcel(id:number) {
    this._http.get('/am-audit-findings/'+AmAuditFindingStore.auditFindingId+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_finding_rca')+".xlsx");     
      }
    )
  }
}
