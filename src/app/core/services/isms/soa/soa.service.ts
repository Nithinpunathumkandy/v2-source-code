import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SOA, SOAPaginationResponse } from 'src/app/core/models/isms/soa';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SOAStore } from 'src/app/stores/isms/isms-risks/soa.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class SoaService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<SOAPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${SOAStore.currentPage}`;
      if (SOAStore.orderBy) params += `&order_by=${SOAStore.orderItem}&order=${SOAStore.orderBy}`;
    }
    if(SOAStore.searchText) params += (params ? '&q=' : '?q=')+SOAStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<SOAPaginationResponse>('/soa' + (params ? params : '')).pipe(
      map((res: SOAPaginationResponse) => {
        SOAStore.setSOA(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<SOA[]> {
    return this._http.get<SOA[]>('/soa').pipe((
      map((res:SOA[])=>{
        SOAStore.setAllSOA(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<SOA> {
    return this._http.get<SOA>('/soa/'+id).pipe((
      map((res:SOA)=>{
        SOAStore.setIndividualSOA(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/soa', item).pipe(
      map((res:any )=> {
        SOAStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'soa_added');
       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/soa/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'soa_updated');
        this.getItems(false,null,true).subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  
  updateStatus(id, item): Observable<any> {
    return this._http.put('/soa/' + id+'/update-status', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'soa_status_updated');
        this.getItems(false,null,true).subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  // delete(id: number) {
  //   return this._http.delete('/soa/'+RisksStore.riskId+'/risk-key-risk-indicators/' + id).pipe(
  //     map(res => {
  //       this._utilityService.showSuccessMessage('success', 'key_risk_indicators_deleted');
  //       this.getItems(false,null,true).subscribe(resp=>{
  //         if(resp.from==null){
  //           SOAStore.setCurrentPage(resp.current_page-1);
  //           this.getItems(false,null,true).subscribe();
  //         }
  //       });
  //       return res;
  //     })
  //   );
  // }

 
  exportToExcel() {
    this._http.get('/soa/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('statement_of_applicability')+".xlsx");
      }
    )
  }


}
