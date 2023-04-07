import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceStatusPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceStatusMasterStore } from 'src/app/stores/masters/compliance-management/compliance-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceStatusService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<ComplianceStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceStatusMasterStore.currentPage}`;
      if (ComplianceStatusMasterStore.orderBy) params += `&order_by=${ComplianceStatusMasterStore.orderItem}&order=${ComplianceStatusMasterStore.orderBy}`;
      if(ComplianceStatusMasterStore.searchTerm) params += `&q=${ComplianceStatusMasterStore.searchTerm}`;
    }
    if(status) params += (params ? '&' : '?')+'status=all';
    if(additionalParams) params += additionalParams;
    return this._http.get<ComplianceStatusPaginationResponse>('/compliance-statuses' + (params ? params : '')).pipe(
      map((res: ComplianceStatusPaginationResponse) => {
        
        ComplianceStatusMasterStore.setComplianceStatus(res);
        return res;
      })
    );
 
  }
  saveItem(item: any) {
    return this._http.post('/compliance-statuses', item).pipe(
      map((res:any )=> {
      
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/compliance-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ComplianceStatusMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/compliance-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/compliance-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_status_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_status')+".xlsx");
      }
    )
  }

  // shareData(data){
  //   return this._http.post('/compliance-statuses/share',data).pipe(
  //     map((res:any )=> {
  //       this._utilityService.showSuccessMessage('success','compliance_status_shared');
  //       return res;
  //     })
  //   )
  // }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-statuses/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  searchComplianceStatus(params){
    return this.getItems(params ? params : '').pipe(
      map((res: ComplianceStatusPaginationResponse) => {
        ComplianceStatusMasterStore.setComplianceStatus(res);
        return res;
      })
    );
  }

  sortStatusList(type:string, text:string) {
    if (!ComplianceStatusMasterStore.orderBy) {
      ComplianceStatusMasterStore.orderBy = 'asc';
      ComplianceStatusMasterStore.orderItem = type;
    }
    else{
      if (ComplianceStatusMasterStore.orderItem == type) {
        if(ComplianceStatusMasterStore.orderBy == 'asc') ComplianceStatusMasterStore.orderBy = 'desc';
        else ComplianceStatusMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceStatusMasterStore.orderBy = 'asc';
        ComplianceStatusMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
