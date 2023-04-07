import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskControlPlan,RiskControlPlanPaginationResponse,RiskControlPlanSingle } from 'src/app/core/models/masters/risk-management/risk-control-plan';
import{RiskControlPlanMasterStore} from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskControlPlanService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskControlPlanPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskControlPlanMasterStore.currentPage}`;
        if (RiskControlPlanMasterStore.orderBy) params += `&order_by=${RiskControlPlanMasterStore.orderItem}&order=${RiskControlPlanMasterStore.orderBy}`;
      }
      if(RiskControlPlanMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskControlPlanMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskControlPlanPaginationResponse>('/risk-control-plans' + (params ? params : '')).pipe(
        map((res: RiskControlPlanPaginationResponse) => {
          RiskControlPlanMasterStore.setRiskControlPlan(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<RiskControlPlan[]> {
      return this._http.get<RiskControlPlan[]>('/risk-control-plans').pipe((
        map((res:RiskControlPlan[])=>{
          RiskControlPlanMasterStore.setAllRiskControlPlan(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<RiskControlPlanSingle> {
      return this._http.get<RiskControlPlanSingle>('/risk-control-plans/'+id).pipe((
        map((res:RiskControlPlanSingle)=>{
          RiskControlPlanMasterStore.setIndividualRiskControlPlan(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-control-plans', item).pipe(
        map((res:any )=> {
          RiskControlPlanMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'risk_control_plan_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-control-plans/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_control_plan_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-control-plans/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_control_plan_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskControlPlanMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-control-plans/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_control_plan_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-control-plans/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_control_plan_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-control-plans/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_control_plan')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-control-plans/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    sortRiskControlPlanList(type:string, text:string) {
      if (!RiskControlPlanMasterStore.orderBy) {
        RiskControlPlanMasterStore.orderBy = 'asc';
        RiskControlPlanMasterStore.orderItem = type;
      }
      else{
        if (RiskControlPlanMasterStore.orderItem == type) {
          if(RiskControlPlanMasterStore.orderBy == 'asc') RiskControlPlanMasterStore.orderBy = 'desc';
          else RiskControlPlanMasterStore.orderBy = 'asc'
        }
        else{
          RiskControlPlanMasterStore.orderBy = 'asc';
          RiskControlPlanMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
