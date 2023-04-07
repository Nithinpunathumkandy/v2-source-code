import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { DocumentService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/document/document.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { MsAuditDocStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-details/ms-document-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $:any;
@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  @Input ('source') source: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  form: FormGroup;
  formErrors: any;

  AppStore = AppStore;
  MsAuditDocStore = MsAuditDocStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _msAuditDoc: DocumentService,
    private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _fileService: FileServiceService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      documents : [],
      external_links : [''],
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }
  
    // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissMsAuditDocModal();
    this.resetForm();
  }
  
  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }
  

   // function for add & update
   save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        // let updateParam = {
        //   ...this.form.value,
        //   documents: {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)[0]}
        // } 
        // save = this._msAuditDoc.updateItem(MsAuditStore.selectedMsAuditId,this.form.value.id, updateParam);
      } else {
        let saveParam = {
          
          documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save'),
          external_links : MsAuditDocStore.docUrlList ? MsAuditDocStore.docUrlList : []
        }
        save = this._msAuditDoc.saveData(MsAuditStore.selectedMsAuditId, saveParam);
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
         MsAuditDocStore.docUrlList = [];
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

   addUrl() {
		if (this.form.value.external_links) {
			MsAuditDocStore.docUrlList.push(this.form.value.external_links);
		}
		this.form.patchValue({
			external_links: null
		})
		this._utilityService.detectChanges(this._cdr);
	}

  removeDocUrl(index) {
		MsAuditDocStore.docUrlList.splice(index, 1);
	}

  // * File Upload/Attach Modal
  openFileUploadModal() {
    setTimeout(() => {
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

  createImageUrl(type, token) {
    if(type=='document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._fileService.getThumbnailPreview(type,token);
  }

  // extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

 /**
   * Deletes a brochure
   * @param token Token of brochure
   */
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
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    MsAuditDocStore.docUrlList = [];
  }
}
