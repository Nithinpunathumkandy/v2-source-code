import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
import {RCAStore} from 'src/app/stores/risk-management/risks/rca-risk.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Injectable({
  providedIn: 'root'
})
export class RootCauseAnalysesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getItems(id:number , params?: string ): Observable<RootCauseAnalysisPaginationResponse>{
    return this._http.get<RootCauseAnalysisPaginationResponse>('/risks/'+id+'/root-cause-analyses').pipe(
      map((res: RootCauseAnalysisPaginationResponse) => {
        
        RCAStore.setRCA(res);
        return res;
      })
    );
  } 


  saveItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.post('/risks/'+RisksStore.riskId+'/root-cause-analyses', item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'add_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  updateItem(findingid: number,id:number,item: RootCauseAnalysis) {
    return this._http.put('/risks/'+RisksStore.riskId+'/root-cause-analyses/'+id, item).pipe(
      map((res:any )=> {

        this._utilityService.showSuccessMessage('success', 'update_rca');
        this.getItems(findingid).subscribe();
        return res;
      })
    );
  }

  delete(findings_id:number, id: number) {
    return this._http.delete('/risks/'+RisksStore.riskId+'/root-cause-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_rca');
            this.getItems(findings_id).subscribe();
        return res;
      })
    );
  }


  generateTemplate(id:number) {
    this._http.get('/risks/'+RisksStore.riskId+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RCATemplate.xlsx");
      }
    )
  }

  exportToExcel(id:number) {
    this._http.get('/risks/'+RisksStore.riskId+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RCA.xlsx");
      }
    )
  }

}
