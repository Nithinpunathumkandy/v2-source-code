import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map, last } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";

@Injectable({
  providedIn: 'root'
})
export class KhFileServiceService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }





  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {
    
 
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'user-profile-picture': return environment.apiBasePath + '/human-capital/files/user-profile-picture/thumbnail?token=' + token;
        break;
      case 'document-template-document': return environment.apiBasePath + '/knowledge-hub/files/document-template-document/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
        break;
    }
  }

  //Get File Preview 
  getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){

      case 'document-templates' : previewURL = environment.apiBasePath+'/document-templates/'+`${id}`+'/files/'+`${file_id}`+'/preview'
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
    var downloadURL = "";
    switch(type){
      case 'process-document' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'flow-document' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/files/'+`${file_id}`+'/process-flow-document'+'/download';
        break;
      case 'document-templates': downloadURL = environment.apiBasePath+'/document-templates/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'process-activities' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/activities/'+`${file_id}`+'/files/'+`${doc_id}`+'/download';
        break;
      case 'process-document-all' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/download'
        break;
      case 'flow-document-all' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/process-flow-document'+'/download'
        break;
      case 'process-activities-all' : downloadURL = environment.apiBasePath+'/processes/'+`${id}`+'/activities/'+`${file_id}`+'/download';
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
