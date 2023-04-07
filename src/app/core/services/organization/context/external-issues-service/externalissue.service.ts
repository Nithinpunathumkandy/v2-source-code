import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ExternalIssueStore } from "src/app/stores/organization/context/external-issue.store";
import { ExternalIssue, ExternalIssuesList } from "src/app/core/models/organization/context/external-issue";
import { IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';
import { UtilityService } from "src/app/shared/services/utility.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class ExternalissueService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // getAllItems(){
    // return this._http.get<ExternalIssuesList[]>('/external-issues').pipe(
    //   map((res: ExternalIssuesList[]) => {
    //     for(let i of res){
    //       i.total_items = i.issues.length;
    //       if(i.issues.length > 5){
    //         let temp = i.issues.slice(0,5);
    //         i.issues = temp;
    //       }
    //     }
    //     ExternalIssueStore.setExternalIssueList(res);
    //     return res;
    //   })
    // );
  // }

  /**
   * Get Issues By Category Id
   * @param issueId Category Id
   * @param issueTitle Category Title
   */
  getItems(issueId:number,issueTitle:string,setToList:boolean = false){
    let urlParams = '';
    if(setToList)
      urlParams = issueId+`&page=1&limit=5`;
    else 
      urlParams = issueId+`&page=${ExternalIssueStore.externalIssue?.current_page ? ExternalIssueStore.externalIssue.current_page : 1}`;
    // return this._http.get<ExternalIssue>('/organization-issues?type=external&category='+(urlParams ? urlParams : '')).pipe(
    //   map((res: ExternalIssue) => {
    //     ExternalIssueStore.setExternalIssue(res);
    //     return res;
    //   })
    // );
    if(RightSidebarLayoutStore.filterPageTag == 'external_issue' && RightSidebarLayoutStore.filtersAsQueryString)
    urlParams = (urlParams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (urlParams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ExternalIssue>('/organization-issues?is_external=true&issue_category_ids='+(urlParams ? urlParams : '')).pipe(
      map((res: ExternalIssue) => {
        // res.total = res.data.length;
        // if(res.data.length > 5){
        //   let temp = res.data.slice(0,5);
        //   res.data = temp;
        // }
        if(setToList){
          var issueListResponse: ExternalIssuesList = {
            issue_category_id: issueId,
            issue_category_title: issueTitle,
            issues: res.data,
            total_items: res.total
          }
          ExternalIssueStore.setExternalIssueList(issueListResponse);
        }
        else{
          ExternalIssueStore.setExternalIssue(res);
        }
        return res;
      })
    );
  }

  // Get Issue Categories
  getIssueCategories(){
    let urlParams = `?page=${ExternalIssueStore.currentPage}`;
    return this._http.get<IssueCategoryPaginationResponse>('/issue-categories'+(urlParams ? urlParams : '')).pipe(
      map((res: IssueCategoryPaginationResponse) => {
        ExternalIssueStore.setIssueCategories(res);
        return res;
      })
    );
  }

  /**
   * Get Issue Per Category for View More
   * @param issueId Category Id
   * @param issueTitle Category Title
   */
  // getItem(issueId:number,issueTitle:string){
  //   let urlParams = issueId+`&page=${ExternalIssueStore.externalIssue?.current_page ? ExternalIssueStore.externalIssue.current_page : 1}`;
  //   return this._http.get<ExternalIssue>('/organization-issues?is_external=true&issue_category_ids='+(urlParams ? urlParams : '')).pipe(
  //     map((res: ExternalIssue) => {
  //       ExternalIssueStore.setExternalIssue(res);
  //       return res;
  //     })
  //   );
  // }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/external-issues/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage('external_issues')+'.xlsx');
      }
    )
  }

}
