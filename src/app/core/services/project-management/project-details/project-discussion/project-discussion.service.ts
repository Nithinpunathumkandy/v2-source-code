import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Discussion, DiscussionPaginationResponse } from 'src/app/core/models/project-management/project-details/project-discussion/project-discussion';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { DiscussionMasterStore } from 'src/app/stores/project-management/project-details/project-discussion/project-discussion.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectDiscussionService {



  constructor(private _http: HttpClient,

    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<DiscussionPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DiscussionMasterStore.currentPage}`;
      if (DiscussionMasterStore.orderBy) params += `&order_by=discussions.title&order=${DiscussionMasterStore.orderBy}`;
    }
    if (DiscussionMasterStore.searchText) params += (params ? '&q=' : '?q=') + DiscussionMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<DiscussionPaginationResponse>('/projects/' + ProjectsStore.selectedProjectID + '/discussions' + (params ? params : '')).pipe(
      map((res: DiscussionPaginationResponse) => {
        DiscussionMasterStore.setDiscussion(res);
        return res;
      })
    );
  }







  getItemById(): Observable<Discussion> {
    return this._http.get<Discussion>('/projects/' + ProjectsStore.selectedProjectID + '/discussions').pipe((
      map((res: Discussion) => {
        DiscussionMasterStore.setIndividualDiscussion(res);
        return res;
      })
    ))
  }

  getRepliesById(id:any): Observable<Discussion> {
    return this._http.get<Discussion>('/projects/' + ProjectsStore.selectedProjectID + '/discussions/' + id ).pipe((
      map((res: Discussion) => {
        DiscussionMasterStore.setIndividualDiscussion(res);
        return res;
      })
    ))
  }


  generateTemplate() {
    this._http.get('/projects/{projectId}//discussions/{id}template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Discussion.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/projects/' + ProjectsStore.selectedProjectID + '/discussions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Discussion.xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('projects/' + ProjectsStore.selectedProjectID + '/discussions/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'The item has been shared');
        return res;
      })
    )
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/projects/' + ProjectsStore.selectedProjectID + '/discussions/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'Discussion has been updated!');
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/projects/' + ProjectsStore.selectedProjectID + '/discussions', item).pipe(
      map((res: any) => {
        DiscussionMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('Success!', 'Discussion has been added!');

        return res;
      })
    );
  }

  saveReplies(item , id) {
    return this._http.post('/projects/' + ProjectsStore.selectedProjectID + '/discussions' , item).pipe(
      map((res: any) => {
        // DiscussionMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('Success!', 'Reply has been added!');

        return res;
      })
    );
  }
  
  saveReplyReplies(item , id) {
    return this._http.post('/projects/' + ProjectsStore.selectedProjectID + '/discussions' , item).pipe(
      map((res: any) => {
        // DiscussionMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('Success!', 'Reply has been added!');

        return res;
      })
    );
  }



  delete(id: number) {
    return this._http.delete('/projects/' + ProjectsStore.selectedProjectID + '/discussions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'discussion_deleted_successfully');
        this.getItems().subscribe(resp => {
          if (resp.from == null) {
            DiscussionMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }


  sortDiscussionList(type: string) {
    if (!DiscussionMasterStore.orderBy) {
      DiscussionMasterStore.orderBy = 'desc';
      DiscussionMasterStore.orderItem = type;
    }
    else {
      if (DiscussionMasterStore.orderItem == type) {
        if (DiscussionMasterStore.orderBy == 'desc') DiscussionMasterStore.orderBy = 'asc';
        else DiscussionMasterStore.orderBy = 'desc'
      }
      else {
        DiscussionMasterStore.orderBy = 'desc';
        DiscussionMasterStore.orderItem = type;
      }
    }
  }

  importData(data) {

    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/projects/{projectId}//discussions/{id}import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'discussion_imported');
        return res;
      })
    )
  }
  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
    
      case 'discussion-document': return environment.apiBasePath + '/project-management/files/discussion-document/thumbnail?token=' + token;
        break;
    
    }
  }

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
    
      case 'discussion-document': previewURL = environment.apiBasePath + '/projects/' + `${id}` + '/discussions/' + `${doc_id}` + '/files/' + `${file_id}` + '/preview';
        break;
    

    }
    if (previewURL) {
      try {
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch (e) {
      }
    }
  }

  //Download File
  downloadFile(type, id, file_id?, file_name?, individual_file_id?, fileDetails?) {
    var downloadURL = "";
    switch (type) {
    
      case 'discussion-document': downloadURL = environment.apiBasePath + '/projects/' + `${id}` +'/discussions/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
      


    }
    if (downloadURL) {
   
      if (file_name && fileDetails)
        this.downloadFileByURL(downloadURL, type, fileDetails);
      else
        this.downloadFileByURL(downloadURL, type, file_name);
    }
  }

  /**
  * Function to get file download progress
  * Under development
  */
  downloadFileByURL(fileSrc, type, fileDetails?) {
    var responseType = 'blob';
    var fileDetailsObject = {
      fileExtension: '',
      fileName: '',
      fileSize: '',
      downloadProgress: '',
      message: '',
      position: null
    };
   
    if (fileDetails && (typeof fileDetails !== 'string')) {
      fileDetailsObject.fileExtension = fileDetails.ext;
      fileDetailsObject.fileName = fileDetails.title;
      fileDetailsObject.fileSize = fileDetails.size;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    else {
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = fileDetails + '.zip';
      fileDetailsObject.fileSize = null;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
    this.download(fileSrc, responseType).subscribe((event: HttpEvent<any>) => {
      let downloadEvent: any = event;
      switch (downloadEvent.type) {
        case HttpEventType.DownloadProgress:
          let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
          DownloadProgressStore.setDownloadProgress(downloadProgress, fileDetailsObject.position);
          break;
        case HttpEventType.Response:
          this._utilityService.downloadFile(downloadEvent.body, fileDetails?.title ? fileDetails.title : 'allfiles.zip');
          //setTimeout(() => {
          //DownloadProgressStore.setDownloadProgress(100);
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
        // }, 10000);
        //break;
      }
    }, (error => {
      DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
  }

  download(fileSrc, type, fileDetails?) {
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
      map((res: any) => {
        return res;
      }),
    );
  }


}
