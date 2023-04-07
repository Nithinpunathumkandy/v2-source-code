import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditCorrectiveActionPaginationResponse, MsauditCorrectiveAction} from 'src/app/core/models/ms-audit-management/corrective-actions/correcctive-actions';
import { AuditCorrectiveActionResponse,AuditCorrectiveActionHistoryResponse } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-follow-up';
import { caHistoryPaginationData } from 'src/app/core/models/non-conformity/finding-corrective-action';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditCorrectiveActionStore } from 'src/app/stores/ms-audit-management/corrective-acction/corrective-action.store';
import { AuditFollowUpStore } from 'src/app/stores/ms-audit-management/follow-up/audit-follow-up.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
RightSidebarLayoutStore=RightSidebarLayoutStore
  constructor(private _http: HttpClient,
	private _helperService: HelperServiceService,
    private _utilityService: UtilityService,) { }

  getItems(getAll: boolean = false,additionalParams?: string, status: boolean = false): Observable<MsAuditCorrectiveActionPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditFollowUpStore.currentPage}`;
			if (AuditFollowUpStore.orderBy) params += `&order_by=${AuditFollowUpStore.orderItem}&order=${AuditFollowUpStore.orderBy}`;
		}
		if (AuditFollowUpStore.searchText) params += (params ? '&q=' : '?q=') + AuditFollowUpStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditCorrectiveActionPaginationResponse>('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions' + (params ? params : '')).pipe(
			map((res: MsAuditCorrectiveActionPaginationResponse) => {
				AuditCorrectiveActionStore.setMsCorrectiveActions(res);
				return res;
			})
      );
}


getCorrectiveActions(getAll: boolean = false,additionalParams?: string, status: boolean = false): Observable<MsAuditCorrectiveActionPaginationResponse> {
	let params = '';
	if (!getAll) {
		params = `?page=${AuditCorrectiveActionStore.currentPage}`;
		if (AuditCorrectiveActionStore.orderBy) params += `&order_by=${AuditCorrectiveActionStore.orderItem}&order=${AuditCorrectiveActionStore.orderBy}`;
	}
	if (AuditCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + AuditCorrectiveActionStore.searchText;
	if (additionalParams) params += additionalParams;
	if (status) params += (params ? '&' : '?') + 'status=all';
	if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_ca' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
	return this._http.get<MsAuditCorrectiveActionPaginationResponse>('/ms-audit/corrective-actions' + (params ? params : '')).pipe(
		map((res: MsAuditCorrectiveActionPaginationResponse) => {
			AuditCorrectiveActionStore.setMsCorrectiveActions(res);
			return res;
		})
  );
}


getCorrectiveActionDetails(id) {
	return this._http.get<MsauditCorrectiveAction>('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id).pipe(
	map(res => {
		AuditCorrectiveActionStore.setIndividualCorrectiveActionDetails(res);
	return res;
	})
  );
}

delete(id,audit?){
	return this._http.delete('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'Corrective Action deleted sucessfully');
			return res;
		})
	);
}

closeCA(id){
	return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id+'/close',null).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'Corrective Action closed sucessfully');
			return res;
		})
	);
}

rejectCA(id,data){
	return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id+'/reject',data).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'Corrective Action Rejected sucessfully');
			return res;
		})
	);
}

closeNonConformity(){
	return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/close',null).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'success_closed_finding');
			return res;
		})
	);
}

caHistory(id){
	//let params = '';
			//params = `?order=desc&order_by=ms_audit_finding_corrective_action_updates.created_at`;
	return this._http.get('/ms-audit/'+'finding-corrective-actions/'+id+'/updates').pipe(
		map((res:caHistoryPaginationData) => {
			AuditCorrectiveActionStore.setCorrectiveActionHistory(res)
				return res;
		})
	);
}

remind(id){
	return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id+'/remainder-email',null).pipe(
		map((res) => {
			this._utilityService.showSuccessMessage('success', 'Reminder added');
		})
	);
}

saveItem(id,item){
	return this._http.post('/ms-audit-findings/'+id+'/corrective-actions', item).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'Corrective Action added');
			return res;
		})
	);
}

UpdateItem(id,item){
	return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+id, item).pipe(
		map(res => {
			this._utilityService.showSuccessMessage('success', 'Corrective Action updated');
			return res;
		})
	);
}

getThumbnailPreview(type,token,h?:number,w?:number){
	// +(h && w)?'&h='+h+'&w='+w:''
	switch(type){
	  case 'audit-follow-up': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-finding-corrective-action/thumbnail?token='+token;
		break;
	  case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
		break;

	}
  }

  downloadFile(Id,frequencyId,type,file_id?, doc_id?, file_name?, fileDetails?) {
	var downloadURL = "";
   switch(type){
	 case 'audit-follow-up' : downloadURL = environment.apiBasePath+'/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+`${Id}`+'/files/'+`${file_id}`+'/download';
	   break;
	case 'corrective-action' : downloadURL = environment.apiBasePath+'/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+`${Id}`+'/files/'+`${file_id}`+'/download';
	break;

	  // /api/v1/strategy-reviews/$strategyReviewFrequencyTargetId/files/$fileId/download
	
   }
   if(downloadURL){
	this.downloadFileByURL(downloadURL,type,fileDetails);
  }
}


getCheckListPreview(Id,file_id,id){
    
	//  environment.apiBasePath+'/ms-audits/'+MsAuditStore.selectedMsAuditId+'/checklists/'+`${id}`+'/files/'+`${file_id.id}`+'/preview'
	 let previewURL= environment.apiBasePath+'/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrective-actions/'+`${Id}`+'/files/'+`${file_id}`+'/preview'
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

  generateTemplate(id?: number) {
    let url = '/ms-audit-findings/corrective-actions/template';
   // if (id) url = '/external-audit/findings/' + id + '/corrective-actions/template'

    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action_template')+".xlsx");
      }
    )
  }

  exportToExcel(id?: number) {
    let params = '';
    if (AuditCorrectiveActionStore.orderBy) params += `?order=${AuditCorrectiveActionStore.orderBy}`;
    if (AuditCorrectiveActionStore.orderItem) params += `&order_by=${AuditCorrectiveActionStore.orderItem}`;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_ca' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    let url = '/ms-audit/corrective-actions/export'+params;
    if (id) {url='/ms-audit-findings/' + id + '/corrective-actions/export'}
    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action')+".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/ms-audit/corrective-actions/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  getDocuments() {
    return AuditCorrectiveActionStore.getDocumentDetails;
  }

  setImageDetails(imageDetails, url, type) {
    AuditCorrectiveActionStore.setDocumentImageDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    AuditCorrectiveActionStore.setSelectedImageDetails(imageDetails);
  }

  updateCorrectiveAction(ca_id: number, item: any) {

    return this._http.post('/ms-audit/finding-corrective-actions/' + ca_id + '/updates', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('success', 'ia_ca_status_update_success_msg');
        return res;
      })
    );
  }

  importData(data, id?: number) {
    let url = '/ms-audit-findings/corrective-actions/import';
    if (id) url = '/ms-audit-findings/'+ id + '/corrective-actions/import'
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post(url, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'corrective_action_imported');
        this.getCorrectiveActions().subscribe();
        return res;
      })
    )
  }

  sortList(type:string, text:string) {
    if (!MsAuditStore.orderBy) {
      MsAuditStore.orderBy = 'desc';
      MsAuditStore.orderItem = type;
    }
    else{
      if (MsAuditStore.orderItem == type) {
        if(MsAuditStore.orderBy == 'desc') MsAuditStore.orderBy = 'asc';
        else MsAuditStore.orderBy = 'desc'
      }
      else{
        MsAuditStore.orderBy = 'desc';
        MsAuditStore.orderItem = type;
      }
    }
  }
}
