import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetMaintenanceSchedule, AssetMaintenanceSchedulePaginationResponse, IndividualAssetMaintenanceSchedule } from 'src/app/core/models/asset-management/asset-register/asset-schedule';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceScheduleService {

  constructor(private _http: HttpClient, private _utilityService:UtilityService,private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<AssetMaintenanceSchedulePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AssetMaintenanceScheduleStore.currentPage}`;
        if (AssetMaintenanceScheduleStore.orderBy) params += `&order=${AssetMaintenanceScheduleStore.orderBy}`;
        if (AssetMaintenanceScheduleStore.orderItem) params += `&order_by=${AssetMaintenanceScheduleStore.orderItem}`;
        if (AssetMaintenanceScheduleStore.searchText) params += `&q=${AssetMaintenanceScheduleStore.searchText}`;
      }
      if(additionalParams){
        params = params+additionalParams;
      }
      if(RightSidebarLayoutStore.filterPageTag == 'asset_maintenance' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AssetMaintenanceSchedulePaginationResponse>('/asset-maintenance-schedules' + (params ? params : '')).pipe(
        map((res: AssetMaintenanceSchedulePaginationResponse) => {
         // console.log(res);
          AssetMaintenanceScheduleStore.setMaintenanceSchedule(res);
          return res;
        })
      );
  
    }
  

  getItem(id:number): Observable<IndividualAssetMaintenanceSchedule> {
    return this._http.get<IndividualAssetMaintenanceSchedule>('/asset-maintenance-schedules/'+id).pipe(
      map((res: IndividualAssetMaintenanceSchedule) => {
        AssetMaintenanceScheduleStore.setIndividualMaintenanceSchedule(res);
        return res;
      })
    );
  }

  sortMaintenanceSchedule(type:string, text:string) {
    if (!AssetMaintenanceScheduleStore.orderBy) {
      AssetMaintenanceScheduleStore.orderBy = 'asc';
      AssetMaintenanceScheduleStore.orderItem = type;
    }
    else{
      if (AssetMaintenanceScheduleStore.orderItem == type) {
        if(AssetMaintenanceScheduleStore.orderBy == 'asc') AssetMaintenanceScheduleStore.orderBy = 'desc';
        else AssetMaintenanceScheduleStore.orderBy = 'asc'
      }
      else{
        AssetMaintenanceScheduleStore.orderBy = 'asc';
        AssetMaintenanceScheduleStore.orderItem = type;
      }
    }
  }

  generateTemplate() {
		this._http.get('/asset-maintenance-schedules/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_schedule_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/asset-maintenance-schedules/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_schedule') + ".xlsx");
			}
		)
	}
}
