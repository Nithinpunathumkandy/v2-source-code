import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-focus-area-modal',
  templateUrl: './focus-area-modal.component.html',
  styleUrls: ['./focus-area-modal.component.scss']
})
export class FocusAreaModalComponent implements OnInit {
  @Input('source') FocusAreaTypeSource: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  fileUploadsArray = [];
  OrganizationGeneralSettingsStore  = OrganizationGeneralSettingsStore

  FocusAreaMasterStore = FocusAreaMasterStore
  constructor(private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _focusArea:FocusAreaService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],

    });

    // this.resetForm();

    if (this.FocusAreaTypeSource) {
      this.setFormValues();
    }
  }
  ngDoCheck(){
    if (this.FocusAreaTypeSource && this.FocusAreaTypeSource.hasOwnProperty('values') && this.FocusAreaTypeSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.FocusAreaTypeSource.hasOwnProperty('values') && this.FocusAreaTypeSource.values) {
      let { id, title, description, image_url, image_ext, image_size, image_title, image_token } = this.FocusAreaTypeSource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description,
     

      })
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

      // Returns image url according to type and token
      createImageUrl(type, token) {
         return this._focusArea.getThumbnailPreview(type, token);
      }

   /**
     * removing document file from the selected list
     * @param token -image token
     */
    removeDocument(token) {
      FocusAreaMasterStore.unsetDocumentDetails(token);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }
    // file change function
  
    onFileChange(event, type: string) {
      var selectedFiles: any[] = event.target.files;
      if (selectedFiles.length > 0) {
        var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        // this.checkForFileUploadsScrollbar();
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
                    $("#file").val('');
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
         FocusAreaMasterStore.clearDocumentDetails()
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          var logo_url = reader.result;
    
          imageDetails['preview'] = logo_url;
          if (imageDetails != null)
            this._focusArea.setDocumentDetails(imageDetails, type);
          // this.checkForFileUploadsScrollbar();
          this._utilityService.detectChanges(this._cdr);
        }, false);
    
        if (image) {
          reader.readAsDataURL(image);
        }
      }
  

    checkAcceptFileTypes(type){
      return this._imageService.getAcceptFileTypes(type); 
    }
  
     // extension check function
     checkExtension(ext, extType) {
  
      return this._imageService.checkFileExtensions(ext, extType)
  
    }

    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }
  
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
   // for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  FocusAreaMasterStore.clearDocumentDetails()
  AppStore.disableLoading();
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}

// for closing the modal
closeFormModal() {
  this.resetForm();
 this._eventEmitterService.dismissFocusAreaModalControl();
}

imageData(){
  let data = {
    url: FocusAreaMasterStore.docDetails ? FocusAreaMasterStore.docDetails.url :null,
    name : FocusAreaMasterStore.docDetails  ? FocusAreaMasterStore.docDetails.name : null,
    size : FocusAreaMasterStore.docDetails ?  FocusAreaMasterStore.docDetails.size : null,
    ext : FocusAreaMasterStore.docDetails ? FocusAreaMasterStore.docDetails.ext :  null,

  }
  return data
}

processDataSave(){
  let saveData = {
       title: this.form.value.title,
      description: this.form.value.description ? this.form.value.description : '' ,
      image : this.imageData()
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
      save = this._focusArea.updateItem(this.form.value.id,this.processDataSave());
    } else {
      delete this.form.value.id
      save = this._focusArea.saveItem( this.processDataSave());
    }

    save.subscribe((res: any) => {
      if(!this.form.value.id){
      this.resetForm();
      FocusAreaMasterStore.clearDocumentDetails();
    }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });
  }
}


@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}
