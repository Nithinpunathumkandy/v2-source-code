import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { StrategyInitiativeActionsMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-actions.store';
import { StrategyInitiativeActions, StrategyInitiativeActionsPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-initiative-actions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrategyInitiativeActionsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StrategyInitiativeActionsPaginationResponse> {
    let params = '';
    if (!getAll) {
    params = `?page=${StrategyInitiativeActionsMasterStore.currentPage}`;
    if (StrategyInitiativeActionsMasterStore.orderBy) params += `&order=${StrategyInitiativeActionsMasterStore.orderBy}`;
    if (StrategyInitiativeActionsMasterStore.orderItem) params += `&order_by=${StrategyInitiativeActionsMasterStore.orderItem}`;
    if (StrategyInitiativeActionsMasterStore.searchText) params += `&q=${StrategyInitiativeActionsMasterStore.searchText}`;
    }
    if (StrategyInitiativeActionsMasterStore.searchText) params += (params ? '&q=' : '?q=') + StrategyInitiativeActionsMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<StrategyInitiativeActionsPaginationResponse>('/strategy-initiative-actions' + (params ? params : '')).pipe(
      map((res: StrategyInitiativeActionsPaginationResponse) => {
        StrategyInitiativeActionsMasterStore.setStrategyInitiativeActions(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<StrategyInitiativeActions[]> {
    return this._http.get<StrategyInitiativeActions[]>('/strategy-initiative-actions').pipe((
      map((res:StrategyInitiativeActions[])=>{
        StrategyInitiativeActionsMasterStore.setAllStrategyInitiativeActions(res);
        return res;
      })
    ))
  }

  activate(id: number) {
    return this._http.put('/strategy-initiative-actions/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_initiative_actions_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/strategy-initiative-actions/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_initiative_action_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/strategy-initiative-actions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_actions')
        +".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/strategy-initiative-actions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_actions')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/strategy-initiative-actions/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/strategy-initiative-actions/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','strategic_initiative_action_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  saveItem(item: StrategyInitiativeActions) {
    return this._http.post('/strategy-initiative-actions', item).pipe(
      map((res:any )=> {
        StrategyInitiativeActionsMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','strategic_initiative_action_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: StrategyInitiativeActions): Observable<any> {
    return this._http.put('/strategy-initiative-actions/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_initiative_action_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/strategy-initiative-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_initiative_action_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            StrategyInitiativeActionsMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  sortStrategicInitiativeActionList(type:string, text:string) {
    if (!StrategyInitiativeActionsMasterStore.orderBy) {
      StrategyInitiativeActionsMasterStore.orderBy = 'asc';
      StrategyInitiativeActionsMasterStore.orderItem = type;
    }
    else{
      if (StrategyInitiativeActionsMasterStore.orderItem == type) {
        if(StrategyInitiativeActionsMasterStore.orderBy == 'asc') StrategyInitiativeActionsMasterStore.orderBy = 'desc';
        else StrategyInitiativeActionsMasterStore.orderBy = 'asc'
      }
      else{
        StrategyInitiativeActionsMasterStore.orderBy = 'asc';
        StrategyInitiativeActionsMasterStore.orderItem = type;
      }
    }
  }

}
