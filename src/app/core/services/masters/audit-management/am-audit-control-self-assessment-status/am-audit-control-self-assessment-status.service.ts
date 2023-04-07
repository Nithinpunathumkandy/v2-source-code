import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditManagementLikelihood, AuditManagementLikelihoodPaginationResponse } from 'src/app/core/models/masters/audit-management/audit-management-likelihood';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditManagementControlSelfAssessmentStatusStore } from 'src/app/stores/masters/audit-management/am-audit-control-self-assessment-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditControlSelfAssessmentStatusService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AuditManagementLikelihoodPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditManagementControlSelfAssessmentStatusStore.currentPage}`;
			if (AuditManagementControlSelfAssessmentStatusStore.orderBy) params += `&order_by=${AuditManagementControlSelfAssessmentStatusStore.orderItem}&order=${AuditManagementControlSelfAssessmentStatusStore.orderBy}`;
		}
		if (AuditManagementControlSelfAssessmentStatusStore.searchText) params += (params ? '&q=' : '?q=') + AuditManagementControlSelfAssessmentStatusStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AuditManagementLikelihoodPaginationResponse>('/am-audit-control-self-assessment-statuses' + (params ? params : '')).pipe(
			map((res: AuditManagementLikelihoodPaginationResponse) => {
				AuditManagementControlSelfAssessmentStatusStore.setAuditManagementSelfAssessmentStatus(res);
				return res;
			})
		);
	}

  // getItem(id: number): Observable<AuditManagementLikelihood> {
	// 	return this._http.get<AuditManagementLikelihood>('/am-likelihoods/' + id).pipe(
	// 		map((res: AuditManagementLikelihood) => {
	// 			AuditManagementControlSelfAssessmentStatusStore.updateAuditManagementLikelihood(res)
	// 			return res;
	// 		})
	// 	);
	// }

  // updateItem(id, item: AuditManagementLikelihood): Observable<any> {
	// 	return this._http.put('/am-likelihoods/' + id, item).pipe(
	// 		map(res => {
	// 			this._utilityService.showSuccessMessage('success', 'update_success');
	// 			this.getItems(false, null, true).subscribe();
	// 			return res;
	// 		})
	// 	);
	// }

  // saveItem(item: AuditManagementLikelihood) {
	// 	return this._http.post('/am-likelihoods', item).pipe(
	// 		map(res => {
	// 			this._utilityService.showSuccessMessage('success', 'create_success');
	// 			if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
	// 			else this.getItems().subscribe();
	// 			return res;
	// 		})
	// 	);
	// }
	// generateTemplate() {
	// 	this._http.get('/am-likelihoods/template', { responseType: 'blob' as 'json' }).subscribe(
	// 		(response: any) => {
	// 			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_Location_template') + ".xlsx");
	// 		}
	// 	)
	// }

	exportToExcel() {
		this._http.get('/am-audit-control-self-assessment-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_management_self_assessment_status') + ".xlsx");
			}
		)
	}

	// shareData(data) {
	// 	return this._http.post('/am-likelihoods/share', data).pipe(
	// 		map((res: any) => {
	// 			this._utilityService.showSuccessMessage('success', 'share_success');
	// 			return res;
	// 		})
	// 	)
	// }

	// importData(data) {
	// 	const formData = new FormData();
	// 	formData.append('file', data);
	// 	return this._http.post('/am-likelihoods/import', data).pipe(
	// 		map((res: any) => {
	// 			this._utilityService.showSuccessMessage('success', 'import_success');
	// 			this.getItems(false, null, true).subscribe();
	// 			return res;
	// 		})
	// 	)
	// }

  // activate(id: number) {
	// 	return this._http.put('/am-likelihoods/' + id + '/activate', null).pipe(
	// 		map(res => {
	// 			this._utilityService.showSuccessMessage('success', 'activate_success');
	// 			this.getItems(false, null, true).subscribe();
	// 			return res;
	// 		})
	// 	);
	// }

	// deactivate(id: number) {
	// 	return this._http.put('/am-likelihoods/' + id + '/deactivate', null).pipe(
	// 		map(res => {
	// 			this._utilityService.showSuccessMessage('success', 'deactivate_success');
	// 			this.getItems(false, null, true).subscribe();
	// 			return res;
	// 		})
	// 	);
	// }

	// delete(id: number) {
	// 	return this._http.delete('/am-likelihoods/' + id).pipe(
	// 		map(res => {
	// 			this._utilityService.showSuccessMessage('success', 'delete_success');
	// 			this.getItems(false, null, true).subscribe(resp => {
	// 				if (resp.from == null) {
	// 					AuditManagementControlSelfAssessmentStatusStore.setCurrentPage(resp.current_page - 1);
	// 					this.getItems(false, null, true).subscribe();
	// 				}
	// 			});
	// 			return res;
	// 		})
	// 	);
	// }

	searchAuditManagementLikelihoodList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: AuditManagementLikelihoodPaginationResponse) => {
				AuditManagementControlSelfAssessmentStatusStore.setAuditManagementSelfAssessmentStatus(res);
				return res;
			})
		);
	}

	sortAuditManagementLikelihoodList(type: string, text: string) {
		if (!AuditManagementControlSelfAssessmentStatusStore.orderBy) {
			AuditManagementControlSelfAssessmentStatusStore.orderBy = 'asc';
			AuditManagementControlSelfAssessmentStatusStore.orderItem = type;
		}
		else {
			if (AuditManagementControlSelfAssessmentStatusStore.orderItem == type) {
				if (AuditManagementControlSelfAssessmentStatusStore.orderBy == 'asc') AuditManagementControlSelfAssessmentStatusStore.orderBy = 'desc';
				else AuditManagementControlSelfAssessmentStatusStore.orderBy = 'asc'
			}
			else {
				AuditManagementControlSelfAssessmentStatusStore.orderBy = 'asc';
				AuditManagementControlSelfAssessmentStatusStore.orderItem = type;
			}
		}
	}
}
