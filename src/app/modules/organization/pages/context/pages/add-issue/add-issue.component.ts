import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer, autorun, toJS, values } from 'mobx';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

import { AppStore } from 'src/app/stores/app.store';

import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";

import { MstypesService } from "src/app/core/services/organization/business_profile/ms-type/mstype.service";
import { MsTypeStore } from "src/app/stores/organization/business_profile/ms-type/ms-type.store";

import { IssueCategoryService } from "src/app/core/services/masters/organization/issue-category/issue-category.service";
import { IssueCategoryMasterStore } from "src/app/stores/masters/organization/issue-category-master.store";

import { IssueDomainService } from "src/app/core/services/masters/organization/issue-domain/issue-domain.service";
import { IssueDomainMasterStore } from "src/app/stores/masters/organization/issue-domain-master.store";

import { IssueTypeService } from "src/app/core/services/masters/organization/issue-type/issue-type.service";
import { IssueTypeMasterStore } from "src/app/stores/masters/organization/issue-type-master.store";

import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";

import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";

import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";

import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";

import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";

import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';

import { IssueService } from "src/app/core/services/masters/organization/issue/issue.service";
import { IssueMasterStore } from "src/app/stores/masters/organization/issue-master.store";

import { ProcessService } from "src/app/core/services/bpm/process/process.service";
import { ProcessStore } from "src/app/stores/bpm/process/processes.store";

import { StakeholdersListService } from "src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service";
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";

import { StakeholderTypeService } from "src/app/core/services/masters/organization/stakeholder-type/stakeholder-type.service";
import { StakeholderTypeMasterStore } from "src/app/stores/masters/organization/stakeholder-type-master.store";

import { NeedsandexpectationsService } from "src/app/core/services/masters/organization/needsandexpectations/needsandexpectations.service";
import { NeedsExpectationsStore } from "src/app/stores/masters/organization/needs-expectations.store";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";

import { AuthStore } from "src/app/stores/auth.store";

import { IssuePaginationResponse } from 'src/app/core/models/masters/organization/issue';
import { IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';
import { IssueDomainPaginationResponse } from 'src/app/core/models/masters/organization/issue-domain';
import { IssueTypePaginationResponse } from 'src/app/core/models/masters/organization/issue-type';
import { NeedsExpectationsResponse } from 'src/app/core/models/masters/organization/needs-expectations';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationSettingsService } from "src/app/core/services/settings/organization_settings/organization-settings.service";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss']
})
export class AddIssueComponent implements OnInit, OnDestroy {

  currentTab = 0;
  regForm: FormGroup;
  formErrors: any;
  reactionDisposer: IReactionDisposer;
  subscription: any;
  stakeHolderTypeSubscription: any;
  organisationChangesModalSubscription: any = null;
  confirmationEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  nextButtonText = 'next';
  previousButtonText = "previous";
  processMappingTitle = {
    component: 'issue',
  }
  openModelPopup: boolean = false;
  emptyMessage = "no_data_found"

  MsTypeStore = MsTypeStore;
  IssueCategoryStore = IssueCategoryMasterStore;
  IssueDomainStore = IssueDomainMasterStore;
  IssueTypeStore = IssueTypeMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  UsersStore = UsersStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  IssueMasterStore = IssueMasterStore;
  ProcessesStore = ProcessStore;
  StakeholdersStore = StakeholdersStore;
  StakeholderTypeMasterStore = StakeholderTypeMasterStore;
  IssueListStore = IssueListStore;
  NeedsExpectationsStore = NeedsExpectationsStore;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  BranchesStore = BranchesStore;
  OrganizationModulesStore = OrganizationModulesStore;
  selectedStakeHolder: any = null;
  needsAndExpectation: any = null;
  selectedUsers: number[] = [];
  displayForm: any = null;
  saveData: any = null;
  activeIndex = null;
  selectedProcessIndex: number = null;
  hover = false;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'are_you_sure_cancel',
    type: 'Cancel'
  };

  selectedIssueLibrary: boolean = false;
  selectedTitle: any = null;

  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }
  // issue_user_ids = [];

  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('issueTypeFormModal') issueTypeFormModal: ElementRef;
  @ViewChild('stakeholderFormModal') stakeholderFormModal: ElementRef;
  @ViewChild('issueCategoryFormModal') issueCategoryFormModal: ElementRef;
  @ViewChild('issueDomainFormModal') issueDomainFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('needsExpectationsFormModal') needsExpectationsFormModal: ElementRef;
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('editBar') editBar: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  formObject = {
    0: [
      'ms_type_organization_ids'
    ],
    1: [
      'issue_id',
      'title',
      'issue_category_ids',
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'branch_ids'
    ],
    2: [
      'process_ids'
    ],
    3: [
      'stakeholders'
    ]
  }
  showForm: boolean = false;
  constructor(private _formBuilder: FormBuilder, private _renderer2: Renderer2,
    private _mstypeService: MstypesService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _issueCategoryService: IssueCategoryService,
    private _issueDomainService: IssueDomainService, private _issueTypeService: IssueTypeService,
    private _subsidiaryService: SubsidiaryService, private _usersService: UsersService,
    private _divisionService: DivisionService, private _sectionService: SectionService,
    private _departmentService: DepartmentService, private _subsectionService: SubSectionService,
    private _issueService: IssueService, private _processesService: ProcessService,
    private _stakeholderService: StakeholdersListService, private _stakeholdertypeService: StakeholderTypeService,
    private _issueListService: IssueListService, private _needsExpectationsService: NeedsandexpectationsService,
    private _router: Router, private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService, private _organizationSettingsService: OrganizationSettingsService,
    private _branchesService: BranchService) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = false;
    OrganizationalSettingsStore.showBranch = true;
    OrganizationalSettingsStore.isMultiple = true;
    this._utilityService.scrollToTop();

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/organization/context/issue-lists' },
    ]);

    //Event Subscription for handling modal output events
    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      var modalNumber: number = item;
      switch (modalNumber) {
        case 1: this.closeIssueCategoryModal();
          break;
        case 2: this.closeIssueModal();
          break;
        case 3: this.closeIssueDomainModal();
          break;
        case 4: this.closeIssueTypeModal();
          break;
        case 5: this.closeStakeholderModal();
          break;
        case 6: this.closeNeedsExpectations();
          break;
        case 7: this.closeProcesses();
          break;
      }
      this._utilityService.detectChanges(this._cdr);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.timoutModalCloseHandler();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.timoutModalCloseHandler();
      }
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelIssueForm(item);
    })

    this.stakeHolderTypeSubscription = this._eventEmitterService.stakeHolderType.subscribe(stakeHolderTypeId => {
      if (stakeHolderTypeId) this.selectStakeHolderType(StakeholderTypeMasterStore.getTypeById(stakeHolderTypeId), true);
    })

    // Form Initialization
    this.regForm = this._formBuilder.group({
      id: null,
      issue_id: [null],
      title: [null],
      description: '',
      issue_status_id: null,
      issue_type_ids: [],
      issue_domain_ids: [],
      issue_category_ids: ['', [Validators.required]],
      issue_user_ids: [],
      organization_ids: ['', [Validators.required]],
      division_ids: [''],
      branch_ids: [''],
      department_ids: ['', [Validators.required]],
      section_ids: [''],
      sub_section_ids: [''],
      process_ids: [],
      ms_type_organization_ids: [],
      stakeholders: []
    });

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.regForm.controls['division_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.regForm.controls['section_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.regForm.controls['sub_section_ids'].setValidators(Validators.required);
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    //   this.regForm.controls['branch_ids'].setValidators(Validators.required);
    this.clearInitialData();
    // In case of edit
    if (this._router.url.indexOf('edit-issue') != -1) {
      if (IssueListStore.selectedIssueData)
        this.setDataForEdit();
      else
        this._router.navigateByUrl('/organization/context/issue-lists');
    }
    else {
      this.setInitialOrganizationLevels();
    }

    // Initialize Setup Form
    setTimeout(() => {
      if (OrganizationGeneralSettingsStore.loaded && !OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type) {
        this.showForm = true;
        this._utilityService.detectChanges(this._cdr);
        this.currentTab = 1;
        this.startForm();
      }
      else {
        this._organizationSettingsService.getOrganizationSettings().subscribe((res: any) => {
          this.showForm = true;
          this._utilityService.detectChanges(this._cdr);
          if (res.is_ms_type) this.currentTab = 0;
          else this.currentTab = 1;
          this.startForm();
        }, (error) => {
          this.showForm = true;
          this._utilityService.detectChanges(this._cdr);
          this.currentTab = 0;
          this.startForm();
        })
      }
    }, 1000);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
      if(IssueListStore.issue_form_modal == true)
        this.closeIssueModal();
      else if(IssueListStore.issue_category_form_modal == true){
        this.closeIssueCategoryModal();
      }
      else if(IssueListStore.stakeholder_form_modal == true){
        this.closeStakeholderModal();
      }
      else if(IssueListStore.issue_type_form_modal == true){
        this.closeIssueTypeModal();
      }
      else if(IssueListStore.issue_domain_form_modal == true){
        this.closeIssueDomainModal();
      }
      else if(IssueListStore.needs_expectation_form_modal == true){
        this.closeNeedsExpectations();
      }
      else if(IssueListStore.processes_form_modal == true){
        this.closeProcesses();
      }else if(this.openModelPopup == true){
        this.closeModal();
      }
    }
  }

  startForm() {
    this.showTab(this.currentTab);
    this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    window.addEventListener('scroll', this.scrollEvent, true);
    //Function Call to Get All Initial Data
    this.getAllData();
  }

  /**
   * Scroll Event Handler
   */
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.editBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.editBar.nativeElement, 'affix');
      }
    }
  }

  // clickEvent = (event: any): void => {
  //   this.activeIndex = null;
  //   this.hover = false;
  //   this._utilityService.detectChanges(this._cdr);
  // }

  timoutModalCloseHandler() {
    if ($(this.issueFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.issueTypeFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueTypeFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueTypeFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.stakeholderFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.stakeholderFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.stakeholderFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.issueCategoryFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueCategoryFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueCategoryFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.issueDomainFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.needsExpectationsFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.needsExpectationsFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.needsExpectationsFormModal.nativeElement, 'overflow', 'auto');
    }
  }

  /**
   * Returns image preview
   * @param type Type of image
   * @param token Image token
   */
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  // Gets initial data to be displayed in form elements
  getAllData() {
    this.msTypePageChange();
    //this._usersService.getAllItems().subscribe();
    this._issueCategoryService.getItems(true).subscribe();
    this._issueDomainService.getItems(true).subscribe();
    this._issueTypeService.getItems(true).subscribe();
    // this._subsidiaryService.getAllItems(false).subscribe();
    //this._departmentService.getDepartments().subscribe();
    //this._divisionService.getDivisions().subscribe();
    //this._sectionService.getSections().subscribe();
    //this._subsectionService.getSubSections().subscribe();
    this._issueService.getItems().subscribe();
    this._needsExpectationsService.getItems().subscribe();
    // this.getSubsidiary();
    // this.getBranches();
    this._stakeholdertypeService.getAllItems().subscribe(res => {
      this.selectStakeHolderType(res[0]);
    });
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
  }

  clearInitialData() {
    IssueListStore.selectedMsTypes = [];
    IssueListStore.selectedStakeHolderType = null;
    IssueListStore.selectedNeedsExpectations = [];
  }

  setInitialOrganizationLevels() {
    this.regForm.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
      branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.regForm.patchValue({ organization_ids: [AuthStore.user.organization]});
    // }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.regForm.value.division_ids });
    this.searchDepartment({ term: this.regForm.value.department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.regForm.value.section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.regForm.value.sub_section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({ term: this.regForm.value.branch_ids });
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Get Organization Ms Type
   * @param newPage Page Number for pagination
   */
  msTypePageChange(newPage: number = null) {
    if (newPage) MsTypeStore.setCurrentPage(newPage); else MsTypeStore.setCurrentPage(1);
    this._mstypeService.getItems(false, '&access_all=true').subscribe();
  }

  /**
   * Sets selected ms type
   * @param msType selected Ms Type
   */
  selectMsType(msType) {
    this._issueListService.setMsTypes(msType);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Returns whether specified mstype is already selected or not
   * @param msType Ms Type to check
   */
  findSelectedMsTypes(msType) {
    //return this.selectedMsTypes.findIndex( e=> e.id == msType.id);
    return this._issueListService.getMsTypes(msType.id);
  }

  /**
   * Assigns issue description to description field
   * @param selectedIssue Selected Issue 
   */
  issueSelected(selectedIssue) {
    console.log('set',selectedIssue)
    if (selectedIssue){
      this.selectedTitle = selectedIssue.title
      this.regForm.patchValue({ description: selectedIssue.description ? selectedIssue.description : '' });
    }
    else{
      this.regForm.patchValue({ description: '' });
    }         
  }

  /**
   * Stakeholder type is selected
   * @param stype Stakeholder Type Details
   * @param patchValue boolean value - sets newly created stakeholder in the form
   */
  selectStakeHolderType(stype, patchValue: boolean = false) {
    this._issueListService.setStakeHolderType(stype);
    StakeholdersStore.unsetStakeholders();
    this.selectedStakeHolder = null;
    this._stakeholderService.getItems('&stakeholder_type_ids=' + stype.id)
      .subscribe(res => {
        if (patchValue) {
          this.selectedStakeHolder = StakeholdersStore.lastInsertedId;
          this.searchStakeHolder({ term: this.selectedStakeHolder });
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  // Adds Needs and Expectations to the list
  addNeedsExpectations() {
    var result = this._issueListService.addNeedsandExpectations(this._needsExpectationsService.getNeedsAndExpectationsById(this.needsAndExpectation), this._stakeholderService.getStakeHolderDetailsById(this.selectedStakeHolder));
    if (!result)
      this._utilityService.showErrorMessage('item_present', 'item_already_added');
    this.needsAndExpectation = null;
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * To handle accordion list of Needs and Expectation Display
   * @param position Position of Needs & Expectation Array
   */
  showhideNeedsExpectations(position) {
    this._issueListService.showOrHideNeedsExpectations(position);
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns Selected Stakeholder Type
  getSelectedStakeholderType() {
    return this._issueListService.getStakeHolderType();
  }

  // Opens Modal to Select Processes
  selectProcesses() {
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select processes
  closeProcesses() {
    IssueListStore.processes_form_modal = false;
    $(this.processFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

  // Opens Modal to add New Issue
  addIssue() {
    IssueListStore.issue_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Issue.
   * If new issue created, search for issue by id and patches the form
   */
  closeIssueModal() {
    IssueListStore.issue_form_modal = false;
    if (IssueMasterStore.lastInsertedId) {
      this.searchIssues({ term: IssueMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Opens Modal to add New Issue Type
  addIssueType() {
    IssueListStore.issue_type_form_modal = true;
    $(this.issueTypeFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Issue Type.
   * If new issue type created, search for issue type by id and patches the form
   */
  closeIssueTypeModal() {
    IssueListStore.issue_type_form_modal = false;
    if (this.IssueTypeStore.lastInsertedId) {
      this.searchIssueType({ term: this.IssueTypeStore.lastInsertedId }, true)
    }
    setTimeout(() => {
      $(this.issueTypeFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Opens Modal to add New Stakeholder
  addStakeholder() {
    IssueListStore.stakeholder_form_modal = true;
    $(this.stakeholderFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Stakeholder.
   * If new stakeholder created, search for stakeholder by id and patches the form
   */
  closeStakeholderModal() {
    // console.log(this.getSelectedStakeholderType());
    this.selectStakeHolderType(this.getSelectedStakeholderType(), true);
    setTimeout(() => {
      IssueListStore.stakeholder_form_modal = false;
      $(this.stakeholderFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Opens Modal to add New Issue Category
  addIssueCategory() {
    IssueListStore.issue_category_form_modal = true;
    $(this.issueCategoryFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Issue Category.
   * If new issue category created, search for issue category by id and patches the form
   */
  closeIssueCategoryModal() {
    IssueListStore.issue_category_form_modal = false;
    if (IssueCategoryMasterStore.lastInsertedId) {
      this.searchIssueCategory({ term: IssueCategoryMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      $(this.issueCategoryFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Opens Modal to add New Issue Domain
  addIssueDomain() {
    IssueListStore.issue_domain_form_modal = true;
    $(this.issueDomainFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Issue Domain.
   * If new issue domain created, search for issue domain by id and patches the form
   */
  closeIssueDomainModal() {
    if (IssueDomainMasterStore.lastInsertedId) {
      this.searchIssueDomain({ term: IssueDomainMasterStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      IssueListStore.issue_domain_form_modal = false;
      $(this.issueDomainFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // Opens Modal to add New Needs and Expectation
  addNeedsExpectation() {
    IssueListStore.needs_expectation_form_modal = true;
    $(this.needsExpectationsFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add Needs and Expectations.
   * If new Needs and Expectations is created, search for Needs and Expectations by id and patches the form
   */
  closeNeedsExpectations() {
    IssueListStore.needs_expectation_form_modal = false;
    if (NeedsExpectationsStore.lastInsertedId) {
      this.searchNeedsAndExpectations({ term: NeedsExpectationsStore.lastInsertedId }, true);
    }
    setTimeout(() => {
      $(this.needsExpectationsFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  /*-------------------------- Functions to handle step form Starts Here -----------------------------------------------*/

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0 || (!OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type && n == 1)) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      this.displayForm = this.regForm.value;
      if (IssueListStore.selectedMsTypes) this.displayForm.ms_type_organization_ids = IssueListStore.selectedMsTypes;
      if (ProcessStore.processesToDisplay) this.displayForm.process_ids = ProcessStore.processesToDisplay;
      if (IssueListStore.selectedNeedsExpectations) this.displayForm.stakeholders = IssueListStore.selectedNeedsExpectations;
      IssueListStore.setNeedsAndExpectationsAccordion(0);
      //console.log(this.displayForm);
      if (document.getElementById("nextBtn")) {
        //document.getElementById("nextBtn").innerHTML = "Save";
        this.nextButtonText = "save";
      }
      // console.log(this.selectedUsers);
    } else {
      if (document.getElementById("nextBtn")) {
        // document.getElementById("nextBtn").innerHTML = "Next";
        this.nextButtonText = "next";
      }
    }
    //... and run a function that will display the correct step indicator:
    this._utilityService.scrollToTop();
    this.fixStepIndicator(n);
  }

  nextPrev(n) {
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    // if (n == 1 && !validateForm()) return false;

    document.getElementsByClassName("step")[this.currentTab].className += " finish";

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    if (!OrganizationModulesStore.checkOrganizationModules(600)) {
      if (this.currentTab == 1) {
        if (n == 1) this.currentTab = this.currentTab + n * 2;
        else this.currentTab = this.currentTab + n;
      }
      else if (this.currentTab == 3) {
        // if(n > 0) this.currentTab = this.currentTab + n;
        // else {
        if (n == -1) this.currentTab = this.currentTab + n * 2;
        else this.currentTab = this.currentTab + n;
        // }
      }
      else this.currentTab = this.currentTab + n;
    }
    else
      this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:

      //document.getElementById("regForm").submit();
      this.createIssueSaveData();
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.createIssue();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  validateForm() {
    // This function deals with validation of the form fields
    var x: any, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (var i = 0; i < x.length; i++) {
      if (!OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type) {
        if (i == 1) x[i].style.display = "block";
        else x[i].style.display = "none";
      } else {
        if (i == 0) x[i].style.display = "block";
        else x[i].style.display = "none";
      }

    }
  }

  /*-------------------------- Functions to handle step form Ends Here-----------------------------------------------*/

  // Format data to save or update issue
  createIssueSaveData() {
    this.saveData = {
      "id": this.displayForm.id ? this.displayForm.id : '',
      "issue_id": this.selectedIssueLibrary ? this.displayForm.issue_id.id ? this.displayForm.issue_id.id : null : null,
      "title": this.displayForm.title ? this.displayForm.title : this.selectedTitle,
      "description": this.displayForm.description ? this.displayForm.description : '',
      "issue_status_id": 1,
      "issue_type_ids": [],
      "issue_domain_ids": [],
      "issue_category_ids": [],
      "issue_user_ids": [],
      "organization_ids": [],
      "division_ids": [],
      "department_ids": [],
      "section_ids": [],
      "sub_section_ids": [],
      "branch_ids": [],
      "process_ids": [],
      "ms_type_organization_ids": [],
      "stakeholders": []
    };
    if (this.displayForm.issue_type_ids && this.displayForm.issue_type_ids.length > 0) {
      // for(let i of this.displayForm.issue_type_ids){
      //   this.saveData.issue_type_ids.push(i.id);
      // }
      this.saveData.issue_type_ids = this._helperService.getArrayProcessed(this.displayForm.issue_type_ids, 'id');
    }
    else {
      this.saveData.issue_type_ids = [];
    }
    if (this.displayForm.issue_domain_ids && this.displayForm.issue_domain_ids.length > 0) {
      // for(let i of this.displayForm.issue_domain_ids){
      //   this.saveData.issue_domain_ids.push(i.id);
      // }
      this.saveData.issue_domain_ids = this._helperService.getArrayProcessed(this.displayForm.issue_domain_ids, 'id');
    }
    else {
      this.saveData.issue_domain_ids = [];
    }
    if (this.displayForm.issue_category_ids && this.displayForm.issue_category_ids.length > 0) {
      // for(let i of this.displayForm.issue_category_ids){
      //   this.saveData.issue_category_ids.push(i.id);
      // }
      this.saveData.issue_category_ids = this._helperService.getArrayProcessed(this.displayForm.issue_category_ids, 'id');
    }
    else {
      this.saveData.issue_category_ids = [];
    }
    if (this.displayForm.issue_user_ids && this.displayForm.issue_user_ids.length > 0) {
      // for(let i of this.displayForm.issue_user_ids){
      //   this.saveData.issue_user_ids.push(i.id);
      // }
      this.saveData.issue_user_ids = this._helperService.getArrayProcessed(this.displayForm.issue_user_ids, 'id');
    }
    else {
      this.saveData.issue_user_ids = [];
    }
    if (this.displayForm.organization_ids && this.displayForm.organization_ids.length > 0) {
      // for(let i of this.displayForm.organization_ids){
      //   this.saveData.organization_ids.push(i.id);
      // }
      this.saveData.organization_ids = this._helperService.getArrayProcessed(this.displayForm.organization_ids, 'id');
    }
    else {
      this.saveData.organization_ids = [];
    }
    if (this.displayForm.division_ids && this.displayForm.division_ids.length > 0) {
      // for(let i of this.displayForm.division_ids){
      //   this.saveData.division_ids.push(i.id);
      // }
      this.saveData.division_ids = this._helperService.getArrayProcessed(this.displayForm.division_ids, 'id');
    }
    else {
      this.saveData.division_ids = [];
    }
    if (this.displayForm.department_ids && this.displayForm.department_ids.length > 0) {
      // for(let i of this.displayForm.department_ids){
      //   this.saveData.department_ids.push(i.id);
      // }
      this.saveData.department_ids = this._helperService.getArrayProcessed(this.displayForm.department_ids, 'id');
    }
    else {
      this.saveData.department_ids = [];
    }
    if (this.displayForm.section_ids && this.displayForm.section_ids.length > 0) {
      // for(let i of this.displayForm.section_ids){
      //   this.saveData.section_ids.push(i.id);
      // }
      this.saveData.section_ids = this._helperService.getArrayProcessed(this.displayForm.section_ids, 'id');
    }
    else {
      this.saveData.section_ids = [];
    }
    if (this.displayForm.sub_section_ids && this.displayForm.sub_section_ids.length > 0) {
      // for(let i of this.displayForm.sub_section_ids){
      //   this.saveData.sub_section_ids.push(i.id);
      // }
      this.saveData.sub_section_ids = this._helperService.getArrayProcessed(this.displayForm.sub_section_ids, 'id');
    }
    else {
      this.saveData.sub_section_ids = [];
    }
    if (this.displayForm.branch_ids && this.displayForm.branch_ids.length > 0) {
      this.saveData.branch_ids = this._helperService.getArrayProcessed(this.displayForm.branch_ids, 'id');
    }
    else {
      this.saveData.branch_ids = [];
    }
    if (this.displayForm.process_ids && this.displayForm.process_ids.length > 0) {
      for (let i of this.displayForm.process_ids) {
        for (let j of i.ids) {
          this.saveData.process_ids.push(j);
        }
      }
    }
    else {
      this.saveData.process_ids = [];
    }
    if (this.displayForm.ms_type_organization_ids && this.displayForm.ms_type_organization_ids.length > 0) {
      // for(let i of this.displayForm.ms_type_organization_ids){
      //   this.saveData.ms_type_organization_ids.push(i.id);
      // }
      this.saveData.ms_type_organization_ids = this._helperService.getArrayProcessed(this.displayForm.ms_type_organization_ids, 'id');
    }
    else {
      this.saveData.ms_type_organization_ids = [];
    }
    if (this.displayForm.stakeholders && this.displayForm.stakeholders.length > 0) {
      for (let i of this.displayForm.stakeholders) {
        let st = {
          "stakeholder_id": i.stakeholder,
          "need_and_expectation_ids": i.values
        };
        this.saveData.stakeholders.push(st);
      }
    }
    else {
      this.saveData.stakeholders = [];
    }
  }

  // Save or Update Issue
  createIssue() {
    let save: any;
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    let pthis = this;
    if (this.saveData.id) {
      save = this._issueListService.updateItem(this.saveData.id, this.saveData);
    }
    else {
      save = this._issueListService.saveItem(this.saveData);
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      if (this.saveData.id)
        this._router.navigateByUrl('/organization/issue-details/' + this.saveData.id);
      else
        this._router.navigateByUrl('/organization/issue-details/' + res.id);
      //this._router.navigateByUrl('/organization/context/issue-lists');
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        // .organizationSettings?.is_ms_type ? 0 : 1;
        this.nextButtonText = "next";
        this.previousButtonText = "previous";
        this.currentTab = this.OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type ? 0 : 1;
        this.setInitialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  /**
   * Search for users
   * @param e e.term - character to search
   */
  searchUers(e) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('section_ids').value)
      + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('sub_section_ids').value);
    this._usersService.searchUsers('?q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Get all users
  getUsers() {
    var params = '';
    params = '?organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('section_ids').value)
      + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('sub_section_ids').value);
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Get issues
  getIssues() {
    this._issueService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
   * Search Issue
   * @param e e.term - character to search
   * @param patchValue boolean value - to patch form value
   */
  searchIssues(e, patchValue: boolean = false) {
    this._issueService.getItems(false, 'q=' + e.term).subscribe((res: IssuePaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue(
              {
                issue_id: i,
                description: i.description
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Issue Category
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
  searchIssueCategory(e, patchValue: boolean = false) {
    this._issueCategoryService.getItems(false, 'q=' + e.term).subscribe((res: IssueCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let issue_categories = this.regForm.value.issue_category_ids ? this.regForm.value.issue_category_ids : [];
            issue_categories.push(i);
            this.regForm.patchValue({ issue_category_ids: issue_categories });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Issue Category
  getIssueCategory() {
    this._issueCategoryService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Issue Domain
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
  searchIssueDomain(e, patchValue: boolean = false) {
    this._issueDomainService.getItems(false, 'q=' + e.term).subscribe((res: IssueDomainPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let issue_domains = this.regForm.value.issue_domain_ids ? this.regForm.value.issue_domain_ids : [];
            issue_domains.push(i);
            this.regForm.patchValue({ issue_domain_ids: issue_domains });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Issue Domain
  getIssueDomain() {
    this._issueDomainService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Issue Type
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
  searchIssueType(e, patchValue: boolean = false) {
    this._issueTypeService.getItems(false, 'q=' + e.term).subscribe((res: IssueTypePaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let issue_types = this.regForm.value.issue_type_ids ? this.regForm.value.issue_type_ids : [];
            issue_types.push(i);
            this.regForm.patchValue({ issue_type_ids: issue_types });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Issue Type
  getIssueType() {
    this._issueTypeService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getBranches() {
    if (this.regForm.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  searchBranches(e) {
    if (this.regForm.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  /**
  * Search Subsidiary
  * @param e e.term - character to search
  */
  searchSubsidiary(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  // Get Subsidiary
  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe((res: any) => {
      if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary) {
        this.regForm.patchValue({ organization_ids: [res.data[0]] });
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Division
  * @param e e.term - character to search
  */
  searchDivision(e) {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Division
  getDivision() {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  /**
  * Search Department
  * @param e e.term - character to search
  */
  searchDepartment(e) {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value);
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Department
  getDepartment() {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  // Get Section
  getSection() {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      if (this.regForm.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SectionStore.setAllSection([]);
    }
  }

  /**
  * Search Section
  * @param e e.term - character to search
  */
  searchSection(e) {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      if (this.regForm.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Sub Section
  getSubSection() {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      if (this.regForm.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      if (this.regForm.get('section_ids').value)
        params += '&section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
      this._subsectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  /**
  * Search Sub Section
  * @param e e.term - character to search
  */
  searchSubSection(e) {
    if (this.regForm.get('organization_ids').value && this.regForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.regForm.get('organization_ids').value)
      if (this.regForm.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      if (this.regForm.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      if (this.regForm.get('section_ids').value)
        params += '&section_ids=' + this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
      // let parameters = this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
      this._subsectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  /**
  * Search Stakeholder
  * @param e e.term - character to search
  */
  searchStakeHolder(e) {
    this._stakeholderService.getItems('&stakeholder_type_ids=' + this._issueListService.getStakeHolderType().id + '&q=' + e.term)
      .subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  }

  // Get Stakeholders
  getStakeHolder() {
    this.selectStakeHolderType(this._issueListService.getStakeHolderType());
  }

  // Get Needs and Expectations
  getNeedsAndExpectations() {
    this._needsExpectationsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  /**
  * Search Needs and Expectations
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
  searchNeedsAndExpectations(e, patchValue: boolean = false) {
    this._needsExpectationsService.getItems('&q=' + e.term).subscribe((res: NeedsExpectationsResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.needsAndExpectation = i.id
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  removeMappedProcess(processGroup, process) {
    // console.log(processGroup);
    // console.log(process);
    console.log(ProcessStore.processesToDisplay);
    console.log(ProcessStore.selectedProcessesList);
    let index = ProcessStore.selectedProcessesList.findIndex(e => e.reference_code == process.ref_code);
    if (index != -1) ProcessStore.selectedProcessesList.splice(index, 1);
    let dIndex = ProcessStore.processesToDisplay.findIndex(e => e.process_group == processGroup.process_group);
    if (dIndex != -1) {
      let valuesPos = ProcessStore.processesToDisplay[dIndex].values.findIndex(e => e.ref_code == process.ref_code)
      if (valuesPos != -1) {
        ProcessStore.processesToDisplay[dIndex].values.splice(valuesPos, 1);
        ProcessStore.processesToDisplay[dIndex].ids.splice(valuesPos, 1);
        if (ProcessStore.processesToDisplay[dIndex].ids.length == 0) {
          ProcessStore.processesToDisplay.splice(dIndex, 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);

  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    window.removeEventListener('scroll', this.scrollEvent);
    ProcessStore.unsetSelectedProcesses();
    this.idleTimeoutSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.stakeHolderTypeSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
  }

  // Sets Data in Form for Edit
  setDataForEdit() {
    var issueDetails = IssueListStore.selectedIssueData;
    // console.log(issueDetails);
    for (let i of issueDetails.ms_type_organizations) {
      let msDetails = {
        id: i.id,
        ms_type_id: i.ms_type_id,
        organization_id: i.organization_id,
        ms_type_version_id: i.ms_type_version_id,
        status_id: i.status_id,
        ms_type_title: i.ms_type.title,
        ms_type_code: i.ms_type.code,
        ms_type_version_title: i.ms_type_version.title,
        organization_title: ''
      }
      this._issueListService.setMsTypes(msDetails);
    }
    if (issueDetails?.issue?.title) {
      this.selectedIssueLibrary = true;
    }
    this.regForm.patchValue({
      id: issueDetails.id ? issueDetails.id : '',
      issue_id: (issueDetails.issue && issueDetails.issue.id) ? issueDetails.issue?.title : '',
      title: issueDetails.title ? issueDetails.title : '',
      description: issueDetails.description ? issueDetails.description : '',
      issue_status_id: issueDetails.status ? issueDetails.status.id : '',
      issue_type_ids: issueDetails.issue_types ? this.getEditValue(issueDetails.issue_types) : [],
      issue_domain_ids: issueDetails.issue_domains ? this.getEditValue(issueDetails.issue_domains) : [],
      issue_category_ids: issueDetails.issue_categories ? this.getEditValue(issueDetails.issue_categories) : [],
      issue_user_ids: issueDetails.users ? this.getEditValue(issueDetails.users) : [],
      organization_ids: issueDetails.organizations ? this.getEditValue(issueDetails.organizations) : [],
      division_ids: issueDetails.divisions ? this.getEditValue(issueDetails.divisions) : [],
      department_ids: issueDetails.departments ? this.getEditValue(issueDetails.departments) : [],
      section_ids: issueDetails.sections ? this.getEditValue(issueDetails.sections) : [],
      sub_section_ids: issueDetails.sub_sections ? this.getEditValue(issueDetails.sub_sections) : [],
      branch_ids: issueDetails.branches ? this.getEditValue(issueDetails.branches) : []
    })
    this.selectedUsers = issueDetails.users ? this._helperService.getArrayProcessed(issueDetails.users, 'id') : [];
    // this.selectedUsers = [26,1];
    this.getDivision();
    this.getDepartment();
    this.getSection();
    this.getSubSection();
    this.getUsers();
    this.getBranches();
    this.issueStakeHolderEditValue(issueDetails.stakeholders);
    this.issueProcessesEditValue(issueDetails.processes);
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i);
    }
    return returnValue;
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

  getStepPosition(step) {
    if (!OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type && !OrganizationModulesStore.checkOrganizationModules(600)) {
      return step - 1;
    }
    else {
      if (!OrganizationGeneralSettingsStore.organizationSettings?.is_ms_type)
        return step;
      else if (!OrganizationModulesStore.checkOrganizationModules(600))
        return step + 1;
      else
        return step + 1;
    }
  }

  openProcess(index) {
    this.selectedProcessIndex = this.selectedProcessIndex == index ? null : index;
  }

  // Sets Needs and Expectations
  issueStakeHolderEditValue(issue_stakeholder) {
    // console.log(issue_stakeholder);
    let stakeholderValues = toJS(issue_stakeholder);
    for (let i of stakeholderValues) {
      for (let j of i.need_and_expectations) {
        this._issueListService.addNeedsandExpectations(j, i.stakeholder, true);
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Sets Processes
  issueProcessesEditValue(issue_process) {
    var returnValue = [];
    for (let i of issue_process) {
      i['process_group_title'] = i.process_group.title;
      i['process_category_title'] = i.process_category ? i.process_category.title : null;
      returnValue.push(i);
    }
    this._processesService.selectRequiredProcesses(returnValue);
  }

  // Returns Date
  getDate() {
    return new Date();
    // return this._helperService.timeZoneFormatted(new Date());
  }

  removeNeedsAndExpectation(item, stakeholderParentIndex) {
    this._issueListService.removeNeedsandExpectations(item, stakeholderParentIndex);
    this._utilityService.detectChanges(this._cdr);
  }

  getArrayFormatedString(items) {
    return this._helperService.getArraySeperatedString(',', 'title', items);
  }

  cancelClicked() {
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  cancelIssueForm(status) {
    $(this.confirmationPopup.nativeElement).modal('hide');
    if (status)
      this._router.navigateByUrl(AppStore.previousUrl ? AppStore.previousUrl : '/organization/context/issue-lists');
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

  userSelected(event, type) {
    if (type == 'add') {
      if (!this.regForm.value.issue_user_ids) this.regForm.value.issue_user_ids = [event];
      else this.regForm.value.issue_user_ids.push(event);
    }
    else {
      var pos = this.regForm.value.issue_user_ids.findIndex(e => e.id == event.value.id);
      if (pos != -1) this.regForm.value.issue_user_ids.splice(pos, 1);
    }
  }

  processFormErrors() {
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.startsWith('issue_type_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['issue_type_ids'] = this.formErrors['issue_type_ids'] ? this.formErrors['issue_type_ids'] + errors[key] + '(' + (errorPosition + 1) + ')' : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('issue_domain_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['issue_domain_ids'] = this.formErrors['issue_domain_ids'] ? this.formErrors['issue_domain_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('issue_category_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['issue_category_ids'] = this.formErrors['issue_category_ids'] ? this.formErrors['issue_category_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('issue_user_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['issue_user_ids'] = this.formErrors['issue_user_ids'] ? this.formErrors['issue_user_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('organization_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['organization_ids'] = this.formErrors['organization_ids'] ? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('division_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['division_ids'] = this.formErrors['division_ids'] ? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('department_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['department_ids'] = this.formErrors['department_ids'] ? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['section_ids'] = this.formErrors['section_ids'] ? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('sub_section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids'] ? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('branch_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['branch_ids'] = this.formErrors['branch_ids'] ? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('ms_type_organization_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['ms_type_organization_ids'] = this.formErrors['ms_type_organization_ids'] ? this.formErrors['ms_type_organization_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('stakeholders.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['stakeholders'] = this.formErrors['stakeholders'] ? this.formErrors['stakeholders'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('process_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['process_ids'] = this.formErrors['process_ids'] ? this.formErrors['process_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    if (user) {
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = IssueListStore.selectedIssueData.created_at;
      console.log(userDetailObject['created_at']);
      return userDetailObject;
    }
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.regForm.controls[i].valid) {
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
            if (!this.regForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  handleDropDownClear(type) {
    switch (type) {
      case 'organization_id': this.regForm.controls['division_ids'].reset();
        this.regForm.controls['department_ids'].reset();
        this.regForm.controls['section_ids'].reset();
        this.regForm.controls['sub_section_ids'].reset();
        this.regForm.controls['issue_user_ids'].reset();
        break;
      case 'division_id': this.regForm.controls['department_ids'].reset();
        this.regForm.controls['section_ids'].reset();
        this.regForm.controls['sub_section_ids'].reset();
        this.regForm.controls['issue_user_ids'].reset();
        break;
      case 'department_id': this.regForm.controls['section_ids'].reset();
        this.regForm.controls['sub_section_ids'].reset();
        this.regForm.controls['issue_user_ids'].reset();
        break;
      case 'section_id': this.regForm.controls['sub_section_ids'].reset();
        this.regForm.controls['issue_user_ids'].reset();
        break;
      case 'sub_section_id': this.regForm.controls['issue_user_ids'].reset();
        break;
      default: '';
        break;
    }
  }

  handleDropDownItemClear(event, type) {
    switch (type) {
      case 'organization_id': if (OrganizationLevelSettingsStore.organizationLevelSettings.is_division)
        this.checkDivision(event.value.id, type);
        this.checkDepartment(event.value.id, type);
        if (OrganizationLevelSettingsStore.organizationLevelSettings.is_section)
          this.checkSection(event.value.id, type);
        if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section)
          this.checkSubSection(event.value.id, type);
        this.checkUser(event.value.id, type);
        break;
      case 'division_id': this.checkDepartment(event.value.id, type);
        this.checkUser(event.value.id, type);
        break;
      case 'department_id': if (OrganizationLevelSettingsStore.organizationLevelSettings.is_section)
        this.checkSection(event.value.id, type);
        this.checkUser(event.value.id, type)
        break;
      case 'section_id': if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section)
        this.checkSubSection(event.value.id, type);
        this.checkUser(event.value.id, type)
        break;
      case 'sub_section_id': this.checkUser(event.value.id, type);
        break;
      default: '';
        break;
    }
  }

  checkDivision(organizationId: number, type: string) {
    let divisionValue: [] = this.regForm.value.division_ids;
    for (var i = 0; i < divisionValue.length; i++) {
      let divOrganizationId = divisionValue[i][type];
      if (organizationId == divOrganizationId) {
        divisionValue.splice(i, 1);
        i--;
      }
    }
    this.regForm.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number, type: string) {
    let departmentValue: [] = this.regForm.value.department_ids;
    for (var i = 0; i < departmentValue.length; i++) {
      let deptDivisionId = departmentValue[i][type];
      if (divisionId == deptDivisionId) {
        if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
        departmentValue.splice(i, 1);
        i--;
      }
    }
    this.regForm.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSection(departmentId: number, type: string) {
    let sectionValue: [] = this.regForm.value.section_ids;
    for (var i = 0; i < sectionValue.length; i++) {
      let sectionDepartmentId = sectionValue[i][type];
      if (departmentId == sectionDepartmentId) {
        if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
        sectionValue.splice(i, 1);
        i--;
      }
    }
    this.regForm.controls['section_ids'].setValue(sectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSubSection(sectionId: number, type: string) {
    let subSectionValue: [] = this.regForm.value.sub_section_ids;
    for (var i = 0; i < subSectionValue.length; i++) {
      let subSectionSectionId = subSectionValue[i][type];
      if (sectionId == subSectionSectionId) {
        subSectionValue.splice(i, 1);
        i--;
      }
    }
    this.regForm.controls['sub_section_ids'].setValue(subSectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkUser(id: number, type: string) {
    let userValues = this.regForm.value.issue_user_ids;
    for (var i = 0; i < userValues.length; i++) {
      let requiredId = userValues[i][type];
      if (requiredId == id) {
        userValues.splice(i, 1);
        i--;
      }
    }
    this.regForm.controls['issue_user_ids'].setValue(userValues);
    this._utilityService.detectChanges(this._cdr);
  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if (data) {
      if(JSON.stringify(data.department_ids)!=JSON.stringify(this.regForm.value.department_ids))
      {
        this.regForm.patchValue({
          issue_user_ids:[]
        })
      }
      this.regForm.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids: data.department_ids ? data.department_ids : [],
        section_ids: data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : [],
      })
    }
    //console.log(this.form.value.department_ids)
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  // closeModal(data?) {
  //   if (data) {
  //     this.regForm.patchValue({
  //       division_ids: data.division_ids ? data.division_ids : [],
  //       department_ids: data.department_ids ? data.department_ids : [],
  //       section_ids: data.section_ids ? data.section_ids : [],
  //       sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
  //       organization_ids: data.organization_ids ? data.organization_ids : []
  //     })
  //   }
  //   this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
  //   this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
  //   this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
  //   this.openModelPopup = false;
  //   this._utilityService.detectChanges(this._cdr);
  // }

  getNoDataSource(type) {
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  setIssueLibrary(event) {

		this.regForm.patchValue({
			issue_id: null,
			title: ''
		})
    

		this.selectedIssueLibrary = event.target.checked;
    if(this.selectedIssueLibrary){
      this.regForm.controls["title"].clearValidators();
      this.regForm.controls['issue_id'].setValidators(Validators.required);
      this.regForm.controls['title'].reset();
    }else{
      this.regForm.controls["issue_id"].clearValidators();
      this.regForm.controls['title'].setValidators(Validators.required);
      this.regForm.controls['issue_id'].reset();
    }
    this.regForm.get("issue_id").updateValueAndValidity();
    this.regForm.get("title").updateValueAndValidity();
	}

}
