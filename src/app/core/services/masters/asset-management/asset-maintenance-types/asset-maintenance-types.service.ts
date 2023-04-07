import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetMaintenanceTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-types-store';
import { AssetMaintenanceTypes, AssetMaintenanceTypesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-maintenance-types';

@Injectable({
  providedIn: 'root'
})
export class AssetMaintenanceTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Asset Maintenance Types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceTypesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetMaintenanceTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AssetMaintenanceTypesMasterStore.currentPage}`;
      if (AssetMaintenanceTypesMasterStore.orderBy) params += `&order=${AssetMaintenanceTypesMasterStore.orderBy}`;
      if (AssetMaintenanceTypesMasterStore.orderItem) params += `&order_by=${AssetMaintenanceTypesMasterStore.orderItem}`;
      if (AssetMaintenanceTypesMasterStore.searchText) params += `&q=${AssetMaintenanceTypesMasterStore.searchText}`;
      }
      if (AssetMaintenanceTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMaintenanceTypesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AssetMaintenanceTypesPaginationResponse>('/asset-maintenance-types' + (params ? params : '')).pipe(
        map((res: AssetMaintenanceTypesPaginationResponse) => {
          AssetMaintenanceTypesMasterStore.setAssetMaintenanceTypes(res);
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting All Asset Maintenance Types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceTypesService
   */
    getAllItems(): Observable<AssetMaintenanceTypes[]> {
      return this._http.get<AssetMaintenanceTypes[]>('/asset-maintenance-types').pipe((
        map((res:AssetMaintenanceTypes[])=>{
          AssetMaintenanceTypesMasterStore.setAllAssetMaintenanceTypes(res);
          return res;
        })
      ))
    }

  
   /**
   * @description
   * this method is used for export Asset Maintenance Types data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceTypesService
   */
    exportToExcel() {
      this._http.get('/asset-maintenance-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_types')
          +".xlsx");
        }
      )
    }



    sortAssetMaintenanceTypesList(type:string, text:string) {
      if (!AssetMaintenanceTypesMasterStore.orderBy) {
        AssetMaintenanceTypesMasterStore.orderBy = 'asc';
        AssetMaintenanceTypesMasterStore.orderItem = type;
      }
      else{
        if (AssetMaintenanceTypesMasterStore.orderItem == type) {
          if(AssetMaintenanceTypesMasterStore.orderBy == 'asc') AssetMaintenanceTypesMasterStore.orderBy = 'desc';
          else AssetMaintenanceTypesMasterStore.orderBy = 'asc'
        }
        else{
          AssetMaintenanceTypesMasterStore.orderBy = 'asc';
          AssetMaintenanceTypesMasterStore.orderItem = type;
        }
      }
    }
}
