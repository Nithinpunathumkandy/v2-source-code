import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetMaintenanceStatusesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-statuses';
import { AssetMaintenanceStatuses, AssetMaintenanceStatusesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-maintenance-statuses';

@Injectable({
  providedIn: 'root'
})
export class AssetMaintenanceStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Asset Maintenance Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceStatusesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetMaintenanceStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AssetMaintenanceStatusesMasterStore.currentPage}`;
      if (AssetMaintenanceStatusesMasterStore.orderBy) params += `&order=${AssetMaintenanceStatusesMasterStore.orderBy}`;
      if (AssetMaintenanceStatusesMasterStore.orderItem) params += `&order_by=${AssetMaintenanceStatusesMasterStore.orderItem}`;
      if (AssetMaintenanceStatusesMasterStore.searchText) params += `&q=${AssetMaintenanceStatusesMasterStore.searchText}`;
      }
      if (AssetMaintenanceStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMaintenanceStatusesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AssetMaintenanceStatusesPaginationResponse>('/asset-maintenance-statuses' + (params ? params : '')).pipe(
        map((res: AssetMaintenanceStatusesPaginationResponse) => {
          AssetMaintenanceStatusesMasterStore.setAssetCalculationMethod(res);
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting All Asset Maintenance Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceStatusesService
   */
    getAllItems(): Observable<AssetMaintenanceStatuses[]> {
      return this._http.get<AssetMaintenanceStatuses[]>('/asset-maintenance-statuses').pipe((
        map((res:AssetMaintenanceStatuses[])=>{
          AssetMaintenanceStatusesMasterStore.setAllAssetMaintenanceStatuses(res);
          return res;
        })
      ))
    }

  
   /**
   * @description
   * this method is used for export Asset Maintenance Statuses Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceStatusesService
   */
    exportToExcel() {
      this._http.get('/asset-maintenance-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_statuses')
          +".xlsx");
        }
      )
    }



    sortAssetMaintenanceStatusesList(type:string, text:string) {
      if (!AssetMaintenanceStatusesMasterStore.orderBy) {
        AssetMaintenanceStatusesMasterStore.orderBy = 'asc';
        AssetMaintenanceStatusesMasterStore.orderItem = type;
      }
      else{
        if (AssetMaintenanceStatusesMasterStore.orderItem == type) {
          if(AssetMaintenanceStatusesMasterStore.orderBy == 'asc') AssetMaintenanceStatusesMasterStore.orderBy = 'desc';
          else AssetMaintenanceStatusesMasterStore.orderBy = 'asc'
        }
        else{
          AssetMaintenanceStatusesMasterStore.orderBy = 'asc';
          AssetMaintenanceStatusesMasterStore.orderItem = type;
        }
      }
    }
}
