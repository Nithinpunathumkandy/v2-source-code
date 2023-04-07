import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bia, BiaAsstes, BiaList, BiaPaginationResponse, impact_result, ResourceRequirement, softwarePagination, TopCounts } from 'src/app/core/models/bcm/bia/bia';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
 
  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BiaStore.currentPage}`;
      if (BiaStore.orderBy) params += `&order=${BiaStore.orderBy}`;
      if (BiaStore.orderItem) params += `&order_by=${BiaStore.orderItem}`;
      if (BiaStore.searchText) params += `&q=${BiaStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    // if (status) params += (params ? '&' : '?') + 'status=all'; 
    if(BiaStore.searchText) params += (params ? '&q=' : '?q=')+BiaStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_bia' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BiaPaginationResponse>('/business-impact-analyses' + (params ? params : '')).pipe(
      map((res: BiaPaginationResponse) => {
        BiaStore.setBiaList(res);
        return res;
      })
    );
  }

  getFullBiaItems(params){
    return this._http.get<BiaList[]>('/business-impact-analyses' + (params ? params : '')).pipe(
      map((res: BiaList[]) => {
        BiaStore.setBiaFullList(res);
        return res;
      })
    );
  }

  getItem(): Observable<Bia> {
    return this._http.get<Bia>('/business-impact-analyses/'+BiaStore.selectedProcessId).pipe(
      map((res: Bia) => {
        BiaStore.setBia(res)
        return res;
      })
    );
  }

  getBiaAssets(id): Observable<BiaAsstes> {
   let params = '?process_ids='+ id
    return this._http.get<BiaAsstes>('/assets'+ (params?params : '')).pipe(
      map((res: BiaAsstes) => {
        BiaStore.setBiaAssets(res['data'])
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete("/business-impact-analyses/" + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_deleted');
        // this.getAllItems(false,null,true).subscribe(resp => {
        //   if (resp.from == null) {        
        //     this.getAllItems(false,null,true).subscribe();
        //   }
        // });
        return res;
      })
    );
  }

  updateItem(matrixId:number, rating): Observable<any> {
    return this._http.put('/business-impact-analyses/'+ matrixId, rating).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Business_Impact_Analysis_updated');
        // this.getItem().subscribe();
        return res;
      })
    );
  }

  getTopCounts(): Observable<TopCounts> {
    return this._http.get<TopCounts>('/bia-resource-requirements/'+BiaStore.selectedProcessId+'/count').pipe(
      map((res: TopCounts) => {
        BiaStore.setTopCounts(res)
        return res;
      })
    );
  }

  getSoftware(): Observable<softwarePagination> {
    return this._http.get<softwarePagination>('/business-applications?business_application_type_type=soft').pipe(
      map((res: softwarePagination) => {
        BiaStore.setSoftware(res)
        return res;
      })
    );
  }

  getHardware(): Observable<softwarePagination> {
    return this._http.get<softwarePagination>('/business-applications?business_application_type_type=hard').pipe(
      map((res: softwarePagination) => {
        BiaStore.setHardware(res)
        return res;
      })
    );
  }

  getResourceRequirement(): Observable<ResourceRequirement> {
    return this._http.get<ResourceRequirement>('/bia-resource-requirements/'+BiaStore.businessAnalysisId).pipe(
      map((res: ResourceRequirement) => {
        BiaStore.setResourceRequirement(res)
        return res;
      })
    );
  }

  saveResource(resource): Observable<any> {
    return this._http.post('/bia-resource-requirements', resource).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'resource_requirement_saved');
        // this.getItem().subscribe();
        return res;
      })
    );
  }

  updateResource(resource): Observable<any> {
    return this._http.post('/bia-resource-requirements', resource).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'resource_requirement_updated');
        // this.getItem().subscribe();
        return res;
      })
    );
  }

  getImpactResult(id:number, is_process?:boolean): Observable<impact_result> {
    let url = '/business-impact-analysis-results/'+id;
    if(is_process) url = '/processes/business-impact-analysis-results/'+id;
    return this._http.get<impact_result>(url).pipe(
      map((res: impact_result) => {
        BiaStore.setImpactResult(res)
        return res;
      })
    );
  }

  saveImpactResult(resource): Observable<any> {
    return this._http.put('/business-impact-analysis-results/'+BiaStore.ImpactResultId, resource).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_result_saved');
        // this.getItem().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    let params = '';
    if (BiaStore.orderBy) params += `?order=${BiaStore.orderBy}`;
    if (BiaStore.orderItem) params += `&order_by=${BiaStore.orderItem}`;
    // if (BiaStore.searchText) params += `&q=${BiaStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_bia' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/business-impact-analyses/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_impact_analysis')+".xlsx");
      }
    )
  }

  sortList(type, text) {
    if (!BiaStore.orderBy) {
      BiaStore.orderBy = 'asc';
      BiaStore.orderItem = type;
    }
    else{
      if (BiaStore.orderItem == type) {
        if(BiaStore.orderBy == 'asc') BiaStore.orderBy = 'desc';
        else BiaStore.orderBy = 'asc'
      }
      else{
        BiaStore.orderBy = 'asc';
        BiaStore.orderItem = type;
      }
    }
    if(!text)
      this.getAllItems().subscribe();
    else
    this.getAllItems(false,`&q=${text}&`).subscribe()
  }
}
