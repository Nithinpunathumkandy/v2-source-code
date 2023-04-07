import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetMaintenanceScheduleFrequencies, AssetMaintenanceScheduleFrequenciesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-maintenance-schedule-frequencies';
import { AssetMaintenanceScheduleFrequenciesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-schedule-frequencies-store';

@Injectable({
  providedIn: 'root'
})
export class AssetMaintenanceScheduleFrequenciesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Asset Maintenance Schedule Frequencies List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceScheduleFrequenciesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetMaintenanceScheduleFrequenciesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AssetMaintenanceScheduleFrequenciesMasterStore.currentPage}`;
      if (AssetMaintenanceScheduleFrequenciesMasterStore.orderBy) params += `&order=${AssetMaintenanceScheduleFrequenciesMasterStore.orderBy}`;
      if (AssetMaintenanceScheduleFrequenciesMasterStore.orderItem) params += `&order_by=${AssetMaintenanceScheduleFrequenciesMasterStore.orderItem}`;
      if (AssetMaintenanceScheduleFrequenciesMasterStore.searchText) params += `&q=${AssetMaintenanceScheduleFrequenciesMasterStore.searchText}`;
      }
      if (AssetMaintenanceScheduleFrequenciesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMaintenanceScheduleFrequenciesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AssetMaintenanceScheduleFrequenciesPaginationResponse>('/asset-maintenance-schedule-frequencies' + (params ? params : '')).pipe(
        map((res: AssetMaintenanceScheduleFrequenciesPaginationResponse) => {
          AssetMaintenanceScheduleFrequenciesMasterStore.setAssetMaintenanceScheduleFrequencies(res);
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting All Asset Maintenance Schedule Frequencies List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceScheduleFrequenciesService
   */
    getAllItems(): Observable<AssetMaintenanceScheduleFrequencies[]> {
      return this._http.get<AssetMaintenanceScheduleFrequencies[]>('/asset-maintenance-schedule-frequencies').pipe((
        map((res:AssetMaintenanceScheduleFrequencies[])=>{
          AssetMaintenanceScheduleFrequenciesMasterStore.setAllAssetMaintenanceScheduleFrequencies(res);
          return res;
        })
      ))
    }

   
   /**
   * @description
   * this method is used for export Asset Maintenance Schedule Frequencies data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AssetMaintenanceScheduleFrequenciesService
   */
    exportToExcel() {
      this._http.get('/asset-maintenance-schedule-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_schedule_frequencies')
          +".xlsx");
        }
      )
    }



    sortAssetMaintenanceScheduleFrequenciesList(type:string, text:string) {
      if (!AssetMaintenanceScheduleFrequenciesMasterStore.orderBy) {
        AssetMaintenanceScheduleFrequenciesMasterStore.orderBy = 'asc';
        AssetMaintenanceScheduleFrequenciesMasterStore.orderItem = type;
      }
      else{
        if (AssetMaintenanceScheduleFrequenciesMasterStore.orderItem == type) {
          if(AssetMaintenanceScheduleFrequenciesMasterStore.orderBy == 'asc') AssetMaintenanceScheduleFrequenciesMasterStore.orderBy = 'desc';
          else AssetMaintenanceScheduleFrequenciesMasterStore.orderBy = 'asc'
        }
        else{
          AssetMaintenanceScheduleFrequenciesMasterStore.orderBy = 'asc';
          AssetMaintenanceScheduleFrequenciesMasterStore.orderItem = type;
        }
      }
    }
}
