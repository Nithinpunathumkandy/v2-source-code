import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Suppliers, SuppliersPaginationResponse } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<SuppliersPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${SuppliersMasterStore.currentPage}`;
			if (SuppliersMasterStore.orderBy) params += `&order_by=${SuppliersMasterStore.orderItem}&order=${SuppliersMasterStore.orderBy}`;
		}
		if (SuppliersMasterStore.searchText) params += (params ? '&q=' : '?q=') + SuppliersMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<SuppliersPaginationResponse>('/suppliers' + (params ? params : '')).pipe(
			map((res: SuppliersPaginationResponse) => {
				SuppliersMasterStore.setSuppliers(res);
				return res;
			})
		);
	}


	getAllItems(): Observable<Suppliers[]> {
		return this._http.get<Suppliers[]>('/suppliers?is_all=true').pipe(
			map((res: Suppliers[]) => {
				SuppliersMasterStore.setAllSuppliers(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<Suppliers> {
		return this._http.get<Suppliers>('/suppliers/' + id).pipe(
			map((res: Suppliers) => {
				SuppliersMasterStore.updateSuppliers(res)
				return res;
			})
		);
	}

  updateItem(id, item: Suppliers): Observable<any> {
		return this._http.put('/suppliers/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: Suppliers) {
		return this._http.post('/suppliers', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/suppliers/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('suppliers_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/suppliers/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('suppliers') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/suppliers/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/suppliers/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/suppliers/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/suppliers/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/suppliers/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						SuppliersMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSuppliers(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: SuppliersPaginationResponse) => {
				SuppliersMasterStore.setSuppliers(res);
				return res;
			})
		);
	}

	sortSuppliersList(type: string, text: string) {
		if (!SuppliersMasterStore.orderBy) {
			SuppliersMasterStore.orderBy = 'asc';
			SuppliersMasterStore.orderItem = type;
		}
		else {
			if (SuppliersMasterStore.orderItem == type) {
				if (SuppliersMasterStore.orderBy == 'asc') SuppliersMasterStore.orderBy = 'desc';
				else SuppliersMasterStore.orderBy = 'asc'
			}
			else {
				SuppliersMasterStore.orderBy = 'asc';
				SuppliersMasterStore.orderItem = type;
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
	 setFileDetails(imageDetails,url,type){
		SuppliersMasterStore.setFileDetails(imageDetails,url,type);
	  }
	
	  // Returns File Details
	  getFileDetails(type){
		return SuppliersMasterStore.getFileDetailsByType(type);
	  }
}