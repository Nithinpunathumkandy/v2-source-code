import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ControlMode, ControlModePaginationResponse } from 'src/app/core/models/masters/bpm/control-mode';
import { ControlModeMasterStore } from 'src/app/stores/masters/bpm/control-mode.store';

@Injectable({
  providedIn: 'root'
})
export class ControlModeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<ControlModePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlModeMasterStore.currentPage}`;
      if (ControlModeMasterStore.orderBy) params += `&order_by=${ControlModeMasterStore.orderItem}&order=${ControlModeMasterStore.orderBy}`;
    }
    else {
      this.getAllItems();
    }
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all';
    if (ControlModeMasterStore.searchText) params += (params ? '&q=' : '?q=') + ControlModeMasterStore.searchText;
    return this._http.get<ControlModePaginationResponse>('/control-modes' + (params ? params : '')).pipe(
      map((res: ControlModePaginationResponse) => {
        ControlModeMasterStore.setControlModes(res);
        return res;
      })
    );

  }

  getAllItems() : Observable<ControlMode[]>{
    return this._http.get('/control-modes?is_all=true').pipe(
      map((res: ControlMode[]) => {
        ControlModeMasterStore.setAllControlModes(res);
        return res;
      })
    );
  }

  updateItem(id, item: ControlMode): Observable<any> {
    return this._http.put('/control-modes/' + id, item).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', 'update_success');
      this.getItems(false,null,true).subscribe()
      return res;
    }))
  }

  saveItem(item: ControlMode) {
    return this._http.post('/control-modes', item).pipe(map(res => {
      ControlModeMasterStore.setLastInsertedcontrolModes(res['id']);
      this._utilityService.showSuccessMessage('success', 'create_success');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    }))

  }

  delete(id: number) {
    return this._http.delete('/control-modes/' + id).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', 'delete_success');
      this.getItems(false, null, true).subscribe(resp => {
        if (resp.from == null) {
          ControlModeMasterStore.setCurrentPage(resp.current_page - 1);
          this.getItems(false, null, true).subscribe();
        }
      })
      return res;
    }))
  }

  activate(id: number) {
    return this._http.put('/control-modes/' + id + '/activate', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', 'activate_success');
      this.getItems(false, null, true).subscribe();
      return res;
    }))
  }

  deactivate(id: number) {
    return this._http.put('/control-modes/' + id + '/deactivate', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', 'deactivate_success');
      this.getItems(false, null, true).subscribe();
      return res;
    }))
  }

  generateTemplate() {
    this._http.get('/control-modes/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_mode_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/control-modes/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_mode') + ".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/control-modes/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/control-modes/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortControlCategoryList(type:string, text:string) {
    if (!ControlModeMasterStore.orderBy) {
      ControlModeMasterStore.orderBy = 'asc';
      ControlModeMasterStore.orderItem = type;
    }
    else{
      if (ControlModeMasterStore.orderItem == type) {
        if(ControlModeMasterStore.orderBy == 'asc') ControlModeMasterStore.orderBy = 'desc';
        else ControlModeMasterStore.orderBy = 'asc'
      }
      else{
        ControlModeMasterStore.orderBy = 'asc';
        ControlModeMasterStore.orderItem = type;
      }
    }
  }

}
