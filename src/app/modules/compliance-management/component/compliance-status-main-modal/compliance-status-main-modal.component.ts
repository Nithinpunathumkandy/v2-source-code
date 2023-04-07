import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ComplianceStatusService } from 'src/app/core/services/masters/compliance-management/compliance-status/compliance-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { ComplianceStatusMasterStore } from 'src/app/stores/masters/compliance-management/compliance-status-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-compliance-status-main-modal',
  templateUrl: './compliance-status-main-modal.component.html',
  styleUrls: ['./compliance-status-main-modal.component.scss']
})
export class ComplianceStatusMainModalComponent implements OnInit {
  @Input('source') complianceStatusObject: any;

  form: FormGroup;
  formErrors: any;
  fileUploadsArray = [];

  AppStore = AppStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  ComplianceStatusMasterStore = ComplianceStatusMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  res_id: any;

  constructor(private _complianceStatusService:ComplianceStatusService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _formBuilder:FormBuilder,
              private _imageService:ImageServiceService,
              private _helperService:HelperServiceService,
              private _complianceRegisterService:ComplianceRegisterService,
              private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
   
    this.form = this._formBuilder.group({
      id: [''],
      compliance_status_id: [null, [Validators.required]],
      comment: [''],

    });
  }
  // ngDoCheck(){
  //   if (this.complianceStatusObject && this.complianceStatusObject.hasOwnProperty('values') && this.complianceStatusObject.values && !this.form.value.id)
  //     this.getComplianceStatus();
  // }

// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();


}

// for closing the modal
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissAddComplianceStatus();
  ComplianceRegisterStore.clearDocumentDetails();
  
}

// for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}
  // getting compliance status
getComplianceStatus() {
  this._complianceStatusService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}
// search compliance status
searchComplianceStatus(e) {
  this._complianceStatusService.searchComplianceStatus('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

createImagePreview(type,token){
  return this._imageService.getThumbnailPreview(type,token)
}
// Returns default image url
getDefaultImage() {
  return this._imageService.getDefaultImageUrl('user-logo');
}

// extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

/**
   * removing document file from the selected list
   * @param token -image token
   */
 removeDocument(token) {
  ComplianceRegisterStore.unsetDocumentDetails(token);
  this.checkForFileUploadsScrollbar();
  this._utilityService.detectChanges(this._cdr);
}

// scrollbar function
checkForFileUploadsScrollbar() {
  // if (ComplianceRegisterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
  //   $(this.uploadArea.nativeElement).mCustomScrollbar();
  // }
  // else {
  //   $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  // }
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
    imageDetails['preview_url'] = logo_url;
    if (imageDetails != null)
      this._complianceRegisterService.setDocumentDetails(imageDetails, type);
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

checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
}

  // Check if logo is being uploaded
checkLogoIsUploading(){
  return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
}

processDataForSave() {
  
  let document = [];
  if(ComplianceRegisterStore.docDetails) document.push(ComplianceRegisterStore.docDetails)
  let saveData = {
    // id: this.form.value.id ? this.form.value.id : '',
    compliance_status_id:this.form.value.compliance_status_id ? this.form.value.compliance_status_id : null,
    comment: this.form.value.comment? this.form.value.comment : '',
    documents: document,
  }

  return saveData;
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;

  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      // save = this._complianceRegisterService.updateItem(this.form.value.id, this.processDataForSave());
    } else {
     
      delete this.form.value.id
      save = this._complianceRegisterService.saveComplianceStatus(ComplianceRegisterStore.complianceRegisterId,this.processDataForSave());
    }

    save.subscribe((res: any) => {
      this.res_id = res.id;// assign id to variable;
      if (!this.form.value.id) {
        ComplianceRegisterStore.clearDocumentDetails();
        this.resetForm();
      }
     
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
     
      if (close){
        this.closeFormModal();
        ComplianceRegisterStore.clearDocumentDetails();
      } 
      
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      } else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}
ngOnDestroy(){
  ComplianceRegisterStore.clearDocumentDetails();
}

}
