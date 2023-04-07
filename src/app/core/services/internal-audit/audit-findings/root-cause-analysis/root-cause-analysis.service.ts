import { Injectable } from '@angular/core';

import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/internal-audit/audit-findings/root-cause-analysis/root-cause-analysis';
import {RCAStore} from 'src/app/stores/internal-audit/audit-findings/root-cause-analysis/root-cause-analysis-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class RootCauseAnalysisService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getItems(id:number , params?: string ): Observable<RootCauseAnalysisPaginationResponse>{
      return this._http.get<RootCauseAnalysisPaginationResponse>('/findings/'+id+'/root-cause-analyses').pipe(
        map((res: RootCauseAnalysisPaginationResponse) => {
          
          RCAStore.setRCA(res);
          return res;
        })
      );
    }


    saveItem(findingid: number,id:number,item: RootCauseAnalysis) {
      return this._http.post('/findings/'+id+'/root-cause-analyses', item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('success', 'add_rca');
          this.getItems(findingid).subscribe();
          return res;
        })
      );
    }

    updateItem(findingid: number,id:number,item: RootCauseAnalysis) {
      return this._http.put('/findings/'+findingid+'/root-cause-analyses/'+id, item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('success', 'update_rca');
          this.getItems(findingid).subscribe();
          return res;
        })
      );
    }

    delete(findings_id:number, id: number) {
      return this._http.delete('/findings/'+findings_id+'/root-cause-analyses/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_rca');
              this.getItems(findings_id).subscribe();
          return res;
        })
      );
    }


    generateTemplate(id:number) {
      this._http.get('/findings/'+id+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_rca_template')+".xlsx");     

        }
      )
    }
  
    exportToExcel(id:number) {
      this._http.get('/findings/'+id+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_rca')+".xlsx");     
        }
      )
    }
   

}

