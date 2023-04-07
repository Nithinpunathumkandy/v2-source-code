import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetMatrixCategories, AssetMatrixCategoriesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-matrix-categories';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMatrixCategoriesMasterStore } from 'src/app/stores/masters/asset-management/asset-matrix-categories';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetMatrixCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetMatrixCategoriesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetMatrixCategoriesMasterStore.currentPage}`;
      if (AssetMatrixCategoriesMasterStore.orderBy) params += `&order=${AssetMatrixCategoriesMasterStore.orderBy}`;
      if (AssetMatrixCategoriesMasterStore.orderItem) params += `&order_by=${AssetMatrixCategoriesMasterStore.orderItem}`;
      if (AssetMatrixCategoriesMasterStore.searchText) params += `&q=${AssetMatrixCategoriesMasterStore.searchText}`;
    }
    if (AssetMatrixCategoriesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMatrixCategoriesMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<AssetMatrixCategoriesPaginationResponse>('/asset-matrix-categories' + (params ? params : '')).pipe(
      map((res: AssetMatrixCategoriesPaginationResponse) => {
        AssetMatrixCategoriesMasterStore.setAssetMatrixCategories(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<AssetMatrixCategories[]> {
    return this._http.get<AssetMatrixCategories[]>('/asset-matrix-categories').pipe((
      map((res: AssetMatrixCategories[]) => {
        AssetMatrixCategoriesMasterStore.setAllAssetMatrixCategories(res);
        return res;
      })
    ))
  }

  getItem(id: number): Observable<AssetMatrixCategories> {
		return this._http.get<AssetMatrixCategories>('/asset-matrix-categories/' + id).pipe(
			map((res: AssetMatrixCategories) => {
				AssetMatrixCategoriesMasterStore.updateAssetMatrixCategories(res)
				return res;
			})
		);
	}

  updateItem(id, item: AssetMatrixCategories): Observable<any> {
    return this._http.put('/asset-matrix-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: AssetMatrixCategories) {
    return this._http.post('/asset-matrix-categories', item).pipe(
      map(res => {
        AssetMatrixCategoriesMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/asset-matrix-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_matrix_categories') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/asset-matrix-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_matrix_categories') + ".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/asset-matrix-categories/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/asset-matrix-categories/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/asset-matrix-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/asset-matrix-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/asset-matrix-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_category_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            AssetMatrixCategoriesMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchAssetMatrixCategoriesList(params) {
    return this.getItems(params ? params : '').pipe(
      map((res: AssetMatrixCategoriesPaginationResponse) => {
        AssetMatrixCategoriesMasterStore.setAssetMatrixCategories(res);
        return res;
      })
    );
  }

  sortAssetMatrixCategoriesList(type: string, text: string) {
    if (!AssetMatrixCategoriesMasterStore.orderBy) {
      AssetMatrixCategoriesMasterStore.orderBy = 'asc';
      AssetMatrixCategoriesMasterStore.orderItem = type;
    }
    else {
      if (AssetMatrixCategoriesMasterStore.orderItem == type) {
        if (AssetMatrixCategoriesMasterStore.orderBy == 'asc') AssetMatrixCategoriesMasterStore.orderBy = 'desc';
        else AssetMatrixCategoriesMasterStore.orderBy = 'asc'
      }
      else {
        AssetMatrixCategoriesMasterStore.orderBy = 'asc';
        AssetMatrixCategoriesMasterStore.orderItem = type;
      }
    }
  }
}
