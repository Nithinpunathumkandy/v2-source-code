import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { KRI ,KRIPaginationResponse} from 'src/app/core/models/risk-management/key-risk-indicators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KRIStore } from 'src/app/stores/risk-management/risks/kri.store';
import { KRIPaginationResponse,KRI } from 'src/app/core/models/risk-management/risks/key-risk-indicators';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';


@Injectable({
  providedIn: 'root'
})
export class KriService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KRIPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KRIStore.currentPage}`;
      if (KRIStore.orderBy) params += `&order_by=key_risk_indicators.title&order=${KRIStore.orderBy}`;
    }
    if(KRIStore.searchText) params += (params ? '&q=' : '?q=')+KRIStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<KRIPaginationResponse>('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators' + (params ? params : '')).pipe(
      map((res: KRIPaginationResponse) => {
        KRIStore.setKRI(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<KRI[]> {
    return this._http.get<KRI[]>('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators').pipe((
      map((res:KRI[])=>{
        KRIStore.setAllKRI(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<KRI> {
    return this._http.get<KRI>('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/'+id).pipe((
      map((res:KRI)=>{
        KRIStore.setIndividualKRI(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators', item).pipe(
      map((res:any )=> {
        KRIStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_added');
       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            KRIStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/risks/'+RisksStore.riskId+'/risk-key-risk-indicators/import',formData).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','key_risk_indicators_imported');
        return res;
      })
    )
  }

  sortKRIList(type:string) {
    if (!KRIStore.orderBy) {
      KRIStore.orderBy = 'desc';
      KRIStore.orderItem = type;
    }
    else{
      if (KRIStore.orderItem == type) {
        if(KRIStore.orderBy == 'desc') KRIStore.orderBy = 'asc';
        else KRIStore.orderBy = 'desc'
      }
      else{
        KRIStore.orderBy = 'desc';
        KRIStore.orderItem = type;
      }
    }
}

}
