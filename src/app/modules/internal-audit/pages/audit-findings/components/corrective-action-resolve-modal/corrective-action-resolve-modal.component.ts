import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { CorrectiveActionsStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { Router } from '@angular/router';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { CorrectiveActionService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action/corrective-action.service';
import { CorrectiveActionsResolveStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';


declare var $: any;
@Component({
  selector: 'app-corrective-action-resolve-modal',
  templateUrl: './corrective-action-resolve-modal.component.html',
  styleUrls: ['./corrective-action-resolve-modal.component.scss']
})
export class CorrectiveActionResolveModalComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('source') CaReslveSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  
  CorrectiveActionsStore = CorrectiveActionsStore;
  AuditFindingsStore = AuditFindingsStore;
  correctiveActionResolveForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  CorrectiveActionsResolveStore = CorrectiveActionsResolveStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore=fileUploadPopupStore;
  fileUploadsArray = []; // for multiple file uploads

  fileUploadPopupSubscriptionEvent:any=null;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _correctiveActionService: CorrectiveActionService,
    private _nonConformityCAService:FindingCorrectiveActionService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _renderer2: Renderer2,

    ) { }

  ngOnInit(): void {
    // form values

    this.correctiveActionResolveForm = this._formBuilder.group({
      percentage: ['', [Validators.required,Validators.maxLength(100), Validators.min(0)]],
      finding_corrective_action_status_id: [null,''],
      comment: [''],
      documents: []
    })

    // initial form reseting
    this.resetForm();

    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })


   
  }

  get myForm() {
    return this.correctiveActionResolveForm.controls;
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  


  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // file change function

  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
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
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
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

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._correctiveActionService.setResolveDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
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



  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  /**
  * removing document file from the selected list
  * @param token -image token
  */
  removeDocument(token) {
    CorrectiveActionsResolveStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForFileUploadsScrollbar() {

    if (CorrectiveActionsResolveStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  // for resetting the form
  resetForm() {
    // resetting respective form values to the null state for keeping findings id 
    this.correctiveActionResolveForm.reset();
    this.correctiveActionResolveForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
 
  }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    this.correctiveActionResolveForm.patchValue({
      documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
    })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.kpiing_to);
   if(!this.CaReslveSource?.hasOwnProperty('module')){
    save = this._correctiveActionService.markAsResolved(this.CaReslveSource.values.ca_id, this.correctiveActionResolveForm.value);
   }else{
    save = this._nonConformityCAService.markAsResolved(this.CaReslveSource.values.ca_id, this.correctiveActionResolveForm.value);

   }
    save.subscribe((res: any) => {
      CorrectiveActionsStore.new_ca_id = this.CaReslveSource.values.ca_id;
      this.resetForm();
      CorrectiveActionsResolveStore.clearDocumentDetails();

      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });

  }
  

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissCaResolveModalControlModal();

  }

   
 // *Common  File Upload/Attach Modal Functions Starts Here

 openFileUploadModal() {
  setTimeout(() => {
    fileUploadPopupStore.openPopup = true;
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
    setTimeout(() => {
      this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }, 250);
}
closeFileUploadModal() {
  setTimeout(() => {
    fileUploadPopupStore.openPopup = false;
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();
    setTimeout(() => {
      this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }, 100);
}

createImageUrl(type, token) {
  if(type=='document-version')
  return this._documentFileService.getThumbnailPreview(type, token);
  // else
  // return this._organizationFileService.getThumbnailPreview(type,token);
  
}
enableScrollbar() {
  if (fileUploadPopupStore.displayFiles.length >= 2) {
    $(this.uploadArea?.nativeElement).mCustomScrollbar();
  }
  else {
    $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
  }
}

  // *Common  File Upload/Attach Modal Functions Ends Here

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    // $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

}

