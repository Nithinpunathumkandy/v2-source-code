import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { ImpactAnalysis ,ImpactAnalysisPaginationResponse} from 'src/app/core/models/risk-management/key-risk-indicators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImpactAnalysisStore } from 'src/app/stores/risk-management/risks/impact-analysis.store';
import { ImpactAnalysisPaginationResponse,ImpactAnalysis } from 'src/app/core/models/risk-management/risks/impact-analysis';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Injectable({
  providedIn: 'root'
})
export class ImpactAnalysisService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ImpactAnalysisPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImpactAnalysisStore.currentPage}`;
      if (ImpactAnalysisStore.orderBy) params += `&order_by=impact_analysis.title&order=${ImpactAnalysisStore.orderBy}`;
    }
    if(ImpactAnalysisStore.searchText) params += (params ? '&q=' : '?q=')+ImpactAnalysisStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ImpactAnalysisPaginationResponse>('/risks/'+RisksStore.riskId+'/impact-analyses' + (params ? params : '')).pipe(
      map((res: ImpactAnalysisPaginationResponse) => {
        ImpactAnalysisStore.setImpactAnalysis(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<ImpactAnalysis> {
    let params='';
    if(ImpactAnalysisStore.searchText) params += (params ? '&q=' : '?q=')+ImpactAnalysisStore.searchText;
    return this._http.get<ImpactAnalysis>('/risks/'+RisksStore.riskId+'/impact-analyses'+(params?params:'')).pipe((
      map((res:ImpactAnalysis)=>{
        ImpactAnalysisStore.setAllImpactAnalysis(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<ImpactAnalysis> {
    return this._http.get<ImpactAnalysis>('/risks/'+RisksStore.riskId+'/impact-analyses/'+id).pipe((
      map((res:ImpactAnalysis)=>{
        ImpactAnalysisStore.setIndividualImpactAnalysis(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/risks/'+RisksStore.riskId+'/impact-analyses', item).pipe(
      map((res:any )=> {
        ImpactAnalysisStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'impact_analysis_added');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/risks/'+RisksStore.riskId+'/impact-analyses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_updated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/risks/'+RisksStore.riskId+'/impact-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deleted');
        this.getAllItems().subscribe(resp=>{
          // if(resp.from==null){
            // ImpactAnalysisStore.setCurrentPage(resp.current_page-1);
            // this.getItems(false,null,true).subscribe();
          // }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/risks/'+RisksStore.riskId+'/impact-analyses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/risks/'+RisksStore.riskId+'/impact-analyses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/risks/'+RisksStore.riskId+'/impact-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/risks/'+RisksStore.riskId+'/impact-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/risks/'+RisksStore.riskId+'/impact-analyses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/risks/'+RisksStore.riskId+'/impact-analyses/import',formData).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','impact_analysis_imported');
        return res;
      })
    )
  }

  sortImpactAnalysisList(type:string) {
    if (!ImpactAnalysisStore.orderBy) {
      ImpactAnalysisStore.orderBy = 'desc';
      ImpactAnalysisStore.orderItem = type;
    }
    else{
      if (ImpactAnalysisStore.orderItem == type) {
        if(ImpactAnalysisStore.orderBy == 'desc') ImpactAnalysisStore.orderBy = 'asc';
        else ImpactAnalysisStore.orderBy = 'desc'
      }
      else{
        ImpactAnalysisStore.orderBy = 'desc';
        ImpactAnalysisStore.orderItem = type;
      }
    }
}
}
