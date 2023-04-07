import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentTypes, IncidentTypesPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-type-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentTypeService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentTypeMasterStore.currentPage}`;
      if (IncidentTypeMasterStore.orderBy) params += `&order_by=${IncidentTypeMasterStore.orderItem}&order=${IncidentTypeMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(IncidentTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentTypeMasterStore.searchText;
    return this._http.get<IncidentTypesPaginationResponse>('/incident-types' + (params ? params : '')).pipe(
      map((res: IncidentTypesPaginationResponse) => {
        IncidentTypeMasterStore.setIncidentTypes(res);
        return res;
      })
    );
  }
  saveItem(item: IncidentTypes) {
    return this._http.post('/incident-types', item).pipe(
      map((res:any )=> {
        IncidentTypeMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_type_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: IncidentTypes): Observable<any> {
    return this._http.put('/incident-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/incident-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  activate(id: number) {
    return this._http.put('/incident-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incident-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-types/share',data).pipe(
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
    return this._http.post('/incident-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_type_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortIncidentTypesList(type:string, text:string) {
    if (!IncidentTypeMasterStore.orderBy) {
      IncidentTypeMasterStore.orderBy = 'asc';
      IncidentTypeMasterStore.orderItem = type;
    }
    else{
      if (IncidentTypeMasterStore.orderItem == type) {
        if(IncidentTypeMasterStore.orderBy == 'asc') IncidentTypeMasterStore.orderBy = 'desc';
        else IncidentTypeMasterStore.orderBy = 'asc'
      }
      else{
        IncidentTypeMasterStore.orderBy = 'asc';
        IncidentTypeMasterStore.orderItem = type;
      }
    }
  }
}
