import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaImpactCategoryInformation, BiaImpactCategoryInformationPaginationResponse } from 'src/app/core/models/masters/bcm/bia-impact-category-information';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaImpactCategoryInformationMasterStore } from 'src/app/stores/masters/bcm/bia-impact-category-information';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaImpactCategoryInformationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaImpactCategoryInformationPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BiaImpactCategoryInformationMasterStore.currentPage}`;
			if (BiaImpactCategoryInformationMasterStore.orderBy) params += `&order_by=${BiaImpactCategoryInformationMasterStore.orderItem}&order=${BiaImpactCategoryInformationMasterStore.orderBy}`;
		}
		if (BiaImpactCategoryInformationMasterStore.searchText) params += (params ? '&q=' : '?q=') + BiaImpactCategoryInformationMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BiaImpactCategoryInformationPaginationResponse>('/bia-impact-category-informations' + (params ? params : '')).pipe(
			map((res: BiaImpactCategoryInformationPaginationResponse) => {
				BiaImpactCategoryInformationMasterStore.setBiaImpactCategoryInformation(res);
				return res;
			})
		);
	}

  getItem(id): Observable<BiaImpactCategoryInformation> {
		return this._http.get<BiaImpactCategoryInformation>('/bia-impact-category-informations/' + id).pipe(
			map((res: BiaImpactCategoryInformation) => {
				BiaImpactCategoryInformationMasterStore.updateBiaImpactCategoryInformation(res)
				return res;
			})
		);
	}

  updateItem(id, item: BiaImpactCategoryInformation): Observable<any> {
		return this._http.put('/bia-impact-category-informations/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_information_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: BiaImpactCategoryInformation) {
		return this._http.post('/bia-impact-category-informations', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_information_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/bia-impact-category-informations/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_impact_category_informations_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/bia-impact-category-informations/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_Impact_Category_Informations') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/bia-impact-category-informations/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_informations_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/bia-impact-category-informations/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_informations_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/bia-impact-category-informations/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_informations_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/bia-impact-category-informations/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_informations_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/bia-impact-category-informations/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'bia_impact_category_informations_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BiaImpactCategoryInformationMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchBiaImpactCategoryInformationList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BiaImpactCategoryInformationPaginationResponse) => {
				BiaImpactCategoryInformationMasterStore.setBiaImpactCategoryInformation(res);
				return res;
			})
		);
	}

	sortBiaImpactCategoryInformationList(type: string, text: string) {
		if (!BiaImpactCategoryInformationMasterStore.orderBy) {
			BiaImpactCategoryInformationMasterStore.orderBy = 'asc';
			BiaImpactCategoryInformationMasterStore.orderItem = type;
		}
		else {
			if (BiaImpactCategoryInformationMasterStore.orderItem == type) {
				if (BiaImpactCategoryInformationMasterStore.orderBy == 'asc') BiaImpactCategoryInformationMasterStore.orderBy = 'desc';
				else BiaImpactCategoryInformationMasterStore.orderBy = 'asc'
			}
			else {
				BiaImpactCategoryInformationMasterStore.orderBy = 'asc';
				BiaImpactCategoryInformationMasterStore.orderItem = type;
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

