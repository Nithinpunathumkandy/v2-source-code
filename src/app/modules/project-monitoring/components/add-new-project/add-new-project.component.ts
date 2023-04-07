import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { ProjectContractTypeMasterStore } from 'src/app/stores/masters/project-monitoring/project-contract-type-store';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectContractTypeService } from 'src/app/core/services/masters/project-monitoring/project-contract-type/project-contract-type.service';
import { ProjectPriorityMasterStore } from 'src/app/stores/masters/project-monitoring/project-priority-store';
import { ProjectPriorityService } from 'src/app/core/services/masters/project-monitoring/project-priority/project-priority.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-new-project',
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.scss']
})
export class AddNewProjectComponent implements OnInit {
  @Input('source') projectInformationSource: any;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('priorityFormModal', { static: true }) priorityFormModal: ElementRef;
  @ViewChild('locationFormModal', { static: true }) locationFormModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  projectInformationForm: FormGroup;
  SubsidiaryStore = SubsidiaryStore;
  BranchesStore = BranchesStore;
  DivisionStore = DivisionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  ProjectContractTypeMasterStore = ProjectContractTypeMasterStore;
  ProjectPriorityMasterStore = ProjectPriorityMasterStore;
  LocationMasterStore = LocationMasterStore;

  AppStore = AppStore;
  UsersStore = UsersStore

  openModelPopup: boolean;
  projectContractTypeObject = {
    component: 'Master',
    type: null,
    values: null
  }
  locationObject = {
    component: 'Master',
    values: null,
    type: null
  };
  projectPriorityObject = {
    component: 'Master',
    type: null,
    values: null
  }
  contractTypes=[
    {
      title :"type1",
      id : 1
    },
    {
      title :"type2",
      id : 2
    }
  ]

  budgeted : boolean = true;
  nonBudgeted : boolean = false
  projectType = ""

  projectContractTypeSubscriptionEvent: any;
  organisationChangesModalSubscription: any;
  formErrors: any;
  projectPrioritySubscriptionEvent: any;
  locationSubscriptionEvent: any;

  constructor(private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _divisionService: DivisionService,
     private _sectionService: SectionService,
     private _departmentService: DepartmentService,
    private _subSectionService: SubSectionService, 
    private _subsidiaryService: SubsidiaryService,
    private _projectContractTypeService: ProjectContractTypeService,
    private _projectService : ProjectMonitoringService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _projectPriorityService: ProjectPriorityService,
    private _locationService:LocationService,
    private _router: Router,) { }

  ngOnInit(): void {
    this.projectInformationForm = this._formBuilder.group({
      id: [''],
      project_type_id: [null],
      project_contract_type_id : [null,[Validators.required]],
      // project_manager_id : [null,[Validators.required]],
      title: ['',[Validators.required]],
      description : '',
      start_date : ['',[Validators.required]],
      target_date : ['',[Validators.required]],
      location_id : [null,[Validators.required]],
      organization_ids : [null],
      division_ids : [null],
      department_ids :[null],
      section_ids : [null],
      sub_section_ids : [null],
      project_status_id : [null],
      project_priority_id : [null]
    })
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.projectInformationForm.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.projectInformationForm.controls['section_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.projectInformationForm.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
    this.projectInformationForm.controls['department_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    this.projectInformationForm.controls['organization_ids'].setValidators(Validators.required); 
     
    this.projectContractTypeSubscriptionEvent = this._eventEmitterService.projectContractType.subscribe(res=>{
      this.closeContractTypeMasteModal();
    });
    this.projectPrioritySubscriptionEvent = this._eventEmitterService.projectPriority.subscribe(res=>{
      this.closePriorityTypeMasteModal();
    })
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      });
         // for closing the modal
    this.locationSubscriptionEvent  = this._eventEmitterService.locationMasterControl.subscribe(res => {
      this.closeLocationTypeMasteModal();
    })


    if(this.projectInformationSource.type == "Edit"){
      if(this.projectInformationSource.value.project_type && this.projectInformationSource.value.project_type.is_budgeted == 1){
        this.projectType = "budgeted"
      }else{
        this.projectType = "nonBudgeted"
      }
      this.editData()
    }else{
      this.projectType = "budgeted"
      this.setInitialOrganizationLevels()
     
    }
    this.getContractTypes();
    this.getUsers();
    this.getPriority();
    this.getLocation();
  }

  cancel(){
    this._eventEmitterService.dismissProjectInformationAddModal()
  }

  getContractTypes(){
    this._projectContractTypeService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  searchContractType(e,patchValue:boolean = false){
    this._projectContractTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.projectInformationForm.patchValue({ project_contract_type_id: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getPriority(){
    this._projectPriorityService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchPriority(e,patchValue:boolean = false){
    this._projectPriorityService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.projectInformationForm.patchValue({ project_priority_id: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getLocation(){
    this._locationService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }
  searchLocation(e,patchValue:boolean = false){
    this._locationService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.projectInformationForm.patchValue({ location_id: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

// search master section
searchOrganization(e) {
  this._subsidiaryService.searchSubsidiary('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

changebudgetType(event){
  this.projectType = event
}

searchDivision(e) {
  if (this.projectInformationForm.get('organization_ids').value && this.projectInformationForm.get('organization_ids').value.length > 0) {
    let parameters = this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value);
    this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
      // this.projectInformationForm.value.department_ids = [];
      // this.DepartmentStore.setAllDepartment([]);
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Division
getDivision() {
  if (this.projectInformationForm.get('organization_ids').value) {
    let parameters = this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value);
    this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
      // this.projectInformationForm.value.department_ids = [];
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
  if (this.projectInformationForm.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
    this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      // this.SectionStore.setAllSection([]);
      // this.projectInformationForm.value.section_ids = [];
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Department
getDepartment() {
  if (this.projectInformationForm.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
    this._departmentService.getItems(false, params).subscribe(res => {
      // this.SectionStore.setAllSection([]);
      // this.projectInformationForm.value.section_ids = [];
      this._utilityService.detectChanges(this._cdr);
    });
  }
  else {
    this.DepartmentStore.setAllDepartment([]);
  }
}

// Get Section
getSection() {
  if (this.projectInformationForm.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('department_ids').value)
    this._sectionService.getItems(false, params).subscribe(res => {
      // this.projectInformationForm.value.sub_section_ids = [];
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
  if (this.projectInformationForm.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('department_ids').value)
    //let parameters = this._helperService.createParameterFromArray(this.projectInformationForm.get('department_ids').value);
    this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      // this.projectInformationForm.value.sub_section_ids = [];
      // this.SubSectionStore.setAllSubSection([]);
      this._utilityService.detectChanges(this._cdr);
    });
  }
}

// Get Sub Section
getSubSection() {
  if (this.projectInformationForm.get('organization_ids').value) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('section_ids').value)
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
  if (this.projectInformationForm.get('organization_ids').value && this.projectInformationForm.get('organization_ids').value.length > 0) {
    var params = '';
    params = '&organization_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('organization_ids').value)
      + '&division_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('division_ids').value)
      + '&department_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('department_ids').value)
      + '&section_ids=' + this._helperService.createParameterFromArray(this.projectInformationForm.get('section_ids').value)
    this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
}
getUsers() {
  let params = ''
  this._usersService.getAllItems(params).subscribe((res) => {
    this._utilityService.detectChanges(this._cdr);
  });
}

searchUsers(searchTerm: any) {
  this._usersService.getAllItems('?q='+searchTerm.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
  });
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

getDefaultImage(type){
  return this._imageService.getDefaultImageUrl(type);
}

createImageUrl(type,token){
  return this._imageService.getThumbnailPreview(type,token);
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = false;
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.projectInformationForm.patchValue({
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

  addNewContractType(){
    this.projectContractTypeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.contractTypeMasterModal();
  }

  contractTypeMasterModal() {
    this._renderer2.addClass(this.formModal.nativeElement,'show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.formModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeContractTypeMasteModal() {
    this.projectContractTypeObject.type = null;
    this._renderer2.removeClass(this.formModal.nativeElement,'show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.formModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchContractType({term : ProjectContractTypeMasterStore.lastInsertedProjectContractType},true)

  }

  addNewPriorityType(){
    this.projectPriorityObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.priorityTypeMasterModal();
  }

  priorityTypeMasterModal() {
    this._renderer2.addClass(this.priorityFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closePriorityTypeMasteModal() {
    this.projectPriorityObject.type = null;
    this._renderer2.removeClass(this.priorityFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchPriority({term : ProjectPriorityMasterStore.lastInsertedProjectPriority},true)

  }


  addNewLocationType(){
    this.locationObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.locationTypeMasterModal();
  }

  locationTypeMasterModal() {
    this._renderer2.addClass(this.locationFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.locationFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeLocationTypeMasteModal() {
    this.locationObject.type = null;
    this._renderer2.removeClass(this.locationFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.locationFormModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchLocation({term : LocationMasterStore.lastInsertedId},true)

  }

  setInitialOrganizationLevels(){
    let user= AuthStore.user
    user.first_name = user.name
    this.projectInformationForm.patchValue({
      division_ids: AuthStore.user.division ? AuthStore.user.division : [],
      department_ids:AuthStore.user.department ? AuthStore.user.department : [],
      section_ids:AuthStore.user.section ? AuthStore.user.section : [],
      sub_section_ids: AuthStore.user.sub_section ? AuthStore.user.sub_section : [],
      organization_ids: AuthStore.user.organization ? AuthStore.user.organization : [],
      // branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
      // reported_by : user ? user : null  
      

    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.strategyForm.patchValue({ organization_id: AuthStore.user?.organization});
    // }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.projectInformationForm.value.division_ids[0]});
    this.searchDepartment({term: this.projectInformationForm.value.department_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.projectInformationForm.value.section_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.projectInformationForm.value.sub_section_ids[0].id});
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({term: this.projectInformationForm.value.branch_ids[0]?.id});
    this._utilityService.detectChanges(this._cdr);
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i);
    }
    return returnValues;
  }

  editData(){
  
    this.projectInformationForm.patchValue({
      project_type_id : this.projectType == "budgeted" ? 3 : 4,
      start_date:this.projectInformationSource.value.start_date ? this._helperService.processDate(this.projectInformationSource.value.start_date,'split') : [],
      target_date:this.projectInformationSource.value.target_date ? this._helperService.processDate(this.projectInformationSource.value.target_date,'split') : [],
      title:this.projectInformationSource.value.title ? this.projectInformationSource.value.title : '',
      description:this.projectInformationSource.value.description ? this.projectInformationSource.value.description : '',
      location_id : this.projectInformationSource.value.location ? this.projectInformationSource.value.location.id :null,
      organization_ids:this.projectInformationSource.value.organizations ? this.projectInformationSource.value.organizations[0] : [AuthStore.user?.organization.id],
      division_ids:this.projectInformationSource.value.divisions ? this.projectInformationSource.value.divisions[0] : [AuthStore.user?.division.id],
      department_ids:this.projectInformationSource.value.departments ? this.projectInformationSource.value.departments[0] : [AuthStore.user?.department.id],
      section_ids:this.projectInformationSource.value.sections ? this.projectInformationSource.value.sections[0] : [AuthStore.user?.section.id],
      sub_section_ids:this.projectInformationSource.value.sub_sections ? this.projectInformationSource.value.sub_sections[0] : [AuthStore.user?.sub_section.id], 
      project_status_id : this.projectInformationSource.value.project_status ? this.projectInformationSource.value.project_status.id : 1,
      project_contract_type_id : this.projectInformationSource.value.project_contract_type ? this.projectInformationSource.value.project_contract_type.id : null,
      // project_manager_id : this.projectInformationSource.value.project_manager ? this.projectInformationSource.value.project_manager : null
      project_priority_id :  this.projectInformationSource.value.project_priority ?this.projectInformationSource.value.project_priority.id : null,
    })
  }

  processData(){
    let saveData = {
      project_type_id : this.projectType == "budgeted" ? 3 : 4,
      start_date:this.projectInformationForm.value.start_date ? this._helperService.processDate(this.projectInformationForm.value.start_date,'join') : [],
      target_date:this.projectInformationForm.value.target_date ? this._helperService.processDate(this.projectInformationForm.value.target_date,'join') : [],
      title:this.projectInformationForm.value.title ? this.projectInformationForm.value.title : '',
      description:this.projectInformationForm.value.description ? this.projectInformationForm.value.description : '',
      location_id : this.projectInformationForm.value.location_id ? this.projectInformationForm.value.location_id :null,
      organization_ids:this.projectInformationForm.value.organization_ids ? [this.projectInformationForm.value.organization_ids.id] : [AuthStore.user?.organization.id],
      division_ids:this.projectInformationForm.value.division_ids ? [this.projectInformationForm.value.division_ids.id] : [AuthStore.user?.division.id],
      department_ids:this.projectInformationForm.value.department_ids ? [this.projectInformationForm.value.department_ids.id] : [AuthStore.user?.department.id],
      section_ids:this.projectInformationForm.value.section_ids ? [this.projectInformationForm.value.section_ids.id] : [AuthStore.user?.section.id],
      sub_section_ids:this.projectInformationForm.value.sub_section_ids ? [this.projectInformationForm.value.sub_section_ids.id] : [AuthStore.user?.sub_section.id], 
      project_status_id : this.projectInformationForm.value.project_status_id ? this.projectInformationForm.value.project_status_id : 1,
      project_contract_type_id : this.projectInformationForm.value.project_contract_type_id ? this.projectInformationForm.value.project_contract_type_id : null,
      // project_manager_id : this.projectInformationForm.value.project_manager_id.id ? this.projectInformationForm.value.project_manager_id.id : null
      project_priority_id : this.projectInformationForm.value.project_priority_id ? this.projectInformationForm.value.project_priority_id : null,
    }

    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division){
      delete saveData.division_ids;
    } 
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_department){
     delete saveData.department_ids;
   }
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
      delete saveData.section_ids;
    } 
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section){
      delete saveData.sub_section_ids;
    }
    return saveData
  }


  save(close: boolean = false){
    AppStore.enableLoading();
    let save 
     if(this.projectInformationSource.type =="Edit"){
      save = this._projectService.update(this.processData(),this.projectInformationSource.value.id)
     }else{
       save = this._projectService.save(this.processData())
     }
     save.subscribe(res=>{
       ProjectMonitoringStore.setSelectedProjectId(res.id)
      if(close){
        this.cancel();
        this._router.navigateByUrl('/project-monitoring/projects/'+res.id);
      } 
      else this.resetForm();
      AppStore.disableLoading();
     }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
         this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
  }

  resetForm(){
    this.projectInformationForm.reset();
  }

  ngOnDestroy(){
    this.projectContractTypeSubscriptionEvent.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.projectPrioritySubscriptionEvent.unsubscribe();
    this.locationSubscriptionEvent.unsubscribe();
  }

}
