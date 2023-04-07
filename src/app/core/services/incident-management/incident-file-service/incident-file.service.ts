import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentFileService {

  constructor(private _utilityService: UtilityService,private _http: HttpClient) { }

  getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'incident-item': return environment.apiBasePath+ '/incident-management/files/incident-document/thumbnail?token='+token;
        break;

        case 'investigation-item': return environment.apiBasePath+ '/incident-management/files/incident-investigation-incident-document/thumbnail?token='+token;
        break;

        case 'report-template-document': return environment.apiBasePath+ '/incident-management/files/incident-report-template-page-field-document/thumbnail?token='+token;
        break;
        
          
    }
  }

  downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'incident-item' : downloadURL = environment.apiBasePath+'/incidents/'+`${id}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'investigation-item' : downloadURL = environment.apiBasePath+'/incident-investigations/'+`${id}`+'/files/'+`${file_id}`+'/download';
       break;

       case 'document-version': downloadURL = environment.apiBasePath + '/documents/' + `${file_name.document_id}` + '/files/' + `${id}` + '/download';
				break;

      //  case 'corrective-action' : downloadURL = environment.apiBasePath+'/findings/'+finding_id+'/corrective-actions/'+`${auditableItemId}`+'/files/'+`${file_id}`+'/download';
      //   break;
       
     
    
   }
   if(downloadURL){
     this.downloadFileByURL(downloadURL,type,fileDetails);
   }
 }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?){

    var previewURL = "";
		switch (type) {

			case 'incident-item': previewURL = environment.apiBasePath+'/incidents/'+`${id}`+'/files/'+`${file_id}`+'/preview'
				break;
			case 'document-version': previewURL = environment.apiBasePath + '/documents/' + `${id}` + '/files/' + `${file_id}` + '/preview'
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
  getInvestigationFilePreview(file_id){
    
    let previewURL= environment.apiBasePath+'/incident-investigations/'+`${IncidentInvestigationStore.selectedId}`+'/files/'+`${file_id}`+'/preview';

    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
      }
    }
  }
  Preview(file_id , id){
    
    let previewURL= environment.apiBasePath+'/incident-investigations/'+`${id}`+'/files/'+`${file_id}`+'/preview';
    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){

      }
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
