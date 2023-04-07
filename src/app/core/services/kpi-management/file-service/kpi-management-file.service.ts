import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiManagementFileService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  
  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {

    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
        case 'kpi-document': return environment.apiBasePath+'/kpi-management/files/kpi-document/thumbnail?token='+token;
          break;
        case 'kpi-score-document': return environment.apiBasePath+'/kpi-management/files/kpi-score-document/thumbnail?token='+token;
          break;
        case 'improvement-plans-document': return environment.apiBasePath+'/kpi-management/files/kpi-improvement-plan-document/thumbnail?token='+token;
          break;
        case 'improvement-plans-update-document': return environment.apiBasePath+'/kpi-management/files/kpi-improvement-plan-update-document/thumbnail?token='+token;
          break;
    }
  }

  //Get File Preview 
    getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){
      case 'kpi-document' : previewURL = environment.apiBasePath+'/kpi-management/kpis/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'kpi-score-document' : previewURL = environment.apiBasePath+'/kpi-management/kpi-scores/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'improvement-plans-document' : previewURL = environment.apiBasePath+'/kpi-management/kpi-improvement-plans/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'improvement-plans-update-document' : previewURL = environment.apiBasePath+`/kpi-management/kpi-improvement-plan/${id}/updates/${doc_id}/files/${file_id}/preview`
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
      case 'kpi-document' : downloadURL = environment.apiBasePath+'/kpi-management/kpis/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'kpi-score-document' : downloadURL = environment.apiBasePath+'/kpi-management/kpi-scores/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'improvement-plans-document' : downloadURL = environment.apiBasePath+'/kpi-management/kpi-improvement-plans/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'improvement-plans-update-document' : downloadURL = environment.apiBasePath+`/kpi-management/kpi-improvement-plan/${id}/updates/${doc_id}/files/${file_id}/download`;
        break;
    }
    if(downloadURL){
      //this.downloadFileByURL(downloadURL,type,fileDetails);
      if(file_name && fileDetails)
        this.downloadFileByURL(downloadURL,type,fileDetails);          
        else
          this.downloadFileByURL(downloadURL,type,file_name);
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

}
