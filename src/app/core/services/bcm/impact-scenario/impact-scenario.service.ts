import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImpactScenarioPaginationResponse, IndividualImpactScenario } from 'src/app/core/models/bcm/impact-scenario/impact-scenario';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImpactScenarioStore } from 'src/app/stores/bcm/configuration/impact-scenario/impact-scenario-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImpactScenarioService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService
              ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ImpactScenarioPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImpactScenarioStore.currentPage}`;
      if (ImpactScenarioStore.orderBy) params += `&order=${ImpactScenarioStore.orderBy}`;
      if (ImpactScenarioStore.orderItem) params += `&order_by=${ImpactScenarioStore.orderItem}`;
      if (ImpactScenarioStore.searchText) params += `&q=${ImpactScenarioStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (status) params += (params ? '&' : '?')+'status=all';
    if(ImpactScenarioStore.searchText) params += (params ? '&q=' : '?q=')+ImpactScenarioStore.searchText;
    return this._http.get<ImpactScenarioPaginationResponse>('/impact-scenarios' + (params ? params : '')).pipe(
      map((res: ImpactScenarioPaginationResponse) => {
        ImpactScenarioStore.setImpactScenarioDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualImpactScenario> {
    return this._http.get<IndividualImpactScenario>('/impact-scenarios/' + id).pipe(
      map((res: IndividualImpactScenario) => {
        ImpactScenarioStore.setIndividualImpactScenario(res);
       
        return res;
      })
    );
  }

  updateItem(scenario_id:number, scenario): Observable<any> {
    return this._http.put('/impact-scenarios/'+ scenario_id, scenario).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_updated');
        
        this.getItems(false,null,true).subscribe();

        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/impact-scenarios', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_added');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/impact-scenarios/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_deleted');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/impact-scenarios/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/impact-scenarios/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/impact-scenarios/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_scenario_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/impact-scenarios/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_scenario') + ".xlsx");
      }
    )
  }


  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/impact-scenarios/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','impact_scenarios_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  shareData(data){
    return this._http.post('/impact-scenarios/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'impact_scenarios_shared');
        return res;
      })
    )
  }

  sortImpactScenarioList(type:string, text:string) {
    if (!ImpactScenarioStore.orderBy) {
      ImpactScenarioStore.orderBy = 'asc';
      ImpactScenarioStore.orderItem = type;
    }
    else{
      if (ImpactScenarioStore.orderItem == type) {
        if(ImpactScenarioStore.orderBy == 'asc') ImpactScenarioStore.orderBy = 'desc';
        else ImpactScenarioStore.orderBy = 'asc'
      }
      else{
        ImpactScenarioStore.orderBy = 'asc';
        ImpactScenarioStore.orderItem = type;
      }
    }
  }
}
