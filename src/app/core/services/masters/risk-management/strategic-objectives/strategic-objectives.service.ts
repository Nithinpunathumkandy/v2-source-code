import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Strategic , StrategicObjectivesPaginationResponse} from 'src/app/core/models/masters/risk-management/strategic-objectives';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StrategicObjectivesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<StrategicObjectivesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategicObjectivesMasterStore.currentPage}`;
      if (StrategicObjectivesMasterStore.orderBy) params += `&order_by=${StrategicObjectivesMasterStore.orderItem}&order=${StrategicObjectivesMasterStore.orderBy}`;
    }
    if(StrategicObjectivesMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategicObjectivesMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<StrategicObjectivesPaginationResponse>('/strategic-objectives' + (params ? params : '')).pipe(
      map((res: StrategicObjectivesPaginationResponse) => {
        StrategicObjectivesMasterStore.setStrategicObjectives(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<Strategic[]> {
    return this._http.get<Strategic[]>('/strategic-objectives').pipe((
      map((res:Strategic[])=>{
        StrategicObjectivesMasterStore.setAllStrategic(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<Strategic> {
    return this._http.get<Strategic>('/strategic-objectives/'+id).pipe((
      map((res:Strategic)=>{
        StrategicObjectivesMasterStore.setIndividualStrategic(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/strategic-objectives', item).pipe(
      map((res:any )=> {
        StrategicObjectivesMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'strategic_objectives_added');
       if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/strategic-objectives/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_objectives_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number, position?:number) {
    return this._http.delete('/strategic-objectives/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_objectives_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            StrategicObjectivesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/strategic-objectives/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_objectives_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/strategic-objectives/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategic_objectives_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/strategic-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategic_objectives')+".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/strategic-objectives/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategic_objectives_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/strategic-objectives/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/strategic-objectives/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','strategic_objectives_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortStrategicObjectives(type:string, text:string) {
    if (!StrategicObjectivesMasterStore.orderBy) {
      StrategicObjectivesMasterStore.orderBy = 'asc';
      StrategicObjectivesMasterStore.orderItem = type;
    }
    else{
      if (StrategicObjectivesMasterStore.orderItem == type) {
        if(StrategicObjectivesMasterStore.orderBy == 'asc') StrategicObjectivesMasterStore.orderBy = 'desc';
        else StrategicObjectivesMasterStore.orderBy = 'asc'
      }
      else{
        StrategicObjectivesMasterStore.orderBy = 'asc';
        StrategicObjectivesMasterStore.orderItem = type;
      }
    }
  }


  selectRequiredLocation(issues){
   
    StrategicObjectivesMasterStore.addSelectedLocation(issues);
  }

}
