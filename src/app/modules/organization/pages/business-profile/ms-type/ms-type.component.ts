import { Component, OnInit, ChangeDetectionStrategy,ViewChild,ElementRef, ChangeDetectorRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { AuthStore } from 'src/app/stores/auth.store';

import { AppStore } from 'src/app/stores/app.store';

import { MstypesService } from "src/app/core/services/organization/business_profile/ms-type/mstype.service";
import { MsTypeStore } from "src/app/stores/organization/business_profile/ms-type/ms-type.store";
import { MsTypeMasterStore } from "src/app/stores/masters/organization/ms-type-master.store";

import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { MsTypeService } from "src/app/core/services/masters/organization/ms-type/ms-type.service";
import { MsTypeVersionService } from "src/app/core/services/masters/organization/ms-type-version/ms-type-version.service";
import { ProfileService } from "src/app/core/services/organization/business_profile/profile/profile.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MsType, MsTypeDetails } from 'src/app/core/models/organization/business_profile/ms-type/ms-type';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-type',
  templateUrl: './ms-type.component.html',
  styleUrls: ['./ms-type.component.scss']
})
export class MsTypeComponent implements OnInit,OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('mstypeformModal', { static: true  }) mstypeformModal: ElementRef;
  @ViewChild('msversionformModal', { static: true }) msversionformModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;

  AuthStore = AuthStore;
  AppStore = AppStore;
  MsTypeStore = MsTypeStore;
  MsTypeMasterStore = MsTypeMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  msTypeVersionSubscriptionEvent: any = null;
  msTypeSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  itemSelectedSubscription: any = null;
  // fileUploadPopupSubscriptionEvent: any = null;

  fileUploadsArray: any = []; // Display Mutitle File Loaders

  page = 1;
  pageSize = 10;

  docID: number = null;
  docVersionID: number = null;

  msTypeVersionObject = {
    component: 'Organization',
    msType: null
  }

  msTypeObject = {
    component: 'Organization'
  }

  deleteObject = { 
    title: '',
    subtitle: '',
    id: null,
    type: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  selectedIndex: number = 0;
  idleTimeoutSubscription: any;
  filterSubscription: any;
  networkFailureSubscription: any;

  msTypeDetails: MsTypeDetails; // Object to pass details to view details of Ms Type Details

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#search_bar',
      intro: 'Business Application Search',
      position: 'bottom'
    },
    {
      element: '#new_modal',
      intro: 'Add New MsType',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export MsType List',
      position: 'bottom'
    },
  ]
  public Editor;
  public Config;
  buttonClicked: any;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, public _msTypeService: MstypesService,
    public _subsidiaryService: SubsidiaryService, public _msService: MsTypeService,
    private _msVersionService: MsTypeVersionService, private _profileService: ProfileService,
    private _eventEmitterService: EventEmitterService, private _organizationFileService: OrganizationfileService,
    private _rightSidebarFilterService: RightSidebarFilterService, 
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _sanitizer: DomSanitizer,
    ) { 
      this.Editor = myCkEditor;
    }

  ngOnInit() {

    // RightSidebarLayoutStore.showFilter = true;

    NoDataItemStore.setNoDataItems({title: "orgmstype_nodata_title", subtitle: 'orgmstype_nodata_subtitle', buttonText: 'new_mstype_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_TYPE_ORGANIZATION_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MS_TYPE_ORGANIZATION', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_MS_TYPE_ORGANIZATION_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MS_TYPE_ORGANIZATION', submenuItem: {type: 'export_to_excel'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_MS_TYPE_ORGANIZATION')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
 
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createNewOrganizationMsType();
            break;
            case "template":
            this._msTypeService.generateTemplate();
            break;
          case "export_to_excel":
            this._msTypeService.exportToExcel();
            break;
          case "search":
            MsTypeStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            //this.searchOrganizationMsType(SubMenuItemStore.searchText);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.createNewOrganizationMsType();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    SubMenuItemStore.searchText = '';
    MsTypeStore.searchText = '';    

    // Event Emitter Subscription from Add Ms Type Version Component
    this.msTypeVersionSubscriptionEvent = this._eventEmitterService.msTypeVersion.subscribe(res=>{
      setTimeout(() => {
        this.closeMsVersionModal(res);
      }, 100);
    })

    // Event Emitter Subscription from Add Ms Type Component
    this.msTypeSubscriptionEvent = this._eventEmitterService.msType.subscribe(res=>{
      setTimeout(() => {
        this.closemsFormModal();
      }, 100);
    })

    // Event Emitter Subscription from Delete Modal
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      this.delete(item);
    })

    // this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
    //   this.enableScrollbar();
    //   this.closeFileUploadModal();
    // })

    // Event Emitter Subscription for Accordion
    this.itemSelectedSubscription = this._msTypeService.itemChange.subscribe(res=>{
      this.selectedIndex = res;
      this._utilityService.detectChanges(this._cdr);
    });

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex()
      }
    })

    // this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
    //   this.pageChange();
    // })

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    // Form Object to Add Organization Ms Type
    this.form = this._formBuilder.group({
      id:[''],
      ms_type_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ms_type_version_id: ['', [Validators.required]],
      documents:[],
      exclusions_and_justifications: [''],
      // sa1_date:[null],
      // sa2_date: [null],
    });

    SubMenuItemStore.setNoUserTab(true);

    // this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   'organization_ids',
    //   'ms_type_id',
    //   'ms_type_version_id'
    // ]);

    this.pageChange(1);

    //this.getAvailableMsTypes();

    // Get Subsidiary
    this._subsidiaryService.getAllItems(false,'&is_full_list=true').subscribe();

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
  resetFormDetails(){
    this.form.reset();
    this.MsTypeStore.clearCertificateDetails();
    this.MsTypeStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.form.pristine;
    this.formErrors = null;
    this.MsTypeStore.clearDocumentDetails();
    this.clearFIleUploadPopupData();
    this._msTypeService.unsetSpecificVersionList();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  createNewOrganizationMsType(){
    MsTypeStore.setSubMenuHide(false);
    this._msTypeService.unsetSpecificVersionList();
    this.getAvailableMsTypes();
    this.resetFormDetails();
    AppStore.disableLoading();
    this.MsTypeStore.addOrEditFlag = false;   
    this.MsTypeStore.clearCertificateDetails();
    this.MsTypeStore.clearDocumentDetails();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }, 1000);
  }

  // Get Available Ms Types
  getAvailableMsTypes(setFormValue: boolean = false){
    let params = '';
    if(setFormValue) params = '&q='+this._msService.getLastInserted();
    this._msService.getItems(false,params).subscribe(res=>{
      if(setFormValue){
        if(this._msService.getLastInserted()) 
          this.form.patchValue({ms_type_id:this._msService.getLastInserted()});
      }
    });
  }

  // Get Ms Types
  getmsTypes(){
    this._msService.getItems().subscribe();
  }

  /**
   * Get Organization Ms Types
   * @param newPage Page Number
   */
  pageChange(newPage: number = null) {
    // if (newPage) MsTypeStore.setCurrentPage(newPage);
    this._msTypeService.getAllItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 250));
  }

  changePage(newPage: number = null){
    if(newPage) this.page = newPage;
    else this.page = 1;
    this.selectedIndex = 0;
    this._utilityService.scrollToTop();
  }

  /**
   * Search Organization Ms Type
   * @param term Search Term
   */
  // searchOrganizationMsType(term){
  //   this._msTypeService.getItems(true,`?q=${term}`).subscribe(res=>{
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  // Open Modal to Add/Edit Ms Type
  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.mstypeformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.mstypeformModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.mstypeformModal.nativeElement,'overflow','auto');
    }
    if($(this.msversionformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.msversionformModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.msversionformModal.nativeElement,'overflow','auto');
    }
  }

  /**
   * Get Ms Type Versions
   * @param versionType Ms Type Id
   * @param setFormValue Boolean Value - Decide to set value or not 
   */
  getMsTypeVerions(versionType,setFormValue: boolean = false){
    let versionSubscription = null;
    if(versionType != ''){
      if(MsTypeStore.getSelectedMsTypeDetails && this.MsTypeStore.getSelectedMsTypeDetails.ms_type.id == versionType){
        versionSubscription = this._msService.getMsTypeVersionList('/'+versionType+(this._msTypeService.getItem()?'?currentMsTypeVersionId='+this._msTypeService.getItem().ms_type_version.id:''))
      }
      else{
        versionSubscription = this._msService.getMsTypeVersionList('/'+versionType);
      }
      versionSubscription.subscribe((res:any)=>{
        if(res != null) {
          let mstypeVersion = JSON.parse(JSON.stringify(res['data']));
          for(let i of mstypeVersion){
            let versionId = typeof(i.ms_type_verion_id) == 'string' ? parseInt(i.ms_type_verion_id) : i.ms_type_verion_id;
            i.ms_type_verion_id = versionId;
          }
          this._msTypeService.setSpecificVersionList(mstypeVersion);
          if(setFormValue){
            if(this._msVersionService.getLastInserted()) 
              this.form.patchValue({ms_type_version_id:this._msVersionService.getLastInserted()});
          }
          else{
            if(MsTypeStore.getSelectedMsTypeDetails){
              if(MsTypeStore.getSelectedMsTypeDetails?.ms_type.id != versionType)
                this.form.patchValue({ms_type_version_id:null});
              else
                this.form.patchValue({ms_type_version_id: this.MsTypeStore.getSelectedMsTypeDetails.ms_type_version.id});
            }
          }
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  /**
   * Search Ms Type Versions
   * @param e Search Term
   * @param versionType Ms Type
   */
  searchMsTypeVerions(e,versionType){
    this._msService.getMsTypeVersionList('/'+versionType+'?q='+e.term).subscribe((res:any)=>{
      if(res != null) {
        this._msTypeService.setSpecificVersionList(res['data']);
        this._utilityService.detectChanges(this._cdr);
      }
    });
  }

  // Close Form Modal
  closeFormModal() {
    //this._msService.getAvailableMsTypes().subscribe();
    this._msTypeService.unsetItem();
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.scrollToTop();
    this.resetFormDetails();
    this.docID =null;
    this.docVersionID =null
    this._utilityService.detectChanges(this._cdr);
  }

  // Edit Ms Type 
 
  editMsType(msDetails:MsType,event){
    MsTypeStore.setSubMenuHide(true);
    event.stopPropagation();
    this.MsTypeStore.addOrEditFlag = true;
    //var msTypeDetails = MsTypeStore.getMsTypeDetailsById(msDetails.ms_type_id);
    this._msTypeService.unsetItem();
    this.MsTypeStore.clearCertificateDetails();
    this.MsTypeStore.clearDocumentDetails();
    this._msTypeService.getItemDetails(msDetails.id).subscribe(res=>{
      var msTypeDetails = res;
      this.docID = res.kh_document[0]?.versions[0]?.document_id;
        this.docVersionID = res.kh_document[0]?.versions[0]?.id
      this._msTypeService.setItem(msTypeDetails);
      this.searchMsType({term: res.ms_type.id}); 
      // this.searchMsTypeVerions({term: res.ms_type_version.id},res.ms_type.id);
      // Available Ms Type with current ms type
      this.getMsTypeVerions(msTypeDetails.ms_type.id); // Available Ms Type Version with Current Version
      // this.resetFormDetails();
      // AppStore.disableLoading();
      if(res){
        
        setTimeout(() => {
          if(msTypeDetails.kh_document[0]?.versions[0]?.token){
            var logoPreviewUrl = this._documentFileService.getThumbnailPreview('document-version',msTypeDetails.kh_document[0]?.versions[0]?.token);
            var logoDetails = {
                              name: msTypeDetails.kh_document[0]?.versions[0]?.title, 
                              ext: msTypeDetails.kh_document[0]?.versions[0]?.ext,
                              size: msTypeDetails.kh_document[0]?.versions[0]?.size,
                              url: msTypeDetails.kh_document[0]?.versions[0]?.url,
                              token: msTypeDetails.kh_document[0]?.versions[0]?.token,
                              preview: logoPreviewUrl,
                              thumbnail_url: msTypeDetails.kh_document[0]?.versions[0]?.url
                          };
            this._msTypeService.setImageDetails(logoDetails,logoPreviewUrl,'document');
          }
          if(msTypeDetails.documents.length > 0){
            for(let i of msTypeDetails.documents){
              let brochurePreviewUrl = this._msTypeService.getThumbnailPreview('ms-type-organization-document',i.token);
              let brochureDetails = {
                  id: i.id,
                  name: i.title, 
                  ext: i.ext,
                  size: i.size,
                  url: i.url,
                  thumbnail_url: i.url,
                  token: i.token,
                  preview: brochurePreviewUrl,
              };
              this._msTypeService.setImageDetails(brochureDetails,brochurePreviewUrl,'certificate');
            }         
          }
        }, 200);
      setTimeout(() => {
        this.form.patchValue({
          id: msTypeDetails.id ? msTypeDetails.id : '',
          ms_type_id: msTypeDetails.ms_type.id ? msTypeDetails.ms_type.id : '',
          description: msTypeDetails.description ? msTypeDetails.description : '',
          ms_type_version_id: msTypeDetails.ms_type_version.id ? msTypeDetails.ms_type_version.id : '',
          // documents: msTypeDetails.documents ? msTypeDetails.documents : [],
          exclusions_and_justifications: msTypeDetails.exclusions_and_justifications ? msTypeDetails.exclusions_and_justifications: '',
          // sa1_date: msTypeDetails.sa1_date? this._helperService.processDate(msTypeDetails.sa1_date, 'split'): null,
          // sa2_date: msTypeDetails.sa2_date? this._helperService.processDate(msTypeDetails.sa2_date, 'split'): null,
          // organization_id: msTypeDetails.organization.id ? msTypeDetails.organization.id : ''
        });
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 1000);
    }
    })
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.exclusions_and_justifications.replace(regex, "");
    return result.length;
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
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
          var purl = this._msTypeService.getThumbnailPreview('ms-type-organization-document', element.token);
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
    // this.enableScrollbar();
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  // Delete organization ms type after confirmation
  deleteDetails(msTypeId: number,event){
    event.stopPropagation();
    this.deleteObject.id = msTypeId;
    this.deleteObject.type = '';
    this.deleteObject.title = 'Delete Management System Type?';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    // this.deleteObject.subtitle = (type == 'version') ? 'delete_organization_mstype_version' : 'delete_organization_mstype';
    $(this.deletePopup.nativeElement).modal('show');
  }

  removeAttachment(doc) {
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
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Delete Confirmation
   * @param status Status - True or False
   */
  // delete(status: boolean){
  //   if(status && this.deleteObject.id && this.deleteObject.type == ''){
  //     this._msTypeService.deleteItem(this.deleteObject.id).subscribe(resp=>{
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.closeConfirmationPopup();
  //       this.clearDeleteObject();
  //       this.pageChange();
  //     },(error=>{
  //       if(error.status == 405){
  //         this.closeConfirmationPopup();
  //         this.deleteObject.type = 'Deactivate';
  //         this.deleteObject.title = 'Deactivate Ms Type Version?';
  //         this.deleteObject.subtitle = error.error?.message ? error.error?.message : 'deactivate_org_mstype_subtitle' ;
  //         setTimeout(() => {
  //           $(this.deletePopup.nativeElement).modal('show');
  //           this._utilityService.detectChanges(this._cdr);
  //         }, 500);
  //       }
  //     }));
  //   }
  //   else{
  //     if(status){
  //       this._msTypeService.deactivateItem(this.deleteObject.id).subscribe(resp=>{
  //         setTimeout(() => {
  //           this.closeConfirmationPopup();
  //         }, 500);
  //         this.clearDeleteObject();
  //       },(error=>{
  //         // console.log(error);
  //       }));
  //     }
  //     else{
  //       this.closeConfirmationPopup();
  //       this.clearDeleteObject();
  //     }

  //     // this.clearDeleteObject();
  //   }
  //   this.pageChange();
  //   // setTimeout(() => {
  //   //   $(this.deletePopup.nativeElement).modal('hide');
  //   // }, 250);
  // }

  delete(status){
    if(status && this.deleteObject.id){
      this._msTypeService.deleteItem(this.deleteObject.id).subscribe(resp=>{
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);
        this.clearDeleteObject();
        this.pageChange();
      });
    }
    else{
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  closeConfirmationPopup(){
    AppStore.confirmationLoading = false;
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Clear Delete Object
  clearDeleteObject(){
    this.deleteObject.id = null;
  }

  cancel() {
    this.closeFormModal();
  }

  // Save Organization Ms Type
  save(close:boolean=false){ 

      if(MsTypeStore.docDetails){
        this.buttonClicked = ""
      }else{
        this.buttonClicked = "document_is_required"
      }

    this.formErrors = null;
    if (this.form.valid && !this.buttonClicked) {
      let save;
      this.form.value.documents = this._msTypeService.getBrochures()
      this.form.value.name = MsTypeStore.docDetails ? MsTypeStore.docDetails.name : null,
      this.form.value.ext = MsTypeStore.docDetails? MsTypeStore.docDetails.ext : null,
      this.form.value.mime_type = MsTypeStore.docDetails ? MsTypeStore.docDetails.mime_type : null,
      this.form.value.size = MsTypeStore.docDetails ? MsTypeStore.docDetails.size : null,
      this.form.value.url = MsTypeStore.docDetails ? MsTypeStore.docDetails.url : null,
      this.form.value.thumbnail_url = MsTypeStore.docDetails ? MsTypeStore.docDetails.thumbnail_url : null,
      this.form.value.token = MsTypeStore.docDetails ? MsTypeStore.docDetails.token : null,
      this.form.value.is_new = MsTypeStore.docDetails?.is_new ? MsTypeStore.docDetails?.is_new : false,
      this.form.value.is_deleted = MsTypeStore.docDetails?.is_deleted ? MsTypeStore.docDetails?.is_deleted : false,
      this.form.value.document_id = this.form.value.id ? this.docID:null,
      this.form.value.document_version_id = this.form.value.id ? this.docVersionID:null,
      AppStore.enableLoading();
      if (this.form.value.id) {
        let updateParam = {
          ...this.form.value,
          // sa1_date: this.form.value.sa1_date ? this._helperService.processDate(this.form.value.sa1_date, 'join') : null,
          // sa2_date: this.form.value.sa2_date ? this._helperService.processDate(this.form.value.sa2_date, 'join') : null,
        } 
        save = this._msTypeService.updateItem(this.form.value.id, updateParam)
      //  save = this._msTypeService.updateItem(this.form.value.id, this.form.value);
      } else {

        let saveParam = {
          ...this.form.value,
          // sa1_date: this.form.value.sa1_date ? this._helperService.processDate(this.form.value.sa1_date, 'join') : null,
          //  sa2_date: this.form.value.sa2_date ? this._helperService.processDate(this.form.value.sa2_date, 'join') : null,
          // documents: this._msTypeService.getBrochures()
        }

        save = this._msTypeService.saveItem(saveParam) 
        // save = this._msTypeService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._msTypeService.unsetItem();
    MsTypeStore.unsetAllData();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.msTypeVersionSubscriptionEvent.unsubscribe();
    this.itemSelectedSubscription.unsubscribe();
    this.msTypeSubscriptionEvent.unsubscribe();
    // this.filterSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
    // this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

  // Add Ms Type Version
  addMsTypeVersion(){
    //this.getmsTypes();
    //this.resetMsTypeVersionFormDetails();
    setTimeout(() => {
      if(this.form.get('ms_type_id').value){
        // this.msversionform.patchValue({
        //   ms_type_id: this.form.get('ms_type_id').value
        // });
        this.msTypeVersionObject.msType = this.form.get('ms_type_id').value; // Pass Selected MsType Value to component
      }
      this._utilityService.detectChanges(this._cdr);
      $(this.msversionformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 500);
  }

  // Add Ms Type
  addMsType(){
    // this.resetMsTypeFormDetails();
    setTimeout(() => {
      $(this.mstypeformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
    }, 500);
  }

  // Close Ms Form Modal
  closemsFormModal() {
    this.getAvailableMsTypes(true);
    setTimeout(() => {
      $(this.mstypeformModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }, 100);
  }

  // Close Ms Version Form Modal
  closeMsVersionModal(msTypeId) {
    //console.log(msTypeId);
    if(msTypeId) this.getMsTypeVerions(msTypeId,true);
    setTimeout(() => {
      // if(this._msVersionService.getLastInserted()) this.form.patchValue({ms_type_version_id:this._msVersionService.getLastInserted()});
      $(this.msversionformModal.nativeElement).modal('hide');
      this.msTypeVersionObject.msType = null;
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','999999');
    }, 150);
  }


  // Search Available Ms Types
  searchAvailableMsType(event){
    // this._msService.getAvailableMsTypes('?q='+event.term).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // });
    MsTypeMasterStore.setCurrentPage(1);
    this._msService.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Search All Ms Types
  searchMsType(event){
    this._msService.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  selectedIndexChange(index){
    if(this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


   // * File Upload/Attach Modal

  //  openFileUploadModal() {
  //   setTimeout(() => {
  //     fileUploadPopupStore.openPopup = true;
  //     $('.modal-backdrop').add();
  //     document.body.classList.add('modal-open')
  //     this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
  //     this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
  //     setTimeout(() => {
  //       this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
  //       // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
  //       this._utilityService.detectChanges(this._cdr)
  //     }, 100);
  //   }, 250);
  // }
  // closeFileUploadModal() {
  //   setTimeout(() => {
  //     fileUploadPopupStore.openPopup = false;
  //     document.body.classList.remove('modal-open')
  //     this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
  //     this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
  //     $('.modal-backdrop').remove();
  //     setTimeout(() => {
  //       this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
  //       // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
  //       this._utilityService.detectChanges(this._cdr)
  //     }, 200);
  //   }, 100);
  // }

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

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "ms-type-organization-document":
      this._msTypeService.downloadFile(
        type,
        document.ms_type_organization_id,
        document.id,
        null,
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

viewDocument(type, documents, documentFile) {
  switch (type) {
    case "ms-type-organization-document":
      this._msTypeService
        .getFilePreview(type, documents.ms_type_organization_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
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

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
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


  }
}

openPreviewModal(type, filePreview, documentFiles, document) {
  this.previewObject.component=type
  let previewItem = null;
  if (filePreview) {
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = documentFiles;
    this.previewObject.componentId = document.ms_type_organization_id;
    this.previewObject.uploaded_user =
    document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }
}

*// Closes from preview
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
}

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  console.log('eve',event);
  
  if(event.key == 'Escape' || event.code == 'Escape'){
    if($(this.filePreviewModal.nativeElement).hasClass('show'))
        this.closePreviewModal(null);
    else if($(this.fileUploadModal.nativeElement).hasClass('show')){
        this.enableScrollbar();
        // this.closeFileUploadModal();
    }
    else if($(this.mstypeformModal.nativeElement).hasClass('show')){
      this.closemsFormModal();
    }
    else if($(this.msversionformModal.nativeElement).hasClass('show')){
      this.closeMsVersionModal(this.msTypeVersionSubscriptionEvent);
    }
    else{
        this.cancel();
    }     
  }
}

  // Handles File Changes
  onFileChange(event,type:string){
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,'support-file')){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = '?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams)
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
                if(type != 'certificate') $("#file").val('');
                else $("#myfile").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
                    this.createImageFromBlob(prew,temp,type);
                
                },(error)=>{
                  if(type != 'certificate') $("#file").val('');
                  else $("#myfile").val('');
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            if(type != 'certificate') $("#file").val('');
            else $("#myfile").val('');
            let errorMessage = "";
            if(error.error?.errors?.hasOwnProperty('file'))
              errorMessage = error.error.errors.file;
            else errorMessage = 'file_upload_failed';
            this._utilityService.showErrorMessage('failed', errorMessage);
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          if(type != 'certificate') $("#file").val('');
          else $("#myfile").val('');
          this.assignFileUploadProgress(null,file,true);
        }
      })
    }
  }

    /**
   * 
   * @param progress File Upload Progress
   * @param file Selected File
   * @param success Boolean value whether file upload success 
   */
    assignFileUploadProgress(progress,file,success = false){
      let temporaryFileUploadsArray = this.fileUploadsArray;
      this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress,file,success,temporaryFileUploadsArray);
    }

    checkLogoIsUploading(){
      return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
    }
  
    // Check any upload process is going on
    checkFileIsUploading(){
      return this._helperService.checkFileisUploaded(this.fileUploadsArray);
    }

      /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files,type){
    var result = this._helperService.addItemsToFileUploadProgressArray(files,type,this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

   /**
   * Convert Blob file to base64 string
   * @param image blob file 
   * @param imageDetails other details of file 
   * @param type type of file - logo of brochure
   */
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if(imageDetails){
        imageDetails['preview'] = logo_url;
        this._msTypeService.setImageDetails(imageDetails,logo_url,type);
      }
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  checkForFileUploadsScrollbar(){
    if(MsTypeStore.getBrochureDetails.length >= 5 || (this.fileUploadsArray.length > 5 && MsTypeStore.getBrochureDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + MsTypeStore.getBrochureDetails.length) >= 5)){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  removeBrochure(token){
    MsTypeStore.unsetFileDetails('brochure',token);
    this._utilityService.detectChanges(this._cdr);
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

}
