import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';

@Injectable({
  providedIn: 'root'
})
export class ExternalAuditFileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }


  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {


    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'audit-document': return environment.apiBasePath + '/external-audit/files/external-audit-document/thumbnail?token=' + token;
        break;
      case 'findings-document': return environment.apiBasePath + '/external-audit/files/ea-finding-document/thumbnail?token=' + token;
        break;

      case 'findings-ca-document': return environment.apiBasePath + '/external-audit/files/ea-finding-corrective-action-document/thumbnail?token=' + token;
        break;

      case 'corrective-action': return environment.apiBasePath + '/external-audit/files/ea-finding-corrective-action-document/thumbnail?token=' + token;
        break;
      case 'corrective-action-history': return environment.apiBasePath + '/non-conformity/files/finding-corrective-action-update-document/thumbnail?token=' + token;
        break;
    }
  }


  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {

      case 'audit-document': previewURL = environment.apiBasePath + '/external-audits/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;

      case 'findings-document': previewURL = environment.apiBasePath + '/external-audit/findings/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;

      case 'findings-ca-document': previewURL = environment.apiBasePath + '/external-audit/finding-corrective-actions/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;

      //To Check
      case 'corrective-action': previewURL = environment.apiBasePath + '/external-audit/findings/' + id + '/corrective-actions/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
        break;

      case 'corrective-action-history': previewURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + id + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
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


  //Download File
  downloadFile(type, externalAuditId, file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
    switch (type) {
      case 'audit-document': downloadURL = environment.apiBasePath + '/external-audits/' + `${externalAuditId}` + '/files/' + `${file_id}` + '/download';
        break;

      case 'findings-document': downloadURL = environment.apiBasePath + '/external-audit/findings/' + `${externalAuditId}` + '/files/' + `${file_id}` + '/download';
        break;

      case 'findings-ca-document': downloadURL = environment.apiBasePath + '/external-audit/finding-corrective-actions/' + `${externalAuditId}` + '/files/' + `${file_id}` + '/download';
        break;
      //To Check
      case 'corrective-action': downloadURL = environment.apiBasePath + '/external-audit/findings/' + externalAuditId + '/corrective-actions/' + `${file_id}` + '/files/' + `${doc_id}` + '/download';
        break;
      case 'corrective-action-history': downloadURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + externalAuditId + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/download';
        break;
    }
    if (downloadURL) {
      this.downloadFileByURL(downloadURL, type, fileDetails);
    }
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

  /**
   * Function to get file download progress
   * Under development
   */
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
          DownloadProgressStore.setDownloadMessage('ea_file_download_successful', fileDetailsObject.position);
        // }, 10000);
        //break;
      }
    }, (error => {
      // console.log(error);
      DownloadProgressStore.setDownloadMessage('ea_file_download_failed', fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
  }

}
