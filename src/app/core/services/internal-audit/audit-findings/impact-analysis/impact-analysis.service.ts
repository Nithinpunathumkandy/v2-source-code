import { Injectable } from '@angular/core';

import {ImpactAnalysesStore} from 'src/app/stores/internal-audit/audit-findings/impact-analysis/impact-analysis-store';
import { ImpactAnalysis ,ImpactAnalysisPaginationResponse } from 'src/app/core/models/internal-audit/audit-findings/impact-analysis/impact-analysis';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class ImpactAnalysisService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getItems(id:number , params?: string ): Observable<ImpactAnalysisPaginationResponse>{
      return this._http.get<ImpactAnalysisPaginationResponse>('/findings/'+id+'/impact-analyses').pipe(
        map((res: ImpactAnalysisPaginationResponse) => {
          
          ImpactAnalysesStore.setAllImpactAnalyses(res);
          return res;
        })
      );
    }


    saveItem(findingid: number,id:number,item: any) {
      return this._http.post('/findings/'+id+'/impact-analyses', item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('success', 'add_impact_analysis');
          this.getItems(findingid).subscribe();
          return res;
        })
      );
    }

    generateTemplate(id:number) {
      this._http.get('/findings/'+id+'/impact-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_impact_analysis_template')+".xlsx");     
        }
      )
    }
  
    exportToExcel(id:number) {
      this._http.get('/findings/'+id+'/impact-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_impact_analysis')+".xlsx");     
        }
      )
    }
   

}