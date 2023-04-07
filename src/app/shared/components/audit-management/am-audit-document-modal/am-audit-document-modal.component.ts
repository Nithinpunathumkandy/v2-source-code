import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmAuditDocumentService } from 'src/app/core/services/audit-management/am-audit/am-audit-document/am-audit-document.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AmAuditDocumentTypesService } from 'src/app/core/services/masters/audit-management/am-audit-document-types/am-audit-document-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditDocumentStore } from 'src/app/stores/audit-management/am-audit/am-audit-document.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { AmAuditDocumentTypesMasterStore } from 'src/app/stores/masters/audit-management/am-audit-document-types-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-document-modal',
  templateUrl: './am-audit-document-modal.component.html',
  styleUrls: ['./am-audit-document-modal.component.scss']
})
export class AmAuditDocumentModalComponent implements OnInit {
  @Input('source') auditSource: any;
	@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('documentTypeAddformModal', { static: true }) documentTypeAddformModal: ElementRef;
  form:FormGroup;
  cancelEventSubscription:any;
  formErrors = null;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AmAuditDocumentStore = AmAuditDocumentStore;
  AmAuditDocumentTypesMasterStore = AmAuditDocumentTypesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'am_audit_document_cancel_confirmation',
    type: 'Cancel'
  };
  addDocumentTypeObject = {
    component: 'Master',
    type: null,
    values: null
  };
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  fileUploadPopupSubscriptionEvent:any;
  documentTypeSubscriptionEvent: any;
  constructor(private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _amAuditDocumentTypeService:AmAuditDocumentTypesService,
    private _amAuditDocumentService:AmAuditDocumentService,
    private _imageService:ImageServiceService,
    private _http:HttpClient,
    private _documentFileService: DocumentFileService,
    private _renderer2:Renderer2) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: [null, [Validators.required]],
      description:[''],
      am_audit_document_type_id:[null,[Validators.required]],
      document:[null],
    });
    if (this.auditSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancel(item);
		})

    this.documentTypeSubscriptionEvent = this._eventEmitterService.amDodumentTypeModel.subscribe(res=>{
      this.closeDocumentTypeMasterModal();
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  cancel(status) {
		if (status) {
    this.closeFormModal();
		}
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('hide');
		}, 250);
	}

  confirmCancel() {

		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('show');
		}, 100);

	}
  

  ngDoCheck(){
    if (this.auditSource && this.auditSource.hasOwnProperty('values') && this.auditSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
   this.clearItems();
   this._eventEmitterService.dismissAmAuditDocumentModal();
  }

  clearItems(){
    this.form.reset();
   this.formErrors = null;
   this.clearFIleUploadPopupData();
  }

  removeBrochure(type,token) {
		fileUploadPopupStore.unsetFileDetails(type, token);
		this._utilityService.detectChanges(this._cdr);
	  }

  
  setFormValues(){
    if (this.auditSource.hasOwnProperty('values') && this.auditSource.values) {
      let { id,title,am_audit_document_type_id,description,document} = this.auditSource.values
      this.form.patchValue({
        id: id,
        title:title,
        am_audit_document_type_id:am_audit_document_type_id?.id,
        description:description,
        document:document,
       
      })
      this.getAuditDocumentType();
    }
  }

     //getting button name by language
     getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

    getSaveData(){
      let saveData;
      if(this.form.value.id){
        saveData = {
       
          ...this.form.value,
          document: {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)[0]}
        
      }
      }
     
      else{
      saveData = {
          ...this.form.value,
          document: {...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')[0]}
        }
      }
     return saveData;
    }

    saveAuditDocument(close:boolean=false){
 
      this.formErrors = null;
      AppStore.enableLoading();
      let save;
      if (this.form.value.id) {
        save = this._amAuditDocumentService.updateItem(this.form.value.id,this.getSaveData());
      } else {
        //delete this.form.value.id
        save = this._amAuditDocumentService.saveItem(this.getSaveData());
      }
  
     save.subscribe((res:any)=>{
        AppStore.disableLoading();
        
        if(!this.form.value.id){
          this.clearItems();
        }
        else{
          this.clearEditFiles();
        }
        // this.closeFormModal();
        this._utilityService.detectChanges(this._cdr)
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          // this.processFormErrors();
        }
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }

    clearEditFiles(){
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore.clearUpdateFiles();
    }

    getAuditDocumentType(params?){
      this._amAuditDocumentTypeService.getItems(false,(params?params:'')).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    searchAuditDocumentType(e){
      this._amAuditDocumentTypeService.getItems(false,'q='+e.term).subscribe(res=>{
        this.form.patchValue({am_audit_document_type_id:AmAuditDocumentTypesMasterStore.lastInsertedId});
        this.getAuditDocumentType();
        this._utilityService.detectChanges(this._cdr);
      })
    }

    openDocumentTypeModal(){
      this.addDocumentTypeObject.type = 'Add';
      this._utilityService.detectChanges(this._cdr);
      this.documentTypeMasterModal();
    }
  
    documentTypeMasterModal() {
      this._renderer2.addClass(this.documentTypeAddformModal.nativeElement,'show');
      this._renderer2.setStyle(this.documentTypeAddformModal.nativeElement,'z-index','99999');
      this._renderer2.setStyle(this.documentTypeAddformModal.nativeElement,'display','block');
      this._utilityService.detectChanges(this._cdr);
    }
  
    closeDocumentTypeMasterModal() {
      this.addDocumentTypeObject.type = null;
      this._renderer2.removeClass(this.documentTypeAddformModal.nativeElement,'show');
      this._renderer2.setStyle(this.documentTypeAddformModal.nativeElement,'z-index','9999');
      this._renderer2.setStyle(this.documentTypeAddformModal.nativeElement,'display','none');
      this._utilityService.detectChanges(this._cdr);
      this.searchAuditDocumentType({term : AmAuditDocumentTypesMasterStore.lastInsertedId})
      
  
    }

    



	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType);
	}


	

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
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

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }


    createImageUrl(type, token) {
      if (type == 'document-version')
        return this._documentFileService.getThumbnailPreview(type, token);
    }

    removeDocument(doc) {
      if (doc.hasOwnProperty('is_kh_document')) {
        if (!doc['is_kh_document']) {
          fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
        }
        else {
          fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
        }
      }
      else {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }

    ngOnDestroy(){
      this.cancelEventSubscription.unsubscribe();
      this.documentTypeSubscriptionEvent.unsubscribe();
    }


}
