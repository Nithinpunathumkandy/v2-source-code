import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { workFlow, WorkFlowList, WorkFlowDetails, ReviewUsersPaginationResponse, ApprovalUsersPaginationResponse, Users, ReviewUsersList, ApprovalUsersList, CurrentUsersList, WorkFlowPaginationResponse } from 'src/app/core/models/knowledge-hub/work-flow/workFlow';
import {WorkFlowStore} from 'src/app/stores/knowledge-hub/work-flow/workFlow.store'
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    ) { }


  getAllItems(getAll: boolean = false, resparams: string = '',listAll:boolean=true): Observable<WorkFlowPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${WorkFlowStore.currentPage}`;
      if (WorkFlowStore.orderBy) params += `&order=${WorkFlowStore.orderBy}&order_by=${WorkFlowStore.orderItem}`;
    }
    if (resparams) params += resparams;
    if(listAll)params +=(params?'&status=all':'?status=all')
    if(WorkFlowStore.searchText) params += (params ? '&q=' : '?q=')+WorkFlowStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'kh_workflow' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<WorkFlowPaginationResponse>('/document-workflows'+ (params ? params : '')+(resparams ? resparams : '') )
      .pipe(
        map((res: WorkFlowPaginationResponse) => {
          WorkFlowStore.setWorkFlowList(res);
          return res;
        })
      );
  }



  saveItem(WorkFlow: workFlow) {
    return this._http.post('/document-workflows',WorkFlow).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'kh_workFlow_created');
      this.getAllItems(false,"&module_group_ids=700").subscribe()
      return res;
    }))

  }

  getItemById(id:number):Observable<WorkFlowDetails>{
    return this._http.get<WorkFlowDetails>('/document-workflows/' + id).pipe(map((res: WorkFlowDetails) => {
      WorkFlowStore.setWorkFlowDetails(res)
      return res;
    }))
  }

  // saveReviewUsers(data: Users, reload: boolean = false) {
  //   return this._http.post('/document-workflows/' + WorkFlowStore.workflowId + '/review-users', data).pipe(map(res => {
  //     this._utilityService.showSuccessMessage('Success!', 'Review Users has been created!');
  //     if (reload) {
  //       this.getItemById(WorkFlowStore.workflowId).subscribe();
  //       this.getReviewUsers(WorkFlowStore.workflowId).subscribe()
  //     }

  //     return res;
  //   }))

  // }

  // getReviewUsers(id:number):Observable<ReviewUsersPaginationResponse>{
  //   return this._http.get<ReviewUsersPaginationResponse>('/document-workflows/' + id + '/review-users').pipe(map((res: ReviewUsersPaginationResponse) => {
  //     WorkFlowStore.setReviewUsers(res['data'])
  //     return res;
  //   }))
  // }

  // getCurrentReviewUsers(id:number):Observable<CurrentUsersList[]>{
  //   return this._http.get<CurrentUsersList[]>('/document-workflows/' + id + '/current-review-users').pipe(map((res: CurrentUsersList[]) => {
  //     WorkFlowStore.setCurrentReviewUsers(res)
  //     return res;
  //   }))
  // }

  // deleteReviewUser(id: number) {
  //   return this._http.delete("/document-workflows/" + WorkFlowStore.workflowId+'/review-users/'+id).pipe(
  //     map((res) => {
  //       this._utilityService.showSuccessMessage(
  //         "Success!",
  //         "Review User has been deleted!"
  //       );
  //       this.getReviewUsers(WorkFlowStore.workflowId).subscribe();
  //       return res;
  //     })
  //   );
  // }

  // saveApprovalUsers(data: Users, reload: boolean = false) {
  //   return this._http.post('/document-workflows/'+WorkFlowStore.workflowId+'/approval-users',data).pipe(map(res=>{
  //     this._utilityService.showSuccessMessage('Success!', 'Approval Users has been created!');
  //     if (reload) {
  //       this.getApprovalUsers(WorkFlowStore.workflowId).subscribe()
  //     }
      
  //     return res;
  //   }))

  // }

  // getApprovalUsers(id:number):Observable<ApprovalUsersPaginationResponse>{
  //   return this._http.get<ApprovalUsersPaginationResponse>('/document-workflows/' + id + '/approval-users').pipe(map((res: ApprovalUsersPaginationResponse) => {
  //     WorkFlowStore.setApprovalUsers(res['data'])
  //     return res;
  //   }))
  // }

  // getCurrentApprovalUsers(id:number):Observable<CurrentUsersList[]>{
  //   return this._http.get<CurrentUsersList[]>('/document-workflows/' + id + '/current-approval-users').pipe(map((res: CurrentUsersList[]) => {
  //     WorkFlowStore.setCurrentApprovalUsers(res)
  //     return res;
  //   }))
  // }

  
  // deleteApprovalUser(id: number) {
  //   return this._http.delete("/document-workflows/" + WorkFlowStore.workflowId+'/approval-users/'+id).pipe(
  //     map((res) => {
  //       this._utilityService.showSuccessMessage(
  //         "Success!",
  //         "Approval User  has been deleted!"
  //       );
  //       this.getApprovalUsers(WorkFlowStore.workflowId).subscribe();
  //       return res;
  //     })
  //   );
  // }


  updateItem(id, data: workFlow): Observable<any>{
    return this._http.put('/document-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'kh_workflow_update');
      this.getAllItems(false,"&module_group_ids=700").subscribe()
      return res;
    }))
  }

  delete(id: number) {
    return this._http.delete("/document-workflows/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success","kh_workflow_delete");
        this.getAllItems(false, '&module_group_ids=700', true).subscribe(resp => {
					if (resp.from == null) {
						WorkFlowStore.setCurrentPage(resp.current_page - 1);
						this.getAllItems(false,"&module_group_ids=700").subscribe()
          }
        });
        // this.getAllItems().subscribe();
        return res;
      })
    );
  }


  activate(id: number) {
    return this._http.put('/document-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kh_work_flow_activated_main');
        // this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/document-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kh_work_flow_deactivated_main');
        // this.getAllItems().subscribe();
        return res;
      })
    );
  }

  sortWorkflowList(type, callList: boolean = true) {
    if (!WorkFlowStore.orderBy) {
      WorkFlowStore.orderBy = 'asc';
      WorkFlowStore.orderItem = type;
    }
    else{
      if (WorkFlowStore.orderItem == type) {
        if(WorkFlowStore.orderBy == 'asc') WorkFlowStore.orderBy = 'desc';
        else WorkFlowStore.orderBy = 'asc'
      }
      else{
        WorkFlowStore.orderBy = 'asc';
        WorkFlowStore.orderItem = type;
      }
    }
    if (callList)
    this.getAllItems(false).subscribe();
  }
  
  generateTemplate() {
    this._http.get('/document-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "workflows.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/document-workflows/export?module_group_ids=700', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_workflows')+".xlsx");
      }
    )
  }

  saveRoleAdd(item: any,id) {
    return this._http.post('/document-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'document_workflow_added');
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/document-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'document_workflow_team_added');
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/document-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'document_workflow_hou_added');
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/document-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'document_workflow_designation_added');
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/document-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'document_workflow_user_added');
        return res;
      })
    );
  }

  saveSystemRole(item: any,id) {
    return this._http.post('/document-workflows/'+id+'/items/system-role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_system_role_has_been_added');
        this.getItemById(WorkFlowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/document-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this._utilityService.showSuccessMessage('success', 'document_workflow_user_deleted');
        return res;
      })
    );
  }

  // * Getting Workflow Based on Module Group Id and document Id


  getWorkflow(status:boolean = true,moduleID,docTypeId){
    let params = ''
    if (status)
      params = `?module_group_ids=${moduleID}&document_type_ids=${docTypeId}`;
    return this._http.get('/document-workflows' + params)

  }

  addUserLevel(id,item){
    return this._http.post(`/documents/${id}/document-workflow-items/user`,item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','document_workflow_user_level_added');
        return res;
      })
    );
  }

  updateUserLevel(id,item){
    return this._http.put(`/documents/document-workflow-items/${id}`,item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','document_workflow_user_level_updated');
        return res;
      })
    );
  }

  deleteWorkflowLevel(id){
    return this._http.delete(`/documents/document-workflow-items/${id}`).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','document_workflow_user_level_deleted');
        return res;
      })
    );
  }

  deleteUser(documentId,levelId){
    return this._http.delete(`/documents/document-workflow-items/${documentId}/user/${levelId}`).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','kh_document_workflow_user_deleted');
        return res;
      })
    );
  }

  showWorkflowLevel(id){
    return this._http.get(`/documents/document-workflow-items/${id}/show`).pipe(
      map((res:any )=> {
        WorkFlowStore.setUserWorkflowDetails(res)
        return res;
      })
    );
  }

  getActivity(id,getAll:boolean=false){
    let params=''
    if (!getAll) {
      params = `?page=${WorkFlowStore.currentActivityPage}&status=all`;      
    }
    return this._http.get(`/document-versions/${id}/contents/activity-logs${(params ? params : '')}`).pipe(
      map((res:any )=> {
        WorkFlowStore.setActivityLog(res)
        return res;
      })
    );
  }  

}
