import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualProjectIssue, ProjectIssuePaginationResponse } from 'src/app/core/models/project-management/project-details/project-issue/project-issue';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectIssueService {

  constructor(private _http:HttpClient,private _helperService : HelperServiceService,
              private _utilityService:UtilityService) { }

   /**
   * @description
   * This method is used for getting project issues.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProjectIssueService
   */       
    getAllItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectIssuePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectIssueStore.currentPage}`;
        if (ProjectIssueStore.orderBy) params += `&order_by=${ProjectIssueStore.orderItem}&order=${ProjectIssueStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(ProjectIssueStore.searchText) params += (params ? '&q=' : '?q=')+ProjectIssueStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'project_issue_list' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ProjectIssuePaginationResponse>(`/project-monitor/project-issues` + (params ? params : '')).pipe(
        map((res: ProjectIssuePaginationResponse) => {
          ProjectIssueStore.setProjectIssue(res);
          return res;
        })
      );
   
    }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectIssuePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectIssueStore.currentPage}`;
      if (ProjectIssueStore.orderBy) params += `&order_by=${ProjectIssueStore.orderItem}&order=${ProjectIssueStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectIssueStore.searchText) params += (params ? '&q=' : '?q=')+ProjectIssueStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_issue' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectIssuePaginationResponse>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/issues` + (params ? params : '')).pipe(
      map((res: ProjectIssuePaginationResponse) => {
        ProjectIssueStore.setProjectIssue(res);
        return res;
      })
    );
 
  }

   /**
   * @description
   * This method is used for getting individual project issue details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectIssueService
   */
    getItem(projectId: number,documentId: number) : Observable<IndividualProjectIssue>{
      return this._http.get<IndividualProjectIssue>(`/project-monitor/projects/${projectId}/issues/${documentId}`).pipe(
        map((res: IndividualProjectIssue) => {
          ProjectIssueStore.setIndividualProjectIssue(res)
          return res;
        })
      );
    }  

   /**
   * @description
   * this method is used for creating project issue
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectIssueService
   */  
  saveProjectIssue(projectId: number,item: any){
    return this._http.post(`/project-monitor/projects/${projectId}/issues`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','project_issue_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating project issue
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectIssueService
   */  
  updateItem(projectId: number, documentId: number, item: any): Observable<any> {
    return this._http.put(`/project-monitor/projects/${projectId}/issues/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_issue_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting project issue
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ProjectIssueService
   */  
  delete(projectId: number, documentId: number){
    return this._http.delete(`/project-monitor/projects/${projectId}/issues/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_issue_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel(params:string='') {
    this._http.get('/project-monitor/project-issues/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Issues') +".xlsx");
      }
    )
  }

  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {
    if (type == 'project-monitoring-issue')
    return environment.apiBasePath+ '/project-monitoring/files/project-monitoring-issue/thumbnail?token='+token;
  }

  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){
      case 'project-monitoring-issue' : previewURL = environment.apiBasePath+'/project-monitor/projects/'+`${id}`+'/issues/'+`${file_id}`+'/file-preview'
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
  
    // document-version  - Main File
    // document - file  - Support File

    var downloadURL = ""; 
    switch (type) {
      // Document File
      case 'project-monitoring-issue' : downloadURL = environment.apiBasePath+'/project-monitor/projects/'+`${id}`+'/issues/'+`${file_id}`+'/file-download';
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


  sortProjectIssueList(type:string, text:string) {
    if (!ProjectIssueStore.orderBy) {
      ProjectIssueStore.orderBy = 'asc';
      ProjectIssueStore.orderItem = type;
    }
    else{
      if (ProjectIssueStore.orderItem == type) {
        if(ProjectIssueStore.orderBy == 'asc') ProjectIssueStore.orderBy = 'desc';
        else ProjectIssueStore.orderBy = 'asc'
      }
      else{
        ProjectIssueStore.orderBy = 'asc';
        ProjectIssueStore.orderItem = type;
      }
    }
  }


}


