import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
@Injectable({
  providedIn: 'root'
})
export class ComplianceManagementFileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      // case 'meeting-plan-document': return environment.apiBasePath+ '/mrm/files/meeting-plan-document/thumbnail?token='+token;
      //     break;
      //   case 'findings-document': return environment.apiBasePath+ '/mrm/files/ea-finding-document/thumbnail?token='+token;
      //     break;
      //   case 'findings-ca-document': return environment.apiBasePath+ '/mrm/files/ea-finding-corrective-action-document/thumbnail?token='+token;
      //     break;  
      //   case 'meetings-document': return environment.apiBasePath+ '/mrm/files/meeting-document/thumbnail?token='+token;
      //     break;  
      //   case 'report-tempate-document': return environment.apiBasePath+ '/mrm/files/meeting-report-template-page-field-document/thumbnail?token='+token;
      //     break;    
      //   case 'report-cover-page': return environment.apiBasePath+ '/mrm/files/meeting-report-page-field-document/thumbnail?token='+token;
      //     break; 
        case 'compliance-action-plan-update-document': return environment.apiBasePath+ '/compliance-management/files/compliance-register-action-plan-update-document/thumbnail?token='+token;
          break; 
        case 'action-plan': return environment.apiBasePath+ '/mrm/files/meeting-action-plan-document/thumbnail?token='+token;
          break;
       
    }
  }
   //Get File Preview 
   getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){

      case 'meeting-plan-document' : previewURL = environment.apiBasePath+'/meeting-plans/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'compliance-action-plan-update-document' : previewURL = environment.apiBasePath+'/compliance-register-action-plans/' + `${id}` +  '/updates/' +  `${file_id}` + '/files/' +  `${doc_id}` + '/preview'
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
  //   case 'meeting-plan-document' : downloadURL = environment.apiBasePath+'/meeting-plans/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //   break;
  // case 'findings-document' : downloadURL = environment.apiBasePath+'/mrm/findings/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //   break;
  // case 'findings-ca-document': downloadURL = environment.apiBasePath+ '/mrm/finding-corrective-actions/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //   break;
  // case 'meetings-document' : downloadURL = environment.apiBasePath+'/meetings/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //   break;  
  // case 'meetings-attachemt-all' : downloadURL = environment.apiBasePath+'/meetings/'+`${id}`+'/download';
  //   break;
  // case 'meeting-plan-attachemt-all' : downloadURL = environment.apiBasePath+'/meeting-plans/'+`${id}`+'/download';
  //   break;  
  case 'compliance-action-plan-update-document' : downloadURL = environment.apiBasePath+`/compliance-register-action-plans/${id}/updates/${doc_id}/files/${file_id}/download`;
    break;  
  // case 'action-plan' : downloadURL = environment.apiBasePath+'/meeting-action-plans/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //   break;  
     
   }
   if(downloadURL){
     if(file_name && fileDetails)
      this.downloadFileByURL(downloadURL,type,fileDetails);          
      else
        this.downloadFileByURL(downloadURL,type,file_name);
   }
 }
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
        this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : fileDetails+'.zip');
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
}
