import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵangular_packages_forms_forms_b } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ComplianceSectionService } from 'src/app/core/services/masters/compliance-management/compliance-section/compliance-section.service';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { SlaCategoryService } from 'src/app/core/services/masters/compliance-management/sla-category/sla-category.service';
import { SlaCategoryMasterStore } from 'src/app/stores/masters/compliance-management/sla-category-store';
import { SlaCategoryPaginationResponse } from 'src/app/core/models/masters/compliance-management/sla-category';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";
import { OrganizationproductsService } from 'src/app/core/services/organization/business_profile/products/organizationproducts.service';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
declare var $: any;

@Component({
  selector: 'app-sla-contract-model',
  templateUrl: './sla-contract-model.component.html',
  styleUrls: ['./sla-contract-model.component.scss']
})
export class SlaContractModelComponent implements OnInit {

  @Input('source') formObject: any;
  @ViewChild('categoryFormModal', { static: true }) categoryFormModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  SLAContractStore = SLAContractStore;
  DivisionStore = DivisionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore
  SlaCategoryMasterStore = SlaCategoryMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  UsersStore = UsersStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BranchesStore = BranchesStore;
  BusinessProductsStore = BusinessProductsStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  controlSlaCategorySubscriptionEvent: any;

  slaContractForm: FormGroup;
  formErrors: any;
  fileUploadProgress = 0;
  fileUploadsArray = []; // for multiple file uploads
  slaCategoryId: any;

  slaCategoryObject = {
    values: null,
    type: null
  };

  openModelPopup: boolean = false;
  organisationChangesModalSubscription: any = null;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UsersService,
    private _complianceSectionService: ComplianceSectionService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _subsidiaryService: SubsidiaryService,
    private _slaContractService: SlaContractService,
    private _slaCategoryService: SlaCategoryService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _orgProductService: OrganizationproductsService,
    private _complianceRegisterService: ComplianceRegisterService,
    private _branchesService: BranchService) { }

  ngOnInit(): void {

    OrganizationalSettingsStore.showBranch = true;

    this.slaContractForm = this._formBuilder.group({
      document_id: [null],
      description: [''],
      client: [''],
      title: [null, Validators.required],
      sla_category_id: [null, Validators.required],
      issue_date: ['', Validators.required],
      expiry_date: ['', Validators.required],
      organization_ids: [[], Validators.required],
      product_id: [null],
      division_ids: [[]],
      department_ids: [[], Validators.required],
      section_ids: [[]],
      sub_section_ids: [[]],
      branch_ids: [[]],
      compliance_responsible_user_ids: [null, Validators.required],
      contract_value: ['']
    });

    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    //   this.slaContractForm.controls['division_ids'].setValidators(Validators.required);
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    //   this.slaContractForm.controls['section_ids'].setValidators(Validators.required);
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    //   this.slaContractForm.controls['sub_section_ids'].setValidators(Validators.required);
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    //   this.slaContractForm.controls['branch_ids'].setValidators(Validators.required);

    this.getSLACategoryList();
    this.getProducts();
    if (this.formObject && this.formObject.hasOwnProperty('values') && this.formObject.values)
      this.setValue();

    if (this.formObject && this.formObject.hasOwnProperty('type') && this.formObject.type == 'Add')
      this.setInitialOrganizationLevels();

    this.controlSlaCategorySubscriptionEvent = this._eventEmitterService.slaCategory.subscribe(res => {
      this.closeSLACategory();
      this.changeZIndex();
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

  }

  // ngDoCheck(){
  //   if (this.formObject && this.formObject.hasOwnProperty('values') && this.formObject.values && !this.slaContractForm.value.id)
  //     this.setValue();
  // }

  getSLACategoryList() {
    this._slaCategoryService.getItems(false, null).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  documentTitleList() {
    this._complianceRegisterService.getItems(false, null).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setValue() {
    this.formErrors = null;
    this._slaContractService.getItem(this.formObject?.values?.id).subscribe(() => {
      let formValue = SLAContractStore?.slaContractDetails;
      let docValue = formValue?.versions[0];
      if (docValue.token != null) {
        let docurl = this._slaContractService.getThumbnailPreview('sla-contract-document', docValue.token);
        let docDetails = {
          name: docValue.title,
          ext: docValue.ext,
          size: docValue.size,
          url: docValue.url,
          thumbnail_url: docValue.url,
          token: docValue.token,
          preview_url: docurl,
          id: docValue.id
        };
        this._slaContractService.setDocumentImageDetails(docDetails, docurl);
      }
      this.slaContractForm.patchValue({
        document_id: formValue?.id ? formValue?.id : null,
        description: formValue?.description ? formValue?.description : null,
        client: formValue?.client ? formValue?.client : null,
        title: formValue?.title ? formValue?.title : null,
        sla_category_id: formValue?.sla_category?.id ? formValue?.sla_category?.id : null,
        product_id: formValue?.product?.id ? formValue?.product?.id : null,
        compliance_responsible_user_ids: formValue?.compliance_responsible_users ? this.getEditValue(formValue?.compliance_responsible_users) : [],
        issue_date: this.formObject?.values?.issue_date ? this._helperService.processDate(this.formObject?.values?.issue_date, 'split') : '',
        expiry_date: this.formObject?.values?.expiry_date ? this._helperService.processDate(this.formObject?.values?.expiry_date, 'split') : '',
        organization_ids: formValue?.organizations ? this.getEditValue(formValue?.organizations) : [],
        division_ids: formValue?.divisions ? this.getEditValue(formValue?.divisions) : [],
        department_ids: formValue?.departments ? this.getEditValue(formValue?.departments) : [],
        section_ids: formValue?.sections ? this.getEditValue(formValue?.sections) : [],
        sub_section_ids: formValue?.sub_sections ? this.getEditValue(formValue?.sub_sections) : [],
        branch_ids: formValue?.branches ? this.getEditValue(formValue?.branches) : [],
        contract_value: formValue?.contract_value ? formValue?.contract_value : ''
      })
    })
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i);
    }
    return returnValues;
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
      this.slaContractForm.patchValue({
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

  setInitialOrganizationLevels() {
    this.slaContractForm.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
      branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
    });
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
    //   this.slaContractForm.patchValue({ organization_ids: [AuthStore.user.organization] });
    // }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.slaContractForm.value.division_ids });
    this.searchDepartment({ term: this.slaContractForm.value.department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.slaContractForm.value.section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.slaContractForm.value.sub_section_ids });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({term: this.slaContractForm.value.branch_ids[0].id});
    this._utilityService.detectChanges(this._cdr);
  }

  // for resetting the form
  resetForm() {
    this.slaContractForm.reset();
    this.slaContractForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    SLAContractStore.clearDocument();
    this._eventEmitterService.dismissSLAContractModal();
    this._utilityService.detectChanges(this._cdr);
  }

  // getting compliance section
  getSections() {
    this._complianceSectionService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // getting master department
  getOrganization() {
    this._subsidiaryService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // search users
  searchUsers(e) {
    // this._userService.searchUsers('?q=' + e.term).subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })

    let params = '';
    if (this.slaContractForm.get('organization_ids').value) {
      params = '?organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      if (this.slaContractForm.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value);
      }
      if (this.slaContractForm.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value);
      }

      if (this.slaContractForm.get('section_ids').value) {
        if (params)
          params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value);
        else
          params = '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value);
      }

      this._userService.searchUsers(params + '&q=' + e.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
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

  // getting Responsible user
  // getResponsibleUsers() {
  //   this._userService.getAllItems().subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  getProducts() {
    this._orgProductService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchProduct(e) {
    this._orgProductService.getAllItems(true, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getResponsibleUsers() {
    let params = '';
    if (this.slaContractForm.get('organization_ids').value) {
      params = '?organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      if (this.slaContractForm.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value);
      }
      if (this.slaContractForm.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value);
      }

      if (this.slaContractForm.get('section_ids').value) {
        if (params)
          params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value);
        else
          params = '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value);
      }


      this._userService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      UsersStore.setAllUsers([]);
    }

  }

  searchDivision(e) {
    if (this.slaContractForm.get('organization_ids').value && this.slaContractForm.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this.slaContractForm.value.department_ids = [];
        this.DepartmentStore.setAllDepartment([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Division
  getDivision() {
    if (this.slaContractForm.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        this.slaContractForm.value.department_ids = [];
        this.DepartmentStore.setAllDepartment([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  // search master section
  searchOrganization(e) {
    this._subsidiaryService.searchSubsidiary('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  /**
  * Search Department
  * @param e e.term - character to search
  */
  searchDepartment(e) {
    if (this.slaContractForm.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this.SectionStore.setAllSection([]);
        this.slaContractForm.value.section_ids = [];
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Department
  getDepartment() {
    if (this.slaContractForm.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
      this._departmentService.getItems(false, params).subscribe(res => {
        this.SectionStore.setAllSection([]);
        this.slaContractForm.value.section_ids = [];
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  // Get Section
  getSection() {
    if (this.slaContractForm.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value)
      this._sectionService.getItems(false, params).subscribe(res => {
        this.slaContractForm.value.sub_section_ids = [];
        this.SubSectionStore.setAllSubSection([]);
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
    if (this.slaContractForm.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value)
      //let parameters = this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this.slaContractForm.value.sub_section_ids = [];
        this.SubSectionStore.setAllSubSection([]);
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // Get Sub Section
  getSubSection() {
    if (this.slaContractForm.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value)
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
  searchSubSection(e) {
    if (this.slaContractForm.get('organization_ids').value && this.slaContractForm.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.slaContractForm.get('section_ids').value)
      this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getBranches() {
    if (this.slaContractForm.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }

  searchBranches(e) {
    if (this.slaContractForm.get('organization_ids').value) {
      let parameters = this._helperService.createParameterFromArray(this.slaContractForm.get('organization_ids').value);
      this._branchesService.getAllItems(false, '?organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else {
      this.BranchesStore.clearBranchList();
    }
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image url
  getDefaultImage(type?) {
    return this._imageService.getDefaultImageUrl(type ? type : 'user-logo');
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  // scrollbar function
  checkForFileUploadsScrollbar() {
    // if (ComplianceRegisterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
    //   $(this.uploadArea.nativeElement).mCustomScrollbar();
    // }
    // else {
    //   $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    // }
  }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') SLAContractStore.logo_preview_available = true;
        else
          SLAContractStore.sla_preview_available = true;
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
              $("#file").val('');
              let temp: any = uploadEvent['body'];
              temp['is_new'] = true;
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                SLAContractStore.logo_preview_available = false;
                SLAContractStore.sla_preview_available = false;
                this.createImageFromBlob(prew, temp, type);
              }, (error) => {
                $("#file").val('');
                let errorMessage = "";
                if (error.error?.errors?.hasOwnProperty('file'))
                  errorMessage = error.error.errors.file;
                else errorMessage = 'file_upload_failed';
                this._utilityService.showErrorMessage('Failed', errorMessage);
                SLAContractStore.logo_preview_available = false;
                SLAContractStore.sla_preview_available = false;
                this.fileUploadProgress = 0;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          $("#file").val('');
          this._utilityService.showErrorMessage('Failed', 'file_upload_failed');
          SLAContractStore.logo_preview_available = false;
          SLAContractStore.sla_preview_available = false;
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        $("#file").val('');
        this.assignFileUploadProgress(null, file, true);
      }
    }
  }

  //   imageblob function
  //  createImageFromBlob(image: Blob, imageDetails, type) {
  //   let reader = new FileReader();
  //   reader.addEventListener("load", () => {
  //     var logo_url = reader.result;
  //     imageDetails['preview_url'] = logo_url;
  //     if (imageDetails != null)
  //       this._slaContractService.setDocumentDetails(imageDetails, type);
  //     this.checkForFileUploadsScrollbar();
  //     this._utilityService.detectChanges(this._cdr);
  //   }, false);
  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (type == 'logo') {
        this._slaContractService.setDocumentImageDetails(imageDetails, logo_url);
      }
      else {

        this._slaContractService.setDocumentImageDetails(imageDetails, logo_url, type);
        if (!this.slaContractForm.value.documents) {
          this.slaContractForm.patchValue({
            title: imageDetails.name
          })
        }
      }
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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  removeDocument() {
    if (SLAContractStore.documentImage != null) {
      SLAContractStore.unsetDocumentImageDetails();
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;

    if (this.slaContractForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.slaContractForm.value.document_id) {
        save = this._slaContractService.updateSLAContract(this.slaContractForm.value.document_id, this.processDataForSave());
      } else {
        delete this.slaContractForm.value.document_id
        save = this._slaContractService.saveSLAContract(this.processDataForSave());
      }

      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.slaContractForm.value.document_id) {
          this.resetForm();
          this.removeDocument();
          this.setInitialOrganizationLevels();
          this._utilityService.detectChanges(this._cdr);
          if (close) {
            SLAContractStore.sla_contract_id = res.id;
            this.closeFormModal();
            this.resetForm();
            this._router.navigateByUrl('/compliance-management/sla-and-contracts/' + SLAContractStore.sla_contract_id);
            this._utilityService.detectChanges(this._cdr);
          }
        }
        setTimeout(() => {
          if (close) {
            SLAContractStore.sla_contract_id = res.id;
            this.closeFormModal();
            this.resetForm();
            this._router.navigateByUrl('/compliance-management/sla-and-contracts/' + SLAContractStore.sla_contract_id);
            this._utilityService.detectChanges(this._cdr);
          }
        }, 300);
        this._utilityService.detectChanges(this._cdr);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          AppStore.disableLoading();
          this.formErrors = err.error.errors;
          this.processFormErrors();
        }
        else if (err.status == 500 || err.status == 404) {
          AppStore.disableLoading();
          this.closeFormModal();
          this.resetForm();
        }
        else {
          this._utilityService.showErrorMessage('Error', 'something_went_wrong_try_again');
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  processDataForSave() {

    let saveData = {
      document_id: this.slaContractForm.value?.document_id ? this.slaContractForm.value?.document_id : '',
      sla_category_id: this.slaContractForm.value.sla_category_id ? this.slaContractForm.value.sla_category_id : null,
      product_id: this.slaContractForm.value.product_id ? this.slaContractForm.value.product_id : null,
      client: this.slaContractForm.value.client ? this.slaContractForm.value.client : '',
      title: this.slaContractForm.value.title ? this.slaContractForm.value.title : '',
      compliance_responsible_user_ids: this.slaContractForm.value.compliance_responsible_user_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.compliance_responsible_user_ids, 'id') : [],
      description: this.slaContractForm.value.description ? this.slaContractForm.value.description : '',
      issue_date: this.slaContractForm.value.issue_date ? this._helperService.processDate(this.slaContractForm.value.issue_date, 'join') : '',
      expiry_date: this.slaContractForm.value.expiry_date ? this._helperService.processDate(this.slaContractForm.value.expiry_date, 'join') : '',
      organization_ids: this.slaContractForm.value.organization_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids: this.slaContractForm.value.division_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids: this.slaContractForm.value.department_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids: this.slaContractForm.value.section_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids: this.slaContractForm.value.sub_section_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
      branch_ids: this.slaContractForm.value.branch_ids ? this._helperService.getArrayProcessed(this.slaContractForm.value.branch_ids, 'id') : [AuthStore.user?.branch.id],
      name: SLAContractStore.documentImage?.name ? SLAContractStore.documentImage?.name : null,
      ext: SLAContractStore.documentImage?.ext ? SLAContractStore.documentImage?.ext : null,
      mime_type: SLAContractStore.documentImage?.mime_type ? SLAContractStore.documentImage?.mime_type : null,
      size: SLAContractStore.documentImage?.size ? SLAContractStore.documentImage?.size : null,
      url: SLAContractStore.documentImage?.url ? SLAContractStore.documentImage?.url : null,
      thumbnail_url: SLAContractStore.documentImage?.thumbnail_url ? SLAContractStore.documentImage?.thumbnail_url : null,
      token: SLAContractStore.documentImage?.token ? SLAContractStore.documentImage?.token : null,
      is_new: SLAContractStore.documentImage?.is_new ? SLAContractStore.documentImage?.is_new : false,
      is_deleted: SLAContractStore.documentImage?.is_deleted ? SLAContractStore.documentImage?.is_deleted : false,
      contract_value: this.slaContractForm.value?.contract_value ? this.slaContractForm.value?.contract_value : ''
    }

    return saveData;
  }

  addCategory() {
    SLAContractStore.sla_category_form_modal = true;
    this.slaCategoryObject.type = 'Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.categoryFormModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.categoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeSLACategory() {

    if (SlaCategoryMasterStore.lastInsertedId) {
      this.searchSLACategory({ term: SlaCategoryMasterStore.lastInsertedId }, true);
    }
    SLAContractStore.sla_category_form_modal = false;
    this.slaCategoryObject.type = null;

    this._renderer2.removeClass(this.categoryFormModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.categoryFormModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.categoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  searchSLACategory(e, patchValue: boolean = false) {
    this._slaCategoryService.getItems(false, '&q=' + e.term).subscribe((res: SlaCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.slaContractForm.patchValue({ sla_category_id: i.id });
            this.slaCategoryId = i.id;
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchsearchDocumentTitleList(e) {
    this._complianceRegisterService.getItems(false, '?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }



  changeZIndex() {
    if ($(this.categoryFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'overflow', 'auto');
    }
  }

  handleDropDownClear(type) {
    switch (type) {
      case 'organization_id': this.slaContractForm.controls['branch_ids'].reset()
        this.slaContractForm.controls['division_ids'].reset();
        this.slaContractForm.controls['department_ids'].reset();
        this.slaContractForm.controls['section_ids'].reset();
        this.slaContractForm.controls['sub_section_ids'].reset();
        this.slaContractForm.controls['compliance_responsible_user_ids'].reset();

        break;
      case 'division_id': this.slaContractForm.controls['department_ids'].reset();
        this.slaContractForm.controls['section_ids'].reset();
        this.slaContractForm.controls['sub_section_ids'].reset();
        this.slaContractForm.controls['compliance_responsible_user_ids'].reset();

        break;
      case 'department_id': this.slaContractForm.controls['section_ids'].reset();
        this.slaContractForm.controls['sub_section_ids'].reset();
        this.slaContractForm.controls['compliance_responsible_user_ids'].reset();

        break;
      case 'section_id': this.slaContractForm.controls['sub_section_ids'].reset();
        this.slaContractForm.controls['compliance_responsible_user_ids'].reset();

        break;
      case 'sub_section_id': this.slaContractForm.controls['compliance_responsible_user_ids'].reset();
        break;
      default: '';
        break;
    }
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
        this.checkResponsibleUser(event.value.id, type);

        break;
      case 'division_id': this.checkDepartment(event.value.id, type);

        break;
      case 'department_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
        this.checkSection(event.value.id, type);

        break;
      case 'section_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
        this.checkSubSection(event.value.id, type);

        break;
      case 'sub_section_id': this.checkResponsibleUser(event.value.id, type);

        break;
      default: '';
        break;
    }
  }

  checkDivision(organizationId: number, type: string) {
    let divisionValue: [] = this.slaContractForm.value.division_ids;
    for (var i = 0; i < divisionValue?.length; i++) {
      let divOrganizationId = divisionValue[i][type];
      if (organizationId == divOrganizationId) {
        divisionValue.splice(i, 1);
        i--;
      }
    }
    this.slaContractForm.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number, type: string) {
    let departmentValue: [] = this.slaContractForm.value.department_ids;
    for (var i = 0; i < departmentValue?.length; i++) {
      let deptDivisionId = departmentValue[i][type];
      if (divisionId == deptDivisionId) {
        if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
        departmentValue.splice(i, 1);
        i--;
      }
    }
    this.slaContractForm.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSection(departmentId: number, type: string) {
    let sectionValue: [] = this.slaContractForm.value.section_ids;
    for (var i = 0; i < sectionValue?.length; i++) {
      let sectionDepartmentId = sectionValue[i][type];
      if (departmentId == sectionDepartmentId) {
        if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
        sectionValue.splice(i, 1);
        i--;
      }
    }
    this.slaContractForm.controls['section_ids'].setValue(sectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSubSection(sectionId: number, type: string) {
    let subSectionValue: [] = this.slaContractForm.value.sub_section_ids;
    for (var i = 0; i < subSectionValue?.length; i++) {
      let subSectionSectionId = subSectionValue[i][type];
      if (sectionId == subSectionSectionId) {
        subSectionValue.splice(i, 1);
        i--;
      }
    }
    this.slaContractForm.controls['sub_section_ids'].setValue(subSectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkResponsibleUser(subSectionId: number, type: string) {
    let userValue: [] = this.slaContractForm.value.compliance_responsible_user_ids;
    for (var i = 0; i < userValue?.length; i++) {
      let responsibleUserId = userValue[i][type];
      if (subSectionId == responsibleUserId) {
        userValue.splice(i, 1);
        i--;
      }
    }
    this.slaContractForm.controls['compliance_responsible_user_ids'].setValue(userValue);
    this._utilityService.detectChanges(this._cdr);
  }

  subsidiariesChange() {
    if (this.slaContractForm.value.organization_ids.length == 0) {
      this.slaContractForm.controls['branch_ids'].reset();
      this.slaContractForm.controls['division_ids'].reset();
      this.slaContractForm.controls['department_ids'].reset();
      this.slaContractForm.controls['section_ids'].reset();
      this.slaContractForm.controls['sub_section_ids'].reset();
      this.slaContractForm.controls['compliance_responsible_user_ids'].reset();
    }
  }

  processFormErrors() {
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
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
        if (key.startsWith('branch_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['branch_ids'] = this.formErrors['branch_ids'] ? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('sub_section_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids'] ? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
        if (key.startsWith('compliance_responsible_user_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['compliance_responsible_user_ids'] = this.formErrors['compliance_responsible_user_ids'] ? this.formErrors['compliance_responsible_user_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);

  }


  ngOnDestroy() {
    SLAContractStore.clearDocument();
    this.controlSlaCategorySubscriptionEvent.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
  }
}
