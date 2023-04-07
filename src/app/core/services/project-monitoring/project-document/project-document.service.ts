import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualProjectDocument, ProjectDocumentPaginationResponse } from 'src/app/core/models/project-management/project-details/project-document/project-document';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectDocumentStore } from 'src/app/stores/project-monitoring/project-document-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDocumentService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

   /**
   * @description
   * This method is used for getting project documents.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProjectDocumentService
   */              
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectDocumentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectDocumentStore.currentPage}`;
      if (ProjectDocumentStore.orderBy) params += `&order_by=${ProjectDocumentStore.orderItem}&order=${ProjectDocumentStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectDocumentStore.searchText) params += (params ? '&q=' : '?q=')+ProjectDocumentStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_document' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectDocumentPaginationResponse>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/documents` + (params ? params : '')).pipe(
      map((res: ProjectDocumentPaginationResponse) => {
        ProjectDocumentStore.setProjectDocument(res);
        return res;
      })
    );
 
  }

   /**
   * @description
   * This method is used for getting individual project document details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectDocumentService
   */
    getItem(projectId: number,documentId: number) : Observable<IndividualProjectDocument>{
      return this._http.get<IndividualProjectDocument>(`/project-monitor/projects/${projectId}/documents/${documentId}`).pipe(
        map((res: IndividualProjectDocument) => {
          ProjectDocumentStore.setIndividualProjectDocument(res)
          return res;
        })
      );
    }  

   /**
   * @description
   * this method is used for creating project document
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectDocumentService
   */  
  saveProjectDocument(projectId: number,item: any){
    return this._http.post(`/project-monitor/projects/${projectId}/documents`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','project_document_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating project document
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectDocumentService
   */  
  updateItem(projectId: number, documentId: number, item: any): Observable<any> {
    return this._http.put(`/project-monitor/projects/${projectId}/documents/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_document_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting project document
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ProjectDocumentService
   */  
  delete(projectId: number, documentId: number){
    return this._http.delete(`/project-monitor/projects/${projectId}/documents/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_document_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type,token, h?: number, w?: number) {
    if (type == 'project-documents')
    return environment.apiBasePath+ '/project-monitoring/files/project-document/thumbnail?token='+token;
  }


  sortProjectDocumentList(type:string, text:string) {
    if (!ProjectDocumentStore.orderBy) {
      ProjectDocumentStore.orderBy = 'asc';
      ProjectDocumentStore.orderItem = type;
    }
    else{
      if (ProjectDocumentStore.orderItem == type) {
        if(ProjectDocumentStore.orderBy == 'asc') ProjectDocumentStore.orderBy = 'desc';
        else ProjectDocumentStore.orderBy = 'asc'
      }
      else{
        ProjectDocumentStore.orderBy = 'asc';
        ProjectDocumentStore.orderItem = type;
      }
    }
  }


  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){ 
      case 'project-documents' : previewURL = environment.apiBasePath+'/project-monitor/projects/'+`${id}`+'/documents/'+`${file_id}`+'/file-preview'
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


  downloadFile(projectId,type,file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'project-documents' : downloadURL = environment.apiBasePath+'/project-monitor/projects/'+`${projectId}`+'/documents/'+`${file_id}`+'/file-download';
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


