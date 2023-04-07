import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {IncidentSubCategory, IncidentSubCategoryPaginationResponse, IncidentSubCategorySaveResponse} from 'src/app/core/models/masters/incident-management/incident-sub-category';
import {IncidentSubCategoryMasterStore} from 'src/app/stores/masters/incident-management/incident-sub-category-master-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IncidentSubCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentSubCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentSubCategoryMasterStore.currentPage}`;
      if (IncidentSubCategoryMasterStore.orderBy) params += `&order_by=${IncidentSubCategoryMasterStore.orderItem}&order=${IncidentSubCategoryMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    // if(categoryId) params += '&Category_id='+categoryId;
    if(IncidentSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentSubCategoryMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<IncidentSubCategoryPaginationResponse>('/incident-sub-categories' + (params ? params : '')).pipe(
      map((res: IncidentSubCategoryPaginationResponse) => {
        IncidentSubCategoryMasterStore.setIncidentSubCategory(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<IncidentSubCategory[]>{
    return this._http.get<IncidentSubCategory[]>('/incident-sub-categories?is_all=true').pipe(
      map((res: IncidentSubCategory[]) => {
        
        IncidentSubCategoryMasterStore.setAllIncidentSubCategory(res);
        return res;
      })
    );
  }


  saveItem(item: IncidentSubCategory,setlastInserted = false) {
    return this._http.post('/incident-sub-categories', item).pipe(
      map((res: IncidentSubCategorySaveResponse) => {
        if(setlastInserted) IncidentSubCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_sub_category_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: IncidentSubCategory): Observable<any> {
    return this._http.put('/incident-sub-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_sub_category_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/incident-sub-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_sub_category_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/incident-sub-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_sub_category_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-sub-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_sub_category_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incident-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_sub_category_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/incident-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_sub_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-sub-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/incident-sub-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_sub_category_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortIncidentSubCategorylList(type:string, text:string) {
    if (!IncidentSubCategoryMasterStore.orderBy) {
      IncidentSubCategoryMasterStore.orderBy = 'asc';
      IncidentSubCategoryMasterStore.orderItem = type;
    }
    else{
      if (IncidentSubCategoryMasterStore.orderItem == type) {
        if(IncidentSubCategoryMasterStore.orderBy == 'asc') IncidentSubCategoryMasterStore.orderBy = 'desc';
        else IncidentSubCategoryMasterStore.orderBy = 'asc'
      }
      else{
        IncidentSubCategoryMasterStore.orderBy = 'asc';
        IncidentSubCategoryMasterStore.orderItem = type;
      }
    }
  }
}
