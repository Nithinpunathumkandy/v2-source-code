import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ControlTypes,ControlTypesPaginationResponse} from '../../../../models/masters/bpm/contol-types'
import {ControlTypesMasterStore} from '../../../../../stores/masters/bpm/control-types.master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";


@Injectable({
  providedIn: 'root'
})
export class ControlTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<ControlTypesPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${ControlTypesMasterStore.currentPage}&status=all`;
  //     if (ControlTypesMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${ControlTypesMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<ControlTypesPaginationResponse>('/control-types' + (params ? params : '')).pipe(
  //     map((res: ControlTypesPaginationResponse) => {
  //       ControlTypesMasterStore.setControlTypes(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ControlTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlTypesMasterStore.currentPage}`;
      if (ControlTypesMasterStore.orderBy)
        params += `&order_by=${ControlTypesMasterStore.orderItem}&order=${ControlTypesMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ControlTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlTypesMasterStore.searchText;

    
    return this._http
      .get<ControlTypesPaginationResponse>('/control-types'+(params ? params : ''))
      .pipe(
        map((res: ControlTypesPaginationResponse) => {
          ControlTypesMasterStore.setControlTypes(res);
          return res;
        })
      );
  }


  updateItem(id, item: ControlTypes): Observable<any> {
    return this._http.put('/control-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: ControlTypes) {
    return this._http.post('/control-types', item).pipe(
      map(res => {
        ControlTypesMasterStore.setLastInsertedcontrolTypes(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/control-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/control-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/control-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/control-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/control-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/control-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/control-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ControlTypesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortControlTypeList(type:string, text:string) {
    if (!ControlTypesMasterStore.orderBy) {
      ControlTypesMasterStore.orderBy = 'asc';
      ControlTypesMasterStore.orderItem = type;
    }
    else{
      if (ControlTypesMasterStore.orderItem == type) {
        if(ControlTypesMasterStore.orderBy == 'asc') ControlTypesMasterStore.orderBy = 'desc';
        else ControlTypesMasterStore.orderBy = 'asc'
      }
      else{
        ControlTypesMasterStore.orderBy = 'asc';
        ControlTypesMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
