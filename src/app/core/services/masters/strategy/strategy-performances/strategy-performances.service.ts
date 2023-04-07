import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyPerformancesMasterStore } from 'src/app/stores/masters/strategy/strategy-performance.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyPerformances, StrategyPerformancesPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-performance.model';

@Injectable({
  providedIn: 'root'
})
export class StrategyPerformancesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<StrategyPerformancesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyPerformancesMasterStore.currentPage}`;
        if (StrategyPerformancesMasterStore.orderBy) params += `&order_by=${StrategyPerformancesMasterStore.orderItem}&order=${StrategyPerformancesMasterStore.orderBy}`;

      }
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(StrategyPerformancesMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyPerformancesMasterStore.searchText;
      return this._http.get<StrategyPerformancesPaginationResponse>('/strategy-performances' + (params ? params : '')).pipe(
        map((res: StrategyPerformancesPaginationResponse) => {
          StrategyPerformancesMasterStore.setstrategyPerformances(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<StrategyPerformances[]>{
      return this._http.get<StrategyPerformances[]>('/strategy-performances?is_all=true').pipe(
        map((res: StrategyPerformances[]) => {
          
          StrategyPerformancesMasterStore.setAllstrategyPerformances(res);
          return res;
        })
      );
    }

    saveItem(item: StrategyPerformances) {
      return this._http.post('/strategy-performances', item).pipe(
        map((res:any )=> {
          StrategyPerformancesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'strategy_performances_add_added');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: StrategyPerformances): Observable<any> {
      return this._http.put('/strategy-performances/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_performances_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/strategy-performances/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_performances_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              StrategyPerformancesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/strategy-performances/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_performances_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/strategy-performances/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_performances_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/strategy-performances/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_performances_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/strategy-performances/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_performances')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/strategy-performances/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'common_share_toast');
          return res;
        })
      )
    }

    sortPerformanceslList(type:string, text:string) {
      if (!StrategyPerformancesMasterStore.orderBy) {
        StrategyPerformancesMasterStore.orderBy = 'asc';
        StrategyPerformancesMasterStore.orderItem = type;
      }
      else{
        if (StrategyPerformancesMasterStore.orderItem == type) {
          if(StrategyPerformancesMasterStore.orderBy == 'asc') StrategyPerformancesMasterStore.orderBy = 'desc';
          else StrategyPerformancesMasterStore.orderBy = 'asc'
        }
        else{
          StrategyPerformancesMasterStore.orderBy = 'asc';
          StrategyPerformancesMasterStore.orderItem = type;
        }
      }
    }
}
