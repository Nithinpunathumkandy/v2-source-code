import { Injectable } from '@angular/core';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { Risk, RiskPaginationResponse, IndividualRisk, ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRisksService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsRisksStore.currentPage}`;
      if (IsmsRisksStore.orderBy) params += `&order=${IsmsRisksStore.orderBy}`;
      if (IsmsRisksStore.orderItem) params += `&order_by=${IsmsRisksStore.orderItem}`;
      if (IsmsRisksStore.searchText) params += `&q=${IsmsRisksStore.searchText}`;
      // if (IsmsRisksStore.orderBy) params += `&order_by=risks.title&order=${IsmsRisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(IsmsRisksStore.is_registered==true){
      params=(params=='')?params+'?is_registered=true':params+'&is_registered=true';
    }
    else if(IsmsRisksStore.is_registered==false){
      params=(params=='')?params+'?is_registered=false':params+'&is_registered=false';
    }
    params=params+'&asset_rating=true';
    // if(IsmsRisksStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRisksStore.searchText;
    if((RightSidebarLayoutStore.filterPageTag == 'risk' || RightSidebarLayoutStore.filterPageTag == 'risk_heat_map' || 
    RightSidebarLayoutStore.filterPageTag == 'heap_by_category' || RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'
    || RightSidebarLayoutStore.filterPageTag == 'heap_by_department' || RightSidebarLayoutStore.filterPageTag == 'heap_by_section' || 
    RightSidebarLayoutStore.filterPageTag == 'heap_by_division') && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(IsmsRisksStore.corporate){
      return this._http.get<RiskPaginationResponse>('/corporate-isms-risks' + (params ? params : '')).pipe(
        map((res: RiskPaginationResponse) => {
          IsmsRisksStore.setRiskDetails(res);
          return res;
        })
      );
    }
    else{
      return this._http.get<RiskPaginationResponse>('/isms-risks' + (params ? params : '')).pipe(
        map((res: RiskPaginationResponse) => {
          IsmsRisksStore.setRiskDetails(res);
          return res;
        })
      );
    }
  
  }

  getItem(id: number): Observable<IndividualRisk> {
    return this._http.get<IndividualRisk>('/isms-risks/' + id).pipe(
      map((res: IndividualRisk) => {
        IsmsRisksStore.setIndividualRiskDetails(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getAssetCategories(params?): Observable<any>{
    return this._http.get<any>('/assets/by-categories'+(params?params:'')).pipe(
      map((res: any) => {
        IsmsRisksStore.setAssetCategories(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getAssets(params?): Observable<any>{
    return this._http.get<any>('/assets'+(params?params:'')).pipe(
      map((res: any) => {
        IsmsRisksStore.setAssets(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateItem(risk_id:number, risk: Risk): Observable<any> {
    return this._http.put('/isms-risks/'+ risk_id, risk).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'isms_risk_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  makeCorporate(riskArray): Observable<any> {
    return this._http.put('/corporate-isms-risks/update', riskArray).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'selected_risk_corporate');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  makeFunctional(riskArray): Observable<any> {
    return this._http.put('/isms-risks/update-functional', riskArray).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'selected_risk_functional');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }


  saveItem(risk): Observable<any> {
    return this._http.post('/isms-risks', risk).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'isms_risk_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risks/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'isms_risk_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getContextChart(id: number): Observable<ContextChart> {
    return this._http.get<ContextChart>('/isms-risks/' + id+'/analyses/charts').pipe(
      map((res: ContextChart) => {
        IsmsRisksStore.setContextChartDetails(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
  sortRiskList(type, callList: boolean = true) {
    if (!IsmsRisksStore.orderBy) {
      IsmsRisksStore.orderBy = 'asc';
      IsmsRisksStore.orderItem = type;
    }
    else {
      if (IsmsRisksStore.orderItem == type) {
        if (IsmsRisksStore.orderBy == 'asc') IsmsRisksStore.orderBy = 'desc';
        else IsmsRisksStore.orderBy = 'asc'
      }
      else {
        IsmsRisksStore.orderBy = 'asc';
        IsmsRisksStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }

  
  // closeTreatment(){
    closeRisk(id): Observable<any> {
      return this._http.put('/isms-risks/'+id+'/close', id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_closed');
  
          this.getItems().subscribe();
  
          return res;
        })
      );
    // }
  }

  saveRiskId(id:number){
    IsmsRisksStore.setRiskId(id);
  }

  generateTemplate() {
    this._http.get('/risks/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "risks-template.xlsx");
      }
    )
  }

  exportToExcel(params?) {
    if(IsmsRisksStore.corporate){
      this._http.get('/corporate-isms-risks/original-export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "risks.xlsx");
          SubMenuItemStore.exportClicked=false;
        }
      )
    }
    else{
      this._http.get('/isms-risks/original-export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "risks.xlsx");
          SubMenuItemStore.exportClicked=false;
        }
      )
    }
   
  }

  exportWithTemplate(params?) {
    if(IsmsRisksStore.corporate){
      this._http.get('/corporate-isms-risks/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "risks.xlsx");
        }
      )
    }
    else{
      this._http.get('/isms-risks/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "risks.xlsx");
        }
      )
    }
   
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/isms-risks/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','risks_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }
  importCorporateData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/corporate-isms-risks/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','risks_corporate_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

}
