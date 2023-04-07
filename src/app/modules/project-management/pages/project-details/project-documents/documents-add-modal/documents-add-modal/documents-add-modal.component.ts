import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectDetailsDocumentsService } from 'src/app/core/services/project-management/project-details/project-documents/project-details-documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectDocumentStore } from 'src/app/stores/project-management/project-details/project-documents/project-document-store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
declare var $: any;

@Component({
  selector: 'app-documents-add-modal',
  templateUrl: './documents-add-modal.component.html',
  styleUrls: ['./documents-add-modal.component.scss']
})
export class DocumentsAddModalComponent implements OnInit {

  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input ('source') projectDocumentSource: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  reactionDisposer: IReactionDisposer;
  fileUploadPopupSubscriptionEvent: any = null;
  
  AppStore = AppStore;
  ProjectDocumentStore = ProjectDocumentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;

  constructor(
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _projectDocumentService: ProjectDetailsDocumentsService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    public _msTypeService: MstypesService) 
    { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddDocumentModalComponent
   */    
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      document:[]
    });

    this.resetForm();

    if (this.projectDocumentSource.type == 'Edit') {
      this.setFormValues();
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }



  setFormValues(){
      this.form.patchValue({
        id: this.projectDocumentSource.value?.id,
        title: this.projectDocumentSource.value?.title,
        description: this.projectDocumentSource.value?.description,
      })
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

  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._msTypeService.getThumbnailPreview(type,token);
    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissProjectDocumentModal();
  }

  // getting description count
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        let updateParam = {
          ...this.form.value,
          document: {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)[0]}
        } 
        save = this._projectDocumentService.updateItem(ProjectsStore.selectedProjectId,this.form.value.id, updateParam);
      } else {
        let saveParam = {
          ...this.form.value,
          document: {...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')[0]}
        }
        save = this._projectDocumentService.saveProjectDocument(ProjectsStore.selectedProjectId, saveParam);
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
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
  
  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }
}

