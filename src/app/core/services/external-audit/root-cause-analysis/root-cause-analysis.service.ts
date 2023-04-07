import { Injectable } from '@angular/core';

import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/external-audit/root-cause-analysis/root-cause-analysis';
import {RCAMasterStore} from 'src/app/stores/external-audit/root-cause-analysis/root-cause-analysis-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class RootCauseAnalysisService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(id:number,getAll: boolean = false,additionalParams?:string): Observable<RootCauseAnalysisPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RCAMasterStore.currentPage}&status=all`;
        if (RCAMasterStore.orderBy) params += `&order_by=findings.title&order=${RCAMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(RCAMasterStore.searchText) params += (params ? '&q=' : '?q=')+RCAMasterStore.searchText;

      return this._http.get<RootCauseAnalysisPaginationResponse>('/external-audit/findings/'+id+'/root-cause-analyses' + (params ? params : '')).pipe(
        map((res: RootCauseAnalysisPaginationResponse) => {
          RCAMasterStore.setRCA(res);
          return res;
        })
      );
   
    }

    saveItem(id,item: RootCauseAnalysis,whyValue) {
      return this._http.post('/external-audit/findings/'+id+'/root-cause-analyses', item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', `why${whyValue}_created`);
          return res;
        })
      );
    }

    updateItem(findingid: number,id,item: RootCauseAnalysis,whyValue) {      
      return this._http.put('/external-audit/findings/'+findingid+'/root-cause-analyses/'+id, item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', `${whyValue}_updated`);
          return res;
        })
      );
    }

    generateTemplate(id:number) {
      this._http.get('/external-audit/findings/'+id+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_analysis_template')+".xlsx");
        }
      )
    }

    delete(findings_id:number, id: number) {
      return this._http.delete('/external-audit/findings/'+findings_id+'/root-cause-analyses/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'ea_why_delete');
              this.getItems(findings_id).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel(id) {
      this._http.get('/external-audit/findings/'+id+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_analysis')+".xlsx");
        }
      )
    }

    getFindingsRootCauseAnalysis(findingId: number, params?: string){
      return this._http.get<any>('/external-audit/findings/'+findingId+'/root-cause-analyses' + (params ? params : '')).pipe(
        map((res: any) => {
          // RCAMasterStore.setRCA(res);
          //console.log(res);
          return res;
        })
      );
    }

    saveFindingsRootCauseAnalysis(id,item: RootCauseAnalysis){
      return this._http.post<any>('/external-audit/findings/'+id+'/root-cause-analyses',item).pipe(
        map((res: any) => {
          //console.log(res);
          return res;
        })
      );
    }
   

}

