import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskImpactAreaPaginationResponse, RiskImpactAreaSingle } from 'src/app/core/models/masters/event-monitoring/event-risk-impact-areas';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskImpactAreaMasterStore } from 'src/app/stores/masters/event-monitoring/event-risk-impact-areas-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventRiskImpactAreaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskImpactAreaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskImpactAreaMasterStore.currentPage}`;
        if (RiskImpactAreaMasterStore.orderBy) params += `&order_by=${RiskImpactAreaMasterStore.orderItem}&order=${RiskImpactAreaMasterStore.orderBy}`;
      }
      if(RiskImpactAreaMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskImpactAreaMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskImpactAreaPaginationResponse>('/risk-impact-areas' + (params ? params : '')).pipe(
        map((res: RiskImpactAreaPaginationResponse) => {
          RiskImpactAreaMasterStore.setRiskImpactArea(res);
          return res;
        })
      );
    }

    getItem(id): Observable<RiskImpactAreaSingle> {
      return this._http.get<RiskImpactAreaSingle>('/risk-impact-areas/' + id).pipe(
        map((res: RiskImpactAreaSingle) => {
          RiskImpactAreaMasterStore.setIndividualRiskImpactArea(res)
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/risk-impact-areas/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    saveItem(item: any) {
      return this._http.post('/risk-impact-areas', item).pipe(
        map(res => {
          RiskImpactAreaMasterStore.setLastInsertedRiskImpactArea(res['id']);
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    
    generateTemplate() {
      this._http.get('/risk-impact-areas/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_risk_impact_area_template')+".xlsx");
        }
      )
    }
  
    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-impact-areas/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_imported');
          this.getItems(false, null, true).subscribe();
          return res;
        })
      )
    }
  
    activate(id: number) {
      return this._http.put('/risk-impact-areas/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-impact-areas/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    delete(id: number) {
      return this._http.delete('/risk-impact-areas/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','event_risk_impact_area_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskImpactAreaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }
    
  

    exportToExcel() {
      this._http.get('/risk-impact-areas/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_risk_impact_area')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-impact-areas/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskImpactAreaList(type:string, text:string) {
      if (!RiskImpactAreaMasterStore.orderBy) {
        RiskImpactAreaMasterStore.orderBy = 'asc';
        RiskImpactAreaMasterStore.orderItem = type;
      }
      else{
        if (RiskImpactAreaMasterStore.orderItem == type) {
          if(RiskImpactAreaMasterStore.orderBy == 'asc') RiskImpactAreaMasterStore.orderBy = 'desc';
          else RiskImpactAreaMasterStore.orderBy = 'asc'
        }
        else{
          RiskImpactAreaMasterStore.orderBy = 'asc';
          RiskImpactAreaMasterStore.orderItem = type;
        }
      }
    }
}