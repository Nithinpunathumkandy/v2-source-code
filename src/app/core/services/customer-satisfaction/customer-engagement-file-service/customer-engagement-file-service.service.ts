import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerEngagementFileServiceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    
  ) { }

     //Get Thumbnail Preview according to type and token
     getThumbnailPreview(type, token, h?: number, w?: number) {
      switch(type){
        case 'customer-complaint-document': return environment.apiBasePath+ '/customer-engagement/files/customer-complaint-document/thumbnail?token='+token;
        break;
        case 'customer-investigation-document': return environment.apiBasePath+ '/customer-engagement/files/customer-complaint-investigation-document/thumbnail?token='+token;
        break;

        case 'corrective-action': return environment.apiBasePath + '/customer-engagement/files/customer-complaint-action-plan-document/thumbnail?token=' + token;
        break;

        case 'corrective-action-update': return environment.apiBasePath + '/customer-engagement/files/customer-complaint-action-plan-update-document/thumbnail?token=' + token;
        break;

      }
    }

    //Get File Preview 
  getFilePreview(type, id, ca_id?, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){

      case 'customer-complaint-document' : previewURL = environment.apiBasePath+'/customer-complaints/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'customer-investigation-document' : previewURL = environment.apiBasePath+'/customer-complaint-investigations/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'corrective-action': previewURL = environment.apiBasePath + '/customer-complaint-action-plans/' + `${ca_id}` + '/files/' + `${file_id}` + '/preview'
        break;
      case 'customer-compaint-action-plans-update': previewURL = environment.apiBasePath + '/customer-complaint-action-plans/' + `${id}` + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/preview'
        break;
      // case 'document-version' : previewURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/preview'
      //   break; 
     
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
  downloadFile(type, id, ca_id?, file_id?, file_name?, fileDetails?) {
  
    // document-version  - Main File
    // document - file  - Support File

    var downloadURL = "";
    switch (type) {
      // Document File

      case 'customer-complaint-document' : downloadURL = environment.apiBasePath+'/customer-complaints/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'customer-investigation-document' : downloadURL = environment.apiBasePath+'/customer-complaint-investigations/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      // case 'document-version' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/download';
      //   break;
      case 'corrective-action': downloadURL = environment.apiBasePath + '/customer-complaint-action-plans/' + `${ca_id}` + '/files/' + `${file_id}` + '/download';
        break;
      case 'customer-compaint-action-plans-update': downloadURL = environment.apiBasePath + '/customer-complaint-action-plans/' + id + '/updates/' + `${file_id}` + '/files/' + `${file_name}` + '/download';
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
