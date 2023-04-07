import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualEventDocument, EventDocumentsPaginationResponse } from 'src/app/core/models/event-monitoring/event-document';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { environment } from 'src/environments/environment';
import { EventDocumentStore } from 'src/app/stores/event-monitoring/event-document-store';

@Injectable({
  providedIn: 'root'
})
export class EventDocumentsService  {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

   /**
   * @description
   * This method is used for getting event documents.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProjectDetailsDocumentsService 
   */              
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<EventDocumentsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventDocumentStore.currentPage}`;
      if (EventDocumentStore.orderBy) params += `&order_by=${EventDocumentStore.orderItem}&order=${EventDocumentStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(EventDocumentStore.searchText) params += (params ? '&q=' : '?q=')+EventDocumentStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'event_document' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventDocumentsPaginationResponse>('/events/'+EventsStore.selectedEventId+'/documents' + (params ? params : '')).pipe(
      map((res: EventDocumentsPaginationResponse) => {
        EventDocumentStore.setEventDocument(res)
        return res;
      })
    );
 
  }
  

   /**
   * @description
   * This method is used for getting individual event document details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectDetailsDocumentsService 
   */
    getItem(eventId: number,documentId: number) : Observable<IndividualEventDocument>{
      return this._http.get<IndividualEventDocument>(`/events/${EventsStore.selectedEventId}/documents/${documentId}`).pipe(
        map((res: IndividualEventDocument) => {
          EventDocumentStore.setIndividualEventDocument(res)
          return res;
        })
      );
    }  

   /**
   * @description
   * this method is used for creating event document
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectDetailsDocumentsService 
   */  
  saveProjectDocument(eventId: number,item: any){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/documents', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_document_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating event document
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectDetailsDocumentsService 
   */  
  updateItem(eventId: number, documentId: number, item: any): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/documents/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_document_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting event document
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ProjectDetailsDocumentsService 
   */  
  delete(eventId: number, documentId: number){
    return this._http.delete(`/events/${EventsStore.selectedEventId}/documents/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_document_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type,token, h?: number, w?: number) {
    if (type == 'event-documents')
    return environment.apiBasePath+ '/event-monitoring/files/event-detail-document/thumbnail?token='+token;
  }


  sortProjectDocumentList(type:string, text:string) {
    if (!EventDocumentStore.orderBy) {
      EventDocumentStore.orderBy = 'asc';
      EventDocumentStore.orderItem = type;
    }
    else{
      if (EventDocumentStore.orderItem == type) {
        if(EventDocumentStore.orderBy == 'asc') EventDocumentStore.orderBy = 'desc';
        else EventDocumentStore.orderBy = 'asc'
      }
      else{
        EventDocumentStore.orderBy = 'asc';
        EventDocumentStore.orderItem = type;
      }
    }
  }


  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){ 
      case 'event-documents' : previewURL = environment.apiBasePath+'/events/'+`1`+'/documents/'+`${file_id}`+'/file-preview'
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


  downloadFile(eventId,type,file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'event-documents' : downloadURL = environment.apiBasePath+'/events/'+`1`+'/documents/'+`${file_id}`+'/file-download';
       break;
    
   }
   if(downloadURL){
    this.downloadFileByURL(downloadURL,type,fileDetails);
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



