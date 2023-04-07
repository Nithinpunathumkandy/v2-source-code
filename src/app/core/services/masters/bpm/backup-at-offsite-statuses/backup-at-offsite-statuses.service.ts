import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaScaleCategoryPaginationResponse } from 'src/app/core/models/masters/bcm/bia-scale-category';
import { ProcessOperationFrequency, ProcessOperationFrequencyPaginationResponse } from 'src/app/core/models/masters/bcm/process-operation-frequency';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BackupAtOffsiteStatusesMasterStore } from 'src/app/stores/masters/bpm/backup-at-offsite-statuses.master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class BackupAtOffsiteStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting backup at offsite statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof BackupAtOffsiteStatusesService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaScaleCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
		params = `?page=${BackupAtOffsiteStatusesMasterStore.currentPage}`;
		if (BackupAtOffsiteStatusesMasterStore.orderBy) params += `&order=${BackupAtOffsiteStatusesMasterStore.orderBy}`;
		if (BackupAtOffsiteStatusesMasterStore.orderItem) params += `&order_by=${BackupAtOffsiteStatusesMasterStore.orderItem}`;
		if (BackupAtOffsiteStatusesMasterStore.searchText) params += `&q=${BackupAtOffsiteStatusesMasterStore.searchText}`;
		}
		if (BackupAtOffsiteStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + BackupAtOffsiteStatusesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<ProcessOperationFrequencyPaginationResponse>('/backup-at-offsite-statuses' + (params ? params : '')).pipe(
			map((res: ProcessOperationFrequencyPaginationResponse) => {
				BackupAtOffsiteStatusesMasterStore.setBackupAtOffsiteStatuses(res);
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for getting item backup at offsite statuses.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof BackupAtOffsiteStatusesService
   */
  getItem(id: number): Observable<ProcessOperationFrequency> {
		return this._http.get<ProcessOperationFrequency>('/backup-at-offsite-statuses/' + id).pipe(
			map((res: ProcessOperationFrequency) => {
				BackupAtOffsiteStatusesMasterStore.updateBackupAtOffsiteStatuses(res)
				return res;
			})
		);
	}

  
	sortbackupAtOffsiteStatusesList(type: string, text: string) {
		if (!BackupAtOffsiteStatusesMasterStore.orderBy) {
			BackupAtOffsiteStatusesMasterStore.orderBy = 'asc';
			BackupAtOffsiteStatusesMasterStore.orderItem = type;
		}
		else {
			if (BackupAtOffsiteStatusesMasterStore.orderItem == type) {
				if (BackupAtOffsiteStatusesMasterStore.orderBy == 'asc') BackupAtOffsiteStatusesMasterStore.orderBy = 'desc';
				else BackupAtOffsiteStatusesMasterStore.orderBy = 'asc'
			}
			else {
				BackupAtOffsiteStatusesMasterStore.orderBy = 'asc';
				BackupAtOffsiteStatusesMasterStore.orderItem = type;
			}
		}
	}
}
