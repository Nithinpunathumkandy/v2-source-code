import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpHeaders, HttpEvent } from '@angular/common/http';
import { map, last } from 'rxjs/operators';

import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  //File Upload -- Not using now
  uploadImage(params,typeParams?:string){
    return this._http.post('/settings/temp/file'+(typeParams ? typeParams : ''),params).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );
  }

  //File Upload with upload progress
  uploadImageWithProgress(params,typeParams?:string){
    //Code to Handle File Upload Progress
    const req = new HttpRequest('POST', '/settings/temp/file'+(typeParams ? typeParams : ''), params, {
      reportProgress: true
    });
    return this._http.request(req).pipe(
      map((res:any)=>{
        return res;
      }),
    );
  }

 
  getPdf(file, name?: any){
    return this._http.post('/settings/export-pdf',{'blob': file},{ responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        if(name){
          this._utilityService.downloadFile(res,`${name}.pdf`);
        }
        else{
          this._utilityService.downloadFile(res,'export.pdf');
        }
        return res;
      })
    );
  }

  //Get temporary file preview
  getPreviewUrl(preview){
    return this._http.get('/settings/temp/file/'+preview,{ responseType: 'blob' });
  }

  //Get Thumbnail Preview according to type and token
    getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'user-kpis': return environment.apiBasePath+ '/human-capital/files/user-kpi-document/thumbnail?token='+token;
          break;
      case 'user-jobs': return environment.apiBasePath+ '/human-capital/files/user-job-document/thumbnail?token='+token;
          break;
      case 'user-certificate': return environment.apiBasePath+ '/human-capital/files/user-certificate/thumbnail?token='+token;
          break;
      case 'user-document': return environment.apiBasePath+ '/human-capital/files/user-document/thumbnail?token='+token;
          break;
      case 'user-profile-picture': return environment.apiBasePath+ '/human-capital/files/user-profile-picture/thumbnail?token='+token;
          break;
      case 'organization-logo': return environment.apiBasePath+ '/organization/files/subsidiary-logo/thumbnail?token='+token+'&h=140&w=200';
          break;
      case 'organization-brochure': return environment.apiBasePath+ '/organization/files/subsidiary-brochure/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'business-profile-logo': return environment.apiBasePath+ '/organization/files/business-profile-logo/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'business-profile-brochure': return environment.apiBasePath+ '/organization/files/business-profile-brochure/thumbnail?token='+token;
          break;
      case 'branch-logo': return environment.apiBasePath+ '/organization/files/branch-logo/thumbnail?token='+token+'&h=140&w=200';
          break;
      case 'project-logo': return environment.apiBasePath+ '/project-management/files/project-logo/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'customer-logo': return environment.apiBasePath+ '/customer-engagement/files/customer-logo/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'product-image': return environment.apiBasePath+ '/organization/files/product-image/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'product-catelogue': return environment.apiBasePath+ '/organization/files/product-catalogue/thumbnail?token='+token+'&h=150&w=200';
          break;
      case 'cover-bg': return environment.apiBasePath+ '/internal-audit/files/audit-report-cover-bg/thumbnail?token='+token;
        break;
        case 'cover-bg-incident': return environment.apiBasePath+ '/incident-management/files/incident-report-page-field-document/thumbnail?token='+token;
        break;

        case 'cover-logo': return environment.apiBasePath+ '/internal-audit/files/audit-report-cover-logo/thumbnail?token='+token;
        break;

        case 'conclusion-bg': return environment.apiBasePath+ '/incident-management/files/incident-report-page-field-document/thumbnail?token='+token;
        break;
        case 'conclusion-bg-report': return environment.apiBasePath+ '/internal-audit/files/audit-report-conclusion-bg/thumbnail?token='+token;
        break;
          
        }
  }

  //Get File Preview 
  getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){
      case 'user-kpi' : previewURL = environment.apiBasePath+'/users/'+`${id}`+'/kpis/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview';
      break;
      case 'user-job' : previewURL = environment.apiBasePath+'/users/'+`${id}`+'/jobs/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview';
        break;
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
  downloadFile(type,id,file_id?,file_name?,individual_file_id?){
    var downloadURL = "";
    switch(type){
      case 'user-kpi-documents' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/kpis/'+`${file_id}`+'/files/'+`${individual_file_id}`+'/download';
        break;
      case 'user-job-documents' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/jobs/'+`${file_id}`+'/files/'+`${individual_file_id}`+'/download';
        break;
      case 'user-download-certificate' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/certificates/'+`${file_id}`+'/download';
        break;
      case 'user-download-all-documents' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/documents/'+`${file_id}`+'/download';
        break;
      case 'user-download-documents' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/documents/'+`${file_id}`+'/files/'+`${individual_file_id}`+'/download';
        break;
      case 'user-document-history' : downloadURL = environment.apiBasePath+'/users/'+`${id}`+'/documents/'+`${file_id}`+'/download?version='+`${individual_file_id}`;
        break;
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
    }
    if(downloadURL){
      this._http.get(downloadURL, { responseType: 'blob' as 'json' }).subscribe(response=>{
        this._utilityService.downloadFile(response,file_name);
      },(error=>{
        if(error.status == 403){
          this._utilityService.showErrorMessage('error','permission_denied');
        }
      })
      )
    }
  }

  /**
   * Return default image according to type
   * Image to display when image token is not available
   */
  getDefaultImageUrl(type){
    switch(type){
      case 'general': return '/assets/images/placeholder.png';
        break;
      case 'user-logo': return '/assets/images/user-demo2.png';
        break;
      case 'client': return '/assets/images/icon-employees.png';
        break;
      case 'no-preview': return '/assets/images/noimage.png';
        break;
      case 'create': return '/assets/images/notification-icon-create.png';
        break;
      case 'delete': return '/assets/images/notification-icon-delete.png';
        break;
      case 'reject': return '/assets/images/notification-icon-reject.png';
        break;
      case 'update': return '/assets/images/notification-icon-update.png';
        break;
      case 'approve': return '/assets/images/notification-icon-approve.png';
        break;
      case 'comment': return '/assets/images/notification-icon-comment.png';
        break;
    }
  }

  //Check for file extension
  checkFileExtensions(ext,extType){
    var imageExtensions = ['jpeg', 'png', 'bmp', 'gif', 'svg', 'jpg'];
    var pdfExtensions = ['pdf'];
    var docExtensions = ['doc','docx'];
    var excelExtension = ['xls','xlsx'];
    var audioExtension = ['mp3','mpeg','ogg','wav'];
    var videoExtension = ['mp4','webm','mov','avi'];
    var pptExtension = ['ppt','pptx'];
    var zipExtenstion = ['zip'];
    if(ext){
      if(extType == 'image'){
        return imageExtensions.indexOf(ext.toLowerCase());
      }
      else if(extType == 'pdf'){
        return pdfExtensions.indexOf(ext.toLowerCase());
      }
      else if(extType == 'excel'){
        return excelExtension.indexOf(ext.toLowerCase());
      }
      else if(extType == 'doc'){
        return docExtensions.indexOf(ext.toLowerCase());
      }
      else if(extType == 'audio'){
        return audioExtension.indexOf(ext.toLowerCase());
      }
      else if(extType == 'video'){
        return videoExtension.indexOf(ext.toLowerCase());
      }
      else if(extType == 'ppt'){
        return pptExtension.indexOf(ext.toLowerCase());
      }
      else if(extType == 'all'){
        var allExtensions = imageExtensions.concat(pdfExtensions,docExtensions,excelExtension,audioExtension,videoExtension,pptExtension);
        return allExtensions.indexOf(ext.toLowerCase());
      }
      else if(extType == 'zip'){
        return zipExtenstion.indexOf(ext.toLowerCase());
      }
      else
        return -1;
    }
    else
      return -1;
  }

  getPath(ext) {
    switch(ext.toLowerCase()) {
      case 'accdb' : return "/assets/images/accdb.svg";
        break;
      case 'jpg' : return "/assets/images/jpg.svg";
        break;
      case 'jpeg' : return "/assets/images/jpg.svg";
        break;
      case 'png' : return "/assets/images/png.svg";
        break;
      case 'bmp' : return "/assets/images/bmp.svg";
        break;
      case 'gif' : return "/assets/images/giff.svg";
        break;
      case 'svg' : return "/assets/images/svg.svg";
        break;
      case 'pdf' : return "/assets/images/pdf.svg";
        break;
      case 'doc' : return "/assets/images/doc.svg";
        break;
      case 'docx' : return "/assets/images/docx.svg";
        break;
      case 'xls' : return "/assets/images/xls.svg";
        break;
      case 'xlsx' : return "/assets/images/xls.svg";
        break;
      case 'mp3' : return "/assets/images/mp3.svg";
        break;
      case 'mpeg' : return "/assets/images/mpeg.svg";
        break;
      case 'ogg' : return "/assets/images/ogg.svg";
        break;
      case 'wav' : return "/assets/images/wav.svg";
        break;
      case 'mp4' : return "/assets/images/mp4.svg";
        break;
      case 'webm' : return "/assets/images/webm.svg";
        break;
      case 'mov' : return "/assets/images/mov.svg";
        break;
      case 'avi' : return "/assets/images/avi.svg";
        break;
      case 'ppt' : return "/assets/images/ppt.svg";
        break;
      case 'pptx' : return "/assets/images/ppt.svg";
        break;
      case 'zip' : return "/assets/images/zip.svg";
        break;
      case 'dill' : return "/assets/images/dill.svg";
        break;
      case 'pub' : return "/assets/images/pub.svg";
        break;
      case 'rar' : return "/assets/images/rar.svg";
        break;
      case 'txt' : return "/assets/images/txt.svg";
        break;
    }
  }

  // getPreview(url){
  //   return this.getPreviewUrl(url).subscribe(prew=>{
  //     let reader = new FileReader();
  //     reader.addEventListener("load", () => {
  //       return reader.result;
  //     }, false);
  //     if (prew) {
  //       reader.readAsDataURL(prew);
  //     }
  //   })
  // }

  /**
   * Validate file type upon selection
   * Returns true, other wise shows error message
   */
  validateFile(file,type){
    // var allowedBrochureTypes = ['jpeg', 'png', 'bmp', 'gif', 'svg', 'jpg', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'pptx','ppt','mp4','mp3','zip','avi','mov','ogg','wmv','webm','wav'];
    // var allowedImageExtensions = ['jpeg', 'png', 'bmp', 'gif', 'svg', 'jpg'];
    var allowedBrochureTypes = OrganizationGeneralSettingsStore.organizationSettings.support_file_allowed_types;
    var allowedImageExtensions = OrganizationGeneralSettingsStore.organizationSettings.logo_allowed_types;
    var fileExtension = file.name.split('.').pop();
    if(type == 'brochure'){
      if(allowedBrochureTypes.indexOf(fileExtension.toUpperCase()) != -1){
        if(this.checkFileUploadSize(file.size,type)){
          return true;
        }
        else{
          this._utilityService.showErrorMessage('file_size_exceeded', 'Maximum file size is '+(OrganizationGeneralSettingsStore.organizationSettings.max_support_file_upload_size/1000)+' MB');
          return false;
        }
      }
      else{
        this._utilityService.showErrorMessage('file_format',fileExtension+' files not supported.'+' Supported file types for brochures are '+allowedBrochureTypes.toString());
        return false;
      }
    }
    else if(type == 'logo'){
      if(allowedImageExtensions.indexOf(fileExtension.toUpperCase()) != -1){
        if(this.checkFileUploadSize(file.size,type)){
          return true;
        }
        else{
          this._utilityService.showErrorMessage('file_size_exceeded', 'Maximum file size is '+(OrganizationGeneralSettingsStore.organizationSettings.max_logo_upload_size/1000)+' MB');
          return false;
        }
      }
      else{
        this._utilityService.showErrorMessage('file_format',fileExtension+' files not supported.'+' Supported file types for logo is '+allowedImageExtensions.toString());
        return false;
      }
    }
    else if(type == 'support-file'){
      if(allowedBrochureTypes.indexOf(fileExtension.toUpperCase()) != -1){
        if(this.checkFileUploadSize(file.size,type)){
          return true;
        }
        else{
          this._utilityService.showErrorMessage('file_size_exceeded', 'Maximum file size is '+(OrganizationGeneralSettingsStore.organizationSettings.max_support_file_upload_size/1000)+' MB');
          return false;
        }
      }
      else{
        this._utilityService.showErrorMessage('file_format',fileExtension+' files not supported.'+' Supported File types are '+allowedBrochureTypes.toString());
        return false;
      }
    }
  }

  checkImportFileValidation(file){
    var allowedFileExtensions = ['xls','xlsx'];
    var fileExtension = file.name.split('.').pop();
    if(allowedFileExtensions.indexOf(fileExtension.toLowerCase()) != -1){
      return true;
    }
    else{
      this._utilityService.showErrorMessage('file_format',fileExtension+' files not supported.'+' Supported File types are '+allowedFileExtensions.toString());
      return false;
    }
  }

  checkFileUploadSize(size,type){
    var allowedSupportFileSize = OrganizationGeneralSettingsStore.organizationSettings.max_support_file_upload_size;
    var allowedLogoFileSize = OrganizationGeneralSettingsStore.organizationSettings.max_logo_upload_size;
    let kbSize = size/1000;
    if(type == 'logo'){
      if(kbSize > allowedLogoFileSize){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      if(kbSize > allowedSupportFileSize){
        return false;
      }
      else{
        return true;
      }
    }
  }

  getAcceptFileTypes(type: string){
    var acceptFileTypesString = "";
    if (type == 'logo') {
      if (OrganizationGeneralSettingsStore.organizationSettings?.support_file_allowed_types) {
        
      for(let i of OrganizationGeneralSettingsStore.organizationSettings.logo_allowed_types){
        switch(i){
          case 'PNG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/png';
                      else acceptFileTypesString = acceptFileTypesString+', image/png';
                    break;
          case 'GIF': if(acceptFileTypesString == '') acceptFileTypesString = 'image/gif';
                    else acceptFileTypesString = acceptFileTypesString+', image/gif';
                    break;
          case 'JPEG' || 'JPG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/jpeg';
                    else acceptFileTypesString = acceptFileTypesString+', image/jpeg';
                    break;
          case 'BMP': if(acceptFileTypesString == '') acceptFileTypesString = 'image/bmp';
                    else acceptFileTypesString = acceptFileTypesString+', image/bmp';
                    break;
          case 'SVG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/svg+xml';
                    else acceptFileTypesString = acceptFileTypesString+', image/svg+xml';
                    break;
        }
      }
      }
    }
    else {
      if (OrganizationGeneralSettingsStore.organizationSettings?.support_file_allowed_types) {
      
      for(let i of OrganizationGeneralSettingsStore.organizationSettings.support_file_allowed_types){
        switch(i){
          case 'PNG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/png';
                      else acceptFileTypesString = acceptFileTypesString+',image/png';
                    break;
          case 'GIF': if(acceptFileTypesString == '') acceptFileTypesString = 'image/gif';
                    else acceptFileTypesString = acceptFileTypesString+',image/gif';
                    break;
          case 'JPEG' || 'JPG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/jpeg';
                    else acceptFileTypesString = acceptFileTypesString+',image/jpeg';
                    break;
          case 'BMP': if(acceptFileTypesString == '') acceptFileTypesString = 'image/bmp';
                    else acceptFileTypesString = acceptFileTypesString+',image/bmp';
                    break;
          case 'SVG': if(acceptFileTypesString == '') acceptFileTypesString = 'image/svg+xml';
                    else acceptFileTypesString = acceptFileTypesString+',image/svg+xml';
                    break;
          case 'PDF': if(acceptFileTypesString == '') acceptFileTypesString = 'application/pdf';
                    else acceptFileTypesString = acceptFileTypesString+',application/pdf';
                    break;
          case 'XLSX': if(acceptFileTypesString == '') acceptFileTypesString = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    else acceptFileTypesString = acceptFileTypesString+',application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    break;
          case 'XLS': if(acceptFileTypesString == '') acceptFileTypesString = 'application/vnd.ms-excel';
                    else acceptFileTypesString = acceptFileTypesString+',application/vnd.ms-excel';
                    break;
          case 'DOCX': if(acceptFileTypesString == '') acceptFileTypesString = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    else acceptFileTypesString = acceptFileTypesString+',application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
          case 'DOC': if(acceptFileTypesString == '') acceptFileTypesString = 'application/msword';
                    else acceptFileTypesString = acceptFileTypesString+',application/msword';
                    break;
          case 'PPTX': if(acceptFileTypesString == '') acceptFileTypesString = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                    else acceptFileTypesString = acceptFileTypesString+',application/vnd.openxmlformats-officedocument.presentationml.presentation';
                    break;
          case 'PPT': if(acceptFileTypesString == '') acceptFileTypesString = 'application/vnd.ms-powerpoint';
                    else acceptFileTypesString = acceptFileTypesString+',application/vnd.ms-powerpoint';
                    break;
          case 'MP3': if(acceptFileTypesString == '') acceptFileTypesString = 'audio/mpeg';
                    else acceptFileTypesString = acceptFileTypesString+',audio/mpeg';
                    break;
          case 'MP4': if(acceptFileTypesString == '') acceptFileTypesString = 'video/mp4';
                    else acceptFileTypesString = acceptFileTypesString+',video/mp4';
                    break;
          case 'AVI': if(acceptFileTypesString == '') acceptFileTypesString = 'video/x-msvideo';
                    else acceptFileTypesString = acceptFileTypesString+',video/x-msvideo';
                    break;
          case 'MOV': if(acceptFileTypesString == '') acceptFileTypesString = 'video/quicktime';
                    else acceptFileTypesString = acceptFileTypesString+',video/quicktime';
                    break;
          case 'ZIP': if(acceptFileTypesString == '') acceptFileTypesString = 'application/zip';
                    else acceptFileTypesString = acceptFileTypesString+',application/zip';
                    break;
        }
        }
      }
    }
    return acceptFileTypesString;
  }

  /**
   * Function to get file download progress
   * Under development
   */
  downloadFileByURL(fileSrc,type){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Accept' : '*/*',
      'Content-Type': type,
      'Cache-Control': 'no-cache'
    });
    const options = {
      headers: headers,
      reportProgress: true
    };
    const req = new HttpRequest('GET', fileSrc, options, { responseType: 'blob' });
    this._http.request(req).subscribe((event: HttpEvent<any>) => {
      this.getEventMessage2(event);
    })
  }

  getEventMessage2(event: HttpEvent<any>) {
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
  }

}
