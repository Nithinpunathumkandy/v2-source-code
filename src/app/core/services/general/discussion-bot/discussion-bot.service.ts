import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DiscussionBotStore } from "src/app/stores/general/discussion-bot.store";
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';

@Injectable({
  providedIn: 'root'
})
export class DiscussionBotService {

  scrollDiscussion: EventEmitter<any> = new EventEmitter()
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) {
  }

  sendDiscussionMessage(message:any){
    return this._http.post(DiscussionBotStore.basePathComments+DiscussionBotStore.discussionAPI,message).pipe(
      map((res: any) => {
        if(DiscussionBotStore.currentPage != 1){
          DiscussionBotStore.setCurrentPage(1)
        }
        this.getDiscussionMessage().subscribe();
        return res;
      })
    );
  }

  getDiscussionMessage(endPoint?){
    return this._http.get(DiscussionBotStore.basePathComments+DiscussionBotStore.discussionAPI+'?limit=1000').pipe(
      map((res: any) => {
        DiscussionBotStore.setisScrollUp(false);
        DiscussionBotStore.setDiscussionMessage(res);
        DiscussionBotStore.setTotalCount(res["total"]);
        // DiscussionBotStore.setLastPage(res["last_page"])
       // DiscussionBotStore.setCurrentPage(res["current_page"]);
        this.scrollDiscussion.emit(null);
        return res;
      })
    );
  }

  // getThumbnailPreview(type,token){
  //   switch(type){
  //     case 'ia-corrective-action': return environment.apiBasePath+'/internal-audit/files/finding-corrective-action-comment-document/thumbnail?token='+token;
  //         break;
  //   }
  // }

  getThumbnailPreview(token){
     return environment.apiBasePath+DiscussionBotStore.discussionThumbnailAPI+token;
       
  }

  downloadThumbnailImage(endPoint,fileData){
     let apiUrl = environment.apiBasePath + DiscussionBotStore.basePathComments+DiscussionBotStore.thumbnailDwonloadAPI+endPoint
     this.downloadFileByURL(apiUrl,fileData);
  }

  updateDiscussionMessage(commentId: number, message: any){
    return this._http.put(DiscussionBotStore.discussionAPI+'/'+commentId,message).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );
  }

  
  showThumbnailImage(endPoint){
   let previewURL= environment.apiBasePath + DiscussionBotStore.basePathComments+ DiscussionBotStore.showThumbnailAPI+endPoint

   if(previewURL){
    try{
      return this._http.get(previewURL, { responseType: 'blob' as 'json' });
    }
    catch(e){
      console.log(e);
    }
  }
  }

  

  deleteDiscussionMessage(commentId: number){
    return this._http.delete(DiscussionBotStore.discussionAPI+'/'+commentId).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );
  }

  download(fileSrc,fileDetails?){
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

  downloadFileByURL(fileSrc,fileDetails?){
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
    this.download(fileSrc).subscribe((event: HttpEvent<any>) => {
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
