import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Injectable({
  providedIn: 'root'
})
export class BusinessAssessmentService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'checklist-document': return environment.apiBasePath + '/business-assessment/files/checklist-document/thumbnail?token=' + token;
        break;
        case 'business-assessment-action-plan': return environment.apiBasePath + '/business-assessment/files/business-assessment-action-plan/thumbnail?token=' + token;
        break;
     
    }
  }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'checklist-document': previewURL = environment.apiBasePath + '/business-assessment-checklists/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;
        case 'business-assessment-action-plan': previewURL = environment.apiBasePath + '/business-assessment-action-plans/' + `${id}` +  '/updates/' +  `${file_id}` + '/files/' +  `${doc_id}` + '/preview'
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
  downloadFile(type, id, file_id?,doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
    switch (type) {
      case 'checklist-document': downloadURL = environment.apiBasePath + '/business-assessment-checklists/' + `${id}` + '/files/' + `${file_id}` + '/download';
        break;
        case 'business-assessment-action-plan': downloadURL = environment.apiBasePath + '/business-assessment-action-plans/' + `${id}` +  '/updates/' +  `${file_id}` + '/files/' +  `${doc_id}`  + '/download';
        break;
        case 'business-assessment-action-plan-all': downloadURL = environment.apiBasePath + '/business-assessment-action-plans/' + `${id}` +  '/updates/' +  `${file_id}` + '/download';
        break;

    }
    if (downloadURL) {
      if(file_name && fileDetails)
        this.downloadFileByURL(downloadURL,type,fileDetails);
      else
        this.downloadFileByURL(downloadURL,type,file_name);
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
  
    if(fileDetails && (typeof fileDetails !== 'string')){
      fileDetailsObject.fileExtension = fileDetails.ext;
      fileDetailsObject.fileName = fileDetails.name;
      fileDetailsObject.fileSize = fileDetails.size;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    else{
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = fileDetails+'.zip';
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
          this._utilityService.downloadFile(downloadEvent.body, fileDetails?.name ? fileDetails.name : 'allfiles.zip');
         
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
        // }, 10000);
        //break;
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
