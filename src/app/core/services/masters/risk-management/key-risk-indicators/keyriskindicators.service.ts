import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { KeyRisk , KeyRiskPaginationResponse} from 'src/app/core/models/masters/risk-management/key-risk-indicators';
import{KeyRiskIndicatorsMasterStore} from 'src/app/stores/masters/risk-management/key-risk-indicators-master-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KeyriskindicatorsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KeyRiskPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KeyRiskIndicatorsMasterStore.currentPage}`;
      if (KeyRiskIndicatorsMasterStore.orderBy) params += `&order_by=${KeyRiskIndicatorsMasterStore.orderItem}&order=${KeyRiskIndicatorsMasterStore.orderBy}`;
    }
    if(KeyRiskIndicatorsMasterStore.searchText) params += (params ? '&q=' : '?q=')+KeyRiskIndicatorsMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<KeyRiskPaginationResponse>('/key-risk-indicators' + (params ? params : '')).pipe(
      map((res: KeyRiskPaginationResponse) => {
        KeyRiskIndicatorsMasterStore.setKeyRisk(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<KeyRisk[]> {
    return this._http.get<KeyRisk[]>('/key-risk-indicators').pipe((
      map((res:KeyRisk[])=>{
        KeyRiskIndicatorsMasterStore.setAllKeyRisk(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<KeyRisk> {
    return this._http.get<KeyRisk>('/key-risk-indicators/'+id).pipe((
      map((res:KeyRisk)=>{
        KeyRiskIndicatorsMasterStore.setIndividualKeyRisk(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/key-risk-indicators', item).pipe(
      map((res:any )=> {
        KeyRiskIndicatorsMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_added');
       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/key-risk-indicators/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/key-risk-indicators/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            KeyRiskIndicatorsMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/key-risk-indicators/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/key-risk-indicators/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/key-risk-indicators/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/key-risk-indicators/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('key_risk_indicators_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/key-risk-indicators/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/key-risk-indicators/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','key_risk_indicators_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortKRIList(type:string, text:string) {
    if (!KeyRiskIndicatorsMasterStore.orderBy) {
      KeyRiskIndicatorsMasterStore.orderBy = 'asc';
      KeyRiskIndicatorsMasterStore.orderItem = type;
    }
    else{
      if (KeyRiskIndicatorsMasterStore.orderItem == type) {
        if(KeyRiskIndicatorsMasterStore.orderBy == 'asc') KeyRiskIndicatorsMasterStore.orderBy = 'desc';
        else KeyRiskIndicatorsMasterStore.orderBy = 'asc'
      }
      else{
        KeyRiskIndicatorsMasterStore.orderBy = 'asc';
        KeyRiskIndicatorsMasterStore.orderItem = type;
      }
    }
}

}
