import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentDamageSeverity,IncidentDamageSeverityPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-damage-severity';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentDamageSeverityMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-severity-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentDamageSeverityService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentDamageSeverityPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentDamageSeverityMasterStore.currentPage}`;
      if (IncidentDamageSeverityMasterStore.orderBy) params += `&order_by=${IncidentDamageSeverityMasterStore.orderItem}&order=${IncidentDamageSeverityMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(IncidentDamageSeverityMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentDamageSeverityMasterStore.searchText;
    return this._http.get<IncidentDamageSeverityPaginationResponse>('/incident-damage-severities' + (params ? params : '')).pipe(
      map((res: IncidentDamageSeverityPaginationResponse) => {
        IncidentDamageSeverityMasterStore.setIncidentDamageSeverity(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<IncidentDamageSeverity[]>{
    return this._http.get<IncidentDamageSeverity[]>('/incident-damage-severities?is_all=true').pipe(
      map((res: IncidentDamageSeverity[]) => {
        
        IncidentDamageSeverityMasterStore.setAllIncidentDamageSeverity(res);
        return res;
      })
    );
  }
  saveItem(item: IncidentDamageSeverity) {
    return this._http.post('/incident-damage-severities', item).pipe(
      map((res:any )=> {
        IncidentDamageSeverityMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_damage_severity_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: IncidentDamageSeverity): Observable<any> {
    return this._http.put('/incident-damage-severities/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_severity_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/incident-damage-severities/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_severity_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentDamageSeverityMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  activate(id: number) {
    return this._http.put('/incident-damage-severities/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_severity_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-damage-severities/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_damage_severity_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/incident-damage-severities/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_damage_severity_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-damage-severities/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_damage_severity')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-damage-severities/share',data).pipe(
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
    return this._http.post('/incident-damage-severities/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_damage_severity_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortIncidentDamageSeveritylList(type:string, text:string) {
    if (!IncidentDamageSeverityMasterStore.orderBy) {
      IncidentDamageSeverityMasterStore.orderBy = 'asc';
      IncidentDamageSeverityMasterStore.orderItem = type;
    }
    else{
      if (IncidentDamageSeverityMasterStore.orderItem == type) {
        if(IncidentDamageSeverityMasterStore.orderBy == 'asc') IncidentDamageSeverityMasterStore.orderBy = 'desc';
        else IncidentDamageSeverityMasterStore.orderBy = 'asc'
      }
      else{
        IncidentDamageSeverityMasterStore.orderBy = 'asc';
        IncidentDamageSeverityMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
