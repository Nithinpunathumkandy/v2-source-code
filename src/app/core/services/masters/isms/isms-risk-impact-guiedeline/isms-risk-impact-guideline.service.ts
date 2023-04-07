import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { IsmsRiskImpactGuideline, IsmsRiskImpactGuidelinePaginationResponse } from 'src/app/core/models/masters/isms/isms-risk-impact-gudeline';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskImpactGuidelineMasterStore } from 'src/app/stores/masters/isms/isms-risk-impact-guideline-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskImpactGuidelineService {


  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<IsmsRiskImpactGuidelinePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${IsmsRiskImpactGuidelineMasterStore.currentPage}`;
			if (IsmsRiskImpactGuidelineMasterStore.orderBy) params += `&order_by=${IsmsRiskImpactGuidelineMasterStore.orderItem}&order=${IsmsRiskImpactGuidelineMasterStore.orderBy}`;
		}
		if (IsmsRiskImpactGuidelineMasterStore.searchText) params += (params ? '&q=' : '?q=') + IsmsRiskImpactGuidelineMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<IsmsRiskImpactGuidelinePaginationResponse>('/isms-risk-impact-guidelines' + (params ? params : '')).pipe(
			map((res: IsmsRiskImpactGuidelinePaginationResponse) => {
				IsmsRiskImpactGuidelineMasterStore.setIsmsRiskImpactGuideline(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<IsmsRiskImpactGuideline> {
		return this._http.get<IsmsRiskImpactGuideline>('/isms-risk-impact-guidelines/' + id).pipe(
			map((res: IsmsRiskImpactGuideline) => {
				IsmsRiskImpactGuidelineMasterStore.updateIsmsRiskImpactGuideline(res)
				return res;
			})
		);
	}

	getIsmsRiskImpactGuidelines(getAll: boolean = false, additionalParams?: string, status: boolean = false){
		let params = '';
		if (!getAll) {
			params = `?page=${IsmsRiskImpactGuidelineMasterStore.currentPage}`;
			if (IsmsRiskImpactGuidelineMasterStore.orderBy) params += `&order_by=${IsmsRiskImpactGuidelineMasterStore.orderItem}&order=${IsmsRiskImpactGuidelineMasterStore.orderBy}`;
		}
		return this._http.get<IsmsRiskImpactGuideline[]>('/isms-impact-guidelines' + (params ? params : '')).pipe(
			map((res: IsmsRiskImpactGuideline[]) => {
				IsmsRiskImpactGuidelineMasterStore.setIsmsRiskRatingImpactGuideline(res);
				return res;
			})
		);
	}

  updateItem(id, item: IsmsRiskImpactGuideline): Observable<any> {
		return this._http.put('/isms-risk-impact-guidelines/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: IsmsRiskImpactGuideline) {
		return this._http.post('/isms-risk-impact-guidelines', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/isms-risk-impact-guidelines/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_impact_guideline') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/isms-risk-impact-guidelines/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_impact_guideline') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/isms-risk-impact-guidelines/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/isms-risk-impact-guidelines/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  	activate(id: number) {
		return this._http.put('/isms-risk-impact-guidelines/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/isms-risk-impact-guidelines/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/isms-risk-impact-guidelines/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'isms_risk_impact_guideline_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						IsmsRiskImpactGuidelineMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchRiskImpactGuideline(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: IsmsRiskImpactGuidelinePaginationResponse) => {
				IsmsRiskImpactGuidelineMasterStore.setIsmsRiskImpactGuideline(res);
				return res;
			})
		);
	}

	sortIsmsRiskImpactGuidelineList(type: string, text: string) {
		if (!IsmsRiskImpactGuidelineMasterStore.orderBy) {
			IsmsRiskImpactGuidelineMasterStore.orderBy = 'asc';
			IsmsRiskImpactGuidelineMasterStore.orderItem = type;
		}
		else {
			if (IsmsRiskImpactGuidelineMasterStore.orderItem == type) {
				if (IsmsRiskImpactGuidelineMasterStore.orderBy == 'asc') IsmsRiskImpactGuidelineMasterStore.orderBy = 'desc';
				else IsmsRiskImpactGuidelineMasterStore.orderBy = 'asc'
			}
			else {
				IsmsRiskImpactGuidelineMasterStore.orderBy = 'asc';
				IsmsRiskImpactGuidelineMasterStore.orderItem = type;
			}
		}
	}
}
