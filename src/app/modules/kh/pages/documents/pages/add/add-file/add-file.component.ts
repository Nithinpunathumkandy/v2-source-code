import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from "mobx";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentSubCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-sub-categories-store';
import { DocumentSubSubCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-sub-sub-categories-store';
import { DocumentCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-category-store';
import { DocumentFamilyMasterStore } from 'src/app/stores/masters/knowledge-hub/document-family-store';
import { IndustryMasterStore } from 'src/app/stores/masters/general/industry-store';
import { RegionMasterStore } from 'src/app/stores/masters/general/region-store';
import { CountryMasterStore } from 'src/app/stores/masters/general/country-store';
import { TagMasterStore } from 'src/app/stores/masters/knowledge-hub/tag-store';
import { DocumentFamilyService } from 'src/app/core/services/masters/knowledge-hub/document-family/document-family.service';
import { DocumentCategoryService } from 'src/app/core/services/masters/knowledge-hub/document-category/document-category.service';
import { DocumentSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-categories/document-sub-categories.service';
import { DocumentSubSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.service';
import { IndustryService } from 'src/app/core/services/masters/general/industry/industry.service';
import { CountryService } from 'src/app/core/services/masters/general/country/country.service';
import { RegionService } from 'src/app/core/services/masters/general/region/region.service';
import { TagService } from 'src/app/core/services/masters/knowledge-hub/tag/tag.service';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { WorkFlowStore } from 'src/app/stores/knowledge-hub/work-flow/workFlow.store';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { DocumentFamilyPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-family';
import { TagPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/tag';
import { DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { AuthStore } from 'src/app/stores/auth.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { DocumentAccessTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-access-type-store';
import { DocumentAccessTypeService } from 'src/app/core/services/masters/knowledge-hub/document-access-type/document-access-type.service';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { DesignationPaginationResponse } from 'src/app/core/models/masters/human-capital/designation';
import { Router } from '@angular/router';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { IndustryPaginationResponse } from 'src/app/core/models/masters/general/industry';
import { DocumentCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-category';
import { DocumentSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-categories';
import { DocumentSubSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-sub-categories';
import { DocumentStatusService } from 'src/app/core/services/masters/knowledge-hub/document-status/document-status.service';
import { TemplateStore} from 'src/app/stores/knowledge-hub/templates/templates.store';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentReviewFrequenciesService } from 'src/app/core/services/masters/knowledge-hub/document-review-frequencies/document-review-frequencies.service';
import { DocumentReviewFrequenciesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-review-frequencies-store';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {

  
  // Reference Variables
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild("suportUploadArea", { static: false }) supportUploadArea: ElementRef;
  @ViewChild("documentTypesModal") documentTypesModal: ElementRef;
  @ViewChild("documentCategoryModal") documentCategoryModal: ElementRef;
  @ViewChild("documentSubCategoryModal") documentSubCategoryModal: ElementRef;
  @ViewChild("documentSubSubCategoryModal") documentSubSubCategoryModal: ElementRef;
  @ViewChild("documentFamily") documentFamily: ElementRef;
  @ViewChild("industryModal") industryModal: ElementRef;
  @ViewChild("documentTags") documentTags: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @ViewChild("designationModal") designationModal: ElementRef;
  @ViewChild("templateModal") templateModal: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  // Form Variables
  documentForm: FormGroup;
  documentFormErrors: any;
  workflowType:any = null;
  workflowError:any



  processedDocumentStatusArray = [];
  documentTypeId: number;
  displayForm: any = null;
  saveData: any = null;
  selectedAccessType: number = null;
  editCheck: boolean = false;
  isShared: boolean = false;

  supportFIleArray : any = [];
  versionFIleArray: any = [];


  view_more_purpose: boolean = false;
  view_more_description: boolean = false;
  showWorkflowMessage: boolean = false
  template_document_type:number=0
  templateMessage:string

  // *Variables to handle Template/Custom
  templatePopup: boolean = false;
  customCheck:boolean = true;
  // *Variables to handle Template/Custom

  workflowEnable:boolean = false;
  //Multi Form General Variables
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";

  // Other Variables
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsTypeStore = MsTypeStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  DocumentCategoryMasterStore = DocumentCategoryMasterStore;
  DocumentSubCategoryMasterStore = DocumentSubCategoryMasterStore;
  DocumentSubSubCategoryMasterStore = DocumentSubSubCategoryMasterStore;
  DocumentFamilyMasterStore = DocumentFamilyMasterStore;
  IndustryMasterStore = IndustryMasterStore;
  RegionMasterStore = RegionMasterStore;
  CountryMasterStore = CountryMasterStore;
  DocumentTagMasterStore = TagMasterStore;
  DocumentsStore = DocumentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  WorkFlowStore = WorkFlowStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  DocumentAccessTypeMasterStore = DocumentAccessTypeMasterStore;
  DesignationMasterStore = DesignationMasterStore;
  TemplateStore = TemplateStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  KHSettingStore=KHSettingStore;
  fileUploadPopupStore = fileUploadPopupStore;
  DocumentReviewFrequenciesMasterStore = DocumentReviewFrequenciesMasterStore
  // File Upload Variables
  fileUploadProgress = 0;
  documentVersionFile: any;

  // Event Subscriptions
  documentTypeEventSubscription: any = null;
  documentCategorySubscriptionEvent: any = null;
  documentSubCategorySubscriptionEvent: any = null;
  documentSubSubCategorySubscriptionEvent: any = null;
  documentFamilySubscriptionEvent: any = null; 
  industrySubscriptionEvent: any = null;
  tagSubscriptionEvent: any = null;
  designationEventSubscription: any = null;
  cancelEventSubscription: any = null;
  khTemplateModalSubscription: any = null;
	fileUploadPopupSubscriptionEvent: any = null;
  organisationChangesModalSubscription: any = null;
  // Form Confirmation Object

  formObject = {
    0:[
      'document_access_type_id',
      'title',
      'owner_id'
    ],
    1:[],
    2:[
      'document_access_type_id'
    ],


  }

  templateObject={
    component: 'Document',
    values: null,
    type: null
  }

  categorySelect={
    readOnlyStatus: true, 
    document_category_ids:null,
    document_sub_category_ids:null,
    values:null
  }

  // Confirmation object

  confirmationObject = { 
    title: 'Cancel?',
    subtitle: 'Are you sure you want to cancel?',
    type: 'Cancel'
  };

  public previewDate
  public todayDate
  pipe = new DatePipe('en-US');

  months = [
    { title: 'Jan', id: 1 },
    { title: 'Feb', id: 2 },
    { title: 'Mar', id: 3 },
    { title: 'Apr', id: 4 },
    { title: 'May', id: 5 },
    { title: 'Jun', id: 6 },
    { title: 'Jul', id: 7 },
    { title: 'Aug', id: 8 },
    { title: 'Sep', id: 9 },
    { title: 'Oct', id: 10 },
    { title: 'Nov', id: 11 },
    { title: 'Dec', id: 12 }
];
  openModelPopup: boolean;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _documentTypeService: DocumentTypesService,
    private _eventEmitterService: EventEmitterService,
    private _documentFamilyService: DocumentFamilyService,
    private _documentCategoryService: DocumentCategoryService,
    private _documentSubCategoryService: DocumentSubCategoriesService,
    private _documentSubSubCategoryService: DocumentSubSubCategoriesService,
    private _industryService: IndustryService,
    private _countryService: CountryService,
    private _regionService: RegionService,
    private _documentTagService: TagService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _msTypeService: MstypesService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _documentService: DocumentsService,
    private _workFlowService: WorkflowService,
    private _khFileService: KhFileServiceService,
    private _usersService: UsersService,
    private _documentAccessTypeService:DocumentAccessTypeService,
    private _designationService: DesignationService,
    private _router: Router,
    private _documentFileService:DocumentFileService,
    private _documentStatusService: DocumentStatusService,
    private _organizationModuleService: OrganizationModulesService,
    private _khSettingService:KhSettingsService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _documentReviewFrequenciesService:DocumentReviewFrequenciesService,

  ) {}

  ngOnInit(): void {
    AppStore.disableLoading();
    AppStore.showDiscussion = false;
		setTimeout(() => {
			this.enableScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, 50);
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'close_doc':
            
            this.closeDocument()
            
            break;
            
            
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setTimeout(() => {
      //   this.processForm.pristine;
      // }, 250);
    });

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([{ type: "close_doc" }]);




    // Form Intialization

    this.documentForm = this._formBuilder.group({
      id: null,
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: '',
      document_type_id: [null],
      purpose: '',
      document_id: [""],
      document_access_type_id: [""],
      document_category_ids: [null],
      document_sub_category_ids: [null],
      document_sub_sub_category_ids: [null],
      document_family_ids: [null],
      country_ids: [null],
      region_ids: [null],
      ms_type_organization_id: null,
      ms_type_organization_ids: [null],
      designation_ids: [null],
      user_ids: [null],
      tag_ids: [null],
      industry_ids: [null],
      name: [""],
      ext: [""],
      mime_type: [""],
      size: [""],
      url: [""],
      thumbnail_url: [""],
      token: [""],
      version: ["1"],
      document_files: [""],
      organization_ids: [null],
      section_ids: [null],
      sub_section_ids: [null],
      division_ids: [null],
      department_ids: [null],
      document_status_id: null,
      is_assessment_required:[''],
      document_review_frequency_id:[null],
      review_user_id:[null],
      expiry_date:[null],
      owner_id:[null,Validators.required],
      document_organization_ids: [null],
      document_section_ids: [null],
      document_sub_section_ids: [null],
      document_division_ids: [null],
      document_department_ids: [null],
    });

           //Function Call to Get All Initial Data
           this.getAllData();


    

    window.addEventListener("scroll", this.scrollEvent, true);

    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    // Event Subscriptions

    this.documentTypeEventSubscription = this._eventEmitterService.documentTypesControl.subscribe(
      (res) => {
        this.closeDocModal();
      }
    );

    this.documentCategorySubscriptionEvent = this._eventEmitterService.documentCategoryControl.subscribe(res => {
      this.closeDocCategoryModal();
    })

    this.documentSubCategorySubscriptionEvent = this._eventEmitterService.documentSubCategoryControl.subscribe(res => {
      this.closeDocumentSubCategoryModal();
    })

    this.documentSubSubCategorySubscriptionEvent = this._eventEmitterService.documentSubSubCategoryControl.subscribe(res => {
      this.closeDocumentSubSubCategoryModal();
    })

    this.tagSubscriptionEvent = this._eventEmitterService.documentTagControl.subscribe(res => {
      this.closeDocumentTagModal();
    })

    this.documentFamilySubscriptionEvent = this._eventEmitterService.documentFamilyControl.subscribe(res => {
      this.closedocumentFamilyModal();
    })

    this.industrySubscriptionEvent = this._eventEmitterService.industryControl.subscribe(res => {
      this.closeIndustryModal();
    })

    this.designationEventSubscription = this._eventEmitterService.designationControl.subscribe(res => {
      this.closeDesignationModal();
    })

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelDocument(item);
    })
    this.khTemplateModalSubscription = this._eventEmitterService.KHTemplateModal.subscribe(res => {
      this.closeTemplatePopup();
    })

    this.documentForm.get('document_type_id').valueChanges.subscribe(val=>{
      this.template_document_type=val?.id      
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );




    // Intially Getting Data for Form
    this.getDocumentTypes();
    // Get KHSettings Data 

    this.getKHSettingsData();



   //  * Checking for parent data status 
   if(DocumentsStore.parentDataStatus)
   this.setParentAccessData()
 else
      this.selectAccessType(DocumentsStore.selectedSideMenu == 'private' ? 1 : DocumentsStore.selectedSideMenu == 'public' ? 2 : DocumentsStore.selectedSideMenu == 'shared' ? 3 : 1)

      if(DocumentsStore.selectedSideMenuType=='doc_type')
      this.setIntialDocumentType()

              // In case of edit
              if(this._router.url.indexOf('edit-document') != -1){
                if(DocumentsStore.documentDetails)
                  this.setDataForEdit();
                else
                  this._router.navigateByUrl('/knowledge-hub/documents');
              }else {
                this.setDocumentOwner()
                this.setInitialOrganizationLevels();
              }
    

  this.documentForm.get('expiry_date').valueChanges.subscribe(val => {
      if (val) {        
      this.previewDate=  this._helperService.processDate(val, 'join')
      }
    });
    
    var date=new Date()                
    var monthName=this.months[date.getMonth()]    
    this.todayDate = { year: date.getFullYear(), month: monthName.id, day:date.getDate() };    
  }

  // To Disable Template if it's it disabled from the Menu.

  getTemplate(){
    let val:boolean
    const value2= OrganizationModulesStore.organizationModules.filter(data=>{      
      if(data.title=='Knowledge Hub'){        
        val= data.modules.some( vendor => vendor['module_id'] === 17401 )
      }      
    })    
    return val
  }

  setIntialDocumentType(){
    this.documentForm.patchValue({
      "document_type_id":DocumentsStore.selectedSideMenu
    })
  }

  getKHSettingsData(){

    this._khSettingService.getItems().subscribe(res=>{
      if(res.knowledge_hub_setting_type.type=='internal')
      this.setCustom(false)
    })
 
  }
  closeDocument() {
    
    if (DocumentsStore.fileUploadType == 'Edit')
    { this._router.navigateByUrl("/knowledge-hub/documents/"+DocumentsStore.documentId);
        this.clearConfirmationObject();
    }
    else {       
      this._router.navigateByUrl("/knowledge-hub/documents");
    }   

  }

  setDocumentOwner(){
    this.documentForm.patchValue({
      owner_id:AuthStore.user
    })
  }
  setInitialOrganizationLevels() {

    

    this.documentForm.patchValue({
      document_division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      document_department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
      document_section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
      document_sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      document_organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
    });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.documentForm.value.document_division_ids });
    this.searchDepartment({ term: this.documentForm.value.document_department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.documentForm.value.document_section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.documentForm.value.document_sub_section_ids });
    this._utilityService.detectChanges(this._cdr);
  }
    // * Setting Parent Access Data.

    setParentAccessData() {
    
      // ! Private == 1 || Public == 2 || Shared == 3
  
      let accessData=DocumentsStore.ParentData.accessData;
  
      this.selectAccessType(DocumentsStore.ParentData.accessId)
      if (DocumentsStore.ParentData.accessId == 3) {
        this.documentForm.patchValue({
          organization_ids: accessData.org_ids,
          section_ids:accessData.section_ids,
          sub_section_ids:accessData.sub_section_ids,
          division_ids:accessData.division_ids,
          department_ids:accessData.department_ids,
          designation_ids:accessData.designation_ids,
          user_ids:accessData.user_ids
        })
      }
  
    }

  /// ~--------------Mutli Form Start----------------~ //

  nextPrev(n) {
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    // if (n == 1 && !validateForm()) return false;

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";

    if(!KHSettingStore?.khSettingsItems?.is_document_workflow){
      if(this.currentTab == 2 && n > 0) this.currentTab = 4;
      else if(this.currentTab == 4 && n < 0) this.currentTab = 2;
      else this.currentTab = this.currentTab + n;
    }
    else{
      this.currentTab = this.currentTab + n
    }

    // this.currentTab = this.currentTab + n
    
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.createDocumentSaveData();
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.createDocument();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  
  changeStep(step) {
    

    if(step > this.currentTab &&  this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }

    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  

  }


  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
      this.displayForm = this.documentForm.value;
      this.getSelectedValues();
      // this.createDocumentSaveData();
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
      //document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  // Setting Intial Tab

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }
  
  getAllData() {
    
    this.getDocumentStatus();
    this.getSubsidiary();
    this.getDocumentTypes();
    this.getDocumentCategories();
    this.getIndustries();
    this.getRegions();
    this.getCountries();
    this.getDocumentFamilies();
    this.getMsTypes();
    this.getDocumentTags();
    this.getDocumentAccessTypes();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);

  }

  createDocumentSaveData() {

    if (TemplateStore.activeTemplate)
      this.documentVersionFile = null;
    else
      this.documentVersionFile = DocumentsStore.getVersionFile;

      if(this.selectedAccessType!=3)
      {
        this.resetSharedData()
      }

    this.saveData = {
      "id": this.displayForm.id ? this.displayForm.id : '',
      "title": this.displayForm.title ? this.displayForm.title : '',
      "description": this.displayForm.description ? this.displayForm.description : '',
      "purpose": this.displayForm.purpose ? this.displayForm.purpose : '',
      "document_id": DocumentsStore.documentId ? DocumentsStore.documentId : null,
      "document_access_type_id": this.selectedAccessType ? this.selectedAccessType : '',
      "version": this.displayForm.version?this.displayForm.version:'',
      "document_type_id":this.displayForm.document_type_id?this.displayForm.document_type_id.id:null,
      "document_review_frequency_id":this.displayForm.document_review_frequency_id?this.displayForm.document_review_frequency_id.id:null,
      "review_user_id":this.documentForm.value.review_user_id?this.documentForm.value.review_user_id.id:null,
      "expiry_date": this.displayForm.expiry_date ? this._helperService.processDate(this.displayForm.expiry_date, 'join') : '',
      "ms_type_organization_id" : this.displayForm.ms_type_organization_id ?  this.displayForm.ms_type_organization_id.id  : null,
      "document_category_ids": [],
      "document_sub_category_ids": [],
      "document_sub_sub_category_ids": [],
      "document_family_ids":[],
      "country_ids":[],
      "region_ids":[],
      "ms_type_organization_ids":this.displayForm?.ms_type_organization_ids?this.displayForm.ms_type_organization_ids:[],
      "designation_ids":[],
      "user_ids":[],
      "tag_ids":[],
      "industry_ids": [],
      "name": this.documentVersionFile?.name?this.documentVersionFile.name:null,
      "ext": this.documentVersionFile?.ext?this.documentVersionFile.ext:null,
      "mime_type": this.documentVersionFile?.mime_type?this.documentVersionFile.mime_type:null,
      "size": this.documentVersionFile?.size?this.documentVersionFile.size:null,
      "url": this.documentVersionFile?.url?this.documentVersionFile.url:null,
      "thumbnail_url": this.documentVersionFile?.thumbnail_url?this.documentVersionFile.thumbnail_url:null,
      "token": this.documentVersionFile?.token?this.documentVersionFile.token:null,
      // "document_files": DocumentsStore?.getSupportFile?DocumentsStore.getSupportFile:[],
      "organization_ids":[],
      "section_ids":[],
      "sub_section_ids":[],
      "division_ids": [],
      "department_ids": [],
      "document_status_id": this.displayForm.document_status_id ? this.displayForm.document_status_id : 7,
      "is_workflow":KHSettingStore?.khSettingsItems?.is_document_workflow?KHSettingStore?.khSettingsItems?.is_document_workflow:false,
      "is_assessment_required": this.displayForm.is_assessment_required ? this.displayForm.is_assessment_required : false,
      "owner_id":this.displayForm?.owner_id?this.displayForm.owner_id.id:null,
      "document_organization_ids":this.displayForm.document_organization_ids && this.displayForm.document_organization_ids.length > 0? this._helperService.getArrayProcessed(this.displayForm.document_organization_ids,'id'):[],
      "document_section_ids":this.displayForm.document_section_ids && this.displayForm.document_section_ids.length > 0? this._helperService.getArrayProcessed(this.displayForm.document_section_ids,'id'):[],
      "document_sub_section_ids":this.displayForm.document_sub_section_ids && this.displayForm.document_sub_section_ids.length > 0? this._helperService.getArrayProcessed(this.displayForm.document_sub_section_ids,'id'):[],
      "document_division_ids":this.displayForm.document_division_ids && this.displayForm.document_division_ids.length > 0? this._helperService.getArrayProcessed(this.displayForm.document_division_ids,'id'):[],
      "document_department_ids":this.displayForm.document_department_ids && this.displayForm.document_department_ids.length > 0? this._helperService.getArrayProcessed(this.displayForm.document_department_ids,'id'):[],

    };

    if(KHSettingStore?.khSettingsItems?.is_document_workflow){
      this.saveData['document_status_id']=this.displayForm.document_status_id ? this.displayForm.document_status_id : 1
    }
    else
    this.saveData['document_status_id']=7

    if (this.displayForm.id) {
			this.saveData['document_files'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
		} else{
			this.saveData['document_files'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save',"KH");
		}

    if (TemplateStore.activeTemplate) {
      this.saveData = {
        ...this.saveData,
        "document_template_id":TemplateStore.getActiveTemplate.id
      }
      }



    if(this.displayForm.document_category_ids && this.displayForm.document_category_ids.length > 0){
      this.saveData.document_category_ids = this._helperService.getArrayProcessed(this.displayForm.document_category_ids,'id');
    }
    else{
      this.saveData.document_category_ids = [];
    }
    if(this.displayForm.document_sub_category_ids && this.displayForm.document_sub_category_ids.length > 0){
      this.saveData.document_sub_category_ids = this._helperService.getArrayProcessed(this.displayForm.document_sub_category_ids,'id');
    }
    else{
      this.saveData.document_sub_category_ids = [];
    }

    if(this.displayForm.document_sub_sub_category_ids && this.displayForm.document_sub_sub_category_ids.length > 0){
      this.saveData.document_sub_sub_category_ids = this._helperService.getArrayProcessed(this.displayForm.document_sub_sub_category_ids,'id');
    }
    else{
      this.saveData.document_sub_sub_category_ids = [];
    }

    if(this.displayForm.document_family_ids && this.displayForm.document_family_ids.length > 0){
      this.saveData.document_family_ids = this._helperService.getArrayProcessed(this.displayForm.document_family_ids,'id');
    }
    else{
      this.saveData.document_family_ids = [];
    }
    if(this.displayForm.country_ids && this.displayForm.country_ids.length > 0){
      this.saveData.country_ids = this._helperService.getArrayProcessed(this.displayForm.country_ids,'id');
    }
    else{
      this.saveData.country_ids = [];
    }
    if(this.displayForm.region_ids && this.displayForm.region_ids.length > 0){
      this.saveData.region_ids = this._helperService.getArrayProcessed(this.displayForm.region_ids,'id');
    }
    else{
      this.saveData.region_ids = [];
    }
    if(this.displayForm.designation_ids && this.displayForm.designation_ids.length > 0){
      this.saveData.designation_ids = this._helperService.getArrayProcessed(this.displayForm.designation_ids,'id');
    }
    else{
      this.saveData.designation_ids = [];
    }
    if(this.displayForm.user_ids && this.displayForm.user_ids.length > 0){
      this.saveData.user_ids = this._helperService.getArrayProcessed(this.displayForm.user_ids,'id');
    }
    else{
      this.saveData.user_ids = [];
    }
    if(this.displayForm.tag_ids && this.displayForm.tag_ids.length > 0){
      this.saveData.tag_ids = this._helperService.getArrayProcessed(this.displayForm.tag_ids,'id');
    }
    else{
      this.saveData.tag_ids = [];
    }
    if(this.displayForm.industry_ids && this.displayForm.industry_ids.length > 0){
      this.saveData.industry_ids = this._helperService.getArrayProcessed(this.displayForm.industry_ids,'id');
    }
    else{
      this.saveData.industry_ids = [];
    }
    if (this.displayForm.organization_ids && this.displayForm.organization_ids.length > 0) {
      this.saveData.organization_ids = this._helperService.getArrayProcessed(this.displayForm.organization_ids, 'id');
    }
    else {
      this.saveData.organization_ids = [];
    }
      if(this.displayForm.section_ids && this.displayForm.section_ids.length > 0){
        this.saveData.section_ids = this._helperService.getArrayProcessed(this.displayForm.section_ids,'id');
      }
      else{
        this.saveData.section_ids = [];
      }
      if(this.displayForm.sub_section_ids && this.displayForm.sub_section_ids.length > 0){
        this.saveData.sub_section_ids = this._helperService.getArrayProcessed(this.displayForm.sub_section_ids,'id');
      }
      else{
        this.saveData.sub_section_ids = [];
      }
      if(this.displayForm.division_ids && this.displayForm.division_ids.length > 0){
        this.saveData.division_ids = this._helperService.getArrayProcessed(this.displayForm.division_ids,'id');
      }
      else{
        this.saveData.division_ids = [];
      }
      if(this.displayForm.department_ids && this.displayForm.department_ids.length > 0){
        this.saveData.department_ids = this._helperService.getArrayProcessed(this.displayForm.department_ids,'id');
      }
      else{
        this.saveData.department_ids = [];
      }
      
      
   // console.log(this.saveData)
    
    
  }

    // Save or Update Issue
    createDocument(){
      let save: any;
      AppStore.enableLoading();
      this.nextButtonText = "Loading";
      this.previousButtonText = "Loading";
      if(this.saveData.id){
        save = this._documentService.updateItem(this.saveData.id,this.saveData);
      }
      else{
       save = this._documentService.saveItem(this.saveData);
      }
      save.subscribe(res=>{
        AppStore.disableLoading();
        if(this.saveData.id)
          this._router.navigateByUrl('/knowledge-hub/documents/'+this.saveData.id);
        else
          this._router.navigateByUrl('/knowledge-hub/documents/'+res.id);
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        if (err.status == 422) {
          //console.log(err)
          this.documentFormErrors = err.error.errors;
          this.workflowError=err.error.message
          this.currentTab = 0;
          this.nextButtonText = "Next";
          this.previousButtonText = "Previous";
          this.setInitialTab();
          this.showTab(this.currentTab);
          this._utilityService.detectChanges(this._cdr);
        }
      })
  }
  
  setDataForEdit() {
    this.editCheck = true;
    DocumentsStore.clearSupportFiles();
    DocumentsStore.clearVersionFile();
    var documentDetails = DocumentsStore.documentDetails;

    
  documentDetails.versions.forEach(element => {
    if (element && element.token) {
          var purl = this._documentFileService.getThumbnailPreview('document-version', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size:element.size,
            url: element.url,
            token: element.token,
            thumbnail_url:element.thumbnail_url,
            preview: purl,
            id: element.id
          }
        }
        this._documentService.setVersionFile(lDetails,purl)
        
  });
    
  documentDetails.files.forEach(element => {
    if (element && element.token) {
          var purl = this._documentFileService.getThumbnailPreview('document-file', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size:element.size,
            url: element.url,
            token: element.token,
            thumbnail_url:element.thumbnail_url,
            preview: purl,
            id: element.id
          }
        }
    this._documentService.setSupportFile(lDetails, purl)
  });
    
    // this.checkForFileUploadsScrollbar();
    
      // Setting Access Type
    
      this.selectedAccessType=documentDetails.document_access_type.id

    this.documentForm.patchValue({

      id: documentDetails.id ? documentDetails.id : '',
      description: documentDetails.description ? documentDetails.description : '',
      title:documentDetails.title?documentDetails.title:'',
      document_type_id:documentDetails.document_type?documentDetails.document_type:null,
      purpose:documentDetails.purpose?documentDetails.purpose:'',
      document_id:DocumentsStore.documentId?DocumentsStore.documentId:null,
      document_access_type_id:this.selectedAccessType?this.selectedAccessType:null,
      document_category_ids:documentDetails.document_categories?this.getEditValue(documentDetails.document_categories):[],
      document_sub_category_ids:documentDetails.document_sub_categories?this.getEditValue(documentDetails.document_sub_categories):[],
      document_sub_sub_category_ids:documentDetails.document_sub_sub_categories?this.getEditValue(documentDetails.document_sub_sub_categories):[],
      document_family_ids:documentDetails.document_families?this.getEditValue(documentDetails.document_families):[],
      country_ids:documentDetails.countries?this.getEditValue(documentDetails.countries):[],
      region_ids:documentDetails.regions?this.getEditValue(documentDetails.regions):[],
      ms_type_organization_ids:documentDetails.ms_type_organizations?this.getMsTypeVersion(documentDetails.ms_type_organizations):[],
      designation_ids:documentDetails.designations?this.getEditValue(documentDetails.designations):[],
      user_ids: documentDetails.users?this.getEditValue(documentDetails.users):[],
      tag_ids:documentDetails.tags?this.getEditValue(documentDetails.tags):[],
      industry_ids: documentDetails.industries?this.getEditValue(documentDetails.industries):[],
      version: documentDetails.versions?documentDetails.versions[0].version:'',
      organization_ids:documentDetails.organizations?this.getEditValue(documentDetails.organizations):[],
      section_ids:documentDetails.sections?this.getEditValue(documentDetails.sections):[],
      sub_section_ids:documentDetails.sub_sections?this.getEditValue(documentDetails.sub_sections):[],
      division_ids:documentDetails.divisions?this.getEditValue(documentDetails.divisions):[],
      department_ids:documentDetails.departments?this.getEditValue(documentDetails.departments):[],
      ms_type_organization_id : documentDetails.ms_type_organization ? documentDetails.ms_type_organization : null

    })
    
  }

    // Returns Values as Array
  getEditValue(field){
      var returnValue = [];
    for (let i of field) {
      returnValue.push(i)
    }
      return returnValue;
  }
  
  getMsTypeVersion(field) {
    
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id)
    }
      return returnValue;

  }

  // ~--------------Mutli Form End----------------~ //

  // Getting Required Data for Form

  getDocumentStatus() {
    this._documentStatusService.getAllItems().subscribe(res => {
   
      res.forEach(data => {     
        if (data.id == 1 || data.id == 7) {
          this.processedDocumentStatusArray.push(data)
        }             
      })
    })
  }

  getDocumentAccessTypes() {
    this._documentAccessTypeService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getUsers() {

    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getWorkflow() {
    WorkFlowStore.unsetWorkFlowDetails()
    if (this.documentTypeId) {
      this._workFlowService.getWorkflow(true, WorkFlowStore.moduleGroupId, this.documentTypeId).subscribe(res => {
          this.setWorkflowMessage(res)
      })
    }
  }

  getWorkFlowDetails(id) {
    this.workflowType='Preview'
    this._workFlowService.getItemById(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setWorkflowMessage(response) {

    if (response.data.length > 0) {
     
      let workflowId =  response.data[response.data.length-1].id
      this.getWorkFlowDetails(workflowId)
      this.showWorkflowMessage = false;
    }  
    else
      this.showWorkflowMessage = true;
    
    this._utilityService.detectChanges(this._cdr)
  }

  getSubsidiary() {
    this._subsidiaryService
      .getAllItems(false)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getDepartment(){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      this._departmentService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision(){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DivisionStore.setAllDivision([]);
    }
  }

  getDesignation() {
    this._designationService.getItems(false,'access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSection(){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.documentForm.get('department_ids').value)
      this._sectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SectionStore.setAllSection([]);
    }
  }

  getSubSection(){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.documentForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.documentForm.get('section_ids').value)
      this._subSectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  getDocumentTypes() {
    this._documentTypeService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDocumentCategories() {
    this._documentCategoryService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDocumentSubCategories() {
    console.log(this.documentForm.value.document_category_ids)
    if(this.documentForm.get('document_category_ids').value && this.documentForm.get('document_category_ids').value.length > 0){
      var params = '';
      params = '&document_category_ids='+this._helperService.createParameterFromArray(this.documentForm.get('document_category_ids').value)
      this._documentSubCategoryService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DocumentSubCategoryMasterStore.setAllDocumentSubCategories([]);
    }
  }

  getDocumentSubSubCategoires() {
    if(this.documentForm.get('document_category_ids').value && this.documentForm.get('document_category_ids').value.length > 0 && this.documentForm.get('document_sub_category_ids').value && this.documentForm.get('document_sub_category_ids').value.length > 0){
      var params = '';
      params = '&document_category_ids=' + this._helperService.createParameterFromArray(this.documentForm.get('document_category_ids').value)
      +'&document_sub_category_ids='+this._helperService.createParameterFromArray(this.documentForm.get('document_sub_category_ids').value)
      this._documentSubSubCategoryService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DocumentSubSubCategoryMasterStore.setAllDocumentSubSubCategories([]);
    }
  }

  getIndustries() {
    this._industryService.getItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getRegions() {
    this._regionService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getCountries() {
    if(this.documentForm.get('region_ids').value && this.documentForm.get('region_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.documentForm.get('region_ids').value);
      this._countryService.getItems(false,'&region_ids='+parameters).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.CountryMasterStore.setAllCountries([]);
    }
  }

  getDocumentFamilies() {
    this._documentFamilyService.getItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDocumentTags() {
    this._documentTagService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsTypes() {
    this._msTypeService.getItems(false, "&access_all=true").subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsType(event) {
    this._msTypeService.getItems(false, '&access_all=true&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Searchig In Form Drop Down
  searchDocTypes(e,patchValue:boolean = false){
    this._documentTypeService.getItems(false,'q='+e.term).subscribe((res: DocumentTypesPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_types =  [];
            document_types.push(i);
            this.documentForm.patchValue({ document_type_id: document_types[0] });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDesignation(e, patchValue: boolean = false) {
    this._designationService.getItems(false,'q=' + e.term).subscribe((res: DesignationPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_designations = this.documentForm.value.designation_ids ? this.documentForm.value.designation_ids : [];
            document_designations.push(i);
            this.documentForm.patchValue({ designation_ids: document_designations });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentCategories(e, patchValue: boolean = false) {
    this._documentCategoryService.getItems(false,'q=' + e.term).subscribe((res: DocumentCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_categories = this.documentForm.value.document_category_ids ? this.documentForm.value.document_category_ids : [];
            document_categories.push(i);
            this.documentForm.patchValue({ document_category_ids: document_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchDocumentSubCategories(e, patchValue: boolean = false) {
    this._documentSubCategoryService.getItems(false,'q=' + e.term).subscribe((res: DocumentSubCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_sub_categories = this.documentForm.value.document_sub_category_ids ? this.documentForm.value.document_sub_category_ids : [];
            document_sub_categories.push(i);
            this.documentForm.patchValue({ document_sub_category_ids: document_sub_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchDocumentSubSubCategories(e, patchValue: boolean = false) {
    this._documentSubSubCategoryService.getItems(false,'q=' + e.term).subscribe((res: DocumentSubSubCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_sub_sub_categories = this.documentForm.value.document_sub_sub_category_ids ? this.documentForm.value.document_sub_sub_category_ids : [];
            document_sub_sub_categories.push(i);
            this.documentForm.patchValue({ document_sub_sub_category_ids: document_sub_sub_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  searchUers(e) {

    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  searchSubsidiary(e) {
    this._subsidiaryService
      .searchSubsidiary("?q=" + e.term)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  searchDocumentFamily(e,patchValue:boolean = false){
    this._documentFamilyService.getItems(false,'q='+e.term).subscribe((res: DocumentFamilyPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_family = this.documentForm.value.document_family_ids ? this.documentForm.value.document_family_ids : [];
            document_family.push(i);
            this.documentForm.patchValue({document_family_ids:document_family});
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchIndustry(e,patchValue:boolean = false){
    this._industryService.getItems(false,'q='+e.term).subscribe((res: IndustryPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let industry = this.documentForm.value.industry_ids ? this.documentForm.value.industry_ids : [];
            industry.push(i);
            this.documentForm.patchValue({industry_ids:industry});
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentTag(e,patchValue:boolean = false){
    this._documentTagService.getItems(false,'q='+e.term).subscribe((res: TagPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_tag = this.documentForm.value.tag_ids ? this.documentForm.value.tag_ids : [];
            document_tag.push(i);
            this.documentForm.patchValue({tag_ids:document_tag});
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  searchRegion(e) {
    this._regionService
    .getItems(false, "q=" + e.term)
    .subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCountry(e) {
    if(this.documentForm.get('region_ids').value && this.documentForm.get('region_ids').value.length > 0){
      var params = '';
      params = '&region_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      this._countryService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchDepartment(e){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchDivision(e){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchSection(e){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.documentForm.get('department_ids').value)
      this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e){
    if(this.documentForm.get('organization_ids').value && this.documentForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.documentForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.documentForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.documentForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.documentForm.get('section_ids').value)
      this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // *** Confirmation Popup Starts here


  cancelClicked(){
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  cancelDocument(status) {
    // * On Cancelling Edit , Retaining the Details Page State.
    if (status) {
      
      if (DocumentsStore.fileUploadType == 'Edit')
      { this._router.navigateByUrl("/knowledge-hub/documents/"+DocumentsStore.documentId);
          this.clearConfirmationObject();
      }
      else {       
        this._router.navigateByUrl("/knowledge-hub/documents");
      }      
    }

    setTimeout(() => {
      $(this.confirmationPopup.nativeElement).modal('hide');
    }, 250);

  }

  clearConfirmationObject() {

    this.confirmationObject.title = '';
    this.confirmationObject.subtitle = '';
    this.confirmationObject.type = '';
  }
  

  // *** Confirmation Popup Ends here ***

  // *** Sub Forms to add data to Masters Starts ***

  /**
   * Form for adding new user document type
   */
  addDocumentType() {
    $(this.documentTypesModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocModal() {
    if(DocumentTypeMasterStore.lastInsertedId){
      this.searchDocTypes({term: DocumentTypeMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentTypesModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  openDesignationForm() {
    AppStore.disableLoading();
    $(this.designationModal.nativeElement).modal('show');
  }

  closeDesignationModal() {

    if (DesignationMasterStore.lastInsertedId) {
      this.searchDesignation({term: DesignationMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.designationModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

   /**
   * Form for adding new  document category
   */

  addDocumentCategory() {
    
    $(this.documentCategoryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocCategoryModal() {

    if(DocumentCategoryMasterStore.lastInsertedId){
      this.searchDocumentCategories({term: DocumentCategoryMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.documentCategoryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    

  }

 

  addDocumentSubCategory() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    this.categorySelect.document_category_ids = this.documentForm.value.document_category_ids[this.documentForm.value.document_category_ids.length-1].id;
    $(this.documentSubCategoryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocumentSubCategoryModal() {
    if(DocumentSubCategoryMasterStore.lastInsertedId){
      this.searchDocumentSubCategories({term: DocumentSubCategoryMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.documentSubCategoryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  addDocumentSubSubCategory() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    this.categorySelect.document_sub_category_ids = this.documentForm.value.document_sub_category_ids[this.documentForm.value.document_sub_category_ids.length-1].id;
    $(this.documentSubSubCategoryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocumentSubSubCategoryModal() {
    if(DocumentSubSubCategoryMasterStore.lastInsertedId){
      this.searchDocumentSubSubCategories({term: DocumentSubSubCategoryMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.documentSubSubCategoryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  
  addDocumentFamily() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    $(this.documentFamily.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closedocumentFamilyModal(){
    if(DocumentFamilyMasterStore.lastInsertedId){
      this.searchDocumentFamily({term: DocumentFamilyMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentFamily.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  addIndustry() {
    $(this.industryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }
  closeIndustryModal(){
    if(IndustryMasterStore.lastInsertedId){
      this.searchIndustry({term: IndustryMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.industryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  addDocumentTag() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    $(this.documentTags.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocumentTagModal() {
    if(TagMasterStore.lastInsertedId){
      this.searchDocumentTag({term: TagMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentTags.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // *** File Upload Functions Starts Here ***

  
  //To get file details when selected
  onFileChange(event,type:string,supportType){
  
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type, supportType); // Assign Files to Multiple File Uploads Array
      // this.checkForFileUploadsScrollbar();
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
                  this.assignFileUploadProgress(upProgress,file,supportType);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,supportType,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type,supportType); // Convert blob to base64 string
                },(error)=>{
                  this.assignFileUploadProgress(null,file,supportType,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null,file,supportType,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,supportType,true);
        }
      });
    }
  }

      /**
 * 
 * @param files Selected files array
 * @param type type of selected files - logo or brochure
 */
addItemsToFileUploadProgressArray(files, type, supportType) {
  if (supportType == 'document-file') {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.supportFIleArray);
    this.supportFIleArray = result.fileUploadsArray;
    return result.files;
    
  } else {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.versionFIleArray);
    this.versionFIleArray = result.fileUploadsArray;
    return result.files;
}

}
  
createImageFromBlob(image: Blob, fileDetails, type, supportType) {
  if (supportType == 'document-file') {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if (fileDetails != null) {

        this._documentService.setSupportFile(fileDetails,logo_url);
      }
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
  } else {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if(fileDetails != null){
        this._documentService.setVersionFile(fileDetails,logo_url);
      }
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
  }

}
/**
 * Deletes a Document
 * @param token Token of Document
 */
removeBrochure(type,token) {
  DocumentsStore.unsetFileDetails(type, token);
  this._utilityService.detectChanges(this._cdr);
}

checkExtension(ext, extType) {
  var res = this._imageService.checkFileExtensions(ext, extType);
  return res;
}
  
      /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
 assignFileUploadProgress(progress, file,supportType?, success = false) {
   
  if (supportType == 'document-file') {
   let temporaryFileUploadsArray = this.supportFIleArray;
    this.supportFIleArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
 
  } else {
   let temporaryFileUploadsArray = this.versionFIleArray;
    this.versionFIleArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }


 }

 checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
 }
  


  checkForFileUploadsScrollbar() {

    if(DocumentsStore.getSupportFile.length >= 5 || this.supportFIleArray.length > 5){
      $(this.supportUploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.supportUploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    
  }

  // *** File Upload Functions Ends Here ***




  // *** Sub Forms to add data to Masters Ends ***

  // *** Additional Functions  Starts Here ***

  
  getArrayFormatedString(items){
    return this._helperService.getArraySeperatedString(',','title',items);
  }

  getSelectedValues() {


    DocumentsStore._msType = [];

    if (this.displayForm.ms_type_organization_ids) {
      MsTypeStore.msTypeDetails.forEach(element => {
        if (this.displayForm.ms_type_organization_ids.includes(element.id)) {
            DocumentsStore._msType.push({
              title: element.ms_type_title,
              version:element.ms_type_version_title
                   })
                }
          }); 
          
    }

  }

  getDescriptionContent(p) {
    var descriptionContent = p.substring(0,650);
    return descriptionContent;
  }

  viewDescription(operation, type) {
    
    if (type == 'description') {
      
    if(operation == 'more')
    this.view_more_description = true;
  else
    this.view_more_description = false;
    } else {
      
      if(operation == 'more')
      this.view_more_purpose = true;
    else
      this.view_more_purpose = false;

    }

    this._utilityService.detectChanges(this._cdr);
  }

  addValidation(id){
    this.workflowError=null
    if(id==3){      
      this.documentForm.controls["organization_ids"].setValidators(Validators.required);
      this.documentForm.controls["organization_ids"].updateValueAndValidity();
    }else{
      this.documentForm.controls["organization_ids"].clearValidators();
      this.documentForm.controls["organization_ids"].updateValueAndValidity();
    }
  }

  selectAccessType(accessTypeId) {

    if (accessTypeId == 1)
      this.documentForm.patchValue({
        document_status_id: 1
      })

    if (accessTypeId != 3) {
      this.isShared = false;
    } else
    this.isShared = true;
    this.selectedAccessType = accessTypeId
    
  }

  resetSharedData(){
          this.documentForm.controls['organization_ids'].reset()
      this.documentForm.controls['section_ids'].reset()
      this.documentForm.controls['sub_section_ids'].reset()
      this.documentForm.controls['division_ids'].reset()
      this.documentForm.controls['department_ids'].reset()
      this.documentForm.controls['user_ids'].reset()
      this.documentForm.controls['designation_ids'].reset()
  }

  findSelectedAccessType(accessTypeId) {
    
    if (accessTypeId == this.selectedAccessType)
      return true;
  }

  setAccessCLass(accessType) {
  
    var className = ''
    
    if(accessType.is_private==1)
      return className = 'fas fa-lock'
    if (accessType.is_shared == 1)
      return className = 'fas fa-share';
    if (accessType.is_public == 1)
      return className = 'fas fa-globe-americas'
      
    
  }


  setTabName() {
    
    let tabName;

    if (this.selectedAccessType == 1)
    return  tabName = `{{'document_status' | translate}}`
    else
    return  tabName = `{{'workflow' | translate}}`

  }






  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageUrl(token, type,h?,w?) {

    if (type == 'document-version')
    return this._documentFileService.getThumbnailPreview(type,token,h,w);
    else
    return this._khFileService.getThumbnailPreview(type,token);
  }
  getDate(){
    return new Date();
  }


  checkWorkflowStatus() {
    if (this.selectedAccessType == 1 && !KHSettingStore?.khSettingsItems?.is_document_workflow) {
      return true;     
    }  
    else
      return false;
  }



  // * Setting the button style for Custom/Templates
  setCustom(status) {
    if(!TemplateStore.activeTemplate)
    this.customCheck=status

    if(!status){
      if(this.template_document_type){      
        this.templateObject.values=this.template_document_type      
      }else{
        this.templateMessage="Please select document type"
      }
    }else{
      this.templateMessage=""
    }    
  }

  openTemplatePopup() {
    this.templatePopup = true;
    this.templateObject.type="Add"    
    if(this.template_document_type){      
      this.templateObject.values=this.template_document_type
    }    
    $(this.templateModal.nativeElement).modal("show");
    this._renderer2.setStyle(this.templateModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeTemplatePopup() {
    this.templatePopup = false;
    setTimeout(() => {      
      $(this.templateModal.nativeElement).modal("hide");
      this._renderer2.setStyle(this.templateModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this.templateObject.type=null
      this.templateObject.values=null
    }, 200);

  }
  removeDocument() {
    TemplateStore.unsetActiveTemplate();
    this._utilityService.detectChanges(this._cdr);
  }

  //  *** Additional Functions  Ends Here ***

  // *** Additional Events ***


  switchEvent(data) {
        if (data) {
          this.getOrganizationModules()
          this.documentTypeId = data.id;
          this.getWorkflow()
          }
  }

  // * Getting Module Group Id

  getOrganizationModules() {
    this._organizationModuleService.getAllItems('?side_menu=true').subscribe()

    if (OrganizationModulesStore.loaded) {
      let moduleGroup = OrganizationModulesStore.organizationModules.find(element => element.client_side_url == "/knowledge-hub")
      WorkFlowStore.moduleGroupId = moduleGroup.id
    }
  }

    //*  Set User Preview Data
  assignUserValues(user) {
      if (user) {
        var userDetailObject = {
          first_name: '',
          last_name: '',
          designation: '',
          image_token: '',
          mobile: null,
          email: '',
          id: null,
          department: '',
          status_id: null
        }
  
        userDetailObject.first_name = user?.first_name;
        userDetailObject.last_name = user?.last_name;
        userDetailObject.designation = user?.designation ? user?.designation : '';
        userDetailObject.image_token = user?.image_token?user.image_token : null;
        userDetailObject.email = user?.email;
        userDetailObject.mobile = user?.mobile;
        userDetailObject.id = user?.id;
        userDetailObject.status_id = user?.status?.id
        userDetailObject.department = user?.department ? user?.department : null
        
        return userDetailObject;
    
      }
    }

  scrollEvent = (event: any): void => {
    const number = event.target.documentElement?.scrollTop;
    if (number > 50) {
      if (this.formSteps)
        this._renderer2.addClass(this.formSteps?.nativeElement, "small");
      this._renderer2.addClass(this.navigationBar?.nativeElement, "affix");
    } else {
      if (this.formSteps)
        this._renderer2.removeClass(this.formSteps?.nativeElement, "small");
      this._renderer2.removeClass(this.navigationBar?.nativeElement, "affix");
    }
  };

  resetForm() {
      // this.checkForFileUploadsScrollbar();
      this.documentForm.reset();
      this.documentForm.pristine;
      this.documentFormErrors = null;
      fileUploadPopupStore.clearFilesToDisplay()
    }

    getStringsFormatted(stringArray,characterLength,seperator){
      return this._helperService.getFormattedName(stringArray,characterLength,seperator);
    }

    setDocumentAssessment(event){
      if (event.target.checked) {
        this.documentForm.patchValue({
          is_assessment_required: true
        })
      }
      else {
        this.documentForm.patchValue({
          is_assessment_required: false
        })
      }
    }


// *Common  File Upload/Attach Modal Functions Starts Here

enableScrollbar() {
  if (fileUploadPopupStore.displayFiles.length >= 3) {
    $(this.uploadArea.nativeElement).mCustomScrollbar();
    $(this.previewUploadArea.nativeElement).mCustomScrollbar();
  }
  else {
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
  }
}


clearCommonFilePopupDocuments() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearUpdateFiles();
}
setDocuments(documents) {
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
            ...innerElement

          })
        }

      });
    }
   
  });
  fileUploadPopupStore.setKHFile(khDocuments)
  let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
  fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
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
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
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
    this._renderer2.addClass(this.navigationBar?.nativeElement, "affix");
    this._renderer2.addClass(this.formSteps?.nativeElement, "small");
    $('.modal-backdrop').remove();
    setTimeout(() => {
      this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }, 100);
}

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDocumentReview() {    
    this._documentReviewFrequenciesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchDocumentReview(event) {    
    this._documentReviewFrequenciesService.getItems(false,'&q=' + event.term,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getResponsibleUsers() {
    let params=AuthStore?.user?.department?.id
    this._usersService.getAllItems(`?department_ids=${params}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchResponsibleUsers(e) {
    let params=AuthStore?.user?.department?.id
    this._usersService.searchUsers(`?department_ids=${params}?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  getDocumentOwners() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentOwner(e) {
    this._usersService.searchUsers(`?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.documentForm.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.documentForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }

    }

    if(setValid==true){
      setValid=!this.checkCondition(DocumentsStore.getVersionFile,TemplateStore?.getActiveTemplate)
    }
    
    return setValid;
  }

  checkCondition(custom,template){
    if(KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.type=='external'){
      if(custom||template){
        return false
      }
      else{
        return true
      }
    }else{
      return false
    }

   
  }

  deleteDocuments(doc) {
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


  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if(type=='default'){
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

  assignClass(workflowItem) {
    
    var className = "work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none edit-option"
    
    if (this.workflowType == 'Preview')
    {
      let lastItem = WorkFlowStore.workFlowDetails.workflow_items[WorkFlowStore.workFlowDetails.workflow_items.length - 1];
      if (lastItem.id == workflowItem.id)
        return className = className + ' ' + 'last-border-remove'
      else
      return className = className 
    }
    else
      return className=className

  }

  // Document Mapping Starts Here

  organisationChanges() {
  this.openModelPopup = true;
  this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

closeModal(data?) {
  if(data){
    this.documentForm.patchValue({
      document_division_ids: data.division_ids ? data.division_ids : [],
      document_department_ids:data.department_ids ? data.department_ids : [],
      document_section_ids:data.section_ids ? data.section_ids : [],
      document_sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
      document_organization_ids: data.organization_ids ? data.organization_ids : []
    })
  }
  this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
  this.openModelPopup = false;
  this._utilityService.detectChanges(this._cdr);
}

getEmployeePopupDetails(users, created?: string) { //user popup

  let userDetails: any = {};
  if (users) {
    userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
    userDetails['last_name'] = users?.last_name;
    userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token;
    userDetails['email'] = users?.email;
    userDetails['mobile'] = users?.mobile;
    userDetails['id'] = users?.id;
    // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
    userDetails['department'] = users?.department;
    userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
    userDetails['created_at'] = created ? created : null;
    userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
  }
  return userDetails;
}
// Document Mapping Ends Here
  ngOnDestroy() {

    this.documentTypeEventSubscription.unsubscribe();
    this.documentCategorySubscriptionEvent.unsubscribe();
    this.documentSubCategorySubscriptionEvent.unsubscribe();
    this.documentSubSubCategorySubscriptionEvent.unsubscribe();
    this.documentFamilySubscriptionEvent.unsubscribe();
    this.industrySubscriptionEvent.unsubscribe();
    this.tagSubscriptionEvent.unsubscribe();
    this.designationEventSubscription.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    DocumentsStore.clearSupportFiles();
    DocumentsStore.clearVersionFile();
    TemplateStore.unsetActiveTemplate();
    this.supportFIleArray = [];
    this.versionFIleArray = [];
    this.resetForm()
    DocumentsStore.unsetFolderDetails();
    this.clearCommonFilePopupDocuments()
  }
}
