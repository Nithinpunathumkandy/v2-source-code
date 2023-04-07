import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { AddUserService } from 'src/app/core/services/human-capital/user/add-user/add-user.service';
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { ActivatedRoute, Router } from '@angular/router';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { AclStore } from 'src/app/stores/acl/acl.store';
import { AclService } from "src/app/core/services/acl/acl.service";
import { AppStore } from 'src/app/stores/app.store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { CountryMasterStore } from 'src/app/stores/masters/general/country-store';
import { CountryService } from 'src/app/core/services/masters/general/country/country.service';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationSettingsService } from "src/app/core/services/settings/organization_settings/organization-settings.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { UserAclService } from 'src/app/core/services/human-capital/user/user-setting/user-acl/user-acl.service';

declare var $: any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('codeInput') codeInput: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  regForm: FormGroup;
  formErrors: any;
  AddUserStore = AddUserStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AclStore = AclStore;
  UsersStore = UsersStore;
  DesignationMasterStore = DesignationMasterStore;
  AuditCategoryMasterStore = AuditCategoryMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  currentTab = 0;
  AppStore = AppStore;
  AuthStore = AuthStore;
  fileUploadProgress = 0;
  isActiveUser: boolean = true;
  roleChanged: boolean = false;
  // auditor = false;
  topUser = false;
  selected_role = [];
  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  };
  togglePassword: boolean = false;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
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
  showData = { subsidiary: '', branch: '', division: '', department: '', section: '', subsection: '', designation: '', country: '' };

  cancelEventSubscription: any;
  roles = [];
  designationEventSubscription: any;
  CountryMasterStore = CountryMasterStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  formObject = {
    0: [
      'first_name', 'last_name', 'email', 'mobile', 'organization_id',
      'branch_id', 'department_id', 'division_id', 'section_id', 'sub_section_id',
      'designation_id', 'password', 'password_confirm',
    ],
    1: [
      'addresses', 'address', 'street', 'state', 'city', 'country_id',
      'zip', 'contact', 'relative_name', 'relationship', 'relative_mobile', 'relative_address',
    ],
    2: [
      'role_ids'
    ]
  }
  showForm: boolean = false;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _addUserService: AddUserService,
    private _subsidiaryService: SubsidiaryService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _aclService: AclService,
    private _usersService: UsersService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _designationService: DesignationService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _helperService: HelperServiceService,
    private _countryService: CountryService,
    private _auditCategoryService: AuditCategoriesService,
    private route: ActivatedRoute, private _organizationSettingsService: OrganizationSettingsService,
    private _userAclService: UserAclService) { }

  ngOnInit() {
    this.designationEventSubscription = this._eventEmitterService.designationControl.subscribe(res => {
      this.closeFormModal();
    })
    AddUserStore.clearImageDetails();
    AddUserStore.clearPreviewDetails();

    this.getEditId();

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.regForm = this._formBuilder.group({
      id: [''],
      image: [''],
      first_name: ['', [Validators.required, Validators.maxLength(500)]],
      last_name: ['', [Validators.required, Validators.maxLength(500)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      personal_email: ['', [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      mobile: [''],//,[Validators.pattern("^[0-9]*$")]
      office_number: [''],
      organization_id: [null],
      branch_id: [null],
      department_id: [null],
      division_id: [null],
      section_id: [null],
      sub_section_id: [null],
      designation_id: [null, [Validators.required]],
      password: [''],
      password_confirm: [''],
      addresses: ['', [Validators.maxLength(255)]],
      address: [''],
      street: [''],
      state: [''],
      city: [''],
      country_id: [null],
      zip: [''],
      contact: [''],
      relative_name: [''],
      relationship: [''],
      relative_mobile: [''],
      relative_address: [''],
      role_ids: ['', [Validators.required]],
      is_auditor: [''],
      is_top_user: [''],
      user_id: [null],
      // audit_category_ids: [[]],
      is_send_detail: [''],
      is_send_welcome: [''],
      license_key: ['', [Validators.required]],
      date_of_birth: [null],
      national_insurance_number: [''],
      joining_date: [null],
      leaving_date: [null],
    });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
      this.regForm.controls['organization_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
      this.regForm.controls['department_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
      this.regForm.controls['branch_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.regForm.controls['division_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.regForm.controls['section_id'].setValidators(Validators.required);
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.regForm.controls['sub_section_id'].setValidators(Validators.required);

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/human-capital/users' },
    ]);


    window.addEventListener('scroll', this.scrollEvent, true);


    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelUser(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.checkOrganizationSettings();
    if (AddUserStore.editFlag == true) {
      // this.regForm.controls['password_confirm'].setValidators(null);
      // this.regForm.controls['password'].setValidators(null);
      // this.regForm.updateValueAndValidity();
    } else {
      this.regForm.controls['password_confirm'].setValidators([Validators.required, Validators.minLength(9)]);
      this.regForm.controls['password'].setValidators([Validators.required, Validators.minLength(9)]);
      let autogenPassword = this.generatePassword(12);
      this.regForm.controls['password_confirm'].setValue(autogenPassword);
      this.regForm.controls['password'].setValue(autogenPassword);
      this.getSubsidiary();
      this.regForm.patchValue({ organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization?.id : null });
    }

    this.editUser();

    if(!AddUserStore.editFlag)this.rolePageChange(1);

    // this._aclService.getItems().subscribe();

    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);

    }, 250);

  }

  checkOrganizationSettings() {
    if (OrganizationGeneralSettingsStore.organizationSettings) {
      if (!OrganizationGeneralSettingsStore.organizationSettings.is_user_license_activation) this.regForm.controls['license_key'].setValidators(null);
      this.showForm = true;
      this._utilityService.detectChanges(this._cdr);
    }
    else {
      this._organizationSettingsService.getOrganizationSettings().subscribe(res => {
        if (!res.is_user_license_activation) this.regForm.controls['license_key'].setValidators(null);
        this.showForm = true;
        this._utilityService.detectChanges(this._cdr);
      })
    }
    this._utilityService.detectChanges(this._cdr);
  }

  generatePassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    // var sybolsChars = "`!@#$%^&*()_-+={[}]|\:;'<,>.?/";
    var sybolsChars = "@!$#%";
    var allChars = numberChars + upperChars + lowerChars + sybolsChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = sybolsChars;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return this.shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }


  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  rolePageChange(newPage: number = 1 ) {
    if (newPage) AclStore.setCurrentPage(newPage);
    this._aclService.getItems(false, this.isActiveUser ? '': 'type=passive-user').subscribe(res => {
      if (!this.isActiveUser) {
        this.selected_role = res.data
      }
      this._utilityService.detectChanges(this._cdr);
      // setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  getEditId() {
    let id: number;
    this.route.params.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        id = +params['id']; // (+) converts string 'id' to a number
        // In a real app: dispatch action to load the details here.
        if (id != null) {
          this._usersService.saveUserId(id);
          this.AddUserStore.editFlag = true;

        }
      }
      else {
        AddUserStore.editFlag = false;
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getUsers() {
    var params = '';
    if (this.regForm.value.id) {
      params = params ? params + '&exclude=' + this.regForm.value.id : params + '?exclude=' + this.regForm.value.id;
    }
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUers(e) {
    let params = '';
    if (this.regForm.value.id)
      params = params + '&exclude=' + this.regForm.value.id;
    this._usersService.searchUsers('?q=' + e?.term + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditCategory() {
    this._auditCategoryService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchAuditCategory(e) {
    this._auditCategoryService.getItems(false, 'q=' + e?.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  editUser() {
    if (AddUserStore.editFlag == true) {
      this._usersService.getItemById(UsersStore.user_id).subscribe(res => {
        var userDetails = res;
        if (userDetails.hasOwnProperty('image_token') && userDetails['image_token']) {
          var purl = this._humanCapitalService.getThumbnailPreview('user-profile-picture', userDetails.image_token);
          var lDetails = {
            name: userDetails['image_title'],
            ext: userDetails['image_ext'],
            size: userDetails['image_size'],
            url: userDetails['image_url'],
            token: userDetails['image_token'],
            preview: purl
          };

          this._addUserService.setImageDetails(lDetails, purl);
        }
        this.setRegFormValues();
        this._utilityService.detectChanges(this._cdr);

        // if (UsersStore.individualUser.user_id)
        //   this.searchUers({ term: UsersStore.individualUser.user_id });
        if (AuthStore.userPermissionsLoaded) {
          if (UsersStore.individualUser.department) this.searchDepartment({ term: UsersStore.individualUser.department?.id }, true);
          if (UsersStore.individualUser.division) this.searchDivision({ term: UsersStore.individualUser.division?.id }, true);
          if (UsersStore.individualUser.section) this.searchSection({ term: UsersStore.individualUser.section?.id }, true);
          if (UsersStore.individualUser.sub_section) this.searchSubSection({ term: UsersStore.individualUser.sub_section?.id }, true);
          if (UsersStore.individualUser.organization) this.searchSubsidiary({ term: UsersStore.individualUser.organization.id }, true);
          if (UsersStore.individualUser.branch) this.searchBranch({ term: UsersStore.individualUser.branch?.id }, true);
        }
        else {
          this._userAclService.getUserActivityPermissions().subscribe(res => {
            setTimeout(() => {
              if (UsersStore.individualUser.department) this.searchDepartment({ term: UsersStore.individualUser.department?.id }, true);
              if (UsersStore.individualUser.division) this.searchDivision({ term: UsersStore.individualUser.division?.id }, true);
              if (UsersStore.individualUser.section) this.searchSection({ term: UsersStore.individualUser.section?.id }, true);
              if (UsersStore.individualUser.sub_section) this.searchSubSection({ term: UsersStore.individualUser.sub_section?.id }, true);
              if (UsersStore.individualUser.organization) this.searchSubsidiary({ term: UsersStore.individualUser.organization.id }, true);
              if (UsersStore.individualUser.branch) this.searchBranch({ term: UsersStore.individualUser.branch?.id }, true);
            }, 100);
          })
        }
        if (UsersStore.individualUser.user_id) this.getUser(UsersStore.individualUser.user_id)
        if (UsersStore.individualUser.designation) this.searchDesignation({ term: UsersStore.individualUser.designation?.id }, true);
        if (UsersStore.contactAddress && UsersStore.contactAddress.country) this.searchCountry({ term: UsersStore.contactAddress?.country?.id }, true)
        this.getAuditCategory();
      })
    }
  }

  setRegFormValues() {
    this.regForm.patchValue({
      id: UsersStore.user_id,
      image: '',
      first_name: UsersStore.individualUser.name ? UsersStore.individualUser.name : '',
      last_name: UsersStore.individualUser.last_name ? UsersStore.individualUser.last_name : '',
      email: UsersStore.individualUser.email ? UsersStore.individualUser.email : '',
      personal_email: UsersStore.individualUser.personal_email ? UsersStore.individualUser.personal_email : '',
      mobile: UsersStore.individualUser.mobile ? UsersStore.individualUser.mobile : '',
      office_number: UsersStore.individualUser.office_number ? UsersStore.individualUser.office_number : '',
      organization_id: UsersStore.individualUser.organization ? UsersStore.individualUser.organization.id : null,
      branch_id: UsersStore.individualUser.branch ? UsersStore.individualUser.branch.id : null,
      department_id: UsersStore.individualUser.department ? UsersStore.individualUser.department.id : null,
      division_id: UsersStore.individualUser.division ? UsersStore.individualUser.division.id : null,
      section_id: UsersStore.individualUser.section ? UsersStore.individualUser.section.id : null,
      sub_section_id: UsersStore.individualUser.sub_section ? UsersStore.individualUser.sub_section.id : null,
      designation_id: UsersStore.individualUser.designation ? UsersStore.individualUser.designation.id : null,
      address: UsersStore.contactAddress ? UsersStore.contactAddress.address : '',
      street: UsersStore.contactAddress ? UsersStore.contactAddress.street : '',
      state: UsersStore.contactAddress ? UsersStore.contactAddress.state : '',
      city: UsersStore.contactAddress ? UsersStore.contactAddress.city : '',
      zip: UsersStore.contactAddress ? UsersStore.contactAddress.zip : '',
      contact: UsersStore.contactAddress ? UsersStore.contactAddress.contact : '',
      country_id: UsersStore.contactAddress?.country ? UsersStore.contactAddress.country.id : null,
      relative_name: UsersStore.emergencyAddress?.relative_name ? UsersStore.emergencyAddress.relative_name : '',
      relationship: UsersStore.emergencyAddress?.relationship ? UsersStore.emergencyAddress.relationship : '',
      relative_mobile: UsersStore.emergencyAddress?.relative_mobile ? UsersStore.emergencyAddress.relative_mobile : '',
      relative_address: UsersStore.emergencyAddress?.address ? UsersStore.emergencyAddress.address : '',
      is_auditor: UsersStore.individualUser.is_auditor ? UsersStore.individualUser.is_auditor : '',
      is_top_user: UsersStore.individualUser.is_top_user ? UsersStore.individualUser.is_top_user : '',
      user_id: UsersStore.individualUser.user_id ? this.getUser(UsersStore.individualUser.user_id) : null,
      // audit_category_ids: this.auditCategory(UsersStore.individualUser.audit_categories),
      role_ids: this.selectRoles(),
      license_key: UsersStore.individualUser.user_license ? UsersStore.individualUser.user_license?.key : '',
      date_of_birth: this.UsersStore.individualUser.date_of_birth ? this._helperService.processDate(this.UsersStore.individualUser.date_of_birth, 'split') : null,
      national_insurance_number: UsersStore.individualUser.national_insurance_number ? UsersStore.individualUser.national_insurance_number : '',
      joining_date: this.UsersStore.individualUser.joining_date ? this._helperService.processDate(this.UsersStore.individualUser.joining_date, 'split') : null,
      leaving_date: this.UsersStore.individualUser.leaving_date ? this._helperService.processDate(this.UsersStore.individualUser.leaving_date, 'split') : null,

    });
    if(OrganizationGeneralSettingsStore.organizationSettings.is_user_license_activation){
      this.isActiveUser = UsersStore.individualUser.is_license_active == 1 ? true : false;
      if(this.isActiveUser) this.formObject[0].push('license_key')
    }
    this.rolePageChange(1)
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getUser(id) {
    this._usersService.searchUsers('?q=' + id).subscribe((res: any) => {
      for (let i of res['data']) {
        if (i.id == id) {
          this.regForm.patchValue({
            user_id: i
          })
          // return i;
        }
      }
    })
  }

  auditCategory(audit) {

    let auditCategories = [];
    for (let i of audit) {
      auditCategories.push(i.id);
    }
    return auditCategories;

  }

  setWelcome(event) {
    this.regForm.patchValue({
      is_send_welcome: event.target.checked
    })
  }

  // setDetail(event) {
  //   this.regForm.patchValue({
  //     is_send_detail: event.target.checked
  //   })
  // }

  setAuditor(event) {
    if (event.target.checked) {
      // this.auditor = true;
      this.regForm.patchValue({
        is_auditor: event.target.checked
      })
    }
    else {
      // this.auditor = false;
      this.regForm.patchValue({
        is_auditor: event.target.checked
      })
      // this.regForm.patchValue({audit_category_ids: null});
    }
    this._utilityService.detectChanges(this._cdr);
  }

  setTopUser(event) {
    this.regForm.patchValue({
      is_top_user: event.target.checked
    })
  }

  selectRoles() {
    let role = [];
    for (let i of UsersStore.individualUser.roles) {
      role.push(i.id);
      this.selected_role.push(i);
    }
    return role;
  }

  validatePassword() {
    this.formErrors = null;
    let value = { password: this.regForm.value.password }
    this._addUserService.validatePassword(value).subscribe(res => {
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
    });
  }
  roleTypeCheck(event, type) {
    AclStore.unsetAclRoleDetails();
    switch (type) {
      case 'is_active_user':
        if (event.target.checked) {
          this.isActiveUser = true;
          this.formObject[0].push('license_key')
          this.regForm.patchValue({license_key: AddUserStore.editFlag ? ( UsersStore.individualUser.user_license ? UsersStore.individualUser.user_license?.key : '') : '' })
          this.formErrors = null;
        } else {
          this.isActiveUser = false;
          this.formObject[0].splice(this.formObject[0].indexOf('license_key'), 1);
        }
        break;

      case 'is_passive_user':
        if (event.target.checked) {
          this.isActiveUser = false;
          this.formObject[0].splice(this.formObject[0].indexOf('license_key'), 1);
          this.formErrors = null;
        } else {
          this.isActiveUser = true;
          this.formObject[0].push('license_key')
          this.regForm.patchValue({license_key: AddUserStore.editFlag ? ( UsersStore.individualUser.user_license ? UsersStore.individualUser.user_license?.key : '') : '' })
        }
        break;
    }
    
      this.selected_role = [];
      if (this.isActiveUser && AddUserStore.editFlag) this.selectRoles()
      
    
    this.rolePageChange(1)
  }
  
  roleChecked(role) {
    const index: number = this.selected_role.findIndex(e => e.id == role.id);
    if (index != -1) {
      return true
    }
  }

  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitForm();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (var i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
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

  scrollEvent = (event: any): void => {

      const number = event.target?.documentElement?.scrollTop;
      if(number > 50){
        this._renderer2.addClass(this.formSteps.nativeElement,'small');
        this._renderer2.addClass(this.navigationBar.nativeElement,'affix');
      }
      else{
        this._renderer2.removeClass(this.formSteps.nativeElement,'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement,'affix');
      }
  }

  //To get file details when selected
  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      if (type == 'logo') AddUserStore.logo_preview_available = true;
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
            let temp: any = uploadEvent['body'];
            temp['is_new'] = true;
            this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
              if (type == 'logo') {
                AddUserStore.logo_preview_available = false;
              }
              this.createImageFromBlob(prew, temp);
            }, (error) => {
              AddUserStore.logo_preview_available = false;
              this._utilityService.detectChanges(this._cdr);
            })
        }
      }, (error) => {
        this._utilityService.showErrorMessage('failed', 'file_upload_failed');
        AddUserStore.logo_preview_available = false;
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  createImageFromBlob(image: Blob, imageDetails) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;

      this._addUserService.setImageDetails(imageDetails, logo_url);

      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  /**
   * cancel modal
   * @param status - decision to cancel
   */
  cancelUser(status) {
    setTimeout(() => {
    if (status) {

      this._router.navigateByUrl('human-capital/users');
      AppStore.disableLoading();
      this.clearCancelObject();
    }
    else {
      this.clearCancelObject();
    }
  }, 250);
    // setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    // }, 250);
  }

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';

  }



  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel User Creation?';
    this.cancelObject.subtitle = 'are_you_sure_cancel';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  //save or update the user from here
  submitForm() {
    let save;
    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";
    if (this.selected_role.length > 0) {
      let roles = [];
      for (let i of this.selected_role) {
        roles.push(i.id)
      }
      this.regForm.patchValue({
        role_ids: roles
      })
    }

    if (this.regForm.value.id) {
      save = this._addUserService.updateItem(this.regForm.value.id, this.processFormValues('update'));
    } else {
      this.regForm.removeControl('id');
      save = this._addUserService.saveItem(this.processFormValues('update'));
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      UsersStore.designation_id = this.regForm.value.designation_id;
      if (AddUserStore.editFlag) {
        AddUserStore.unsetEditFlag();
      }
      this._utilityService.detectChanges(this._cdr);
      this._router.navigateByUrl('human-capital/users/' + res.id);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        if (!this.formErrors) this._utilityService.showErrorMessage('error', err.error.message);
        this.currentTab = 0;
        this.nextButtonText = "Next";
        this.previousButtonText = "Previous";
        this.setInitialTab();
        this.showTab(this.currentTab);
      }
      // else if(err.status == 500 || err.status==404){
      //   this.closeFormModal();
      //   AppStore.disableLoading();
      // }
      else {
        this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  processFormValues(type) {
    var formObject = {
      id: this.regForm.value.id,
      image: this.regForm.value.image ? this.regForm.value.image : null,
      first_name: this.regForm.value.first_name ? this.regForm.value.first_name : '',
      last_name: this.regForm.value.last_name ? this.regForm.value.last_name : '',
      email: this.regForm.value.email ? this.regForm.value.email : '',
      personal_email: this.regForm.value.personal_email ? this.regForm.value.personal_email : '',
      mobile: this.regForm.value.mobile ? this.regForm.value.mobile : '',
      office_number: this.regForm.value.office_number ? this.regForm.value.office_number : '',
      organization_id: this.regForm.value.organization_id ? this.regForm.value.organization_id : '',
      branch_id: this.regForm.value.branch_id ? this.regForm.value.branch_id : '',
      department_id: this.regForm.value.department_id ? this.regForm.value.department_id : '',
      division_id: this.regForm.value.division_id ? this.regForm.value.division_id : '',
      section_id: this.regForm.value.section_id ? this.regForm.value.section_id : '',
      sub_section_id: this.regForm.value.sub_section_id ? this.regForm.value.sub_section_id : '',
      designation_id: this.regForm.value.designation_id ? this.regForm.value.designation_id : '',
      password: this.regForm.value.password ? this.regForm.value.password : '',
      password_confirm: this.regForm.value.password_confirm ? this.regForm.value.password_confirm : '',
      addresses: this.regForm.value.addresses ? this.regForm.value.addresses : '',
      address: this.regForm.value.address ? this.regForm.value.address : '',
      street: this.regForm.value.street ? this.regForm.value.street : '',
      state: this.regForm.value.state ? this.regForm.value.state : '',
      city: this.regForm.value.city ? this.regForm.value.city : '',
      country_id: this.regForm.value.country_id ? this.regForm.value.country_id : '',
      zip: this.regForm.value.zip ? this.regForm.value.zip : '',
      contact: this.regForm.value.contact ? this.regForm.value.contact : '',
      relative_name: this.regForm.value.relative_name ? this.regForm.value.relative_name : '',
      relationship: this.regForm.value.relationship ? this.regForm.value.relationship : '',
      relative_mobile: this.regForm.value.relative_mobile ? this.regForm.value.relative_mobile : '',
      relative_address: this.regForm.value.relative_address ? this.regForm.value.relative_address : '',
      role_ids: this.regForm.value.role_ids ? this.regForm.value.role_ids : [],
      is_auditor: this.regForm.value.is_auditor ? this.regForm.value.is_auditor : false,
      is_top_user: this.regForm.value.is_top_user ? this.regForm.value.is_top_user : false,
      user_id: this.regForm.value.user_id ? this.regForm.value.user_id.id : '',
      // audit_category_ids: this.regForm.value.audit_category_ids ? this.regForm.value.audit_category_ids : [],
      //is_send_detail: this.regForm.value.is_send_detail ? this.regForm.value.is_send_detail : false,
      is_send_welcome: this.regForm.value.is_send_welcome ? this.regForm.value.is_send_welcome : false,
      license_key: this.regForm.value.license_key ? this.regForm.value.license_key : '',
      date_of_birth: this.regForm.value.date_of_birth ? this._helperService.processDate(this.regForm.value.date_of_birth, 'join') : '',
      national_insurance_number: this.regForm.value.national_insurance_number ? this.regForm.value.national_insurance_number : '',
      joining_date: this.regForm.value.joining_date ? this._helperService.processDate(this.regForm.value.joining_date, 'join') : '',
      leaving_date: this.regForm.value.leaving_date ? this._helperService.processDate(this.regForm.value.leaving_date, 'join') : '',
      is_license_active: this.isActiveUser ? 1 : 0,
    };
    if (type == 'new') {
      delete formObject.id
    }
    if (!AddUserStore.editFlag && !this.isActiveUser) {
      delete formObject.license_key
    }
    if (!OrganizationGeneralSettingsStore.organizationSettings.is_user_license_activation) delete formObject.license_key;
    // if (!formObject.department_id) delete formObject.department_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_branch) delete formObject.branch_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_division) delete formObject.division_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_section) delete formObject.section_id;
    if (!OrganizationLevelSettingsStore.organizationLevelSettings.is_sub_section) delete formObject.sub_section_id;

    return formObject;
  }


  setValuesToShow(type, title) {
    //console.log(type,title)
    this.handleDropDownClear(type);
    switch (type) {
      case 'subsidiary':
        this.searchSubsidiary(title, true)
        this.getDivision()

        // this.showData.subsidiary =title;
        // console.log(this.showData.subsidiary); 
        break;
      case 'branch':
        this.searchBranch(title, true)
        break;
      case 'division':
        this.searchDivision(title, true)
        this.getDepartment()
        break;
      case 'department':
        this.searchDepartment(title, true)
        this.getSection()
        break;
      case 'section':
        this.searchSection(title, true)
        this.getSubSection()
        break;
      case 'subsection':
        this.searchSubSection(title, true)
        break;
      case 'designation':
        this.searchDesignation(title, true)
        break;
      case 'country':
        this.searchCountry(title, true)
        break;
    }

  }

  //setting form values
  getSelectedValues() {

    // if (this.regForm.value.user_id) {
    //   this._usersService.getItem('/' + this.regForm.value.user_id).subscribe(response => {
    //     this.reportingUser = response;
    //     this._utilityService.detectChanges(this._cdr);
    //     // console.log(this.reportingUser);
    //   })
    // }

    if (!this.regForm.value.is_auditor) {
      this.regForm.patchValue({
        is_auditor: false
      })
    }
    if (!this.regForm.value.is_top_user) {
      this.regForm.patchValue({
        is_top_user: false
      })
    }

    if (this.roleChanged) {
      this.regForm.patchValue({
        role_ids: AclStore.selectedRole
      })
    }

    if (AddUserStore.getProductImageDetails) {
      this.regForm.patchValue({
        image: AddUserStore.getProductImageDetails
      })
    }
    AclStore.unsetSelectedRole();
    this.getAddress();
  }

  toggleFieldTextType() {
    this.togglePassword = !this.togglePassword;
  }

  removeDocument() {
    AddUserStore.unsetImageDetails();
    this._utilityService.detectChanges(this._cdr);
  }

  //converting address into the format to be passed
  getAddress() {
    let address = {
      "contact": {
        address: this.regForm.value.address,
        street: this.regForm.value.street,
        state: this.regForm.value.state,
        city: this.regForm.value.city,
        country: this.regForm.value.country,
        zip: this.regForm.value.zip,
        contact: this.regForm.value.contact,
        country_id: this.regForm.value.country_id
      },
      "emergency": {
        relative_name: this.regForm.value.relative_name,
        relationship: this.regForm.value.relationship,
        address: this.regForm.value.relative_address,
        relative_mobile: this.regForm.value.relative_mobile
      }
    }
    this.regForm.patchValue({
      addresses: address
    });

  }

  getRoles(role) {
    let selected: boolean = false;

    this.roleChanged = true;
    for (let i of this.selected_role) {
      if (i.id == role.id) {
        selected = true;
        break;
      }
    }
    if (selected != true) {
      this.selected_role.push(role);
    }
    else {
      const index: number = this.selected_role.findIndex(e => e.id == role.id);
      this.selected_role.splice(index, 1);
    }
  }

  isSuperAdmin(){
    let temp:boolean = true
    if(AddUserStore.editFlag){
      const index =  UsersStore.individualUser?.roles.findIndex(i => i.type=='super-admin')
      if(index!=-1 && UsersStore.individualUser?.designation?.is_super_admin) temp = false
    }
    return temp
  }
  
  openFormModal() {
    this.formErrors = null;
    AppStore.disableLoading();
    $(this.formModal.nativeElement).modal('show');
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    if (DesignationMasterStore.lastInsertedId) {
      this.regForm.patchValue({
        designation_id: DesignationMasterStore.lastInsertedId
      })

      let id = DesignationMasterStore.lastInsertedId;
      this.searchDesignation({ term: id });
      DesignationMasterStore.lastInsertedId = null;

    }
  }

  searchSubsidiary(e, formValue: boolean = false) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + (e?.term ? e?.term : e)).subscribe(res => {
        if (formValue) {
          const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
          if (index != -1) {
            this.showData.subsidiary = res['data'][index].title
          }
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe(res => {
      if (!OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary) {
        this.regForm.patchValue({ organization_id: res['data'][0].id });
      }

      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchBranch(e, formValue: boolean = false) {
    this._branchService.searchBranch('?organization_ids=' + this.regForm.value.organization_id + '&q=' + (e?.term ? e?.term : e)).subscribe(res => {
      if (formValue) {
        const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
        if (index != -1) {
          this.showData.branch = res['data'][index].title
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBranch() {
    if (this.regForm.get('organization_id').value) {
      this._branchService.getAllItems(false, '?access_all=true&is_full_list=true&organization_ids=' + this.regForm.value.organization_id).subscribe(res => {

        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this._branchService.getAllItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    
  }

  /**
   * Search Division
   * @param e e.term - character to search
   */
  searchDivision(e, formValue: boolean = false) {
    if (this.regForm.get('organization_id').value) {
      this._divisionService.getItems(false, '&organization_ids=' + this.regForm.value.organization_id + '&q=' + (e?.term ? e?.term : e)).subscribe(res => {
        if (formValue) {
          const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
          if (index != -1) {
            this.showData.division = res['data'][index].title
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Division
  getDivision() {
    if (this.regForm.get('organization_id').value) {
      this._divisionService.getItems(false, '&organization_ids=' + this.regForm.value.organization_id).subscribe(res => {

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
  searchDepartment(e, formValue: boolean = false) {
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
      this._departmentService.getItems(false, params + '&q=' + (e?.term ? e?.term : e)).subscribe(res => {
        if (formValue) {
          const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
          if (index != -1) {
            this.showData.department = res['data'][index].title
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Department
  getDepartment() {
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id;
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
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
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
      if (this.regForm.value.department_id)
        params += '&department_ids=' + this.regForm.value.department_id
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
  searchSection(e, formValue: boolean = false) {
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
      if (this.regForm.value.department_id)
        params += '&department_ids=' + this.regForm.value.department_id
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + (e?.term ? e?.term : e)).subscribe(res => {
        if (formValue) {
          const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
          if (index != -1) {
            this.showData.section = res['data'][index].title
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Sub Section
  getSubSection() {
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
      if (this.regForm.value.department_id)
        params += '&department_ids=' + this.regForm.value.department_id;
      if (this.regForm.value.section_id)
        params += '&section_ids=' + this.regForm.value.section_id
      this._subSectionService.getItems(false, params).subscribe(res => {
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
  searchSubSection(e, formValue: boolean = false) {
    if (this.regForm.get('organization_id').value) {
      var params = '';
      params = '&organization_ids=' + this.regForm.value.organization_id
      if (this.regForm.value.division_id)
        params += '&division_ids=' + this.regForm.value.division_id;
      if (this.regForm.value.department_id)
        params += '&department_ids=' + this.regForm.value.department_id;
      if (this.regForm.value.section_id)
        params += '&section_ids=' + this.regForm.value.section_id;
      this._subSectionService.getItems(false, params + '&q=' + (e?.term ? e?.term : e)).subscribe(res => {
        if (formValue) {
          const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
          if (index != -1) {
            this.showData.subsection = res['data'][index].title
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  handleDropDownClear(type) {
    switch (type) {
      case 'organization_id': this.regForm.controls['division_id'].reset();
        this.regForm.controls['department_id'].reset();
        this.regForm.controls['section_id'].reset();
        this.regForm.controls['sub_section_id'].reset();

        break;
      case 'division_id': this.regForm.controls['department_id'].reset();
        this.regForm.controls['section_id'].reset();
        this.regForm.controls['sub_section_id'].reset();

        break;
      case 'department_id': this.regForm.controls['section_id'].reset();
        this.regForm.controls['sub_section_id'].reset();

        break;
      case 'section_id': this.regForm.controls['sub_section_id'].reset();

        break;

      default: '';
        break;
    }
  }


  getDesignation() {
    this._designationService.getItems(false, 'access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDesignation(e, formValue: boolean = false) {

    this._designationService.getItems(false, 'q=' + (e?.term ? e?.term : e)).subscribe(res => {
      if (formValue) {
        const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
        if (index != -1) {
          this.showData.designation = res['data'][index].title
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCountry() {
    this._countryService.getItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCountry(e, formValue: boolean = false) {
    this._countryService.getItems(false, '&access_all=true&is_full_list=true&q=' + (e?.term ? e?.term : e)).subscribe(res => {
      if (formValue) {
        const index: number = res['data'].findIndex(r => r.id == (e?.term ? e?.term : e));
        if (index != -1) {
          this.showData.country = res['data'][index].title
        }
      }
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

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  getPopupDetails(user) {
    // console.log(user);

    // $('.modal-backdrop').remove();
    this.userDetailObject.first_name = user.first_name;
    this.userDetailObject.last_name = user.last_name;
    this.userDetailObject.designation = user.designation_title;
    this.userDetailObject.image_token = user.image_token;
    this.userDetailObject.email = user.email;
    this.userDetailObject.mobile = user.mobile;
    this.userDetailObject.id = user.id;
    this.userDetailObject.department = user.department ? user.department : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {

      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {

          if (this.currentTab == 2) {
            if (this.selected_role.length)
              setValid = true;
            else
              setValid = false;
          } else {
            if (!this.regForm.controls[i].valid) {
              setValid = false;
              break;
            }
          }

        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (this.currentTab == 2) {
              if (this.selected_role.length)
                setValid = true;
              else
                setValid = false;
            } else {
              if (!this.regForm.controls[k].valid) {
                setValid = false;
                break;
              }
            }
          }
        }
      }
    }

    return setValid;
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    window.addEventListener('scroll', this.scrollEvent, null);
    AddUserStore.unsetImageDetails();
    AddUserStore.unsetEditFlag();
    this.regForm.reset();
    this.designationEventSubscription.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
