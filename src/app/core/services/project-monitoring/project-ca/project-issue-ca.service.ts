import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { caHistoryPaginationData, CaPaginationResponse, IndividualCorrectiveAction} from 'src/app/core/models/project-monitoring/project-issue-ca';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectIssueCaService {

  constructor(
    private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }
  
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CaPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${CaStore.currentPage}`;
			if (CaStore.orderBy) params += `&order_by=project_monitor_ca.id&order=${CaStore.orderBy}`;
		}
		if (CaStore.searchText) params += (params ? '&q=' : '?q=') + CaStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		if (RightSidebarLayoutStore.filterPageTag == 'project_issue_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
			params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CaPaginationResponse>('/project-monitor/projects-issue-corrective-actions' + (params ? params : '')).pipe(
			map((res: CaPaginationResponse) => {
				CaStore.setCa(res);
				return res;
			})
		);
	}

  getCa(id): Observable<IndividualCorrectiveAction>{
    return this._http.get<IndividualCorrectiveAction>('/project-monitor/projects-issue-corrective-actions/'+ id).pipe(
      map((res:IndividualCorrectiveAction) => {
        CaStore.setIndividualCADetails(res);
        return res;
      })
    );
  }

  getCaStatus(data?){
   let params = ''
   if(data)params = data
    return this._http.get('/project-issue-corrective-action-statuses'+params).pipe(
      map((res) => {
        CaStore.setCaStatus(res['data']);
        return res;
      })
    );
  }

  
  saveCa(item){
    return this._http.post('/project-monitor/projects-issue-corrective-actions', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'ca_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateCa(item,id){
    return this._http.put('/project-monitor/projects-issue-corrective-actions/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'ca_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteCa(id){
    return this._http.delete('/project-monitor/projects-issue-corrective-actions/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'ca_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/project-monitor/projects-issue-corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_issue_ca_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-monitor/projects-issue-corrective-actions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_issue_ca')+".xlsx");
      }
    )
  }

  getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
    let params = '';
		params = (params == '') ? params + `?page=${CaStore.historyCurrentPage}` : params + `&page=${CaStore.historyCurrentPage}`;
		params = params + '&order_by=created_at&order=desc&limit=5';
    return this._http.get<caHistoryPaginationData>('/project-monitor/projects-issue-corrective-actions/' + ca_id + '/updates' + (params ? params : '')).pipe(
			map((res: caHistoryPaginationData) => {
				CaStore.setCorrectiveActionHistory(res);
				return res;
			})
		);
	}


	closeCa(ca_id: number) {
		let item = null;
		return this._http.put('/project-monitor/projects-issue-corrective-actions/' + ca_id + '/close', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_closed');
				return res;
			})
		);
	}
	rejectCa(ca_id: number) {
		let item = null;
		return this._http.put('/project-monitor/projects-issue-corrective-actions/' + ca_id + '/reject', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('Success!', 'corrective_action_rejected');
				return res;
			})
		);
	}

  getFilePreview(type, ca_id?, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'project-issue-corrective-action-document': previewURL = environment.apiBasePath + '/project-monitor/projects-issue-corrective-actions/' + `${ca_id}` + '/files/' + `${file_id}` + '/preview'
        break;
        case 'corrective-action-history': previewURL = environment.apiBasePath + '/project-monitor/projects-issue-corrective-actions/' + `${ca_id}` + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
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

  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch(type){
      case 'project-issue-corrective-action-document': return environment.apiBasePath+ '/project-monitoring/files/project-issue-corrective-action-document/thumbnail?token='+token;
      break;
      case 'corrective-action-history': return environment.apiBasePath+ '/project-monitoring/files/project-issue-corrective-action-update-document/thumbnail?token='+token;
      break;
    }
  }

  downloadFile(type, id, file_id?, doc_id?, file_name?, individual_file_id?, fileDetails?) {
    var downloadURL = ""; 
    switch (type) {
      // Document File
      case 'project-issue-corrective-action-document' : downloadURL = environment.apiBasePath+'/project-monitor/projects-issue-corrective-actions/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'corrective-action-history': downloadURL = environment.apiBasePath + '/project-monitor/projects-issue-corrective-actions/' + `${id}` + '/updates/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
				break;
      
    }
    if(downloadURL){
      this.downloadFileByURL(downloadURL,type,fileDetails);
    }
  }


  downloadHistoryFile(type, id, file_id?, file_name?, individual_file_id?, fileDetails?) {
		var downloadURL = "";
		switch (type) {
      case 'corrective-action-history': downloadURL = environment.apiBasePath + '/project-monitor/projects-issue-corrective-actions/' + `${id}` + '/updates/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
      break;
		}
		if (downloadURL) {
			if (file_name && fileDetails)
				this.downloadFileByURL(downloadURL, type, fileDetails);
			else
				this.downloadFileByURL(downloadURL, type, file_name);
		}
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

  /**
   * Function to get file download progress
   * Under development
   */
    /**
   * Function to get file download progress
   * Under development
   */
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
            DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
            DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
      }
    },(error=>{
      DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
    }))
  }


  setImageDetails(imageDetails, url, type) {
		CaStore.setDocumentImageDetails(imageDetails, url, type);
	}

	getDocuments() {
		return CaStore.getDocumentDetails;
	}


	updateCorrectiveActionStatus(ca_id: number, item: any) {
		return this._http.post('/project-monitor/projects-issue-corrective-actions/' + ca_id + '/updates', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'ca_marked_resolved');
        // this.getItems(false, '', true).subscribe(res => {
				// 	this.getCa(ca_id).subscribe();
				// })
        return res;
			})
		);
	}


  sortCaList(type: string, text: string) {
		if (!CaStore.orderBy) {
			CaStore.orderBy = 'asc';
			CaStore.orderItem = type;
		}
		else {
			if (CaStore.orderItem == type) {
				if (CaStore.orderBy == 'asc') CaStore.orderBy = 'desc';
				else CaStore.orderBy = 'asc'
			}
			else {
				CaStore.orderBy = 'asc';
				CaStore.orderItem = type;
			}
		}
  }
}
