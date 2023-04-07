import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskImpactGuideline, RiskImpactGuidelinePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-impact-guideline';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskImpactGuidelineService {


  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<RiskImpactGuidelinePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${RiskImpactGuidelineMasterStore.currentPage}`;
			if (RiskImpactGuidelineMasterStore.orderBy) params += `&order_by=${RiskImpactGuidelineMasterStore.orderItem}&order=${RiskImpactGuidelineMasterStore.orderBy}`;
		}
		if (RiskImpactGuidelineMasterStore.searchText) params += (params ? '&q=' : '?q=') + RiskImpactGuidelineMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<RiskImpactGuidelinePaginationResponse>('/risk-impact-guidelines' + (params ? params : '')).pipe(
			map((res: RiskImpactGuidelinePaginationResponse) => {
				RiskImpactGuidelineMasterStore.setRiskImpactGuideline(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<RiskImpactGuideline> {
		return this._http.get<RiskImpactGuideline>('/risk-impact-guidelines/' + id).pipe(
			map((res: RiskImpactGuideline) => {
				RiskImpactGuidelineMasterStore.updateRiskImpactGuideline(res)
				return res;
			})
		);
	}

	getRiskImpactGuidelines(getAll: boolean = false, additionalParams?: string, status: boolean = false){
		let params = '';
		if (!getAll) {
			params = `?page=${RiskImpactGuidelineMasterStore.currentPage}`;
			if (RiskImpactGuidelineMasterStore.orderBy) params += `&order_by=${RiskImpactGuidelineMasterStore.orderItem}&order=${RiskImpactGuidelineMasterStore.orderBy}`;
		}
		return this._http.get<RiskImpactGuideline[]>('/risk-rating-impact-guidelines' + (params ? params : '')).pipe(
			map((res: RiskImpactGuideline[]) => {
				RiskImpactGuidelineMasterStore.setRiskRatingImpactGuideline(res);
				return res;
			})
		);
	}

  updateItem(id, item: RiskImpactGuideline): Observable<any> {
		return this._http.put('/risk-impact-guidelines/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: RiskImpactGuideline) {
		return this._http.post('/risk-impact-guidelines', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/risk-impact-guidelines/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_impact_guideline') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/risk-impact-guidelines/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_impact_guideline') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/risk-impact-guidelines/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/risk-impact-guidelines/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/risk-impact-guidelines/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/risk-impact-guidelines/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/risk-impact-guidelines/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'risk_impact_guideline_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						RiskImpactGuidelineMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchRiskImpactGuideline(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: RiskImpactGuidelinePaginationResponse) => {
				RiskImpactGuidelineMasterStore.setRiskImpactGuideline(res);
				return res;
			})
		);
	}

	sortRiskImpactGuidelineList(type: string, text: string) {
		if (!RiskImpactGuidelineMasterStore.orderBy) {
			RiskImpactGuidelineMasterStore.orderBy = 'asc';
			RiskImpactGuidelineMasterStore.orderItem = type;
		}
		else {
			if (RiskImpactGuidelineMasterStore.orderItem == type) {
				if (RiskImpactGuidelineMasterStore.orderBy == 'asc') RiskImpactGuidelineMasterStore.orderBy = 'desc';
				else RiskImpactGuidelineMasterStore.orderBy = 'asc'
			}
			else {
				RiskImpactGuidelineMasterStore.orderBy = 'asc';
				RiskImpactGuidelineMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
