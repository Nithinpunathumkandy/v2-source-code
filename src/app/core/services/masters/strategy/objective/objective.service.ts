import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectivePaginationResponse, Objectives } from 'src/app/core/models/masters/strategy/objective.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ObjectiveMasterStore } from 'src/app/stores/masters/strategy/objective.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ObjectivePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ObjectiveMasterStore.currentPage}`;
        if (ObjectiveMasterStore.orderBy) params += `&order_by=${ObjectiveMasterStore.orderItem}&order=${ObjectiveMasterStore.orderBy}`;
  
      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(ObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=')+ObjectiveMasterStore.searchText;
      return this._http.get<ObjectivePaginationResponse>('/objectives' + (params ? params : '')).pipe(
        map((res: ObjectivePaginationResponse) => {
          ObjectiveMasterStore.setObjective(res);
          return res;
        })
      );
    }

    saveItem(item: Objectives) {
      return this._http.post('/objectives', item).pipe(
        map((res:any )=> {
          ObjectiveMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success','sm_objective_created');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Objectives): Observable<any> {
      return this._http.put('/objectives/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','sm_objective_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    delete(id: number) {
      return this._http.delete('/objectives/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','sm_objective_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ObjectiveMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
  
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/objectives/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','sm_objective_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/objectives/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','sm_objective_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    generateTemplate() {
      this._http.get('/objectives/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sm_objective_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/objectives/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sm_objective')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/objectives/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'common_share_toast');
          return res;
        })
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/objectives/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','sm_objective_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
  
    sortObjectiveList(type:string, text:string) {
      if (!ObjectiveMasterStore.orderBy) {
        ObjectiveMasterStore.orderBy = 'asc';
        ObjectiveMasterStore.orderItem = type;
      }
      else{
        if (ObjectiveMasterStore.orderItem == type) {
          if(ObjectiveMasterStore.orderBy == 'asc') ObjectiveMasterStore.orderBy = 'desc';
          else ObjectiveMasterStore.orderBy = 'asc'
        }
        else{
          ObjectiveMasterStore.orderBy = 'asc';
          ObjectiveMasterStore.orderItem = type;
        }
      }
    }
}
