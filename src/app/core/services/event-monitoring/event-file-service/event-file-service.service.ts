import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventFileServiceService {

  constructor(private _utilityService: UtilityService,private _http: HttpClient) { }

  getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'event-file': return environment.apiBasePath+ '/event-monitoring/files/event-document/thumbnail?token='+token;
        break;
      case 'event-date': return environment.apiBasePath+ '/event-monitoring/files/event-date/thumbnail?token='+token;
        break;
      case 'event-budget': return environment.apiBasePath+ '/event-monitoring/files/event-budget/thumbnail?token='+token;
        break;
      case 'event-scope': return environment.apiBasePath+ '/event-monitoring/files/event-scope/thumbnail?token='+token;
        break;
      case 'event-status': return environment.apiBasePath+ '/event-monitoring/files/event-status/thumbnail?token='+token;
        break;
      case 'event-checklist': return environment.apiBasePath+ '/event-monitoring/files/event-checklist-detail/thumbnail?token='+token;
        break;
      case 'event-task': return environment.apiBasePath+ '/event-monitoring/files/event-task-document/thumbnail?token='+token;
        break;
      case 'event-task-update': return environment.apiBasePath+ '/event-monitoring/files/event-task-update-document/thumbnail?token='+token;
        break;
    }
  }

  downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
    switch(type){
      case 'event-file' : downloadURL = environment.apiBasePath+'/events/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'event-task' : downloadURL = environment.apiBasePath+'/events/'+`${id}`+'/tasks/'+`${file_id}`+'/files/'+`${doc_id}`+'/download';
        break;
      case 'event-task-update' : downloadURL = environment.apiBasePath+`/events/${id}/tasks/${file_id}/updates/${doc_id}/files/${fileDetails.id}/download`;
        break;
      case 'event-checklist' : downloadURL = environment.apiBasePath+'/events/'+`${id}`+'/event-checklist-details/'+`${file_id}`+'/files/'+`${doc_id}`+'/download';
        break;
      case 'event-date': downloadURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-date/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/download';
        break;
      case 'event-budget': downloadURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-budget/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/download';
        break;
      case 'event-scope': downloadURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-scope/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/download';
        break;
      case 'event-status': downloadURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-status/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/download';
        break;
    }
    if(downloadURL){
      this.downloadFileByURL(downloadURL,type,fileDetails);
    }
  }

  getFilePreview(type, id, file_id?, doc_id?, fileDetails?){
    var previewURL = "";
		switch (type) {
			case 'event-file': previewURL = environment.apiBasePath+'/events/'+`${id}`+'/files/'+`${file_id}`+'/preview'
				break;
      case 'event-checklist': previewURL = environment.apiBasePath+'/events/'+`${id}`+'/event-checklist-details/'+`${file_id}/`+'files/'+doc_id+'/preview'
				break;
      case 'event-task': previewURL = environment.apiBasePath+'/events/'+`${id}`+'/tasks/'+`${file_id}/`+'files/'+doc_id+'/preview'
				break;
      case 'event-date': previewURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-date/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/preview';
        break;
      case 'event-budget': previewURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-budget/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/preview';
        break;
      case 'event-scope': previewURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-scope/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/preview';
        break;
      case 'event-status': previewURL = environment.apiBasePath+ '/events/'+`${id}`+'/change-requests/'+`${file_id}`+'/event-status/'+`${doc_id}`+'/files/'+`${fileDetails.id}`+'/preview';
        break;
      case 'event-task-update' : previewURL = environment.apiBasePath+`/events/${id}/tasks/${file_id}/updates/${doc_id}/files/${fileDetails.id}/preview`;
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
