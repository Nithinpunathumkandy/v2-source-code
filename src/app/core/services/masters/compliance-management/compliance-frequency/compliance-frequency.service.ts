import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceFrequency, ComplianceFrequencyPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-frequency';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceFrequencyMasterStore } from 'src/app/stores/masters/compliance-management/compliance-frequency-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceFrequencyService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ComplianceFrequencyPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceFrequencyMasterStore.currentPage}`;
      if (ComplianceFrequencyMasterStore.orderBy) params += `&order_by=${ComplianceFrequencyMasterStore.orderItem}&order=${ComplianceFrequencyMasterStore.orderBy}`;
    }
    if(ComplianceFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceFrequencyMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ComplianceFrequencyPaginationResponse>('/compliance-frequencies' + (params ? params : '')).pipe(
      map((res: ComplianceFrequencyPaginationResponse) => {
        ComplianceFrequencyMasterStore.setComplianceFrequency(res);
        return res;
      })
    );
  }

  // saveItem(item: ComplianceFrequency) {
  //   return this._http.post('/compliance-frequencies', item).pipe(
  //     map(res => {
  //       this._utilityService.showSuccessMessage('success','compliance_frequency_added');
  //       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
  //       else this.getItems().subscribe();
  //       return res;
  //     })
  //   );
  // }




  activate(id: number) {
    return this._http.put('/compliance-frequencies/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-frequencies/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/compliance-frequencies/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_frequency_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_frequency')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/compliance-frequencies/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-frequencies/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  searchComplianceFrequency(params){
    return this.getItems(params ? params : '').pipe(
      map((res: ComplianceFrequencyPaginationResponse) => {
        ComplianceFrequencyMasterStore.setComplianceFrequency(res);
        return res;
      })
    );
  }

  sortComplianceFrequencyList(type:string, text:string) {
    if (!ComplianceFrequencyMasterStore.orderBy) {
      ComplianceFrequencyMasterStore.orderBy = 'asc';
      ComplianceFrequencyMasterStore.orderItem = type;
    }
    else{
      if (ComplianceFrequencyMasterStore.orderItem == type) {
        if(ComplianceFrequencyMasterStore.orderBy == 'asc') ComplianceFrequencyMasterStore.orderBy = 'desc';
        else ComplianceFrequencyMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceFrequencyMasterStore.orderBy = 'asc';
        ComplianceFrequencyMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
