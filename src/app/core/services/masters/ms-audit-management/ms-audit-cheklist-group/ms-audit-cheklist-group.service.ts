import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditChecklistGroup, AuditChecklistGroupPaginationResponse, AuditChecklistGroupSingle } from 'src/app/core/models/masters/ms-audit-management/ms-audit-checklist-group';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuditChecklistGroupService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AuditChecklistGroupPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditChecklistGroupMasterStore.currentPage}`;
			if (AuditChecklistGroupMasterStore.orderBy) params += `&order_by=${AuditChecklistGroupMasterStore.orderItem}&order=${AuditChecklistGroupMasterStore.orderBy}`;
		}
		if (AuditChecklistGroupMasterStore.searchText) params += (params ? '&q=' : '?q=') + AuditChecklistGroupMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AuditChecklistGroupPaginationResponse>('/checklist-groups'+ (params ? params : '')).pipe(
			map((res: AuditChecklistGroupPaginationResponse) => {
				AuditChecklistGroupMasterStore.setAuditChecklistGroup(res);
				return res;
			})
		);
	}


	getAllItems(): Observable<AuditChecklistGroup[]> {
		return this._http.get<AuditChecklistGroup[]>('/checklist-groups?is_all=true').pipe(
			map((res: AuditChecklistGroup[]) => {
				AuditChecklistGroupMasterStore.setAllAuditChecklistGroupPaginationResponse(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<AuditChecklistGroupSingle> {
		return this._http.get<AuditChecklistGroupSingle>('/checklist-groups/' + id).pipe(
			map((res: AuditChecklistGroupSingle) => {
				AuditChecklistGroupMasterStore.setIndividualAuditChecklistGroup(res)
				return res;
			})
		);
	}

  updateItem(id, item: AuditChecklistGroup): Observable<any> {
		return this._http.put('/checklist-groups/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: any) {
		return this._http.post('/checklist-groups', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/checklist-groups/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_checklist_group_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/checklist-groups/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_checklist_group') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/checklist-groups/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/checklist-groups/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/checklist-groups/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/checklist-groups/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/checklist-groups/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						AuditChecklistGroupMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSuppliers(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: AuditChecklistGroupPaginationResponse) => {
				AuditChecklistGroupMasterStore.setAuditChecklistGroup(res);
				return res;
			})
		);
	}

	sortSuppliersList(type: string, text: string) {
		if (!AuditChecklistGroupMasterStore.orderBy) {
			AuditChecklistGroupMasterStore.orderBy = 'asc';
			AuditChecklistGroupMasterStore.orderItem = type;
		}
		else {
			if (AuditChecklistGroupMasterStore.orderItem == type) {
				if (AuditChecklistGroupMasterStore.orderBy == 'asc') AuditChecklistGroupMasterStore.orderBy = 'desc';
				else AuditChecklistGroupMasterStore.orderBy = 'asc'
			}
			else {
				AuditChecklistGroupMasterStore.orderBy = 'asc';
				AuditChecklistGroupMasterStore.orderItem = type;
			}
		}
	}


	/**
   * Sets File Details
   * @param imageDetails File Details Returned by Upload API
   * @param url preview url
   * @param type type of file - logo or brochure
   */
	 setFileDetails(imageDetails,url,type){
		AuditChecklistGroupMasterStore.setFileDetails(imageDetails,url,type);
	  }
	
	  // Returns File Details
	  getFileDetails(type){
		return AuditChecklistGroupMasterStore.getFileDetailsByType(type);
	  }
}