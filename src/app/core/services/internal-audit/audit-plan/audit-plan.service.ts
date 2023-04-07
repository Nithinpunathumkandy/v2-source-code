import { Injectable } from '@angular/core';
import { AuditPlan,AuditPlanPaginationResponse, Schedules } from 'src/app/core/models/internal-audit/audit-plan/audit-plan';
import {AuditPlanStore} from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditPlanService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    acceptAudit(id: any) {
      return this._http.put('/audit-plans/'+id+'/accept','').pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'Audit successfully published');
          return res;
        })
      );
    }

    auditPublish(id: any) {
      return this._http.put('/audit-plans/'+id+'/publish','').pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'Audit successfully published');
          return res;
        })
      );
    }
    getItems(getAll: boolean = false, additionalParams?: string,status:boolean = false): Observable<AuditPlanPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditPlanStore.currentPage}`;
        if (AuditPlanStore.orderBy) params += `&order_by=${AuditPlanStore.orderItem}&order=${AuditPlanStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditPlanStore.searchText) params += (params ? '&q=' : '?q=')+AuditPlanStore.searchText;
      if(status) params += `&status=all`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_plans' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditPlanPaginationResponse>('/audit-plans' + (params ? params : '')).pipe(
        map((res: AuditPlanPaginationResponse) => {
          AuditPlanStore.setAuditPlan(res);
          return res;
        })
      );
    }
  
    getAllItems(): Observable<AuditPlan[]>{
      return this._http.get<AuditPlan[]>('/audit-plans?is_all=true').pipe(
        map((res: AuditPlan[]) => {
          
          AuditPlanStore.setAllAuditPlan(res);
          return res;
        })
      );
    }


    setDocumentDetails(imageDetails,url){
      AuditPlanStore.setDocumentDetails(imageDetails,url);
    }

    setAuditPlanId(id){
      AuditPlanStore.setAuditPlanId(id)
    }


    getItem(id): Observable<AuditPlan> {
      return this._http.get<AuditPlan>('/audit-plans/'+id).pipe((
        map((res:AuditPlan)=>{
          AuditPlanStore.setIndividualAuditPlan(res);
          return res;
        })
      ))
    } 

    setSelected(id){
      AuditPlanStore.setSelected(id);
    }

    getAuditPlanSchedule(auditSchedule) {
      AuditPlanStore.setauditPlanSchedule(auditSchedule);
    }


    saveAuditPlanId(id:number){
      AuditPlanStore.setAuditPlanId(id);}

    selectRequiredObjective(objective) {
      
      var objectiveToDisplay = [];
      for(let i of objective){
          let obj = { id:i.id,title: i.title}
            objectiveToDisplay.push(obj);
        
     }
     
     AuditPlanStore.addSelectedObjective(objective,objectiveToDisplay);
    }

     selectRequiredCriteria(criteria){
      var criteriaToDisplay = [];
      for(let i of criteria){
        let obj = { id:i.id,title: i.title}
          criteriaToDisplay.push(obj);
   }
   AuditPlanStore.addSelectedCriteria(criteria,criteriaToDisplay);

    }
  
    saveItem(item: any) {
      return this._http.post('/audit-plans', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_audit_plans');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/audit-plans/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_audit_plan');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    
    delete(id: number) {
      return this._http.delete('/audit-plans/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_audit_plan');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditPlanStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
  
          return res;
        })
      );
    }
  
    activate(id: number) {
      return this._http.put('/audit-plans/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_audit_plan');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/audit-plans/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_audit_plan');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/audit-plans/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plan_template')+".xlsx");          
        }
      )
    }

    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/audit-plans/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','audit_plan_imported');
          return res;
        })
      )
    }
  
    exportToExcel(params:string='') {
      // let params = '';
      if (AuditPlanStore.orderBy) params += `?order=${AuditPlanStore.orderBy}`;
      if (AuditPlanStore.orderItem) params += `&order_by=${AuditPlanStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_plans' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/audit-plans/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plan')+".xlsx");     
        }
      )
    }
  
    sortAuditPlanlList(type:string, text:string) {
      if (!AuditPlanStore.orderBy) {
        AuditPlanStore.orderBy = 'asc';
        AuditPlanStore.orderItem = type;
      }
      else{
        if (AuditPlanStore.orderItem == type) {
          if(AuditPlanStore.orderBy == 'asc') AuditPlanStore.orderBy = 'desc';
          else AuditPlanStore.orderBy = 'asc'
        }
        else{
          AuditPlanStore.orderBy = 'asc';
          AuditPlanStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
    
  }
  
  
  