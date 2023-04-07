import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsmsRiskMatrixRatingLevel, IsmsRiskMatrixRatingLevelPaginationResponse } from 'src/app/core/models/masters/isms/isms-risk-matrix-rating-level';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskMatrixRatingLevelMasterStore } from 'src/app/stores/masters/isms/isms-risk-matrix-rating-level-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskMatrixRatingLevelService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<IsmsRiskMatrixRatingLevelPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${IsmsRiskMatrixRatingLevelMasterStore.currentPage}`;
			if (IsmsRiskMatrixRatingLevelMasterStore.orderBy) params += `&order_by=${IsmsRiskMatrixRatingLevelMasterStore.orderItem}&order=${IsmsRiskMatrixRatingLevelMasterStore.orderBy}`;
		}
		if (IsmsRiskMatrixRatingLevelMasterStore.searchText) params += (params ? '&q=' : '?q=') + IsmsRiskMatrixRatingLevelMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<IsmsRiskMatrixRatingLevelPaginationResponse>('/isms-risk-matrix-rating-levels' + (params ? params : '')).pipe(
			map((res: IsmsRiskMatrixRatingLevelPaginationResponse) => {
				IsmsRiskMatrixRatingLevelMasterStore.setIsmsRiskMatrixRatingLevel(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<IsmsRiskMatrixRatingLevel> {
		return this._http.get<IsmsRiskMatrixRatingLevel>('/isms-risk-matrix-rating-levels/' + id).pipe(
			map((res: IsmsRiskMatrixRatingLevel) => {
				IsmsRiskMatrixRatingLevelMasterStore.updateIsmsRiskMatrixRatingLevel(res)
				return res;
			})
		);
	}

  updateItem(id, item: IsmsRiskMatrixRatingLevel): Observable<any> {
		return this._http.put('/isms-risk-matrix-rating-levels/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_level_Updated!');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: IsmsRiskMatrixRatingLevel) {
		return this._http.post('/isms-risk-matrix-rating-levels', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_level_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/isms-risk-matrix-rating-levels/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_matrix_rating_levels') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/isms-risk-matrix-rating-levels/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_matrix_rating_levels') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/isms-risk-matrix-rating-levels/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/isms-risk-matrix-rating-levels/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_levels_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/isms-risk-matrix-rating-levels/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_level_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/isms-risk-matrix-rating-levels/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_level_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/isms-risk-matrix-rating-levels/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_matrix_rating_level_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						IsmsRiskMatrixRatingLevelMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchIsmsRiskMatrixRatingLevel(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: IsmsRiskMatrixRatingLevelPaginationResponse) => {
				IsmsRiskMatrixRatingLevelMasterStore.setIsmsRiskMatrixRatingLevel(res);
				return res;
			})
		);
	}

	sortIsmsRiskMatrixRatingLevelList(type: string, text: string) {
		if (!IsmsRiskMatrixRatingLevelMasterStore.orderBy) {
			IsmsRiskMatrixRatingLevelMasterStore.orderBy = 'asc';
			IsmsRiskMatrixRatingLevelMasterStore.orderItem = type;
		}
		else {
			if (IsmsRiskMatrixRatingLevelMasterStore.orderItem == type) {
				if (IsmsRiskMatrixRatingLevelMasterStore.orderBy == 'asc') IsmsRiskMatrixRatingLevelMasterStore.orderBy = 'desc';
				else IsmsRiskMatrixRatingLevelMasterStore.orderBy = 'asc'
			}
			else {
				IsmsRiskMatrixRatingLevelMasterStore.orderBy = 'asc';
				IsmsRiskMatrixRatingLevelMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
