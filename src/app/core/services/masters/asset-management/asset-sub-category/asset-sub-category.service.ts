import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetSubCategory, AssetSubCategoryPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-sub-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetSubCategoryStore } from 'src/app/stores/masters/asset-management/asset-sub-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetSubCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService
  ) { }

  
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetSubCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetSubCategoryStore.currentPage}`;
      if (AssetSubCategoryStore.orderBy) params += `&order_by=${AssetSubCategoryStore.orderItem}&order=${AssetSubCategoryStore.orderBy}`;
    }
    if(AssetSubCategoryStore.searchText) params += (params ? '&q=' : '?q=')+AssetSubCategoryStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetSubCategoryPaginationResponse>('/asset-sub-categories' + (params ? params : '')).pipe(
      map((res: AssetSubCategoryPaginationResponse) => {
        AssetSubCategoryStore.setAssetSubCategory(res);
        return res;
      })
    );
  }
  


updateItem(id, item: AssetSubCategory): Observable<any> {
  return this._http.put('/asset-sub-categories/' + id, item).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_sub_category_updated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

saveItem(item: AssetSubCategory) {
  return this._http.post('/asset-sub-categories', item).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_sub_category_added');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    })
  );
}
generateTemplate() {
  this._http.get('/asset-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_sub_category_template')+".xlsx");
    }
  )
}

exportToExcel() {
  this._http.get('/asset-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_sub_category')+".xlsx");
    }
  )
}

shareData(data){
  return this._http.post('/asset-sub-categories/share',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success', 'item_shared');
      return res;
    })
  )
}

importData(data){
  const formData = new FormData();
  formData.append('file',data);
  return this._http.post('/asset-sub-categories/import',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success','asset_sub_category_imported');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  )
}

activate(id: number) {
  return this._http.put('/asset-sub-categories/' + id + '/activate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_sub_category_activated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

deactivate(id: number) {
  return this._http.put('/asset-sub-categories/' + id + '/deactivate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_sub_category_deactivated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

delete(id: number) {
  return this._http.delete('/asset-sub-categories/' + id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_sub_category_deleted');
      this.getItems(false,null,true).subscribe(resp=>{
        if(resp.from==null){
          AssetSubCategoryStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      });
      return res;
    })
  );
}


sortAssetSubCategoryList(type:string, text:string) {
  if (!AssetSubCategoryStore.orderBy) {
    AssetSubCategoryStore.orderBy = 'asc';
    AssetSubCategoryStore.orderItem = type;
  }
  else{
    if (AssetSubCategoryStore.orderItem == type) {
      if(AssetSubCategoryStore.orderBy == 'asc') AssetSubCategoryStore.orderBy = 'desc';
      else AssetSubCategoryStore.orderBy = 'asc'
    }
    else{
      AssetSubCategoryStore.orderBy = 'asc';
      AssetSubCategoryStore.orderItem = type;
    }
  }
}
}
