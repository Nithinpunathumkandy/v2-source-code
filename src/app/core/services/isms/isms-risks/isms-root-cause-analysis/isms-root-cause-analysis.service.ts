import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
import { IsmsRCAStore } from 'src/app/stores/isms/isms-risks/isms-rca-risk.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
// import {RCAStore} from 'src/app/stores/risk-management/risks/rca-risk.store';
// import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRootCauseAnalysisService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getItems(id:number , params?: string ): Observable<RootCauseAnalysisPaginationResponse>{
    return this._http.get<RootCauseAnalysisPaginationResponse>('/isms-risks/'+id+'/root-cause-analyses').pipe(
      map((res: RootCauseAnalysisPaginationResponse) => {
        
        IsmsRCAStore.setRCA(res);
        return res;
      })
    );
  } 


  saveItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/root-cause-analyses', item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'add_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  updateItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/root-cause-analyses/'+id, item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'update_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  delete(findings_id:number, id: number) {
    return this._http.delete('/isms-risks/'+IsmsRisksStore.riskId+'/root-cause-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_rca');
            this.getItems(findings_id).subscribe();
        return res;
      })
    );
  }


  generateTemplate(id:number) {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RCATemplate.xlsx");
      }
    )
  }

  exportToExcel(id:number) {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RCA.xlsx");
      }
    )
  }

}
