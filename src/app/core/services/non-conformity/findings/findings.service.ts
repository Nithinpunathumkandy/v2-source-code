
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Findings, FindingsPaginationResponse, QuickCorrection } from 'src/app/core/models/non-conformity/findings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
	providedIn: 'root'
})
export class FindingsService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }
	getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<FindingsPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${FindingsStore.currentPage}`;
			if (FindingsStore.orderBy) params += `&order_by=${FindingsStore.orderItem}&order=${FindingsStore.orderBy}`;
		}
		if (FindingsStore.searchText) params += (params ? '&q=' : '?q=') + FindingsStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if(RightSidebarLayoutStore.filterPageTag == 'noc_findings' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<FindingsPaginationResponse>('/noc-findings' + (params ? params : '')).pipe(
			map((res: FindingsPaginationResponse) => {
				FindingsStore.setFindings(res);
				return res;
			})
		);
	}

	getItem(id: number): Observable<Findings> {
		return this._http.get<Findings>('/noc-findings/' + id).pipe(
			map((res: Findings) => {
				FindingsStore.updateFindings(res)
				return res;
			})
		);
	}

	saveFindingsId(id: number) {
		FindingsStore.setFindingsId(id);
	}

	updateItem(id, item: Findings): Observable<any> {
		return this._http.put('/noc-findings/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'findings_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	saveItem(item: Findings) {
		return this._http.post('/noc-findings', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'findings_added');
				FindingsStore.orderItem='findings.created_at';
				FindingsStore.orderBy='desc';
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}

	generateTemplate() {
		this._http.get('/noc-findings/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('findings_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		let params = '';
		if (FindingsStore.orderBy) params += `?order=${FindingsStore.orderBy}`;
		if (FindingsStore.orderItem) params += `&order_by=${FindingsStore.orderItem}`;
		if(RightSidebarLayoutStore.filterPageTag == 'noc_findings' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get('/noc-findings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('findings') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/noc-findings/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/noc-findings/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'findings_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

	activate(id: number) {
		return this._http.put('/noc-findings/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'findings_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/noc-findings/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'findings_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/noc-findings/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'findings_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						FindingsStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchFindingsList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: FindingsPaginationResponse) => {
				FindingsStore.setFindings(res);
				return res;
			})
		);
	}

	sortFindingsList(type: string, text: string) {
		if (!FindingsStore.orderBy) {
			FindingsStore.orderBy = 'asc';
			FindingsStore.orderItem = type;
		}
		else {
			if (FindingsStore.orderItem == type) {
				if (FindingsStore.orderBy == 'asc') FindingsStore.orderBy = 'desc';
				else FindingsStore.orderBy = 'asc'
			}
			else {
				FindingsStore.orderBy = 'asc';
				FindingsStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}

	// //Get Thumbnail Preview according to type and token
	// getThumbnailPreview(type, token, h?: number, w?: number) {
	// 	switch(type){
	// 	  case 'customer-complaint-document': return environment.apiBasePath+ '/customer-engagement/files/customer-complaint-document/thumbnail?token='+token;
	// 	  break;
	// 	}
	//   }


	//Download File
	downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {

		// document-version  - Main File
		// document - file  - Support File

		var downloadURL = "";
		switch (type) {
			// Document File
			case 'findings-document': downloadURL = environment.apiBasePath + '/noc-findings/' + `${id}` + '/download';
				break;
			case 'document-version': downloadURL = environment.apiBasePath + '/documents/' + `${id}` + '/files/' + `${file_id}` + '/download';
				break;


		}
		if (downloadURL) {
			this.downloadFileByURL(downloadURL, type, fileDetails);
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
		if (fileDetails) {
			fileDetailsObject.fileExtension = fileDetails.ext;
			fileDetailsObject.fileName = fileDetails.title;
			fileDetailsObject.fileSize = fileDetails.size;
			fileDetailsObject.downloadProgress = '0%';
			fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
		}
		else {
			fileDetailsObject.fileExtension = 'zip';
			fileDetailsObject.fileName = 'allfiles.zip';
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
			// console.log(error);
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

	getThumbnailPreview(type, token, h?: number, w?: number) {
		return environment.apiBasePath + '/non-conformity/files/findings-document/thumbnail?token=' + token;
	}

	//Get File Preview 
	getFilePreview(type, id, file_id?, doc_id?) {
		var previewURL = "";
		switch (type) {

			case 'findings-document': previewURL = environment.apiBasePath + '/noc-findings/' + `${id}` + '/files/' + `${file_id}` + '/preview'
				break;
			case 'document-version': previewURL = environment.apiBasePath + '/documents/' + `${id}` + '/files/' + `${file_id}` + '/preview'
				break;

		}
		if (previewURL) {
			try {
				return this._http.get(previewURL, { responseType: 'blob' as 'json' });
			}
			catch (e) {
				console.log(e);
			}
		}
	}
	getQuickCorrection(id: number): Observable<QuickCorrection> {
		return this._http.get<QuickCorrection>('/noc-findings/' + id + '/quick-actions/').pipe(
			map((res: QuickCorrection) => {
				FindingsStore.updateQuickCorrection(res)
				return res;
			})
		);
	}
	updateCorrection(findind_id: number, id: number, item: QuickCorrection): Observable<any> {
		return this._http.put('/noc-findings/' + findind_id + '/quick-actions/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'quick_correction_updated_successfully');
				return res;
			})
		);
	}
	saveCorrection(findind_id: number, item: Findings) {
		return this._http.post('/noc-findings/' + findind_id + '/quick-actions', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'quick_correction_created_successfully');
				return res;
			})
		);
	}
	deleteCorrection(findind_id: number, id: number) {
		return this._http.delete('/noc-findings/' + findind_id + '/quick-actions/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'quick_correction_deleted_successfully');
				
				return res;
			})
		);
	}

	
    selectRequiredFinding(items){
		FindingsStore.addSelectedFinding(items);
	}
}