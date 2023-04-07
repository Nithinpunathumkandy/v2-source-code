import { Injectable } from '@angular/core';
import { Unit,UnitPaginationResponse } from 'src/app/core/models/masters/human-capital/unit';
import {UnitMasterStore} from 'src/app/stores/masters/human-capital/unit-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean=false): Observable<UnitPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${UnitMasterStore.currentPage}`;
        if (UnitMasterStore.orderBy) params += `&order_by=${UnitMasterStore.orderItem}&order=${UnitMasterStore.orderBy}`;

      }
     

      if(additionalParams) params += additionalParams;
      if(UnitMasterStore.searchText) params += (params ? '&q=' : '?q=')+UnitMasterStore.searchText;
      if(status) params += (params? '&':'?q=')+'status=all';
      return this._http.get<UnitPaginationResponse>('/units' + (params ? params : '')).pipe(
        map((res: UnitPaginationResponse) => {
          UnitMasterStore.setUnit(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Unit[]>{
      return this._http.get<Unit[]>('/units?is_all=true').pipe(
        map((res: Unit[]) => {
          
          UnitMasterStore.setAllUnits(res);
          return res;
        })
      );
    }

    saveItem(item: Unit) {
      return this._http.post('/units', item).pipe(
        map((res:any )=> {
          UnitMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Unit): Observable<any> {
      return this._http.put('/units/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/units/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              UnitMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/units/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/units/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/units/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('units_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/units/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('units')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/units/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/units/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortUnitslList(type:string, text:string) {
      if (!UnitMasterStore.orderBy) {
        UnitMasterStore.orderBy = 'asc';
        UnitMasterStore.orderItem = type;
      }
      else{
        if (UnitMasterStore.orderItem == type) {
          if(UnitMasterStore.orderBy == 'asc') UnitMasterStore.orderBy = 'desc';
          else UnitMasterStore.orderBy = 'asc'
        }
        else{
          UnitMasterStore.orderBy = 'asc';
          UnitMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems(false,null,true).subscribe();
    else
    this.getItems(false,`&q=${text}`,true).subscribe();
    }
    
    searchItem(params){
      return this.getItems(params ? params : '').pipe(
        map((res: UnitPaginationResponse) => {
          UnitMasterStore.setUnit(res);
          return res;
        })
      );
    }
  

}

