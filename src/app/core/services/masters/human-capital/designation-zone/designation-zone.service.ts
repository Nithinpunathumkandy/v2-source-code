import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DesignationZone,DesignationZonePaginationResponse } from '../../../../models/masters/human-capital/designation-zone';
import { map } from 'rxjs/operators';
import { DesignationZoneMasterStore } from 'src/app/stores/masters/human-capital/designation-zone-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationZoneService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string,status:boolean=false): Observable<DesignationZonePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DesignationZoneMasterStore.currentPage}`;
      if (DesignationZoneMasterStore.orderBy) params += `&order_by=${DesignationZoneMasterStore.orderItem}&order=${DesignationZoneMasterStore.orderBy}`;
    }
    
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(DesignationZoneMasterStore.searchText) params += (params ? '&q=' : '?q=')+DesignationZoneMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<DesignationZonePaginationResponse>('/designation-zones' + (params ? params : '')).pipe(
      map((res: DesignationZonePaginationResponse) => {
        DesignationZoneMasterStore.setDesignationZones(res);
        return res;
      })
    );
  }


  getItem(id: number): Observable<DesignationZone> {
    return this._http.get<DesignationZone>('/designation-zones/' + id).pipe(
      map((res: DesignationZone) => {
        DesignationZoneMasterStore.updateDesignationZone(res)
        return res;
      })
    );
  }

  updateItem(id, item: DesignationZone): Observable<any> {
    return this._http.put('/designation-zones/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: DesignationZone) {
    return this._http.post('/designation-zones', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/designation-zones/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_zone_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/designation-zones/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_zone')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/designation-zones/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/designation-zones/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/designation-zones/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/designation-zones/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/designation-zones/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            DesignationZoneMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortDesignationZoneList(type:string, text:string) {
    if (!DesignationZoneMasterStore.orderBy) {
      DesignationZoneMasterStore.orderBy = 'asc';
      DesignationZoneMasterStore.orderItem = type;
    }
    else{
      if (DesignationZoneMasterStore.orderItem == type) {
        if(DesignationZoneMasterStore.orderBy == 'asc') DesignationZoneMasterStore.orderBy = 'desc';
        else DesignationZoneMasterStore.orderBy = 'asc'
      }
      else{
        DesignationZoneMasterStore.orderBy = 'asc';
        DesignationZoneMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
