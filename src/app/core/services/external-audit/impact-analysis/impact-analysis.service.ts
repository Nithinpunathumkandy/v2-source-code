import { Injectable } from '@angular/core';

import { ImpactAnalysis , ImpactAnalysisPaginationResponse } from 'src/app/core/models/external-audit/impact-analysis/impact-analysis';
import {ImpactAnalysesMasterStore} from 'src/app/stores/external-audit/impact-analysis/impact-analysis-store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
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
          
          ImpactAnalysesMasterStore.setAllImpactAnalyses(res);
          return res;
        })
      );
    }


    saveItem(id: number, item: any) {
     
      return this._http.post('/external-audit/findings/'+id+'/impact-analyses', item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', 'ea_impact_analysis_added');
          return res;
        })
      );
    }

    generateTemplate(id:number) {
      this._http.get('/external-audit/findings/'+id+'/impact-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis_template')+".xlsx");
        }
      )
    }
  
    exportToExcel(id:number) {
      this._http.get('/external-audit/findings/'+id+'/impact-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis')+".xlsx");
        }
      )
    }
   
}

