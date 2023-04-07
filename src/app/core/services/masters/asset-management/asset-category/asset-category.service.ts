import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetCategory, AssetCategoryPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetCategoryStore.currentPage}`;
      if (AssetCategoryStore.orderBy) params += `&order_by=${AssetCategoryStore.orderItem}&order=${AssetCategoryStore.orderBy}`;
    }
    if(AssetCategoryStore.searchText) params += (params ? '&q=' : '?q=')+AssetCategoryStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetCategoryPaginationResponse>('/asset-categories' + (params ? params : '')).pipe(
      map((res: AssetCategoryPaginationResponse) => {
        AssetCategoryStore.setAssetCategory(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<AssetCategory> {
		return this._http.get<AssetCategory>('/asset-categories/' + id).pipe(
			map((res: AssetCategory) => {
				// AssetCategoryStore.setAssetCategory(res)
				return res;
			})
		);
	}


updateItem(id, item: AssetCategory): Observable<any> {
  return this._http.put('/asset-categories/' + id, item).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_category_updated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

saveItem(item: AssetCategory) {
  return this._http.post('/asset-categories', item).pipe(
    map(res => {
      AssetCategoryStore.setLastInsertedId(res['id']);
      this._utilityService.showSuccessMessage('success', 'asset_category_added');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    })
  );
}
generateTemplate() {
  this._http.get('/asset-categories/template', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_category_template')+".xlsx");
    }
  )
}

exportToExcel() {
  this._http.get('/asset-categories/export', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_category')+".xlsx");
    }
  )
}

shareData(data){
  return this._http.post('/asset-categories/share',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success', 'asset_category_shared');
      return res;
    })
  )
}

importData(data){
  const formData = new FormData();
  formData.append('file',data);
  return this._http.post('/asset-categories/import',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success','asset_category_imported');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  )
}

activate(id: number) {
  return this._http.put('/asset-categories/' + id + '/activate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_category_activated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

deactivate(id: number) {
  return this._http.put('/asset-categories/' + id + '/deactivate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_category_deactivated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

delete(id: number) {
  return this._http.delete('/asset-categories/' + id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_category_deleted');
      this.getItems(false,null,true).subscribe(resp=>{
        if(resp.from==null){
          AssetCategoryStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      });
      return res;
    })
  );
}


sortAssetCategoryList(type:string, text:string) {
  if (!AssetCategoryStore.orderBy) {
    AssetCategoryStore.orderBy = 'asc';
    AssetCategoryStore.orderItem = type;
  }
  else{
    if (AssetCategoryStore.orderItem == type) {
      if(AssetCategoryStore.orderBy == 'asc') AssetCategoryStore.orderBy = 'desc';
      else AssetCategoryStore.orderBy = 'asc'
    }
    else{
      AssetCategoryStore.orderBy = 'asc';
      AssetCategoryStore.orderItem = type;
    }
  }
}
}
