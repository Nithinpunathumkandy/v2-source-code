import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BcsTypes, BcsTypesPaginationResponse } from 'src/app/core/models/masters/bcm/bcs-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcsTypesMasterStore } from 'src/app/stores/masters/bcm/bcs-type-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcsTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,

  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<BcsTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcsTypesMasterStore.currentPage}`;
      if (BcsTypesMasterStore.orderBy) params += `&order_by=${BcsTypesMasterStore.orderItem}&order=${BcsTypesMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(BcsTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+BcsTypesMasterStore.searchText;
    return this._http.get<BcsTypesPaginationResponse>('/bcs-types' + (params ? params : '')).pipe(
      map((res: BcsTypesPaginationResponse) => {
        BcsTypesMasterStore.setBcsTypes(res);
        return res;
      })
    );
 
  }
  getAllItems(): Observable<BcsTypes[]>{
    return this._http.get<BcsTypes[]>('/bcs-types?is_all=true').pipe(
      map((res: BcsTypes[]) => {       
        BcsTypesMasterStore.setAllBcsTypes(res);
        return res;
      })
    );
  }
  saveItem(item: BcsTypes) {
    return this._http.post('/bcs-types', item).pipe(
      map((res:any )=> {
        BcsTypesMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: BcsTypes): Observable<any> {
    return this._http.put('/bcs-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/bcs-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            BcsTypesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  activate(id: number) {
    return this._http.put('/bcs-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bcs-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/bcs-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_continuity_strategy_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/bcs-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_continuity_strategy_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/bcs-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/bcs-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','business_continuity_strategy_type_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortBcsTypesList(type:string, text:string) {
    if (!BcsTypesMasterStore.orderBy) {
      BcsTypesMasterStore.orderBy = 'asc';
      BcsTypesMasterStore.orderItem = type;
    }
    else{
      if (BcsTypesMasterStore.orderItem == type) {
        if(BcsTypesMasterStore.orderBy == 'asc') BcsTypesMasterStore.orderBy = 'desc';
        else BcsTypesMasterStore.orderBy = 'asc'
      }
      else{
        BcsTypesMasterStore.orderBy = 'asc';
        BcsTypesMasterStore.orderItem = type;
      }
    }
 
  }
}
