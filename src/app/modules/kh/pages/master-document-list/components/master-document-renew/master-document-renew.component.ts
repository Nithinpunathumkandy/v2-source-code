import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-master-document-renew',
  templateUrl: './master-document-renew.component.html',
  styleUrls: ['./master-document-renew.component.scss']
})


export class MasterDocumentRenewComponent implements OnInit {

  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  fileUploadPopupStore=fileUploadPopupStore;
  MasterListDocumentStore=MasterListDocumentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore=AppStore;
  commentText:any;
  fileUploadPopupSubscriptionEvent:any;

  fileUploadsArray = []; 

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _mdlService:MdlService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

  }

   // Document Upload Common Codes
   openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = true;
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = false;
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  deleteDocuments(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    this._utilityService.detectChanges(this._cdr);
  }


  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  
  
onFileChange(event, type: string) {
  var selectedFiles: any[] = event.target.files;
  if (selectedFiles.length > 0) {
    var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
    Array.prototype.forEach.call(temporaryFiles, elem => {
      const file = elem;
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                $("#file").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                }, (error) => {
                  $("#file").val('');
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null, file, true);
            $("#file").val('');
            this._utilityService.detectChanges(this._cdr);
          })
      }
      else {
        $("#file").val('');
        this.assignFileUploadProgress(null, file, true);
      }
    });
  }
}

 // imageblob function
 createImageFromBlob(image: Blob, imageDetails, type) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    var logo_url = reader.result;
    imageDetails['preview_url'] = logo_url;
    if (imageDetails != null)
      this._mdlService.setDocument(imageDetails, type);
    this._utilityService.detectChanges(this._cdr);
  }, false);
  if (image) {
    reader.readAsDataURL(image);
  }
}

 /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }
  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
}

  // Check if logo is being uploaded
checkLogoIsUploading(){
  return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
}

getArrayFormatedString(items){
  return this._helperService.getArraySeperatedString(',','title',items);
}

removeDocument(token) {

  MasterListDocumentStore.unsetDocument(token);
  this._utilityService.detectChanges(this._cdr);
}

validationCheck(){

  if(MasterListDocumentStore.docDetails || this.commentText)
  return false
  else
  return true;
}


  saveFiles(close:boolean=false){

    // if (fileUploadPopupStore.displayFiles.length>0) {

      // this.createCheckinFile()
      
      let save
      AppStore.enableLoading();
      let postParams;
      
      postParams={
        ...MasterListDocumentStore.docDetails,
        comment:this.commentText
      }
      save =this._mdlService.reviewDocument(MasterListDocumentStore.documentId,postParams)
  
      save.subscribe(res => {

        this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          // this.checkinFormErrors = err.error.errors

          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    // }
  }

  resetForm() {
    MasterListDocumentStore.clearDocument();
    this.commentText=null;
    // documentWorkFlowStore.clearCheckinFile();
    // this.checkinFileArray = [];
    // this.checkinForm.reset();
    // this.checkinForm.pristine;
    // this.checkinFormErrors = null;
  }


  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissDocumentRenewModal()
  }

  ngOnDestroy(){
    this.commentText=null;
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    MasterListDocumentStore.clearDocument();
  }

}
