import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentRootCause, IncidentRootCausePaginationResponse } from 'src/app/core/models/masters/incident-management/incident-root-cause';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentRootCauseMasterStore } from 'src/app/stores/masters/incident-management/incident-root-cause-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentRootCauseService {

  constructor(private _http:HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentRootCausePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentRootCauseMasterStore.currentPage}`;
      if (IncidentRootCauseMasterStore.orderBy) params += `&order_by=${IncidentRootCauseMasterStore.orderItem}&order=${IncidentRootCauseMasterStore.orderBy}`;

    }
   
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(IncidentRootCauseMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentRootCauseMasterStore.searchText;
    return this._http.get<IncidentRootCausePaginationResponse>('/incident-root-causes' + (params ? params : '')).pipe(
      map((res: IncidentRootCausePaginationResponse) => {
        IncidentRootCauseMasterStore.setIncidentRootCause(res);
        return res;
      })
    );
  }
  saveItem(item: IncidentRootCause) {
    return this._http.post('/incident-root-causes', item).pipe(
      map((res:any )=> {
        IncidentRootCauseMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_root_cause_created');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: IncidentRootCause): Observable<any> {
    return this._http.put('/incident-root-causes/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_root_cause_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete('/incident-root-causes/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_root_cause_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentRootCauseMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  activate(id: number) {
    return this._http.put('/incident-root-causes/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_root_cause_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-root-causes/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','incident_root_cause_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/incident-root-causes/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_root_cause_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-root-causes/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_root_cause')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-root-causes/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/incident-root-causes/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_root_cause_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }
  sortIncidentRootCauseList(type:string, text:string) {
    if (!IncidentRootCauseMasterStore.orderBy) {
      IncidentRootCauseMasterStore.orderBy = 'asc';
      IncidentRootCauseMasterStore.orderItem = type;
    }
    else{
      if (IncidentRootCauseMasterStore.orderItem == type) {
        if(IncidentRootCauseMasterStore.orderBy == 'asc') IncidentRootCauseMasterStore.orderBy = 'desc';
        else IncidentRootCauseMasterStore.orderBy = 'asc'
      }
      else{
        IncidentRootCauseMasterStore.orderBy = 'asc';
        IncidentRootCauseMasterStore.orderItem = type;
      }
    }
  }
}
