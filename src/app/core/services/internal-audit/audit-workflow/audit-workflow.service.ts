import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditWorkflow, AuditWorkflowPaginationResponse, InternalAuditModules, ModuleGroups, ModuleGroupsResponse, SingleAuditWorkflow, UserTypes } from 'src/app/core/models/internal-audit/audit-workflow/audit-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditReportWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-report-workflow.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import {AuditReportWorkflowDetail,AuditReportWorkflowHistoryPaginationResponse} from 'src/app/core/models/internal-audit/report/audit-report-workflow'
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditWorkflowService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/audit-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(AuditWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveRoleAdd(item: any,id) {
    return this._http.post('/audit-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_role_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/audit-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_team_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/audit-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_head_unit_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/audit-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_designation_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/audit-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_user_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/internal-audit/workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_workflow_export')+".xlsx");
      }
    )
  }

  exportToExcel() {
    // let params = '';
    // if (AuditWorkflowStore.orderBy) params += `&order=${AuditWorkflowStore.orderBy}`;
    // if (AuditWorkflowStore.orderItem) params += `&order_by=${AuditWorkflowStore.orderItem}`;
    this._http.get('/audit-workflows/export?module_group_ids=1000', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_workflow_export')+".xlsx");
      }
    )
  }

  getItem(id): Observable<SingleAuditWorkflow> {
    return this._http.get<SingleAuditWorkflow>('/audit-workflows/'+id).pipe((
      map((res:SingleAuditWorkflow)=>{
        AuditWorkflowStore.setIndividualAuditTemplate(res);
        return res;
      })
    ))
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditWorkflowStore.currentPage}&status=all`;
      if (AuditWorkflowStore.orderBy) params += `&order_by=${AuditWorkflowStore.orderItem}&order=${AuditWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(AuditWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+AuditWorkflowStore.searchText;

    return this._http.get<AuditWorkflowPaginationResponse>('/audit-workflows' + (params ? params : '')).pipe(
      map((res: AuditWorkflowPaginationResponse) => {
        AuditWorkflowStore.setAuditWorkflow(res);
        return res;
      })
    );
  }

  getAllItems(params:string): Observable<AuditWorkflow[]>{
    if(AuditWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+AuditWorkflowStore.searchText;
    return this._http.get<AuditWorkflow[]>('/audit-workflows'+ (params ? params : '')).pipe(
      map((res: AuditWorkflow[]) => {
        
        AuditWorkflowStore.setAllAuditTemplate(res["data"]);
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/audit-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'work_flow_added_main');
        // this.getAllItems('?module_group_ids=1000').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/audit-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'work_flow_updated_main');
      // this.getAllItems('?module_group_ids=1000').subscribe()
      return res;
    }))
  }

  getUserTypes(params:string=""): Observable<UserTypes>{
    return this._http.get<UserTypes>('/user-types'+(params ? params : '')).pipe(
      map((res: UserTypes) => {
        AuditWorkflowStore.setUserTypes(res)
        return res;
      })
    );
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        AuditWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/audit-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deleted_main');
        // this.getAllItems('?module_group_ids=1000').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/audit-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=1000').subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/audit-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=1000').subscribe();
        return res;
      })
    );
  }

  // getWorkflow(id): Observable<DocumentWorkflow[]> {
  //   return this._http
  //     .get<DocumentWorkflow[]>('/documents/' + id + '/workflow')
  //     .pipe(
  //       map((res: DocumentWorkflow[]) => {
  //         documentWorkFlowStore.setDocumentWorkflow(res);
  //         return res;
  //       })
  //     );
  // }

  getWorkflow(): Observable<AuditReportWorkflowDetail> {
    return this._http.get<AuditReportWorkflowDetail>('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+'/workflow').pipe((
      map((res:AuditReportWorkflowDetail)=>{
        AuditReportWorkflowStore.setAuditReportWorkflow(res);
        return res;
      })
    ))
  }
  getHistory(): Observable<AuditReportWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${AuditWorkflowStore.currentPage}`;
      if (AuditWorkflowStore.orderBy) params += `&order=${AuditWorkflowStore.orderBy}`;
    return this._http.get<AuditReportWorkflowHistoryPaginationResponse>('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+'/workflow-history' + (params ? params : '')).pipe(
      map((res: AuditReportWorkflowHistoryPaginationResponse) => {
        AuditReportWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }
  submitReport() {
    return this._http.put('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+`/submit`,null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_submitted');
      return res;
    }))

  }

  publishReport(comment) {
    return this._http.put('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+`/publish`,comment).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_published');
      return res;
    }))

  }

  revertReport(comment) {
    return this._http.put('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+`/revert`,comment).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_reverted');
      return res;
    }))

  }

  rejectReport(comment) {
    return this._http.put('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+`/reject`,comment).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_rejected');
      return res;
    }))

  }

  approveReport(comment) {
    return this._http.put('/audit-reports/'+`${AuditReportWorkflowStore.auditReportId}`+`/approve`,comment).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_approved');
      return res;
    }))

}

// getWorkflowHistory(): Observable<WorkflowHistoryPagination> {
//   return this._http
//     .get<WorkflowHistoryPagination>('/audit-reports/' + `${AuditReportWorkflowStore.auditReportId}` + '/workflow-history')
//     .pipe(
//       map((res: WorkflowHistoryPagination) => { 
//         AuditReportWorkflowStore.setWorkflowHistory(res);
//         return res;
//       })
//     );
// }

}
