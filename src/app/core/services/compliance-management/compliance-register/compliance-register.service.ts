import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceRegister, ComplianceRegisterDetails, ComplianceRegisterPaginationResponse } from 'src/app/core/models/compliance-management/compliance-register/compliance-register';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceRegisterService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ComplianceRegisterPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceRegisterStore.currentPage}`;
      if (ComplianceRegisterStore.orderBy) params += `&order_by=${ComplianceRegisterStore.orderItem}&order=${ComplianceRegisterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ComplianceRegisterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceRegisterStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_register' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceRegisterPaginationResponse>('/compliance-registers' + (params ? params : '')).pipe(
      map((res: ComplianceRegisterPaginationResponse) => {
        ComplianceRegisterStore.setComplianceRegister(res);
        return res;
      })
    );
 
  }

  saveComplianceRegister(item){
    return this._http.post('/compliance-registers', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_register_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/compliance-registers/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_register_updated');
        this.getItems().subscribe();
        this.getComplianceRegisterDetails(id).subscribe();
        return res;
      })
    );
  }

  saveComplianceStatus(id:number, item: any){
    return this._http.put('/compliance-register-statuses/'+ id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_status_saved');
        this. getComplianceRegisterDetails(id).subscribe();
        return res;
      })
    );
  }

  

  generateTemplate() {
    this._http.get('/compliance-registers/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_register_template')
        +".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (ComplianceRegisterStore.orderBy) params += `?order=${ComplianceRegisterStore.orderBy}`;
    if (ComplianceRegisterStore.orderItem) params += `&order_by=${ComplianceRegisterStore.orderItem}`;
    // if (ComplianceRegisterStore.searchText) params += `&q=${ComplianceRegisterStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_register' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/compliance-registers/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_register')
        +".xlsx");
      }
    )
  }
  
  setDocumentDetails(imageDetails,url){
    ComplianceRegisterStore.setDocumentDetails(imageDetails,url);
  }

  getComplianceRegisterDetails(id){
    return this._http.get<ComplianceRegisterDetails>('/compliance-registers/'+id).pipe((
      map((res)=>{
        ComplianceRegisterStore.setComplianceDetails(res);
        return res;
      })
    ))
  }

  getComplianceStatusHistory(){
    let params = '';
    params = `?document_id=${ComplianceRegisterStore.complianceRegisterId}`;
    return this._http.get<ComplianceRegisterDetails>('/compliance-register-statuses'+ (params ? params : '') ).pipe((
      map((res)=>{
        ComplianceRegisterStore.setStatusHistory(res);
        return res;
      })
    ))
  }

  getEditItem(id: number):
      Observable<ComplianceRegisterDetails> {
        return this._http.get<ComplianceRegisterDetails>('/compliance-registers/'+id).pipe(
          map((res: ComplianceRegisterDetails) => {
            ComplianceRegisterStore.setIndividualComplianceRegisterItem(res);
            return res;
          })
        );

    }

  delete(id: number){
    return this._http.delete('/compliance-registers/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_register_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  shareData(data){
    return this._http.post('/compliance-registers/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_register_shared');
        return res;
      })
    )
  }

  getThumbnailPreview(type,token){
    return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token;
  }

  getStatusThumbnailPreview(token){
    return environment.apiBasePath + '/compliance-management/files/compliance-register-statuses/thumbnail?token=' + token;
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-registers/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_register_imported');
        return res;
      })
    )
  }

  sortComplianceRegisterList(type:string, text:string) {
    if (!ComplianceRegisterStore.orderBy) {
      ComplianceRegisterStore.orderBy = 'asc';
      ComplianceRegisterStore.orderItem = type;
    }
    else{
      if (ComplianceRegisterStore.orderItem == type) {
        if(ComplianceRegisterStore.orderBy == 'asc') ComplianceRegisterStore.orderBy = 'desc';
        else ComplianceRegisterStore.orderBy = 'asc'
      }
      else{
        ComplianceRegisterStore.orderBy = 'asc';
        ComplianceRegisterStore.orderItem = type;
      }
    }
  }


    //Download File
    downloadFile(type, id, document_id?, file_id?, file_name?, fileDetails?) {
    
      var downloadURL = "";
     switch(type){
      case 'compliance-status-document' : downloadURL = environment.apiBasePath+'/compliance-register-action-plans/'+`${document_id}`+ '/updates/'+`${id}`+'/files/'+`${file_id}`+'/download';
      break;  
      case 'compliance-register-document' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/download';
      break; 
      case 'compliance-action-plan-update-document' : downloadURL = environment.apiBasePath+'/compliance-register-action-plans/'+`${id}`+ '/updates/'+`${file_id}`+'/files/'+`${document_id}`+'/download';
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
      // console.log(error);
      DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
  }

   //Get File Preview 
   getFilePreview(type,id,document_id?,file_id?){
    var previewURL = "";
    switch(type){
      case 'compliance-status-document': previewURL = environment.apiBasePath+ '/compliance-register-action-plans/'+`${document_id}`+ '/updates/'+`${id}`+'/files/'+`${file_id}`+'/preview'
      break;    
      case 'compliance-register-document': previewURL = environment.apiBasePath+ '/documents/'+`${id}`+'/files/'+`${file_id}`+'/preview'
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

  selectRequiredCompliances(issues){
   
		ComplianceRegisterStore.addSelectedCompliances(issues);
	  }
}


