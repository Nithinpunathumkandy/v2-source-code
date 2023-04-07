import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { caHistoryPaginationData, FindingsCorrectiveActionPaginationResponse, IndividualCorrectiveAction } from 'src/app/core/models/non-conformity/finding-corrective-action';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { CorrectiveActionsResolveStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
	providedIn: 'root'
})
export class FindingCorrectiveActionService {

	constructor(private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }


	getItems(getAll: boolean = false, additionalParams?: string): Observable<FindingsCorrectiveActionPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${FindingCorrectiveActionStore.currentPage}`;
			if (FindingCorrectiveActionStore.orderBy) params += `&order=${FindingCorrectiveActionStore.orderBy}`;
			if (FindingCorrectiveActionStore.orderItem) params += `&order_by=${FindingCorrectiveActionStore.orderItem}`;
		}
		if (FindingCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + FindingCorrectiveActionStore.searchText;
		if (additionalParams) params += additionalParams;
		// if (status) params += (params ? '&' : '?') + 'status=all';
		if (RightSidebarLayoutStore.filterPageTag == 'noc_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
			params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<FindingsCorrectiveActionPaginationResponse>('/noc-finding-corrective-actions' + (params ? params : '')).pipe(
			map((res: FindingsCorrectiveActionPaginationResponse) => {
				FindingCorrectiveActionStore.setFindingCorrectiveAction(res);
				return res;
			})
		);
	}

	getItem(id: number): Observable<IndividualCorrectiveAction> {
		return this._http.get<IndividualCorrectiveAction>('/noc-finding-corrective-actions/' + id).pipe(
			map((res: IndividualCorrectiveAction) => {
				FindingCorrectiveActionStore.setIndividualCADetails(res);
				return res;
			})
		);
	}

	getAllItem() {
		return this._http.get('/noc-finding-corrective-actions').pipe(
			map((res) => {
				return res;
			})
		);
	}

	//Get File Preview 
	getFilePreview(type, ca_id?, file_id?, doc_id?) {
		var previewURL = "";
		switch (type) {
			case 'corrective-action': previewURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + `${ca_id}` + '/files/' + `${file_id}` + '/preview'
				break;
			case 'corrective-action-history': previewURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + ca_id + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
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

	//Get Thumbnail Preview according to type and token
	getThumbnailPreview(type, token, h?: number, w?: number) {
		// +(h && w)?'&h='+h+'&w='+w:''
		switch (type) {
			case 'corrective-action': return environment.apiBasePath + '/non-conformity/files/finding-corrective-action-document/thumbnail?token=' + token;
				break;
			case 'corrective-action-update': return environment.apiBasePath + '/non-conformity/files/finding-corrective-action-update-document/thumbnail?token=' + token;
				break;
			case 'corrective-action-history': return environment.apiBasePath + '/non-conformity/files/finding-corrective-action-update-document/thumbnail?token=' + token;
				break;
		}
	}

	downloadFile(type, ca_id, file_id?, file_name?, fileDetails?) {
		var downloadURL = "";
		switch (type) {
			case 'corrective-action': downloadURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + `${ca_id}` + '/files/' + `${file_id}` + '/download';
				break;
				case 'corrective-action-history': downloadURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + ca_id + '/updates/' + `${file_id}` + '/files/' + `${file_name}` + '/download';
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
					DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
					DownloadProgressStore.setDownloadMessage('download_succesful', fileDetailsObject.position);

			}
		}, (error => {
			DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
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

	setResolveDocumentDetails(imageDetails, url) {
		CorrectiveActionsResolveStore.setDocumentDetails(imageDetails, url);
	}


	setImageDetails(imageDetails, url, type) {
		FindingCorrectiveActionStore.setDocumentImageDetails(imageDetails, url, type);
	}

	setSelectedImageDetails(imageDetails, type) {
		FindingCorrectiveActionStore.setSelectedImageDetails(imageDetails);
	}

	getDocuments() {
		return FindingCorrectiveActionStore.getDocumentDetails;
	}

	markAsResolved(ca_id: number, item: any) {

		return this._http.post('/noc-finding-corrective-actions/' + ca_id + '/updates', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'corrective_action_updated_successfully');
				return res;
			})
		);
	}

	getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
		return this._http.get<caHistoryPaginationData>('/noc-finding-corrective-actions/' + ca_id + '/updates').pipe(
			map((res: caHistoryPaginationData) => {
				FindingCorrectiveActionStore.setCorrectiveActionHistory(res);
				return res;
			})
		);
	}


	closeCorrectiveAction(ca_id: number) {
		let item = null;
		return this._http.put('/noc-finding-corrective-actions/' + ca_id + '/close', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_closed');
				return res;
			})
		);
	}
	rejectCorrectiveAction(ca_id: number) {
		let item = null;
		return this._http.put('/noc-finding-corrective-actions/' + ca_id + '/reject', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_rejected');
				return res;
			})
		);
	}

	generateTemplate(findng_id: number) {
		this._http.get('/noc-findings/' + findng_id + '/corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('corrective_action_template') + ".xlsx");
			}
		)
	}

	exportToExcel(findng_id: number) {
		this._http.get('/noc-findings/' + findng_id + '/corrective-actions/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('corrective_action') + ".xlsx");
			}
		)
	}

	setDocumentDetails(imageDetails, url) {
		FindingCorrectiveActionStore.setDocumentDetails(imageDetails, url);
	}

	deleteItem(id: number) {
		return this._http.delete('/noc-finding-corrective-actions/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_deleted_successfully');
				return res;
			})
		);
	}

	saveItem(item) {
		return this._http.post('/noc-finding-corrective-actions', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_created_successfully');
				return res;
			})
		);
	}

	updateItem(id: number, item) {
		return this._http.put('/noc-finding-corrective-actions/' + id, item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_updated_successfully');
				return res;
			})
		);
	}

	sortCorrectiveActionList(type, callList: boolean = true) {
		if (!FindingCorrectiveActionStore.orderBy) {
			FindingCorrectiveActionStore.orderBy = 'asc';
			FindingCorrectiveActionStore.orderItem = type;
		}
		else {
			if (FindingCorrectiveActionStore.orderItem == type) {
				if (FindingCorrectiveActionStore.orderBy == 'asc') FindingCorrectiveActionStore.orderBy = 'desc';
				else FindingCorrectiveActionStore.orderBy = 'asc'
			}
			else {
				FindingCorrectiveActionStore.orderBy = 'asc';
				FindingCorrectiveActionStore.orderItem = type;
			}
		}
	}
}
