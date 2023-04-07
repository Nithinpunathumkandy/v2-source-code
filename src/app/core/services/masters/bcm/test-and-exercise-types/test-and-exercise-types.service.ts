import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseTypes, TestAndExerciseTypesPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-types';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseTypesMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-types.master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting Test And Exercise Types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TestAndExerciseTypesPaginationResponse> {
		let params = '';
		console.log("getAll",getAll)
		if (!getAll) {
			params = `?page=${TestAndExerciseTypesMasterStore.currentPage}`;
			if (TestAndExerciseTypesMasterStore.orderBy) params += `&order=${TestAndExerciseTypesMasterStore.orderBy}`;
			if (TestAndExerciseTypesMasterStore.orderItem) params += `&order_by=${TestAndExerciseTypesMasterStore.orderItem}`;
			if (TestAndExerciseTypesMasterStore.searchText) params += `&q=${TestAndExerciseTypesMasterStore.searchText}`;
		}
		if (TestAndExerciseTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseTypesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<TestAndExerciseTypesPaginationResponse>('/test-and-exercise-types' + (params ? params : '')).pipe(
			map((res: TestAndExerciseTypesPaginationResponse) => {
				TestAndExerciseTypesMasterStore.setTestAndExerciseTypes(res);
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for getting item TestAndExerciseTypes
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
  getItem(id: number): Observable<TestAndExerciseTypes> {
		return this._http.get<TestAndExerciseTypes>('/test-and-exercise-types/' + id).pipe(
			map((res: TestAndExerciseTypes) => {
				TestAndExerciseTypesMasterStore.updateTestAndExerciseTypes(res)
				return res;
			})
		);
	}


   /**
   * @description
   * This method is used for Update TestAndExerciseTypes item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
  updateItem(id, item: TestAndExerciseTypes): Observable<any> {
		return this._http.put('/test-and-exercise-types/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for Post TestAndExerciseTypes item
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
  saveItem(item: TestAndExerciseTypes) {
		return this._http.post('/test-and-exercise-types', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * this method is used for generate TestAndExerciseTypes data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	generateTemplate() {
		this._http.get('/test-and-exercise-types/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_types_template') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for export TestAndExerciseTypes data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	exportToExcel() {
		this._http.get('/test-and-exercise-types/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_types') + ".xlsx");
			}
		)
	}

   /**
   * @description
   * this method is used for share TestAndExerciseTypes data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	shareData(data) {
		return this._http.post('/test-and-exercise-types/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

   /**
   * @description
   * this method is used for import TestAndExerciseTypes data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/test-and-exercise-types/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

   /**
   * @description
   * This method is used for activate the TestAndExerciseTypes item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
  activate(id: number) {
		return this._http.put('/test-and-exercise-types/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for deactivate the TestAndExerciseTypes item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	deactivate(id: number) {
		return this._http.put('/test-and-exercise-types/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for delete the TestAndExerciseTypes item
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof TestAndExerciseTypesService
   */
	delete(id: number) {
		return this._http.delete('/test-and-exercise-types/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_types_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						TestAndExerciseTypesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}


	sortTestAndExerciseTypesList(type: string, text: string) {
		if (!TestAndExerciseTypesMasterStore.orderBy) {
			TestAndExerciseTypesMasterStore.orderBy = 'asc';
			TestAndExerciseTypesMasterStore.orderItem = type;
		}
		else {
			if (TestAndExerciseTypesMasterStore.orderItem == type) {
				if (TestAndExerciseTypesMasterStore.orderBy == 'asc') TestAndExerciseTypesMasterStore.orderBy = 'desc';
				else TestAndExerciseTypesMasterStore.orderBy = 'asc'
			}
			else {
				TestAndExerciseTypesMasterStore.orderBy = 'asc';
				TestAndExerciseTypesMasterStore.orderItem = type;
			}
		}
	}
}
