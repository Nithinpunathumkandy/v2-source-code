import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrainingReportDetailsPaginationResponse, TrainingReportPaginationResponse } from 'src/app/core/models/training/training-reports/training-reports';
import { TrainingReportStore } from 'src/app/stores/training/training-report/training-report-store';

@Injectable({
  providedIn: 'root'
})
export class TrainingReportDetailsService {

  constructor(
	private _http: HttpClient,
	private _utilityService: UtilityService,
  ) { }


    /**
   * @description
   * This method is used for getting Training reports.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TrainingReportDetailsService
   */
	getItems(riskCountObject: any, additionalParams): Observable<TrainingReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
			return this._http.get<TrainingReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: TrainingReportPaginationResponse) => {
					TrainingReportStore.setTrainingReportDetails(res);
					return res;
				})
			);
	}


	
   /**
   * @description
   * This method is used for getting training report item details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TrainingReportDetailsService
   */
	getTrainingItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<TrainingReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${TrainingReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
			return this._http.get<TrainingReportDetailsPaginationResponse>(`/reports/trainings?${riskCountListObject.trainingItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: TrainingReportDetailsPaginationResponse) => {
					TrainingReportStore.setTrainingReportsCountDetails(res);
					return res;
				})
			);
	}

   /**
   * @description
   * this method is used for export training report item data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TrainingReportDetailsService
   */
	exportToExcel(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
			this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			);
			
	}

   /**
   * @description
   * this method is used for training export data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TrainingReportDetailsService
   */
	exportToExcelList(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
			this._http.get(`/trainings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
	}
	
}
