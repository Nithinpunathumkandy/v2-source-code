import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { DomSanitizer } from '@angular/platform-browser';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { PolicyService } from "src/app/core/services/organization/business_profile/policy/policy.service";
import { PolicyStore } from "src/app/stores/organization/business_profile/policies/policies.store";
import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";

import { AppStore } from 'src/app/stores/app.store';
import { Policies } from 'src/app/core/models/organization/business_profile/policies/policies';

import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})

export class PoliciesComponent implements OnInit {

  @ViewChild('titleInput', { static: true }) titleInput: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  PolicyStore = PolicyStore;
  ProfileStore = ProfileStore;
  AuthStore = AuthStore;
  
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  pform: FormGroup;
  formErrors: any;
  AppStore = AppStore;

  // selectedItem: number;
  subscription: any;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;

  deleteObject = {
    title: 'Delete Policy?',
    type: '',
    subtitle: 'are_you_sure_delete',
    id: null,
    position: null
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: '',
    component: 'organization-policies',
    componentId: null
  }
  
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

  fileUploadsArray: any = [];
  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#policy-title',
      intro: "Organization Policy Title",
      position: "right"
    },
    {
      element: '#policy-details',
      intro: "Organization Policy Details",
      position: "left"
    },
    {
      element: '#new_modal',
      intro: 'Add New Policy',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Policy List',
      position: 'bottom'
    },
  ]
  public Editor;
  public Config;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.code == 'Escape'){
      if($(this.filePreviewModal.nativeElement).hasClass('show'))
        this.closePreviewModal(null);
      else if($(this.fileUploadModal.nativeElement).hasClass('show')){
        this.enableScrollbar();
        this.closeFileUploadModal();
      }
      else if($(this.formModal.nativeElement).hasClass('show'))
        this.cancel();
    }
  }
  constructor(private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _formBuilder: FormBuilder,
    private _policyService: PolicyService, private _renderer2: Renderer2,
    private _organizationFileService: OrganizationfileService, private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService, private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }


  ngOnInit() {

    RightSidebarLayoutStore.showFilter = false;
    // Subscribe event emitted using event emitter from Policy Service
    this.subscription = this._policyService.itemChange.subscribe(item => {
      this.viewPolicyDetails(item);
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deletePolicy(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    NoDataItemStore.setNoDataItems({ title: "policy_nodata_title", subtitle: 'policy_nodata_subtitle', buttonText: 'new_policy_button' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'CREATE_ORGANIZATION_POLICY', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_ORGANIZATION_POLICY_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_ORGANIZATION_POLICY', submenuItem: { type: 'export_to_excel' } }
      ]
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100, 'CREATE_ORGANIZATION_POLICY')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }
      if(PolicyStore.loaded){
        this.checkForDataCount();
      }

      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewPolicy();
            }, 1000);
            break;
          case "template":
            var fileDetails = {
              ext: 'xlsx',
              title: 'organization_policy_template',
              size: null
            }
            //this._policyService.generateTemplate();
            this._organizationFileService.downloadFile('policy-template', null, null, fileDetails.title, fileDetails);
            break;
          case "export_to_excel":
            //this._policyService.exportToExcel();
            var fileDetails = {
              ext: 'xlsx',
              title: 'organization_policies',
              size: null
            };
            this._organizationFileService.downloadFile('policy-export', null, null, fileDetails.title, fileDetails);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewPolicy();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // Initializes form
    this.pform = this._formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      organization_id: this.ProfileStore.organizationId,
      documents: []
    });

    SubMenuItemStore.setNoUserTab(true);
    // Get Policy List
    this._policyService.getAllItems(true).subscribe(res => {
      if (res.length > 0 &&AuthStore.getActivityPermission(1900,'ORGANIZATION_POLICY_DETAILS')) {
        this.viewPolicyDetails(res[0].id);
      }
      else{
        this.checkForDataCount();
        // PolicyStore.individualLoaded = true
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  addNewPolicy() {
    this.resetForm();
    this.PolicyStore.addOrEditFlag = false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  checkForDataCount(){
    if(PolicyStore.policyDetails.length == 0){
      let pos = this.introSteps.findIndex(e => e.element == '#policy-title');
      if(pos != -1) this.introSteps.splice(pos,1);
      pos = this.introSteps.findIndex(e => e.element == '#policy-details');
      if(pos != -1) this.introSteps.splice(pos,1);
      pos = this.introSteps.findIndex(e => e.element == '#no_data_new_modal');
      if(pos == -1 && AuthStore.getActivityPermission(100,'CREATE_ORGANIZATION_POLICY')){
        let elem = {
          element: '#no_data_new_modal',
          intro: 'Add New Policy',
          position: 'bottom'
        }
        this.introSteps.unshift(elem);
      }
    }
    else{
      let pos = this.introSteps.findIndex(e => e.element == '#no_data_new_modal');
      if(pos != -1) this.introSteps.splice(pos,1);
      pos = this.introSteps.findIndex(e => e.element == '#policy-details');
      if(pos == -1) {
        let elem = {
          element: '#policy-details',
          intro: "Organization Policy Details",
          position: "left"
        }
        this.introSteps.unshift(elem);
      }
      pos = this.introSteps.findIndex(e => e.element == '#policy-title');
      if(pos == -1) {
        let elem = {
          element: '#policy-title',
          intro: "Organization Policy Title",
          position: "right"
        }
        this.introSteps.unshift(elem);
      }
    }
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository')
      .createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, this._http);
      };
  }

  uploadFile(e) {
    // console.log(e);
    // e.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    //   return new MyUploadAdapter( loader );
    // };
  }

  /**
   * Gets Policy Details by id
   * @param policyId id of policy
   */
  viewPolicyDetails(policyId) {
    PolicyStore.unsetSelectedPolicyDetails();
    this._policyService.setBrochureDetailsInSelectedPolicy([]);
    this._policyService.getItem(policyId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this._utilityService.detectChanges(this._cdr);
    });
    this._policyService.setSelected(policyId);
  }

  // Opens Modal to Add/Edit Policy
  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
  }

  showIntro(){
    var intro:any = introJs();
    intro.setOptions({
      steps: this.introSteps,
      showBullets: true,
      showButtons: true,
      exitOnOverlayClick: true,
      keyboardNavigation: true,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      nextToDone: true,
      hidePrev: true,
    });
    intro.start();
  }

  // Reset Form Object
  resetForm() {
    this.pform.reset();
    this.clearFIleUploadPopupData();
    this.pform.markAsPristine();
    this.formErrors = null;
    PolicyStore.unsetBrochureDetails();
    AppStore.disableLoading();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  // Close Modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this.resetForm();
    this._utilityService.scrollToTop();
  }

  // Close Modal
  cancel() {
    this.closeFormModal();
  }

  // Returns default image url
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  /**
   * Open Modal to Delete a policy
   * @param policyId Id of policy
   * @param position Position of policy
   */
  openDeletePolicyModal(policyId: number, position: number) {
    this.deleteObject.id = policyId;
    this.deleteObject.position = position;
    $(this.deletePopup.nativeElement).modal('show');
  }

  // Delete Policy
  deletePolicy(status) {
    if (status && this.deleteObject.id) {
      this._policyService.delete(this.deleteObject.id, this.deleteObject.position).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }

  /**
   * Edit Policy details
   * @param policyId Id of policy
   */
  editPolicy(policyId: number) {
    this.PolicyStore.addOrEditFlag = true;
    var policyDetails = this.PolicyStore.selectedPolicyDetails; // Gets policy details by id
    this.resetForm();
    this.clearForm();
    this.pform.markAsPristine();
    this.formErrors = null;
    AppStore.disableLoading();
    setTimeout(() => {
      this._policyService.getItem(policyId).subscribe(res => {
        if (res.documents.length > 0) {
          this.setDocuments(res.documents)
        }
      });
      this.pform.patchValue({
        id: policyDetails.id ? policyDetails.id : '',
        title: policyDetails.title ? policyDetails.title : '',
        description: policyDetails.description ? policyDetails.description : '',
        organization_id: policyDetails.organization.id ? policyDetails.organization.id : '',
      });
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }, 500);
  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._organizationFileService.getThumbnailPreview('organization-policy-document', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    this.enableScrollbar();
  }

  clearForm() {
    this.pform.setValue({
      id: '',
      title: '',
      description: '',
      organization_id: '',
      documents: []
    });
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.pform.value.description.replace(regex, "");
    return result.length;
  }

  /**
   * Function to save or update a policy
   * @param close parameter that checks whether to close modal automatically
   */
  save(close: boolean = false) {
    // console.log("Check")
    this.formErrors = null;
    let count = 0;
    var items: Policies[] = this.PolicyStore.policyDetails;
    count = items.length;
    if (this.pform.valid) {
      let save;
      AppStore.enableLoading();
      if (!this.pform.value.organization_id)
        this.pform.value.organization_id = this.ProfileStore.organizationId;
      this.pform.value.documents = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
      if (this.pform.value.id) {
        let updateParam = {
          ...this.pform.value,
          documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
        }
        save = this._policyService.updateItem(this.pform.value.id, updateParam);
      } else {
        save = this._policyService.saveItem(this.pform.value, count == 0 ? 0 : count + 1);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.pform.value.id)
          this.resetForm();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
        }
        else if (err.status == 403 || err.status == 500) {
          this.closeFormModal();
        }
        else {
          this._utilityService.showErrorMessage('error', "something_went_wrong_try_again");
        }
      });
    }
  }

  /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  /**
   * Deletes a brochure
   * @param token Token of brochure
   */
  removeBrochure(doc) {
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
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Download a particular brochure
   * @param downloadItem Details of item to be downloaded
   * @param subsidiaryId Subsidiary Id
   */
  downloadBrochures(downloadItem, subsidiaryId) {
    event.stopPropagation();
    this._organizationFileService.downloadFile('organization-policies', subsidiaryId, downloadItem.id, downloadItem.title, downloadItem);
  }

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "organization-policies":
        this._organizationFileService.downloadFile(
          type,
          document.organization_policy_id,
          document.id,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  /**
   * View brochure
   * @param brochureItem Details of brochure
   * @param id Subsidiary Id
   */
  viewBrochureItem(type, brochureItem, id) {
    switch (type) {
      case 'document-version':
        this._documentFileService
          .getFilePreview(type, brochureItem.document_id, id.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              brochureItem.title
            );
            this.openPreviewModal(type, resp, id, brochureItem);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };

        break;

      case 'organization-policy-document':
        this._organizationFileService.getFilePreview('policy-preview',brochureItem.organization_policy_id, id).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
          this.openPreviewModal(type,resp, brochureItem, id);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('error', 'permission_denied');
          }
          else {
            this.openPreviewModal(type,null, brochureItem, id);
          }
        });
        break;

      default:
        break;
    }
  }

  openPreviewModal(type, filePreview, documentFiles, document) {
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
       this.previewObject.uploaded_user = this.PolicyStore.selectedPolicyDetails.created_by ? this.PolicyStore.selectedPolicyDetails.created_by : null;
        this.previewObject.created_at = this.PolicyStore.selectedPolicyDetails.created_at ? this.PolicyStore.selectedPolicyDetails.created_at : '';
      if(type=='document-version'){
        this.previewObject.component=type
        this.previewObject.componentId = document.id;
      }
    else{
      this.previewObject.componentId = documentFiles.organization_policy_id;
      this.previewObject.component='organization-policies'
    }
      
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Close brochure preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
  }

  checkForFileUploadsScrollbar() {
    if (PolicyStore.getBrochureDetails.length >= 5 || (this.fileUploadsArray.length > 5 && PolicyStore.getBrochureDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + PolicyStore.getBrochureDetails.length)) >= 5) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
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
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._organizationFileService.getThumbnailPreview(type,token);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._policyService.makeSelectedEmpty();
    this._policyService.clearPolicyList();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
    this.subscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    PolicyStore.unsetSelectedPolicyDetails();
  }

}
