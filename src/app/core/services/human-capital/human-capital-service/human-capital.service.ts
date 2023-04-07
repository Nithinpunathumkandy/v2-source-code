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
export class HumanCapitalService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'user-kpis': return environment.apiBasePath + '/master/files/kpi-document/thumbnail?token=' + token;
        break;
      case 'user-reports': return environment.apiBasePath + '/master/files/user-report-document/thumbnail?token=' + token;
        break;
      case 'user-jobs': return environment.apiBasePath + '/master/files/jd-document/thumbnail?token=' + token;
        break;
      case 'user-certificate': return environment.apiBasePath + '/human-capital/files/user-certificate/thumbnail?token=' + token;
        break;
      case 'user-document': return environment.apiBasePath + '/human-capital/files/user-document/thumbnail?token=' + token;
        break;
      case 'user-profile-picture': return environment.apiBasePath + '/human-capital/files/user-profile-picture/thumbnail?token=' + token;
        break;
      case 'actual-report-document': return environment.apiBasePath + '/human-capital/files/user-actual-report-document/thumbnail?token=' + token;
        break;
    }
  }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'user-kpi': previewURL = environment.apiBasePath + '/kpis/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview'
        break;

      case 'user-report': previewURL = environment.apiBasePath + '/user-reports/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview'
        break;
      case 'user-certificate': previewURL = environment.apiBasePath + '/users/' + `${id}` + '/certificates/' + `${file_id}` + '/preview'
        break;
      case 'documents-preview': previewURL = environment.apiBasePath + '/users/' + `${id}` + '/documents/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview';
        break;
      case 'user-job': previewURL = environment.apiBasePath + '/jds/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview';
        break;
      case 'user-actual-report': previewURL = environment.apiBasePath + '/users/' + `${id}` + '/user-actual-reports/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview';
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
      case 'user-download-certificate': downloadURL = environment.apiBasePath + '/users/' + `${id}` + '/certificates/' + `${file_id}` + '/download';
        break;
      case 'user-download-documents': downloadURL = environment.apiBasePath + '/users/' + `${id}` + '/documents/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
      case 'user-download-all-documents': downloadURL = environment.apiBasePath + '/users/' + `${id}` + '/documents/' + `${file_id}` + '/download';
        break;

      case 'user-report-documents': downloadURL = environment.apiBasePath + '/user-reports/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;

      case 'user-kpi-documents': downloadURL = environment.apiBasePath + '/kpis/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
      case 'user-job-documents': downloadURL = environment.apiBasePath + '/jds/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
      case 'user-document-history': downloadURL = environment.apiBasePath + '/users/' + `${id}` + '/documents/' + `${file_id}` + '/download?version=' + `${individual_file_id}`;
        break;

      case 'user-actual-report-document': downloadURL = environment.apiBasePath + '/users/' + `${id}` + '/user-actual-reports/' + `${file_id}` + '/download';
        break;


      case 'document-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/documents/template';
        break;

      case 'document-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/documents/export';
        break;

      case 'job-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/jds/template';
        break;

      case 'job-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/jds/export';
        break;


      case 'rr-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/roles-and-responsibilities/template';
        break;

      case 'rr-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/roles-and-responsibilities/export';
        break;

      case 'kpi-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/kpis/template';
        break;

      case 'kpi-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/kpis/export';
        break;

      case 'report-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/user-reports/template';
        break;

      case 'report-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/user-reports/export';
        break;

      case 'competency-assessments-template': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/competency-assessments/template';
        break;

      case 'competency-assessments-export': downloadURL = environment.apiBasePath + '/users/' + UsersStore.user_id + '/competency-assessments/export';
        break;

      case 'actual-report-template': downloadURL = environment.apiBasePath + '/users/' + fileDetails.user_id + '/user-actual-reports/template';
        break;

      case 'actual-report-export': downloadURL = environment.apiBasePath + '/users/' + fileDetails.user_id + '/user-actual-reports/export';
        break;


    }
    if (downloadURL) {
      // this._http.get(downloadURL, { responseType: 'blob' as 'json' }).subscribe(response => {
      //   this._utilityService.downloadFile(response, file_name);
      // }, (error => {
      //   if (error.status == 403) {
      //     this._utilityService.showErrorMessage('Error', 'Permission Denied');
      //   }
      // }) 
      // )

      // this.downloadFileByURL(downloadURL, type, fileDetails)
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
    // if (fileDetails) {
    //   fileDetailsObject.fileExtension = fileDetails.ext;
    //   fileDetailsObject.fileName = fileDetails.title;
    //   fileDetailsObject.fileSize = fileDetails.size;
    //   fileDetailsObject.downloadProgress = '0%';
    //   fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    // }
    // else {
    //   fileDetailsObject.fileExtension = 'zip';
    //   fileDetailsObject.fileName = 'allfiles.zip';
    //   fileDetailsObject.fileSize = null;
    //   fileDetailsObject.downloadProgress = '0%';
    //   fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    // }
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
          //setTimeout(() => {
          //DownloadProgressStore.setDownloadProgress(100);
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
        // }, 10000);
        //break;
      }
    }, (error => {
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

  /**
   * Function to get file download progress
   * Under development
   */
  // downloadFileByURL(fileSrc, type, fileDetails?) {
  //   var fileDetailsObject = {
  //     fileExtension: '',
  //     fileName: '',
  //     fileSize: '',
  //     downloadProgress: null
  //   };

  //   if (fileDetails) {
  //     fileDetailsObject.fileExtension = fileDetails.ext;
  //     fileDetailsObject.fileName = fileDetails.title;
  //     fileDetailsObject.fileSize = fileDetails.size;
  //     fileDetailsObject.downloadProgress = 0;

  //     DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
  //     this.download(fileSrc, type, fileDetails).subscribe((event: HttpEvent<any>) => {
  //       switch (event.type) {
  //         case HttpEventType.DownloadProgress:
  //           let downloadProgress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
  //           DownloadProgressStore.setDownloadProgress(downloadProgress);
  //           break;
  //         case HttpEventType.Response:
  //           this._utilityService.downloadFile(event.body, fileDetails.title);
  //           setTimeout(() => {
  //             DownloadProgressStore.clearDownloadFileDetails();
  //           }, 250);
  //           break;
  //       }
  //     })
  //   }
  //   else {
  //     this._http.get(fileSrc, { responseType: 'blob' as 'json' }).subscribe(response => {
  //       this._utilityService.downloadFile(response, fileDetails?.title ? fileDetails.title : 'allfiles.zip');
  //     }, (error => {
  //       if (error.status == 403) {
  //         this._utilityService.showErrorMessage('Error', 'Permission Denied');
  //       }
  //     })
  //     );
  //   }
  // }
}
