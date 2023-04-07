import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseRecoveryLevel, TestAndExerciseRecoveryLevelPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-recovery-level';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseRecoveryLevelMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-recovery-level.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseRecoveryLevelService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TestAndExerciseRecoveryLevelPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${TestAndExerciseRecoveryLevelMasterStore.currentPage}`;
			if (TestAndExerciseRecoveryLevelMasterStore.orderBy) params += `&order_by=${TestAndExerciseRecoveryLevelMasterStore.orderItem}&order=${TestAndExerciseRecoveryLevelMasterStore.orderBy}`;
		}
		if (TestAndExerciseRecoveryLevelMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseRecoveryLevelMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<TestAndExerciseRecoveryLevelPaginationResponse>('/test-and-exercise-recovery-levels' + (params ? params : '')).pipe(
			map((res: TestAndExerciseRecoveryLevelPaginationResponse) => {
				TestAndExerciseRecoveryLevelMasterStore.setTestAndExerciseRecoveryLevel(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<TestAndExerciseRecoveryLevel> {
		return this._http.get<TestAndExerciseRecoveryLevel>('/test-and-exercise-recovery-levels/' + id).pipe(
			map((res: TestAndExerciseRecoveryLevel) => {
				TestAndExerciseRecoveryLevelMasterStore.updateTestAndExerciseRecoveryLevel(res)
				return res;
			})
		);
	}

  updateItem(id, item: TestAndExerciseRecoveryLevel): Observable<any> {
		return this._http.put('/test-and-exercise-recovery-levels/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_level_updated!');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: TestAndExerciseRecoveryLevel) {
		return this._http.post('/test-and-exercise-recovery-levels', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_level_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/test-and-exercise-recovery-levels/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_recovery_level_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/test-and-exercise-recovery-levels/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_recovery_levels') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/test-and-exercise-recovery-levels/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/test-and-exercise-recovery-levels/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_levels_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/test-and-exercise-recovery-levels/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_level_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/test-and-exercise-recovery-levels/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_level_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/test-and-exercise-recovery-levels/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_recovery_level_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						TestAndExerciseRecoveryLevelMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchTestAndExerciseRecoveryLevel(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: TestAndExerciseRecoveryLevelPaginationResponse) => {
				TestAndExerciseRecoveryLevelMasterStore.setTestAndExerciseRecoveryLevel(res);
				return res;
			})
		);
	}

	sortTestAndExerciseRecoveryLevelList(type: string, text: string) {
		if (!TestAndExerciseRecoveryLevelMasterStore.orderBy) {
			TestAndExerciseRecoveryLevelMasterStore.orderBy = 'asc';
			TestAndExerciseRecoveryLevelMasterStore.orderItem = type;
		}
		else {
			if (TestAndExerciseRecoveryLevelMasterStore.orderItem == type) {
				if (TestAndExerciseRecoveryLevelMasterStore.orderBy == 'asc') TestAndExerciseRecoveryLevelMasterStore.orderBy = 'desc';
				else TestAndExerciseRecoveryLevelMasterStore.orderBy = 'asc'
			}
			else {
				TestAndExerciseRecoveryLevelMasterStore.orderBy = 'asc';
				TestAndExerciseRecoveryLevelMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
