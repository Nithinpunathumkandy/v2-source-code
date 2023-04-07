import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InduvalInitiative, MilestonResponse, StrategyInitiativeResponse,InduvalMileston } from 'src/app/core/models/strategy-management/initiative.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { historyPaginationData } from 'src/app/core/models/strategy-management/strategy.model';




@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false,additionalParams?:string): Observable<StrategyInitiativeResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyInitiativeStore.currentPage}&status=all`;
      if (StrategyInitiativeStore.orderBy) params += `&order_by=${StrategyInitiativeStore.orderItem}&order=${StrategyInitiativeStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(StrategyInitiativeStore.searchText) params += (params ? '&q=' : '?q=')+StrategyInitiativeStore.searchText;
    // if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_initiative' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StrategyInitiativeResponse>('/strategy-initiatives' + (params ? params : '')).pipe(
      map((res: StrategyInitiativeResponse) => {
        StrategyInitiativeStore.setProfiles(res);
        return res;
      })
    );
 
  }


  saveStrategyInitiatives(item){
    return this._http.post('/strategy-initiatives', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }
  updateStrategyInitiatives(item,id){
    return this._http.put('/strategy-initiatives/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  
  deleteStrategyInitiatives(id){
    return this._http.delete('/strategy-initiatives/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_delete_message');
        //  this.getItems().subscribe();
        return res;
      })
    );
  }

  closeStrategyInitiatives(id){
    return this._http.put('/strategy-initiatives/'+id+'/close','').pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_close_message');
        //  this.getItems().subscribe();
        return res;
      })
    );
  }

  getInitiativeActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-initiatives/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyInitiativeStore.setHistory(res);
        return res;
      })
    );
  }

  getMilestoneActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-initiatives/' + StrategyInitiativeStore.selectedInitiativeId + '/milestones/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyInitiativeStore.setHistory(res);
        return res;
      })
    );
  }

  getActionPlanActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-initiatives/' + StrategyInitiativeStore.selectedInitiativeId + '/action-plans/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyInitiativeStore.setHistory(res);
        return res;
      })
    );
  }

  activateStrategyInitiatives(id,item){
    return this._http.put('/strategy-initiatives/'+id+'/activate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_activate_message');
        //  this.getItems().subscribe();
        return res;
      })
    );
  }

  passivateStrategyInitiatives(id,item){
    return this._http.put('/strategy-initiatives/'+id+'/passivate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_initiative_passivate_message');
        //  this.getItems().subscribe();
        return res;
      })
    );
  }

  activateMileStone(id,item){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id+'/activate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Milestone activated succesfully');
         this.getMilestons().subscribe();
        return res;
      })
    );
  }

  passivateMileStone(id,item){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id+'/passivate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Milestone passivate succesfully');
         this.getMilestons().subscribe();
        return res;
      })
    );
  }

  saveMileston(item){
    return this._http.post('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_milestone_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateMileston(item,id){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_milestone_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getMilestons(params?:string){
    return this._http.get<MilestonResponse>('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones' + (params? params: '')).pipe(
      map((res: MilestonResponse) => {
        StrategyInitiativeStore.setMilestones(res['data']);
        return res;
      })
    );
  }

  getInduvalMilestons(id){
    return this._http.get<InduvalMileston>('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id).pipe(
      map((res: InduvalMileston) => {
        // StrategyInitiativeStore.setMilestones(res['data']);
        return res;
      })
    );
  }

  saveActionPlans(item){
    return this._http.post('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_actionplan_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateActionPlans(item,id){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_actionplan_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getActionPlan(){
    return this._http.get<MilestonResponse>('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans').pipe(
      map((res: MilestonResponse) => {
        // res['data'].map(data=>{
        //   StrategyInitiativeStore.setActionPlan(data);
        // })
        StrategyInitiativeStore.setActionPlan(res);
        return res;
      })
    );
  }

  getInduvalInitiative(id){
    return this._http.get<InduvalInitiative>('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId).pipe(
      map((res: InduvalInitiative) => {
        StrategyInitiativeStore.setInduvalInitiative(res);
        return res;
      })
    );
  }

  deleteMileStone(id){
    return this._http.delete('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'sm_milestone_delete_message');
         this.getMilestons().subscribe();
        return res;
      })
    );
  }

  closeMileStone(id){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/milestones/'+id+'/close','').pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Milestone closed succesfully');
         this.getMilestons().subscribe();
        return res;
      })
    );
  }

  closeActionPlan(id){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans/'+id+'/close','').pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Action Plan closed succesfully');
         this.getActionPlan().subscribe();
        return res;
      })
    );
  }

  activateActionPlan(id,item){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans/'+id+'/activate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Action Plan activated succesfully');
         this.getActionPlan().subscribe();
        return res;
      })
    );
  }

  passivateActionPlan(id,item){
    return this._http.put('/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId+'/action-plans/'+id+'/passivate',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Action Plan passivated succesfully');
         this.getActionPlan().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/strategy-initiatives/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('Strategy Initiative') +".xlsx");
      }
    )
  }
  
  exportToExcel(params:string='') {
    let sortparams = '';
    if (StrategyInitiativeStore.orderBy) sortparams += `?order=${StrategyInitiativeStore.orderBy}`;
    if (StrategyInitiativeStore.orderItem) sortparams += `&order_by=${StrategyInitiativeStore.orderItem}`;
    // if (StrategyInitiativeStore.searchText) params += `&q=${StrategyInitiativeStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_initiative' && RightSidebarLayoutStore.filtersAsQueryString)
      sortparams = (sortparams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (sortparams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(params)sortparams=sortparams+params
    this._http.get('/strategy-initiatives/export'+ sortparams, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Strategy Initiative') +".xlsx");
      }
    )
  }

  sortStrategyInitiative(type:string, text:string) {
    if (!StrategyInitiativeStore.orderBy) {

      StrategyInitiativeStore.orderBy = 'asc';
      StrategyInitiativeStore.orderItem = type;
    }
    else{
      if (StrategyInitiativeStore.orderItem == type) {
        if(StrategyInitiativeStore.orderBy == 'asc') StrategyInitiativeStore.orderBy = 'desc';
        else StrategyInitiativeStore.orderBy = 'asc'
      }
      else{
        StrategyInitiativeStore.orderBy = 'asc';
        StrategyInitiativeStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }

}
