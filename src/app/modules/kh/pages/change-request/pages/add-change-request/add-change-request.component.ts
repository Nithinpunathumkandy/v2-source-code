import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from 'src/app/stores/app.store';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { DocumentsService } from "src/app/core/services/knowledge-hub/documents/documents.service";
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ChangeRequestService } from 'src/app/core/services/knowledge-hub/change-request/change-request.service';
import { DocumentChangeRequestTypesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-change-request-type-store';
import { DocumentChangeRequestTypeService } from 'src/app/core/services/masters/knowledge-hub/document-change-request-type/document-change-request-type.service';
import { DocumentsStore } from "src/app/stores/knowledge-hub/documents/documents.store";

declare var $: any;
@Component({
  selector: 'app-add-change-request',
  templateUrl: './add-change-request.component.html',
  styleUrls: ['./add-change-request.component.scss']
})
export class AddChangeRequestComponent implements OnInit {

  @ViewChild('khDoc') khDoc: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;

  requestForm: FormGroup;
  requestFormErrors: any;
  saveData: any = null;
  formData: any = null;
  selectedRequestType: any = null;

  selectFile: boolean = false;
  workflowEnabled: boolean = false;

  AppStore = AppStore;
  AssessmentsStore = AssessmentsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  changeRequestStore = changeRequestStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DocumentChangeRequestTypesMasterStore = DocumentChangeRequestTypesMasterStore;

  newFileArray: any = [];
  fileUploadProgress = 0;
  currentFile: any;

  khDocumentSubscription: Subscription;
  cancelEventSubscription: Subscription;

  // Confirmation object
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _documentService: DocumentsService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _changeRequestService: ChangeRequestService,
    private _documentChangeRequestTypeService: DocumentChangeRequestTypeService,

  ) { }

  ngOnInit(): void {
    DocumentsStore.clearBreadCrumb();
    AppStore.disableLoading();
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      setTimeout(() => {
        this.requestForm.pristine;
      }, 250);
    });

    SubMenuItemStore.setNoUserTab(true);
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);

    this.requestForm = this._formBuilder.group({
      id: [''],
      document_id: ['', [Validators.required]],
      document_change_request_type_id: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      consequence: [''],
      name: ['', [Validators.required]],
      ext: ['', [Validators.required]],
      mime_type: [''],
      size: ['', [Validators.required]],
      url: ['', [Validators.required]],
      thumbnail_url: ['', [Validators.required]],
      token: ['', [Validators.required]],
      document_files: [],
    });

    //Edit checking here
    if (this._router.url.indexOf('edit-request') != -1) {
      if (changeRequestStore.editCheck && changeRequestStore.changeRequestId) {
        this._changeRequestService.getItemById(changeRequestStore.changeRequestId).subscribe(res => {
          this.setDataForEdit();
        })
      }
      else {
        this._router.navigateByUrl('/knowledge-hub/change-requests');
      }
    }
    else{
      this.selectRequestType(1)//Setting default request type ID as 1
    }
    this.changeRequestType()

    window.addEventListener("scroll", this.scrollEvent, true);

    //Document selection event
    this.khDocumentSubscription = this._eventEmitterService.khDocumentModal.subscribe(item => {
      this.closeDocumentModal();
    })

    //Cancel event
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelRequest(item);
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  //Request type API for documments
  changeRequestType() {
    this._documentChangeRequestTypeService.getAllItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  //Passing data to the api/Need to call this function for setting data to the respective fields
  createRequestData() {
    this.currentFile = AssessmentsStore.activeFile
    this.saveData = {
      "id": this.formData.id ? this.formData.id : '',
      "document_id": this.currentFile?.id ? this.currentFile.id : '',
      "document_change_request_type_id": this.selectedRequestType ? this.selectedRequestType : '',
      "reason": this.formData.reason ? this.formData.reason : '',
      "consequence": this.formData.consequence ? this.formData.consequence : '',
      "name": this.currentFile?.title ? this.currentFile.title : '',
      "ext": this.currentFile?.ext ? this.currentFile.ext : '',
      "mime_type": this.currentFile?.mime_type ? this.currentFile.mime_type : '',
      "size": this.currentFile?.size ? this.currentFile.size : null,
      "url": this.currentFile?.url ? this.currentFile.url : '',
      "thumbnail_url": this.currentFile?.thumbnail_url ? this.currentFile.thumbnail_url : '',
      "token": this.currentFile?.token ? this.currentFile.token : '',
    };
    if (this.selectedRequestType == 1) {
      this.saveData['document_files'] = changeRequestStore?.getNewDocument ? [changeRequestStore.getNewDocument] : []
    }
  }

  //Setting data for the fields after getting response from API
  setDataForEdit() {
    let editData = changeRequestStore.requestDetails
    this.selectRequestType(editData.document_change_request_type.id)
    this.findSelectedRequestType(changeRequestStore?.requestDetails?.document_change_request_type?.id)
    // Document File | Changable File
    if (editData.file != null) {
      let selectedFile = editData.file
      if (selectedFile && selectedFile.token) {
        var purl = this._documentFileService.getThumbnailPreview('change-request-file', selectedFile.token)
        var lDetails = {
          name: selectedFile.title,
          ext: selectedFile.ext,
          size: selectedFile.size,
          url: selectedFile.url,
          token: selectedFile.token,
          thumbnail_url: selectedFile.thumbnail_url,
          preview: purl,
          id: selectedFile.id
        }
      }
      this._changeRequestService.setNewDocument(lDetails, purl)
    }

    // Selected File | Fixed File
    let selectedFilePreview = this._documentFileService.getThumbnailPreview('document-version', editData.token)
    let selectedFile = {
      title: editData.name,
      ext: editData.ext,
      size: editData.size,
      url: editData.url,
      token: editData.token,
      thumbnail_url: editData.thumbnail_url,
      preview: selectedFilePreview,
      id: editData.document.id
    }

    AssessmentsStore.setDocumentImageDetails(selectedFile)

    this.requestForm.patchValue({
      id: editData.id ? editData.id : null,
      reason: editData.reason ? editData.reason : '',
      consequence: editData.consequence ? editData.consequence : '',
      document_change_request_type_id: editData.document_change_request_type?.id ? editData.document_change_request_type.id : null,
    })
  }

  //Here submitting the form
  submitRequestForm(close: boolean = false) {
    this.formData = this.requestForm.value;
    this.createRequestData();
    let save: any;
    AppStore.enableLoading();
    if (this.saveData.id) {
      save = this._changeRequestService.updateItem(this.saveData.id, this.saveData);
    }
    else {
      save = this._changeRequestService.saveItem(this.saveData);
    }
    save.subscribe(res => {
      this.clearData()
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) {
        this._router.navigateByUrl(`/knowledge-hub/change-requests/${res.id}`);
        this.closeRequestForm();
      }
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.requestFormErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  //Need to call this function to clear the fields
  closeRequestForm() {
    this.clearData()
  }

  //Cancel form
  cancelClicked() {
    this.confirmationObject.type = 'Cancel';
    this.confirmationObject.title = 'Cancel?';
    this.confirmationObject.subtitle = 'This action cannot be undone';
    this.workflowEnabled = false;
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  //It'll redirect after cancel the form
  cancelRequest(status) {
    if (status) {
      this.clearData();
      this._router.navigateByUrl('knowledge-hub/change-requests');
      this.clearConfirmationObject();
    }
    else {
      this.clearConfirmationObject();
    }
    $(this.confirmationPopup.nativeElement).modal('hide');
  }

  //Opening Commmon Document Selection Modal Popup
  selectFiles() {
    this.selectFile = true;
    $(this.khDoc?.nativeElement).modal('show');
  }

  //Closing Common Document Selection Modal Popup
  closeDocumentModal() {
    this.checkWorkflowStatus()
    this.selectFile = false;
    setTimeout(() => {
      $(this.khDoc.nativeElement).modal('hide');
    }, 100);
  }

  // Checking workflow has enabled/Disabled
  checkWorkflowStatus() {
    if(AssessmentsStore.activeFile){
      this._documentService.getItemById(AssessmentsStore?.activeFile?.id).subscribe(res => {
        if (res?.is_workflow) {
          this.workflowEnabled = true;
          this._utilityService.detectChanges(this._cdr);
        }
        else {
          this.workflowEnabled = false;
          this._utilityService.detectChanges(this._cdr);
        }
      })
    }
  }

  //Setting request type ID on NgOnInIt for checking active type
  selectRequestType(typeId) {
    this.selectedRequestType = typeId
  }

  //This is used to set the style for "Active Request Type"
  findSelectedRequestType(typeId) {
    if (typeId == this.selectedRequestType) {
      return true;
    }
  }

  // *** File Upload Functions Starts Here ***

  //To get file details when selected
  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
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

  /**
* 
* @param files Selected files array
* @param type type of selected files - logo or brochure
*/
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.newFileArray);
    this.newFileArray = result.fileUploadsArray;
    return result.files;
  }

  createImageFromBlob(image: Blob, fileDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if (fileDetails != null) {
        this._changeRequestService.setNewDocument(fileDetails, logo_url);
      }
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
    let temporaryFileUploadsArray = this.newFileArray;
    this.newFileArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  //Removing document file
  removeDocument() {
    this.workflowEnabled = false;
    AssessmentsStore.unsetProductImageDetails();
    this._utilityService.detectChanges(this._cdr);
  }
  // *** File Upload Functions Ends Here ***

  //Setting Image URL 
  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  //Extension checking
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }



  //Scroll functionality for the document
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  //Button Text 
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  //Don't forget to clear all the data
  clearData() {
    this.workflowEnabled = false;
    this.requestForm.pristine;
    this.requestForm.reset();
    this.requestFormErrors = null;
    changeRequestStore.clearNewDocument();
    this.newFileArray = [];
    this.selectFile = false;
    this.saveData = null;
    this.formData = null;
    AssessmentsStore.unsetProductImageDetails();
  }

  clearConfirmationObject() {
    this.confirmationObject.title = '';
    this.confirmationObject.subtitle = '';
    this.confirmationObject.type = '';
  }

  //Form validation while clicking save
  formValidationCheck(){
    if(this.selectedRequestType == 1){
      if(AppStore.loading || !changeRequestStore.getNewDocument){
        return true
      }else{
        return false
      }
    }
    if(AppStore.loading)
    return true
    else
    return false
  }

  //Don't forget to destroy reaction disposer
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();        
    this.clearData()
    SubMenuItemStore.makeEmpty();
    changeRequestStore.editCheck = false;        
    changeRequestStore.clearNewDocument();
    this.khDocumentSubscription.unsubscribe();
    this.cancelEventSubscription.unsubscribe();    
    AssessmentsStore.unsetProductImageDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
