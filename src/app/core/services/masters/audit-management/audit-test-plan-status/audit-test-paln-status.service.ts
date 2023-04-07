import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditTestPlanStatusPaginationResponse, AuditTestPlanStatusSingle } from 'src/app/core/models/masters/audit-management/audit-test-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditTestPlanStatusMasterStore } from 'src/app/stores/masters/audit-management/audit-test-plan-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuditTestPalnStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,status: boolean =  false):Observable<AuditTestPlanStatusPaginationResponse>{
    let params = '';
    if(!getAll){
      params = `?page= ${AuditTestPlanStatusMasterStore.currentPage}`;
      if (AuditTestPlanStatusMasterStore.orderBy) params += `&order_by=${AuditTestPlanStatusMasterStore.orderItem}&order=${AuditTestPlanStatusMasterStore.orderBy}`;
    }
    if(AuditTestPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditTestPlanStatusMasterStore.searchText;
    if(additionalParams)
    params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AuditTestPlanStatusPaginationResponse>('/am-audit-test-plan-statuses' + (params ? params : '')).pipe(
      map((res: AuditTestPlanStatusPaginationResponse) => {
        AuditTestPlanStatusMasterStore.setAuditTestPlanStatus(res);
        return res;
      })
    );
  }

  getItem(id): Observable<AuditTestPlanStatusSingle> {
		return this._http.get<AuditTestPlanStatusSingle>('/am-audit-test-plan-statuses/' + id).pipe(
			map((res: AuditTestPlanStatusSingle) => {
				AuditTestPlanStatusMasterStore.setIndividualAuditTestsPlanStatus(res)
				return res;
			})
		);
	}

  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/am-audit-test-plan-statuses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/am-audit-test-plan-statuses', item).pipe(
      map(res => {
        AuditTestPlanStatusMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  // generateTemplate() {
  //   this._http.get('/am-audit-test-plan-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_test_plan_status_template')+".xlsx");
  //     }
  //   )
  // }

  exportToExcel() {
    this._http.get('/am-audit-test-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_test_plan_status')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/am-audit-test-plan-statuses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  // importData(data){
  //   const formData = new FormData();
  //   formData.append('file',data);
  //   return this._http.post('/am-audit-test-plan-statuses/import',data).pipe(
  //     map((res:any )=> {
  //       this._utilityService.showSuccessMessage('success','import_success');
  //       this.getItems(false, null, true).subscribe();
  //       return res;
  //     })
  //   )
  // }

  activate(id: number) {
    return this._http.put('/am-audit-test-plan-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/am-audit-test-plan-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-test-plan-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            AuditTestPlanStatusMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  
  
  sortAuditStatusesList(type:string, text:string) {
    if (!AuditTestPlanStatusMasterStore.orderBy) {
      AuditTestPlanStatusMasterStore.orderBy = 'asc';
      AuditTestPlanStatusMasterStore.orderItem = type;
    }
    else{
      if (AuditTestPlanStatusMasterStore.orderItem == type) {
        if(AuditTestPlanStatusMasterStore.orderBy == 'asc') AuditTestPlanStatusMasterStore.orderBy = 'desc';
        else AuditTestPlanStatusMasterStore.orderBy = 'asc'
      }
      else{
        AuditTestPlanStatusMasterStore.orderBy = 'asc';
        AuditTestPlanStatusMasterStore.orderItem = type;
      }
    }
  }

}
