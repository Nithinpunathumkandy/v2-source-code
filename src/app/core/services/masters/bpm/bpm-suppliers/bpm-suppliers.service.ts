import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BpmSuppliers, BpmSuppliersPaginationResponse, IndividualSuppliers } from 'src/app/core/models/masters/bpm/bpm-suppliers';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BpmSuppliersMasterStore } from 'src/app/stores/masters/bpm/bpm-suppliers';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BpmSuppliersService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BpmSuppliersPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BpmSuppliersMasterStore.currentPage}`;
			if (BpmSuppliersMasterStore.orderBy) params += `&order_by=${BpmSuppliersMasterStore.orderItem}&order=${BpmSuppliersMasterStore.orderBy}`;
		}
		if (BpmSuppliersMasterStore.searchText) params += (params ? '&q=' : '?q=') + BpmSuppliersMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BpmSuppliersPaginationResponse>('/bpm/suppliers' + (params ? params : '')).pipe(
			map((res: BpmSuppliersPaginationResponse) => {
				BpmSuppliersMasterStore.setSuppliers(res);
				return res;
			})
		);
	}


	getAllItems(): Observable<BpmSuppliers[]> {
		return this._http.get<BpmSuppliers[]>('/bpm/suppliers?is_all=true').pipe(
			map((res: BpmSuppliers[]) => {
				BpmSuppliersMasterStore.setAllSuppliers(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<IndividualSuppliers> {
		return this._http.get<IndividualSuppliers>('/bpm/suppliers/' + id).pipe(
			map((res: IndividualSuppliers) => {
				BpmSuppliersMasterStore.setIndividualSupplier(res)
				return res;
			})
		);
	}

	updateItem(id, item: BpmSuppliers): Observable<any> {
		return this._http.put('/bpm/suppliers/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}	


  saveItem(item: BpmSuppliers) {
		return this._http.post('/bpm/suppliers', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/bpm/suppliers/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('suppliers_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/bpm/suppliers/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('suppliers') + ".xlsx");
			}
		)
	}

	saveSupplierId(id: number) {
		BpmSuppliersMasterStore.setSelectedSupplierId(id);
	  }

	shareData(data) {
		return this._http.post('/bpm/suppliers/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/bpm/suppliers/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/bpm/suppliers/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/bpm/suppliers/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/bpm/suppliers/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BpmSuppliersMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSuppliers(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BpmSuppliersPaginationResponse) => {
				BpmSuppliersMasterStore.setSuppliers(res);
				return res;
			})
		);
	}

	sortSuppliersList(type: string, text: string) {
		if (!BpmSuppliersMasterStore.orderBy) {
			BpmSuppliersMasterStore.orderBy = 'asc';
			BpmSuppliersMasterStore.orderItem = type;
		}
		else {
			if (BpmSuppliersMasterStore.orderItem == type) {
				if (BpmSuppliersMasterStore.orderBy == 'asc') BpmSuppliersMasterStore.orderBy = 'desc';
				else BpmSuppliersMasterStore.orderBy = 'asc'
			}
			else {
				BpmSuppliersMasterStore.orderBy = 'asc';
				BpmSuppliersMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}


	/**
   * Sets File Details
   * @param imageDetails File Details Returned by Upload API
   * @param url preview url
   * @param type type of file - logo or brochure
   */
	 setFileDetails(imageDetails,url){
		BpmSuppliersMasterStore.setFileDetails(imageDetails,url);
	  }
	
	  // Returns File Details
	  getFileDetails(type){
		return BpmSuppliersMasterStore.getFileDetailsByType();
	  }

	  getThumbnailPreview(token){
		return environment.apiBasePath+ '/master/files/bpm-suppliers/thumbnail?token='+token;
	  }
}