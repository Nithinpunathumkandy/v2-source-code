import { HttpClient,HttpEvent,HttpEventType,HttpHeaders,HttpRequest,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditCheckListPaginationResponse, MsauditCheckLists, MsauditCheckListsDetails, MsDocumentDetails,MsDocumentsVersions, MsDocumentsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-check-list/ms-audit-check-list';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditCheckListStore } from 'src/app/stores/ms-audit-management/ms-audit-check-list/ms-audit-check-list.store';
import { MsAuditDocumetsVersionStore } from 'src/app/stores/ms-audit-management/ms-audit-documets-version/ms-audit-version-documents.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
	providedIn: 'root'
})
export class MsAuditCheckListService {
	RightSidebarLayoutStore=RightSidebarLayoutStore
	constructor(private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

	getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditCheckListPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditCheckListStore.currentPage}`;
			if (MsAuditCheckListStore.orderBy) params += `&order_by=${MsAuditCheckListStore.orderItem}&order=${MsAuditCheckListStore.orderBy}`;
		}
		if (additionalParams) params += additionalParams;
		if (MsAuditCheckListStore.searchText) params += '&q='+ MsAuditCheckListStore.searchText;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_checklist' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		return this._http.get<MsAuditCheckListPaginationResponse>('/ms-audit-management/checklists' + (params ? params : '')).pipe(
			map((res: MsAuditCheckListPaginationResponse) => {
				MsAuditCheckListStore.setMsAuditCheckLists(res);
				return res;
			})
		);
	}


	getAll(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditCheckListPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditCheckListStore.currentPage}`;
			if (MsAuditCheckListStore.orderBy) params += `&order_by=${MsAuditCheckListStore.orderItem}&order=${MsAuditCheckListStore.orderBy}`;
		}
		if (MsAuditCheckListStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditCheckListStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditCheckListPaginationResponse>('/checklists' + (params ? params : '')).pipe(
			map((res: MsAuditCheckListPaginationResponse) => {
				MsAuditCheckListStore.setMsAuditCheckLists(res);
				return res;
			})
		);
	}



	getIndividualCheckList(id){
		MsAuditCheckListStore.unsetMsAuditCheckListDetails();
		return this._http.get<MsauditCheckListsDetails>('/ms-audit-management/checklists/' + id ).pipe(
			map((res: MsauditCheckListsDetails) => {
				MsAuditCheckListStore.setMsAuditCheckListDetails(res)
				return res;
			})
		);
	}

	getMsDocumentVersionItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsDocumentsPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditDocumetsVersionStore.currentPage}`;
			if (MsAuditDocumetsVersionStore.orderBy) params += `&order_by=${MsAuditDocumetsVersionStore.orderItem}&order=${MsAuditDocumetsVersionStore.orderBy}`;
		}
		if (MsAuditDocumetsVersionStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditDocumetsVersionStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'is_published=true';
		return this._http.get<MsDocumentsPaginationResponse>('/documents' + (params ? params : '')).pipe(
			map((res: MsDocumentsPaginationResponse) => {
				if(res.data)
				{
					MsAuditDocumetsVersionStore.setMsAuditDocumentVersionLists(res);
				}
				else
				{
					MsAuditDocumetsVersionStore.setMsAuditDocumentVersionListsAll(res);

				}
				
				return res;
			})
		);
	}


	getDocumentVersionContents(id: number): Observable<MsDocumentDetails[]> {
		return this._http.get<MsDocumentDetails[]>('/document-versions/' + id + '/contents').pipe(
			map((res: MsDocumentDetails[]) => {
				MsAuditDocumetsVersionStore.setMsDocumentVersionContents(res)
				return res;
			})
		);
	}


	saveCheckList(item) {
		return this._http.post('/ms-audit-management/checklists', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_add');
				return res;
			})
		);
	}
	updateCheckList(item,id) {
		return this._http.put('/ms-audit-management/checklists/'+id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_update');
				return res;
			})
		);
	}

	getThumbnailPreview(type,token,h?:number,w?:number){
		// +(h && w)?'&h='+h+'&w='+w:''
		switch(type){
		  case 'check-list': return environment.apiBasePath+ '/ms-audit-management/files/checklist-document/thumbnail?token='+token;
			break;
		  case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
			break;
	
		}
	  }

	  downloadFile(frequencyId,type,file_id?, doc_id?, file_name?, fileDetails?) {
		var downloadURL = "";
	   switch(type){
		 case 'check-list' : downloadURL = environment.apiBasePath+'/ms-audit-management/checklists/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
		   break;		   
		  // /api/v1/strategy-reviews/$strategyReviewFrequencyTargetId/files/$fileId/download
		
	   }
	   if(downloadURL){
		this.downloadFileByURL(downloadURL,type,fileDetails);
	  }
	}

	getCheckListPreview(file_id,id){
    
		let previewURL= environment.apiBasePath+'/ms-audit-management/checklists/'+`${id}`+'/files/'+`${file_id.id}`+'/preview'
	
		if(previewURL){
		  try{
			return this._http.get(previewURL, { responseType: 'blob' as 'json' });
		  }
		  catch(e){
			console.log(e);
		  }
		}
	  }

	  deleteChecklist(id) {
		return this._http.delete('/ms-audit-management/checklists/' + id).pipe(
		  map((res: any) => {
			this._utilityService.showSuccessMessage('Success!', 'ms_audit_check_list_delete');
			return res;
		  })
		);
	  }

	  generateTemplate() {
		this._http.get('/ms-audit-management/checklists/template', { responseType: 'blob' as 'json' }).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_checklist_template') + ".xlsx");
		  }
		)
	  }
	
	  exportToExcel(params: string = '') {
		if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_checklist' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		this._http.get('/ms-audit-management/checklists/export' + (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_checklists') + ".xlsx");
		  }
		)
	  }

	  downloadFileByURL(fileSrc,type,fileDetails?){
		var responseType = 'blob';
		var fileDetailsObject = {
		  fileExtension: '',
		  fileName: '',
		  fileSize: '',
		  downloadProgress : '',
		  message:'',
		  position: null
		};
		if(fileDetails){
		  fileDetailsObject.fileExtension = fileDetails.ext;
		  fileDetailsObject.fileName = fileDetails.title;
		  fileDetailsObject.fileSize = fileDetails.size;
		  fileDetailsObject.downloadProgress = '0%';
		  fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
		}
		else{
		  fileDetailsObject.fileExtension = 'zip';
		  fileDetailsObject.fileName = 'allfiles.zip';
		  fileDetailsObject.fileSize = null;
		  fileDetailsObject.downloadProgress = '0%';
		  fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
		}
		DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
		this.download(fileSrc,responseType).subscribe((event: HttpEvent<any>) => {
		  let downloadEvent: any = event;
		  switch (downloadEvent.type) {
			case HttpEventType.DownloadProgress:
			  let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
			  DownloadProgressStore.setDownloadProgress(downloadProgress,fileDetailsObject.position);
			  break;
			case HttpEventType.Response:
			  this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : 'allfiles.zip');
			  //setTimeout(() => {
				//DownloadProgressStore.setDownloadProgress(100);
				DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
				DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
			  // }, 10000);
			  //break;
		  }
		},(error=>{
		  DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
		  //DownloadProgressStore.clearDownloadFileDetails();
		  //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
		}))
	  }
	
	  download(fileSrc,type,fileDetails?){
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
		  map((res:any)=>{
			return res;
		  }),
		);
	  }

}
