import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { SwotStore } from "src/app/stores/organization/context/swot.store";
import { AnalysisPaginationResponse } from "src/app/core/models/organization/context/swot";
import { UtilityService } from "src/app/shared/services/utility.service";

import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class SwotService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // Get All SWOT Items Together
  // getAllItems(){
  //   return this._http.get<AnalysisPaginationResponse>('/organization-issues?type=swot').pipe(
  //     map((res: AnalysisPaginationResponse) => {
  //       //console.log(res);
  //       return res;
  //     })
  //   );
  // }

  // Get Items by type
  // getItems(params,noOfItems?:number){
    // let urlParams = params+`&page=${SwotStore.getSwotListByItem(params).current_page}`;
    // return this._http.get<AnalysisPaginationResponse>('/organization-issues?type=swot&category='+(urlParams ? urlParams : '')+'&limit='+(noOfItems ? noOfItems : '')).pipe(
    //   map((res: AnalysisPaginationResponse) => {
    //     SwotStore.setSwotList(params,res);
    //     return res;
    //   })
    // );
  // }

  /**
   * Get Issue List for Specific Categoru
   * @param swotType Swot Category Title
   * @param swotId Swot Category Id
   * @param noOfItems No of Items to be present in list
   */
  getItems(swotType,swotId,noOfItems?: number){
    let urlParams = swotId+`&page=${SwotStore.getSwotListByItem(swotType.toLowerCase()) ? SwotStore.getSwotListByItem(swotType.toLowerCase()).current_page : 1}`;
    if(RightSidebarLayoutStore.filterPageTag == 'swot' && RightSidebarLayoutStore.filtersAsQueryString)
    urlParams = (urlParams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (urlParams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AnalysisPaginationResponse>('/organization-issues?issue_category_ids='+(urlParams ? urlParams : '')+'&limit='+(noOfItems ? noOfItems : '')).pipe(
      map((res: AnalysisPaginationResponse) => {
        SwotStore.setSwotList(swotType,swotId,res);
        return res;
      })
    );
  }

  // Get SWOT Categories
  getSwotCategories(){
    return this._http.get<AnalysisPaginationResponse[]>('/issue-categories?is_swot=true').pipe(
      map((res: AnalysisPaginationResponse[]) => {
        SwotStore.setSwotCategories(res['data']);
        return res['data'];
      })
    );
  }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/swot/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('swot_issues')+'.xlsx');
      }
    )
  }
}
