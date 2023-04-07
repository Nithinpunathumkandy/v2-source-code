import { Injectable } from '@angular/core';
import { ActionPlan, ActionPlanPaginationResponse  } from 'src/app/core/models/internal-audit/action-plan/action-plan';
import {ActionPlanStore} from 'src/app/stores/internal-audit/action-plan/action-plan-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(additionalParams?:string): Observable<ActionPlanPaginationResponse>{
      let params = '';
      params = `?page=${ActionPlanStore.currentPage}`;
      if(additionalParams) params += additionalParams;

      if(ActionPlanStore.searchText) params += (params ? '&q=' : '?q=')+ActionPlanStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'ia_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ActionPlanPaginationResponse>('/corrective-actions'+ (params ? params : '')).pipe(
        map((res: ActionPlanPaginationResponse) => {
          
          ActionPlanStore.setAllActionPlan(res);
          return res;
        })
      );
    }

    setDocumentDetails(imageDetails,url){
      ActionPlanStore.setDocumentDetails(imageDetails,url);
    }


    getItem(finding_id:number,id: number):
      Observable<ActionPlan> {
        return this._http.get<ActionPlan>('/findings/'+finding_id+'/corrective-actions/' + id).pipe(
          map((res: ActionPlan) => {
            ActionPlanStore.setIndividualActionPlanDetails(res);
            return res;
          })
        );

    }

    saveItem(findings_id:number,item: ActionPlan) {
      
      return this._http.post('/findings/'+findings_id+'/corrective-actions', item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'action_plan_is_added');
          return res;
        })
      );
    }

    UpdateItem(findings_id:number, id:number,item: ActionPlan) {
      
      return this._http.put('/findings/'+findings_id+'/corrective-actions/'+id, item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'update_action_plan');
          return res;
        })
      );
    }


    generateTemplate() {
      this._http.get('/corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "CorrectiveActionTemplate.xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/corrective-actions/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "CorrectiveAction.xlsx");
        }
      )
    }

    deleteItem(finding_id:number, id: number){
      return this._http.delete('/findings/'+finding_id+'/corrective-actions/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'delete_action_plan_sub_title');
          this.getAllItems().subscribe(resp=>{
            if(resp.from==null){
              ActionPlanStore.setCurrentPage(resp.current_page-1);
              this.getAllItems().subscribe();
            }
          });
          return res;
        })
      );
    }

}
