import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { StrategyMapping } from 'src/app/core/models/strategy-management/strategy-mapping';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { Observable } from 'rxjs';
import { StrategyProfileMappingStore } from 'src/app/stores/strategy-management/strategy-profile-mapping-store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class StrategyMappingService {

  constructor(
    private http:HttpClient,private _utilityService:UtilityService,
  ) { }

  getItem(id):Observable<StrategyMapping>{
    return this.http.get<StrategyMapping>('/strategy-mappings/'+id).pipe((
      map((res:StrategyMapping)=>{
        StrategyMappingStore.setIndividualStrategyMapping(res);
        return res;
      })
    ))
  }

  getItems(getAll: boolean = false, additionalParams?: string) {
    let params = '';
    if (additionalParams) {
      if (params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if (StrategyProfileMappingStore.searchText) params += (params ? '&q=' : '?q=') + StrategyProfileMappingStore.searchText;
    return this.http.get('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/mapping').pipe(
      map((res) => {
        StrategyProfileMappingStore.setStrategyProfileMappingDetails(res);
        return res;
      })
    );
  }

  saveProcessForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveTrainingMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/training-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveServiceForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/service-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveAssetForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/asset-mapping', saveData).pipe(
      map(res => {
        
        return res;
      })
    );
  }

  saveProductForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/product-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveAuditFindingForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/audit-finding-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveIncidentForMapping(saveData): Observable<any>{
   
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/incident-management-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
  }

  saveProjectManagementForMapping(saveData): Observable<any>{
   
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/project-management-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
  }

  saveProjectMonitoringForMapping(saveData): Observable<any>{
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/project-monitoring-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveDocumentForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/document-mapping', saveData).pipe(
      map(res => {
        
        return res;
      })
    );
  }

  saveRiskForMapping(saveData): Observable<any> {
    return this.http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +'/risk-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/process-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_process_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteTrainingMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/training-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_training_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteServiceMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId +  '/service-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_service_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }


  deleteIssueMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_issue_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteAssetMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/asset-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_asset_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/product-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_product_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteDocumentMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/document-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_issue_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteRiskMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/risk-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_risk_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteAuditFindingMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/audit-finding-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_audit_finding_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIncidentMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId+'/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/incident-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_incident_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteIProjectManagementMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId+'/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/project-management-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_project_management_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMonitoringMapping(id) {
    return this.http.put('/strategy-profiles/' + StrategyStore.strategyProfileId+'/focus-areas/' + StrategyStore.focusAreaId +'/objectives/' + StrategyStore.objectiveId + '/project-monitoring-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'strategy_project_monitoring_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getProfileObjectives(additionalParams?:string){
    let params = '';
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this.http.get<any>('/strategy-profile-objectives' +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyMappingStore.setObjectives(res);
        return res;
      })
    ))
  }

  getProfileInitiatives(additionalParams?:string){
    let params = '';
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this.http.get<any>('/strategy-initiatives' +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyMappingStore.setInitiatives(res);
        return res;
      })
    ))
  }

  getObjectiveByObjectiveType(additionalParams?:string){
    let params = '';
    if(additionalParams) params += additionalParams;
    return this.http.get<any>('/strategy-profile-objectives-by-objective-type' +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyMappingStore.setObjectiveByType(res);
        return res;
      })
    ))
  }

  getObjectiveType(additionalParams?:string){
    let params = '';
    if(additionalParams) params += additionalParams;
    return this.http.get('/strategy-objective-types/childObjective'+(params?params:'')).pipe(
      map((res) => {
        StrategyMappingStore.setObjectiveTypes(res);
        return res;
      })
    );
  }

  getRoleWise(additionalParams?:string){
    let params = '';
    if(additionalParams) params += additionalParams;
    return this.http.get<any>('/strategy-organization-charts/user-wise' +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyMappingStore.setRoleWise(res);
        return res;
      })
    ))
  }

  getDepartmentWise(){
    return this.http.get<any>('/strategy-organization-charts/department-wise').pipe((
      map((res:any)=>{
        StrategyMappingStore.setDepartmentWise(res['primary']);
        return res;
      })
    ))
  }

  getFocusAreaDetail(profileId,id){
    return this.http.get<any>('/strategy-profiles/'+profileId+'/focus-areas/'+id).pipe((
      map((res:any)=>{
        StrategyMappingStore.setFocusArea(res);
        return res;
      })
    ))
  }

  getStandardView(profileId){;
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this.http.get<any>('/strategy_profile_focus_area/standarview/'+profileId +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyMappingStore.setStandardView(res);
        return res;
      })
    ))
  }

}
