import { Injectable } from '@angular/core';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import { Risk, RiskPaginationResponse, IndividualRisk, ContextChart } from 'src/app/core/models/hira/hira-register/hira';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';


@Injectable({
  providedIn: 'root'
})
export class HiraService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }
  
    getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RisksStore.currentPage}`;
        if (RisksStore.orderBy) params += `&order=${RisksStore.orderBy}`;
        if (RisksStore.orderItem) params += `&order_by=${RisksStore.orderItem}`;
        if (RisksStore.searchText) params += `&q=${RisksStore.searchText}`;
        // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
      }
  
      if(additionalParams){
        params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
        // else params += `?${additionalParams}`;
      }
      if(RisksStore.is_registered==true){
        params=(params=='')?params+'?is_registered=true':params+'&is_registered=true';
      }
      else if(RisksStore.is_registered==false){
        params=(params=='')?params+'?is_registered=false':params+'&is_registered=false';
      }
      // if(RisksStore.searchText) params += (params ? '&q=' : '?q=')+RisksStore.searchText;
      if((RightSidebarLayoutStore.filterPageTag == 'risk' || RightSidebarLayoutStore.filterPageTag == 'risk_heat_map' || 
      RightSidebarLayoutStore.filterPageTag == 'heap_by_category' || RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'
      || RightSidebarLayoutStore.filterPageTag == 'heap_by_department' || RightSidebarLayoutStore.filterPageTag == 'heap_by_section' || 
      RightSidebarLayoutStore.filterPageTag == 'heap_by_division') && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      if(RisksStore.corporate){
        return this._http.get<RiskPaginationResponse>('/corporate-risks' + (params ? params : '')).pipe(
          map((res: RiskPaginationResponse) => {
            RisksStore.setRiskDetails(res);
            return res;
          })
        );
      }
      else{
        return this._http.get<RiskPaginationResponse>('/risks' + (params ? params : '')).pipe(
          map((res: RiskPaginationResponse) => {
            RisksStore.setRiskDetails(res);
            return res;
          })
        );
      }
    
    }
  
    getItem(id: number): Observable<IndividualRisk> {
      return this._http.get<IndividualRisk>('/risks/' + id).pipe(
        map((res: IndividualRisk) => {
          res.is_analysis_performed = typeof(res.is_analysis_performed)=='string'?parseInt(res.is_analysis_performed):res.is_analysis_performed;
          res.is_residual_analysis_performed = typeof(res.is_residual_analysis_performed)=='string'?parseInt(res.is_residual_analysis_performed):res.is_residual_analysis_performed;
          RisksStore.setIndividualRiskDetails(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }
  
    updateItem(risk_id:number, risk: Risk): Observable<any> {
      return this._http.put('/risks/'+ risk_id, risk).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_updated');
          
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
  
    makeCorporate(riskArray): Observable<any> {
      return this._http.put('/corporate-risks/update', riskArray).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'selected_risk_corporate');
          
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
  
    makeFunctional(riskArray): Observable<any> {
      return this._http.put('/risks/update-functional', riskArray).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'selected_risk_functional');
          
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
  
  
    saveItem(risk): Observable<any> {
      return this._http.post('/risks', risk).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_added');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    delete(id: number) {
      return this._http.delete('/risks/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_deleted');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    getContextChart(id: number): Observable<ContextChart> {
      return this._http.get<ContextChart>('/risks/' + id+'/analyses/charts').pipe(
        map((res: ContextChart) => {
          RisksStore.setContextChartDetails(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }
  
       /**
     * Sort Risk List
     * @param type Sort By Variable
     */
    sortRiskList(type, callList: boolean = true) {
      if (!RisksStore.orderBy) {
        RisksStore.orderBy = 'asc';
        RisksStore.orderItem = type;
      }
      else {
        if (RisksStore.orderItem == type) {
          if (RisksStore.orderBy == 'asc') RisksStore.orderBy = 'desc';
          else RisksStore.orderBy = 'asc'
        }
        else {
          RisksStore.orderBy = 'asc';
          RisksStore.orderItem = type;
        }
      }
      if (callList)
        this.getItems().subscribe();
    }
  
    
    // closeTreatment(){
      closeRisk(id): Observable<any> {
        return this._http.put('/risks/'+id+'/close', id).pipe(
          map(res => {
            this._utilityService.showSuccessMessage('success', 'risk_closed');
    
            this.getItems().subscribe();
    
            return res;
          })
        );
      // }
    }
  
    saveRiskId(id:number){
      RisksStore.setRiskId(id);
    }
  
    generateTemplate() {
      this._http.get('/risks/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "risks-template.xlsx");
        }
      )
    }
  
    exportToExcel(params?) {
      if(RisksStore.corporate){
        this._http.get('/corporate-risks/original-export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, "risks.xlsx");
            SubMenuItemStore.exportClicked=false;
          }
        )
      }
      else{
        this._http.get('/risks/original-export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, "risks.xlsx");
            SubMenuItemStore.exportClicked=false;
          }
        )
      }
     
    }
  
    exportWithTemplate(params?) {
      if((RightSidebarLayoutStore.filterPageTag == 'risk' || RightSidebarLayoutStore.filterPageTag == 'risk_heat_map' || 
      RightSidebarLayoutStore.filterPageTag == 'heap_by_category' || RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'
      || RightSidebarLayoutStore.filterPageTag == 'heap_by_department' || RightSidebarLayoutStore.filterPageTag == 'heap_by_section' || 
      RightSidebarLayoutStore.filterPageTag == 'heap_by_division') && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      if(RisksStore.corporate){
        this._http.get('/corporate-risks/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, "risks.xlsx");
          }
        )
      }
      else{
        this._http.get('/risks/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, "risks.xlsx");
          }
        )
      }
     
    }
    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risks/import',data).pipe(
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
      return this._http.post('/corporate-risks/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','risks_corporate_imported');
          this.getItems(false,null).subscribe();
          return res;
        })
      )
    }
  
}
