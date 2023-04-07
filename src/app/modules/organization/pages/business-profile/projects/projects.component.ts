import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse, HttpEventType, HttpEvent } from '@angular/common/http';

import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { BusinessProjectsService } from "src/app/core/services/organization/business_profile/business-projects/business-projects.service";
import { BusinessProjectsStore } from "src/app/stores/organization/business_profile/business-projects.store";
import { OrganizationCustomersService } from "src/app/core/services/organization/business_profile/organization-customers/organization-customers.service";
import { BusinessCustomersStore } from "src/app/stores/organization/business_profile/business-customers.store";
import { ProjectStatusStore } from "src/app/stores/general/project-status.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";

import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";

import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";

import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";

import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";

import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";

import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;

  OrganizationModulesStore = OrganizationModulesStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessCustomersStore = BusinessCustomersStore;
  LocationsStore = LocationMasterStore;
  ProjectStatusStore = ProjectStatusStore;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SubsidiaryStore = SubsidiaryStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  logoUploaded = false;
  brochureUploaded = false;
  fileUploadProgress = 0;
  overlay = false;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  deleteObject = {
    title: 'Delete Project?',
    subtitle: 'are_you_sure_delete',
    id: null,
    type: ''
  };

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

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#search_bar',
      intro: 'Business Application Search',
      position: 'bottom'
    },
    {
      element: '#new_modal',
      intro: 'Add New Project',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Project List',
      position: 'bottom'
    },
  ]

  constructor(private _utilityService: UtilityService, private _organizationFileService: OrganizationfileService,
    private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder, private _businessProjectsService: BusinessProjectsService,
    private _organizationCustomerService: OrganizationCustomersService, private _locationService: LocationService,
    private _usersService: UsersService, private _renderer2: Renderer2, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService, private _subsidiaryService: SubsidiaryService,
    private _divisionService: DivisionService, private _sectionService: SectionService,
    private _departmentService: DepartmentService, private _subsectionService: SubSectionService,) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = false;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      switch (this.deleteObject.type) {
        case '': this.delete(item);
          break;
        case 'Activate': this.activateProject(item);
          break;
        case 'Deactivate': this.deactivateProject(item);
          break;
      }
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

    SubMenuItemStore.searchText = '';
    BusinessProjectsStore.searchText = '';

    NoDataItemStore.setNoDataItems({ title: "projects_nodata_title", subtitle: 'projects_nodata_subtitle', buttonText: 'projects_new_button' });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'PROJECT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_PROJECT', submenuItem: { type: 'new_modal' } },
        // {activityName: 'GENERATE_PROJECT_TEMPLATE', submenuItem: {type: 'template'}},
        { activityName: 'EXPORT_PROJECT', submenuItem: { type: 'export_to_excel' } }
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_PROJECT')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      if (AuthStore.userPermissionsLoaded) {
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems, this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(400, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.createNewProject();
            }, 1000);
            break;
          case "template":
            //this._businessProjectsService.generateTemplate();
            var fileDetails = {
              ext: 'xlsx',
              title: 'projects_template',
              size: null
            };
            this._organizationFileService.downloadFile('projects-template', null, null, fileDetails.title, fileDetails);
            break;
          case "export_to_excel":
            //this._businessProjectsService.exportToExcel();
            var fileDetails = {
              ext: 'xlsx',
              title: 'projects',
              size: null
            };
            this._organizationFileService.downloadFile('projects-export', null, null, fileDetails.title, fileDetails);
            break;
          case "search":
            BusinessProjectsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            //this.searchProject(SubMenuItemStore.searchText);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.createNewProject();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    // Create Form Object
    this.form = this._formBuilder.group({
      id: '',
      organization_ids: [null, Validators.required],
      division_ids: [null],
      department_ids: [null, Validators.required],
      section_ids: [null],
      sub_section_ids: [null],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      member_count: '',
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      customer_id: '',
      project_manager_id: '',
      project_status_id: ['', [Validators.required]],
      location_id: ['', [Validators.required]],
      image: '',
      is_system_project: false
    });

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_ids'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_ids'].setValidators(Validators.required);

    SubMenuItemStore.setNoUserTab(true);

    this.getUsers(); // Get Users
    this.getCustomers();
    this.getLocations();
    // this.getSubsidiary();
    this._businessProjectsService.getProjectStatus().subscribe(); // Get Project Status
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res => {
      this.showIntro();
    })
    this.pageChange(1);
  }

  showIntro() {
    var intro: any = introJs();
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

  pageChange(newPage: number = null) {
    // Get Projects
    if (newPage) BusinessProjectsStore.setCurrentPage(newPage);
    this._businessProjectsService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 250));
  }

  createNewProject() {
    this.resetFormDetails();
    this._businessProjectsService.setImageDetails(null, '', 'logo');
    this.BusinessProjectsStore.addOrEditFlag = false; // Set Title to Add Project
    // BusinessProjectsStore.preview_url = '';
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    this.getSubsidiary();
    this.openFormModal();
    this.setInitialOrganizationLevels();
  }

  getSubsidiary() {
    // Get Subsidarys
    this._subsidiaryService.getAllItems(false, null, true).subscribe((res: any) => {
      if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary) {
        this.form.controls['organization_ids'].setValue([res.data[0].id]);
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSubsidiary(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary(`?q=${e.term}&is_full_list=true`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getLocations() {
    this._locationService.getItems().subscribe(); // Get Locations
  }

  searchLocations(e) {
    this._locationService.getItems(false, `?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    }); // Get Locations
  }

  getCustomers() {
    this._organizationCustomerService.getItems().subscribe(); // Get Customers
  }

  searchCustomers(e) {
    this._organizationCustomerService.getItems(false, `?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    }); // Get Customers
  }

  // Open Modal to Add/Edit Project Modal
  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
  }

  // Close Modal
  closeFormModal() {
    BusinessProjectsStore.logo_preview_available = false;
    $(this.formModal.nativeElement).modal('hide');
    this.resetFormDetails();
  }

  cancel() {
    this.closeFormModal();
  }

  // Reset Form Details
  resetFormDetails() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this._businessProjectsService.setImageDetails(null, '', 'logo');
  }

  setInitialOrganizationLevels() {
    this.form.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division.id] : [],
      department_ids: AuthStore.user.department ? [AuthStore.user.department.id] : [],
      section_ids: AuthStore.user.section ? [AuthStore.user.section.id] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section.id] : []
    });
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary) {
      this.form.patchValue({ organization_ids: [AuthStore.user.organization.id] });
    }
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_division) this.searchDivision({ term: this.form.value.division_ids });
    this.searchDepartment({ term: this.form.value.department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_section) this.searchSection({ term: this.form.value.section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
    this._utilityService.detectChanges(this._cdr);
  }

  processSaveData() {
    let saveData = this.form.value;
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date, 'join');
    saveData['is_system_project'] = false;
    saveData['image'] = this._businessProjectsService.getImageDetails('logo');
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      saveData['division_ids'] = [];
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      saveData['section_ids'] = [];
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      saveData['sub_section_ids'] = [];
    return saveData;
  }

  /**
   * Create or update Project
   * @param close boolean value check whether to close modal or not
   */
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      // this.form.patchValue({image: this._businessProjectsService.getImageDetails('logo')});
      // this.form.patchValue({is_system_project:false});
      // this.form.patchValue({
      //   start_date:  this.formatStartDate(),
      //   target_date: this.formatTargetDate(),
      // })
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._businessProjectsService.updateItem(this.form.value.id, this.processSaveData());
      } else {
        save = this._businessProjectsService.saveItem(this.processSaveData());
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
          this.setInitialOrganizationLevels();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 250);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this.processFormErrors();
        }
        else if (err.status == 403 || err.status == 500) {
          this.closeFormModal();
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  processFormErrors() {
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.includes('organization_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['organization_ids'] = this.formErrors['organization_ids'] ? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.includes('division_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['division_ids'] = this.formErrors['division_ids'] ? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.includes('department_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['department_ids'] = this.formErrors['department_ids'] ? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.includes('section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['section_ids'] = this.formErrors['section_ids'] ? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.includes('sub_section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids'] ? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Edit Project - Fetch details and open modal
   * @param projectId Project Id
   */
  editProject(projectId) {
    this.BusinessProjectsStore.addOrEditFlag = true; // Set Title to Edit Project
    // this._businessProjectsService.setImageDetails(null,'','logo');
    this.resetFormDetails();
    this.BusinessProjectsStore.clearBrochureDetails();
    this._businessProjectsService.getItem(projectId).subscribe(res => {
      var projectDetails = res;
      if (projectDetails.hasOwnProperty('image_token') && projectDetails['image_token']) {
        var previewUrl = this._organizationFileService.getThumbnailPreview('project-logo', projectDetails.image_token);
        var logoDetails = {
          name: projectDetails['image_title'],
          ext: projectDetails['image_ext'],
          size: projectDetails['image_size'],
          url: projectDetails['image_url'],
          token: projectDetails['image_token'],
          preview: previewUrl,
          thumbnail_url: projectDetails['image_url']
        };
        this._businessProjectsService.setImageDetails(logoDetails, previewUrl, 'logo');
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this.form.setValue({
          id: res.id ? res.id : '',
          organization_ids: res.organizations ? this.getEditValue(res.organizations) : [],
          division_ids: res.divisions ? this.getEditValue(res.divisions) : [],
          department_ids: res.departments ? this.getEditValue(res.departments) : [],
          section_ids: res.sections ? this.getEditValue(res.sections) : [],
          sub_section_ids: res.sub_sections ? this.getEditValue(res.sub_sections) : [],
          title: res.title ? res.title : '',
          description: res.description ? res.description : '',
          member_count: res.member_count ? res.member_count : '',
          start_date: res.start_date ? this._helperService.processDate(res.start_date, 'split') : null,
          target_date: res.target_date ? this._helperService.processDate(res.target_date, 'split') : null,
          customer_id: res.customer ? res.customer.id : null,
          project_manager_id: res.project_manager ? res.project_manager.id : null,
          project_status_id: res.project_status ? res.project_status.id : null,
          location_id: res.location ? res.location.id : null,
          image: '',
          is_system_project: false
        });
        this._utilityService.detectChanges(this._cdr);
        this.getDivision();
        this.getDepartment();
        this.getSection();
        this.getSubSection();
        // this.getUsers();
        if (this.form.value.project_manager_id) this.searchUers({ term: this.form.value.project_manager_id });
        else this.getUsers();
        this.getSubsidiary();
        this.openFormModal();
      }, 500);
    })
  }

  // formatStartDate() {
  //   // converting start date
  //   if (this.form.value.start_date) {
  //     let tempstartdate = this.form.value.start_date;

  //     this.form.value.start_date = this._helperService.processDate(tempstartdate, 'join');
  //     return this.form.value.start_date;
  //   }
  // }

  // formatTargetDate() {
  //   if (this.form.value.target_date) {
  //     let tempTargetdate = this.form.value.target_date;

  //     this.form.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
  //     return this.form.value.target_date;
  //   }
  // }

  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i['id']);
    }
    return returnValue;
  }

  // Return image url by type and token
  createImagePreviewUrl(type, token, h?: number, w?: number) {
    return this._organizationFileService.getThumbnailPreview(type, token, h, w);
  }

  // Return Default Image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
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

  /**
   * Delete Project after confirmation
   * @param projectId Project Id
   */
  deleteProject(projectId) {
    this.deleteObject.id = projectId;
    this.deleteObject.type = '';
    this.deleteObject.title = 'Delete Project?';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
    // this.openConfirmationPopup();
  }

  openConfirmationPopup() {
    this._renderer2.addClass(this.deletePopup.nativeElement, 'show');
    this._renderer2.setStyle(this.deletePopup.nativeElement, 'display', 'block');
    document.body.classList.add('modal-open');
    AppStore.overlay = true;
    this._utilityService.detectChanges(this._cdr);
  }

  delete(status) {
    // if(status && this.deleteObject.id){
    //   this._businessProjectsService.deleteItem(this.deleteObject.id).subscribe(resp=>{
    //     setTimeout(() => {
    //       this._utilityService.detectChanges(this._cdr);
    //     }, 200);
    //     this.clearDeleteObject();
    //   });
    // }
    // else{
    //   this.clearDeleteObject();
    // }
    // setTimeout(() => {
    //   $(this.deletePopup.nativeElement).modal('hide');
    // }, 250);
    if (status && this.deleteObject.id && this.deleteObject.type == '') {
      this._businessProjectsService.deleteItem(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 200);
        this.clearDeleteObject();
      }, (error => {
        if (error.status == 405 && BusinessProjectsStore.getProjectDetailsById(this.deleteObject.id).status_id == AppStore.activeStatusId) {
          this.closeConfirmationPopup();
          this.deleteObject.type = 'Deactivate';
          this.deleteObject.title = 'Deactivate Project?';
          this.deleteObject.subtitle = error.error?.message ? error.error?.message : 'are_you_sure_deactivate';
          setTimeout(() => {
            $(this.deletePopup.nativeElement).modal('show');
            this._utilityService.detectChanges(this._cdr);
            // this.openConfirmationPopup();
          }, 500);
        }
        else {
          this.closeConfirmationPopup();
          this.clearDeleteObject();
        }
      }));
    }
    else {
      if (status) {
        this.deactivateProject(status)
      }
      else {
        this.closeConfirmationPopup();
        this.clearDeleteObject();
      }

    }
  }

  activateProject(status) {
    if (status && this.deleteObject.id) {
      this._businessProjectsService.activateItem(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 500);
      }, (error => {
      }));
    }
    else {
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }

  deactivateProject(status) {
    if (status && this.deleteObject.id) {
      this._businessProjectsService.deactivateItem(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        setTimeout(() => {
          this.closeConfirmationPopup();
        }, 500);
      }, (error => {
      }));
    }
    else {
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }

  activate(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.title = 'Activate Project?';
    this.deleteObject.subtitle = 'are_you_sure_activate';
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  deactivate(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.title = 'Dectivate Project?';
    this.deleteObject.subtitle = 'are_you_sure_deactivate';
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // AppStore.overlay = false;
    // this._renderer2.removeClass(this.deletePopup.nativeElement,'show');
    // this._renderer2.setStyle(this.deletePopup.nativeElement,'display','none');
    // document.body.classList.remove('modal-open');
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    // this.deleteObject.type = '';
    // this.deleteObject.title = 'Delete Project?';
    // this.deleteObject.subtitle = 'This action cannot be undone';
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BusinessProjectsStore.unSetAllData();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    BusinessProjectsStore.searchText = '';
    this.introButtonSubscriptionEvent.unsubscribe();
  }

  // File Selection and Upload
  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      Array.prototype.forEach.call(selectedFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          BusinessProjectsStore.logo_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams)
            .subscribe((res: HttpEvent<any>) => {
              let uploadEvent: any = res;
              switch (uploadEvent.type) {
                case HttpEventType.UploadProgress:
                  // Compute and show the % done;
                  if (uploadEvent.loaded)
                    this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  //return event;
                  $("#file").val('');
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                    if (type == 'logo') {
                      BusinessProjectsStore.logo_preview_available = false;
                      this.logoUploaded = true;
                    }
                    this.createImageFromBlob(prew, temp, type);
                  }, (error) => {
                    $("#file").val('');
                    BusinessProjectsStore.logo_preview_available = false;
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              $("#file").val('');
              let errorMessage = "";
              if (error.error?.errors?.hasOwnProperty('file'))
                errorMessage = error.error.errors.file;
              else errorMessage = 'file_upload_failed';
              this._utilityService.showErrorMessage('failed', errorMessage);
              this.fileUploadProgress = 0;
              BusinessProjectsStore.logo_preview_available = false;
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          $("#file").val('');
        }
      })
    }
  }

  
  // Create Base64 String from blog
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      if (imageDetails)
        this._businessProjectsService.setImageDetails(imageDetails, logo_url, type);
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  // Search Users
  searchUers(e) {
    var params = '';
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '')
        + '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '')
        + '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '')
        + '&section_ids=' + (this.form.get('section_ids').value ? this.form.get('section_ids').value : '')
        + '&sub_section_ids=' + (this.form.get('sub_section_ids').value ? this.form.get('sub_section_ids').value : '')
      this._usersService.searchUsers('?q=' + e.term + params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      UsersStore.setAllUsers([]);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Get Users
  getUsers() {
    var params = '';
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      params = '?organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '')
        + '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '')
        + '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '')
        + '&section_ids=' + (this.form.get('section_ids').value ? this.form.get('section_ids').value : '')
        + '&sub_section_ids=' + (this.form.get('sub_section_ids').value ? this.form.get('sub_section_ids').value : '')
      this._usersService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      UsersStore.setAllUsers([]);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getDefaultGeneralImage() {
    return this._imageService.getDefaultImageUrl('general');
  }

  // Return trimmed description
  getDescriptionContent(p) {
    var descriptionContent = p.description.substring(0, 650);
    return descriptionContent;
  }

  // Set view_more in description
  viewDescription(type, product) {
    if (type == 'more')
      product.view_more = true;
    else
      product.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    this.userDetailObject.first_name = user.project_manager_first_name;
    this.userDetailObject.last_name = user.project_manager_last_name;
    this.userDetailObject.designation = user.project_manager_designation;
    this.userDetailObject.image_token = user.project_manager_image_token;
    this.userDetailObject.email = user.project_manager_email ? user.project_manager_email : null;
    this.userDetailObject.mobile = user.mobile ? user.mobile : null;
    this.userDetailObject.id = user.project_manager_id;
    this.userDetailObject.department = user.project_manager_department ? user.project_manager_department : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
  }

  searchDivision(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_division && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '';
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['division_ids'].reset();
    }
  }


  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }


  // Get Division
  getDivision() {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_division && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '';
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['division_ids'].reset();
      this.getDepartment();
      this.DivisionStore.setAllDivision([]);
    }
  }
  
 
  /**
  * Search Department
  * @param e e.term - character to search
  */
  searchDepartment(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['department_ids'].reset();
    }
  }

  // Get Department
  getDepartment() {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['department_ids'].reset();
      this.getSection();
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  // Get Section
  getSection() {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_section && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '');
      this._sectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['section_ids'].reset();
      this.getSubSection();
      this.SectionStore.setAllSection([]);
    }
  }

  /**
  * Search Section
  * @param e e.term - character to search
  */
  searchSection(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_section && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '');
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['section_ids'].reset();
    }
  }

  // Get Sub Section
  getSubSection() {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '');
      if (this.form.get('section_ids').value)
        params += '&section_ids=' + (this.form.get('section_ids').value ? this.form.get('section_ids').value : '');
      //let parameters = this.form.get('section_ids').value);
      this._subsectionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['sub_section_ids'].reset();
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  /**
  * Search Sub Section
  * @param e e.term - character to search
  */
  searchSubSection(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section && this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + (this.form.get('organization_ids').value ? this.form.get('organization_ids').value : '');
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + (this.form.get('division_ids').value ? this.form.get('division_ids').value : '');
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + (this.form.get('department_ids').value ? this.form.get('department_ids').value : '');
      if (this.form.get('section_ids').value)
        params += '&section_ids=' + (this.form.get('section_ids').value ? this.form.get('section_ids').value : '');
      // let parameters = this.form.get('section_ids').value);
      this._subsectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.form.controls['sub_section_ids'].reset();
    }
  }

  createSaveData() {
    let saveData: any = this.form.value;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      saveData['division_ids'] = [];
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      saveData['section_ids'] = [];
    if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      saveData['sub_section_ids'] = [];
    return saveData;
  }

  handleDropDownClear(type) {
    // switch(type){
    //   case 'organization_id': this.form.controls['division_ids'].reset();
    //                           this.form.controls['department_ids'].reset();
    //                           this.form.controls['section_ids'].reset();
    //                           this.form.controls['sub_section_ids'].reset();
    //                           this.form.controls['project_manager_id'].reset();
    //     break;
    //   case 'division_id': this.form.controls['department_ids'].reset();
    //                       this.form.controls['section_ids'].reset();
    //                       this.form.controls['sub_section_ids'].reset();
    //                       this.form.controls['project_manager_id'].reset();
    //     break;
    //   case 'department_id': this.form.controls['section_ids'].reset();
    //                         this.form.controls['sub_section_ids'].reset();
    //                         this.form.controls['project_manager_id'].reset();
    //     break;
    //   case 'section_id':  this.form.controls['sub_section_ids'].reset();
    //                       this.form.controls['project_manager_id'].reset();
    //     break;
    //   case 'sub_section_id': this.form.controls['project_manager_id'].reset();
    //     break;
    //   default: '';
    //     break;
    // }
  }

  handleDropDownItemClear(event, type) {
    // switch(type){
    //   case 'organization_id':   if(OrganizationLevelSettingsStore.organizationLevelSettings.is_division)
    //                               this.checkDivision(event.value.id,type);
    //                             this.checkDepartment(event.value.id,type);
    //                             if(OrganizationLevelSettingsStore.organizationLevelSettings.is_section)
    //                               this.checkSection(event.value.id,type);
    //                             if(OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section)
    //                               this.checkSubSection(event.value.id,type);
    //                             this.checkUser(event.value.id,type);
    //     break;
    //   case 'division_id': this.checkDepartment(event.value.id,type);
    //                       this.checkUser(event.value.id,type);
    //     break;
    //   case 'department_id': if(OrganizationLevelSettingsStore.organizationLevelSettings.is_section)
    //                           this.checkSection(event.value.id,type);
    //                         this.checkUser(event.value.id,type)
    //     break;
    //   case 'section_id':  if(OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section)
    //                         this.checkSubSection(event.value.id,type);
    //                       this.checkUser(event.value.id,type)
    //     break;
    //   case 'sub_section_id': this.checkUser(event.value.id,type);
    //     break;
    //   default: '';
    //     break;
    // }
  }

  checkDivision(organizationId: number, type: string) {
    let divisionValue: [] = this.form.value.division_ids;
    for (var i = 0; i < divisionValue.length; i++) {
      let divOrganizationId = DivisionMasterStore.getDivisionById(divisionValue[i]).organization_id;
      if (organizationId == divOrganizationId) {
        divisionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number, type: string) {
    let departmentValue: [] = this.form.value.department_ids;
    for (var i = 0; i < departmentValue.length; i++) {
      let deptDivisionId = DepartmentMasterStore.getDepartmentById(departmentValue[i])[type];
      if (divisionId == deptDivisionId) {
        if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
        departmentValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSection(departmentId: number, type: string) {
    let sectionValue: [] = this.form.value.section_ids;
    for (var i = 0; i < sectionValue.length; i++) {
      let sectionDepartmentId = SectionMasterStore.getSectionById(sectionValue[i])[type];
      if (departmentId == sectionDepartmentId) {
        if (OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
        sectionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['section_ids'].setValue(sectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSubSection(sectionId: number, type: string) {
    let subSectionValue: [] = this.form.value.sub_section_ids;
    for (var i = 0; i < subSectionValue.length; i++) {
      let subSectionSectionId = SubSectionMasterStore.getSubSectionById(subSectionValue[i])[type];
      if (sectionId == subSectionSectionId) {
        subSectionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['sub_section_ids'].setValue(subSectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkUser(id: number, type: string) {
    let userValues = this.form.value.project_manager_id;
    // for(var i = 0; i< userValues.length; i++){
    let requiredId = UsersStore.getUserById(userValues)[type];
    if (requiredId == id) {
      // userValues.splice(i,1);
      // i--;
      userValues = null;
    }
    // }
    this.form.controls['project_manager_id'].setValue(userValues);
    this._utilityService.detectChanges(this._cdr);
  }

  getProjectManagerName(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
        this.cancel();
    }
  }

}
