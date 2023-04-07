import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaTire, BiaTireDetails, BiaTirePaginationResponse } from 'src/app/core/models/masters/bcm/bia-tire';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaTireMasterStore } from 'src/app/stores/masters/bcm/bia-tire';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaTireService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaTirePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BiaTireMasterStore.currentPage}`;
			if (BiaTireMasterStore.orderBy) params += `&order_by=${BiaTireMasterStore.orderItem}&order=${BiaTireMasterStore.orderBy}`;
		}
		if (BiaTireMasterStore.searchText) params += (params ? '&q=' : '?q=') + BiaTireMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BiaTirePaginationResponse>('/bia-tires' + (params ? params : '')).pipe(
			map((res: BiaTirePaginationResponse) => {
				BiaTireMasterStore.setBiaTire(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<BiaTireDetails> {
		return this._http.get<BiaTireDetails>('/bia-tires/' + id).pipe(
			map((res: BiaTireDetails) => {
				BiaTireMasterStore.updateBiaTire(res)
				return res;
			})
		);
	}

  updateItem(id, item: BiaTire): Observable<any> {
		return this._http.put('/bia-tires/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_tire_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: BiaTire) {
		return this._http.post('/bia-tires', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_tire_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/bia-tires/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_tires_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/bia-tires/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_tires') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/bia-tires/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'bia_tier_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/bia-tires/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'bia_tires_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/bia-tires/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_tire_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/bia-tires/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_tire_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/bia-tires/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_tire_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BiaTireMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchBiaTireList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BiaTirePaginationResponse) => {
				BiaTireMasterStore.setBiaTire(res);
				return res;
			})
		);
	}

	sortBiaTireList(type: string, text: string) {
		if (!BiaTireMasterStore.orderBy) {
			BiaTireMasterStore.orderBy = 'asc';
			BiaTireMasterStore.orderItem = type;
		}
		else {
			if (BiaTireMasterStore.orderItem == type) {
				if (BiaTireMasterStore.orderBy == 'asc') BiaTireMasterStore.orderBy = 'desc';
				else BiaTireMasterStore.orderBy = 'asc'
			}
			else {
				BiaTireMasterStore.orderBy = 'asc';
				BiaTireMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}

	getThumbnailPreview(token, h?: number, w?: number) {
		return environment.apiBasePath + '/master/files/suppliers/thumbnail?token=' + token;
	  }
}

