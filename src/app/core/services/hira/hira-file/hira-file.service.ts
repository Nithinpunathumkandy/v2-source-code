import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';

@Injectable({
  providedIn: 'root'
})
export class HiraFileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {

    switch (type) {
      case 'risk-treatment': return environment.apiBasePath + '/risk-management/files/risk-treatment-update-document/thumbnail?token=' + token;
        break;
    
    }
  }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'risk-treatment': previewURL = environment.apiBasePath + '/risk-treatments/' + `${id}` + '/updates/' + `${file_id}` + '/files/'+`${doc_id}`+'/preview'
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
      case 'risk-treatment-documents': downloadURL = environment.apiBasePath + '/risk-treatments/' + `${id}` + '/updates/' + `${file_id}` + '/files/'+`${individual_file_id}`+'/download';
        break;
        case 'risk-treatment-all-documents': downloadURL = environment.apiBasePath + '/risk-treatments/' + `${id}` + '/updates/' + `${file_id}` + '/download';
        break;
     
      case 'risk-treatment-template': downloadURL = environment.apiBasePath + '/risk-treatments/template?risk_ids=' + RisksStore.riskId;
        break;

      case 'risk-treatment-export': 
        if(RisksStore.riskId){
          downloadURL = environment.apiBasePath + '/risk-treatments/export?risk_ids=' + RisksStore.riskId+'&fields=risk_treatment_id,risk_number,risk_title,risk_description,reference_code,title,treatment_dependency,risk_treatment_action_plan,start_date,agreed_date,frequency_of_review,risk_treatment_owner,risk_owner,inherent_risk_rating,budget,status,divisions,departments';
        }else{
          downloadURL = environment.apiBasePath + '/risk-treatments/export?fields=risk_treatment_id,risk_number,risk_title,risk_description,reference_code,title,treatment_dependency,risk_treatment_action_plan,start_date,agreed_date,frequency_of_review,risk_treatment_owner,risk_owner,inherent_risk_rating,budget,status,divisions,departments';
        }
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

}
