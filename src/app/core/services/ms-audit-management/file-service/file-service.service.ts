import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    
  ) { }

   //Get Thumbnail Preview according to type and token
   getThumbnailPreview(type, token, h?: number, w?: number) {
    console.log(type);
    switch(type){
      case 'ms-audit-doc': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit/thumbnail?token='+token;
      break;
      case 'ms-non-confomity-document': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-finding/thumbnail?token='+token;
      break;
      case 'corrective-action': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-finding-corrective-action/thumbnail?token='+token;
      break;
      case 'corrective-action-history': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-finding-corrective-action-update/thumbnail?token='+token;
      break;

    }
  }

  //Get File Preview 
getFilePreview(type, id, file_id?,ca_id?, doc_id?) {
  var previewURL = "";
  switch(type){

    case 'ms-audit-doc' : previewURL = environment.apiBasePath+'/ms-audits/'+`${id}`+'/documents/'+`${file_id}`+'/preview'
      break;
    case 'ms-non-confomity-document' : previewURL = environment.apiBasePath+'/ms-audit-findings/'+`${id}`+'/files/'+`${file_id}`+'/preview'
      break;
    case 'corrective-action' : previewURL = environment.apiBasePath+'/ms-audit-findings/'+`${id}`+'/corrective-actions/'+ca_id+'/files/'+`${file_id}`+'/preview'
    break;
  
    case 'corrective-action-history' : previewURL = environment.apiBasePath+'/ms-audit-finding-corrective-actions/'+`${id}`+'/updates/'+ca_id+'/files/'+`${file_id}`+'/preview'
    break;
    
   
  }
  if(previewURL){
    try{
      return this._http.get(previewURL, { responseType: 'blob' as 'json' });
    }
    catch(e){
     
    }
  }
}


 //Download File
downloadFile(type, id,  file_id?, ca_id?, file_name?, fileDetails?) {
  // document-version  - Main File
  // document - file  - Support File

  var downloadURL = "";
  switch (type) {
    // Document File

    case 'ms-audit-doc' : downloadURL = environment.apiBasePath+'/ms-audits/'+`${id}`+'/documents/'+`${file_id}`+'/download';
      break;
    case 'ms-non-confomity-document' : downloadURL = environment.apiBasePath+'/ms-audit-findings/'+`${id}`+'/files/'+`${file_id}`+'/download';
      break;

    case 'corrective-action' : downloadURL = environment.apiBasePath+'/ms-audit-findings/'+`${id}`+'/corrective-actions/'+ca_id+'/files/'+`${file_id}`+'/download';
    break;

    case 'corrective-action-history' : downloadURL = environment.apiBasePath+'/ms-audit-finding-corrective-actions/'+`${id}`+'/updates/'+ca_id+'/files/'+`${file_id}`+'/download';
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
    DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
    //DownloadProgressStore.clearDownloadFileDetails();
    //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
  }))
}
}
