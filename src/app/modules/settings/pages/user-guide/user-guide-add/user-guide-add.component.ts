import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationOverview } from 'src/app/core/models/organization/organization-overview/organization-overview';
import { EventDocumentsService } from 'src/app/core/services/event-monitoring/event-documents/event-documents.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationOverviewService } from 'src/app/core/services/organization/overview/organization-overview.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
declare var $: any;

@Component({
  selector: 'app-user-guide-add',
  templateUrl: './user-guide-add.component.html',
  styleUrls: ['./user-guide-add.component.scss']
})
export class UserGuideAddComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  fileUploadPopupStore = fileUploadPopupStore;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input ('source') overviewObject: any;
  AppStore = AppStore;
  fileUploadPopupSubscriptionEvent: any = null;
  AuditWorkFlowStore = AuditWorkflowStore;
  OrganizationModulesStore = OrganizationModulesStore;
  subModule = [];
  public Editor;
  @Input('source') InfoSource: any;
  fileUploadProgress = 0;
  OrganizationOverviewStore = OrganizationOverviewStore;
  logoUploaded = false;

  

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _eventDocumentService: EventDocumentsService,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _auditWorkflowService: AuditWorkflowService,
    private _organizationOverviewService:OrganizationOverviewService 
  ) { this.Editor = myCkEditor; }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['',  [Validators.required]],
      description: [''],
      module_group_id: ['',  [Validators.required]],
      documents:[''],
      module_id: ['',  [Validators.required]],
    });
      // resetingForm on initial load
      this.resetForm();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    if (this.InfoSource.type=="Edit") {
      this.setFormValues();
    }
    else {
      this.setModuleData();
    }
  }

  setModuleData() {
    this.form.patchValue({
      module_group_id: this.OrganizationOverviewStore.module_group_id,
      module_id: this.OrganizationOverviewStore.module_id,
    })
    this.getModuleData();
  }


  setFormValues(){
    if (this.InfoSource.hasOwnProperty('values') && this.InfoSource.values) {
      let { id, title ,module_group_id, module_id, description, documents } = this.InfoSource.values
      this.form.setValue({
        id: id,
        module_group_id: module_group_id,
        module_id: module_id,
        title: title,
        description: description,
        documents: ""
      })
      this.getModuleData();
    }
  }

  getModuleData() {
    let data=OrganizationModulesStore.organizationModules.find(e=>e.id==this.form.value.module_group_id);
    let subModules=[...data.modules]
    
    this.subModule=  subModules.filter(function(value) {
      return value.is_menu == 1;
    });
  }


    // getting description count
    getDescriptionLength(){
      var regex = /(<([^>]+)>)/ig;
      var result = this.form.value.description.replace(regex,"");
      return result.length;
    }

    // Create Base64 image strig from blob
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if(imageDetails != null){
        imageDetails['preview'] = logo_url;
        this._organizationOverviewService.setImageDetails(imageDetails,logo_url,type);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

    onFileChange(event,type:string){
      this.fileUploadProgress = 0;
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          if(type == 'logo') OrganizationOverviewStore.logo_preview_available = true;
          this._utilityService.detectChanges(this._cdr);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams)
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded)
                  this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                $("#file").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
                  if(type == 'logo'){
                    this.logoUploaded = true;
                    OrganizationOverviewStore.logo_preview_available = false;
                  }
                  this.createImageFromBlob(prew,temp,type);
                },(error)=>{
                  $("#file").val('');
                  OrganizationOverviewStore.logo_preview_available = false;
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            $("#file").val('');
            let errorMessage = "";
            if(error.error?.errors?.hasOwnProperty('file'))
              errorMessage = error.error.errors.file;
            else errorMessage = 'file_upload_failed';
            this._utilityService.showErrorMessage('failed', errorMessage);
            OrganizationOverviewStore.logo_preview_available = false;
            this.fileUploadProgress = 0;
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          $("#file").val('');
        }
      }
    }

    // openFileUploadModal() {
    //   setTimeout(() => {
    //     fileUploadPopupStore.singleFileUpload = true;
    //     fileUploadPopupStore.openPopup = true;
    //     $('.modal-backdrop').add();
    //     document.body.classList.add('modal-open')
    //     this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
    //     this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
    //     setTimeout(() => {
    //       this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
    //       this._utilityService.detectChanges(this._cdr)
    //     }, 100);
    //   }, 250);
    // }

    // createImageUrl(type?,token?, h?, w?) {
    //   if (type == 'document-version') {
    //     return this._documentFileService.getThumbnailPreview(type, token)
    //   }
    //   else
    //   return this._eventDocumentService.getThumbnailPreview(type, token);
    // }

    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
    }

    // removeDocument(doc) {
    //   if(doc.hasOwnProperty('is_kh_document')){
    //     if(!doc['is_kh_document']){
    //       fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    //     }
    //     else{
    //       fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
    //     }
    //   }
    //   else{
    //     fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    //   }
    //   // PolicyStore.unsetFileDetails('brochure', token);
    //   this.enableScrollbar();
    //   this._utilityService.detectChanges(this._cdr);
    // }

    enableScrollbar() {
      if (fileUploadPopupStore.displayFiles.length >= 3) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }

    save(close: boolean = false) {
      this.formErrors = null;
    var items:OrganizationOverview[] = this.OrganizationOverviewStore.infoDetails;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      let tempdate = this.form.value.establish_date;
      this.form.value.establish_date = this._helperService.processDate(tempdate,'join');
      this.form.value.documents = this._organizationOverviewService.getImageDetails('logo');
      if (this.form.value.id) {
       save = this._organizationOverviewService.updateItem(this.form.value.id, this.getSaveData());
      } else {
        save = this._organizationOverviewService.saveItem(this.getSaveData());
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetForm();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
      
    }

    getSaveData() {
      let saveData = {
        id: this.form.value?.id ? this.form.value.id : null,
        title: this.form.value?.title ? this.form.value.title : null,
        description: this.form.value?.description ? this.form.value.description : null,
        module_group_id: this.form.value?.module_group_id ? this.form.value.module_group_id : null,
        documents: this._organizationOverviewService.getImageDetails('logo') ? [this._organizationOverviewService.getImageDetails('logo')] : [],
        module_id: this.form.value?.module_id ? this.form.value.module_id : null,
      }

      return saveData;
    }

     cancel() {
      this.closeFormModal();
    }
    
    // for closing the modal
    closeFormModal(){
      this._organizationOverviewService.setImageDetails(null,'','logo');
      this.resetForm();
      this._eventEmitterService.dismissUserGuideModal();
    }
    

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }



    resetForm() {
      this.form.reset();
      this.form.pristine;
      this.formErrors = null;
      this.clearFIleUploadPopupData();
      AppStore.disableLoading();
    }

    clearFIleUploadPopupData() {
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore.clearSystemFiles();
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

    descriptionValueChange(event) {
      this._utilityService.detectChanges(this._cdr);
    }

    checkAcceptFileTypes(type){
      return this._imageService.getAcceptFileTypes(type); 
    }

}
