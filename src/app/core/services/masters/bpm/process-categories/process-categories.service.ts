import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProcessCategory,ProcessCategoryPaginationResponse} from '../../../../models/masters/bpm/process-category'
import {ProcessCategoryMasterStore} from '../../../../../stores/masters/bpm/prcoess-category.master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProcessCategoriesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProcessCategoryPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ProcessCategoryMasterStore.currentPage}`;
      if (ProcessCategoryMasterStore.orderBy)
        params += `&order_by=${ProcessCategoryMasterStore.orderItem}&order=${ProcessCategoryMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(ProcessCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProcessCategoryMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http
      .get<ProcessCategoryPaginationResponse>('/process-categories'+(params ? params : ''))
      .pipe(
        map((res: ProcessCategoryPaginationResponse) => {
          ProcessCategoryMasterStore.setProcessCategory(res);
          return res;
        })
      );
  }


  updateItem(id, item: ProcessCategory): Observable<any> {
    return this._http.put('/process-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: ProcessCategory) {
    return this._http.post('/process-categories', item).pipe(
      map(res => {
        ProcessCategoryMasterStore.setLastInsertedprocessCategory(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/process-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/process-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/process-categories/share',data).pipe(
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
    return this._http.post('/process-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/process-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/process-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/process-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProcessCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortprocessCategoryList(type:string, text:string) {
    if (!ProcessCategoryMasterStore.orderBy) {
      ProcessCategoryMasterStore.orderBy = 'asc';
      ProcessCategoryMasterStore.orderItem = type;
    }
    else{
      if (ProcessCategoryMasterStore.orderItem == type) {
        if(ProcessCategoryMasterStore.orderBy == 'asc') ProcessCategoryMasterStore.orderBy = 'desc';
        else ProcessCategoryMasterStore.orderBy = 'asc'
      }
      else{
        ProcessCategoryMasterStore.orderBy = 'asc';
        ProcessCategoryMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
