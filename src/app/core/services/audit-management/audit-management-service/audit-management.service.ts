import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';

@Injectable({
  providedIn: 'root'
})
export class AuditManagementService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {

    switch (type) {
      case 'information-request': return environment.apiBasePath + '/audit-management/files/am-audit-information-request-document/thumbnail?token=' + token;
        break;
        case 'audit-document': return environment.apiBasePath + '/audit-management/files/am-audit-document/thumbnail?token=' + token;
        break;
        case 'audit-meeting': return environment.apiBasePath + '/audit-management/files/am-audit-meeting-document/thumbnail?token=' + token;
        break;
        case 'test-plan-document': return environment.apiBasePath + '/audit-management/files/am-audit-test-plan/thumbnail?token=' + token;
        break;
        case 'audit-finding-document': return environment.apiBasePath + '/audit-management/files/am-audit-finding-document/thumbnail?token=' + token;
        break;
        case 'corrective-action': return environment.apiBasePath + '/audit-management/files/finding-corrective-action-document/thumbnail?token=' + token;
        break;
        case 'corrective-action-history': return environment.apiBasePath + '/audit-management/files/finding-corrective-action-update-document/thumbnail?token=' + token;
        break;
        case 'csa-answer-document': return environment.apiBasePath + '/audit-management/files/am-audit-control-self-assessments/thumbnail?token=' + token;
        break;
        case 'csa-answer-update-document': return environment.apiBasePath + '/audit-management/files/am-audit-control-self-assessment-updates/thumbnail?token=' + token;
        break;
    }
  }

  //Get File Preview 
  getFilePreview(type, id, doc_id?,update_id?) {
    var previewURL = "";
    switch (type) {
      case 'information-request': previewURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/information-requests/' + `${id}` + '/files/'+`${doc_id}`+'/preview'
        break;
        case 'audit-document': previewURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/documents/' + `${id}`+'/preview'
        break;
        case 'audit-meeting': previewURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/meetings/' + `${id}` + '/files/'+`${doc_id}`+'/preview'
        break;
        case 'test-plan-document': previewURL = environment.apiBasePath + '/am-audit-test-plans/' + `${id}` + '/files/'+`${doc_id}`+'/preview'
        break;
        case 'audit-finding-document': previewURL = environment.apiBasePath + '/am-audit-findings/' + `${id}` + '/files/'+`${doc_id}`+'/preview'
        break;
        case 'corrective-action': previewURL = environment.apiBasePath + '/am-audit-finding-corrective-actions/' + `${id}` + '/files/'+`${doc_id}`+'/preview'
        break;
        case 'corrective-action-history': previewURL = environment.apiBasePath + '/am-audit-finding-corrective-actions/' + `${id}` +'/updates/'+`${update_id}`+'/files/'+`${doc_id}`+'/preview'
        break;
        case 'csa-answer-document': previewURL = environment.apiBasePath + '/am-audit-control-self-assessments/' + `${id}`+'/files/'+`${doc_id}`+'/preview'
        break;
        case 'csa-answer-update-document': previewURL = environment.apiBasePath + '/am-audit-control-self-assessments/' + `${id}` +'/updates/'+`${update_id}`+'/files/'+`${doc_id}`+'/preview'
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

  //Download File
  downloadFile(type, id, file_id?, file_name?, individual_file_id?, fileDetails?) {
    var downloadURL = "";
    switch (type) {
      case 'information-request': downloadURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/information-requests/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'information-request-all-documents': downloadURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/information-requests/' + `${id}` + '/download';
        break;
        case 'audit-document': downloadURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/documents/' + `${id}`+'/download';
        break;
        case 'audit-meeting': downloadURL = environment.apiBasePath + '/am-audits/'+AmAuditsStore.auditId+'/meetings/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'test-plan-document': downloadURL = environment.apiBasePath + '/am-audit-test-plans/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'audit-finding-document': downloadURL = environment.apiBasePath + '/am-audit-findings/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'corrective-action': downloadURL = environment.apiBasePath + '/am-audit-finding-corrective-actions/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'corrective-action-history': downloadURL = environment.apiBasePath + '/am-audit-finding-corrective-actions/' + `${id}` +'/updates/'+`${individual_file_id}`+'/files/'+`${file_id}`+'/download';
        break;
        case 'csa-answer-document': downloadURL = environment.apiBasePath + '/am-audit-control-self-assessments/' + `${id}` +'/files/'+`${file_id}`+'/download';
        break;
        case 'csa-answer-update-document': downloadURL = environment.apiBasePath + '/am-audit-control-self-assessments/' + `${id}` +'/updates/'+`${individual_file_id}`+'/files/'+`${file_id}`+'/download';
        break;

    }
    if (downloadURL) {
    
      if (file_name && fileDetails)
        this.downloadFileByURL(downloadURL, type, fileDetails);
      else
        this.downloadFileByURL(downloadURL, type, file_name);
    }
  }

  /**
  * Function to get file download progress
  * Under development
  */
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
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
       
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
}
