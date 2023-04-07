import { Injectable } from '@angular/core';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AssetRegister, AssetRegisterPaginationResponse, IndividualAsset } from 'src/app/core/models/asset-management/asset-register/asset-register';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';
import { param } from 'jquery';

@Injectable({
	providedIn: 'root'
})
export class AssetRegisterService {

	constructor(

		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

	getItems(getAll: boolean = false, additionalParams?: string): Observable<AssetRegisterPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AssetRegisterStore.currentPage}`;
			if (AssetRegisterStore.orderBy) params += `&order=${AssetRegisterStore.orderBy}`;
			if (AssetRegisterStore.orderItem) params += `&order_by=${AssetRegisterStore.orderItem}`;
			if (AssetRegisterStore.searchText) params += `&q=${AssetRegisterStore.searchText}`;
			// if(additionalParams)params = params+additionalParams;
			if (additionalParams) params += additionalParams;
		}
		// if(params)params = params+'&asset_rating=true';
		// else{
		// 	params = '?asset_rating=true';
		// }
		if(RightSidebarLayoutStore.filterPageTag == 'asset_register' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<AssetRegisterPaginationResponse>('/assets' + (params ? params : '')).pipe(
			map((res: AssetRegisterPaginationResponse) => {
				AssetRegisterStore.setAssetRegister(res);
				return res;
			})
		);

	}

	getItem(id: number): Observable<IndividualAsset> {
		return this._http.get<IndividualAsset>('/assets/' + id).pipe(
			map((res: IndividualAsset) => {
				AssetRegisterStore.setIndividualAssetDetails(res);
				return res;
			})
		);
	}

	showSubmitMsg() {
		let params = '';
		if(AssetRegisterStore.editFlag && AssetRegisterStore.assetId) {
			params = `asset_updated`;
		}
		else {
			params = `aseet_saved`;
		}
		return this._utilityService.showSuccessMessage('success', params);
	}

	updateItem(asset_id: number, asset, tab?: any): Observable<any> {
		return this._http.put('/assets/' + asset_id, asset).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'asset_profile_updated');
				this.getItems().subscribe();
				this.getItem(asset_id).subscribe();
				return res;
			})
		);
	}

	saveItem(asset): Observable<any> {
		return this._http.post('/assets', asset).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'asset_profile_saved');
				this.getItems().subscribe();
				this.getItem(res['id']).subscribe();
				this.saveAssetId(res['id']);
				return res;
			})
		);
	}

	saveDepreciations(asset_id,asset): Observable<any> {
		let params = '';
		return this._http.put('/assets/'+asset_id +'/depreciations', asset).pipe(
			map(res => {
				if(AssetRegisterStore.editFlag && AssetRegisterStore.assetId) {
					params = `aseet_depreciation_updated`;
				}
				else {
					params = `aseet_depreciation_saved`;
				}
				this._utilityService.showSuccessMessage('success', params);
				this.getItems().subscribe();
				this.getItem(asset_id).subscribe();
				return res;
			})
		);
	}
	
	saveSpecifications(asset_id,asset): Observable<any> {
		let params = '';
		return this._http.put('/assets/'+asset_id +'/specifications', asset).pipe(
			map(res => {
				if((AssetRegisterStore.editFlag || AssetRegisterStore.editspecificationFlag) && AssetRegisterStore.assetId) {
					params = `asset_specification_updated`;
				}
				else {
					params = `asset_specification_saved`;
				}
				this._utilityService.showSuccessMessage('success', params);
				this.getItems().subscribe();
				this.getItem(asset_id).subscribe();
				return res;
			})
		);
	}

	saveDocuments(asset_id,asset): Observable<any> {
		let params = '';
		return this._http.put('/assets/'+asset_id +'/documents', asset).pipe(
			map(res => {
				if(AssetRegisterStore.editFlag && AssetRegisterStore.assetId) {
					params = `asset_documents_updated`;
				}
				else {
					params = `asset_documents_saved`;
				}
				if(AssetRegisterStore.docDetails.length > 0) {
					this._utilityService.showSuccessMessage('success', params);
				}
				this.getItems().subscribe();
				this.getItem(asset_id).subscribe();
				return res;
			})
		);
	}

	deleteAsset(id: number): Observable<any> {
		return this._http.delete(`/assets/${id}`).pipe(map(res => {
			this._utilityService.showSuccessMessage('success', 'deleted_asset');
			this.getItems().subscribe();
			return res;
		}))
	}

	saveAssetId(id: number) {
		AssetRegisterStore.setAssetId(id);
	}


	generateTemplate() {
		this._http.get('/assets/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('assets_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		let params=''
		if (AssetRegisterStore.orderBy) params += `?order=${AssetRegisterStore.orderBy}`;
		if (AssetRegisterStore.orderItem) params += `&order_by=${AssetRegisterStore.orderItem}`;
		if(RightSidebarLayoutStore.filterPageTag == 'asset_register' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		
		this._http.get('/assets/export'+ params, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('assets') + ".xlsx");
			}
		)
	}

	sortAssetList(type, callList: boolean = true) {
		if (!AssetRegisterStore.orderBy) {
			AssetRegisterStore.orderBy = 'asc';
			AssetRegisterStore.orderItem = type;
		}
		else {
			if (AssetRegisterStore.orderItem == type) {
				if (AssetRegisterStore.orderBy == 'asc') AssetRegisterStore.orderBy = 'desc';
				else AssetRegisterStore.orderBy = 'asc'
			}
			else {
				AssetRegisterStore.orderBy = 'asc';
				AssetRegisterStore.orderItem = type;
			}
		}
	}

	setDocumentDetails(imageDetails, url) {
		AssetRegisterStore.setDocumentDetails(imageDetails, url);
	}

	getThumbnailPreview(type, token) {
		return environment.apiBasePath + '/asset-management/files/asset-document/thumbnail?token=' + token;
	}

	getFilePreview(type, id, file_id, finding_id?, doc_id?) {
		var previewURL = "";
		switch (type) {

			case 'asset-item': previewURL = environment.apiBasePath + `/assets/${id}/files/${file_id}/preview`
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

	downloadFile(type, assetItemId, file_id?, doc_id?, file_name?, fileDetails?) {
		var downloadURL = "";
		switch (type) {
			case 'asset-item': downloadURL = environment.apiBasePath + `/assets/${assetItemId}/files/${file_id}/download`;
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

	selectRequiredAssests(issues){
   
		AssetRegisterStore.addSelectedAssests(issues);
	  }

	  importData(data){
		const formData = new FormData();
		formData.append('file',data);
		return this._http.post('/assets/import',data).pipe(
		  map((res:any )=> {
			this._utilityService.showSuccessMessage('success','asset_imported');
			this.getItems(false,null).subscribe();
			return res;
		  })
		)
	  }

}

