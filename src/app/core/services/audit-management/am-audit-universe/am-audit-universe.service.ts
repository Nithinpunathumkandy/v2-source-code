import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditableItemObjectives, AmAuditableItemProcesses, AmAuditableItemRisks,AmAuditableItemDepartments } from 'src/app/core/models/audit-management/am-audit-plan/am-auditable-item';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditUniverseStore } from 'src/app/stores/audit-management/am-audit-universe/am-audit-universe.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
// import { AmAuditUniverseStore } from 'src/app/stores/audit-management/am-audit-plan/am-auditable-item.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditUniverseService {

  
  constructor(private _http:HttpClient,private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }

   getProcesses(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemProcesses> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditUniverseStore.processCurrentPage}`;
      if (AmAuditUniverseStore.orderBy) params += `&order=${AmAuditUniverseStore.orderBy}`;
      if (AmAuditUniverseStore.orderItem) params += `&order_by=${AmAuditUniverseStore.orderItem}`;
      if (AmAuditUniverseStore.searchText) params += `&q=${AmAuditUniverseStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_process' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditableItemProcesses>('/am-audit-universes/processes' + (params ? params : '')).pipe(
      map((res: AmAuditableItemProcesses) => {
        AmAuditUniverseStore.setAuditUniverseProcesses(res);
        return res;
      })
    );
  }
  getRisks(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemRisks> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditUniverseStore.riskCurrentPage}`;
      if (AmAuditUniverseStore.riskOrderBy) params += `&order=${AmAuditUniverseStore.riskOrderBy}`;
      if (AmAuditUniverseStore.riskOrderItem) params += `&order_by=${AmAuditUniverseStore.riskOrderItem}`;
      if (AmAuditUniverseStore.riskSearchText) params += `&q=${AmAuditUniverseStore.riskSearchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_risk' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditableItemRisks>('/am-audit-universes/risks' + (params ? params : '')).pipe(
      map((res: AmAuditableItemRisks) => {
        AmAuditUniverseStore.setAuditUniverseRisks(res);
        return res;
      })
    );
  }
  getStrategicObjectives(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemObjectives> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditUniverseStore.objectiveCurrentPage}`;
      if (AmAuditUniverseStore.objectiveOrderBy) params += `&order=${AmAuditUniverseStore.objectiveOrderBy}`;
      if (AmAuditUniverseStore.objectiveOrderItem) params += `&order_by=${AmAuditUniverseStore.objectiveOrderItem}`;
      if (AmAuditUniverseStore.objectiveSearchText) params += `&q=${AmAuditUniverseStore.objectiveSearchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_strategic' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditableItemObjectives>('/am-audit-universes/strategic-objectives' + (params ? params : '')).pipe(
      map((res: AmAuditableItemObjectives) => {
        AmAuditUniverseStore.setAuditUniverseObjectives(res);
        return res;
      })
    );
  }
  getDepartments(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemDepartments> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditUniverseStore.departmentCurrentPage}`;
      if (AmAuditUniverseStore.departmentOrderBy) params += `&order=${AmAuditUniverseStore.departmentOrderBy}`;
      if (AmAuditUniverseStore.departmentOrderItem) params += `&order_by=${AmAuditUniverseStore.departmentOrderItem}`;
      if (AmAuditUniverseStore.departmentSearchText) params += `&q=${AmAuditUniverseStore.departmentSearchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_department' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditableItemDepartments>('/am-audit-universes/departments' + (params ? params : '')).pipe(
      map((res: AmAuditableItemDepartments) => {
        AmAuditUniverseStore.setAuditUniverseDepartments(res);
        return res;
      })
    );
  }
  processExportToExcel() {
    let params = '';
    if (AmAuditUniverseStore.orderBy) params += `?order=${AmAuditUniverseStore.orderBy}`;
    if (AmAuditUniverseStore.orderItem) params += `&order_by=${AmAuditUniverseStore.orderItem}`;
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_process' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);   
    this._http.get('/am-audit-universes/processes/export'+params,  { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_universe_processes')+".xlsx");     
        SubMenuItemStore.exportClicked=false;
      }
    )
}

riskExportToExcel() {
  let params = '';
  if (AmAuditUniverseStore.riskOrderBy) params += `?order=${AmAuditUniverseStore.riskOrderBy}`;
  if (AmAuditUniverseStore.riskOrderItem) params += `&order_by=${AmAuditUniverseStore.riskOrderItem}`;
  if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_risk' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);  
  this._http.get('/am-audit-universes/risks/export'+params,  { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_universe_risks')+".xlsx");     
      SubMenuItemStore.exportClicked=false;
    }
  )
}

objectiveExportToExcel() {
  let params = '';
  if (AmAuditUniverseStore.objectiveOrderBy) params += `?order=${AmAuditUniverseStore.objectiveOrderBy}`;
  if (AmAuditUniverseStore.objectiveOrderItem) params += `&order_by=${AmAuditUniverseStore.objectiveOrderItem}`;
  if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_strategic' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);  
  this._http.get('/am-audit-universes/strategic-objectives/export'+params,  { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_universe_strategic_objectives')+".xlsx");     

      SubMenuItemStore.exportClicked=false;
    }
  )
}
departmentExportToExcel() {
  let params = '';
  if (AmAuditUniverseStore.departmentOrderBy) params += `?order=${AmAuditUniverseStore.departmentOrderBy}`;
  if (AmAuditUniverseStore.departmentOrderItem) params += `&order_by=${AmAuditUniverseStore.departmentOrderItem}`;
  if (RightSidebarLayoutStore.filterPageTag == 'am_audit_universe_department' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);   
  this._http.get('/am-audit-universes/departments/export'+params,  { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_universe_departments')+".xlsx");     
      SubMenuItemStore.exportClicked=false;
    }
  )
}

  saveProcesses(id,processData): Observable<any> {
    return this._http.post('/am-annual-plans/'+id+'/processes', processData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_universe_process_added');
        this.getProcesses().subscribe();
        return res;
      })
    );
  }

    
  saveRisks(id,riskData): Observable<any> {
    return this._http.post('/am-annual-plans/'+id+'/risks', riskData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_universe_risk_added');
        this.getRisks().subscribe();
        return res;
      })
    );
  }

    
  saveObjectives(id,objectiveData): Observable<any> {
    return this._http.post('/am-annual-plans/'+id+'/strategic-objectives', objectiveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_universe_objective_added');
        this.getStrategicObjectives().subscribe();
        return res;
      })
    );
  }

  saveDepartments(id,departmentData): Observable<any> {
    return this._http.post('/am-annual-plans/'+id+'/departments', departmentData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_universe_department_added');
        this.getDepartments().subscribe();
        return res;
      })
    );
  }

  sortRiskList(type:string, text:string) {
    if (!AmAuditUniverseStore.riskOrderBy) {
      AmAuditUniverseStore.riskOrderBy = 'desc';
      AmAuditUniverseStore.riskOrderItem = type;
    }
    else{
      if (AmAuditUniverseStore.riskOrderItem == type) {
        if(AmAuditUniverseStore.riskOrderBy == 'desc') AmAuditUniverseStore.riskOrderBy = 'asc';
        else AmAuditUniverseStore.riskOrderBy = 'desc'
      }
      else{
        AmAuditUniverseStore.riskOrderBy = 'desc';
        AmAuditUniverseStore.riskOrderItem = type;
      }
    }
  }

  sortProcessList(type:string, text:string) {
    if (!AmAuditUniverseStore.orderBy) {
      AmAuditUniverseStore.orderBy = 'desc';
      AmAuditUniverseStore.orderItem = type;
    }
    else{
      if (AmAuditUniverseStore.orderItem == type) {
        if(AmAuditUniverseStore.orderBy == 'desc') AmAuditUniverseStore.orderBy = 'asc';
        else AmAuditUniverseStore.orderBy = 'desc'
      }
      else{
        AmAuditUniverseStore.orderBy = 'desc';
        AmAuditUniverseStore.orderItem = type;
      }
    }
  }

  sortStrategicList(type:string, text:string) {
    if (!AmAuditUniverseStore.objectiveOrderBy) {
      AmAuditUniverseStore.objectiveOrderBy = 'desc';
      AmAuditUniverseStore.objectiveOrderItem = type;
    }
    else{
      if (AmAuditUniverseStore.objectiveOrderItem == type) {
        if(AmAuditUniverseStore.objectiveOrderBy == 'desc') AmAuditUniverseStore.objectiveOrderBy = 'asc';
        else AmAuditUniverseStore.objectiveOrderBy = 'desc'
      }
      else{
        AmAuditUniverseStore.objectiveOrderBy = 'desc';
        AmAuditUniverseStore.objectiveOrderItem = type;
      }
    }
  }

  sortDepartmentList(type:string, text:string) {
    if (!AmAuditUniverseStore.departmentOrderBy) {
      AmAuditUniverseStore.departmentOrderBy = 'desc';
      AmAuditUniverseStore.departmentOrderItem = type;
    }
    else{
      if (AmAuditUniverseStore.departmentOrderItem == type) {
        if(AmAuditUniverseStore.departmentOrderBy == 'desc') AmAuditUniverseStore.departmentOrderBy = 'asc';
        else AmAuditUniverseStore.departmentOrderBy = 'desc'
      }
      else{
        AmAuditUniverseStore.departmentOrderBy = 'desc';
        AmAuditUniverseStore.departmentOrderItem = type;
      }
    }
  }

}
