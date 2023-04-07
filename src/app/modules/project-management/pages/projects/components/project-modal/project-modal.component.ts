import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, OnDestroy, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Subject, Subscription } from 'rxjs';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectCategoryService } from 'src/app/core/services/masters/project-management/project-category/project-category.service';
import { ProjectCategoryMasterStore } from 'src/app/stores/masters/project-management/project-category-store';
import { ProjectTypeService } from 'src/app/core/services/masters/project-management/project-type/project-type.service';
import { ProjectTypeMasterStore } from 'src/app/stores/masters/project-management/project-type-store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { ProjectStatusService } from 'src/app/core/services/masters/project-management/project-status/project-status.service';
import { ProjectStatusMasterStore } from 'src/app/stores/masters/project-management/project-status-store';
import { CustomersService } from 'src/app/core/services/customer-satisfaction/customers/customers.service';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ProjectListDatum } from 'src/app/core/models/project-management/projects/projects';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { Router } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ProjectManagementInfoService } from 'src/app/core/services/project-management/project-details/info/project-management-info.service';
import { ProjectManagementInfo } from 'src/app/core/models/project-management/project-details/project-info';
import { debounceTime, map } from 'rxjs/operators';
declare const $: any;

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectModalComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('projectModal') projectModal;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('categoryMasterModal', { static: false }) categoryMasterModal: ElementRef;
  @ViewChild('locationMasterModal', { static: false }) locationMasterModal: ElementRef;
  @ViewChild('customerModal', { static: false }) customerModal: ElementRef;
  @Input('editData') editData: ProjectListDatum | any;
  @Input('popupType') popupType;
  @Input('dataID') editDataID;
  Editor: any;
  form: FormGroup;
  UsersStore = UsersStore;
  openModelPopup: boolean = false;
  projectCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  locationObject = {
    component: 'Master',
    values: null,
    type: null
  };

  customerObject = {
    component: 'Master',
    values: null,
    type: null
  };

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

  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadPopupSubscriptionEvent: Subscription;
  fileUploadPopupSubscription: Subscription;
  projectStore = ProjectsStore;
  LocationMasterStore = LocationMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  OrganizationalSettingsStore = OrganizationalSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  ProjectCategoryMasterStore = ProjectCategoryMasterStore;
  ProjectTypeMasterStore = ProjectTypeMasterStore;
  ProjectStatusMasterStore = ProjectStatusMasterStore;
  CustomersStore = CustomersStore;
  AppStore = AppStore;
  formErrors: any;
  popupControlSubscription: Subscription;
  organisationChangesModalSubscription: Subscription;
  fileUploadsArray = [];
  fileUploadProgress = 0;
  projectCategorySubscriptionEvent: Subscription;
  projectLocationSubscriptionEvent: Subscription;
  customerSubscriptionEvent: Subscription;
  triggerChanges$ = new Subject<any>();

  constructor(
    private _fb: FormBuilder,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _projectCategory: ProjectCategoryService,
    private _eventEmitterService: EventEmitterService,
    private _projectTypeService: ProjectTypeService,
    private _helperService: HelperServiceService,
    private _subsidiaryService: SubsidiaryService,
    private _projectStatusService: ProjectStatusService,
    private _customersService: CustomersService,
    private _projectManagementService: ProjectManagementProjectsService,
    private _locationService: LocationService,
    private _pmInfoService: ProjectManagementInfoService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,) {
    this.Editor = myCkEditor;
  }

  ngOnInit(): void {
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
    })
    this.initForm();

    this.fileUploadPopupSubscription = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.setZIndex()
    });

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
        this.setZIndex()
      }
    );

    this.projectCategorySubscriptionEvent = this._eventEmitterService.projectCategory.subscribe(res => {
      this.closeCategoryMasterModal(res);
      this.setZIndex();
      this._cdr.detectChanges();
    })

    this.projectLocationSubscriptionEvent = this._eventEmitterService.locationMasterControl.subscribe((res) => {
      this.closeLocationMasterModal(res);
      this.setZIndex();
      this._cdr.detectChanges();
    })

    this.customerSubscriptionEvent = this._eventEmitterService.customers.subscribe((res:any) => {
      this.closeCustomerMasterModal(res);
      this.setZIndex();
      this._cdr.detectChanges();
    });

    this.setInitialOrganizationLevels();
    this.getProjectCategory();
    this.getProjectType();
    this.getProjectStatus()
    this.getCustomers();
    this.getUsers();
    this.getLocations();
    this.getParentProjects();
    this.initTriggerChange();
  }

  ngOnChanges() {
    this.triggerChanges$.next(); // observable to handle multiple changes as we have multiple input properties
  }

  /**
   * To debounce to prevent multiple changes ngOnChanges Multiple times
   */
  initTriggerChange() {
    this.triggerChanges$.pipe(debounceTime(200), map(() => {
      this.initForm();
      this.setInitialOrganizationLevels();
      this.getProjectCategory();
      this.getProjectType();
      this.getProjectStatus()
      this.getCustomers();
      this.getUsers();
      this.getLocations();
      this.getParentProjects();
    })).subscribe();
  }

  initForm() {
    this.form = this._fb.group({
      profile_image: [''],
      title: [this.editData?.title || '', [Validators.required]],
      description: [this.editData?.description || '', [Validators.required]],
      customer_id: [this.editData?.customer_id || null, [Validators.required]],
      start_date: [this.editData?.start_date ? this._helperService.processDate(this.editData.start_date, 'split') : '', [Validators.required]],
      target_date: [this.editData?.target_date ? this._helperService.processDate(this.editData.target_date, 'split') : '', [Validators.required]],
      project_category_id: [this.editData?.project_category_id || null, [Validators.required]],
      project_type_id: [this.editData?.project_type_id || null, [Validators.required]],
      project_manager_id: [this.editData?.project_manager_id, [Validators.required]],
      project_id: [this.editData?.project_id || null, [Validators.required]],
      location_id: [this.editData?.location_id || null, [Validators.required]],
      project_status_id: [this.editData?.project_status_language_title ? ProjectStatusMasterStore.allItems.find(x => x?.project_status_language_title == this.editData?.project_status_language_title)?.id : null, [Validators.required]],
      organization_ids: [null, [Validators.required]],
      division_ids: [null, [Validators.required]],
      department_ids: [null, [Validators.required]],
      section_ids: [null, [Validators.required]],
      sub_section_ids: [null, [Validators.required]],
    })
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.popupType == 'EDIT') {
        save = this._projectManagementService.updateItem(this.editData.id, this.processSaveData());
      } else {
        delete this.form.value.id
        save = this._projectManagementService.saveItem(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this._router.navigateByUrl('/project-management/projects/' + res?.id);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  setInitialOrganizationLevels() {
    if (this.editData?.id) {
      this._pmInfoService.getSubProjectDetails(this.editData?.id).subscribe((res: ProjectManagementInfo) => {
        this.form.patchValue({
          division_ids: res?.divisions ? res?.divisions : [],
          department_ids: res?.departments ? res?.departments : [],
          section_ids: res?.sections ? res?.sections : [],
          sub_section_ids: res?.sub_sections ? res?.sub_sections : [],
          organization_ids: res?.organizations ? res?.organizations : [],
        });
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.form.patchValue({
        division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
        department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
        section_ids: AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
        sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
        organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
      });
      this._utilityService.detectChanges(this._cdr);
    }
  }


  processSaveData() {
    let form = JSON.parse(JSON.stringify(this.form.value));
    form.start_date = this._helperService.processDate(form.start_date, 'join')
    form.target_date = this._helperService.processDate(form.target_date, 'join');
    form['organization_ids'] = this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : [AuthStore.user?.organization.id];
    form['department_ids'] = this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id],
      form['division_ids'] = this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.division.id],
      form['section_ids'] = this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.section.id],
      form['sub_section_ids'] = this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
      form['is_system_project'] = 1;
    form['project_manager_id'] = this.form.value?.project_manager_id;
    form['image'] = {
      is_new: ProjectsStore.documentImage?.is_new || null,  
      name: ProjectsStore.documentImage?.name ? ProjectsStore.documentImage?.name : null,
      ext: ProjectsStore.documentImage?.ext ? ProjectsStore.documentImage?.ext : null,
      mime_type: ProjectsStore.documentImage?.mime_type ? ProjectsStore.documentImage?.mime_type : null,
      size: ProjectsStore.documentImage?.size ? ProjectsStore.documentImage?.size : null,
      url: ProjectsStore.documentImage?.url ? ProjectsStore.documentImage?.url : null,
      thumbnail_url: ProjectsStore.documentImage?.thumbnail_url ? ProjectsStore.documentImage?.thumbnail_url : null,
      token: ProjectsStore.documentImage?.token ? ProjectsStore.documentImage?.token : null,
    }
    return form;
  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }



  resetForm() {
    this.form.reset();
    this.formErrors = null;
  }

  closeModal(data?) {
    if (data) {
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids: data.department_ids ? data.department_ids : [],
        section_ids: data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  selectProjectType(type) {
    this.form.get('project_type_id').setValue(type);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }
  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') {
          ProjectsStore.logo_preview_available = true;
          this._cdr.detectChanges();
        }
        else
          ProjectsStore.project_preview_available = true;
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {

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
              let temp: any = uploadEvent['body'];

              temp['is_new'] = true;

              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                ProjectsStore.logo_preview_available = false;
                ProjectsStore.project_preview_available = false;


                this.createImageFromBlob(prew, temp, type);

              }, (error) => {
                let errorMessage = "";
                if (error.error?.errors?.hasOwnProperty('file'))
                  errorMessage = error.error.errors.file;
                else errorMessage = 'file_upload_failed';
                this._utilityService.showErrorMessage('Failed', errorMessage);
                ProjectsStore.logo_preview_available = false;
                ProjectsStore.project_preview_available = false;
                this.fileUploadProgress = 0;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
          ProjectsStore.logo_preview_available = false;
          ProjectsStore.project_preview_available = false;
          this._utilityService.detectChanges(this._cdr);
        })
      }
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  //GETS for ng-select
  getProjectCategory() {
    this._projectCategory.getItems(false, 'limit=1000').subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getProjectType() {
    this._projectTypeService.getItems(false, 'limit=1000').subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getProjectStatus() {
    this._projectStatusService.getItems(false, 'limit=1000').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getCustomers() {
    let defaultValue;
    if (this.editData?.customer_title) defaultValue = '&q=' + this.editData?.customer_title; //set default value as in case of edit
    this._customersService.getItems(false, defaultValue).subscribe(res => {
      if (this.editData?.customer_title) this.editData.customer_title = null; //clear default value
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getUsers(type?) {
    let defaultValue;
    if (this.editData?.project_manager_first_name) defaultValue = '?q=' + this.editData?.project_manager_first_name; //set default value as search
    this._userService
      .getAllItems(defaultValue)
      .subscribe((res) => {
        if (this.editData?.project_manager_first_name) this.editData.project_manager_first_name = null; //clear default value
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getLocations() {
    this._locationService
      .getAllItems()
      .subscribe((res) => {
        if (this.editData?.project_name) this.editData.project_name = null; //clear default value
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getParentProjects() {
    let defaultValue;
    if (this.editData?.project_name) defaultValue = 'q=' + this.editData?.project_name; //set default value as search
    this._projectManagementService.getItems(false, defaultValue).subscribe(res => {
      if (this.editData?.project_name) this.editData.project_name = null; //clear default value
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //Searches for ng-select
  searchProjectCategory(e) {
    this._projectCategory.getItems(false, 'q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchProjectType(e) {
    this._projectTypeService.getItems(false, 'q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchCustomers(e) {
    this._customersService.getItems(false, '&q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e) {
    this._locationService.getItems(false, '&q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchParentProjects(e) {
    this._projectManagementService.getItems(false, 'q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchUsers(e) {
    this._userService.getAllItems('?q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchProjectStatus(e) {
    this._projectStatusService.getItems(false, 'q=' + e.term).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }


  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._projectManagementService.setDocumentDetails(imageDetails, logo_url);
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

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  closeFormModal() {
    this.form.reset();
    this._projectManagementService.getItems(false, 'parent_id=1').subscribe();
    $(this.projectModal.nativeElement).modal('hide');
  }

  openProjectModal() {
    ProjectsStore.clearDocument();
    if (this.editData?.image) {
      let docurl = this._projectManagementService.getThumbnailPreview('project-management-list', this.editData?.image.token);
      let docDetails = {
        name: this.editData?.image?.name,
        ext: this.editData?.image?.ext,
        size: this.editData?.image?.size,
        url: this.editData?.image?.url,
        thumbnail_url: this.editData?.image?.thumbnail_url,
        token: this.editData?.image?.token,
        preview_url: this.editData?.image?.thumbnail_url
      };
      this._projectManagementService.setDocumentDetails(docDetails, docurl);
    }

    this.initForm();
    if (!this.form.get('division_ids').value) this.setInitialOrganizationLevels();
    $(this.projectModal.nativeElement).modal('show');
    this._cdr.detectChanges();
  }

  setZIndex() {
    this._renderer2.setStyle(this.projectModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.projectModal.nativeElement, 'overflow', 'auto');
  }

  searchSubsidiary(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  setNull(type) {
    switch (type) {
      case 'organization':
        this.form.patchValue({
          division_ids: null,
          department_ids: null,
          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'division':
        this.form.patchValue({

          department_ids: null,
          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'department':
        this.form.patchValue({

          section_ids: null,
          sub_section_ids: null
        })
        break;
      case 'section':
        this.form.patchValue({

          sub_section_ids: null
        })
        break;


    }
  }

  getPlaceholder(type) {
    switch (type) {
      case 'organization':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_organizations') : this._helperService.translateToUserLanguage('select_organization');
        break;
      case 'branch':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_branches') : this._helperService.translateToUserLanguage('select_branch');
        break;
      case 'division':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_divisions') : this._helperService.translateToUserLanguage('select_division');
        break;
      case 'department':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_departments') : this._helperService.translateToUserLanguage('select_department');
        break;
      case 'section':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_sections') : this._helperService.translateToUserLanguage('select_section');
        break;
      case 'sub_section':
        return OrganizationalSettingsStore.isMultiple ? this._helperService.translateToUserLanguage('select_sub_sections') : this._helperService.translateToUserLanguage('select_sub_section');
        break;
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  removeDocument() {
    if (ProjectsStore.documentImage != null) {
      ProjectsStore.unsetDocumentImageDetails();
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeCategoryMasterModal(id?) {
    if (id) this.form.get('project_category_id').setValue(id);
    this.getProjectCategory();
    $(this.categoryMasterModal.nativeElement).modal('hide');
    this.projectCategoryObject.type = null;
  }

  closeLocationMasterModal(id?) {
    if(id) this.form.get('location_id').setValue(id);
    this.getLocations();
    $(this.locationMasterModal.nativeElement).modal('hide')
    this.locationObject.type = null;
  }

  closeCustomerMasterModal(res) {
    if(res) this.form.get('customer_id').setValue(res?.id);
    this.searchCustomers({term:res?.title});
    $(this.customerModal.nativeElement).modal('hide');
    this.customerObject.type = null;
  }

  openCategoryMasterModal() {
    this.projectCategoryObject.type = 'Add';
    this.projectCategoryObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.categoryMasterModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 50);
  }

  openLocationMasterModal() {
    this.locationObject.type = 'Add';
    this.locationObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.locationMasterModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 50);
  }

  openCustomerModal() {
    this.customerObject.type = 'Add';
    this.customerObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.customerModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 50);
  }




  ngOnDestroy() {
    this.fileUploadPopupSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.projectCategorySubscriptionEvent.unsubscribe();
    this.projectLocationSubscriptionEvent.unsubscribe();
    this.customerSubscriptionEvent.unsubscribe();
    this.triggerChanges$.unsubscribe();
  }

}
