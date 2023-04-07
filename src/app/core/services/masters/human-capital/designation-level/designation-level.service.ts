import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DesignationLevel,DesignationLevelPaginationResponse } from '../../../../models/masters/human-capital/designation-level';
import { map } from 'rxjs/operators';
import { DesignationLevelMasterStore } from 'src/app/stores/masters/human-capital/designation-level-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationLevelService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?: string,status:boolean=false): Observable<DesignationLevelPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DesignationLevelMasterStore.currentPage}`;
      if (DesignationLevelMasterStore.orderBy) params += `&order_by=${DesignationLevelMasterStore.orderItem}&order=${DesignationLevelMasterStore.orderBy}`;
    }

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(DesignationLevelMasterStore.searchText) params += (params ? '&q=' : '?q=')+DesignationLevelMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';
    return this._http.get<DesignationLevelPaginationResponse>('/designation-levels' + (params ? params : '')).pipe(
      map((res: DesignationLevelPaginationResponse) => {
        DesignationLevelMasterStore.setDesignationLevels(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<DesignationLevel> {
    return this._http.get<DesignationLevel>('/designation-levels/' + id).pipe(
      map((res: DesignationLevel) => {
        DesignationLevelMasterStore.updateDesignationLevel(res)
        return res;
      })
    );
  }

  updateItem(id, item: DesignationLevel): Observable<any> {
    return this._http.put('/designation-levels/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: DesignationLevel) {
    return this._http.post('/designation-levels', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/designation-levels/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_level_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/designation-levels/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_level')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/designation-levels/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/designation-levels/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/designation-levels/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/designation-levels/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/designation-levels/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            DesignationLevelMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortDesignationLevelList(type:string, text:string) {
    if (!DesignationLevelMasterStore.orderBy) {
      DesignationLevelMasterStore.orderBy = 'asc';
      DesignationLevelMasterStore.orderItem = type;
    }
    else{
      if (DesignationLevelMasterStore.orderItem == type) {
        if(DesignationLevelMasterStore.orderBy == 'asc') DesignationLevelMasterStore.orderBy = 'desc';
        else DesignationLevelMasterStore.orderBy = 'asc'
      }
      else{
        DesignationLevelMasterStore.orderBy = 'asc';
        DesignationLevelMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
