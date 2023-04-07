import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsoObservationType, JsoObservationTypePaginationResponse } from 'src/app/core/models/masters/jso/jso-observation-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JsoObservationTypeMasterStore } from 'src/app/stores/masters/jso/jso-observation-type-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class JsoObservationTypeService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<JsoObservationTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoObservationTypeMasterStore.currentPage}`;
      if (JsoObservationTypeMasterStore.orderBy) params += `&order_by=${JsoObservationTypeMasterStore.orderItem}&order=${JsoObservationTypeMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(JsoObservationTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+JsoObservationTypeMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<JsoObservationTypePaginationResponse>('/jso-observation-types' + (params ? params : '')).pipe(
      map((res: JsoObservationTypePaginationResponse) => {
        JsoObservationTypeMasterStore.setJsoObservationType(res);
        return res;
      })
    );
  }

  saveItem(item: JsoObservationType) {
    return this._http.post('/jso-observation-types', item).pipe(
      map((res:any )=> {
        JsoObservationTypeMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: JsoObservationType): Observable<any> {
    return this._http.put('/jso-observation-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/jso-observation-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            JsoObservationTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/jso-observation-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/jso-observation-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jso-observation-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_observation_type_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/jso-observation-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_observation_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/jso-observation-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/jso-observation-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortJsoObservationTypeList(type:string, text:string) {
    if (!JsoObservationTypeMasterStore.orderBy) {
      JsoObservationTypeMasterStore.orderBy = 'asc';
      JsoObservationTypeMasterStore.orderItem = type;
    }
    else{
      if (JsoObservationTypeMasterStore.orderItem == type) {
        if(JsoObservationTypeMasterStore.orderBy == 'asc') JsoObservationTypeMasterStore.orderBy = 'desc';
        else JsoObservationTypeMasterStore.orderBy = 'asc'
      }
      else{
        JsoObservationTypeMasterStore.orderBy = 'asc';
        JsoObservationTypeMasterStore.orderItem = type;
      }
    }
  }
}
