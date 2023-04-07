import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetMaintenance,AssetMaintenancePaginationResponse, IndividualAssetMaintenance } from 'src/app/core/models/asset-management/asset-register/asset-maintenance';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';
import { IndividualAssetMaintenanceSchedule } from 'src/app/core/models/asset-management/asset-register/asset-schedule';


@Injectable({
  providedIn: 'root'
})
export class AssetMaintenanceService {

  constructor(private _http: HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<AssetMaintenancePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AssetMaintenanceStore.currentPage}`;
        if (AssetMaintenanceStore.orderBy) params += `&order=${AssetMaintenanceStore.orderBy}`;
        if (AssetMaintenanceStore.orderItem) params += `&order_by=${AssetMaintenanceStore.orderItem}`;
        if (AssetMaintenanceStore.searchText) params += `&q=${AssetMaintenanceStore.searchText}`;
      }
      // if(additionalParams){
      //   params = params+additionalParams;
      // }
      if (additionalParams) params += additionalParams;
      if(RightSidebarLayoutStore.filterPageTag == 'asset_maintenance' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AssetMaintenancePaginationResponse>('/asset-maintenances' + (params ? params : '')).pipe(
        map((res: AssetMaintenancePaginationResponse) => {
          AssetMaintenanceStore.setAssetMaintenance(res);
          return res;
        })
      );
  
    }
  

  getItem(id:number,params:string): Observable<IndividualAssetMaintenance> {
    return this._http.get<IndividualAssetMaintenance>('/asset-maintenances/'+id+(params?params:'')).pipe(
      map((res: IndividualAssetMaintenance) => {
        AssetMaintenanceStore.setIndividualAssetDetails(res);
        AssetMaintenanceStore.setMaintenanceId(res.id);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getScheduleItem(id:number): Observable<IndividualAssetMaintenanceSchedule> {
    return this._http.get<IndividualAssetMaintenanceSchedule>('/asset-maintenance-schedules/'+id).pipe(
      map((res: IndividualAssetMaintenanceSchedule) => {
        AssetMaintenanceScheduleStore.setIndividualMaintenanceSchedule(res);
        return res;
      })
    );
  }

  
	saveItem(asset,params?): Observable<any> {
		return this._http.post('/asset-maintenances', asset).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'asset_maintenance_profile_saved');
				this.getItems(false,(params?params:'')).subscribe();
				this.getItem(res['id'],'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				this.saveMaintenanceId(res['id']);
				return res;
			})
		);
	}

  updateItem(id,saveData,params?): Observable<any> {
    return this._http.put('/asset-maintenances/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_maintenance_profile_updated');
        this.getItems(false,(params?params:'')).subscribe();
				this.getItem(res['id'],'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				this.saveMaintenanceId(res['id']);

        return res;
      })
    );
  }

  getSchedule(id,saveData,params?): Observable<any> {
    return this._http.get('/asset-maintenances/'+id+'/schedules').pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'maintenance_schedule_created');
        this.getItems(false,(params?params:'')).subscribe();
				this.getItem(res['id'],'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				this.saveMaintenanceId(res['id']);

        return res;
      })
    );
  }
  updateSchedule(id,saveData,params?): Observable<any> {
    return this._http.put('/asset-maintenances/'+id+'/schedules', saveData).pipe(
      map(res => {
        if(AssetMaintenanceStore.editFlag) {
          this._utilityService.showSuccessMessage('success', 'maintenance_schedule_updated');
        }
        else {
          this._utilityService.showSuccessMessage('success', 'maintenance_schedule_created');
        }
        this.getItems(false,(params?params:'')).subscribe();
				this.getItem(res['id'],'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				this.saveMaintenanceId(res['id']);

        return res;
      })
    );
  }

  
  getScheduleUpdate(id,schedule_id,params?): Observable<any> {
    return this._http.get('/asset-maintenances/'+id+'/schedules/'+schedule_id+'/updates?' + (params ? params : '')).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'maintenance_schedule_updated');
        // this.getItems(false,(params?params:'')).subscribe();
				// this.getItem(res['id'],'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				// this.saveMaintenanceId(res['id']);
        AssetMaintenanceStore.setAssetMaintenanceSchedules(res);
        AssetMaintenanceScheduleStore.setMaintenanceScheduleHistory(res);
        
        return res;
      })
    );
  }

  updateScheduleReview(id,schedule_id,saveData,params?): Observable<any> {
    return this._http.post('/asset-maintenances/'+id+'/schedules/'+schedule_id+'/updates', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'maintenance_schedule_updated');
        this.getItems(false,(params?params:'')).subscribe();
        this.getScheduleItem(schedule_id).subscribe();;
        if(AssetRegisterStore.assetId)
				this.getItem(id,'?asset_ids='+AssetRegisterStore.assetId).subscribe();
				// this.saveMaintenanceId(res['id']);
       
        return res;
      })
    );
  }

  
  getShutdownUpdate(id,schedule_id,shutdown_id,params?): Observable<any> {
    return this._http.get('/asset-maintenances/'+id+'/schedules/'+schedule_id+'/shutdowns/'+shutdown_id+'/updates').pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'maintenance_schedule_updated');
       AssetMaintenanceStore.setAssetMaintenanceShutdowns(res);
       AssetMaintenanceScheduleStore.setMaintenanceShutdownHistory(res);

        return res;
      })
    );
  }

  updateShutdownReview(id,schedule_id,shutdown_id,saveData,params?): Observable<any> {
    return this._http.post('/asset-maintenances/'+id+'/schedules/'+schedule_id+'/shutdowns/'+shutdown_id+'/updates', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'maintenance_schedule_updated');
        
        this.getItems(false,(params?params:'')).subscribe();
        if(AssetRegisterStore.assetId)
				this.getItem(id,'?asset_ids='+AssetRegisterStore.assetId).subscribe();
        this.getScheduleItem(schedule_id).subscribe();
				// this.saveMaintenanceId(res['id']);

        return res;
      })
    );
  }

  deleteMaintenance(id: number,params?): Observable<any> {
		return this._http.delete('/asset-maintenances/'+id).pipe(map(res => {
			this._utilityService.showSuccessMessage('success', 'asset_maintenance_deleted');
			this.getItems(false,(params?params:'')).subscribe();
			return res;
		}))
	}

	saveMaintenanceId(id: number) {
		AssetMaintenanceStore.setMaintenanceId(id);
	}


	generateTemplate() {
		this._http.get('/asset-maintenances/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/asset-maintenances/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_maintenance') + ".xlsx");
			}
		)
	}

	sortMaintenanceList(type, callList: boolean = true) {
		if (!AssetMaintenanceStore.orderBy) {
			AssetMaintenanceStore.orderBy = 'asc';
			AssetMaintenanceStore.orderItem = type;
		}
		else {
			if (AssetMaintenanceStore.orderItem == type) {
				if (AssetMaintenanceStore.orderBy == 'asc') AssetMaintenanceStore.orderBy = 'desc';
				else AssetMaintenanceStore.orderBy = 'asc'
			}
			else {
				AssetMaintenanceStore.orderBy = 'asc';
				AssetMaintenanceStore.orderItem = type;
			}
		}
	}

  setSystemFile(fileDetails, url) {
    if (AssetMaintenanceStore.getSystemFile.find(i => i.token === fileDetails.token)) {
      //this._utilityService.showErrorMessage('Failed!', 'File Already Added!');
    }
    else {
      AssetMaintenanceStore.setSystemFile(fileDetails,url);
    }
  }



  saveScheduledData(saveData){
AssetMaintenanceStore.setShutdownData(saveData);
this._utilityService.showSuccessMessage('success', 'asset_shutdown_added');
  }

  setShutdownDocumentDetails(imageDetails,url){
    AssetMaintenanceStore.setShutdownDocumentDetails(imageDetails,url);
  }

  setScheduleDocumentDetails(imageDetails,url){
    AssetMaintenanceStore.setScheduleDocumentDetails(imageDetails,url);
  }

}
