import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseChecklist, TestAndExerciseChecklistPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-checklist';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseChecklistMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-checklist.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TestAndExerciseChecklistPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${TestAndExerciseChecklistMasterStore.currentPage}`;
			if (TestAndExerciseChecklistMasterStore.orderBy) params += `&order_by=${TestAndExerciseChecklistMasterStore.orderItem}&order=${TestAndExerciseChecklistMasterStore.orderBy}`;
		}
		if (TestAndExerciseChecklistMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseChecklistMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<TestAndExerciseChecklistPaginationResponse>('/test-and-exercise-checklists' + (params ? params : '')).pipe(
			map((res: TestAndExerciseChecklistPaginationResponse) => {
				TestAndExerciseChecklistMasterStore.setTestAndExerciseChecklist(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<TestAndExerciseChecklist> {
		return this._http.get<TestAndExerciseChecklist>('/test-and-exercise-checklists/' + id).pipe(
			map((res: TestAndExerciseChecklist) => {
				TestAndExerciseChecklistMasterStore.updateTestAndExerciseChecklist(res)
				return res;
			})
		);
	}

  updateItem(id, item: TestAndExerciseChecklist): Observable<any> {
		return this._http.put('/test-and-exercise-checklists/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_updated!');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: TestAndExerciseChecklist) {
		return this._http.post('/test-and-exercise-checklists', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/test-and-exercise-checklists/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_checklist_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/test-and-exercise-checklists/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_checklist') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/test-and-exercise-checklists/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/test-and-exercise-checklists/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/test-and-exercise-checklists/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/test-and-exercise-checklists/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/test-and-exercise-checklists/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_checklist_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						TestAndExerciseChecklistMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchTestAndExerciseChecklist(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: TestAndExerciseChecklistPaginationResponse) => {
				TestAndExerciseChecklistMasterStore.setTestAndExerciseChecklist(res);
				return res;
			})
		);
	}

	sortTestAndExerciseChecklistList(type: string, text: string) {
		if (!TestAndExerciseChecklistMasterStore.orderBy) {
			TestAndExerciseChecklistMasterStore.orderBy = 'asc';
			TestAndExerciseChecklistMasterStore.orderItem = type;
		}
		else {
			if (TestAndExerciseChecklistMasterStore.orderItem == type) {
				if (TestAndExerciseChecklistMasterStore.orderBy == 'asc') TestAndExerciseChecklistMasterStore.orderBy = 'desc';
				else TestAndExerciseChecklistMasterStore.orderBy = 'asc'
			}
			else {
				TestAndExerciseChecklistMasterStore.orderBy = 'asc';
				TestAndExerciseChecklistMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
