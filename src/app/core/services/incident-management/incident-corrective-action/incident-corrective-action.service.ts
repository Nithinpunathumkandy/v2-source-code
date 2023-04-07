import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoryData, IncidentCorrectiveAction, IncidentCorrectiveActionPaginationResponse } from 'src/app/core/models/incident-management/incident/corrective-action/incident-corrective-action';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
	providedIn: 'root'
})
export class IncidentCorrectiveActionService {

	itemChange: EventEmitter<number> = new EventEmitter();

	constructor(private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

	getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<IncidentCorrectiveActionPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${IncidentCorrectiveActionStore.currentPage}`;
			if (IncidentCorrectiveActionStore.orderBy) params += `&order_by=${IncidentCorrectiveActionStore.orderItem}&order=${IncidentCorrectiveActionStore.orderBy}`;

		}
		if (additionalParams) params += additionalParams;
		if (IncidentCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + IncidentCorrectiveActionStore.searchText;
		if (is_all) params += '&status=all';
		if (RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
			params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<IncidentCorrectiveActionPaginationResponse>('/incident-corrective-actions' + (params ? params : '')).pipe(
			map((res: IncidentCorrectiveActionPaginationResponse) => {
				IncidentCorrectiveActionStore.setIncidentCorrectiveAction(res);
				return res;
			})
		);

	}

	incidentCorrectiveActions(getAll: boolean = false, additionalParams?: string, is_all: boolean = false) {
		// let params = '?incident_ids='+[IncidentStore.selectedId];
		let params = '';
		if (!getAll) {
			params = `&page=${IncidentCorrectiveActionStore.currentPage}`;
			if (IncidentCorrectiveActionStore.orderBy) params += `&order_by=${IncidentCorrectiveActionStore.orderItem}&order=${IncidentCorrectiveActionStore.orderBy}`;

		}
		if (additionalParams) params += additionalParams;
		if (IncidentCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + IncidentCorrectiveActionStore.searchText;
		if (is_all) params += '&status=all';
		if (RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
			params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<IncidentCorrectiveActionPaginationResponse>('/incident-corrective-actions?incident_ids=' + [IncidentStore.selectedId] + (params ? params : '')).pipe(
			map((res: IncidentCorrectiveActionPaginationResponse) => {
				IncidentCorrectiveActionStore.setIncidentCorrectiveAction(res);
				return res;
			})
		);
	}

	getItem(id: number):
		Observable<IncidentCorrectiveAction> {
		return this._http.get<IncidentCorrectiveAction>('/incident-corrective-actions/' + id).pipe(
			map((res: IncidentCorrectiveAction) => {
				IncidentCorrectiveActionStore.setIndividualIncidentCAItem(res);
				// this.incidentCorrectiveActions().subscribe();
				return res;
			})
		);

	}

	getDetailsCA(id) {
		return this._http.get<IncidentCorrectiveAction>('/incident-corrective-actions/' + id).pipe((
			map((res) => {
				IncidentCorrectiveActionStore.setIncidentCA(res);
				// this.getItem(res.id);
				return res;
			})
		))
	}

	saveCorrectiveAction(item, incidentList: boolean = false) {
		return this._http.post('/incident-corrective-actions', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'incident_corrective_action_added');
				this.incidentCorrectiveActions().subscribe();
				return res;
			})
		);
	}
	updateItem(id: number, item: any, incidentList: boolean = false): Observable<any> {
		return this._http.put('/incident-corrective-actions/' + id, item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'incident_corrective_action_updated');
				this.getItem(id).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/incident-corrective-actions/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'incident_corrective_action_deleted');
				// this.getItem(id).subscribe();
				return res;
			})
		);
	}

	generateTemplate() {
		this._http.get('/incident-corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_corrective_action_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		let params = '';
		if (IncidentCorrectiveActionStore.orderBy) params += `?order=${IncidentCorrectiveActionStore.orderBy}`;
		if (IncidentCorrectiveActionStore.orderItem) params += `&order_by=${IncidentCorrectiveActionStore.orderItem}`;
		// if (IncidentCorrectiveActionStore.searchText) params += `&q=${IncidentCorrectiveActionStore.searchText}`;
		if(RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
		  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get('/incident-corrective-actions/export' +params, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_corrective_action') + ".xlsx");
			}
		)
	}

	importData(data){
		const formData = new FormData();
		formData.append('file',data);
		return this._http.post('/incident-corrective-actions/import',data).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success','incident_corrective_action_imported');
			return res;
		  })
		)
	  }

	setDocumentDetails(imageDetails, url) {
		IncidentCorrectiveActionStore.setDocumentDetails(imageDetails, url);
	}

	setSelected(position?: number, process: boolean = false, reload = false) {
		if (process) {
			var items: IncidentCorrectiveAction[] = IncidentCorrectiveActionStore.allItems;
			if (position >= 0) {
				if (items.length > 0) {
					if (position == 0) {
						if (reload)
							this.itemChange.emit(items[0].id);
						IncidentCorrectiveActionStore.setSelected(items[0].id)
					}
					else {
						if (items.length >= 1) {
							if (reload)
								this.itemChange.emit(items[position - 1].id);
							IncidentCorrectiveActionStore.setSelected(items[position - 1].id);
						}
					}
				}
			}
			else {
				if (items.length > 0) {
					if (reload)
						this.itemChange.emit(items[0].id);
					IncidentCorrectiveActionStore.setSelected(items[0].id);
				}
			}
		}
		else {
			if (position) {
				if (reload)
					this.itemChange.emit(position);
				IncidentCorrectiveActionStore.setSelected(position)
			}
			else {
				if (reload)
					this.itemChange.emit(IncidentCorrectiveActionStore.initialItemId);
				IncidentCorrectiveActionStore.setSelected(IncidentCorrectiveActionStore.initialItemId);
			}
		}
	}

	unsetSelectedItemDetails() {
		IncidentCorrectiveActionStore.unsetSelectedItemDetails();
	}


	sortIncidentCorrectiveActionList(type: string, text: string) {
		if (!IncidentCorrectiveActionStore.orderBy) {
			IncidentCorrectiveActionStore.orderBy = 'asc';
			IncidentCorrectiveActionStore.orderItem = type;
		}
		else {
			if (IncidentCorrectiveActionStore.orderItem == type) {
				if (IncidentCorrectiveActionStore.orderBy == 'asc') IncidentCorrectiveActionStore.orderBy = 'desc';
				else IncidentCorrectiveActionStore.orderBy = 'asc'
			}
			else {
				IncidentCorrectiveActionStore.orderBy = 'asc';
				IncidentCorrectiveActionStore.orderItem = type;
			}
		}
	}



	setImageDetails(imageDetails, url, type) {
		IncidentCorrectiveActionStore.setDocumentImageDetails(imageDetails, url, type);
	}

	getDocuments() {
		return IncidentCorrectiveActionStore.getDocumentDetails;
	}

	updateCorrectiveActionStatus(id, updateData): Observable<any> {
		return this._http.post('/incident-corrective-actions/' + id + '/updates', updateData).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_updated');
				this.getItems(false, '', true).subscribe(res => {
					this.getItem(id).subscribe();
					// this._utilityService.detectChanges(this._cdr)
				})


				return res;
			})
		);
	}

	closeCorrectiveActions(id): Observable<any> {
		return this._http.put('/incident-corrective-actions/' + id + '/close', id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_closed');

				this.getItem(id).subscribe();

				return res;
			})
		);
		// }
	}

	getUpdateData(id: number): Observable<HistoryData> {
		let params = '';
		params = (params == '') ? params + `?page=${IncidentCorrectiveActionStore.historyCurrentPage}` : params + `&page=${IncidentCorrectiveActionStore.historyCurrentPage}`;
		params = params + '&order_by=created_at&order=desc&limit=5';
		return this._http.get<HistoryData>('/incident-corrective-actions/' + id + '/updates' + (params ? params : '')).pipe(
			map((res: HistoryData) => {
				IncidentCorrectiveActionStore.setTreatmentUpdateData(res);
				// RisksStore.updateRisk(res)
				return res;
			})
		);
	}

	getThumbnailPreview(type, token, h?: number, w?: number) {

		switch (type) {
			case 'incident-correctiveaction': return environment.apiBasePath + '/incident-management/files/incident-corrective-action-update-document/thumbnail?token=' + token;
				break;
				case 'corrective-action-details': return environment.apiBasePath + '/incident-management/files/incident-corrective-action-document/thumbnail?token=' + token;
				break;
					
		}
	}

	getFilePreview(type, id, file_id?, doc_id?) {
		var previewURL = "";
		switch (type) {
			case 'incident_corrective_action': previewURL = environment.apiBasePath + '/incident-corrective-actions/' + `${id}` + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
			break;
			case 'corrective-action-details': previewURL = environment.apiBasePath + '/incident-corrective-actions/'+ `${id}` +'/files/' + `${file_id}` + '/preview'
			break;
			

		}
		if (previewURL) {
			try {
				return this._http.get(previewURL, { responseType: 'blob' as 'json' });
			}
			catch (e) {
			}
		}
	}

	downloadFile(type, id, file_id?, file_name?, individual_file_id?, fileDetails?) {
		var downloadURL = "";
		switch (type) {
			case 'incident_corrective_action': downloadURL = environment.apiBasePath + '/incident-corrective-actions/' + `${id}` + '/updates/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
				break;
				case 'corrective-action-details': downloadURL = environment.apiBasePath + '/incident-corrective-actions/' + `${id}` + '/files/' + `${file_id}` + '/download';
				break;
		}

		if (downloadURL) {

			if (file_name && fileDetails)
				this.downloadFileByURL(downloadURL, type, fileDetails);
			else
				this.downloadFileByURL(downloadURL, type, file_name);
		}
	}

	downloadFileByURL(fileSrc, type, fileDetails?) {
		var responseType = 'blob';
		var fileDetailsObject = {
			fileExtension: '',
			fileName: '',
			fileSize: '',
			downloadProgress: '',
			message: '',
			position: null
		};

		if (fileDetails && (typeof fileDetails !== 'string')) {
			fileDetailsObject.fileExtension = fileDetails.ext;
			fileDetailsObject.fileName = fileDetails.title;
			fileDetailsObject.fileSize = fileDetails.size;
			fileDetailsObject.downloadProgress = '0%';
			fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
		}
		else {
			fileDetailsObject.fileExtension = 'zip';
			fileDetailsObject.fileName = fileDetails + '.zip';
			fileDetailsObject.fileSize = null;
			fileDetailsObject.downloadProgress = '0%';
			fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
		}
		DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
		this.download(fileSrc, responseType).subscribe((event: HttpEvent<any>) => {
			let downloadEvent: any = event;
			switch (downloadEvent.type) {
				case HttpEventType.DownloadProgress:
					let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
					DownloadProgressStore.setDownloadProgress(downloadProgress, fileDetailsObject.position);
					break;
				case HttpEventType.Response:
					this._utilityService.downloadFile(downloadEvent.body, fileDetails?.title ? fileDetails.title : 'allfiles.zip');
					//setTimeout(() => {
					//DownloadProgressStore.setDownloadProgress(100);
					DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
					DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
				// }, 10000);
				//break;
			}
		}, (error => {
			DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
			//DownloadProgressStore.clearDownloadFileDetails();
			//DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
		}))
	}

	download(fileSrc, type, fileDetails?) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});
		const options = {
			headers: headers,
			reportProgress: true,
			observe: true
		};
		const req = new HttpRequest('GET', fileSrc, options, { responseType: 'blob' });
		return this._http.request(req).pipe(
			map((res: any) => {
				return res;
			}),
		);
	}
}
