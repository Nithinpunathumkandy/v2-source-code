import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditCheckListResponse } from 'src/app/core/models/ms-audit-management/audit-check-list/audit-check-list';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuditCheckListService {
	MsAuditSchedulesStore=MsAuditSchedulesStore
  constructor(    private _http: HttpClient,
    private _utilityService: UtilityService,) { }

  getItems(getAll: boolean = false,additionalParams?: string, status: boolean = false): Observable<AuditCheckListResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditCheckListStore.currentPage}`;
			if (AuditCheckListStore.orderBy) params += `&order_by=${AuditCheckListStore.orderItem}&order=${AuditCheckListStore.orderBy}`;
		}
		if (AuditCheckListStore.searchText) params += (params ? '&q=' : '?q=') + AuditCheckListStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AuditCheckListResponse>('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists' + (params ? params : '')).pipe(
			map((res: AuditCheckListResponse) => {
				AuditCheckListStore.setMsAuditCheckLists(res);
				return res;
			})
		);
	}

  saveCheckList(item) {
		return this._http.post('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_add');
				return res;
			})
		);
	}

  updateCheckList(item,id) {
		return this._http.post('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_update');
				return res;
			})
		);
	}

	deleteCheckList(id) {
		return this._http.delete('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_delete');
				return res;
			})
		);
	}

  addAnswer(item,id,type) {
		return this._http.put('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+id, item).pipe(
			map(res => {
				if(type==1)
				{
					this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_answer_updated');
				}
				else
				{
					this._utilityService.showSuccessMessage('success', 'ms_audit_check_list_answer_add');
				}
				
        // AuditCheckListStore.setMsAuditCheckLists(res);
				return res;
			})
		);
	}

  getCheckListDetails(id) {
		return this._http.get('/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+id).pipe(
			map(res => {
        // AuditCheckListStore.setMsAuditCheckLists(res);
				return res;
			})
		);
	}
  getThumbnailPreview(type,token,h?:number,w?:number){
		// +(h && w)?'&h='+h+'&w='+w:''
		switch(type){
		  case 'audit-check-list': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-schedule-checklist-document/thumbnail?token='+token;
			break;
		  case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
			break;
	
		}
	  }

	  downloadFile(frequencyId,type,file_id?, doc_id?, file_name?, fileDetails?) {
		var downloadURL = "";
	   switch(type){
		 case 'audit-check-list' : downloadURL = environment.apiBasePath+'/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
		   break;

		  // /api/v1/strategy-reviews/$strategyReviewFrequencyTargetId/files/$fileId/download
		
	   }
	   if(downloadURL){
		this.downloadFileByURL(downloadURL,type,fileDetails);
	  }
	}

	getCheckListPreview(file_id,id){
    
		let previewURL= environment.apiBasePath+'/ms-audit-schedules/'+MsAuditSchedulesStore.msAuditSchedulesId+'/checklists/'+`${id}`+'/files/'+`${file_id.id}`+'/preview'
	
		if(previewURL){
		  try{
			return this._http.get(previewURL, { responseType: 'blob' as 'json' });
		  }
		  catch(e){
			console.log(e);
		  }
		}
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

	  sortProjects(type:string, text:string) {
		if (!AuditCheckListStore.orderBy) {
		  AuditCheckListStore.orderBy = 'asc';
		  AuditCheckListStore.orderItem = type;
		}
		else{
		  if (AuditCheckListStore.orderItem == type) {
			if(AuditCheckListStore.orderBy == 'asc') AuditCheckListStore.orderBy = 'desc';
			else AuditCheckListStore.orderBy = 'asc'
		  }
		  else{
			AuditCheckListStore.orderBy = 'asc';
			AuditCheckListStore.orderItem = type;
		  }
		}
	  //   if(!text)
	  //   this.getItems().subscribe();
	  // else
	  // this.getItems(false,`&q=${text}`).subscribe();
	  }

	  getCheckListList(params): Observable<AuditCheckListResponse>{

		return this._http.get<AuditCheckListResponse>('/ms-audits/'+MsAuditStore.selectedMsAuditId+'/checklists'+params).pipe(
			map((res : AuditCheckListResponse) => {
             AuditCheckListStore.setAuditCheckList(res);
				return res;
			})
		);
	  }

}
