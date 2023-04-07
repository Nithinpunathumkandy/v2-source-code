import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map, last } from 'rxjs/operators';

import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";
import { DownloadFileDetails } from 'src/app/core/models/general/download-file.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationfileService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'user-certificate': return environment.apiBasePath+ '/human-capital/files/user-certificate/thumbnail?token='+token;
          break;
      case 'user-document': return environment.apiBasePath+ '/human-capital/files/user-document/thumbnail?token='+token;
          break;
      case 'user-profile-picture': return environment.apiBasePath+ '/human-capital/files/user-profile-picture/thumbnail?token='+token;
          break;
      case 'organization-logo': return environment.apiBasePath+ '/organization/files/subsidiary-logo/thumbnail?token='+token+'&h='+(h ? h : '')+'&w='+(w ? w : '');
          break;
      case 'organization-brochure': return environment.apiBasePath+ '/organization/files/subsidiary-brochure/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'business-profile-logo': return environment.apiBasePath+ '/organization/files/business-profile-logo/thumbnail?token='+token+'&h='+(h ? h : '')+'&w='+(w ? w : '');
          break;
      case 'business-profile-brochure': return environment.apiBasePath+ '/organization/files/business-profile-brochure/thumbnail?token='+token;
          break;
      case 'branch-logo': return environment.apiBasePath+ '/organization/files/branch-logo/thumbnail?token='+token+'&h='+(h ? h : '')+'&w='+(w ? w : '');
          break;
      case 'project-logo': return environment.apiBasePath+ '/project-management/files/project-logo/thumbnail?token='+token+'&h='+(h ? h : '')+'&w='+(w ? w : '');
          break;
      case 'customer-logo': return environment.apiBasePath+ '/customer-engagement/files/customer-logo/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'product-image': return environment.apiBasePath+ '/organization/files/product-image/thumbnail?token='+token+'&h='+(h ? h : '')+'&w='+(w ? w : '');
          break;
      case 'product-catelogue': return environment.apiBasePath+ '/organization/files/product-catalogue/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'organization-chart': return environment.apiBasePath+ '/organization/files/organization-chart/thumbnail?token='+token;
          break;
      case 'organization-policy-document': return environment.apiBasePath+ '/organization/files/organization-policy-document/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'supplier-logo': return environment.apiBasePath+ '/master/files/bpm-suppliers/thumbnail?token='+token+'&h=150&w=200';
          break;
    }
    // +'&h=140&w=200'
    // +'&h=140&w=200'
    // +'&h='+(h ? h : '150')+'&w='+(w ? w : 200)
  }

  //Get File Preview 
  getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){
      case 'user-certificate' : previewURL = environment.apiBasePath+'/users/'+`${id}`+'/certificates/'+`${file_id}`+'/preview'
        break;
      case 'documents-preview' : previewURL = environment.apiBasePath+'/users/'+`${id}`+'/documents/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview';
        break;
      case 'products-preview' : previewURL = environment.apiBasePath+'/products/'+`${id}`+'/files/'+`${file_id}`+'/preview';
        break;
      case 'profile-preview' : previewURL = environment.apiBasePath+'/business-profiles/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'subsidiary-preview' : previewURL = environment.apiBasePath+'/subsidiaries/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'policy-preview' : previewURL = environment.apiBasePath+'/organization-policies/'+`${id}`+'/files/'+`${file_id}`+'/preview'
        break;
      case 'organization-chart' : previewURL = environment.apiBasePath+'/organization-charts/'+`${id}`+'/preview'
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
  downloadFile(type,id,file_id?,file_name?,fileDetails?){
    var downloadURL = "";
    switch(type){
      // case 'user-download-certificate' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/certificates/'+`${file_id}`+'/download';
      //   break;
      // case 'user-download-documents' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/documents/'+`${file_id}`+'/download';
      //   break;
      case 'products-download-file' : downloadURL = environment.apiBasePath+'/products/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
      case 'profile-download-file' : downloadURL = environment.apiBasePath+'/business-profiles/'+`${id}`+'/files/'+`${file_id}`+'/download'
        break;
      case 'subsidiary-download-file' : downloadURL = environment.apiBasePath+'/subsidiaries/'+`${id}`+'/files/'+`${file_id}`+'/download'
        break;
      case 'products-download-all' : downloadURL = environment.apiBasePath+'/products/'+`${id}`+'/download';
        break;
      case 'profile-download-all' : downloadURL = environment.apiBasePath+'/business-profiles/'+`${id}`+'/download'
        break;
      case 'subsidiary-download-all' : downloadURL = environment.apiBasePath+'/subsidiaries/'+`${id}`+'/download'
        break;
      case 'organization-policies' : downloadURL = environment.apiBasePath+'/organization-policies/'+`${id}`+'/files/'+`${file_id}`+'/download'
        break;
      // case 'organization-policies-all' : downloadURL = environment.apiBasePath+'/organization-policies/'+`${id}`+'/download'
      //   break;
      case 'profile-export' : downloadURL = environment.apiBasePath+'/business-profiles/export'
        break;
      case 'profile-template' : downloadURL = environment.apiBasePath+'/business-profiles/template'
        break;
      case 'policy-export': downloadURL = environment.apiBasePath+'/organization-policies/export';
        break;
      case 'policy-template': downloadURL = environment.apiBasePath+'/organization-policies/template';
        break;
      case 'subsidiary-export': downloadURL = environment.apiBasePath+'/subsidiaries/export';
        break;
      case 'subsidiary-template': downloadURL = environment.apiBasePath+'/subsidiaries/template';
        break;
      case 'products-export': downloadURL = environment.apiBasePath+'/products/export';
        break;
      case 'products-template': downloadURL = environment.apiBasePath+'/products/template';
        break;
      case 'customers-export': downloadURL = environment.apiBasePath+'/customers/export';
        break;
      case 'customers-template': downloadURL = environment.apiBasePath+'/customers/template';
        break;
      case 'mstype-export': downloadURL = environment.apiBasePath+'/ms-type-organizations/export';
        break;
      case 'mstype-template': downloadURL = environment.apiBasePath+'/ms-type-organizations/template';
        break;
      case 'projects-export': downloadURL = environment.apiBasePath+'/projects/export';
        break;
      case 'projects-template': downloadURL = environment.apiBasePath+'/projects/template';
        break;
      case 'services-export': downloadURL = environment.apiBasePath+'/services/export';
        break;
      case 'services-template': downloadURL = environment.apiBasePath+'/services/template';
        break;
      case 'branches-export': downloadURL = environment.apiBasePath+'/branches/export';
        break;
      case 'branches-template': downloadURL = environment.apiBasePath+'/branches/template';
        break;
      case 'external-export': downloadURL = environment.apiBasePath+'/external-issues/export';
        break;
      case 'external-template': downloadURL = environment.apiBasePath+'/external-issues/template';
        break;
      case 'internal-export': downloadURL = environment.apiBasePath+'/internal-issues/export';
        break;
      case 'internal-template': downloadURL = environment.apiBasePath+'/internal-issues/template';
        break;
      case 'issues-export': downloadURL = environment.apiBasePath+'/organization-issues/export';
        break;
      case 'issues-template': downloadURL = environment.apiBasePath+'/organization-issues/template';
        break;
      case 'pestel-export': downloadURL = environment.apiBasePath+'/pestel/export';
        break;
      case 'pestel-template': downloadURL = environment.apiBasePath+'/pestel/template';
        break;
      case 'swot-export': downloadURL = environment.apiBasePath+'/swot/export';
        break;
      case 'swot-template': downloadURL = environment.apiBasePath+'/swot/template';
        break;
      case 'stakeholder-export': downloadURL = environment.apiBasePath+'/stakeholders/export';
        break;
      case 'stakeholder-template': downloadURL = environment.apiBasePath+'/stakeholders/template';
        break;
      case 'organization-chart-download': downloadURL = environment.apiBasePath+'/organization-charts/'+id+'/download';
        break;
      case 'ms-type-organization-document' : downloadURL = environment.apiBasePath+'/ms-type-organizations/'+`${id}`+'/files/'+`${file_id}`+'/download';
        break;
    }
    if(downloadURL){
      /*this._http.get(downloadURL, { responseType: 'blob' as 'json' }).subscribe(response=>{
        this._utilityService.downloadFile(response,file_name);
      },(error=>{
        if(error.status == 403){
          this._utilityService.showErrorMessage('Error','Permission Denied');
        }
      })
      )*/
      if(file_name && fileDetails)
        this.downloadFileByURL(downloadURL,type,fileDetails);
      else
        this.downloadFileByURL(downloadURL,type,file_name);
    }
  }

  download(fileSrc,type = 'blob',fileDetails?){
    const req = new HttpRequest('GET', fileSrc,{
      reportProgress: true,
      responseType: type
    });
    return this._http.request(req).pipe(
      map((res:HttpEvent<any>)=>{
        return res;
      }),
    );
  }

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
    if(fileDetails && (typeof fileDetails !== 'string')){
      fileDetailsObject.fileExtension = fileDetails.ext;
      fileDetailsObject.fileName = fileDetails.title;
      fileDetailsObject.fileSize = fileDetails.size;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    else{
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = fileDetails+'.zip';
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
          this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : fileDetailsObject.fileName);
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
    /*else{
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = 'allfiles.zip';
      fileDetailsObject.fileSize = null;
      fileDetailsObject.downloadProgress = 0;
      DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
      this._http.get(fileSrc, { responseType: 'blob' as 'json' })
      .subscribe(response=>{
        this._utilityService.downloadFile(response,fileDetails?.title ? fileDetails.title : 'allfiles.zip');
      },(error=>{
        if(error.status == 403){
          this._utilityService.showErrorMessage('Error','Permission Denied');
        }
      }));
    }*/
  // }

  /*getEventMessage2(event: HttpEvent<any>) {
    console.log('event is', event);
    switch (event.type) {
      case HttpEventType.Sent:
        return `sending request`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File is ${percentDone} uploaded.`;

      case HttpEventType.Response:
        return `File was completely uploaded!`;

      case HttpEventType.DownloadProgress:
        console.log(event);
        return `File is downloading`;

      case HttpEventType.ResponseHeader:
        return `Response headers are received`

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }*/
}
