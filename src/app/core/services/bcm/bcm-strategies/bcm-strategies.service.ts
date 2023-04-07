import { Injectable } from '@angular/core';
import { BcmStrategyStore } from 'src/app/stores/bcm/strategy/bcm-strategy-store';
import {Strategies , StrategiesPaginationResponse , StrategiesHistoryResponse} from 'src/app/core/models/bcm/bcm-strategy/strategy';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class BcmStrategiesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<StrategiesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${BcmStrategyStore.currentPage}`;
        if (BcmStrategyStore.orderBy) params += `&order_by=${BcmStrategyStore.orderItem}&order=${BcmStrategyStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(BcmStrategyStore.searchText) params += (params ? '&q=' : '?q=')+BcmStrategyStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'bcm_strategy' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      console.log(params,'param')
      return this._http.get<StrategiesPaginationResponse>('/business-continuity-strategies' + (params ? params : '')).pipe(
        map((res: StrategiesPaginationResponse) => {
          BcmStrategyStore.setStrategies(res);
          return res;
        })
      );
   
    }

    

    getAllItems(): Observable<Strategies[]>{
      return this._http.get<Strategies[]>('/business-continuity-strategies?is_all=true').pipe(
        map((res: Strategies[]) => {
          
          BcmStrategyStore.setAllStrategies(res);
          return res;
        })
      );
    }

    getStrategy(id): Observable<any>{
      return this._http.get<any>('/business-continuity-strategies/'+id).pipe(
        map((res: any) => {
          BcmStrategyStore.setStrategy(res);
          return res;
        })
      );
    }

  


    saveBusinessStrategy(item): Observable<any> {
      return this._http.post('/business-continuity-strategies', item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_stratergy_saved');
          // this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    bcStrategySolutions(id){
      return this._http.get<any>(`/bc-strategy/${id}/solutions?is_all=true`).pipe(
        map((res: any) => {
          
          BcmStrategyStore.setBcmFinance(res);
          return res;
        })
      );
    }

    updateBcStrategySolutions(id,item){
      return this._http.put<any>(`/bc-strategy/${id}/solutions`,item).pipe(
        map((res: any) => {
          this._utilityService.showSuccessMessage('success', 'bcm_solutions_saved');
          return res;
        })
      );
    }

    updateBusinessStrategy(id,item): Observable<any> {
      return this._http.put('/business-continuity-strategies/'+id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_stratergy_updated');
          return res;
        })
      );
    }

    businessFinanceGet(){
      return this._http.get<any>('/bcs-finances?is_all=true').pipe(
        map((res: any) => {
          
          BcmStrategyStore.setBcmFinance(res);
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/business-continuity-strategies/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_stratergy_deleted');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              BcmStrategyStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
          return res;
        })
      );
    }

    exportToExcel() {
      let params = '';
      if (BcmStrategyStore.orderBy) params += `?order=${BcmStrategyStore.orderBy}`;
      if (BcmStrategyStore.orderItem) params += `&order_by=${BcmStrategyStore.orderItem}`;
      // if (BcmStrategyStore.searchText) params += `&q=${BcmStrategyStore.searchText}`;
      if(RightSidebarLayoutStore.filterPageTag == 'bcm_strategy' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/business-continuity-strategies/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_strategy')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/business-continuity-strategies/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_strategy')+".xlsx");
        }
      )
    }

    getBcStrategySolutions(ids){
      return this._http.get<any>(`/bc-strategy-solutions?bcp_strategy_ids=${ids}`).pipe(
        map((res: any) => {
          return res;
        })
      );
    }


    sortBcsList(type:string) {
      if (!BcmStrategyStore.orderBy) {
        BcmStrategyStore.orderBy = 'asc';
        BcmStrategyStore.orderItem = type;
      }
      else{
        if (BcmStrategyStore.orderItem == type) {
          if(BcmStrategyStore.orderBy == 'asc') BcmStrategyStore.orderBy = 'desc';
          else BcmStrategyStore.orderBy = 'asc'
        }
        else{
          BcmStrategyStore.orderBy = 'asc';
          BcmStrategyStore.orderItem = type;
        }
      }
    }

    strategyWorkFlow(id){
      return this._http.get<any>(`/business-continuity-strategies/${id}/workflow`).pipe(
        map((res: any) => {
          BcmStrategyStore.setWorkflow(res);
          return res;
        })
      );
    }

    strategyWorkFlowHistory(getAll: boolean = false,additionalParams?:string,id?:number) : Observable<StrategiesHistoryResponse>{
      let params = '';
      if (!getAll) {
        params = `?page=${BcmStrategyStore.historyPage}`;
      }
      if(additionalParams) params += additionalParams;
      if(BcmStrategyStore.searchText) params += (params ? '&q=' : '?q=')+BcmStrategyStore.searchText;
      return this._http.get<StrategiesHistoryResponse>(`/business-continuity-strategies/${id}/workflow-history` + (params ? params : '')).pipe(
        map((res: StrategiesHistoryResponse) => {
          BcmStrategyStore.setWorkflowHistory(res);
          return res;
        })
      );
    }


    // workflow parts

    open(id){
      return this._http.put(`/bc-strategy/8/solutions/${id}/open`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_solution_opened');
          return res;
        })
      );
    }

    reject(id){
      return this._http.put(`/bc-strategy/8/solutions/${id}/reject`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_solution_rejected');
          return res;
        })
      );
    }

    approve(id){
      return this._http.put(`/bc-strategy/8/solutions/${id}/approve`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_solution_approved');
          return res;
        })
      );
    }

    onHold(id){
      return this._http.put(`/bc-strategy/8/solutions/${id}/on-hold`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_solution_holded');
          return res;
        })
      );
    }


    // strategy workflow

    strategyApprove(id){
      return this._http.put(`/business-continuity-strategies/${id}/approve`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_approved');
          return res;
        })
      );
    }

    strategyRevert(id,data){
      return this._http.put(`/business-continuity-strategies/${id}/revert`,data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_reverted');
          return res;
        })
      );
    }

    strategyReject(id){
      return this._http.put(`/business-continuity-strategies/${id}/reject`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_rejected');
          return res;
        })
      );
    }

    strategySubmit(id){
      return this._http.put(`/business-continuity-strategies/${id}/submit`, null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcm_strategy_submited');
          return res;
        })
      );
    }
  

}
