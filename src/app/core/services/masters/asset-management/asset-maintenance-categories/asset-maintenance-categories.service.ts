import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetMaintenanceCategories, AssetMaintenanceCategoriesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-maintenance-categories';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMaintenanceCategoriesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-categories';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetMaintenanceCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetMaintenanceCategoriesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetMaintenanceCategoriesMasterStore.currentPage}`;
      if (AssetMaintenanceCategoriesMasterStore.orderBy) params += `&order=${AssetMaintenanceCategoriesMasterStore.orderBy}`;
      if (AssetMaintenanceCategoriesMasterStore.orderItem) params += `&order_by=${AssetMaintenanceCategoriesMasterStore.orderItem}`;
      if (AssetMaintenanceCategoriesMasterStore.searchText) params += `&q=${AssetMaintenanceCategoriesMasterStore.searchText}`;
    }
    if (AssetMaintenanceCategoriesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMaintenanceCategoriesMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<AssetMaintenanceCategoriesPaginationResponse>('/asset-maintenance-categories' + (params ? params : '')).pipe(
      map((res: AssetMaintenanceCategoriesPaginationResponse) => {
        AssetMaintenanceCategoriesMasterStore.setAssetMaintenanceCategories(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<AssetMaintenanceCategories[]> {
    return this._http.get<AssetMaintenanceCategories[]>('/asset-maintenance-categories').pipe((
      map((res: AssetMaintenanceCategories[]) => {
        AssetMaintenanceCategoriesMasterStore.setAllAssetMaintenanceCategories(res);
        return res;
      })
    ))
  }

  getItem(id: number): Observable<AssetMaintenanceCategories> {
		return this._http.get<AssetMaintenanceCategories>('/asset-maintenance-categories/' + id).pipe(
			map((res: AssetMaintenanceCategories) => {
				AssetMaintenanceCategoriesMasterStore.updateAssetMaintenanceCategories(res)
				return res;
			})
		);
	}

  updateItem(id, item: AssetMaintenanceCategories): Observable<any> {
    return this._http.put('/asset-maintenance-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: AssetMaintenanceCategories) {
    return this._http.post('/asset-maintenance-categories', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/asset-maintenance-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_categories') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/asset-maintenance-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_categories') + ".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/asset-maintenance-categories/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/asset-maintenance-categories/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/asset-maintenance-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/asset-maintenance-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/asset-maintenance-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_categories_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            AssetMaintenanceCategoriesMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchAssetMaintenanceCategoriesList(params) {
    return this.getItems(params ? params : '').pipe(
      map((res: AssetMaintenanceCategoriesPaginationResponse) => {
        AssetMaintenanceCategoriesMasterStore.setAssetMaintenanceCategories(res);
        return res;
      })
    );
  }

  sortAssetMaintenanceCategoriesList(type: string, text: string) {
    if (!AssetMaintenanceCategoriesMasterStore.orderBy) {
      AssetMaintenanceCategoriesMasterStore.orderBy = 'asc';
      AssetMaintenanceCategoriesMasterStore.orderItem = type;
    }
    else {
      if (AssetMaintenanceCategoriesMasterStore.orderItem == type) {
        if (AssetMaintenanceCategoriesMasterStore.orderBy == 'asc') AssetMaintenanceCategoriesMasterStore.orderBy = 'desc';
        else AssetMaintenanceCategoriesMasterStore.orderBy = 'asc'
      }
      else {
        AssetMaintenanceCategoriesMasterStore.orderBy = 'asc';
        AssetMaintenanceCategoriesMasterStore.orderItem = type;
      }
    }
  }
}
