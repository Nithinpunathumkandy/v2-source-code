import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ControlEfficiencyMeasures,ControlEfficiencyMeasuresPaginationResponse,ControlEfficiencyMeasuresSingle } from 'src/app/core/models/masters/risk-management/control-efficiency-measures';
import{ControlEfficiencyMeasuresMasterStore} from 'src/app/stores/masters/risk-management/control-efficiency-measures-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ControlEfficiencyMeasuresService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ControlEfficiencyMeasuresPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ControlEfficiencyMeasuresMasterStore.currentPage}`;
        if (ControlEfficiencyMeasuresMasterStore.orderBy) params += `&order_by=${ControlEfficiencyMeasuresMasterStore.orderItem}&order=${ControlEfficiencyMeasuresMasterStore.orderBy}`;
      }
      if(ControlEfficiencyMeasuresMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlEfficiencyMeasuresMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ControlEfficiencyMeasuresPaginationResponse>('/control-efficiency-measures' + (params ? params : '')).pipe(
        map((res: ControlEfficiencyMeasuresPaginationResponse) => {
          ControlEfficiencyMeasuresMasterStore.setControlEfficiencyMeasures(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ControlEfficiencyMeasures[]> {
      return this._http.get<ControlEfficiencyMeasures[]>('/control-efficiency-measures').pipe((
        map((res:ControlEfficiencyMeasures[])=>{
          ControlEfficiencyMeasuresMasterStore.setAllControlEfficiencyMeasures(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<ControlEfficiencyMeasuresSingle> {
      return this._http.get<ControlEfficiencyMeasuresSingle>('/control-efficiency-measures/'+id).pipe((
        map((res:ControlEfficiencyMeasuresSingle)=>{
          ControlEfficiencyMeasuresMasterStore.setIndividualControlEfficiencyMeasures(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/control-efficiency-measures', item).pipe(
        map((res:any )=> {
          ControlEfficiencyMeasuresMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'control_efficiency_measures_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/control-efficiency-measures/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'control_efficiency_measures_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/control-efficiency-measures/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'control_efficiency_measures_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ControlEfficiencyMeasuresMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/control-efficiency-measures/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'control_efficiency_measures_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/control-efficiency-measures/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'control_efficiency_measures_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/control-efficiency-measures/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_efficiency_measures')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/control-efficiency-measures/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    sortControlEfficiencyMeasuresList(type:string, text:string) {
      if (!ControlEfficiencyMeasuresMasterStore.orderBy) {
        ControlEfficiencyMeasuresMasterStore.orderBy = 'asc';
        ControlEfficiencyMeasuresMasterStore.orderItem = type;
      }
      else{
        if (ControlEfficiencyMeasuresMasterStore.orderItem == type) {
          if(ControlEfficiencyMeasuresMasterStore.orderBy == 'asc') ControlEfficiencyMeasuresMasterStore.orderBy = 'desc';
          else ControlEfficiencyMeasuresMasterStore.orderBy = 'asc'
        }
        else{
          ControlEfficiencyMeasuresMasterStore.orderBy = 'asc';
          ControlEfficiencyMeasuresMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }

}
