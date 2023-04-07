import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { IncidentCategoriesService } from 'src/app/core/services/masters/incident-management/incident-categories/incident-categories.service';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { IncidentSubCategoryService } from 'src/app/core/services/masters/incident-management/incident-sub-category/incident-sub-category.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { StakeholderService } from 'src/app/core/services/masters/organization/stakeholder/stakeholder.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentCategoriesMasterStore } from 'src/app/stores/masters/incident-management/incident-categories-master-store';
import { IncidentDamageTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-type-master-store';
import { IncidentSubCategoryMasterStore } from 'src/app/stores/masters/incident-management/incident-sub-category-master-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";
import { StakeholderTypeMasterStore } from 'src/app/stores/masters/organization/stakeholder-type-master.store';
import { StakeholderTypePaginationResponse } from 'src/app/core/models/masters/organization/stakeholder-type';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';

declare var $: any;
@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.scss']
})
export class AddIncidentComponent implements OnInit {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('controlPopup') controlPopup: ElementRef;
  @ViewChild('WitnessPopup') WitnessPopup: ElementRef;
  @ViewChild('checklistPopup') checklistPopup: ElementRef;
  @ViewChild('newControl') newControl: ElementRef;
  @ViewChild('damageTypeAddPopup') damageTypeAddPopup: ElementRef;
  @ViewChild('stakeholderAddPopup') stakeholderAddPopup: ElementRef;
  @ViewChild('categoryTypeAddPopup') categoryTypeAddPopup: ElementRef;
  @ViewChild('subCategoryTypeAddPopup') subCategoryTypeAddPopup: ElementRef;
  @ViewChild('othersPopup') othersPopup: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;


  BranchesStore = BranchesStore;
  SubMenuItemStore = SubMenuItemStore;
  fileUploadPopupStore = fileUploadPopupStore;
  reactionDisposer: IReactionDisposer;
  fileUploadsArray = [];
  criteriaEmptyList = "common_nodata_title"
  pipe = new DatePipe('en-US');
  controlObject = {
    type: null
  };
  witnessObject = {
    type: null
  };
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  AuthStore = AuthStore;
  checkListArray = [];
  form: FormGroup;
  formErrors: any;
  reportedDate: any = new Date();
  incidentDate: any = new Date();

  nextButtonText = "Next";
  previousButtonText = "Previous";
  currentTab = 0;
  AppStore = AppStore;
  IncidentStore = IncidentStore;
  IncidentDamageTypeMasterStore = IncidentDamageTypeMasterStore;
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;
  IncidentSubCategoryMasterStore = IncidentSubCategoryMasterStore;
  UsersStore = UsersStore;
  DivisionMasterStore = DivisionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  DepartmentMasterStore = DepartmentMasterStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  StakeholderMasterStore = StakeholdersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  addInvolvedPersonSubscription: any;
  addWitnessPersonSubscription: any;
  damageType: any;
  incidentCategory: any;
  incidentSubCategory: any;
  incidentStakeholder: any;
  otherUsers: any;
  otherUserSubscription: any;
  cancelEventSubscription: any;
  organisationChangesModalSubscription: any = null;
  incidentStakeholderId: any;
  openModelPopup: boolean = false;
  fileUploadPopupSubscriptionEvent: any = null;




  constructor(private _renderer2: Renderer2,
    private _incidentService: IncidentService,
    private _incidentFileService: IncidentFileService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _incidentDamageTypesService: IncidentDamageTypeService,
    private _incidentCategoriesService: IncidentCategoriesService,
    private _incidentSubCategoryService: IncidentSubCategoryService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _userService: UsersService,
    private _divisionService: DivisionService,
    private _subsiadiaryService: SubsidiaryService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _imageService: ImageServiceService,
    private _stakeholderService: StakeholderService,
    private _humanCapitalService: HumanCapitalService,
    private _router: Router,
    private _branchesService: BranchService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService







  ) { }

  ngOnInit(): void {
    OrganizationalSettingsStore.showBranch = true;
    this.reactionDisposer = autorun(() => {
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New Incident Item' });

    })

    setTimeout(() => {

      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener("scroll", this.scrollEvent, true);

    }, 1000);
    // scroll event
    this.addInvolvedPersonSubscription = this._eventEmitterService.personInvolvedAddModalControl.subscribe(element => {
      this.closeModal();
    })

    this.addWitnessPersonSubscription = this._eventEmitterService.witnessAddModalControl.subscribe(element => {
      this.closeWitnesssModal()
    })

    this.damageType = this._eventEmitterService.incidentDamageTypeModalControl.subscribe(element => {
      this.closeDamageTypeModal();
    })

    this.incidentCategory = this._eventEmitterService.incidentCategories.subscribe(element => {
      this.closeCategoryModal();
    })
    this.incidentSubCategory = this._eventEmitterService.incidentSubCategory.subscribe(element => {
      this.closeSubCategoryModal();
    })

    this.incidentStakeholder = this._eventEmitterService.modalChange.subscribe(element => {
      this.closeStakeholderModal();
    })

    this.otherUserSubscription = this._eventEmitterService.otherUsersModalControl.subscribe(element => {
      this.closeassignOtherUsers();
    })

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeOrganisationChangesModal();
      }
    );

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../incidents' }

    ]);

    // form
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      location: [''],
      incident_at: ['', [Validators.required]],
      incident_damage_type_id: [null, [Validators.required]],
      action: [''],
      reported_at: [''],
      reported_by: [null],
      organization_ids: [null, [Validators.required]],
      division_ids: [],
      branch_ids: [],
      department_ids: [null, [Validators.required]],
      section_ids: [],
      sub_section_ids: [],
      incident_type_ids: [null],
      incident_stakeholder_ids: [null],
      incident_witness_user_ids: [],
      incident_involved_user_ids: [],
      documents: [],
      incident_witness_other_users: [],
      incident_involved_other_users: [],
      incident_category_ids: [null],
      incident_sub_category_ids: [null],
    })

    IncidentStore.otherWitnessUserDetails = [];
    IncidentStore.otherInvolvedUserDetails = [];

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_ids'].setValidators(Validators.required);
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    //   this.form.controls['branch_ids'].setValidators(Validators.required);

    // In case of edit
    if (this._router.url.indexOf('edit-incident') != -1) {
      IncidentStore.setTabHide(true);
      IncidentStore.clearDocumentDetails();
      this._utilityService.detectChanges(this._cdr);

      if (IncidentStore.IncidentItemDetails)
        this.setIncidentItemDataForEdit();
      else if (IncidentStore.selectedId) {
        this._incidentService.getItem(IncidentStore.selectedId).subscribe(res => {
          this.setIncidentItemDataForEdit();
        })
      }
      else
        this._router.navigateByUrl('/incident-management/incidents');
    } else {
      IncidentStore.setTabHide(false);
      this.setInitialOrganizationLevels();
    }

    
    this.getIncidentType();
    this.getIncidentCategory();
    this.getIncidentSubCategory();
    this.getUsers();
    this.getDevisions();
    this.getOrganization();
    this.getBranches();
    this.getDepartment();
    this.getSections();
    this.getSubSections();


    // for showing initial tab

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);




  }

  formObject = {
    0: [
      'title',
      'incident_damage_type_id',
      'incident_at',
      'organization_ids',
      'branch_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
    ],
    1: [],
    2: [],
    3: [],
    4: []

  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = false;
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeOrganisationChangesModal(data?) {
    if (data) {
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : null,
        department_ids: data.department_ids ? data.department_ids : null,
        section_ids: data.section_ids ? data.section_ids : null,
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : null,
        organization_ids: data.organization_ids ? data.organization_ids : null
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }



  setInitialOrganizationLevels() {
    let user = AuthStore.user
    user.first_name = user.name
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ? AuthStore?.user?.division : null,
      department_ids: AuthStore?.user?.department ? AuthStore?.user?.department : null,
      section_ids: AuthStore?.user?.section ? AuthStore?.user?.section : null,
      sub_section_ids: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section : null,
      organization_ids: AuthStore.user?.organization ? AuthStore.user?.organization : null,
      branch_ids: AuthStore.user?.branch ? AuthStore.user?.branch : null,
      reported_by: user ? user : null


    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: AuthStore.user?.organization});
    // }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
    this.searchDepartment({ term: this.form.value.department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSections({ term: this.form.value.section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSections({ term: this.form.value.sub_section_ids });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchSubSections({term: this.form.value.branch_ids});
    this._utilityService.detectChanges(this._cdr);
  }


  // processing datas for save

  changeDate() {
    this.form.patchValue({
      reported_at: this.form.value.incident_at

    })
    this._utilityService.detectChanges(this._cdr);
  }

  processDataForSave() {

    let saveParam = {
      ...this.createSaveData(),
      documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    }
    return saveParam;
  }

  createSaveData() {
    console.log(this.form.value);
    
    let saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      description: this.form.value.description ? this.form.value.description : '',
      location: this.form.value.location ? this.form.value.location : '',
      incident_at: this.form.value.incident_at ? this.passSaveFormatDate(this.form.value.incident_at) : '',
      reported_at: this.form.value.reported_at ? this.passSaveFormatDate(this.form.value.reported_at) : '',
      incident_damage_type_id: this.form.value.incident_damage_type_id ? this.form.value.incident_damage_type_id.id : '',
      action: this.form.value.action ? this.form.value.action : '',
      reported_by: this.form.value.reported_by ? this.form.value.reported_by.id : '',
      incident_sub_category_ids: this.form.value.incident_sub_category_ids ? [this.form.value.incident_sub_category_ids.id] : [],
      incident_category_ids: this.form.value.incident_category_ids ? [this.form.value.incident_category_ids.id] : [],
      incident_stakeholder_ids: this.form.value.incident_stakeholder_ids ? [this.form.value.incident_stakeholder_ids.id] : [],
      incident_witness_other_users: IncidentStore.involvedWitnessUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      incident_involved_other_users: IncidentStore.involvedOtherUserDetails ? IncidentStore.involvedOtherUserDetails : [],
      incident_witness_user_ids: this.form.value.incident_witness_user_ids ? this.getEditValue(this.form.value.incident_witness_user_ids) : [],
      incident_involved_user_ids: this.form.value.incident_involved_user_ids ? this.getEditValue(this.form.value.incident_involved_user_ids) : [],
      sub_section_ids: this.form.value.sub_section_ids ? [this.form.value.sub_section_ids.id] : '',
      section_ids: this.form.value.section_ids ? [this.form.value.section_ids.id] : [],
      organization_ids: this.form.value.organization_ids ? [this.form.value.organization_ids.id] : [],
      branch_ids: this.form.value.branch_ids ? [this.form.value.branch_ids.id] : [],
      division_ids: this.form.value.division_ids ? [this.form.value.division_ids.id] : [],
      department_ids: this.form.value.department_ids ? [this.form.value.department_ids.id] : [],

    };


    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
      delete saveData.division_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
      delete saveData.department_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
      delete saveData.section_ids;
    }
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) {
      delete saveData.sub_section_ids;
    }
    return saveData;
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation?.title ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = this.getDate();
      return userDetailObject;
    }
  }

  // Returns Date
  getDate() {
    return new Date();
    // return this._helperService.timeZoneFormatted(new Date());
  }



  addPersonInvolved() {
    this.controlObject.type = 'Add';
    setTimeout(() => {
      $(this.controlPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.controlPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  closeModal() {
    this.controlObject.type = null;
    $(this.controlPopup.nativeElement).modal('hide');

    setTimeout(() => {
      this._renderer2.removeClass(this.controlPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);



  }
  addWitness() {
    this.witnessObject.type = 'Add';

    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.WitnessPopup.nativeElement, 'display', 'block');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
      this._renderer2.removeAttribute(this.WitnessPopup.nativeElement, 'aria-hidden');
      this._renderer2.addClass(this.WitnessPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  closeWitnesssModal() {
    // this.witnessObject.type = null;


    // setTimeout(() => {
    //   this._renderer2.removeClass(this.WitnessPopup.nativeElement, 'show')
    // document.body.classList.remove('modal-open')
    // this._renderer2.setStyle(this.WitnessPopup.nativeElement, 'display', 'none');
    // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    // this._renderer2.setAttribute(this.WitnessPopup.nativeElement, 'aria-hidden', 'true');
    // $('.modal-backdrop').remove();
    //   this._renderer2.removeClass(this.WitnessPopup.nativeElement, 'show')
    //   this._utilityService.detectChanges(this._cdr)
    // }, 200);

  }

  // document upload
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
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
    if (IncidentStore.tabHides == true) {
      if (this.currentTab == 0 && n > 0) this.currentTab = 3;
      else if (this.currentTab == 3 && n < 0) this.currentTab = 0;
      else this.currentTab = this.currentTab + n;
    } else {
      this.currentTab = this.currentTab + n;
    }

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitIncidentForm();
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

  // scroll event
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };


  // for getting incident type
  getIncidentType() {
    this._incidentDamageTypesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  incidentCategoryChange(e) {
    this.form.patchValue({ incident_sub_category_ids: null });
    IncidentSubCategoryMasterStore.unsetIncidentSubCategory()
  }

  getIncidentCategory() {
    this._incidentCategoriesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getIncidentSubCategory() {
    let params = ''
    if (this.form.get('incident_category_ids').value) {
      params = '&incident_category_ids=' + this.form.get('incident_category_ids').value.id;
      this._incidentSubCategoryService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IncidentSubCategoryMasterStore.unsetIncidentSubCategory();
    }
  }

  getOrganization() {
    this._subsiadiaryService.getAllItems(false).subscribe((res: any) => {
      if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
        this.form.patchValue({ organization_ids: res.data[0] });
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getBranches() {
    if (this.form.get('organization_ids').value) {
      // let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + this.form.get('organization_ids').value.id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  searchBranches(e) {
    if (this.form.get('organization_id').value) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + this.form.get('organization_ids').value.id + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }


  handleDropDownClear(type) {
    switch (type) {
      case 'organization_id': this.form.controls['division_ids'].reset();
        this.form.controls['department_ids'].reset();
        this.form.controls['section_ids'].reset();
        this.form.controls['sub_section_ids'].reset();

        break;
      case 'division_id': this.form.controls['department_ids'].reset();
        this.form.controls['section_ids'].reset();
        this.form.controls['sub_section_ids'].reset();

        break;
      case 'department_id': this.form.controls['section_ids'].reset();
        this.form.controls['sub_section_ids'].reset();

        break;
      case 'section_id': this.form.controls['sub_section_ids'].reset();

        break;
      default: '';
        break;
    }
  }

  checkSubSection(sectionId: number, type: string) {
    let subSectionValue: [] = this.form.value.sub_section_ids;
    for (var i = 0; i < subSectionValue?.length; i++) {
      let subSectionSectionId = subSectionValue[i][type];
      if (sectionId == subSectionSectionId) {
        subSectionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['sub_section_ids'].setValue(subSectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSection(departmentId: number, type: string) {
    let sectionValue: [] = this.form.value.section_ids;
    for (var i = 0; i < sectionValue?.length; i++) {
      let sectionDepartmentId = sectionValue[i][type];
      if (departmentId == sectionDepartmentId) {
        if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
        sectionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['section_ids'].setValue(sectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number, type: string) {
    let departmentValue: [] = this.form.value.department_ids;
    for (var i = 0; i < departmentValue?.length; i++) {
      let deptDivisionId = departmentValue[i][type];
      if (divisionId == deptDivisionId) {
        if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
        departmentValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
  }
  checkDivision(organizationId: number, type: string) {
    let divisionValue: [] = this.form.value.division_ids;
    for (var i = 0; i < divisionValue?.length; i++) {
      let divOrganizationId = divisionValue[i][type];
      if (organizationId == divOrganizationId) {
        divisionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  handleDropDownItemClear(event, type) {
    switch (type) {
      case 'organization_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
        this.checkDivision(event.value.id, type);
        this.checkDepartment(event.value.id, type);
        if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
          this.checkSection(event.value.id, type);
        if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
          this.checkSubSection(event.value.id, type);

        break;
      case 'division_id': this.checkDepartment(event.value.id, type);

        break;
      case 'department_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
        this.checkSection(event.value.id, type);

        break;
      case 'section_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
        this.checkSubSection(event.value.id, type);

        break;

      default: '';
        break;
    }
  }

  // for searching organization

  searchOrganization(event) {

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsiadiaryService.searchSubsidiary('?is_full_list=true&q=' + event.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }


  }


  // Get all users

  // getUsers() {
  //     this._userService.getAllItems().subscribe(res => {
  //       this._utilityService.detectChanges(this._cdr);
  //     });

  // }


  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getUsers() {
    var params = '';
    params = '?organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value);
    this._userService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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

  getInvolvedUsers() {
    // let params = '?department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._stakeholderService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getPersonInvolved() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getDevisions() {
    if (this.form.get('organization_ids').value) {
      let parameters = this.form.value.organization_ids.id;
      this._divisionService.getItems(false, parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  getDepartment() {

    if (this.form.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this.form.value.organization_ids.id
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this.form.value.division_ids.id;
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getSections() {
    if (this.form.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this.form.value.organization_ids.id
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this.form.value.division_ids.id;
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this.form.value.department_ids.id;
      this._sectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.SectionStore.setAllSection([]);
    }
  }

  getSubSections() {
    if (this.form.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this.form.value.organization_ids.id
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this.form.value.division_ids.id;
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this.form.value.department_ids.id;
      if (this.form.get('section_ids').value)
        params += '&section_ids=' + this.form.value.section_ids.id;
      this._subSectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.SubSectionStore.setAllSubSection([]);
    }
  }


  searchPersonInvolved(e) {
    if (this.form.value.department_ids) {
      let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      this._userService.searchUsers('?q=' + e.term + params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }
  searchReportedBy(e) {
    if (this.form.value.department_ids) {
      let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      this._userService.searchUsers('?q=' + e.term + params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  /**
  * Search Stakeholder
  * @param e e.term - character to search
  */
  searchInvolved(e, patchValue: boolean = false) {
    this._stakeholderService.getItems(false, '&q=' + e.term)
      .subscribe((res) => {
        if (patchValue) {
          for (let i of res.data) {
            if (i.id == e.term) {
              this.form.patchValue({ incident_stakeholder_ids: i });
              break;
            }
          }
          // _incidentDamageTypesService.lastIsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  searchIncidentType(e, patchValue: boolean = false) {
    this._incidentDamageTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if (patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ incident_damage_type_id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // seraching division

  searchDivision(event) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + event.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchIncidentCategory(e, patchValue: boolean = false) {
    this._incidentCategoriesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if (patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ incident_category_ids: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchIncidentSubCategory(e, patchValue: boolean = false) {
    let params = ''
    if (this.form.get('incident_category_ids').value) {
      params = '&incident_category_ids=' + this.form.get('incident_category_ids').value.id;
      this._incidentSubCategoryService.getItems(false, '&q=' + e.term + params).subscribe((res) => {
        if (patchValue) {
          for (let i of res.data) {
            if (i.id == e.term) {
              this.form.patchValue({ incident_sub_category_ids: i });
              break;
            }
          }
          // _incidentDamageTypesService.lastIsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchDepartment(e, patchValue: boolean = false) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }

  searchSections(e, patchValue: boolean = false) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }
  searchSubSections(e, patchValue: boolean = false) {

    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      if (this.form.get('section_ids').value)
        params += '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
      // let parameters = this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
      this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  addStakeholder() {
    setTimeout(() => {
      $(this.stakeholderAddPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.stakeholderAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  addTypeDamage() {
    setTimeout(() => {
      $(this.damageTypeAddPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.damageTypeAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  addCategory() {
    setTimeout(() => {
      $(this.categoryTypeAddPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.categoryTypeAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  addSubCategory() {
    setTimeout(() => {
      $(this.subCategoryTypeAddPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.subCategoryTypeAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  closeStakeholderModal() {
    $(this.stakeholderAddPopup.nativeElement).modal('hide');
    this.searchInvolved({ term: StakeholdersStore.lastInsertedId }, true)
  }

  closeSubCategoryModal() {
    $(this.subCategoryTypeAddPopup.nativeElement).modal('hide');
    this.searchIncidentSubCategory({ term: IncidentSubCategoryMasterStore.lastInsertedId }, true)
  }

  closeCategoryModal() {
    $(this.categoryTypeAddPopup.nativeElement).modal('hide');
    this.searchIncidentCategory({ term: IncidentCategoriesMasterStore.lastInsertedId }, true)
  }

  closeDamageTypeModal() {
    $(this.damageTypeAddPopup.nativeElement).modal('hide');
    this.searchIncidentType({ term: IncidentDamageTypeMasterStore.lastInsertedId }, true)
  }


  editInvolvedOthers(user, index) {
    IncidentStore.otherInvolvedUserDetailsEdit = [];
    IncidentStore.selectedIndexForEdit = null
    IncidentStore.setOtherInvolvedUserDetailsEdit(user, index)
    // setTimeout(() => {
    //   this.addPersonInvolved();
    // }, 1000);
    this._utilityService.detectChanges(this._cdr);


  }


  editWitnessOthers(user, index) {
    IncidentStore.otherWitnessUserDetailsEdit = [];
    IncidentStore.selectedIndexForWitnessEdit = null
    IncidentStore.setOtherWitnessUserDetailsEdit(user, index)
    // this.addWitness();
    this._utilityService.detectChanges(this._cdr);


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


  /**
   * removing document file from the selected list
   * @param token -image token
   */
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
  // file change function

  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
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
                  $("#file").val('');
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

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._incidentService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  // scrollbar function
  checkForFileUploadsScrollbar() {

    if (IncidentStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // for user previrews
  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
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

      userInfoObject.first_name = user?.first_name ? user?.first_name : user?.user?.first_name;
      userInfoObject.last_name = user?.last_name ? user?.last_name : user?.user?.last_name;
      userInfoObject.designation = user?.designation_title ? user?.designation_title : user?.designation ? user?.designation : user?.user?.designation ? user?.user?.designation?.title : null;
      userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token : null;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status_id
      userInfoObject.department = user?.department ? user?.department : user?.user?.department?.title ? user?.user?.department?.title : null;
      return userInfoObject;
    }
  }
  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i.id);
    }
    return returnValues;
  }

  passSaveFormatDate(date) {
    const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    return fromdate;
  }


  submitIncidentForm() {

    let save;

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    if (this.form.value.id) {
      save = this._incidentService.updateIncidentItem(this.form.value.id, this.processDataForSave());

    } else {
      delete this.form.value.id
        // save = this._findingsService.saveItem(this.processDataForSave());
        let saveParam = {
          ...this.createSaveData(),
          documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
        }
        
        //save = this._findingsService.saveItem(saveParam)
      save = this._incidentService.saveIncident(saveParam);

    }

    save.subscribe((res: any) => {

      this.resetForm();
      $("#file").val('');
      IncidentStore.otherInvolvedUserDetails = [];
      IncidentStore.otherWitnessUserDetails = [];
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl('/incident-management/' + res.id + '/info')

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
      }


      this.currentTab = 0;
      this.nextButtonText = "Next";
      this.previousButtonText = "Previous";
      this.setIntialTab();
      this.showTab(this.currentTab);

      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);


    });
  }

  // changeStep(step){
  //   if(step > this.currentTab && this.checkFormObject(step)){
  //     let dif = step - this.currentTab;
  //     this.nextPrev(dif)
  //   }
  //   else if(step < this.currentTab){
  //     let dif = this.currentTab - step;
  //     this.nextPrev(-dif);
  //   }  
  // }

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



  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  processFormErrors() {
    var errors = this.formErrors;

    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.startsWith('incident_damage_type_id.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['incident_damage_type_id'] = this.formErrors['incident_damage_type_id'] ? this.formErrors['incident_damage_type_id'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }

      }
    }

    this._utilityService.detectChanges(this._cdr);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

  }




  //edit function

  setIncidentItemDataForEdit() {
    this.checkListArray = [];

    var incidentItem = IncidentStore.IncidentItemDetails;

    // for (let i of incidentItem.documents) {
    //   let docurl = this._incidentFileService.getThumbnailPreview('incident-item', i.token);
    //   let docDetails = {
    //     created_at: i.created_at,
    //     created_by: i.created_by,
    //     updated_at: i.updated_at,
    //     updated_by: i.updated_by,
    //     name: i.title,
    //     ext: i.ext,
    //     size: i.size,
    //     url: i.url,
    //     thumbnail_url: i.url,
    //     token: i.token,
    //     preview: docurl,
    //     id: i.id

    //   };
    //   this._incidentService.setDocumentDetails(docDetails, docurl);
    //   setTimeout(() => {
    //     this.checkForFileUploadsScrollbar();
    //   }, 200);

    // }
    this.clearFIleUploadPopupData();
    if (incidentItem.documents.length > 0) {
              
      this.setDocuments(incidentItem.documents);
    }

    this.form.patchValue({
      id: incidentItem.id ? incidentItem.id : '',
      title: incidentItem.title ? incidentItem.title : '',
      description: incidentItem.description ? incidentItem.description : '',
      location: incidentItem.location ? incidentItem.location : '',
      incident_at: incidentItem.incident_at ? new Date(incidentItem.incident_at) : '',
      reported_at: incidentItem.reported_at ? new Date(incidentItem.reported_at) : '',
      incident_damage_type_id: incidentItem.incident_damage_type ? incidentItem.incident_damage_type : '',
      action: incidentItem.action ? incidentItem.action : '',
      reported_by: incidentItem.reported_by ? incidentItem.reported_by : '',
      documents: IncidentStore.docDetails,
      // incident_sub_category_ids: toJS(incidentItem.incident_sub_categories).length > 0 ? incidentItem.incident_sub_categories[0] : [],
      incident_sub_category_ids: toJS(incidentItem.incident_sub_categories).length > 0 ? incidentItem.incident_sub_categories[0] : null,
      incident_category_ids: toJS(incidentItem.incident_categories).length > 0 ? incidentItem.incident_categories[0] : null,
      incident_stakeholder_ids: toJS(incidentItem.stakeholders).length > 0 ? incidentItem.stakeholders[0] : null,
      incident_witness_user_ids: toJS(incidentItem.witness_users).length > 0 ? incidentItem.witness_users : [],
      incident_involved_user_ids: toJS(incidentItem.involved_users).length > 0 ? incidentItem.involved_users : [],
      sub_section_ids: toJS(incidentItem.sub_sections).length > 0 ? incidentItem.sub_sections[0] : [],
      section_ids: toJS(incidentItem.sections).length > 0 ? incidentItem.sections[0] : [],
      organization_ids: toJS(incidentItem.organizations).length > 0 ? incidentItem.organizations[0] : [],
      division_ids: toJS(incidentItem.divisions).length > 0 ? incidentItem.divisions[0] : '',
      department_ids: toJS(incidentItem.departments).length > 0 ? incidentItem.departments[0] : null,
      branch_ids: toJS(incidentItem.branches).length > 0 ? incidentItem.branches[0] : null
    })

    if(incidentItem.witness_other_users.length) {
      this.setWitnessOtherUserDetails();
    }
    if(incidentItem.involved_other_users.length) {
      this.setInvolvedOtherUserDetails();
    }
    this._utilityService.detectChanges(this._cdr);


  }

  setWitnessOtherUserDetails() {
    for (let i of IncidentStore?.IncidentItemDetails.witness_other_users) {
      IncidentStore.setOtherWitnessUserDetails(i);
    }
  }

  setInvolvedOtherUserDetails() {
    for (let i of IncidentStore?.IncidentItemDetails.involved_other_users) {
      IncidentStore.setOtherInvolvedUserDetails(i);
    }
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
			else {
				if (element && element.token) {
					var purl = this._incidentFileService.getThumbnailPreview('incident-item', element.token)
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
	}


  involvedOthers() {
    let item = IncidentStore.involvedOtherUserDetails.slice(0, 2)
    return item
  }

  othersWitness() {
    let item = IncidentStore.involvedWitnessUserDetails.slice(0, 2)
    return item
  }

  getTodaysDate() {
    return new Date();
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._incidentFileService.getThumbnailPreview(type, token);
  }

  openOtherInvolvedPerson() {
    this.assignOtherUsers(IncidentStore.involvedOtherUserDetails);
  }

  openOthersWitnessModel() {
    this.assignOtherUsers(IncidentStore.involvedWitnessUserDetails);

  }

  closeassignOtherUsers() {
    // $(this.othersPopup.nativeElement).modal('show');
  }

  assignOtherUsers(users) {
    IncidentStore.setOthersItems(users)
    this._utilityService.detectChanges(this._cdr);
    // setTimeout(() => {
    //   $(this.othersPopup.nativeElement).modal('show');

    // }, 500);
  }

  deleteOtherInvovedPerson(user) {
    for (let i = 0; i < IncidentStore.otherInvolvedUserDetails.length; i++) {
      if (user == IncidentStore.otherInvolvedUserDetails[i].name) {
        IncidentStore.otherInvolvedUserDetails.splice(i, 1)
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  deleteOtherWitnessPerson(user) {
    for (let i = 0; i < IncidentStore.involvedWitnessUserDetails.length; i++) {
      if (user == IncidentStore.involvedWitnessUserDetails[i].name) {
        IncidentStore.involvedWitnessUserDetails.splice(i, 1)
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  cancelClicked() {
    // this._router.navigateByUrl('/incident-management/incidents')
    IncidentStore.otherInvolvedUserDetails = [];
    IncidentStore.otherWitnessUserDetails = [];
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  cancelByUser(status) {
    if (status) {

      this._router.navigateByUrl('/incident-management/incidents')

    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  incidentMaxDate() {
    let curDate = new Date();
    curDate.setDate(curDate.getDate());
    return curDate;
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    window.removeEventListener('scroll', this.scrollEvent);
    this.addInvolvedPersonSubscription.unsubscribe();
    this.addWitnessPersonSubscription.unsubscribe();
    this.damageType.unsubscribe();
    this.incidentCategory.unsubscribe();
    this.incidentSubCategory.unsubscribe();
    this.otherUserSubscription.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }


}
