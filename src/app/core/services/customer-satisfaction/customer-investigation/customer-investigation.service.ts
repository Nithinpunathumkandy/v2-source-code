import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerInvestigationPaginationResponse, IndivitualCustomerInvestigation } from 'src/app/core/models/customer-satisfaction/customer-investigation/customer-investigation';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerInvestigationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<CustomerInvestigationPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerInvestigationStore.currentPage}`;
      if (CustomerInvestigationStore.orderBy) params += `&order_by=${CustomerInvestigationStore.orderItem}&order=${CustomerInvestigationStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(CustomerInvestigationStore.searchText) params += (params ? '&q=' : '?q=')+CustomerInvestigationStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'investigation' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CustomerInvestigationPaginationResponse>('/customer-complaint-investigations' + (params ? params : '')).pipe(
      map((res: CustomerInvestigationPaginationResponse) => {
        CustomerInvestigationStore.setCustomerInvestigation(res);
        return res;
      })
    );
 
  }

  getItem(id) : Observable<IndivitualCustomerInvestigation>{
    return this._http.get<IndivitualCustomerInvestigation>('/customer-complaint-investigations/' +id).pipe(
      map((res: IndivitualCustomerInvestigation) => {
        CustomerInvestigationStore.setIndivitualCustomerInvestigation(res)
        return res;
      })
    );
  }

  saveCustomerInvestigation(item){
    return this._http.post('/customer-complaint-investigations', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','customer_investigation_saved');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateCustomerInvestigation(id,item){
    return this._http.put('/customer-complaint-investigations/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'customer_investigation_updated');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  delete(id: number){
    return this._http.delete('/customer-complaint-investigations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_investigation_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/customer-complaint-investigations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_investigation_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (CustomerInvestigationStore.orderBy) params += `?order=${CustomerInvestigationStore.orderBy}`;
    if (CustomerInvestigationStore.orderItem) params += `&order_by=${CustomerInvestigationStore.orderItem}`;
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/customer-complaint-investigations/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_investigation') + ".xlsx");
      }
    )
  }

  sortCustomerInvestigationList(type:string, text:string) {
    if (!CustomerInvestigationStore.orderBy) {
      CustomerInvestigationStore.orderBy = 'asc';
      CustomerInvestigationStore.orderItem = type;
    }
    else{
      if (CustomerInvestigationStore.orderItem == type) {
        if(CustomerInvestigationStore.orderBy == 'asc') CustomerInvestigationStore.orderBy = 'desc';
        else CustomerInvestigationStore.orderBy = 'asc'
      }
      else{
        CustomerInvestigationStore.orderBy = 'asc';
        CustomerInvestigationStore.orderItem = type;
      }
    }
  }

    //  //Get Thumbnail Preview according to type and token
    //  getThumbnailPreview(type, token, h?: number, w?: number) {
    //   switch(type){
    //     case 'customer-investigation-document': return environment.apiBasePath+ '/customer-engagement/files/customer-complaint-investigation-document/thumbnail?token='+token;
    //     break;
    //   }
    // }

  //     //Get File Preview 
  // getFilePreview(type, id, file_id?, doc_id?) {
  //   var previewURL = "";
  //   switch(type){

  //     case 'customer-investigation-document' : previewURL = environment.apiBasePath+'/customer-complaint-investigations/'+`${id}`+'/files/'+`${file_id}`+'/preview'
  //       break;
  //     case 'document-version' : previewURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/preview'
  //       break; 
     
  //   }
  //   if(previewURL){
  //     try{
  //       return this._http.get(previewURL, { responseType: 'blob' as 'json' });
  //     }
  //     catch(e){
  //       console.log(e);
  //     }
  //   }
  // }

  //  //Download File
  // downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
  
  //   // document-version  - Main File
  //   // document - file  - Support File

  //   var downloadURL = "";
  //   switch (type) {
  //     // Document File
  //     case 'customer-investigation-document' : downloadURL = environment.apiBasePath+'/customer-complaint-investigations/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //       break;
  //     case 'document-version' : downloadURL = environment.apiBasePath+'/documents/'+`${id}`+'/files/'+`${file_id}`+'/download';
  //       break;
      
      
  //   }
  //   if(downloadURL){
  //     this.downloadFileByURL(downloadURL,type,fileDetails);
  //   }
  // }

  // download(fileSrc,type,fileDetails?){
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const options = {
  //     headers: headers,
  //     reportProgress: true,
  //     observe: true
  //   };
  //   const req = new HttpRequest('GET', fileSrc, options, { responseType: 'blob' });
  //   return this._http.request(req).pipe(
  //     map((res:any)=>{
  //       return res;
  //     }),
  //   );
  // }

  // /**
  //  * Function to get file download progress
  //  * Under development
  //  */
  //   /**
  //  * Function to get file download progress
  //  * Under development
  //  */
  // downloadFileByURL(fileSrc,type,fileDetails?){
  //   var responseType = 'blob';
  //   var fileDetailsObject = {
  //     fileExtension: '',
  //     fileName: '',
  //     fileSize: '',
  //     downloadProgress : '',
  //     message:'',
  //     position: null
  //   };
  //   if(fileDetails){
  //     fileDetailsObject.fileExtension = fileDetails.ext;
  //     fileDetailsObject.fileName = fileDetails.title;
  //     fileDetailsObject.fileSize = fileDetails.size;
  //     fileDetailsObject.downloadProgress = '0%';
  //     fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  //   }
  //   else{
  //     fileDetailsObject.fileExtension = 'zip';
  //     fileDetailsObject.fileName = 'allfiles.zip';
  //     fileDetailsObject.fileSize = null;
  //     fileDetailsObject.downloadProgress = '0%';
  //     fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  //   }
  //   DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
  //   this.download(fileSrc,responseType).subscribe((event: HttpEvent<any>) => {
  //     let downloadEvent: any = event;
  //     switch (downloadEvent.type) {
  //       case HttpEventType.DownloadProgress:
  //         let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
  //         DownloadProgressStore.setDownloadProgress(downloadProgress,fileDetailsObject.position);
  //         break;
  //       case HttpEventType.Response:
  //         this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : 'allfiles.zip');
  //         //setTimeout(() => {
  //           //DownloadProgressStore.setDownloadProgress(100);
  //           DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
  //           DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
  //         // }, 10000);
  //         //break;
  //     }
  //   },(error=>{
  //     // console.log(error);
  //     DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
  //     //DownloadProgressStore.clearDownloadFileDetails();
  //     //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
  //   }))
  // }
}
