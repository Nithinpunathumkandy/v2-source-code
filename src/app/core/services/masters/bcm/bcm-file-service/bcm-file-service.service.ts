import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BcmFileServiceService {

  constructor(private _utilityService: UtilityService,
    private _http: HttpClient) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch (type) {
      case 'test-and-exercise': return environment.apiBasePath + '/bcm/files/test-and-exercises/thumbnail?token=' + token;
        break;
      case 'test-and-exercise-outcomes': return environment.apiBasePath + '/bcm/files/test-and-exercise-outcomes/thumbnail?token=' + token;
        break;
      case 'risk-treatment-documents': return environment.apiBasePath + '/risk-management/files/risk-treatment-update-document/thumbnail?token=' + token;
        break;
      case 'action-plan-history': return environment.apiBasePath + '/bcm/files/test-and-exercise-action-plan-updates/thumbnail?token=' + token;
        break;
      case 'action-plan-details': return environment.apiBasePath + '/bcm/files/test-and-exercise-action-plans/thumbnail?token=' + token;
        break;
    }
  }

  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'test-and-exercise': previewURL = environment.apiBasePath + '/test-and-exercises/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;
      case 'test-and-exercise-outcomes': previewURL = environment.apiBasePath + '/test-and-exercise-outcomes/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;
      case 'risk-treatment-documents': previewURL = environment.apiBasePath + '/risk-treatments/' + `${id}` + '/updates/' + `${file_id}` + '/files/'+`${doc_id}`+'/preview'                                                      
        break;
      case 'action-plan-history': previewURL = environment.apiBasePath + '/test-and-exercise-action-plan/' + `${id}` + '/updates/' + `${doc_id}` + '/files/'+`${file_id}`+'/preview'                                                      
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

  downloadFile(type, auditableItemId,file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'test-and-exercise' : downloadURL = environment.apiBasePath+'/test-and-exercises/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;
     case 'test-and-exercise-outcomes' : downloadURL = environment.apiBasePath+'/test-and-exercise-outcomes/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;
     case 'risk-treatment-documents' : downloadURL = environment.apiBasePath+'/risk-treatment/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;
     case 'action-plan-history' : downloadURL = environment.apiBasePath+'/test-and-exercise-action-plan/'+`${auditableItemId}/updates/${doc_id}`+'/files/'+`${file_id}`+'/download';
       break;
   }
   if(downloadURL){
     this.downloadFileByURL(downloadURL,type,fileDetails);
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

}
