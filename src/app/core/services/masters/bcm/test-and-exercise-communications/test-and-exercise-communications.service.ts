import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseCommunications, TestAndExerciseCommunicationsPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-communications';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseCommunicationsMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-communications.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseCommunicationsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting TestAndExerciseCommunications List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TestAndExerciseCommunicationsPaginationResponse> {
		let params = '';
		console.log("getAll",getAll)
		if (!getAll) {
			params = `?page=${TestAndExerciseCommunicationsMasterStore.currentPage}`;
			if (TestAndExerciseCommunicationsMasterStore.orderBy) params += `&order=${TestAndExerciseCommunicationsMasterStore.orderBy}`;
			if (TestAndExerciseCommunicationsMasterStore.orderItem) params += `&order_by=${TestAndExerciseCommunicationsMasterStore.orderItem}`;
		}
		if (TestAndExerciseCommunicationsMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseCommunicationsMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<TestAndExerciseCommunicationsPaginationResponse>('/test-and-exercise-communications' + (params ? params : '')).pipe(
			map((res: TestAndExerciseCommunicationsPaginationResponse) => {
				TestAndExerciseCommunicationsMasterStore.setTestAndExerciseCommunications(res);
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for getting item TestAndExerciseCommunications
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
  getItem(id: number): Observable<TestAndExerciseCommunications> {
		return this._http.get<TestAndExerciseCommunications>('/test-and-exercise-communications/' + id).pipe(
			map((res: TestAndExerciseCommunications) => {
				TestAndExerciseCommunicationsMasterStore.updateTestAndExerciseCommunications(res)
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for Post TestAndExerciseCommunications item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
  saveItem(item: TestAndExerciseCommunications) {
		return this._http.post('/test-and-exercise-communications', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for Update TestAndExerciseCommunications item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	updateItem(id, item: TestAndExerciseCommunications): Observable<any> {
		return this._http.put('/test-and-exercise-communications/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}	

   /**
   * @description
   * This method is used for delete the TestAndExerciseCommunications item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	delete(id: number) {
		return this._http.delete('/test-and-exercise-communications/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						TestAndExerciseCommunicationsMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}	

   /**
   * @description
   * this method is used for generate TestAndExerciseCommunications data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	generateTemplate() {
		this._http.get('/test-and-exercise-communications/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_communications_template') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for export TestAndExerciseCommunications data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	exportToExcel() {
		this._http.get('/test-and-exercise-communications/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_communications') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for share TestAndExerciseCommunications data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	shareData(data) {
		return this._http.post('/test-and-exercise-communications/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

   /**
   * @description
   * this method is used for import TestAndExerciseCommunications data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/test-and-exercise-communications/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

   /**
   * @description
   * This method is used for activate the TestAndExerciseCommunications item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
  activate(id: number) {
		return this._http.put('/test-and-exercise-communications/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for deactivate the TestAndExerciseCommunications item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseCommunicationsService
   */
	deactivate(id: number) {
		return this._http.put('/test-and-exercise-communications/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_communications_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}




	sortTestAndExerciseCommunicationsList(type: string, text: string) {
		if (!TestAndExerciseCommunicationsMasterStore.orderBy) {
			TestAndExerciseCommunicationsMasterStore.orderBy = 'asc';
			TestAndExerciseCommunicationsMasterStore.orderItem = type;
		}
		else {
			if (TestAndExerciseCommunicationsMasterStore.orderItem == type) {
				if (TestAndExerciseCommunicationsMasterStore.orderBy == 'asc') TestAndExerciseCommunicationsMasterStore.orderBy = 'desc';
				else TestAndExerciseCommunicationsMasterStore.orderBy = 'asc'
			}
			else {
				TestAndExerciseCommunicationsMasterStore.orderBy = 'asc';
				TestAndExerciseCommunicationsMasterStore.orderItem = type;
			}
		}
	}
}
