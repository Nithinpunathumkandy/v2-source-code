import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditManagementRiskRating, AuditManagementRiskRatingPaginationResponse } from 'src/app/core/models/masters/audit-management/audit-management-risk-rating';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditManagementRiskRatingMasterStore } from 'src/app/stores/masters/audit-management/audit-management-risk-rating-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuditManagementRiskRatingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AuditManagementRiskRatingPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditManagementRiskRatingMasterStore.currentPage}`;
			if (AuditManagementRiskRatingMasterStore.orderBy) params += `&order_by=${AuditManagementRiskRatingMasterStore.orderItem}&order=${AuditManagementRiskRatingMasterStore.orderBy}`;
		}
		if (AuditManagementRiskRatingMasterStore.searchText) params += (params ? '&q=' : '?q=') + AuditManagementRiskRatingMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AuditManagementRiskRatingPaginationResponse>('/am-risk-ratings' + (params ? params : '')).pipe(
			map((res: AuditManagementRiskRatingPaginationResponse) => {
				AuditManagementRiskRatingMasterStore.setAuditManagementRiskRating(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<AuditManagementRiskRating> {
		return this._http.get<AuditManagementRiskRating>('/am-risk-ratings/' + id).pipe(
			map((res: AuditManagementRiskRating) => {
				AuditManagementRiskRatingMasterStore.updateAuditManagementRiskRating(res)
				return res;
			})
		);
	}

  updateItem(id, item: AuditManagementRiskRating): Observable<any> {
		return this._http.put('/am-risk-ratings/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: AuditManagementRiskRating) {
		return this._http.post('/am-risk-ratings', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/am-risk-ratings/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_Location_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/am-risk-ratings/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_management_risk_ratings') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/am-risk-ratings/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/am-risk-ratings/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/am-risk-ratings/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/am-risk-ratings/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/am-risk-ratings/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						AuditManagementRiskRatingMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchAuditManagementRiskRatingList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: AuditManagementRiskRatingPaginationResponse) => {
				AuditManagementRiskRatingMasterStore.setAuditManagementRiskRating(res);
				return res;
			})
		);
	}

	sortAuditManagementRiskRatingList(type: string, text: string) {
		if (!AuditManagementRiskRatingMasterStore.orderBy) {
			AuditManagementRiskRatingMasterStore.orderBy = 'asc';
			AuditManagementRiskRatingMasterStore.orderItem = type;
		}
		else {
			if (AuditManagementRiskRatingMasterStore.orderItem == type) {
				if (AuditManagementRiskRatingMasterStore.orderBy == 'asc') AuditManagementRiskRatingMasterStore.orderBy = 'desc';
				else AuditManagementRiskRatingMasterStore.orderBy = 'asc'
			}
			else {
				AuditManagementRiskRatingMasterStore.orderBy = 'asc';
				AuditManagementRiskRatingMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
