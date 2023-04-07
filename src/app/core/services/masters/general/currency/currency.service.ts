import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency,CurrencyPaginationResponse } from 'src/app/core/models/masters/general/currency';
import { CurrencyMasterStore } from 'src/app/stores/masters/general/currency-store';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService) { }
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<CurrencyPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CurrencyMasterStore.currentPage}`;
      if (CurrencyMasterStore.orderBy) params += `&order_by=currencies.title&order=${CurrencyMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(CurrencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+CurrencyMasterStore.searchText;
    return this._http.get<CurrencyPaginationResponse>('/currencies' + (params ? params : '')).pipe(
      map((res: CurrencyPaginationResponse) => {
        CurrencyMasterStore.setCurrency(res);
        return res;
      })
    );
 
  }
  getItem(id): Observable<Currency> {
    return this._http.get<Currency>('/currencies/'+id).pipe((
      map((res:Currency)=>{
        CurrencyMasterStore.setIndividualCurrency(res);
        return res;
      })
    ))
  }
  saveItem(item: Currency) {
    return this._http.post('/currencies', item).pipe(
      map((res:any )=> {
        CurrencyMasterStore.setLastInsertedId(res.id);

        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: Currency): Observable<any> {
    return this._http.put('/currencies/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/currencies/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            CurrencyMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/currencies/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/currencies/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/currencies/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('currency_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/currencies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('currency')+".xlsx");
      }
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/currencies/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        return res;
      })
    )
  }

  sortCurrencyList(type:string, text:string) {
    if (!CurrencyMasterStore.orderBy) {
      CurrencyMasterStore.orderBy = 'desc';
      // CurrencyMasterStore.orderItem = type;
    }
    // else{
    //   if (CurrencyMasterStore.orderItem == type) {
    //     if(CurrencyMasterStore.orderBy == 'desc') CurrencyMasterStore.orderBy = 'asc';
    //     else CurrencyMasterStore.orderBy = 'desc'
    //   }
    //   else{
    //     CurrencyMasterStore.orderBy = 'desc';
    //     CurrencyMasterStore.orderItem = type;
    //   }
    // }


  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
