import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { ImpactAnalysis ,ImpactAnalysisPaginationResponse} from 'src/app/core/models/risk-management/key-risk-indicators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { IsmsImpactAnalysisStore } from 'src/app/stores/risk-management/isms-risks/impact-analysis.store';
import { ImpactAnalysisPaginationResponse,ImpactAnalysis } from 'src/app/core/models/risk-management/risks/impact-analysis';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsImpactAnalysisStore } from 'src/app/stores/isms/isms-risks/isms-impact-analysis.store';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/isms-risks/isms-risks.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsImpactAnalysisService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ImpactAnalysisPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsImpactAnalysisStore.currentPage}`;
      if (IsmsImpactAnalysisStore.orderBy) params += `&order_by=impact_analysis.title&order=${IsmsImpactAnalysisStore.orderBy}`;
    }
    if(IsmsImpactAnalysisStore.searchText) params += (params ? '&q=' : '?q=')+IsmsImpactAnalysisStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ImpactAnalysisPaginationResponse>('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses' + (params ? params : '')).pipe(
      map((res: ImpactAnalysisPaginationResponse) => {
        IsmsImpactAnalysisStore.setImpactAnalysis(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<ImpactAnalysis> {
    let params='';
    if(IsmsImpactAnalysisStore.searchText) params += (params ? '&q=' : '?q=')+IsmsImpactAnalysisStore.searchText;
    return this._http.get<ImpactAnalysis>('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses'+(params?params:'')).pipe((
      map((res:ImpactAnalysis)=>{
        IsmsImpactAnalysisStore.setAllImpactAnalysis(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<ImpactAnalysis> {
    return this._http.get<ImpactAnalysis>('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/'+id).pipe((
      map((res:ImpactAnalysis)=>{
        IsmsImpactAnalysisStore.setIndividualImpactAnalysis(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses', item).pipe(
      map((res:any )=> {
        IsmsImpactAnalysisStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'impact_analysis_added');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_updated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deleted');
        this.getAllItems().subscribe(resp=>{
          // if(resp.from==null){
            // IsmsImpactAnalysisStore.setCurrentPage(resp.current_page-1);
            // this.getItems(false,null,true).subscribe();
          // }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/impact-analyses/import',formData).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','impact_analysis_imported');
        return res;
      })
    )
  }

  sortImpactAnalysisList(type:string) {
    if (!IsmsImpactAnalysisStore.orderBy) {
      IsmsImpactAnalysisStore.orderBy = 'desc';
      IsmsImpactAnalysisStore.orderItem = type;
    }
    else{
      if (IsmsImpactAnalysisStore.orderItem == type) {
        if(IsmsImpactAnalysisStore.orderBy == 'desc') IsmsImpactAnalysisStore.orderBy = 'asc';
        else IsmsImpactAnalysisStore.orderBy = 'desc'
      }
      else{
        IsmsImpactAnalysisStore.orderBy = 'desc';
        IsmsImpactAnalysisStore.orderItem = type;
      }
    }
}
}
