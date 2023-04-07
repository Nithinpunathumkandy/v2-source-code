import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentDamageTypes, IncidentDamageTypesPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-damage-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentDamageTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-type-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentDamageTypeService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentDamageTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentDamageTypeMasterStore.currentPage}`;
      if (IncidentDamageTypeMasterStore.orderBy) params += `&order_by=${IncidentDamageTypeMasterStore.orderItem}&order=${IncidentDamageTypeMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(IncidentDamageTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentDamageTypeMasterStore.searchText;
    return this._http.get<IncidentDamageTypesPaginationResponse>('/incident-damage-types' + (params ? params : '')).pipe(
      map((res: IncidentDamageTypesPaginationResponse) => {
        IncidentDamageTypeMasterStore.setIncidentDamageTypes(res);
        return res;
      })
    );
 
  }
  getAllItems(): Observable<IncidentDamageTypes[]>{
    return this._http.get<IncidentDamageTypes[]>('/incident-damage-types?is_all=true').pipe(
      map((res: IncidentDamageTypes[]) => {
        
        IncidentDamageTypeMasterStore.setAllIncidentDamageTypes(res);
        return res;
      })
    );
  }
  saveItem(item: IncidentDamageTypes) {
    return this._http.post('/incident-damage-types', item).pipe(
      map((res:any )=> {
        IncidentDamageTypeMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_damage_type_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: IncidentDamageTypes): Observable<any> {
    return this._http.put('/incident-damage-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/incident-damage-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentDamageTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  activate(id: number) {
    return this._http.put('/incident-damage-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-damage-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/incident-damage-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_damage_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-damage-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_damage_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-damage-types/share',data).pipe(
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
    return this._http.post('/incident-damage-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_damage_type_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortIncidentDamageTypeslList(type:string, text:string) {
    if (!IncidentDamageTypeMasterStore.orderBy) {
      IncidentDamageTypeMasterStore.orderBy = 'asc';
      IncidentDamageTypeMasterStore.orderItem = type;
    }
    else{
      if (IncidentDamageTypeMasterStore.orderItem == type) {
        if(IncidentDamageTypeMasterStore.orderBy == 'asc') IncidentDamageTypeMasterStore.orderBy = 'desc';
        else IncidentDamageTypeMasterStore.orderBy = 'asc'
      }
      else{
        IncidentDamageTypeMasterStore.orderBy = 'asc';
        IncidentDamageTypeMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
