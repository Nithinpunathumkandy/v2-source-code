import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessAssessmentFrequency, BusinessAssessmentFrequencyPaginationResponse } from 'src/app/core/models/masters/business-assessment/business-assessment-frequencies';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessAssessmentFrequencyMasterStore } from 'src/app/stores/masters/business-assessment/business-assessment-frequencies-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAssessmentFrequenciesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BusinessAssessmentFrequencyPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BusinessAssessmentFrequencyMasterStore.currentPage}`;
			if (BusinessAssessmentFrequencyMasterStore.orderBy) params += `&order_by=${BusinessAssessmentFrequencyMasterStore.orderItem}&order=${BusinessAssessmentFrequencyMasterStore.orderBy}`;
		}
		if (BusinessAssessmentFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessAssessmentFrequencyMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BusinessAssessmentFrequencyPaginationResponse>('/business-assessment-frequencies' + (params ? params : '')).pipe(
			map((res: BusinessAssessmentFrequencyPaginationResponse) => {
				BusinessAssessmentFrequencyMasterStore.setBusinessAssessmentFrequency(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<BusinessAssessmentFrequency> {
		return this._http.get<BusinessAssessmentFrequency>('/business-assessment-frequencies/' + id).pipe(
			map((res: BusinessAssessmentFrequency) => {
				BusinessAssessmentFrequencyMasterStore.updateBusinessAssessmentFrequency(res)
				return res;
			})
		);
	}

  updateItem(id, item: BusinessAssessmentFrequency): Observable<any> {
		return this._http.put('/business-assessment-frequencies/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'business_assessment_frequency_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: BusinessAssessmentFrequency) {
		return this._http.post('/business-assessment-frequencies', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'business_assessment_frequency_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/business-assessment-frequencies/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_Location_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/business-assessment-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_frequencys') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/business-assessment-frequencies/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/business-assessment-frequencies/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'storage_Location_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/business-assessment-frequencies/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'business_assessment_frequency_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/business-assessment-frequencies/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'business_assessment_frequency_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/business-assessment-frequencies/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'business_assessment_frequency_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BusinessAssessmentFrequencyMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchBusinessAssessmentFrequencyList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BusinessAssessmentFrequencyPaginationResponse) => {
				BusinessAssessmentFrequencyMasterStore.setBusinessAssessmentFrequency(res);
				return res;
			})
		);
	}

	sortBusinessAssessmentFrequencyList(type: string, text: string) {
		if (!BusinessAssessmentFrequencyMasterStore.orderBy) {
			BusinessAssessmentFrequencyMasterStore.orderBy = 'asc';
			BusinessAssessmentFrequencyMasterStore.orderItem = type;
		}
		else {
			if (BusinessAssessmentFrequencyMasterStore.orderItem == type) {
				if (BusinessAssessmentFrequencyMasterStore.orderBy == 'asc') BusinessAssessmentFrequencyMasterStore.orderBy = 'desc';
				else BusinessAssessmentFrequencyMasterStore.orderBy = 'asc'
			}
			else {
				BusinessAssessmentFrequencyMasterStore.orderBy = 'asc';
				BusinessAssessmentFrequencyMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
