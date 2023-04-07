import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { MsType, MsTypePaginationResponse, MsTypeDetails, AllMsTypeDetails } from "src/app/core/models/organization/business_profile/ms-type/ms-type";
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MsTypeVersion, AvailableMsTypeVersions } from 'src/app/core/models/masters/organization/ms-type-version';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';

@Injectable({
  providedIn: 'root'
})
export class MstypesService {

  itemChange: EventEmitter<number> = new EventEmitter();
  
  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // Get Request - Get Organization Ms Types
  getItems(getAll: boolean = false,resparams: string = ''): Observable<MsTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsTypeStore.currentPage}`;
      if (MsTypeStore.orderBy) params += `&order_by=ms_type_title&order=${MsTypeStore.orderBy}`;
    }
    if(MsTypeStore.searchText != ''){
      if(params) params = params + `&q=${MsTypeStore.searchText}`;
      else params = `?q=${MsTypeStore.searchText}`;
    }
    return this._http.get<MsTypePaginationResponse>('/ms-type-organizations'+ (params ? params : '') + (resparams ? resparams : '')).pipe(
      map((res: MsTypePaginationResponse) => {
        MsTypeStore.setMsTypeDetails(res);
        return res;
      })
    );
  }

  getAllItems(){
    let params = '?status=all';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(MsTypeStore.searchText != ''){
      if(params) params = params + `&q=${MsTypeStore.searchText}`;
      else params = `?q=${MsTypeStore.searchText}`;
    }
    return this._http.get<AllMsTypeDetails[]>('/ms-type-organizations/all-details'+params).pipe(
      map((res: AllMsTypeDetails[]) => {
        MsTypeStore.setAllMsTypes(res);
        return res;
      })
    );
  }

  // Put Request - Update Organization Ms Type
  updateItem(id, item: MsType): Observable<any> {
    return this._http.put('/ms-type-organizations/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        //this.getItems(false,'?access_all=true').subscribe();
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  // Post Request - Save Organization Ms Type
  saveItem(item: MsType) {
    return this._http.post('/ms-type-organizations', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.setSelected(item.ms_type_id);
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  // Delete Request - Delete Organization Ms Type
  deleteItem(id: number) {
    return this._http.delete('/ms-type-organizations/' + id).pipe(
      map(res => {
        this.setSelected(id,'delete');
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  // Delete Request - Delete Organization Ms Type
  deactivateItem(id: number) {
    return this._http.put('/ms-type-organizations/' + id +'/deactivate',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  // Get Request - Details of Specific Organization Ms Type
  getItemDetails(id):Observable<MsTypeDetails>{
    return this._http.get('/ms-type-organizations/' + id).pipe(
      map((res:MsTypeDetails) => {
        MsTypeStore.setSelectedMsTyeDetails(res);
        return res;
      })
    );
  }

  // Set specific Organization MsType
  setItem(item: MsTypeDetails){
    MsTypeStore.setSelectedMsTyeDetails(item);
  }

  // Unset specific Organization MsType
  unsetItem(){
    MsTypeStore.unsetSelectedMsTypeDetails();
  }
  
  // Get specific Organization MsType
  getItem():MsTypeDetails{
    return MsTypeStore.getSelectedMsTypeDetails;
  }

  // Set Specific MsType Verison List
  setSpecificVersionList(items: AvailableMsTypeVersions[]){
    MsTypeStore.setMsTypeVersionList(items);
  }

  // Unset Specific MsType Version
  unsetSpecificVersionList(){
    MsTypeStore.unsetSpecificVersionList();
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/ms-type-organizations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_mstypes_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if (MsTypeStore.orderBy) params += `&order_by=ms_type_title&order=${MsTypeStore.orderBy}`;
      this._http.get('/ms-type-organizations/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_mstypes')+'.xlsx');
      }
    )
  }

  setSelected(id: number,action?:string){
    var items:AllMsTypeDetails[] = MsTypeStore.allMsTypes;
    var pos = null;
    for(let i of items){
      pos = i.ms_types.findIndex(e=> e.ms_type_details.id == id);
      if(pos != -1)
        break;
    }
    if(action){
      if(pos < items.length -1)
        pos = pos + 1;
      else
        pos = pos - 1;
    }
    else{
      if(pos != -1)
        this.itemChange.emit(pos)
      else
        this.itemChange.emit(items.length);
    }
  }

   // Sets Thumbnail Details
   setImageDetails(imageDetails,url,type){
    MsTypeStore.setFileDetails(imageDetails,url,type);
  }

  getBrochures(){
    return MsTypeStore.getBrochureDetails;
  }


   //Get Thumbnail Preview according to type and token
   getThumbnailPreview(type, token, h?: number, w?: number) {
    switch(type){
      case 'ms-type-organization-document': return environment.apiBasePath+ '/organization/files/ms-type-organization-document/thumbnail?token='+token;
      break;
    }
  }

    //Download File
    downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
  
      // document-version  - Main File
      // document - file  - Support File
  
      var downloadURL = "";
      switch (type) {
        // Document File
        case 'ms-type-organization-document' : downloadURL = environment.apiBasePath+'/ms-type-organizations/'+`${id}`+'/files/'+`${file_id}`+'/download';
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

      //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch(type){

      case 'ms-type-organization-document' : previewURL = environment.apiBasePath+'/ms-type-organizations/'+`${id}`+'/files/'+`${file_id}`+'/preview'
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

}
