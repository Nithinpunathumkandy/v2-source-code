import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentReviewFrequenciesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-review-frequencies-store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentReviewFrequenciesService } from 'src/app/core/services/masters/knowledge-hub/document-review-frequencies/document-review-frequencies.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { DocumentFamilyService } from 'src/app/core/services/masters/knowledge-hub/document-family/document-family.service';
import { DocumentCategoryService } from 'src/app/core/services/masters/knowledge-hub/document-category/document-category.service';
import { DocumentSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-categories/document-sub-categories.service';
import { DocumentSubSubCategoriesService } from 'src/app/core/services/masters/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.service';
import { CountryService } from 'src/app/core/services/masters/general/country/country.service';
import { RegionService } from 'src/app/core/services/masters/general/region/region.service';
import { TagService } from 'src/app/core/services/masters/knowledge-hub/tag/tag.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { IndustryService } from 'src/app/core/services/masters/general/industry/industry.service';
import { IndustryPaginationResponse } from 'src/app/core/models/masters/general/industry';
import { DesignationPaginationResponse } from 'src/app/core/models/masters/human-capital/designation';
import { DocumentCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-category';
import { DocumentFamilyPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-family';
import { DocumentSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-categories';
import { DocumentSubSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-sub-categories';
import { DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { TagPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/tag';
import { DocumentCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-category-store';
import { DocumentSubCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-sub-categories-store';
import { DocumentSubSubCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/document-sub-sub-categories-store';
import { DocumentFamilyMasterStore } from 'src/app/stores/masters/knowledge-hub/document-family-store';
import { IndustryMasterStore } from 'src/app/stores/masters/general/industry-store';
import { RegionMasterStore } from 'src/app/stores/masters/general/region-store';
import { CountryMasterStore } from 'src/app/stores/masters/general/country-store';
import { TagMasterStore } from 'src/app/stores/masters/knowledge-hub/tag-store';
import { Router } from '@angular/router';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { WorkFlowStore } from 'src/app/stores/knowledge-hub/work-flow/workFlow.store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';

declare var $: any;

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.scss']
})
export class EditFileComponent implements OnInit {


  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("documentTypesModal") documentTypesModal: ElementRef;
  @ViewChild("documentCategoryModal") documentCategoryModal: ElementRef;
  @ViewChild("documentSubCategoryModal") documentSubCategoryModal: ElementRef;
  @ViewChild("documentSubSubCategoryModal") documentSubSubCategoryModal: ElementRef;
  @ViewChild("documentFamily") documentFamily: ElementRef;
  @ViewChild("industryModal") industryModal: ElementRef;
  @ViewChild("documentTags") documentTags: ElementRef;
  @ViewChild("designationModal") designationModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @Input('source') DocumentSource: any;

  form: FormGroup;
  formErrors: any;

  fileUploadsArray = [];
  AppStore = AppStore;
  DocumentReviewFrequenciesMasterStore = DocumentReviewFrequenciesMasterStore
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  DocumentsStore = DocumentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MasterListDocumentStore = MasterListDocumentStore;
  reactionDisposer: IReactionDisposer;

  DocumentTypeMasterStore = DocumentTypeMasterStore;
  DocumentCategoryMasterStore = DocumentCategoryMasterStore;
  DocumentSubCategoryMasterStore = DocumentSubCategoryMasterStore;
  DocumentSubSubCategoryMasterStore = DocumentSubSubCategoryMasterStore;
  DocumentFamilyMasterStore = DocumentFamilyMasterStore;
  IndustryMasterStore = IndustryMasterStore;
  RegionMasterStore = RegionMasterStore;
  CountryMasterStore = CountryMasterStore;
  DocumentTagMasterStore = TagMasterStore;
  KHSettingStore = KHSettingStore;
  WorkFlowStore = WorkFlowStore;
  DesignationMasterStore = DesignationMasterStore
  MsTypeStore = MsTypeStore;

  openModelPopup: boolean = false;
  openDocumentTypePopup: boolean = false;
  fileUploadPopupSubscriptionEvent: any = null;
  documentTypeEventSubscription: any = null;
  organisationChangesModalSubscription: any = null;
  todayDate: { year: number; month: any; day: number; };


  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  displayForm: any = null;
  saveData: any = null;
  documentFormErrors: any;
  workflowError: any
  view_more_purpose: boolean = false;
  view_more_description: boolean = false;
  showWorkflowMessage: boolean = false
  workflowType: any = null;
  documentTypeId: number;


  documentCategorySubscriptionEvent: any = null;
  documentSubCategorySubscriptionEvent: any = null;
  documentSubSubCategorySubscriptionEvent: any = null;
  documentFamilySubscriptionEvent: any = null; 
  industrySubscriptionEvent: any = null;
  tagSubscriptionEvent: any = null;
  designationEventSubscription: any = null;
  cancelEventSubscription: any = null;

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'Are you sure you want to cancel?',
    type: 'Cancel'
  };

  categorySelect = {
    readOnlyStatus: true,
    document_category_ids: null,
    document_sub_category_ids: null,
    values: null
  }

  formObject = {
    0: [
      'document_type_id',
      'title',
      'owner_id'
    ],
  }

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

  constructor(
    private _renderer2: Renderer2,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _usersService: UsersService,
    private _documentService: DocumentsService,
    private _documentReviewFrequenciesService: DocumentReviewFrequenciesService,
    private _documentTypeService: DocumentTypesService,
    private _designationService: DesignationService,
    private _msTypeService: MstypesService,
    private _documentFamilyService: DocumentFamilyService,
    private _documentCategoryService: DocumentCategoryService,
    private _documentSubCategoryService: DocumentSubCategoriesService,
    private _documentSubSubCategoryService: DocumentSubSubCategoriesService,
    private _countryService: CountryService,
    private _regionService: RegionService,
    private _documentTagService: TagService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _industryService: IndustryService,
    private _router: Router,
    private _workFlowService: WorkflowService,
    private _khSettingService:KhSettingsService,
  ) { }

  ngOnInit(): void {

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

    });
    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([{ type: "close_doc" }]);

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      document: [''],
      description: [''],
      purpose: [''],
      owner_id: [null],
      document_type_id: [null],
      document_category_ids: [null],
      document_sub_category_ids: [null],
      document_sub_sub_category_ids: [null],
      document_family_ids: [null],
      country_ids: [null],
      region_ids: [null],
      ms_type_organization_id: null,
      ms_type_organization_ids: [null],
      designation_ids: [null],
      tag_ids: [null],
      industry_ids: [null],
      user_ids: [null],
      document_organization_ids: [null],
      document_section_ids: [null],
      document_sub_section_ids: [null],
      document_division_ids: [null],
      document_department_ids: [null],
    });


    this.getDocumentReview();
    // this.setFormValues();
    this.getKHSettingsData();
    
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

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    // Checking if Source has Values and Setting Form Value


    // To set the Minimum date for datepicker.
    var date = new Date()
    var monthName = this.months[date.getMonth()]
    this.todayDate = { year: date.getFullYear(), month: monthName.id, day: date.getDate() };



    this.gerRequiredData()
    window.addEventListener("scroll", this.scrollEvent, true);

    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    if(DocumentsStore.documentId)
      this.getDocumentDetails()

  }

  // Required Get Data Starts Here

  gerRequiredData() {
    this.getDocumentTypes()
    this.getSubsidiary();
    this.getDocumentCategories();
    this.getIndustries();
    this.getRegions();
    this.getCountries();
    this.getDocumentFamilies();
    this.getMsTypes();
    this.getDocumentTags();
  }

  getKHSettingsData(){

    this._khSettingService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
    
 
  }
  getDocumentDetails() {
    this._documentService.getItemById(DocumentsStore.documentId).subscribe(res => {
      if(res){
        this.documentTypeId=res.document_type.id
        this.getWorkflow()
        this.setFormValues()
        this._utilityService.detectChanges(this._cdr);
      }

    })
  }
  // Required Get Data Ends here

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

  switchEvent(data) {
    if (data) {
      this.documentTypeId = data.id;
      this.getWorkflow()
      }
}

getWorkflow() {
  WorkFlowStore.unsetWorkFlowDetails()
  if (this.documentTypeId) {
    this._workFlowService.getWorkflow(true, 700, this.documentTypeId).subscribe(res => {
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


  // Search Function Starts Here



  searchMsType(event) {
    this._msTypeService.getItems(false, '&access_all=true&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Searchig In Form Drop Down
  searchDocTypes(e, patchValue: boolean = false) {
    this._documentTypeService.getItems(false, 'q=' + e.term).subscribe((res: DocumentTypesPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_types = [];
            document_types.push(i);
            this.form.patchValue({ document_type_id: document_types[0] });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDesignation(e, patchValue: boolean = false) {
    this._designationService.getItems(false, 'q=' + e.term).subscribe((res: DesignationPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_designations = this.form.value.designation_ids ? this.form.value.designation_ids : [];
            document_designations.push(i);
            this.form.patchValue({ designation_ids: document_designations });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentCategories(e, patchValue: boolean = false) {
    this._documentCategoryService.getItems(false, 'q=' + e.term).subscribe((res: DocumentCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_categories = this.form.value.document_category_ids ? this.form.value.document_category_ids : [];
            document_categories.push(i);
            this.form.patchValue({ document_category_ids: document_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchDocumentSubCategories(e, patchValue: boolean = false) {
    this._documentSubCategoryService.getItems(false, 'q=' + e.term).subscribe((res: DocumentSubCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_sub_categories = this.form.value.document_sub_category_ids ? this.form.value.document_sub_category_ids : [];
            document_sub_categories.push(i);
            this.form.patchValue({ document_sub_category_ids: document_sub_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchDocumentSubSubCategories(e, patchValue: boolean = false) {
    this._documentSubSubCategoryService.getItems(false, 'q=' + e.term).subscribe((res: DocumentSubSubCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_sub_sub_categories = this.form.value.document_sub_sub_category_ids ? this.form.value.document_sub_sub_category_ids : [];
            document_sub_sub_categories.push(i);
            this.form.patchValue({ document_sub_sub_category_ids: document_sub_sub_categories });
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

  searchDocumentFamily(e, patchValue: boolean = false) {
    this._documentFamilyService.getItems(false, 'q=' + e.term).subscribe((res: DocumentFamilyPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_family = this.form.value.document_family_ids ? this.form.value.document_family_ids : [];
            document_family.push(i);
            this.form.patchValue({ document_family_ids: document_family });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchIndustry(e, patchValue: boolean = false) {
    this._industryService.getItems(false, 'q=' + e.term).subscribe((res: IndustryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let industry = this.form.value.industry_ids ? this.form.value.industry_ids : [];
            industry.push(i);
            this.form.patchValue({ industry_ids: industry });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocumentTag(e, patchValue: boolean = false) {
    this._documentTagService.getItems(false, 'q=' + e.term).subscribe((res: TagPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_tag = this.form.value.tag_ids ? this.form.value.tag_ids : [];
            document_tag.push(i);
            this.form.patchValue({ tag_ids: document_tag });
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
    var params = '';
    params = '&region_ids=' + this._helperService.createParameterFromArray(this.form.get('region_ids').value)
    this._countryService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDepartment(e) {

    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDivision(e) {

    this._divisionService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchSection(e) {

    this._sectionService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }
  searchSubSection(e) {
    this._subSectionService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // Search Functions Ends Here


  getDocumentTypes() {
    this._documentTypeService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSubsidiary() {
    this._subsidiaryService
      .getAllItems(false)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDivision() {
    this._divisionService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDesignation() {
    this._designationService.getItems(false, 'access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSection() {
    this._sectionService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSubSection() {
    this._subSectionService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDocumentCategories() {
    this._documentCategoryService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
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
    if (this.form.get('region_ids').value && this.form.get('region_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('region_ids').value);
      this._countryService.getItems(false, '&region_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
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

  getDate() {
    return new Date();
  }



  getDocumentSubCategories() {
    if (this.form.get('document_category_ids').value && this.form.get('document_category_ids').value.length > 0) {
      var params = '';
      params = '&document_category_ids=' + this._helperService.createParameterFromArray(this.form.get('document_category_ids').value)
      this._documentSubCategoryService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DocumentSubCategoryMasterStore.setAllDocumentSubCategories([]);
    }
  }

  getDocumentSubSubCategoires() {
    if (this.form.get('document_category_ids').value && this.form.get('document_category_ids').value.length > 0 && this.form.get('document_sub_category_ids').value && this.form.get('document_sub_category_ids').value.length > 0) {
      var params = '';
      params = '&document_category_ids=' + this._helperService.createParameterFromArray(this.form.get('document_category_ids').value)
        + '&document_sub_category_ids=' + this._helperService.createParameterFromArray(this.form.get('document_sub_category_ids').value)
      this._documentSubSubCategoryService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DocumentSubSubCategoryMasterStore.setAllDocumentSubSubCategories([]);
    }
  }

  // *** Confirmation Popup Starts here


  cancelClicked() {
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  cancelDocument(status) {
    // * On Cancelling Edit , Retaining the Details Page State.
    if (status) {

      if (DocumentsStore.fileUploadType == 'Edit') {
        this._router.navigateByUrl("/knowledge-hub/documents/" + DocumentsStore.documentId);
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

  /**
  * Form for adding new user document type
  */
  addDocumentType() {
    $(this.documentTypesModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocModal() {
    if (DocumentTypeMasterStore.lastInsertedId) {
      this.searchDocTypes({ term: DocumentTypeMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentTypesModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  // Document Mapping Starts Here

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if (data) {
      this.form.patchValue({
        document_division_ids: data.division_ids ? data.division_ids : [],
        document_department_ids: data.department_ids ? data.department_ids : [],
        document_section_ids: data.section_ids ? data.section_ids : [],
        document_sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        document_organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
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

    if (!KHSettingStore?.khSettingsItems?.is_document_workflow) {
      if (this.currentTab == 2 && n > 0) this.currentTab = 4;
      else if (this.currentTab == 4 && n < 0) this.currentTab = 2;
      else this.currentTab = this.currentTab + n;
    }
    else {
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

  // Save or Update Issue
  createDocument() {
    let save: any;
    AppStore.enableLoading();
    this.nextButtonText = "Loading";
    this.previousButtonText = "Loading";
    if (this.saveData.id) {
      save = this._documentService.updateItem(this.saveData.id, this.saveData);
    }
    else {
      save = this._documentService.saveItem(this.saveData);
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      if (this.saveData.id)
        this._router.navigateByUrl('/knowledge-hub/documents/' + this.saveData.id);
      else
        this._router.navigateByUrl('/knowledge-hub/documents/' + res.id);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        //console.log(err)
        this.documentFormErrors = err.error.errors;
        this.workflowError = err.error.message
        this.currentTab = 0;
        this.nextButtonText = "Next";
        this.previousButtonText = "Previous";
        this.setInitialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  changeStep(step) {


    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }

    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }

  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.form.controls[i].valid) {
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
            if (!this.form.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }

    }


    return setValid;
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
      this.displayForm = this.form.value;
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



  createDocumentSaveData() {
    this.saveData = {
      id: this.displayForm.id ? this.displayForm.id : null,
      title: this.displayForm.title ? this.displayForm.title : '',
      description: this.displayForm.description ? this.displayForm.description : '',
      purpose: this.displayForm.purpose ? this.displayForm.purpose : '',
      document_type_id: this.displayForm.document_type_id ? this.displayForm.document_type_id.id : null,
      ms_type_organization_id: this.displayForm.ms_type_organization_id ? this.displayForm.ms_type_organization_id.id : null,
      ms_type_organization_ids: this.displayForm.ms_type_organization_ids ? this.displayForm.ms_type_organization_ids : [],
      document_category_ids: this.displayForm.document_category_ids && this.displayForm.document_category_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_category_ids, 'id') : [],
      document_sub_category_ids: this.displayForm.document_sub_category_ids && this.displayForm.document_sub_category_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_sub_category_ids, 'id') : [],
      document_sub_sub_category_ids: this.displayForm.document_sub_sub_category_ids && this.displayForm.document_sub_sub_category_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_sub_sub_category_ids, 'id') : [],
      document_family_ids: this.displayForm.document_family_ids && this.displayForm.document_family_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_family_ids, 'id') : [],
      country_ids: this.displayForm.country_ids && this.displayForm.country_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.country_ids, 'id') : [],
      region_ids: this.displayForm.region_ids && this.displayForm.region_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.region_ids, 'id') : [],
      designation_ids: this.displayForm.designation_ids && this.displayForm.designation_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.designation_ids, 'id') : [],
      user_ids: this.displayForm.user_ids && this.displayForm.user_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.user_ids, 'id') : [],
      tag_ids: this.displayForm.tag_ids && this.displayForm.tag_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.tag_ids, 'id') : [],
      industry_ids: this.displayForm.industry_ids && this.displayForm.industry_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.industry_ids, 'id') : [],
      department_ids: this.displayForm.department_ids && this.displayForm.department_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.department_ids, 'id') : [],
      owner_id: this.displayForm?.owner_id ? this.displayForm.owner_id.id : null,
      document_organization_ids: this.displayForm.document_organization_ids && this.displayForm.document_organization_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_organization_ids, 'id') : [],
      document_section_ids: this.displayForm.document_section_ids && this.displayForm.document_section_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_section_ids, 'id') : [],
      document_sub_section_ids: this.displayForm.document_sub_section_ids && this.displayForm.document_sub_section_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_sub_section_ids, 'id') : [],
      document_division_ids: this.displayForm.document_division_ids && this.displayForm.document_division_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_division_ids, 'id') : [],
      document_department_ids: this.displayForm.document_department_ids && this.displayForm.document_department_ids.length > 0 ? this._helperService.getArrayProcessed(this.displayForm.document_department_ids, 'id') : [],
      document_access_type_id: DocumentsStore.documentDetails.document_access_type.id,

    };


  }

  getDescriptionContent(p) {
    var descriptionContent = p.substring(0, 650);
    return descriptionContent;
  }

  viewDescription(operation, type) {

    if (type == 'description') {

      if (operation == 'more')
        this.view_more_description = true;
      else
        this.view_more_description = false;
    } else {

      if (operation == 'more')
        this.view_more_purpose = true;
      else
        this.view_more_purpose = false;

    }

    this._utilityService.detectChanges(this._cdr);
  }


  getCreatedByPopupDetails(users, created?: string, type: any = '') {
    let userDetails: any = {};
    if (type == 'user') {
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
    if (type == 'default') {
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

    if (this.workflowType == 'Preview') {
      let lastItem = WorkFlowStore.workFlowDetails.workflow_items[WorkFlowStore.workFlowDetails.workflow_items.length - 1];
      if (lastItem.id == workflowItem.id)
        return className = className + ' ' + 'last-border-remove'
      else
        return className = className
    }
    else
      return className = className

  }


  // *** Sub Forms to add data to Masters Starts ***

  /**
   * Form for adding new user document type
   */


  openDesignationForm() {
    AppStore.disableLoading();
    $(this.designationModal.nativeElement).modal('show');
  }

  closeDesignationModal() {

    if (DesignationMasterStore.lastInsertedId) {
      this.searchDesignation({ term: DesignationMasterStore.lastInsertedId }, true);
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

    if (DocumentCategoryMasterStore.lastInsertedId) {
      this.searchDocumentCategories({ term: DocumentCategoryMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      $(this.documentCategoryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);


  }



  addDocumentSubCategory() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    this.categorySelect.document_category_ids = this.form.value.document_category_ids[this.form.value.document_category_ids.length - 1].id;
    $(this.documentSubCategoryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocumentSubCategoryModal() {
    if (DocumentSubCategoryMasterStore.lastInsertedId) {
      this.searchDocumentSubCategories({ term: DocumentSubCategoryMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      $(this.documentSubCategoryModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  addDocumentSubSubCategory() {
    // DocumentsStore.selectedDocumentCategoryId=this.documentCategoryId
    this.categorySelect.document_sub_category_ids = this.form.value.document_sub_category_ids[this.form.value.document_sub_category_ids.length - 1].id;
    $(this.documentSubSubCategoryModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  closeDocumentSubSubCategoryModal() {
    if (DocumentSubSubCategoryMasterStore.lastInsertedId) {
      this.searchDocumentSubSubCategories({ term: DocumentSubSubCategoryMasterStore.lastInsertedId }, true);
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

  closedocumentFamilyModal() {
    if (DocumentFamilyMasterStore.lastInsertedId) {
      this.searchDocumentFamily({ term: DocumentFamilyMasterStore.lastInsertedId }, true);
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
  closeIndustryModal() {
    if (IndustryMasterStore.lastInsertedId) {
      this.searchIndustry({ term: IndustryMasterStore.lastInsertedId }, true);
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
    if (TagMasterStore.lastInsertedId) {
      this.searchDocumentTag({ term: TagMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentTags.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  setFormValues() {

    // if (this.DocumentSource.hasOwnProperty('values') && this.DocumentSource.values) {
      this.form.patchValue({
        id: DocumentsStore.documentDetails.id,
        title: DocumentsStore.documentDetails.title,
        description: DocumentsStore.documentDetails.description,
        purpose: DocumentsStore.documentDetails.purpose,
        owner_id: DocumentsStore.documentDetails.owner ? DocumentsStore.documentDetails.owner : null,
        ms_type_organization_id:DocumentsStore.documentDetails.ms_type_organization?DocumentsStore.documentDetails.ms_type_organization.ms_type.title:null,
        ms_type_organization_ids:DocumentsStore.documentDetails.ms_type_organizations?this.getMsTypeVersion(DocumentsStore.documentDetails.ms_type_organizations):[],
        document_type_id:DocumentsStore?.documentDetails?.document_type?DocumentsStore.documentDetails.document_type:null,
        document_category_ids:DocumentsStore?.documentDetails?.document_categories?DocumentsStore.documentDetails.document_categories:[],
        document_sub_category_ids: DocumentsStore?.documentDetails?.document_sub_categories?DocumentsStore.documentDetails.document_sub_categories:[],
        document_sub_sub_category_ids:DocumentsStore?.documentDetails?.document_sub_sub_categories?DocumentsStore.documentDetails.document_sub_sub_categories:[],
        document_family_ids:DocumentsStore?.documentDetails?.document_families?DocumentsStore.documentDetails.document_families:[],
        country_ids:DocumentsStore?.documentDetails?.countries?DocumentsStore.documentDetails.countries:[],
        region_ids:DocumentsStore?.documentDetails?.regions?DocumentsStore.documentDetails.regions:[],
        tag_ids:DocumentsStore?.documentDetails?.tags?DocumentsStore.documentDetails.tags:[],
        document_division_ids: DocumentsStore?.documentDetails.document_divisions ? DocumentsStore?.documentDetails.document_divisions : [],
        document_department_ids: DocumentsStore?.documentDetails.document_departments ? DocumentsStore?.documentDetails.document_departments : [],
        document_section_ids: DocumentsStore?.documentDetails.document_sections ? DocumentsStore?.documentDetails.document_sections : [],
        document_sub_section_ids: DocumentsStore?.documentDetails.document_sub_sections ? DocumentsStore?.documentDetails.document_sub_sections : [],
        document_organization_ids: DocumentsStore?.documentDetails.document_organizations ? DocumentsStore?.documentDetails.document_organizations : [],
      })
  }

  getMsTypeVersion(field) {
    
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id)
    }
      return returnValue;

  }

  closeDocument() {
    
    if (DocumentsStore.documentId)
    { this._router.navigateByUrl("/knowledge-hub/documents/"+DocumentsStore.documentId);
        this.clearConfirmationObject();
    }
    else {       
      this._router.navigateByUrl("/knowledge-hub/documents");
    }   

  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i);
    }
    return returnValues;
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  getResponsibleUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchResponsibleUsers(e) {
    this._usersService.searchUsers(`?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDocumentReview() {
    this._documentReviewFrequenciesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchDocumentReview(event) {
    this._documentReviewFrequenciesService.getItems(false, '&q=' + event.term, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }




  createImageUrl(token, type) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }




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
                  $("#file").val('');
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                  }, (error) => {
                    $("#file").val('');
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, true);
              $("#file").val('');
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          $("#file").val('');
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._documentService.setVersionFile(imageDetails, type);
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
  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // Check if logo is being uploaded
  checkLogoIsUploading() {
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  getArrayFormatedString(items) {
    return this._helperService.getArraySeperatedString(',', 'title', items);
  }

  removeDocument(token) {

    DocumentsStore.unsetFileDetails('document-version-file', token);
    this._utilityService.detectChanges(this._cdr);
  }

  folmValidationCheck() {

    if (!DocumentsStore.getVersionFile || DocumentsStore.getVersionFile['is_deleted'] == true)
      return true
    else
      return false
  }


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    // MasterListDocumentStore.clearDocument();
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal(documentId?) {
    this.resetForm();
    this._eventEmitterService.dismissMasterListDocumentAddModal(documentId);
    this._eventEmitterService.dismissEditDocumentModal()
  }

  ngOnDestroy() {
    this.resetForm();
    MasterListDocumentStore.clearDocument();
    DocumentsStore.clearVersionFile();
  }


}
