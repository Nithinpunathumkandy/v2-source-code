import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessOperationFrequency, ProcessOperationFrequencyPaginationResponse } from 'src/app/core/models/masters/bcm/process-operation-frequency';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessOperationFrequencyMasterStore } from 'src/app/stores/masters/bcm/process-operation-frequency.master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class ProcessOperationFrequencyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting Process Operation Frequency List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProcessOperationFrequencyPaginationResponse> {
		let params = '';
		console.log("getAll",getAll)
		if (!getAll) {
			params = `?page=${ProcessOperationFrequencyMasterStore.currentPage}`;
			if (ProcessOperationFrequencyMasterStore.orderBy) params += `&order=${ProcessOperationFrequencyMasterStore.orderBy}`;
			if (ProcessOperationFrequencyMasterStore.orderItem) params += `&order_by=${ProcessOperationFrequencyMasterStore.orderItem}`;
			if (ProcessOperationFrequencyMasterStore.searchText) params += `&q=${ProcessOperationFrequencyMasterStore.searchText}`;
		}
		if (ProcessOperationFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=') + ProcessOperationFrequencyMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<ProcessOperationFrequencyPaginationResponse>('/process-operation-frequencies' + (params ? params : '')).pipe(
			map((res: ProcessOperationFrequencyPaginationResponse) => {
				ProcessOperationFrequencyMasterStore.setProcessOperationFrequency(res);
				return res;
			})
		);
	}

	getAllItems(): Observable<ProcessOperationFrequency[]> {
		return this._http.get<ProcessOperationFrequency[]>('/process-operation-frequencies?is_all=true').pipe(
			map((res: ProcessOperationFrequency[]) => {
				ProcessOperationFrequencyMasterStore.setOperationFreq(res);
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for getting item Process Operation Frequency
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
  getItem(id: number): Observable<ProcessOperationFrequency> {
		return this._http.get<ProcessOperationFrequency>('/process-operation-frequencies/' + id).pipe(
			map((res: ProcessOperationFrequency) => {
				ProcessOperationFrequencyMasterStore.updateProcessOperationFrequency(res)
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for Update Process Operation Frequency item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
  updateItem(id, item: ProcessOperationFrequency): Observable<any> {
		return this._http.put('/process-operation-frequencies/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for Post Process Operation Frequency item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
  saveItem(item: ProcessOperationFrequency) {
		return this._http.post('/process-operation-frequencies', item).pipe(
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
   * this method is used for generate Process Operation Frequency data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	generateTemplate() {
		this._http.get('/process-operation-frequencies/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_operation_frequency_template') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for export Process Operation Frequency data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	exportToExcel() {
		this._http.get('/process-operation-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_operation_frequency') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for share Process Operation Frequency data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	shareData(data) {
		return this._http.post('/process-operation-frequencies/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

   /**
   * @description
   * this method is used for import Process Operation Frequency data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/process-operation-frequencies/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

   /**
   * @description
   * This method is used for activate the Process Operation Frequency
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
  activate(id: number) {
		return this._http.put('/process-operation-frequencies/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for deactivate the Process Operation Frequency
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	deactivate(id: number) {
		return this._http.put('/process-operation-frequencies/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for delete the Process Operation Frequency item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProcessOperationFrequencyService
   */
	delete(id: number) {
		return this._http.delete('/process-operation-frequencies/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						ProcessOperationFrequencyMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}


	sortProcessOperationFrequencyList(type: string, text: string) {
		if (!ProcessOperationFrequencyMasterStore.orderBy) {
			ProcessOperationFrequencyMasterStore.orderBy = 'asc';
			ProcessOperationFrequencyMasterStore.orderItem = type;
		}
		else {
			if (ProcessOperationFrequencyMasterStore.orderItem == type) {
				if (ProcessOperationFrequencyMasterStore.orderBy == 'asc') ProcessOperationFrequencyMasterStore.orderBy = 'desc';
				else ProcessOperationFrequencyMasterStore.orderBy = 'asc'
			}
			else {
				ProcessOperationFrequencyMasterStore.orderBy = 'asc';
				ProcessOperationFrequencyMasterStore.orderItem = type;
			}
		}
	}
}
