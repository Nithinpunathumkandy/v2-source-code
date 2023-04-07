import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { ComplianceAreaService } from 'src/app/core/services/masters/compliance-management/compliance-area/compliance-area.service';
import { ComplianceSectionService } from 'src/app/core/services/masters/compliance-management/compliance-section/compliance-section.service';
import { ComplianceTypeService } from 'src/app/core/services/masters/compliance-management/compliance-type/compliance-type.service';
import { ComplianceFrequencyService } from 'src/app/core/services/masters/compliance-management/compliance-frequency/compliance-frequency.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { ComplianceAreaMasterStore } from 'src/app/stores/masters/compliance-management/compliance-area-store';
import { ComplianceSectionMasterStore } from 'src/app/stores/masters/compliance-management/compliance-section-store';
import { ComplianceTypeMasterStore } from 'src/app/stores/masters/compliance-management/compliance-type-master.store';
import { ComplianceFrequencyMasterStore } from 'src/app/stores/masters/compliance-management/compliance-frequency-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { ComplianceAreaPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-area';
import { ComplianceSectionPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-section';
import { ComplianceTypePaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-type';
import { Router } from '@angular/router';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { BranchesStore } from "src/app/stores/organization/business_profile/branches/branches.store";
import { OrganizationproductsService } from 'src/app/core/services/organization/business_profile/products/organizationproducts.service';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { OrganizationSettingsService } from 'src/app/core/services/settings/organization_settings/organization-settings.service';

declare var $: any;
@Component({
  selector: 'app-add-compliance-register',
  templateUrl: './add-compliance-register.component.html',
  styleUrls: ['./add-compliance-register.component.scss']
})
export class AddComplianceRegisterComponent implements OnInit {
  @Input('source') complianceRegisterObjectSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('addComplianceArea', { static: true }) addComplianceArea: ElementRef;
  @ViewChild('addComplianceSection', { static: true }) addComplianceSection: ElementRef;
  @ViewChild('addComplianceType', { static: true }) addComplianceType: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  form: FormGroup;
  formErrors: any;
  fileUploadsArray = []; // for multiple file uploads
  res_id;

  // ImageStore = ImageStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  ComplianceAreaMasterStore = ComplianceAreaMasterStore;
  ComplianceSectionMasterStore = ComplianceSectionMasterStore;
  ComplianceTypeMasterStore = ComplianceTypeMasterStore;
  ComplianceFrequencyMasterStore = ComplianceFrequencyMasterStore;
  UsersStore = UsersStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DivisionStore = DivisionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  BusinessProductsStore = BusinessProductsStore;
  
  addComplianceAreaEvent:any;
  addComplianceSectionEvent:any;
  addComplianceTypeEvent:any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  documentDeletedFlag: boolean = false;
  openModelPopup: boolean = false;
  organisationChangesModalSubscription: any = null;

  constructor(private _formBuilder:FormBuilder,
              private _userService:UsersService,
              private _imageService:ImageServiceService,
              private _cdr:ChangeDetectorRef,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService,
              private _complianceRegisterService:ComplianceRegisterService,
              private _complianceAreaService:ComplianceAreaService,
              private _complianceSectionService:ComplianceSectionService,
              private _complianceTypeService:ComplianceTypeService,
              private _complianceFrequencyService:ComplianceFrequencyService,
              private _sectionService:SectionService,
              private _subSectionService:SubSectionService,
              private _divisionService:DivisionService,
              private _departmentService:DepartmentService,
              private _subsidiaryService:SubsidiaryService,
              private _eventEmitterService:EventEmitterService,
              private _renderer2:Renderer2,
              private _router:Router,
              private _orgProductService:OrganizationproductsService,
              private _branchesService: BranchService,
              private _organizationSettingsService: OrganizationSettingsService,) { }

  ngOnInit(): void {
    OrganizationalSettingsStore.showBranch = true;
    
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      compliance_area_ids: [null, [Validators.required]],
      compliance_section_ids: [null, [Validators.required]],
      compliance_document_type_ids: [null, [Validators.required]],
      compliance_frequency_id: [null, [Validators.required]],
      compliance_source: '',
      organization_ids: [null, [Validators.required]],
      division_ids: [[]],
      department_ids: [[], [Validators.required]],
      section_ids: [[]],
      sub_section_ids: [[]],
      branch_ids:[[]],
      compliance_responsible_user_ids: [null, [Validators.required]],
      issue_date: [null,[Validators.required]],
      expiry_date: [null,[Validators.required]],
      description: [''],
      comment: [''],
      product_id:[null],
      review_user_id: [null],
      sa1:[null],
      sa2: [null],
    });
    this.getOrganizationSettings()
    this.addComplianceAreaEvent = this._eventEmitterService.complianceAreaControl.subscribe(element => {
      this.closeComplianceAreaAddModal();
      // this.changeZIndex();
    })
    this.addComplianceSectionEvent = this._eventEmitterService.complianceSectionControl.subscribe(element => {
      this.closeComplianceSectionAddModal();
      // this.changeZIndex();
    })
    this.addComplianceTypeEvent = this._eventEmitterService.organizationComplianceType.subscribe(element => {
      this.closeComplianceDocumentTypeAdd();
      // this.changeZIndex();
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    
    // Checking if Source has Values and Setting Form Value

    if (this.complianceRegisterObjectSource && this.complianceRegisterObjectSource.hasOwnProperty('values') && this.complianceRegisterObjectSource.values) {
      this.setFormValues();
    }

    if(this.complianceRegisterObjectSource && this.complianceRegisterObjectSource.hasOwnProperty('type') && this.complianceRegisterObjectSource.type == 'Add'){
      this.setInitialOrganizationLevels();
    }
    
    
  }
  ngDoCheck(){
    if (this.complianceRegisterObjectSource && this.complianceRegisterObjectSource.hasOwnProperty('values') && this.complianceRegisterObjectSource.values && !this.form.value.id)
      this.setFormValues();
  }
  setFormValues(){   
    this.formErrors = null;
    this.resetForm();
    this._complianceRegisterService.getComplianceRegisterDetails(this.complianceRegisterObjectSource?.values?.id).subscribe(() => {
      let formValue = ComplianceRegisterStore?.ComplianceRegisterDetailsList;
        let docValue = formValue?.versions[0];
        if(docValue.token){
          let docurl = this._complianceRegisterService.getThumbnailPreview('compliance-register-document', docValue.token);
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
          this._complianceRegisterService.setDocumentDetails(docDetails, docurl);
        } 
   
    this.form.setValue({  
      id: this.complianceRegisterObjectSource.values.id,
      title: this.complianceRegisterObjectSource?.values?.title ? this.complianceRegisterObjectSource?.values?.title : '',
      compliance_area_ids: this.complianceRegisterObjectSource.values.compliance_area_ids ?  this.getProcessedEditValue(this.complianceRegisterObjectSource.values.compliance_area_ids): [],
      compliance_section_ids: this.complianceRegisterObjectSource.values.compliance_section_ids ?  this.getProcessedEditValue(this.complianceRegisterObjectSource.values.compliance_section_ids) : [],
      // compliance_document_type_ids: this.complianceRegisterObjectSource.values.compliance_document_type_ids ?  this.getProcessedEditValue(this.complianceRegisterObjectSource.values.compliance_document_type_ids) : [],
      compliance_document_type_ids: this.complianceRegisterObjectSource.values.compliance_document_type_ids.length > 0 ?  this.complianceRegisterObjectSource.values.compliance_document_type_ids[0] : null,
      compliance_frequency_id: this.complianceRegisterObjectSource.values.compliance_frequency_id ? this.processComplianceFrequency(this.complianceRegisterObjectSource.values.compliance_frequency_id) : null,
      compliance_source: this.complianceRegisterObjectSource.values.compliance_source? this.complianceRegisterObjectSource.values.compliance_source : '',
      compliance_responsible_user_ids: this.complianceRegisterObjectSource.values.responsible_user_ids ? this.getEditValue(this.complianceRegisterObjectSource.values.responsible_user_ids): [],
      comment: this.complianceRegisterObjectSource.values.comment? this.complianceRegisterObjectSource.values.comment : '',
      product_id: formValue.product?.id? formValue.product?.id : null,
      issue_date: this.complianceRegisterObjectSource.values.issue_date? this._helperService.processDate(this.complianceRegisterObjectSource.values.issue_date, 'split'): null,
      expiry_date: this.complianceRegisterObjectSource.values.expiry_date? this._helperService.processDate(this.complianceRegisterObjectSource.values.expiry_date, 'split'): null,
      sa1: this.complianceRegisterObjectSource.values.sa1? this._helperService.processDate(this.complianceRegisterObjectSource.values.sa1, 'split'): null,
      sa2: this.complianceRegisterObjectSource.values.sa2? this._helperService.processDate(this.complianceRegisterObjectSource.values.sa2, 'split'): null,
      description: this.complianceRegisterObjectSource.values.description? this.complianceRegisterObjectSource.values.description : '',
      organization_ids:this.complianceRegisterObjectSource.values.organizations ? this.getEditValue(this.complianceRegisterObjectSource.values.organizations) : [],
      division_ids:this.complianceRegisterObjectSource.values.divisions ? this.getEditValue(this.complianceRegisterObjectSource.values.divisions) : [],
      department_ids:this.complianceRegisterObjectSource.values.departments ? this.getEditValue(this.complianceRegisterObjectSource.values.departments) : [],
      section_ids:this.complianceRegisterObjectSource.values.sections ? this.getEditValue(this.complianceRegisterObjectSource.values.sections) : [],
      sub_section_ids:this.complianceRegisterObjectSource.values.sub_sections ? this.getEditValue(this.complianceRegisterObjectSource.values.sub_sections) : [], 
      branch_ids:this.complianceRegisterObjectSource.values.branches ? this.getEditValue(this.complianceRegisterObjectSource.values.branches) : [], 
      review_user_id : this.complianceRegisterObjectSource.values.review_user ? this.complianceRegisterObjectSource.values.review_user : null
    })
    let term ={
      term : formValue.product?.title
    }
    this.searchProduct(term)
    this._utilityService.detectChanges(this._cdr);
    })
  }
  

  processComplianceFrequency(frequencyData){
    let freqData = { id: frequencyData.id, type: frequencyData.type, compliance_frequency_language_title: frequencyData.language[0].pivot.title};
    return freqData;
  }

  complianceAreaChanged(event){
    if(event && event.length > 0){
      let des = '';
      for(let i of event){
        des = des + i.description ? i.description : '';
        this.form.patchValue({description: des});
        this._utilityService.detectChanges(this._cdr);
      }
    }
    else{
      this.form.patchValue({description: ''});
    }
  }

  frequencyChange(){
    let event = null;
    let yearcount = null;
    if(this.form.value.compliance_frequency_id) 
      event = this.form.value.compliance_frequency_id
    setTimeout(() => {
      if(event && this.form.value.issue_date && event.type != 'daily' && event.type != 'continuous'){
        let start = new Date(this._helperService.processDate(this.form.value.issue_date,'join'));
        let wkStart;
        switch(event.type){
          case 'quarterly':
            wkStart = new Date(new Date(start).setDate(start.getDate() + 90));
            break;
          case 'yearly':
            wkStart = new Date(new Date(start).setDate(start.getDate() + 365));
            break;
          case 'monthly':
            wkStart = new Date(new Date(start).setDate(start.getDate() + 30));
            break;
          case 'weekly':
            wkStart = new Date(new Date(start).setDate(start.getDate() + 7));
            break;
          case 'daily':
            wkStart = new Date(new Date(start).setDate(start.getDate() + 1));
          case '3_years':
            yearcount = event.type.split('_');
            wkStart = new Date(new Date(start).setDate(start.getDate() + 365*parseInt(yearcount[0])));
          case '10_years':
            yearcount = event.type.split('_');
            wkStart = new Date(new Date(start).setDate(start.getDate() + 365*parseInt(yearcount[0])));
            break;
        }
        let firstDayofWeek = this._helperService.processDates(wkStart);
        let issuedate = {
          day: parseInt(firstDayofWeek.date),
          month: parseInt(firstDayofWeek.month),
          year: parseInt(firstDayofWeek.year)
        }
        this.form.patchValue({expiry_date: issuedate});
      }
      else{
        this.form.patchValue({expiry_date: null});
      }
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids:AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
      branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: [AuthStore.user.organization]});
    // }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_ids[0].id});
    this.searchDepartment({term: this.form.value.department_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.form.value.section_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.form.value.sub_section_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({term: this.form.value.branch_ids[0]?.id});
    this._utilityService.detectChanges(this._cdr);
  } 
// for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}

getEditValue(fields) {
  var returnValues = [];
  for (let i of fields) {  
      returnValues.push(i);
  }
  return returnValues;
}

getProcessedEditValue(values){
  var returnValues = [];
  for (let i of values) {  
      returnValues.push({id: i.id, title: i.title, status_id: i.status_id});
  }
  return returnValues;
}

changeZIndex(){
  if($(this.addComplianceArea.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addComplianceArea.nativeElement,'z-index',9999);
    this._renderer2.setStyle(this.addComplianceArea.nativeElement,'overflow','auto');
  }
  else if($(this.addComplianceSection.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addComplianceSection.nativeElement,'z-index',9999);
    this._renderer2.setStyle(this.addComplianceSection.nativeElement,'overflow','auto');
  }
  else if($(this.addComplianceType.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addComplianceType.nativeElement,'z-index',9999);
    this._renderer2.setStyle(this.addComplianceType.nativeElement,'overflow','auto');
  }
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();



}

// for closing the modal
closeFormModal() {
  this._eventEmitterService.dismissAddComplianceRegister();
  ComplianceRegisterStore.clearDocumentDetails();
  delete this.complianceRegisterObjectSource.values;
  this.resetForm();
}

getProducts(){
  this._orgProductService.getAllItems().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  });
}

  // getting Responsible user
getResponsibleUsers() {
  if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
    var params = '';
      params = '?organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
        + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value)
    this._userService.searchUsers(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  else{
    UsersStore.setAllUsers([]);
  }
}
 // getting compliance area
 getComplianceArea() {
  this._complianceAreaService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}
// getting compliance section
getSections() {
  this._complianceSectionService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}
// getting compliance type
getComplianceDocumentType() {
  this._complianceTypeService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}
// getting compliance frequency
getFrequency() {
  ComplianceFrequencyMasterStore.orderBy = null;
  this._complianceFrequencyService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}
// getting master department
getOrganization() {
  this._subsidiaryService.getAllItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

searchProduct(e) {
  this._orgProductService.getAllItems(true,'q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

// search users
searchUsers(e) {
  if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
    var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
        + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value)
    this._userService.searchUsers('?q=' + e.term+params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  else{
    UsersStore.setAllUsers([]);
  }
}

customSearchFn(term: string, item: any) {
  term = term.toLowerCase();
  // Creating and array of space saperated term and removinf the empty values using filter
  let splitTerm = term.split(' ').filter(t => t);
  let isWordThere = [];
  // Pushing True/False if match is found
  splitTerm.forEach(arr_term => {
    item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
    let search = item['searchLabel'].toLowerCase();
    if(search) isWordThere.push(search.indexOf(arr_term) != -1);
  });

  const all_words = (this_word) => this_word;
  // Every method will return true if all values are true in isWordThere.
  return isWordThere.every(all_words);
}

// search compliance area
searchComplianceArea(e,patchValue:boolean = false) {
  this._complianceAreaService.getItems(false,'&q=' + e.term).subscribe((res:ComplianceAreaPaginationResponse) => {
    if(res.data.length > 0 && patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          let compliance_area = this.form.value.compliance_area_ids ? this.form.value.compliance_area_ids : [];
          compliance_area.push(i);
          this.form.patchValue({compliance_area_ids: compliance_area});
          break; 
        }
      }
    }
    // ComplianceAreaMasterStore.lastInsertedId = null;
    this._utilityService.detectChanges(this._cdr);
  })
}

// search compliance section
searchSections(e,patchValue:boolean = false) {
  this._complianceSectionService.getItems(false,'&q=' + e.term).subscribe((res:ComplianceSectionPaginationResponse) => {
    if(res.data.length > 0 && patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          let compliance_section = this.form.value.compliance_section_ids ? this.form.value.compliance_section_ids : [];
          compliance_section.push(i);
          this.form.patchValue({compliance_section_ids: compliance_section});
          break; 
        }
      }
    }
    // ComplianceAreaMasterStore.lastInsertedId = null;
    this._utilityService.detectChanges(this._cdr);
  })
}

searchComplianceDocumentType(e,patchValue:boolean = false) {
  this._complianceTypeService.getItems(false,'&q=' + e.term).subscribe((res:ComplianceTypePaginationResponse) => {
    if(res.data.length > 0 && patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          // let compliance_type = this.form.value.compliance_document_type_ids ? this.form.value.compliance_document_type_ids : [];
          // compliance_type.push(i);
          let compliance_type = i;
          this.form.patchValue({compliance_document_type_ids: compliance_type});
          break; 
        }
      }
    }
    // ComplianceAreaMasterStore.lastInsertedId = null;
    this._utilityService.detectChanges(this._cdr);
  })
}
// search compliance type
searchFrequency(e) {
  this._complianceFrequencyService.searchComplianceFrequency('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

// search master section
searchOrganization(e) {
  this._subsidiaryService.searchSubsidiary('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

searchDivision(e) {
  if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
    let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
      // this.form.value.department_ids = [];
      // this.DepartmentStore.setAllDepartment([]);
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Division
getDivision() {
  if (this.form.get('organization_ids').value) {
    let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
      // this.form.value.department_ids = [];
      // this.DepartmentStore.setAllDepartment([]);
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
  if (this.form.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
    this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      // this.SectionStore.setAllSection([]);
      // this.form.value.section_ids = [];
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Department
getDepartment() {
  if (this.form.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
    this._departmentService.getItems(false, params).subscribe(res => {
      // this.SectionStore.setAllSection([]);
      // this.form.value.section_ids = [];
      this._utilityService.detectChanges(this._cdr);
    });
  }
  else {
    this.DepartmentStore.setAllDepartment([]);
  }
}

// Get Section
getSection() {
  if (this.form.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
    this._sectionService.getItems(false, params).subscribe(res => {
      // this.form.value.sub_section_ids = [];
      // this.SubSectionStore.setAllSubSection([]);
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
  if (this.form.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
    //let parameters = this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      // this.form.value.sub_section_ids = [];
      // this.SubSectionStore.setAllSubSection([]);
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Sub Section
getSubSection() {
  if (this.form.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
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
  if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
    this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

getBranches(){
  if (this.form.get('organization_ids').value) {
    let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    this._branchesService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  else {
    this.BranchesStore.clearBranchList();  
  }
}

searchBranches(e){
  if (this.form.get('organization_ids').value) {
    let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
    this._branchesService.getAllItems(false, '?organization_ids=' + parameters+ '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  else {
    this.BranchesStore.clearBranchList();  
  }
}


createImagePreview(type,token){
  return this._imageService.getThumbnailPreview(type,token)
}
// Returns default image url
getDefaultImage() {
  return this._imageService.getDefaultImageUrl('user-logo');
}

complianceAreaAdd(){
  // $(this.addComplianceArea.nativeElement).modal('show');
  // this._utilityService.detectChanges(this._cdr);
  this._renderer2.addClass(this.addComplianceArea.nativeElement,'show');
  this._renderer2.setStyle(this.addComplianceArea.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.addComplianceArea.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}


sectionsAdd(){
  // $(this.addComplianceSection.nativeElement).modal('show');
  // this._utilityService.detectChanges(this._cdr);
  this._renderer2.addClass(this.addComplianceSection.nativeElement,'show');
  this._renderer2.setStyle(this.addComplianceSection.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.addComplianceSection.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

// closeSectionsAdd(){
//   $(this.addComplianceSection.nativeElement).modal('hide');
//   this._utilityService.detectChanges(this._cdr);
// }
complianceDocumentTypeAdd(){
  // $(this.addComplianceType.nativeElement).modal('show');
  // this._utilityService.detectChanges(this._cdr);
  this._renderer2.addClass(this.addComplianceType.nativeElement,'show');
  this._renderer2.setStyle(this.addComplianceType.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.addComplianceType.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
  
}

  closeComplianceDocumentTypeAdd() {
    // $(this.addComplianceType.nativeElement).modal('hide');
    this._renderer2.removeClass(this.addComplianceType.nativeElement, 'show');
    this._renderer2.setStyle(this.addComplianceType.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addComplianceType.nativeElement, 'display', 'none');
    if (ComplianceTypeMasterStore.lastInsertedId) {
      // this.form.patchValue({ compliance_document_type_ids: ComplianceTypeMasterStore.lastInsertedId });
      this.searchComplianceDocumentType({ term: ComplianceTypeMasterStore.lastInsertedId }, true);
    }
    // ComplianceAreaMasterStore.lastInsertedId = null;
  }

  closeComplianceAreaAddModal() {

    // if(this.ComplianceAreaMasterStore.lastInsertedId){
    //   this.searchComplianceArea({term: this.ComplianceAreaMasterStore.lastInsertedId},true)
    // }
    // setTimeout(() => {
    //   $(this.addComplianceArea.nativeElement).modal('hide');
    //   this._utilityService.detectChanges(this._cdr);
    // }, 100);
    // $(this.addComplianceArea.nativeElement).modal('hide');
    this._renderer2.removeClass(this.addComplianceArea.nativeElement, 'show');
    this._renderer2.setStyle(this.addComplianceArea.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addComplianceArea.nativeElement, 'display', 'none');
    if (ComplianceAreaMasterStore.lastInsertedId) {
      // this.form.patchValue({ compliance_area_ids: ComplianceAreaMasterStore.lastInsertedId });
      // this.getComplianceArea()
      this.searchComplianceArea({ term: ComplianceAreaMasterStore.lastInsertedId }, true);
    }
    ComplianceAreaMasterStore.lastInsertedId = null;

  }

  closeComplianceSectionAddModal() {

    // $(this.addComplianceSection.nativeElement).modal('hide');
    this._renderer2.removeClass(this.addComplianceSection.nativeElement, 'show');
    this._renderer2.setStyle(this.addComplianceSection.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addComplianceSection.nativeElement, 'display', 'none');
    if (ComplianceSectionMasterStore.lastInsertedId) {
      // this.form.patchValue({ compliance_section_ids: ComplianceSectionMasterStore.lastInsertedId });
      this.searchSections({ term: ComplianceSectionMasterStore.lastInsertedId }, true);
    }
    // ComplianceAreaMasterStore.lastInsertedId = null;
  }

// closeComplianceSectionAddModal(){
//   if(this.ComplianceSectionMasterStore.lastInsertedId){
//     this.searchSections({term: this.ComplianceSectionMasterStore.lastInsertedId})
//   }
//   setTimeout(() => {
//     $(this.addComplianceSection.nativeElement).modal('hide');
//     this._utilityService.detectChanges(this._cdr);
//   }, 100);
// }

// closeComplianceTypeAddModal(){
//   // MeetingPlanStore.objectives_form_modal=true;
//   $(this.addComplianceType.nativeElement).modal('hide');
//   this._utilityService.detectChanges(this._cdr);
// }

 // extension check function
 checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

/**
   * removing document file from the selected list
   * @param token -image token
   */
 removeDocument(token) {
  ComplianceRegisterStore.unsetDocumentDetails(token);
  // this.documentDeletedFlag = true;
  this.checkForFileUploadsScrollbar();
  this._utilityService.detectChanges(this._cdr);
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
    imageDetails['preview_url'] = logo_url;
    if (imageDetails != null)
      this._complianceRegisterService.setDocumentDetails(imageDetails, type);
    this.checkForFileUploadsScrollbar();
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

checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
}

  // Check if logo is being uploaded
checkLogoIsUploading(){
  return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
}

getArrayFormatedString(items){
  return this._helperService.getArraySeperatedString(',','title',items);
}


organisationChanges() {
  this.openModelPopup = true;
  this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

closeModal(data?) {
  if(data){
    this.form.patchValue({
      division_ids: data.division_ids ? data.division_ids : [],
      department_ids:data.department_ids ? data.department_ids : [],
      section_ids:data.section_ids ? data.section_ids : [],
      sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
      organization_ids: data.organization_ids ? data.organization_ids : []
    })
  }
  this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
  this.openModelPopup = false;
  this._utilityService.detectChanges(this._cdr);
}



processDataForSave() {
  let saveData = {
    id: this.form.value.id ? this.form.value.id : '',
    title: this.form.value?.title ? this.form.value?.title : '',
    compliance_area_ids: this.form.value.compliance_area_ids ? this._helperService.getArrayProcessed(this.form.value.compliance_area_ids,'id') : [],
    compliance_section_ids: this.form.value.compliance_section_ids ? this._helperService.getArrayProcessed(this.form.value.compliance_section_ids ,'id') : [],
    // compliance_document_type_ids: this.form.value.compliance_document_type_ids ? this._helperService.getArrayProcessed(this.form.value.compliance_document_type_ids ,'id') : [],
    compliance_document_type_ids: this.form.value.compliance_document_type_ids ? [this.form.value.compliance_document_type_ids.id] : [],
    compliance_frequency_id: this.form.value.compliance_frequency_id ? this.form.value.compliance_frequency_id.id  : null,
    compliance_source: this.form.value.compliance_source? this.form.value.compliance_source : '',
    compliance_responsible_user_ids: this.form.value.compliance_responsible_user_ids ? this._helperService.getArrayProcessed(this.form.value.compliance_responsible_user_ids ,'id'): [],
    description: this.form.value.description? this.form.value.description : '',
    comment: this.form.value.comment? this.form.value.comment : '',
    product_id: this.form.value.product_id ? this.form.value.product_id : null,
    issue_date: this.form.value.issue_date ? this._helperService.processDate(this.form.value.issue_date, 'join') : null,
    expiry_date: this.form.value.expiry_date ? this._helperService.processDate(this.form.value.expiry_date, 'join') : null,
    sa1: this.form.value.sa1 ? this._helperService.processDate(this.form.value.sa1, 'join') : null,
    sa2: this.form.value.sa2 ? this._helperService.processDate(this.form.value.sa2, 'join') : null,
    organization_ids:this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids ,'id') : [AuthStore.user?.organization.id],
    division_ids:this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids ,'id') : [AuthStore.user?.division.id],
    department_ids:this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids ,'id') : [AuthStore.user?.department.id],
    section_ids:this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids ,'id') : [AuthStore.user?.section.id],
    sub_section_ids:this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids ,'id') : [AuthStore.user?.sub_section.id], 
    branch_ids:this.form.value.branch_ids ? this._helperService.getArrayProcessed(this.form.value.branch_ids ,'id') : [AuthStore.user?.branch.id], 
    name:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.name : null,
    ext:ComplianceRegisterStore.docDetails? ComplianceRegisterStore.docDetails.ext : null,
    mime_type:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.mime_type : null,
    size:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.size : null,
    url:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.url : null,
    thumbnail_url:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.thumbnail_url : null,
    token:ComplianceRegisterStore.docDetails ? ComplianceRegisterStore.docDetails.token : null,
    is_new:ComplianceRegisterStore.docDetails?.is_new ? ComplianceRegisterStore.docDetails?.is_new : false,
    is_deleted:ComplianceRegisterStore.docDetails?.is_deleted ? ComplianceRegisterStore.docDetails?.is_deleted : false,
    review_user_id: this.form.value.review_user_id ? this.form.value.review_user_id.id : null
  }
  // if(ComplianceRegisterStore.docDetails.is_new) saveData['is_new'] = true;
  // if(this.documentDeletedFlag){
  //   saveData['is_deleted'] = true;
  //   saveData['document_id'] = this.form.value.id;
  // }
  return saveData;
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;

  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._complianceRegisterService.updateItem(this.form.value.id, this.processDataForSave());
    } else {

      delete this.form.value.id
      save = this._complianceRegisterService.saveComplianceRegister(this.processDataForSave());
    }

    save.subscribe((res: any) => {
      this.res_id = res.id;// assign id to variable;
      if (!this.form.value.id) {
        this.resetForm();
        ComplianceRegisterStore.clearDocumentDetails();
      }
     
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close){
        this.closeFormModal();
        ComplianceRegisterStore.clearDocumentDetails();
        this._router.navigateByUrl('/compliance-management/compliance-registers/'+ res.id);
      } 
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
      } else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

processFormErrors(){
  var errors = this.formErrors;
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      if(key.startsWith('compliance_area_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['compliance_area_ids'] = this.formErrors['compliance_area_ids']? this.formErrors['compliance_area_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('compliance_section_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['compliance_section_ids'] = this.formErrors['compliance_section_ids']? this.formErrors['compliance_section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('compliance_document_type_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['compliance_document_type_ids'] = this.formErrors['compliance_document_type_ids']? this.formErrors['compliance_document_type_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('organization_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('branch_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['branch_ids'] = this.formErrors['branch_ids']? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('division_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['division_ids'] = this.formErrors['division_ids']? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('department_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['department_ids'] = this.formErrors['department_ids']? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('section_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['section_ids'] = this.formErrors['section_ids']? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('sub_section_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids']? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
     
    }
  }
  this._utilityService.detectChanges(this._cdr);
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}
getOrganizationSettings(){
  this._organizationSettingsService.getOrganizationSettings().subscribe(res =>{
    })
    //this.enableDisable();
    this._utilityService.detectChanges(this._cdr);

}
ngOnDestroy(){
  ComplianceRegisterStore.clearDocumentDetails();
  this.addComplianceAreaEvent.unsubscribe();
  this.addComplianceSectionEvent.unsubscribe();
  this.addComplianceTypeEvent.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  this.organisationChangesModalSubscription.unsubscribe();
}

}
