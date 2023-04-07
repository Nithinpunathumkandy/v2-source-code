import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InternalAuditFileService {

  constructor(private _utilityService: UtilityService,
    private _http: HttpClient) { }


  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'auditable-item': return environment.apiBasePath+ '/internal-audit/files/auditable-item-document/thumbnail?token='+token;
          break;

          case 'audit-plan': return environment.apiBasePath+ '/internal-audit/files/audit-plan-document/thumbnail?token='+token;
          break; 
          case 'audit-plan-schedule': return environment.apiBasePath+ '/internal-audit/files/audit-plan-schedule-document/thumbnail?token='+token;
          break; 

          case 'audits': return environment.apiBasePath+ '/internal-audit/files/audit-document/thumbnail?token='+token;
          break; 

          case 'checklist-answer': return environment.apiBasePath+ '/internal-audit/files/audit-schedule-checklist-answer-document/thumbnail?token='+token;
          break; 

          case 'findings': return environment.apiBasePath+ '/internal-audit/files/finding-document/thumbnail?token='+token;
          break;

          case 'corrective-action': return environment.apiBasePath+ '/internal-audit/files/finding-corrective-action-document/thumbnail?token='+token;
          break;

          case 'cover-bg': return environment.apiBasePath+ '/internal-audit/files/audit-report-template-cover-bg/thumbnail?w=100&h=100&token='+token;
          break;

          case 'cover-logo': return environment.apiBasePath+ '/internal-audit/files/audit-report-template-cover-logo/thumbnail?w=100&h=100&token='+token;
          break;

          case 'conclusion-bg': return environment.apiBasePath+ '/internal-audit/files/audit-report-template-conclusion-bg/thumbnail?w=100&h=100&token='+token;
          break;

         case 'checklists-single-data': return  environment.apiBasePath+ '/internal-audit/files/audit-schedule-checklist-answer-document/thumbnail?token='+token;
         break;

         case 'findings-ca-resolve-docment' : return  environment.apiBasePath+ '/internal-audit/files/finding-corrective-action-update-document/thumbnail?token='+token;
         break;

         case 'findings-ca-resolve-docment-ea' : return  environment.apiBasePath+ '/external-audit/files/finding-corrective-action-update-document/thumbnail?token='+token;
         break;

         case 'corrective-action-history': return environment.apiBasePath + '/non-conformity/files/finding-corrective-action-update-document/thumbnail?token=' + token;
         break;
     
    }
  }
  

  getEaCaPreview(type,id,finding_id,file_id,doc_id?){
    console.log(finding_id)
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'corrective-action' : return environment.apiBasePath+'/external-audit/findings/'+finding_id+'/corrective-actions/'+`${id}`+'/files/'+`${file_id}`+'/preview'
          break;
    }
  }
  getEaCaFilePreview(type,id,file_id,finding_id?,doc_id?){
    var previewURL = "";
    switch(type){

        case 'corrective-action' : previewURL = environment.apiBasePath+'/external-audit/findings/'+finding_id+'/corrective-actions/'+`${id}`+'/files/'+`${file_id}`+'/preview'
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
   //Get File Preview 
   getFilePreview(type,id,file_id,finding_id?,doc_id?){
    var previewURL = "";
    switch(type){

      case 'auditable-item' : previewURL = environment.apiBasePath+'/auditable-items/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
     case 'audit-plan' : previewURL = environment.apiBasePath+'/audit-plans/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;

        case 'audit-plan-schedule' : previewURL = environment.apiBasePath+'/audit-plan-schedules/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;

        case 'audits' : previewURL = environment.apiBasePath+'/audits/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;

        case 'findings' : previewURL = environment.apiBasePath+'/findings/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;

        case 'corrective-action' : previewURL = environment.apiBasePath+'/findings/'+finding_id+'/corrective-actions/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;

        case 'corrective-action-history': previewURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + id + '/updates/' + `${file_id}` + '/files/' + `${finding_id}` + '/preview'
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

  downloadCADocument(type, finding_id, auditableItemId,file_id,fileDetails){
    var downloadURL = "";
    switch(type){

      case 'corrective-action' : downloadURL = environment.apiBasePath+'/findings/'+finding_id+'/corrective-actions/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
      break;
    }

    if(downloadURL){
      this.downloadFileByURL(downloadURL,type,fileDetails);
    }
  }

  downloadEaCADocument(type, finding_id, auditableItemId,file_id,fileDetails){
    var downloadURL = "";
    switch(type){

      case 'corrective-action' : downloadURL = environment.apiBasePath+'/external-audit/findings/'+finding_id+'/corrective-actions/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
      break;
    }

    if(downloadURL){
      this.downloadFileByURL(downloadURL,type,fileDetails);
    }
  }


   //Download File
   downloadFile(type, auditableItemId,file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'auditable-item' : downloadURL = environment.apiBasePath+'/auditable-items/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'audit-plan' : downloadURL = environment.apiBasePath+'/audit-plans/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'audit-plan-all' : downloadURL = environment.apiBasePath+'/audit-plans/'+`${auditableItemId}`+'/download'
       break;


       case 'audit-plan-schedule' : downloadURL = environment.apiBasePath+'/audit-plan-schedules/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'audit-plan-schedule-all' : downloadURL = environment.apiBasePath+'/audit-plan-schedules/'+`${auditableItemId}`+'/download'
       break;

       case 'audits' : downloadURL = environment.apiBasePath+'/audits/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'findings' : downloadURL = environment.apiBasePath+'/findings/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'check-list-answers' : downloadURL = environment.apiBasePath+'/audit-schedules/checklist-answer/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'corrective-action-history': downloadURL = environment.apiBasePath + '/noc-finding-corrective-actions/' + auditableItemId + '/updates/' + `${file_id}` + '/files/' + `${doc_id}` + '/download';
        break;

      //  case 'corrective-action' : downloadURL = environment.apiBasePath+'/findings/'+finding_id+'/corrective-actions/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
      //   break;
       
     
    
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

