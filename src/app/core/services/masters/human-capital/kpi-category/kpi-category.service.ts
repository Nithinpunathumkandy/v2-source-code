import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { KpiCategory, KpiCategoryPaginationResponse } from '../../../../models/masters/human-capital/kpi-category';
import { map } from 'rxjs/operators';
import { KpiCategoryMasterStore } from 'src/app/stores/masters/human-capital/kpi-category-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiCategoryService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false,extraParms?:string,status:boolean=false): Observable<KpiCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KpiCategoryMasterStore.currentPage}`;
      if (KpiCategoryMasterStore.orderBy) params += `&order_by=${KpiCategoryMasterStore.orderItem}&order=${KpiCategoryMasterStore.orderBy}`;
    }

    if(extraParms){
      if(params) params += `&${extraParms}`;
      else params += `?${extraParms}`;
    }
    if(KpiCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiCategoryMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<KpiCategoryPaginationResponse>('/kpi-categories' + (params ? params : '')).pipe(
      map((res: KpiCategoryPaginationResponse) => {
        KpiCategoryMasterStore.setKpiCategories(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<KpiCategory> {
    return this._http.get<KpiCategory>('/kpi-categories/' + id).pipe(
      map((res: KpiCategory) => {
        KpiCategoryMasterStore.updateKpiCategory(res)
        return res;
      })
    );
  }

  updateItem(id, item: KpiCategory): Observable<any> {
    return this._http.put('/kpi-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }


  saveItem(item: KpiCategory) {
    return this._http.post('/kpi-categories', item).pipe(
      map(res => {
        KpiCategoryMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/kpi-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/kpi-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_category')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/kpi-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/kpi-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/kpi-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/kpi-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/kpi-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            KpiCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchKpiCategory(params){
    return this.getItems(true,params ? params : '').pipe(
      map((res: KpiCategoryPaginationResponse) => {
        KpiCategoryMasterStore.setKpiCategories(res);
        return res;
      })
    );
  }

  sortKpiCategoryList(type:string, text:string) {
    if (!KpiCategoryMasterStore.orderBy) {
      KpiCategoryMasterStore.orderBy = 'asc';
      KpiCategoryMasterStore.orderItem = type;
    }
    else{
      if (KpiCategoryMasterStore.orderItem == type) {
        if(KpiCategoryMasterStore.orderBy == 'asc') KpiCategoryMasterStore.orderBy = 'desc';
        else KpiCategoryMasterStore.orderBy = 'asc'
      }
      else{
        KpiCategoryMasterStore.orderBy = 'asc';
        KpiCategoryMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }

    //Get Thumbnail Preview according to type and token
    getThumbnailPreview(type, token, h?: number, w?: number) {

      // +(h && w)?'&h='+h+'&w='+w:''
      switch(type){
          case 'kpi-document': return environment.apiBasePath+'/files/kpi-document/thumbnail?token='+token;
            break;
      }
    }
}