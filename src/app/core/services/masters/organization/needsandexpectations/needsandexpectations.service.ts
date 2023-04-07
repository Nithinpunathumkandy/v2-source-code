import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NeedsExpectaions, NeedsExpectationsResponse } from "src/app/core/models/masters/organization/needs-expectations";
import { NeedsExpectationsStore } from "src/app/stores/masters/organization/needs-expectations.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class NeedsandexpectationsService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }


  /**
   * Get Needs and Expectations
   * @param params Parametes
   */
  getItems(additionalParams?:string,status: boolean = false): Observable<NeedsExpectationsResponse>{
    let params = '';
    
      params = `?page=${NeedsExpectationsStore.currentPage}`;
      if (NeedsExpectationsStore.orderBy) params += `&order_by=${NeedsExpectationsStore.orderItem}&order=${NeedsExpectationsStore.orderBy}`;

    
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    if(NeedsExpectationsStore.searchText) params += (params ? '&q=' : '?q=')+NeedsExpectationsStore.searchText;
    return this._http.get<NeedsExpectationsResponse>('/need-and-expectations' + (params ? params : '')).pipe(
      map((res: NeedsExpectationsResponse) => {
        NeedsExpectationsStore.setNeedsExpectationsRespose(res);
        return res;
      })
    );
  }

  getNeedsAndExpectationsById(id){
    return NeedsExpectationsStore.getNeedsandExpectationsById(id);
  }

  /**
   * Update Needs and Expectations
   * @param id Needs and Expectations Id
   * @param item Needs and Expectations
   */
  updateItem(id, item: NeedsExpectaions): Observable<any> {
    return this._http.put('/need-and-expectations/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  /**
   * Save Needs and Expectations
   * @param item Needs and Expectation
   * @param setLastInserted Store Last Inserted Value or Not
   */
  saveItem(item: NeedsExpectaions,setLastInserted: boolean = false) {
    return this._http.post('/need-and-expectations', item).pipe(
      map((res: any) => {
        if(setLastInserted) NeedsExpectationsStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/need-and-expectations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            NeedsExpectationsStore.setCurrentPage(resp.current_page-1);
            this.getItems(null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/need-and-expectations/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/need-and-expectations/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/need-and-expectations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('need_and_expectation_template')+'.xlsx');
      }
    )
  }

  exportToExcel() {
    this._http.get('/need-and-expectations/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('need_and_expectations')+'.xlsx');
      }
    )
  }

  shareData(data){
    return this._http.post('/need-and-expectations/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/need-and-expectations/import',formData).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(null,true).subscribe();
        return res;
      })
    )
  }

  sortNeedExpectationlList(type:string, text:string) {
    if (!NeedsExpectationsStore.orderBy) {
      NeedsExpectationsStore.orderBy = 'asc';
      NeedsExpectationsStore.orderItem = type;
    }
    else{
      if (NeedsExpectationsStore.orderItem == type) {
        if(NeedsExpectationsStore.orderBy == 'asc') NeedsExpectationsStore.orderBy = 'desc';
        else NeedsExpectationsStore.orderBy = 'asc'
      }
      else{
        NeedsExpectationsStore.orderBy = 'asc';
        NeedsExpectationsStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(null,true).subscribe();
    // else
    //   this.getItems(`&q=${text}`,true).subscribe();
  }
  

}
