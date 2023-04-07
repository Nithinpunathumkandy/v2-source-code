import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { PestleStore } from "src/app/stores/organization/context/pestle.store";
import { AnalysisPaginationResponse } from "src/app/core/models/organization/context/swot";

import { UtilityService } from "src/app/shared/services/utility.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class PestleService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // getAllItems(){
  //   return this._http.get<AnalysisPaginationResponse>('/organization-issues?type=pestel').pipe(
  //     map((res: AnalysisPaginationResponse) => {
  //       return res;
  //     })
  //   );
  // }

  /**
   * Get PESTEL issues by type
   * @param pestelTitle Category Title
   * @param pestelId Category Id
   * @param noOfItems No of Items
   */
  getItems(pestelTitle,pestelId,noOfItems?:number, newPage:number = 1){
    let urlParams = pestelId+`&page=`+newPage;
    if(RightSidebarLayoutStore.filterPageTag == 'pestle' && RightSidebarLayoutStore.filtersAsQueryString)
    urlParams = (urlParams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (urlParams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AnalysisPaginationResponse>('/organization-issues?issue_category_ids='+(urlParams ? urlParams : '')+'&limit='+(noOfItems ? noOfItems : '')).pipe(
      map((res: AnalysisPaginationResponse) => {
        PestleStore.setPestleList(pestelId,pestelTitle,res);
        return res;
      })
    );
  }

  // GET Pestel Categories
  getPestleCategories(){
    return this._http.get<AnalysisPaginationResponse[]>('/issue-categories?is_pestel=true').pipe(
      map((res: AnalysisPaginationResponse[]) => {
        PestleStore.setPestelCategories(res['data']);
        return res['data'];
      })
    );
  }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/pestel/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('pestel_issues')+'.xlsx');
      }
    )
  }

}
