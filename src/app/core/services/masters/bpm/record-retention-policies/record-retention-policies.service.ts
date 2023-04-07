import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessOperationFrequency } from 'src/app/core/models/masters/bcm/process-operation-frequency';
import { RecordRetentionPoliciesPaginationResponse } from 'src/app/core/models/masters/bpm/record-retention-policies';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RecordRetentionPoliciesMasterStore } from 'src/app/stores/masters/bpm/record-retention-policies.master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RecordRetentionPoliciesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting Record Retention Policies List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<RecordRetentionPoliciesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${RecordRetentionPoliciesMasterStore.currentPage}`;
			if (RecordRetentionPoliciesMasterStore.orderBy) params += `&order=${RecordRetentionPoliciesMasterStore.orderBy}`;
			if (RecordRetentionPoliciesMasterStore.orderItem) params += `&order_by=${RecordRetentionPoliciesMasterStore.orderItem}`;
			if (RecordRetentionPoliciesMasterStore.searchText) params += `&q=${RecordRetentionPoliciesMasterStore.searchText}`;
		}
		if (RecordRetentionPoliciesMasterStore.searchText) params += (params ? '&q=' : '?q=') + RecordRetentionPoliciesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<RecordRetentionPoliciesPaginationResponse>('/record-retention-policies' + (params ? params : '')).pipe(
			map((res: RecordRetentionPoliciesPaginationResponse) => {
				RecordRetentionPoliciesMasterStore.setRecordRetentionPolicies(res);
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for getting item Record Retention Policies
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
  getItem(id: number): Observable<ProcessOperationFrequency> {
		return this._http.get<ProcessOperationFrequency>('/record-retention-policies/' + id).pipe(
			map((res: ProcessOperationFrequency) => {
				RecordRetentionPoliciesMasterStore.updateRecordRetentionPolicies(res)
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for Update Record Retention Policies item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
  updateItem(id, item: ProcessOperationFrequency): Observable<any> {
		return this._http.put('/record-retention-policies/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for Post Record Retention Policies item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
  saveItem(item: ProcessOperationFrequency) {
		return this._http.post('/record-retention-policies', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * this method is used for generate Record Retention Policies data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	generateTemplate() {
		this._http.get('/record-retention-policies/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('record_retention_policies_template') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for export Record Retention Policies data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	exportToExcel() {
		this._http.get('/record-retention-policies/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('record_retention_policies') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for share Record Retention Policies data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	shareData(data) {
		return this._http.post('/record-retention-policies/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

   /**
   * @description
   * this method is used for import Record Retention Policies data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/record-retention-policies/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

   /**
   * @description
   * This method is used for activate the Record Retention Policies
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
  activate(id: number) {
		return this._http.put('/record-retention-policies/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for deactivate the Record Retention Policies
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	deactivate(id: number) {
		return this._http.put('/record-retention-policies/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for delete the Record Retention Policies item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof RecordRetentionPoliciesService
   */
	delete(id: number) {
		return this._http.delete('/record-retention-policies/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						RecordRetentionPoliciesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}


	sortRecordRetentionPoliciesList(type: string, text: string) {
		if (!RecordRetentionPoliciesMasterStore.orderBy) {
			RecordRetentionPoliciesMasterStore.orderBy = 'asc';
			RecordRetentionPoliciesMasterStore.orderItem = type;
		}
		else {
			if (RecordRetentionPoliciesMasterStore.orderItem == type) {
				if (RecordRetentionPoliciesMasterStore.orderBy == 'asc') RecordRetentionPoliciesMasterStore.orderBy = 'desc';
				else RecordRetentionPoliciesMasterStore.orderBy = 'asc'
			}
			else {
				RecordRetentionPoliciesMasterStore.orderBy = 'asc';
				RecordRetentionPoliciesMasterStore.orderItem = type;
			}
		}
	}
}
