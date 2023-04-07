import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/core/services/masters/human-capital/job/job.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse, HttpEventType, HttpEvent, HttpClient } from '@angular/common/http';
import { JobMasterStore } from 'src/app/stores/masters/human-capital/job-master.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-user-jd-modal',
  templateUrl: './user-jd-modal.component.html',
  styleUrls: ['./user-jd-modal.component.scss']
})
export class UserJdModalComponent implements OnInit , OnDestroy {
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @Input('source') UserJdSource: any;

  JobMasterStore = JobMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  fileUploadProgress = 0;

  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      
      '|',
      'bold',
      'italic',
     
      '|',
      'link',
      'imageUpload',
      '|',
      
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
     
    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };

  
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  public Editor;
  public Config;
  constructor(private _jobService: JobService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {

    console.log(OrganizationGeneralSettingsStore.organizationSettings?.support_file_allowed_types.toString(),'file');

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    // form fields
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      documents: ['']
    });


    // setTimeout(() => {
     
    //   $(this.uploadArea.nativeElement).mCustomScrollbar();

    // }, 1000);
    // initial form reseting
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.UserJdSource) {
      this.setFormValues();
    }

  }

  checkForFileUploadsScrollbar() {
    if (JobMasterStore.docDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  ngDoCheck(){
    if (this.UserJdSource && this.UserJdSource.hasOwnProperty('values') && this.UserJdSource.values && !this.form.value.id)
      this.setFormValues();    
  }

  setFormValues(){
    if (this.UserJdSource.hasOwnProperty('values') && this.UserJdSource.values) {
      this.form.setValue({
        id: this.UserJdSource.values.id,
        description: this.UserJdSource.values.description,
        title: this.UserJdSource.values.title,
        documents: ''
      })
      this.checkForFileUploadsScrollbar();
    }
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: JobMasterStore.docDetails
    })


    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.jobing_to);
    if (this.form.value.id) {
      save = this._jobService.updateItem(this.form.value.id, this.form.value);
    } else {
      let saveData = {
        title: this.form.value.title ? this.form.value.title : '',
        job_frequency_id: this.form.value.job_frequency_id ? this.form.value.job_frequency_id : '',
        description: this.form.value.description ? this.form.value.description : '',
        documents: this.form.value.documents ? this.form.value.documents : ''
      }
      save = this._jobService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
        this.JobMasterStore.clearDocumentDetails();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this.form.reset();

      if (close) {
        this.closeFormModal();

      }
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

  descriptionValueChange(event){
    this._utilityService.detectChanges(this._cdr);
  }


  onFileChange(event,type:string){
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded){
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress,file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
                },(error)=>{
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }
  }

  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._jobService.setDocumentDetails(imageDetails, logo_url);
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

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType);
  }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    JobMasterStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  createImageUrl(type, token) {

    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
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
    this.fileUploadsArray = [];
    this._eventEmitterService.dismissHumanCapitalUserJdControlModal();

  }
  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  ngOnDestroy(){
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.closeFormModal();

    }

  }

  
//getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
