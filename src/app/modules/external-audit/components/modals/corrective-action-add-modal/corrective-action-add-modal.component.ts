import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ExternalAuditCorrectiveActionsService } from 'src/app/core/services/external-audit/corrective-actions/external-audit-corrective-actions.service';
import { ExternalAuditCorrectiveActionStore } from 'src/app/stores/external-audit/corrective-actions/corrective-actions-store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-corrective-action-add-modal',
  templateUrl: './corrective-action-add-modal.component.html', 
  styleUrls: ['./corrective-action-add-modal.component.scss']
})
export class CorrectiveActionAddModalComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('source') CaSource: any;

  correctiveActionForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  UsersStore = UsersStore;

  fileUploadsArray = []; // for multiple file uploads

  ExternalAuditCorrectiveActionStore = ExternalAuditCorrectiveActionStore;
  constructor( private _externalAuditCorrectiveActionService: ExternalAuditCorrectiveActionsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
   // form values

   this.correctiveActionForm = this._formBuilder.group({
    id: [""],
    title: ['', [Validators.required]],
    responsible_user_id: [null,[Validators.required]],
    description: [''],
    start_date: ['',[Validators.required]],
    target_date: ['',[Validators.required]],
    documents: []
  })

  // initial form reseting
  this.resetForm();

  // Checking if Source has Values and Setting Form Value

if (this.CaSource.type=='Edit') {
  this.setFormValues(); 
}


  // calling data initially
  this.getResponsibleUsers();
}


ngDoCheck(){
  if (this.CaSource && this.CaSource.hasOwnProperty('values') && this.CaSource.values && !this.correctiveActionForm.value.id)
    this.setFormValues();
}

setFormValues(){

  if (this.CaSource.hasOwnProperty('values') && this.CaSource.values) {
    this.correctiveActionForm.setValue({
      id: this.CaSource.values.id,
      title: this.CaSource.values.title,
      description: this.CaSource.values.description,
      responsible_user_id: this.CaSource.values.responsible_user_id,
      start_date: this.CaSource.values.start_date,
      target_date: this.CaSource.values.target_date,
      documents:''
    })
  }
}


createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}


// getting Responsible user
getResponsibleUsers() {
  this._userService.getAllItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

// serach users
searchUsers(e) {
  this._userService.searchUsers('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}


// formating date

formatStartDate() {

  // converting start date
  if (this.correctiveActionForm.value.start_date) {
    let tempstartdate = this.correctiveActionForm.value.start_date;

    this.correctiveActionForm.value.start_date = this._helperService.processDate(tempstartdate, 'join');
    return this.correctiveActionForm.value.start_date;
  }

}

formatTargetDate() {
  if (this.correctiveActionForm.value.target_date) {
    let tempTargetdate = this.correctiveActionForm.value.target_date;

    this.correctiveActionForm.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
    return this.correctiveActionForm.value.target_date;
  }

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
      this._externalAuditCorrectiveActionService.setDocumentDetails(imageDetails, type);
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
  ExternalAuditCorrectiveActionStore.unsetDocumentDetails(token);
  this.checkForFileUploadsScrollbar();
  this._utilityService.detectChanges(this._cdr);
}

checkForFileUploadsScrollbar() {

  if (ExternalAuditCorrectiveActionStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
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
  this.correctiveActionForm.reset();
  this.correctiveActionForm.pristine;
  this.formErrors = null;
  AppStore.disableLoading();

}



// save function
save(close: boolean = false) {
  this.formErrors = null;
  this.correctiveActionForm.patchValue({
    documents: ExternalAuditCorrectiveActionStore.docDetails,
    start_date: this.formatStartDate(),
    target_date: this.formatTargetDate(),
   
  })
  let save;
  // this.form.value.user_id = UsersStore.user_id;
  AppStore.enableLoading();
  // console.log( this.form.value.kpiing_to);
  if (this.correctiveActionForm.value.id) {
    save = this._externalAuditCorrectiveActionService.UpdateItem(ExternalAuditCorrectiveActionStore.auditFindingId,this.correctiveActionForm.value.id, this.correctiveActionForm.value);
  } else {
  save = this._externalAuditCorrectiveActionService.saveItem(ExternalAuditCorrectiveActionStore.auditFindingId, this.correctiveActionForm.value);
  }
  save.subscribe((res: any) => {
    this._router.navigateByUrl('/external-audit/corrective-action/findings/'+ExternalAuditCorrectiveActionStore.auditFindingId+'/corrective-actions/'+this.correctiveActionForm.value.id);
    this.resetForm();
    ExternalAuditCorrectiveActionStore.clearDocumentDetails();

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
  this._eventEmitterService.dismissActionPlanModal();
  ExternalAuditCorrectiveActionStore.auditFindingId = null;
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}

ngOnDestroy() {

  $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
}

}


