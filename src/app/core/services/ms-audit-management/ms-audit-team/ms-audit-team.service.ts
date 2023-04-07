import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualTeam, MsAuditTeam, MsAuditTeamPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-team/ms-audit-team';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
	providedIn: 'root'
})
export class MsAuditTeamService {
	RightSidebarLayoutStore=RightSidebarLayoutStore
	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

	getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditTeamPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditTeamStore.currentPage}`;
			if (MsAuditTeamStore.orderBy) params += `&order_by=${MsAuditTeamStore.orderItem}&order=${MsAuditTeamStore.orderBy}`;
		}
		if (MsAuditTeamStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditTeamStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if(RightSidebarLayoutStore.filterPageTag == 'audit_teams' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<MsAuditTeamPaginationResponse>('/ms-teams' + (params ? params : '')).pipe(
			map((res: MsAuditTeamPaginationResponse) => {
				MsAuditTeamStore.setMsAuditTeam(res);
				return res;
			})
		);
	}

	getItem(id: number): Observable<IndividualTeam> {
		return this._http.get<IndividualTeam>('/ms-teams/' + id).pipe(
			map((res: IndividualTeam) => {
				MsAuditTeamStore.setIndividualMsAuditTeam(res)
				return res;
			})
		);
	}

	updateItem(id, item): Observable<any> {
		return this._http.put('/ms-teams/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	saveItem(item) {
		return this._http.post('/ms-teams', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/ms-teams/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_teams') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		let params = '';
		if (MsAuditTeamStore.orderBy) params += `?order=${MsAuditTeamStore.orderBy}`;
		if (MsAuditTeamStore.orderItem) params += `&order_by=${MsAuditTeamStore.orderItem}`;
		if (MsAuditTeamStore.searchText) params += `&q=${MsAuditTeamStore.searchText}`;
		if(RightSidebarLayoutStore.filterPageTag == 'audit_teams' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get('/ms-teams/export' + params, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_teams') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/ms-teams/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/ms-teams/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

	activate(id: number) {
		return this._http.put('/ms-teams/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/ms-teams/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/ms-teams/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_team_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						MsAuditTeamStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchMsAuditTeam(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: MsAuditTeamPaginationResponse) => {
				MsAuditTeamStore.setMsAuditTeam(res);
				return res;
			})
		);
	}

	getThumbnailPreview(type, token, h?: number, w?: number) {
		// +(h && w)?'&h='+h+'&w='+w:''
		switch (type) {
			case 'teams-logo': return environment.apiBasePath + '/ms-audit-management/files/team-logo/thumbnail?token=' + token;
				break;
		}
	}

	setFileDetails(imageDetails, url, type) {
		MsAuditTeamStore.setFileDetails(imageDetails, url, type);
	}

	setSelectedImageDetails(imageDetails, type) {
		MsAuditTeamStore.setSelectedImageDetails(imageDetails);
	}

	sortMsAuditTeamList(type: string, text: string) {
		if (!MsAuditTeamStore.orderBy) {
			MsAuditTeamStore.orderBy = 'asc';
			MsAuditTeamStore.orderItem = type;
		}
		else {
			if (MsAuditTeamStore.orderItem == type) {
				if (MsAuditTeamStore.orderBy == 'asc') MsAuditTeamStore.orderBy = 'desc';
				else MsAuditTeamStore.orderBy = 'asc'
			}
			else {
				MsAuditTeamStore.orderBy = 'asc';
				MsAuditTeamStore.orderItem = type;
			}
		}
	}
}
