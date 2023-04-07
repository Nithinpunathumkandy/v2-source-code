import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map, last } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";

@Injectable({
  providedIn: 'root'
})
export class DocumentFileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }



  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch(type){
      case 'user-profile-picture': return environment.apiBasePath + '/human-capital/files/user-profile-picture/thumbnail?token=' + token;
        break;
      case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
        break;
      case 'document-file': return environment.apiBasePath + '/knowledge-hub/files/document-file/thumbnail?token=' + token;
        break;
      case 'control-document': return environment.apiBasePath + '/bpm/files/control-document/thumbnail?token=' + token;
        break;
      // Change Request Main File
      case 'change-request-document': return environment.apiBasePath + '/knowledge-hub/files/change-request-document/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
        break;
        // Change Request Changed File
      case 'change-request-file': return environment.apiBasePath + '/knowledge-hub/files/change-request-file/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
      break;
    }
  }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){

      case 'document-templates' : previewURL = environment.apiBasePath+'/document-templates/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'document-version' : previewURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'document-file': previewURL = environment.apiBasePath + '/documents/' + `${id}` + '/document-files/' + `${file_id}` + '/preview'
        break;
      // Change Request Main File
        case 'change-request-document': previewURL = environment.apiBasePath + '/document-change-requests/' + 'files/' + `${id}` + '/preview'
        break;
      // Change Request Changed File
        case 'change-request-file': previewURL = environment.apiBasePath + '/document-change-requests/' + `${id}` + '/document-files/' + `${file_id}` + '/preview'
        break;
    }
    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
        console.log(e);
      }
    }
  }

   //Download File
  downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
  
    // document-version  - Main File
    // document - file  - Support File

    var downloadURL = "";
    switch (type) {
      // Document File
      case 'document-version' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'document-file' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/document-files/'+`${file_id}`+'/download';
        break;
      case 'document-version-all' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/download'
        break;
      case 'document-file-all' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/document-files'+'/download'
        break;
      // Change Request Changed File
        case 'change-request-file' : downloadURL = environment.apiBasePath+'/document-change-requests/'+`${id}`+'/document-files/'+`${file_id}`+'/download';
        break;
        case 'change-request-file-all' : downloadURL = environment.apiBasePath+'/document-change-requests/'+`${id}`+'/document-files/'+'/download';
        break;
      
      // Document Template File
      
      // Control Document File
      case 'control-document' : downloadURL = environment.apiBasePath+'/controls/'+`${id}`+'/files/'+`${file_id}`+'/download';
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
          //setTimeout(() => {
            //DownloadProgressStore.setDownloadProgress(100);
            DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
            DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
          // }, 10000);
          //break;
      }
    },(error=>{
      // console.log(error);
      DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
  }
}
