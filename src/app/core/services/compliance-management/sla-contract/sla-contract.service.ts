import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IndividualSLAContracts, SLAContractsPaginationResponse } from 'src/app/core/models/compliance-management/sla-contracts/sla-contract';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
@Injectable({
  providedIn: 'root'
})
export class SlaContractService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<SLAContractsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${SLAContractStore.currentPage}`;
        if (SLAContractStore.orderBy) params += `&order=${SLAContractStore.orderBy}`;
        if (SLAContractStore.orderItem) params += `&order_by=${SLAContractStore.orderItem}`;
      }
      if(additionalParams) params += additionalParams;
      if (SLAContractStore.searchText) params += (params ? '&q=' : '?q=') + SLAContractStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag = 'sla_contract' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<SLAContractsPaginationResponse>('/sla-and-contracts' + (params ? params : '')).pipe(
        map((res: SLAContractsPaginationResponse) => {
          SLAContractStore.setSLAContracts(res);
          return res;
        })
      );
    }
  
    getItem(id) : Observable<IndividualSLAContracts>{
      return this._http.get<IndividualSLAContracts>('/sla-and-contracts/' +id).pipe(
        map((res: IndividualSLAContracts) => {
          SLAContractStore.setIndividualSLAContracts(res)
          return res;
        })
      );
    }

    getHistory(id){
      return this._http.get('/sla-and-contracts/'+id+'/history').pipe(
        map((res) => {
          SLAContractStore.setDocumentHistory(res)
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/sla-and-contracts/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'sla_contract_deleted');
          setTimeout(() => {    
            if (SLAContractStore.currentPage > 1) {
              SLAContractStore.currentPage = Math.ceil(SLAContractStore.totalItems / 15);
              // this._utilityService.detectChanges(this._cdr);
            }
          }, 500);
          // this.getItems(false, null).subscribe();
          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/sla-and-contracts/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sla_contracts_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (SLAContractStore.orderBy) params += `?order=${SLAContractStore.orderBy}`;
      if (SLAContractStore.orderItem) params += `&order_by=${SLAContractStore.orderItem}`;
      // if (SLAContractStore.searchText) params += `&q=${SLAContractStore.searchText}`;
      if(RightSidebarLayoutStore.filterPageTag == 'sla_contract' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/sla-and-contracts/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('sla_contracts')+".xlsx");
        }
      )
    }

    saveSLAContract(item){
      return this._http.post('/sla-and-contracts', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','sla_contract_added');
          this.getItem(res.id).subscribe();
          return res;
        })
      );
    }

    updateSLAContract(id,item){
      return this._http.put('/sla-and-contracts/'+id, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'sla_contract_updated');
          this.getItem(id).subscribe();
          return res;
        })
      );
    }

    renewDocument(id,item){
      return this._http.put('/sla-and-contracts/'+id +'/renew', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'document_renewed');
          this.getItem(id).subscribe();
          return res;
        })
      );
    }

    ArchieveSlaContract(id){
      return this._http.put('/sla-and-contracts/'+id +'/archive', '').pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'archieve_sla_success_message');
          this.getItem(id).subscribe();
          return res;
        })
      );
    }

    sortSLAContractList(type) {
      if (!SLAContractStore.orderBy) {
        SLAContractStore.orderBy = 'asc';
        SLAContractStore.orderItem = type;
      }
      else {
        if (SLAContractStore.orderItem == type) {
          if (SLAContractStore.orderBy == 'asc') SLAContractStore.orderBy = 'desc';
          else SLAContractStore.orderBy = 'asc'
        }
        else {
          SLAContractStore.orderBy = 'asc';
          SLAContractStore.orderItem = type;
        }
      }
    }
  
    setDocumentImageDetails(imageDetails,url,type?){
      SLAContractStore.setDocumentImageDetails(imageDetails,url);
    }

    getThumbnailPreview(type, token, h?: number, w?: number) {
      switch (type) {
        case 'sla-contract-document': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token;
          break;
      }
    }

    //Download File
  downloadFile(type, id, file_id?, file_name?, individual_file_id?, fileDetails?) {
    var downloadURL = "";
    switch (type) {
      case 'sla-download-document': downloadURL = environment.apiBasePath + '/documents/' + `${id}` + '/files/' + `${file_id}` + '/download';
        break;
    }
    if (downloadURL) {
      if (file_name && fileDetails)
        this.downloadFileByURL(downloadURL, type, fileDetails);
      else
        this.downloadFileByURL(downloadURL, type, file_name);
    }
  }

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
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('download_succesful', fileDetailsObject.position);
        
      }
    }, (error => {
      DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
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

  //Get File Preview 
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'sla-contract-document': previewURL = environment.apiBasePath + '/documents/' + `${id}` + '/files/' + `${file_id}` + '/preview'
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

  endContract(id){
    return this._http.put('/sla-and-contracts/'+id +'/end-contract','').pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'end_contract_success_message');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }
}
