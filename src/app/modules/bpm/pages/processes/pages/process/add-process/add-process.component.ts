import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from "src/app/stores/app.store";
import { ProcessGroupsService } from "src/app/core/services/masters/bpm/process-groups/process-groups.service";
import { ProcessGroupsMasterStore } from "../../../../../../../stores/masters/bpm/process-groups-master.store";
import { ProcessCategoriesService } from "src/app/core/services/masters/bpm/process-categories/process-categories.service";
import { ProcessCategoryMasterStore } from "../../../../../../../stores/masters/bpm/prcoess-category.master.store";
import { MstypesService } from "src/app/core/services/organization/business_profile/ms-type/mstype.service";
import { MsTypeStore } from "src/app/stores/organization/business_profile/ms-type/ms-type.store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "../../../../../../../stores/human-capital/users/users.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun, toJS } from "mobx";
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store'
import { Router } from '@angular/router';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store'
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { BpmFileService } from 'src/app/core/services/bpm/bpm-file/bpm-file.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { AuthStore } from "src/app/stores/auth.store";
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";
import { OrganizationalSettingsStore } from "src/app/stores/general/organizational-settings-store";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from "src/app/core/services/fileUploadPopup/file-upload-popup.service";
declare var $: any;

@Component({
  selector: "app-add-process",
  templateUrl: "./add-process.component.html",
  styleUrls: ["./add-process.component.scss"],
})
export class AddProcessComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('controlCategoryFormModal') controlCategoryFormModal: ElementRef;
  @ViewChild('processGroupFormModal') processGroupFormModal: ElementRef;
  @ViewChild("popup") popup: ElementRef;
  @ViewChild('processUploadArea', { static: false }) processUploadArea: ElementRef;
  @ViewChild('supportUploadArea', { static: false }) supportUploadArea: ElementRef;
  @ViewChild('controlDetails') controlDetails: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('processRisksItemDiv', { static: false }) processRisksItemDiv: ElementRef;
  @ViewChild('processRisksPreviewItemDiv', { static: false }) processRisksPreviewItemDiv: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('previewUploadArea2', { static: false }) previewUploadArea2: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('uploadArea2', { static: false }) uploadArea2: ElementRef;
  processForm: FormGroup;
  processFormErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ProcessGroupsMasterStore = ProcessGroupsMasterStore;
  ProcessCategoryMasterStore = ProcessCategoryMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  MsTypeStore = MsTypeStore;
  SubMenuItemStore = SubMenuItemStore;
  UsersStore = UsersStore;
  reactionDisposer: IReactionDisposer;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  ProcessStore = ProcessStore;
  ControlStore = ControlStore;
  BranchesStore = BranchesStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadProgress = 0;
  processRisks = [];
  processRiskError = null;
  formErrors: any;
  openModelPopup: boolean
  controlObject = {
    values: null,
    type: null,
    page: 'add-risk'
  }
  itemtype = 'processOwner';
  ViewcontrolDetails: boolean = false;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  controlsEmptyList = "Could not find any controls attached to the processes.";

  processFlowArray: any = [];
  attachementArray: any = [];
  accountableUsers: any = [];
  control_ids = []
  displayForm: any

  fileUploadObject = {
    type: ''
  }

  cancelObject = {
    title: '',
    subtitle: '',
    type: '',
  };

  userInfoObject = []
  process_kh_files = []
  process_system_files = []
  process_update_array = []

  support_kh_files = []
  support_system_files = []
  support_update_array = []

  org_id: number;
  divison_id: number;
  department_id: number;
  section_id: number;
  sub_section_id: number;

  activeIndex = null;
  hover = false;
  selectedItem = null;
  showDetails: boolean = false;
  controlsModalTitle = 'process_controls_modal_message'
  processGroupModalSubscription: any = null;
  processCategoryModalSubscription: any = null;
  cancelEventSubscription: any;
  controlModalEventSubscription: any;
  idleTimeoutSubscription: any;
  controlPreviewSubscription: any;
  controlModalSubscription: any;
  setModalStyleSubscription: any;
  networkFailureSubscription: any;
  organisationChangesModalSubscription: any = null;
  fileUploadPopupSubscriptionEvent: any = null;

  formObject = {
    0: [
      'process_group_id',
      'process_category_id',
      'organization_id',
      'branch_id',
      'division_id',
      'department_id',
      'section_id',
      'sub_section_id',
      'title',
      'process_owner_id',
      // 'process_risks'
    ]
  }

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _processGroupService: ProcessGroupsService,
    private _msTypeService: MstypesService,
    private _userService: UsersService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _processService: ProcessService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _controlService: ControlsService,
    private _bpmFileService: BpmFileService,
    private _branchesService: BranchService,
    private _eventEmeitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _processCategoryService: ProcessCategoriesService,

  ) { }

  ngOnInit(): void {
    AppStore.disableLoading();
    AppStore.showDiscussion = false;
    OrganizationalSettingsStore.showBranch = true;

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
        this.processForm.pristine;
      }, 250);
    });

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);

    this.processForm = this._formBuilder.group({
      id: [""],
      process_group_id: [null, [Validators.required]],
      process_category_id: [null],
      organization_id: [null, [Validators.required]],
      branch_id: [null],
      division_id: [null],
      department_id: [null, [Validators.required]],
      section_id: [null],
      sub_section_id: [null],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: [""],
      scope: [""],
      cycle_time: [""],
      control_ids: [''],
      ms_type_organization_ids: [null],
      accountable_user_ids: [''],
      documents: [],
      process_flow_documents: [],
      process_owner_id: [null, [Validators.required]],
      // process_risks: ['',[Validators.required]]
    });

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.processForm.controls['division_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.processForm.controls['section_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.processForm.controls['sub_section_id'].setValidators(Validators.required);
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    //   this.processForm.controls['branch_id'].setValidators(Validators.required);

    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    // In case of edit
    if (this._router.url.indexOf('edit-process') != -1) {
      if (ProcessStore.process_id) {
        ProcessStore.clearProcessFlowDocuments()
        ProcessStore.clearProcessAtachements()
        ControlStore.unSelectControls()
        this._processService
          .getItemById(ProcessStore.process_id).subscribe(res => {
            if (ProcessStore.processDetails) {
              this.setDataForEdit();
            } else {
              this._router.navigateByUrl('/bpm/process');
            }
          })
      }
      else {
        this._router.navigateByUrl('/bpm/process');
      }
    } else {
      this.setInitialOrganizationLevels();
    }

    // Getting the Required Data for Form

    this.getMsType()
    this.getProcessGroup()
    this.getProcessCategory()
    this.getAccountableUsers();

    window.addEventListener("scroll", this.scrollEvent, true);

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelUser(item);
    })

    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {

      this.closeControls();
      this._utilityService.detectChanges(this._cdr);
    })

    this.setModalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');

    })

    this.processCategoryModalSubscription = this._eventEmitterService.processCategoryModal.subscribe(res => {
      this.closeProcessCategoryModal();
    })
    this.processGroupModalSubscription = this._eventEmitterService.processGroupModal.subscribe(res => {
      this.clostProcessGroupModal();
    })

    this.controlPreviewSubscription = this._eventEmitterService.modalDismiss.subscribe(res => {
      this.closeControlPreview()
      // this._utilityService.detectChanges(this._cdr);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeControlModal();
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.timoutModalCloseHandler();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.timoutModalCloseHandler();
      }
    })

    this.organisationChangesModalSubscription = this._eventEmeitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  timoutModalCloseHandler() {
    if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.processGroupFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processGroupFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processGroupFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.controlCategoryFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.controlFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
    }
  }

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = false;
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if (data) {
      this.processForm.patchValue({
        branch_id: data.branch_ids ? data.branch_ids : [],
        division_id: data.division_ids ? data.division_ids : [],
        department_id: data.department_ids ? data.department_ids : [],
        section_id: data.section_ids ? data.section_ids : [],
        sub_section_id: data.sub_section_ids ? data.sub_section_ids : [],
        organization_id: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  // Setting Accordion for Controls

  getControlDetails(id: number, index: number, initial: boolean = false) {
    ControlStore.unsetControlDetails()
    for (let i = 0; i < ControlStore.controlsToDisplay.length; i++) {
      if (ControlStore.controlsToDisplay[i].is_accordion_active == false && i == index || initial) {
        this._controlService.getItemById(id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
        break;

      }
    }
    this.ControlStore.setControlAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  // Open Process Category  Modal

  addProcessCategory() {
    ProcessCategoryMasterStore.add_process_category_modal = true;
    $(this.controlCategoryFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Process Category Modal
  closeProcessCategoryModal() {
    ProcessCategoryMasterStore.add_process_category_modal = false;
    $(this.controlCategoryFormModal.nativeElement).modal('hide');
    if (ProcessCategoryMasterStore.lastInsertedProcessCategory)
      this.processForm.patchValue({ process_category_id: ProcessCategoryMasterStore.lastInsertedProcessCategory });
    this.getProcessCategory()
    this._utilityService.detectChanges(this._cdr);
  }

  // Open Process Group Modal
  addProcessGroup() {

    ProcessGroupsMasterStore.add_process_group_modal = true;
    $(this.processGroupFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Process Category Modal
  clostProcessGroupModal() {
    ProcessGroupsMasterStore.add_process_group_modal = false;
    $(this.processGroupFormModal.nativeElement).modal('hide');
    if (ProcessGroupsMasterStore.lastInsertedProcessGroup)
      this.processForm.patchValue({ process_group_id: ProcessGroupsMasterStore.lastInsertedProcessGroup });
    this.getProcessGroup()
    this._utilityService.detectChanges(this._cdr);
  }

  getProcessGroup() {
    this._processGroupService
      .getItems(false)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }
  getProcessCategory() {
    this._processCategoryService
      .getItems(false)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }
  getMsType() {
    this._msTypeService.getItems(false, '?access_all=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getAccountableUsers() {
    if (this.itemtype == 'accountableUser') {
      let params = ''
      if (this.processForm.value.organization_id) {
        params = '?organization_ids=' + (this.processForm.value.organization_id ? this.processForm.value.organization_id.id : '')
          + '&division_ids=' + (this.processForm.value.division_id ? this.processForm.value.division_id.id : '')
          + '&department_ids=' + (this.processForm.value.department_id ? this.processForm.value.department_id.id : '')
          + '&section_ids=' + (this.processForm.value.section_id ? this.processForm.value.section_id.id : '')
          + '&sub_section_ids=' + (this.processForm.value.sub_section_id ? this.processForm.value.sub_section_id.id : '')

        this._userService
          .getAllItems(params)
          .subscribe((res) => {
            this._utilityService.detectChanges(this._cdr);
          });
      }
      else {
        UsersStore.setAllUsers([]);
      }
    }
    else if (this.itemtype == 'processOwner') {
      this._userService
        .getAllItems()
        .subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });
    }
  }

  getUsers() {
    this._userService
      .getAllItems()
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getDepartment() {
    if (this.processForm.value.organization_id) {
      var params = '';
      params = '&organization_ids=' + (this.processForm.value.organization_id ? this.processForm.value.organization_id : '')
        + '&division_ids=' + (this.processForm.value.division_id ? this.processForm.value.division_id : '')
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }


  getDivision() {
    if (this.processForm.value.organization_id) {
      let parameters = this.processForm.value.organization_id;
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  getSection() {
    if (this.processForm.value.organization_id) {
      var params = '';
      params = '&organization_ids=' + (this.processForm.value.organization_id ? this.processForm.value.organization_id : '')
        + '&division_ids=' + (this.processForm.value.division_id ? this.processForm.value.division_id : '')
        + '&department_ids=' + (this.processForm.value.department_id ? this.processForm.value.department_id : '')
      this._sectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SectionStore.setAllSection([]);
      this.processForm.controls["section_id"].reset()
    }
  }


  getSubSection() {
    if (this.processForm.value.organization_id) {
      var params = '';
      params = '&organization_ids=' + (this.processForm.value.organization_id ? this.processForm.value.organization_id : '')
        + '&division_ids=' + (this.processForm.value.division_id ? this.processForm.value.division_id : '')
        + '&department_ids=' + (this.processForm.value.department_id ? this.processForm.value.department_id : '')
        + '&section_ids=' + (this.processForm.value.section_id ? this.processForm.value.section_id : '')
      this._subSectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe((res: any) => {
      if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
        this.processForm.patchValue({ organization_ids: [res.data[0]] });
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getBranches() {
    if (this.processForm.get('organization_id').value) {
      // let parameters = this._helperService.createParameterFromArray(this.processForm.get('organization_id').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + this.processForm.value.organization_id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  searchBranches(e) {
    if (this.processForm.get('organization_id').value) {
      // let parameters = this._helperService.createParameterFromArray(this.processForm.get('organization_id').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + this.processForm.value.organization_id + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  dropdownItemType(type: string) {
    this.itemtype = type;
  }

  searchUers(e) {
    if (this.itemtype == 'accountableUser') {
      var params = '';
      if (this.processForm.value.organization_id) {
        params = '&organization_ids=' + (this.processForm.value.organization_id ? this.processForm.value.organization_id?.id : '')
          + '&division_ids=' + (this.processForm.value.division_id ? this.processForm.value.division_id?.id : '')
          + '&department_ids=' + (this.processForm.value.department_id ? this.processForm.value.department_id?.id : '')
          + '&section_ids=' + (this.processForm.value.section_id ? this.processForm.value.section_id?.id : '')
          + '&sub_section_ids=' + (this.processForm.value.sub_section_id ? this.processForm.value.sub_section_id?.id : '')

        this._userService.searchUsers('?q=' + e.term + params).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else {
        UsersStore.setAllUsers([])
      }
    }
    else if (this.itemtype == 'processOwner') {
      this._userService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
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
  // * Add Process Risks
  // addProcessRisks() {
  //   if (this.processForm.value.process_risks) {
  //     if(this.processRisks.length == 0) {
  //       this.processRisks.push(this.processForm.value.process_risks);
  //       this.checkFormRemarksScrollbar();
  //     }
  //     else{
  //       let pos = this.processRisks.findIndex(e=>e == this.processForm.value.process_risks);
  //       if(pos == -1) this.processRisks.push(this.processForm.value.process_risks);
  //       else {
  //         this.processRiskError = 'process_risk_already_added';
  //         setTimeout(() => {
  //           this.processRiskError = null;;
  //         }, 1000);
  //       }
  //       this.checkFormRemarksScrollbar();
  //     }
  //   }
  //   this.processForm.controls['process_risks'].reset()
  // }

  removeProcessRisks(position) {
    this.processRisks.splice(position, 1);
    this.checkFormRemarksScrollbar();
  }

  checkFormRemarksScrollbar() {
    setTimeout(() => {
      if (this.processRisks.length > 0 && $(this.processRisksItemDiv?.nativeElement).height() >= 100) {
        $(this.processRisksItemDiv?.nativeElement).mCustomScrollbar();
      }
      else {
        if (this.processRisks.length > 0) $(this.processRisksItemDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  checkFormRemarksPreviewScrollbar() {
    setTimeout(() => {
      if (this.processRisks.length > 0 && $(this.processRisksPreviewItemDiv?.nativeElement).height() >= 100) {
        $(this.processRisksPreviewItemDiv?.nativeElement).mCustomScrollbar();
      }
      else {
        if (this.processRisks.length > 0) $(this.processRisksPreviewItemDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }
  // eventChange(id, type) {

  //   switch (type) {
  //     case 'organization':
  //       this.org_id = id
  //       this.processForm.controls["division_id"].reset()
  //       this.getDivision()
  //       break;

  //     case 'divison':
  //       this.divison_id = id;
  //       this.processForm.controls["department_id"].reset()
  //       this.getDepartment()
  //       break;

  //     case 'department':
  //       this.department_id = id;
  //       this.processForm.controls["section_id"].reset()
  //       this.getSection()
  //       break;

  //     case 'section':
  //       this.section_id = id;
  //       this.processForm.controls["sub_section_id"].reset()
  //       this.getSubSection()
  //       break;

  //     case 'sub_section':
  //       this.sub_section_id = id;
  //       this.getAccountableUsers();
  //       break;

  //     default:
  //       break;
  //   }

  // }

  // Mutli Form

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
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitForm();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
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
      this.checkFormRemarksPreviewScrollbar();
      this.displayForm = this.processForm.value
      this.getSelectedValues();
      if (document.getElementById("nextBtn")) {
        this.nextButtonText = "Save";

      }
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
      //document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
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
          if (!this.processForm.controls[i].valid) {
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
            if (!this.processForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
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

  // Opens Modal to Select Processes
  selectControls() {

    setTimeout(() => {
      ProcessStore.add_control_form_modal = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.processFormModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.processFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);

  }

  // Close Modal to select processes
  closeControls() {

    setTimeout(() => {
      ProcessStore.add_control_form_modal = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.processFormModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.processFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);

  }

  submitForm() {
    let save;

    if (this.processForm.value.accountable_user_ids.length > 0) {
      this.accountableUsers = []
      this.processForm.value.accountable_user_ids.forEach(element => {
        this.accountableUsers.push(element.id)
      });
    }
    let processRisksProcessed = [];
    this.processRisks.forEach(title => {
      processRisksProcessed.push({ title: title });
    })
    // * Process Owner
    if (this.processForm.value.process_owner_id) {
      this.processForm.value.process_owner_id = this.processForm.value.process_owner_id.id
    }

    let processData = JSON.parse(JSON.stringify(this.processForm.value));
    processData['organization_id'] = processData['organization_id'].id;
    processData['department_id'] = processData['department_id'].id;
    if (processData['division_id']) processData['division_id'] = processData['division_id'].id;
    if (processData['section_id']) processData['section_id'] = processData['section_id'].id;
    if (processData['sub_section_id']) processData['sub_section_id'] = processData['sub_section_id'].id;
    if (processData['branch_id']) processData['branch_id'] = processData['branch_id'].id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      delete processData.division_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      delete processData.section_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      delete processData.sub_section_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
      delete processData.branch_id;
    var saveData = {
      ...processData,
      // process_risks:processRisksProcessed,
      accountable_user_ids: this.accountableUsers
    }

    if (this.processForm.value.id) {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(this.support_update_array, this.support_kh_files, this.support_system_files)
      saveData['process_flow_documents'] = this._helperService.compareEditDataWithSelectedData(this.process_update_array, this.process_kh_files, this.process_system_files)
    } else {
      saveData['documents'] = this._helperService.sortFileuploadData(ProcessStore.getAttachement, 'save')
      saveData['process_flow_documents'] = this._helperService.sortFileuploadData(ProcessStore.getProcessFlow, 'save')
    }

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    if (this.processForm.value.id) {
      save = this._processService.updateItem(this.processForm.value.id, saveData);
    } else {
      this.processForm.removeControl('id');
      save = this._processService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      this.resetFormDetails();
      AppStore.disableLoading();
      if (ProcessStore.editFlag) {
        ProcessStore.unsetEditFlag();
      }
      this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl("/bpm/process/" + res.id);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.processFormErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Next";
        this.previousButtonText = "Previous";
        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });

  }

  searchProcessGroups(e) {
    this._processGroupService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchProcessCategories(e) {
    this._processCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSelectedValues() {
    ProcessStore._msType = [];
    ProcessStore._accountableUser = [];
    // ProcessStore._processOwner = [];
    this.userInfoObject = [];
    if (this.processForm.value.ms_type_organization_ids) {
      MsTypeStore.msTypeDetails.forEach(element => {
        if (this.processForm.value.ms_type_organization_ids.includes(element.id)) {
          ProcessStore._msType.push({
            title: element.ms_type_title,
            version: element.ms_type_version_title
          })
        }
      });
    }
    if (this.processForm.value.accountable_user_ids && this.processForm.value.accountable_user_ids.length > 0) {
      var accountableUserData = this.processForm.value.accountable_user_ids
      UsersStore.users.forEach(element => {
        if (accountableUserData.some(user => user.id == element.id)) {
          ProcessStore._accountableUser.push({
            id: element.id,
            designation: element.designation_title,
            email: element.email,
            first_name: element.first_name,
            last_name: element.last_name,
            image: {
              token: element.image_token
            }

          })
          this.userInfoObject.push({
            id: element.id,
            designation: element.designation_title,
            email: element.email,
            first_name: element.first_name,
            last_name: element.last_name,
            image: {
              token: element.image_token
            }
          })
          // Changing the Reference So as to detect in child component(ngOnChanges)
          const tempArray = [...this.userInfoObject];
          this.userInfoObject = [];
          this.userInfoObject = tempArray

        }

      });
    }
    if (this.processForm.value.organization_id) {
      // for (let i of SubsidiaryStore.subsidiaryList) {
      //   if (i.id == this.processForm.value.organization_id)
      ProcessStore._subsidiary = this.processForm.value.organization_id.title;
      // }
    }

    if (this.processForm.value.process_group_id) {
      for (let i of ProcessGroupsMasterStore.processGroups) {
        if (i.id == this.processForm.value.process_group_id)
          ProcessStore._processGroup = i.title;
      }
    }

    if (this.processForm.value.process_category_id) {
      for (let i of ProcessCategoryMasterStore.processCategories) {
        if (i.id == this.processForm.value.process_category_id)
          ProcessStore._processCategory = i.title;
      }
    }

    if (this.processForm.value.department_id) {
      // for (let i of DepartmentMasterStore.allItems) {
      //   if (i.id == this.processForm.value.department_id)
      ProcessStore._department = this.processForm.value.department_id.title;
      // }
    }

    if (this.processForm.value.division_id) {
      // for (let i of DivisionMasterStore.allItems) {
      //   if (i.id == this.processForm.value.division_id)
      ProcessStore._division = this.processForm.value.division_id.title;
      // }
    }

    if (this.processForm.value.section_id) {
      // for (let i of SectionMasterStore.allItems) {
      //   if (i.id == this.processForm.value.section_id)
      ProcessStore._section = this.processForm.value.section_id.title;
      // }
    }

    if (this.processForm.value.sub_section_id) {
      // for (let i of SubSectionMasterStore.allItems) {
      //   if (i.id == this.processForm.value.sub_section_id)
      ProcessStore._sub_section = this.processForm.value.sub_section_id.title;
      // }
    }

    if (this.processForm.value.branch_id) {
      // for (let i of BranchesStore.branchDetails) {
      //   if (i.id == this.processForm.value.branch_id)
      ProcessStore._branch = this.processForm.value.branch_id.title;
      // }
    }
    if (ProcessStore.getAttachement) {
      this.processForm.patchValue({
        documents: ProcessStore.getAttachement
      })
    }
    if (ProcessStore.getProcessFlow) {
      this.processForm.patchValue({
        process_flow_documents: ProcessStore.getProcessFlow
      })
    }
    if (ControlStore.controlsToDisplay.length > 0) {
      ControlStore.controlsToDisplay.forEach(element => {
        if (!this.control_ids.includes(element.id))
          this.control_ids.push(element.id)
      });
      this.processForm.patchValue({
        control_ids: this.control_ids
      })
    }
  }

  // Returns image url according to type and token
  // createImageUrl(type,token){
  //   return this._bpmFileService.getThumbnailPreview(type,token);
  // }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      return userDetailObject;
    }
  }

  // Setting Data for Edit Form
  setDataForEdit() {
    this.control_ids = [];
    var processDetails = ProcessStore.processDetails;
    this.setDocuments(processDetails.process_flow_documents, "process")
    this.setDocuments(processDetails.process_documents, "support")
    setTimeout(() => {
      // ProcessStore.processDetails.process_documents.forEach(element => {

      //   if (element && element.token) {
      //     var purl = this._bpmFileService.getThumbnailPreview('process-document', element.token)
      //     var lDetails = {
      //       name: element.title,
      //       ext: element.ext,
      //       size: element.size,
      //       url: element.url,
      //       token: element.token,
      //       thumbnail_url: element.thumbnail_url,
      //       preview: purl,
      //       id: element.id
      //     }
      //   }
      //   this._processService.setAttachements(lDetails, purl)
      //   this.checkForFileUploadsScrollbar('attachement');

      // });

      // ProcessStore.processDetails.process_flow_documents.forEach(element => {

      //   if (element && element.token) {
      //     var purl = this._bpmFileService.getThumbnailPreview('process-flow-document', element.token)
      //     var lDetails = {
      //       name: element.title,
      //       ext: element.ext,
      //       size: element.size,
      //       url: element.url,
      //       token: element.token,
      //       thumbnail_url: element.thumbnail_url,
      //       preview: purl,
      //       id: element.id
      //     }
      //   }
      //   this._processService.setProcessFlowDocuments(lDetails, purl)

      // });
      //this.checkForFileUploadsScrollbar('process-flow');



    }, 300);

    // Setting the format similar to while adding control from popup to show Category Properly in Accordion.
    let processControls = [];
    for (let element of processDetails.process_controls) {
      var obj = {
        id: element.id,
        reference_code: element.reference_code,
        title: element.title,
        control_category_title: element.control_category?.title,
        control_type_title: element.control_type?.title,
        control_efficiency_measure_title: element.control_efficiency_measure ? element.control_efficiency_measure?.language[0]?.pivot?.title : null,
        control_efficiency_measure_status_label: element.control_efficiency_measure ? element.control_efficiency_measure?.label : null,
      };
      processControls.push(obj);
    };

    this.processControlEditValue(processControls);
    // this.processRisks = processDetails.process_risks ? this._helperService.getArrayProcessed(processDetails.process_risks, null) : [];
    this.processForm.patchValue({
      id: processDetails.id ? processDetails.id : '',
      process_group_id: processDetails.process_group ? processDetails.process_group.id : null,
      process_category_id: processDetails.process_category ? processDetails.process_category.id : null,
      organization_id: processDetails.organization ? processDetails.organization : null,
      division_id: processDetails.division ? processDetails.division : null,
      department_id: processDetails.department ? processDetails.department : null,
      section_id: processDetails.section ? processDetails.section : null,
      branch_id: processDetails.branch ? processDetails.branch : null,
      sub_section_id: processDetails.sub_section ? processDetails.sub_section : null,
      title: processDetails.title ? processDetails.title : '',
      description: processDetails.description ? processDetails.description : '',
      scope: processDetails.scope ? processDetails.scope : '',
      cycle_time: processDetails.cycle_time ? processDetails.cycle_time : '',
      ms_type_organization_ids: processDetails.process_ms_type_organizations ? this.getEditValue(processDetails.process_ms_type_organizations) : [],
      accountable_user_ids: processDetails.process_accountable_users ? this.reportingUser(processDetails.process_accountable_users) : [],
      process_owner_id: processDetails.process_owner ? processDetails.process_owner : ''


    });
    this.searchProcessGroups({ term: this.processForm.value.process_group_id });
    this.searchProcessCategories({ term: this.processForm.value.process_category_id });
    // processDetails.process_risks.forEach(element => {
    //   this.processRisks.push(element.title);
    // })
    setTimeout(() => {
      this.checkFormRemarksScrollbar();
    }, 300);

    this._utilityService.detectChanges(this._cdr);
  }

  // Set Process Control
  processControlEditValue(process_controls) {
    this._controlService.selectRequiredControls(process_controls);
  }

  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id);
    }
    return returnValue;
  }

  searchMsType(e) {
    this._msTypeService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  reportingUser(reporting) {
    let reporting_to = [];
    for (let i of reporting) {
      reporting_to.push(i);
    }
    return reporting_to;
  }

  //To get file details when selected
  onFileChange(event, type: string, supportType) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type, supportType); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar(supportType);
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
                    this.assignFileUploadProgress(upProgress, file, supportType);
                  }
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  //return event;
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this.assignFileUploadProgress(null, file, supportType, true);
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type, supportType); // Convert blob to base64 string
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, supportType, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              this.assignFileUploadProgress(null, file, supportType, true);
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          this.assignFileUploadProgress(null, file, supportType, true);
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
    if (supportType == 'process-flow') {
      var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.processFlowArray);
      this.processFlowArray = result.fileUploadsArray;
      return result.files;

    } else {
      var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.attachementArray);
      this.attachementArray = result.fileUploadsArray;
      return result.files;
    }

  }

  /**
* 
* @param progress File Upload Progress
* @param file Selected File
* @param success Boolean value whether file upload success 
*/
  assignFileUploadProgress(progress, file, supportType?, success = false) {

    if (supportType == 'process-flow') {
      let temporaryFileUploadsArray = this.processFlowArray;
      this.processFlowArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
    } else {
      let temporaryFileUploadsArray = this.attachementArray;
      this.attachementArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
    }
  }

  checkForFileUploadsScrollbar(supportType) {
    if (supportType == 'process-flow') {
      if (ProcessStore.getProcessFlow.length >= 5 || this.processFlowArray.length > 5) {
        $(this.processUploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        if (ProcessStore.getProcessFlow.length > 0) $(this.processUploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    } else {
      if (ProcessStore.getAttachement.length >= 5 || this.attachementArray.length > 5) {
        $(this.supportUploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        if (ProcessStore.getProcessFlow.length > 0) $(this.supportUploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }
  }

  createImageFromBlob(image: Blob, fileDetails, type, supportType) {
    if (supportType == 'process-flow') {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        var logo_url = reader.result;
        fileDetails['preview'] = logo_url;
        if (fileDetails != null) {

          this._processService.setProcessFlowDocuments(fileDetails, logo_url);
        }
        this.checkForFileUploadsScrollbar(supportType);
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
        if (fileDetails != null) {
          this._processService.setAttachements(fileDetails, logo_url);
        }
        this.checkForFileUploadsScrollbar(supportType);
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
  removeBrochure(type, token) {
    ProcessStore.unsetFileDetails(type, token);
    this.checkForFileUploadsScrollbar(type);
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  // Returns default image url
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  mouseHover(event, index) {
    if (this.activeIndex >= 0 && this.activeIndex == index) {
      this.activeIndex = null;
      this.hover = false;
    } else {
      this.activeIndex = index;
      this.hover = true;
      if (this.popup) {
        this._renderer2.setStyle(this.popup.nativeElement, "display", "block");
      }
    }
  }

  resetFormDetails() {
    this.ProcessStore.clearProcessFlowDocuments();
    this.ProcessStore.clearProcessAtachements();
    this._processService.setAttachements(null, '');
    this.ControlStore.controlsToDisplay = [];
    this._processService.setProcessFlowDocuments(null, '');
    this.processForm.reset();
    this.processForm.pristine;
    this.processFormErrors = null;
    this.attachementArray = [];
    this.processFlowArray = [];
    this.accountableUsers = [];
  }
  /**
  * cancel modal
  * @param status - decision to cancel
  */
  cancelUser(status) {
    if (status) {
      this._router.navigateByUrl('bpm/process');
      this.clearCancelObject();
    }
    else {
      this.clearCancelObject();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  clearCancelObject() {
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }

  confirmCancel() {
    if (this.processForm.value.id) {
      this.cancelObject.title = 'Cancel Process Updation?';
      this.cancelObject.subtitle = 'common_cancel_subtitle';
      this.cancelObject.type = 'Cancel'
    } else {
      this.cancelObject.title = 'Cancel Process Creation?';
      this.cancelObject.subtitle = 'common_cancel_subtitle';
      this.cancelObject.type = 'Cancel'
    }
    $(this.cancelPopup.nativeElement).modal('show');
  }

  deleteControl(controls) {
    var index = ControlStore.controlsToDisplay.indexOf(controls);
    ControlStore.controlsToDisplay.splice(index, 1);
    ControlStore.selectedControlsList.splice(index, 1);
    this.control_ids.splice(index, 1)
    this._utilityService.showSuccessMessage('Success!', 'control_removed_from_the_processes');
  }

  openControlDetails(controlId) {
    this._controlService.getItemById(controlId).subscribe(res => {
      this.ViewcontrolDetails = true;
      this._utilityService.detectChanges(this._cdr);
    })
    this.openControlPreview()
  }

  closeControlPreview() {
    setTimeout(() => {
      this.ViewcontrolDetails = false;
      this._renderer2.removeClass(this.controlDetails.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.controlDetails.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.controlDetails.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();

      setTimeout(() => {
        this._renderer2.removeClass(this.controlDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 250);
  }

  openControlPreview() {
    setTimeout(() => {
      this.ViewcontrolDetails = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.controlDetails.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.controlDetails.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.controlDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  addControl() {
    setTimeout(() => {
      this.controlObject.type = 'Add'
      this.controlObject.values = null
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.controlFormModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.controlFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeControlModal() {
    setTimeout(() => {
      this.controlObject.type = null;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.controlFormModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.controlFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents, type) {
    fileUploadPopupStore._systemFile = [];
    if (type == "process") {
      let khDocuments = [];
      fileUploadPopupStore.clearUpdateFiles()//we should clear array before copiying
      documents.forEach(element => {
        if (element.document_id) {
          element.kh_document.versions.forEach(innerElement => {
            if (innerElement.is_latest) {
              khDocuments.push({
                ...innerElement,
                title: element?.kh_document.title,
                'is_kh_document': true
              })
              fileUploadPopupStore.setUpdateFileArray({
                'updateId': element.id,
                ...innerElement
              })
            }
          });
        }
        else {
          if (element && element.token) {
            var purl = this._bpmFileService.getThumbnailPreview('process-flow-document', element.token)
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
          // fileUploadPopupStore.clearSystemFiles()
          this._fileUploadPopupService.setSystemFile(lDetails, purl)
        }
      });

      fileUploadPopupStore.setKHFile(khDocuments)
      this.process_kh_files = [...fileUploadPopupStore.getKHFiles]//copying process flow kh files to our local array
      this.process_update_array = [...fileUploadPopupStore.getUpdateArray]//copying process flow update array to our local array
      this.process_system_files = [...fileUploadPopupStore.getSystemFile]//copying process flow system files to our local array    
      let submitedDocuments = [...this.process_kh_files, ...this.process_system_files]
      submitedDocuments.forEach((order: any) => {
        ProcessStore.getProcessFlow.push(order);//copying process flow both system and kh files to our local array          
      });
    }
    else {
      let supportDocuments = [];
      fileUploadPopupStore.clearUpdateFiles()//we should clear array before copiying
      documents.forEach(element => {
        if (element.document_id) {
          element.kh_document.versions.forEach(innerElement => {
            if (innerElement.is_latest) {
              supportDocuments.push({
                ...innerElement,
                'is_kh_document': true
              })
              fileUploadPopupStore.setUpdateFileArray({
                'updateId': element.id,
                ...innerElement
              })
            }
          });
        }
        else {
          if (element && element.token) {
            var purl = this._bpmFileService.getThumbnailPreview('process-document', element.token)
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
          // fileUploadPopupStore.clearSystemFiles()
          this._fileUploadPopupService.setSystemFile(lDetails, purl)
        }
      });

      fileUploadPopupStore.setKHFile(supportDocuments)
      this.support_kh_files = [...fileUploadPopupStore.getKHFiles]//copying support doc kh files to our local array
      this.support_update_array = [...fileUploadPopupStore.getUpdateArray]//copying support doc update array to our local array
      this.support_system_files = [...fileUploadPopupStore.getSystemFile]//copying support system files to our local array    
      let submitedDocuments = [...this.support_kh_files, ...this.support_system_files]
      submitedDocuments.forEach((order: any) => {
        ProcessStore.getAttachement.push(order);//copying support  both system and kh files to our local array       
      });
    }
  }
  // *Common  File Upload/Attach Modal Functions Starts Here

  openFileUploadModal(type) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      ProcessStore.document_selection = type
      if (type == "process") {
        fileUploadPopupStore.setFilestoDisplay(ProcessStore.getProcessFlow)
        fileUploadPopupStore.setKHFile(this.process_kh_files)
        fileUploadPopupStore._systemFile = [...this.process_system_files]
        ProcessStore._processFlow = []
      } else {
        fileUploadPopupStore.setFilestoDisplay(ProcessStore.getAttachement)
        fileUploadPopupStore.setKHFile(this.support_kh_files)
        fileUploadPopupStore._systemFile = [...this.support_system_files]
        ProcessStore._attachement = []
      }
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
      if (this.controlObject.type == 'Add') {
        // To Fix Scroll Issue when choosing more than 3 document in Add Control Popup.
        this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
        this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
      }
      else {
        if (ProcessStore.document_selection === "process") {
          this.process_kh_files = [...fileUploadPopupStore.getKHFiles]//copying kh file array to local array based on the type
          this.process_system_files = [...fileUploadPopupStore.getSystemFile]//copying system file array to local array based on the type
          fileUploadPopupStore.displayFiles.forEach((order: any) => {
            ProcessStore.getProcessFlow.push(order);//copying both system and kh file array                            
          });
        } else {
          this.support_kh_files = [...fileUploadPopupStore.getKHFiles]//copying kh file array to local array based on the type
          this.support_system_files = [...fileUploadPopupStore.getSystemFile]//copying system file array to local array based on the type
          fileUploadPopupStore.displayFiles.forEach((order: any) => {
            ProcessStore.getAttachement.push(order);//copying both system and kh file array                  
          });
        }
        fileUploadPopupStore.openPopup = false;
        document.body.classList.remove('modal-open')
        this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
        this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
        $('.modal-backdrop').remove();
        setTimeout(() => {
          this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
          this.clearDocument()
          this.clearCommonFilePopupDocuments()
        }, 200);
      }
    }, 100);
    //this.clearDocument()
  }

  clearDocument() {
    ProcessStore.document_selection = ''
    fileUploadPopupStore.clearFilesToDisplay()
  }

  createImageUrl(type, token) {
    if (type == 'document-version' || type == 'user-profile-picture')
      return this._documentFileService.getThumbnailPreview(type, token);
    this._utilityService.detectChanges(this._cdr)
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);

  }
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3 || ProcessStore.getAttachement.length >= 3 || ProcessStore.getProcessFlow.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
      $(this.previewUploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    }
    if (fileUploadPopupStore.displayFiles.length >= 3 || ProcessStore.getAttachement.length >= 3 || ProcessStore.getProcessFlow.length >= 3) {
      $(this.uploadArea2.nativeElement).mCustomScrollbar();
      $(this.previewUploadArea2.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea2.nativeElement).mCustomScrollbar("destroy");
      $(this.previewUploadArea2.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // *Common  File Upload/Attach Modal Functions Ends Here

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, null);
    this._processService.setAttachements(null, '');
    this._processService.setProcessFlowDocuments(null, '');
    this.processForm.reset();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.processGroupModalSubscription.unsubscribe();
    this.processCategoryModalSubscription.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.controlModalEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.setModalStyleSubscription.unsubscribe();
    this.controlPreviewSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay()
  }

  setInitialOrganizationLevels() {
    this.processForm.patchValue({
      division_id: AuthStore.user.division ? AuthStore.user.division : null,
      department_id: AuthStore.user.department ? AuthStore.user.department : null,
      section_id: AuthStore.user.section ? AuthStore.user.section : null,
      sub_section_id: AuthStore.user.sub_section ? AuthStore.user.sub_section : null,
      organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization : null,
      branch_id: AuthStore?.user?.branch ? AuthStore?.user?.branch : null
    });
    this._utilityService.detectChanges(this._cdr);
  }

}
