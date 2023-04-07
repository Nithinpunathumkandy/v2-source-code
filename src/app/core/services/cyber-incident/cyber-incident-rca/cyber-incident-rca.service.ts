import { Injectable } from '@angular/core';

import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/external-audit/root-cause-analysis/root-cause-analysis';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { CyberIncidentRCAStore } from 'src/app/stores/cyber-incident/cyber-incident-rca-store';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentRcaService {
  CyberIncidentRCAStore=CyberIncidentRCAStore
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(id:number,getAll: boolean = false,additionalParams?:string): Observable<RootCauseAnalysisPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${CyberIncidentRCAStore.currentPage}&status=all`;
        if (CyberIncidentRCAStore.orderBy) params += `&order_by=findings.title&order=${CyberIncidentRCAStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(CyberIncidentRCAStore.searchText) params += (params ? '&q=' : '?q=')+CyberIncidentRCAStore.searchText;

      return this._http.get<RootCauseAnalysisPaginationResponse>('/cyber-incident/cyber-incidents/'+id+'/root-cause-analyses' + (params ? params : '')).pipe(
        map((res: RootCauseAnalysisPaginationResponse) => {
          CyberIncidentRCAStore.setRCA(res);
          return res;
        })
      );
   
    }

    saveItem(id,item: RootCauseAnalysis,whyValue) {
      return this._http.post('/cyber-incident/cyber-incidents/'+id+'/root-cause-analyses', item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', `why${whyValue}_created`);
          return res;
        })
      );
    }

    updateItem(findingid: number,id,item: RootCauseAnalysis,whyValue) {      
      return this._http.put('/cyber-incident/cyber-incidents/'+findingid+'/root-cause-analyses/'+id, item).pipe(
        map((res:any )=> {
 
          this._utilityService.showSuccessMessage('Success!', `${whyValue}_updated`);
          return res;
        })
      );
    }

    generateTemplate(id:number) {
      this._http.get('/cyber-incident/cyber-incidents/'+id+'/root-cause-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_analysis_template')+".xlsx");
        }
      )
    }

    delete(findings_id:number, id: number) {
      return this._http.delete('/cyber-incident/cyber-incidents/'+findings_id+'/root-cause-analyses/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'ea_why_delete');
              this.getItems(findings_id).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel(id) {
      this._http.get('/cyber-incident/cyber-incidents/'+id+'/root-cause-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_analysis')+".xlsx");
        }
      )
    }

    getFindingsRootCauseAnalysis(findingId: number, params?: string){
      return this._http.get<any>('/cyber-incident/cyber-incidents/'+findingId+'/root-cause-analyses' + (params ? params : '')).pipe(
        map((res: any) => {
          // RCAMasterStore.setRCA(res);
          
          return res;
        })
      );
    }

    saveFindingsRootCauseAnalysis(id,item: RootCauseAnalysis){
      return this._http.post<any>('/cyber-incident/cyber-incidents/'+id+'/root-cause-analyses',item).pipe(
        map((res: any) => {
          
          return res;
        })
      );
    }
}
