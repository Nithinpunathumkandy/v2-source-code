import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StrategyObjectiveTypeMasterStore } from 'src/app/stores/masters/strategy/strategy-objective-type-store';
import { StrategyObjectiveTypes, StrategyObjectiveTypesPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-objective-types';

@Injectable({
  providedIn: 'root'
})

export class StrategyObjectiveTypeService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<StrategyObjectiveTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyObjectiveTypeMasterStore.currentPage}`;
        if (StrategyObjectiveTypeMasterStore.orderBy) params += `&order_by=${StrategyObjectiveTypeMasterStore.orderItem}&order=${StrategyObjectiveTypeMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(StrategyObjectiveTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyObjectiveTypeMasterStore.searchText;
      return this._http.get<StrategyObjectiveTypesPaginationResponse>('/strategy-objective-types' + (params ? params : '')).pipe(
        map((res: StrategyObjectiveTypesPaginationResponse) => {
          StrategyObjectiveTypeMasterStore.setstrategyObjectiveTypes(res);
          return res;
        })
      );
   
    }

    getItemsWithoutChild(){
      return this._http.get('/strategy-objective-types/childObjective').pipe(
        map((res) => {
          StrategyObjectiveTypeMasterStore.setObjectiveTypesWithoutChild(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<StrategyObjectiveTypes[]>{
      return this._http.get<StrategyObjectiveTypes[]>('/strategy-objective-types?is_all=true').pipe(
        map((res: StrategyObjectiveTypes[]) => {
          
          StrategyObjectiveTypeMasterStore.setAllstrategyObjectiveTypes(res);
          return res;
        })
      );
    }

    saveItem(item) {
      return this._http.post('/strategy-objective-types', item).pipe(
        map((res:any )=> {
          StrategyObjectiveTypeMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'strategy_objectivet_types_add_added');
          // if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
          // else this.getItems().subscribe();
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item): Observable<any> {
      return this._http.put('/strategy-objective-types/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_objectivet_types_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/strategy-objective-types/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_objectivet_types_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              StrategyObjectiveTypeMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/strategy-objective-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_objectivet_types_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/strategy-objective-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_objectivet_types_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/strategy-objective-types/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_objectivet_types_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/strategy-objective-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_objectivet_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/strategy-objective-types/share',data).pipe(
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
      return this._http.post('/strategy-objective-types/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','strategy_objectivet_types_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortKpiTypeslList(type:string, text:string) {
      if (!StrategyObjectiveTypeMasterStore.orderBy) {
        StrategyObjectiveTypeMasterStore.orderBy = 'asc';
        StrategyObjectiveTypeMasterStore.orderItem = type;
      }
      else{
        if (StrategyObjectiveTypeMasterStore.orderItem == type) {
          if(StrategyObjectiveTypeMasterStore.orderBy == 'asc') StrategyObjectiveTypeMasterStore.orderBy = 'desc';
          else StrategyObjectiveTypeMasterStore.orderBy = 'asc'
        }
        else{
          StrategyObjectiveTypeMasterStore.orderBy = 'asc';
          StrategyObjectiveTypeMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}