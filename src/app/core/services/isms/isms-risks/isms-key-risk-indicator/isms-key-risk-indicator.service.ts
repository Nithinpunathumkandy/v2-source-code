import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { KRI ,KRIPaginationResponse} from 'src/app/core/models/risk-management/key-risk-indicators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { IsmsKRIStore } from 'src/app/stores/risk-management/isms-risks/kri.store';
import { KRIPaginationResponse,KRI } from 'src/app/core/models/risk-management/risks/key-risk-indicators';
import { IsmsKRIStore } from 'src/app/stores/isms/isms-risks/isms-kri.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/isms-risks/isms-risks.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsKeyRiskIndicatorService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KRIPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsKRIStore.currentPage}`;
      if (IsmsKRIStore.orderBy) params += `&order_by=key_risk_indicators.title&order=${IsmsKRIStore.orderBy}`;
    }
    if(IsmsKRIStore.searchText) params += (params ? '&q=' : '?q=')+IsmsKRIStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<KRIPaginationResponse>('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators' + (params ? params : '')).pipe(
      map((res: KRIPaginationResponse) => {
        IsmsKRIStore.setKRI(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<KRI[]> {
    return this._http.get<KRI[]>('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators').pipe((
      map((res:KRI[])=>{
        IsmsKRIStore.setAllKRI(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<KRI> {
    return this._http.get<KRI>('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/'+id).pipe((
      map((res:KRI)=>{
        IsmsKRIStore.setIndividualKRI(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators', item).pipe(
      map((res:any )=> {
        IsmsKRIStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_added');
       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IsmsKRIStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/isms-risks/'+IsmsRisksStore.riskId+'/risk-key-risk-indicators/import',formData).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','key_risk_indicators_imported');
        return res;
      })
    )
  }

  sortKRIList(type:string) {
    if (!IsmsKRIStore.orderBy) {
      IsmsKRIStore.orderBy = 'desc';
      IsmsKRIStore.orderItem = type;
    }
    else{
      if (IsmsKRIStore.orderItem == type) {
        if(IsmsKRIStore.orderBy == 'desc') IsmsKRIStore.orderBy = 'asc';
        else IsmsKRIStore.orderBy = 'desc'
      }
      else{
        IsmsKRIStore.orderBy = 'desc';
        IsmsKRIStore.orderItem = type;
      }
    }
}
}
