import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';

import { ReportMasterStore } from 'src/app/stores/masters/human-capital/report-master.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from 'src/app/core/services/masters/human-capital/report/report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse, HttpEventType, HttpEvent, HttpClient } from '@angular/common/http';
import { ReportFrequencyService } from 'src/app/core/services/masters/human-capital/report-frequency/report-frequency.service';
import { ReportFrequencyMasterStore } from 'src/app/stores/masters/human-capital/report-frequency-store';
import { DomSanitizer } from '@angular/platform-browser';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-user-report-modal',
  templateUrl: './user-report-modal.component.html',
  styleUrls: ['./user-report-modal.component.scss']
})
export class UserReportModalComponent implements OnInit ,OnDestroy {
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @Input('source') UserReportSource: any;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  AppStore = AppStore;
  ReportMasterStore = ReportMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  form: FormGroup;
  formErrors: any;
  
  ReportFrequencyMasterStore = ReportFrequencyMasterStore;
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
  public Editor;
  public Config;

  fileUploadsArray: any = []; // Display Mutitle File Loaders

  constructor(private _reportService: ReportService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _reportFrequencyService:ReportFrequencyService,
    private _sanitizer:DomSanitizer,
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

    // form fields

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],
    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.form = this._formBuilder.group({
      id: [''],
      report_frequency_id: [null, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      documents: ['']
    });

     // initial form reseting
     this.resetForm();

    // setTimeout(() => {
     
    //   // $(this.uploadArea.nativeElement).mCustomScrollbar();
    //   this.checkForFileUploadsScrollbar();

    // }, 1000);

    // getting refquencies
    this._reportFrequencyService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });


    // Checking if Source has Values and Setting Form Value

    if (this.UserReportSource) {
      this.setFormValues();
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
    if (this.UserReportSource && this.UserReportSource.hasOwnProperty('values') && this.UserReportSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.UserReportSource.hasOwnProperty('values') && this.UserReportSource.values) {
      this.form.setValue({
        id: this.UserReportSource.values.id,
        description: this.UserReportSource.values.description,
        title: this.UserReportSource.values.title,
        report_frequency_id: this.UserReportSource.values.report_frequency_id,
        documents: this.UserReportSource.values.documents
      })
      this.checkForFileUploadsScrollbar();
    }
  }

  viewDocument(document) {
    console.log(document);
    if(document.id){
      this._humanCapitalService.getFilePreview('user-report', ReportMasterStore.individualReportDetails.created_by.id, document.id, document.user_report_id).subscribe(res => {
        var resp: any = this._utilityService.getDownLoadLink(res, document.title);
        this.openPreviewModal(resp, document);
      }), (error => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage('Error', 'Permission Denied');
        }
        else {
          this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
        }
      });
    }

  }

  
  downloadReport(document) {
    this._humanCapitalService.downloadFile('user-report-documents', document.created_by, document.user_report_id, document.title, document.id, document);

  }

  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-report-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    // const index = UsersStore.usersList.findIndex(e => e.id == itemDetails.created_by);
    // if (index != -1) {
      this.previewObject.uploaded_user = ReportMasterStore.individualReportDetails.updated_by;
      this.previewObject.uploaded_user.designation = ReportMasterStore.individualReportDetails.updated_by.designation;
    // }
    this.previewObject.created_at = itemDetails.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }




  closeReportPreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
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

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._reportService.setDocumentDetails(imageDetails, logo_url);
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

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  getFrequencies() {
    this._reportFrequencyService.getItems(false,'?access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchFrequency(e) {
    this._reportFrequencyService.getItems(false,'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType);
  }

  descriptionValueChange(event){
    this._utilityService.detectChanges(this._cdr);
  }

    getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }




  /**
    * removing document file from the selected list
    * @param token -image token
    */
  removeDocument(token) {
    ReportMasterStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  createImageUrl(type, token) {

    return this._humanCapitalService.getThumbnailPreview(type, token);
  }



  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: ReportMasterStore.docDetails
    })


    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.reporting_to);
    if (this.form.value.id) {
      save = this._reportService.updateItem(this.form.value.id, this.form.value);
    } else {
      let saveData = {
        title: this.form.value.title ? this.form.value.title : '',
        report_frequency_id: this.form.value.report_frequency_id ? this.form.value.report_frequency_id : '',
        description: this.form.value.description ? this.form.value.description : '',
        documents: this.form.value.documents ? this.form.value.documents : ''
      }
      save = this._reportService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
        this.ReportMasterStore.clearDocumentDetails();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
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
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.fileUploadsArray = [];
    this._eventEmitterService.dismissHumanCapitalUserDocumentControlmodal();

  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  ngOnDestroy(){
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

  checkForFileUploadsScrollbar(){
    if(ReportMasterStore.docDetails.length >= 5 || (this.fileUploadsArray.length > 5 && ReportMasterStore.docDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + ReportMasterStore.docDetails.length)) >= 5){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
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
