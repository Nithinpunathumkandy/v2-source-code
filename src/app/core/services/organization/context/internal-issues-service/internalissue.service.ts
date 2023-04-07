import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { InternalIssueStore } from "src/app/stores/organization/context/internal-issue.store";
import { InternalIssue, InternalIssuesList } from "src/app/core/models/organization/context/internal-issue";
import { IssueCategory, IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';
import { UtilityService } from "src/app/shared/services/utility.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class InternalissueService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // getAllItems(){
    // return this._http.get<InternalIssuesList[]>('/internal-issues').pipe(
    //   map((res: InternalIssuesList[]) => {
    //     for(let i of res){
    //       i.total_items = i.issues.length;
    //       if(i.issues.length > 5){
    //         let temp = i.issues.slice(0,5);
    //         i.issues = temp;
    //       }
    //     }
    //     InternalIssueStore.setInternalIssueList(res);
    //     return res;
    //   })
    // );
  // }

  /**
   * Get Items For List
   * @param issueId Issue Category Id
   * @param issueTitle Issue Category Title
   */
  getItems(issueId:number,issueTitle:string,setToList:boolean = false){
    let urlParams = '';
    if(setToList)
      urlParams = issueId+`&page=1&limit=5`;
    else
      urlParams = issueId+`&page=${InternalIssueStore.internalIssue?.current_page ? InternalIssueStore.internalIssue.current_page : 1}`;
    // return this._http.get<InternalIssue>('/organization-issues?type=internal&category='+(urlParams ? urlParams : '')).pipe(
    //   map((res: InternalIssue) => {
    //     InternalIssueStore.setInternalIssue(res);
    //     return res;
    //   })
    // );
    if(RightSidebarLayoutStore.filterPageTag == 'internal_issue' && RightSidebarLayoutStore.filtersAsQueryString)
    urlParams = (urlParams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (urlParams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<InternalIssue>('/organization-issues?is_internal=true&issue_category_ids='+(urlParams ? urlParams : '')).pipe(
      map((res: InternalIssue) => {
        // res.total = res.data.length;
        // if(res.data.length > 5){
        //   let temp = res.data.slice(0,5);
        //   res.data = temp;
        // }
        if(setToList){
          var issueListResponse: InternalIssuesList = {
            issue_category_id: issueId,
            issue_category_title: issueTitle,
            issues: res.data,
            total_items: res.total
          }
          InternalIssueStore.setInternalIssueList(issueListResponse);
        }
        else{
          InternalIssueStore.setInternalIssue(res);
        }
        return res;
      })
    );
  }

  // Get Issue Categories
  getIssueCategories(){
    let urlParams = `?page=${InternalIssueStore.currentPage}`;
    return this._http.get<IssueCategoryPaginationResponse>('/issue-categories'+(urlParams ? urlParams : '')).pipe(
      map((res: IssueCategoryPaginationResponse) => {
        InternalIssueStore.setIssueCategories(res);
        return res;
      })
    );
  }

  /**
   * Get Items For View More - 
   * @param issueId Issue Category Id
   * @param issueTitle Issue Category Title
   */
  // getItem(issueId:number,issueTitle:string){
  //   let urlParams = issueId+`&page=${InternalIssueStore.internalIssue?.current_page ? InternalIssueStore.internalIssue.current_page : 1}`;
  //   return this._http.get<InternalIssue>('/organization-issues?is_internal=true&issue_category_ids='+(urlParams ? urlParams : '')).pipe(
  //     map((res: InternalIssue) => {
  //       InternalIssueStore.setInternalIssue(res);
  //       return res;
  //     })
  //   );
  // }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/internal-issues/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('internal_issues')+'.xlsx');
      }
    )
  }

}
