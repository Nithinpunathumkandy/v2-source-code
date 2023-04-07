import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-organization-overview-add',
  templateUrl: './organization-overview-add.component.html',
  styleUrls: ['./organization-overview-add.component.scss']
})
export class OrganizationOverviewAddComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      // id: [''],
      title: [''],
      description: [''],
      module_group_id: [''],
      documents:[],
      module_id: [''],
    });
    this.resetForm();
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    
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

    createImageUrl(type?,token?, h?, w?) {
      if (type == 'document-version') {
        return this._documentFileService.getThumbnailPreview(type, token)
      }
      else
      return this._eventDocumentService.getThumbnailPreview(type, token);
    }

    checkExtension(ext, extType) {
      return this._imageService.checkFileExtensions(ext, extType)
    }

    removeDocument(doc) {
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
      // PolicyStore.unsetFileDetails('brochure', token);
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }

    enableScrollbar() {
      if (fileUploadPopupStore.displayFiles.length >= 3) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }

    save(close: boolean = false) {
      let save;
      AppStore.enableLoading();
        save = this._organizationOverviewService.saveItem(this.getSaveData());

      save.subscribe(res => {
        AppStore.disableLoading();
        this.resetForm();
        if (close) this.cancel();
        this._utilityService.detectChanges(this._cdr);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
        }
      })
      console.log(this.getSaveData());
      console.log(this.form.value);
      
    }

    getSaveData() {
      let saveData = {
        // id: this.form.value?.id ? this.form.value.id : null,
        title: this.form.value?.title ? this.form.value.title : null,
        description: this.form.value?.description ? this.form.value.description : null,
        module_group_id: this.form.value?.module_group_id ? this.form.value.module_group_id : null,
        // document:this.form.value?.document ? this.form.value.document : null,
        module_id: this.form.value?.module_id ? this.form.value.module_id : null,
      }
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');

      return saveData;
    }
     cancel() {
      this.closeFormModal();
    }
    
    // for closing the modal
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissEventOverviewModal();
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

    
  
  
  

}
