import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { IssueList, IssueListResponse, IssueDetails } from "src/app/core/models/organization/context/issue-list";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';


@Injectable({
  providedIn: 'root'
})
export class IssueListService {

  constructor(private _utilityService: UtilityService, private _http: HttpClient) { }

  /**
   * Get Issue List
   * @param getAll Get Paginated Result or Not
   */
  getItems(getAll: boolean = false, additionalParams?: string,status:boolean = false): Observable<IssueListResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IssueListStore.currentPage}`;
      if (IssueListStore.orderBy) params += `&order=${IssueListStore.orderBy}`;
      if (IssueListStore.orderItem) params += `&order_by=${IssueListStore.orderItem}`;
      if (IssueListStore.searchText) params += `&q=${IssueListStore.searchText}`;
    }
    if (additionalParams) {
      params = (params == '') ? params + '?'+additionalParams : params + '&'+additionalParams;
    }
    if(status) 
      params = (params == '') ? params + '?status=all' : params + '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'issue_list' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);

    return this._http.get<IssueListResponse>('/organization-issues' + (params ? params : '')).pipe(
      map((res: IssueListResponse) => {
        res['data'].forEach(element => {
          element.checked = false;
          if (element.issue_types) {
            let issue_types_list = element.issue_types.split(',');
            element['issue_types_list'] = issue_types_list;
          }
          else {
            element['issue_types_list'] = [];
          }
        });
        IssueListStore.setIssueListDetails(res);
        return res;
      })
    );
  }

  // getItems(params?: string): Observable<MsTypePaginationResponse> {
  //   return this._http.get<MsTypePaginationResponse>('/ms-type-organizations' + (params ? params : ''));
  // }

  /**
   * Update Issue
   * @param id Isssue Id
   * @param item Issue Details
   */
  updateItem(id, item: IssueList): Observable<any> {
    return this._http.put('/organization-issues/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  /**
   * Save Issue
   * @param item Issue Details
   */
  saveItem(item: IssueList) {
    return this._http.post('/organization-issues', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  /**
   * Delete Issue
   * @param id Issue Id
   */
  deleteItem(id: number) {
    return this._http.delete('/organization-issues/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems().subscribe(resp=>{
          if(resp.from == null && resp.current_page > 1){
            IssueListStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  deactivateItem(id: number){
    return this._http.put('/organization-issues/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activateItem(id: number){
    return this._http.put('/organization-issues/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  /**
   * Get Issue Details
   * @param id Issue Id
   */
  getIssueDetails(id: number) {
    return this._http.get<IssueDetails>('/organization-issues/' + id).pipe(
      map((res: IssueDetails) => {
        IssueListStore.setIssueDetails(res);
        return res;
      })
    );
  }

  getIssueDetailsFromStore() {
    return IssueListStore.selectedIssueData;
  }

  setMsTypes(msTypeId) {
    IssueListStore.selectMsType(msTypeId);
  }

  getMsTypes(msTypeId) {
    return IssueListStore.findSelectedMsTypes(msTypeId);
  }

  setStakeHolderType(sType) {
    IssueListStore.setStakeHolderType(sType);
  }

  getStakeHolderType() {
    return IssueListStore.getSelectedStakeholderType();
  }

  addNeedsandExpectations(needs, stakeholder, edit = false) {
    return IssueListStore.newNeedsExpectations(needs, stakeholder, edit);
  }

  removeNeedsandExpectations(needs,position){
    IssueListStore.removeNeedsandExpectations(needs,position);
  }

  showOrHideNeedsExpectations(pos) {
    IssueListStore.showhideNeedsExpectations(pos);
  }

  settoSelectedIssueList(issue) {
    IssueListStore.setSelectedIssueList(issue);
  }

  unsetSelectedIssueList() {
    IssueListStore.unsetSelectedIssueList();
  }

  setAllIssueList() {
    IssueListStore.setAllSelectedIssueList();
  }

  /**
   * Sort Issue List
   * @param type Sort By Variable
   */
  sortIssueList(type, callList: boolean = true,text?) {
    if (!IssueListStore.orderBy) {
      IssueListStore.orderBy = 'asc';
      IssueListStore.orderItem = type;
    }
    else {
      if (IssueListStore.orderItem == type) {
        if (IssueListStore.orderBy == 'asc') IssueListStore.orderBy = 'desc';
        else IssueListStore.orderBy = 'asc'
      }
      else {
        IssueListStore.orderBy = 'asc';
        IssueListStore.orderItem = type;
      }
    }
    // if (callList)
    //   this.getItems().subscribe();
    // else
    //   this.getItems(false,`q=${text}`).subscribe()
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/organization-issues/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_issue_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if (IssueListStore.orderBy) params += `?order=${IssueListStore.orderBy}`;
    if (IssueListStore.orderItem) params += `&order_by=${IssueListStore.orderItem}`;
    // if (IssueListStore.searchText) params += `&q=${IssueListStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'issue_list' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/organization-issues/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_issues')+'.xlsx');
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/organization-issues/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  /**
   * Select issues and Store
   * @param issues Selected issues
   */
  selectRequiredIssues(issues){
   
    IssueListStore.addSelectedIssues(issues);
  }

}
