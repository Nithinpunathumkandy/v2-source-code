import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { ObjectiveService } from 'src/app/core/services/masters/strategy/objective/objective.service';
import { ObjectiveMasterStore } from 'src/app/stores/masters/strategy/objective.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { StrategyInitiativeReviewFrequencyMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store';
import { StrategyInitiativeReviewFrequencyService } from 'src/app/core/services/masters/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.service';
import { StrategyObjectiveTypeService } from 'src/app/core/services/masters/strategy/strategy-objective-type/strategy-objective-type.service';
import { StrategyObjectiveTypeMasterStore } from 'src/app/stores/masters/strategy/strategy-objective-type-store';
import { AggregationTypesMasterStore } from 'src/app/stores/masters/strategy/aggregation-types.store';
import { AggregationTypesService } from 'src/app/core/services/masters/strategy/aggregation-types/aggregation-types.service';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { data } from 'jquery';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-strategy-objective-modal',
  templateUrl: './strategy-objective-modal.component.html',
  styleUrls: ['./strategy-objective-modal.component.scss']
})
export class StrategyObjectiveModalComponent implements OnInit {
  @Input('source') strategyAreaSource: any;
  @ViewChild('objectiveMasterModal') objectiveMasterModal: ElementRef;
  @ViewChild('objectivePopupModal') objectivePopupModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  UnitMasterStore = UnitMasterStore;
  StrategyStore = StrategyStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  AggregationTypesMasterStore = AggregationTypesMasterStore;
  StrategyInitiativeReviewFrequencyMasterStore = StrategyInitiativeReviewFrequencyMasterStore;
  StrategyObjectiveTypeMasterStore = StrategyObjectiveTypeMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  objectiveMasterSubscription: any;
  targetUnitPercentageValidation : boolean = false;
  strategicObjectiveForm: FormGroup;
  objectiveObject = {
    type: null,
    values: null
  }
  objectivePopupObject = {
    type: null,
    values: null
  }
  AppStore = AppStore 
  openModelPopup: boolean;
  UsersStore = UsersStore;
  formErrors: any;
  ObjectiveMasterStore = ObjectiveMasterStore
  organisationChangesModalSubscription: any;
  constructor(private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, private _usersService: UsersService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService, private _imageService: ImageServiceService,
    private _divisionService: DivisionService, private _sectionService: SectionService,private _departmentService: DepartmentService,
    private _subSectionService: SubSectionService, private _subsidiaryService: SubsidiaryService,private _unitService: UnitService,
    private _strategyObjectiveTypeService:StrategyObjectiveTypeService,private _aggregationTypesService: AggregationTypesService,
    private _service : StrategyService,private _objectiveService : ObjectiveService,
    private _strategyInitiativeReviewFrequencyService: StrategyInitiativeReviewFrequencyService,) { }

  ngOnInit(): void {
    this.objectiveMasterSubscription = this._eventEmitterService.objectiveModalControl.subscribe(res=>{
      this.closeObjectiveMasters();
    })
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    this.strategicObjectiveForm=this._formBuilder.group({
      strategy_profile_objective_id:null,
      objective_id: [null,[Validators.required]],
      start_date:[null,[Validators.required]],
      end_date:[null,[Validators.required]],
      responsible_user_id:[null,[Validators.required]],
      review_user_ids:[null,[Validators.required]],
      weightage:StrategyManagementSettingStore?.strategyManagementSettings?.is_weightage == 1 ? [null,[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]] : [null],
      minimum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maximum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      is_dashboard:[null],
      target : [null],
      target_unit_id : [null],
      aggregation_type_id : [null],
      strategy_objective_type_id:[null],
      strategy_review_frequency_id:[null],
      accountable_user_id: [null],
      organization_ids : [[]],
      division_ids : [[]],
      department_ids :[[]],
      section_ids : [[]],
      sub_section_ids : [[]],
      status_id : [null],
      strategy_profile_focus_area_ids : [[]]
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.strategicObjectiveForm.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.strategicObjectiveForm.controls['section_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.strategicObjectiveForm.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
    this.strategicObjectiveForm.controls['department_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    this.strategicObjectiveForm.controls['organization_ids'].setValidators(Validators.required);

    if(this.strategyAreaSource.type == "Edit"){
      this.setDataForEdit()
    }else{
      this.setInitialOrganizationLevels()
      this.patchDates()
      this.strategicObjectiveForm.patchValue({
        weightage : StrategyStore.remainingWeightage
      })
    }
     this.getObjectives();
     this.getUsers();
     this.getAggrigationType();
     this.openTargetUnit();
     this.openFocus();
    // this.getSubsidiary();
    // this.getDivision();
    // this.getDepartment();
    // this.getSection();
    // this.getSubSection();
    
    
  }

  setDataForEdit(){
    if(this.strategyAreaSource.value){
      this.searchObjective({term:this.strategyAreaSource.value.id})
      this.strategicObjectiveForm.patchValue({
      strategy_profile_objective_id : this.strategyAreaSource.value.id,
      objective_id: this.strategyAreaSource.value.objective.id,
      start_date:this.strategyAreaSource.value.start_date ? this._helperService.processDate(this.strategyAreaSource.value.start_date,'split') : [],
      end_date:this.strategyAreaSource.value.end_date ? this._helperService.processDate(this.strategyAreaSource.value.end_date,'split') : [],
      responsible_user_id: this.strategyAreaSource.value.responsible_users,
      review_user_ids: this.strategyAreaSource.value.review_users ? this.strategyAreaSource.value.review_users : [],
      accountable_user_id: this.strategyAreaSource.value?.accountable_user ? this.strategyAreaSource.value?.accountable_user : null,
      weightage:Number(this.strategyAreaSource.value.weightage),
      target : this.strategyAreaSource.value.target,
      target_unit_id : this.strategyAreaSource.value?.target_unit_id ? this.strategyAreaSource.value?.target_unit_id : null,
      aggregation_type_id : this.strategyAreaSource.value?.aggregation_type ? this.strategyAreaSource.value?.aggregation_type?.id : null,
      strategy_objective_type_id : this.strategyAreaSource.value?.strategy_objective_type ? this.setObjectivetype() : null,
      strategy_review_frequency_id : this.strategyAreaSource.value?.strategy_review_frequencies ? this.setFrequncy() : null,
      organization_ids : this.strategyAreaSource.value.organizations,
      division_ids : this.strategyAreaSource.value.divisions,
      department_ids :this.strategyAreaSource.value.departments,
      section_ids : this.strategyAreaSource.value.sections,
      sub_section_ids : this.strategyAreaSource.value.sub_sections,
      status_id : this.strategyAreaSource.value.status.id,
      is_dashboard: this.strategyAreaSource.value?.is_dashboard == 1 ? true : false,
      minimum: this.strategyAreaSource.value.minimum ? this.strategyAreaSource.value.minimum: '',
      maximum:  this.strategyAreaSource.value.maximum ?  this.strategyAreaSource.value.maximum: '',
      strategy_profile_focus_area_ids : this.strategyAreaSource.value.strategy_profile_focus_areas ? this.getData(this.strategyAreaSource.value.strategy_profile_focus_areas) : []
      })
    }
  }

  setFrequncy(){
    let frequncyDet ={
      title : this.strategyAreaSource.value?.strategy_review_frequencies?.strategy_kpi_data_type_language[0]?.pivot?.title,
      id : this.strategyAreaSource.value?.strategy_review_frequencies.id
    }
    return frequncyDet    
  }

  setObjectivetype(){
    let objectivetypeData ={
      title : this.strategyAreaSource.value?.strategy_objective_type?.title,
      id : this.strategyAreaSource.value?.strategy_objective_type.id
    }
    return objectivetypeData    
  }

  setInitialOrganizationLevels(){
    let user= AuthStore.user
    user.first_name = user.name
    this.strategicObjectiveForm.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids:AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []

      // reported_by : user ? user : null  
      

    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.strategyForm.patchValue({ organization_id: AuthStore.user?.organization});
    // }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.strategicObjectiveForm.value.division_ids[0]?.id});
    this.searchDepartment({term: this.strategicObjectiveForm.value.department_ids[0]?.id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.strategicObjectiveForm.value.section_ids[0]?.id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.strategicObjectiveForm.value.sub_section_ids[0]?.id});
    this._utilityService.detectChanges(this._cdr);
  }

  cancel(){
    this.resetForm();
    AppStore.disableLoading();
    this._eventEmitterService.dismissStrategyObjectiveModal();
  }

  openObjectiveTargetModal(){
    this.objectivePopupObject.type = 'Add';
    this._renderer2.addClass(this.objectivePopupModal.nativeElement,'show');
    this._renderer2.setStyle(this.objectivePopupModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.objectivePopupModal.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr);
  }

  resetForm(){
    this.strategicObjectiveForm.reset();
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 


  getObjectives(){
   this._objectiveService.getItems().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
   })
  }

  searchObjective(e,patchValue:boolean = false){
    this._objectiveService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.strategicObjectiveForm.patchValue({ objective_id: i.id });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getUsers() {
    
    let params = '';
    if (StrategyStore.induvalStrategyProfile?.departments)
        params = StrategyStore.induvalStrategyProfile?.departments ? `?department_ids=${this.getEditValue(StrategyStore.induvalStrategyProfile?.departments)}` : ''
    this._usersService.getAllItems(params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id);
    }
    return returnValue;
  }

  getData(value, item?) {
    let data = [];
    for(let i of value) {
      if (item){
        i['title'] = i?.focus_area?.title;
        data.push(i.id);
      }
      else{
        i['title'] = i?.focus_area?.title
        data.push(i);
      }
      
    }
    return data;
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

  searchUsers(searchTerm: any) {
    this._usersService.getAllItems('?q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
  }

  openObjectiveMasters(){
    this.objectiveObject.type = 'Add';
    this._renderer2.addClass(this.objectiveMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.objectiveMasterModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.objectiveMasterModal.nativeElement,'z-index',99999);
  }

  closeObjectiveMasters(){
    this.objectiveObject.type = null;
    this._renderer2.removeClass(this.objectiveMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.objectiveMasterModal.nativeElement,'display','none');
    this._renderer2.setStyle(this.objectiveMasterModal.nativeElement,'z-index',9999);
    this.searchObjective({term : ObjectiveMasterStore.lastInsertedId},true)

  }

  patchDates(){
    this.strategicObjectiveForm.patchValue({
      start_date : StrategyStore.start_date ? StrategyStore.start_date : null,
      end_date : StrategyStore.start_date ? StrategyStore.end_date : null
    })
  }

  processData(){
    let saveData = {
       
      strategy_profile_objective_id : this.strategicObjectiveForm.value.strategy_profile_objective_id ? this.strategicObjectiveForm.value.strategy_profile_objective_id : null,
      objective_id: this.strategicObjectiveForm.value.objective_id ? this.strategicObjectiveForm.value.objective_id : [],
      strategy_profile_focus_area_ids : this.strategicObjectiveForm.value.strategy_profile_focus_area_ids ? this.getData(this.strategicObjectiveForm.value.strategy_profile_focus_area_ids,'id') : [],
      start_date:this.strategicObjectiveForm.value.start_date ? this._helperService.processDate(this.strategicObjectiveForm.value.start_date,'join') : [],
      end_date:this.strategicObjectiveForm.value.end_date ? this._helperService.processDate(this.strategicObjectiveForm.value.end_date,'join') : [],
      responsible_user_ids:this.strategicObjectiveForm.value.responsible_user_id ? this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.responsible_user_id,'id') : [],
      weightage:this.strategicObjectiveForm.value.weightage ? this.strategicObjectiveForm.value.weightage : [],
      target : this.strategicObjectiveForm.value.target,
      target_unit_id : this.strategicObjectiveForm.value.target_unit_id ? this.strategicObjectiveForm.value.target_unit_id?.id : null,
      aggregation_type_id : this.strategicObjectiveForm.value.aggregation_type_id ? this.strategicObjectiveForm.value.aggregation_type_id : null,
      strategy_objective_type_id : this.strategicObjectiveForm.value.strategy_objective_type_id ? this.strategicObjectiveForm.value.strategy_objective_type_id?.id : null,
      review_user_ids:this.strategicObjectiveForm.value.review_user_ids ? this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.review_user_ids,'id') : [],
      strategy_review_frequency_id : this.strategicObjectiveForm.value.strategy_review_frequency_id ? this.strategicObjectiveForm.value.strategy_review_frequency_id?.id : null,
      accountable_user_id : this.strategicObjectiveForm.value.accountable_user_id ? this.strategicObjectiveForm.value.accountable_user_id.id : null,
      organization_ids : this.strategicObjectiveForm.value.organization_ids ?this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids : this.strategicObjectiveForm.value.division_ids ?this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids :this.strategicObjectiveForm.value.department_ids ? this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids : this.strategicObjectiveForm.value.section_ids ? this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids : this.strategicObjectiveForm.value.sub_section_ids ? this._helperService.getArrayProcessed(this.strategicObjectiveForm.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
      status_id : this.strategicObjectiveForm.value.status_id ? this.strategicObjectiveForm.value.status_id : 1,
      is_dashboard: this.strategicObjectiveForm.value.is_dashboard == true ? 1: 0,
      minimum: this.strategicObjectiveForm.value.minimum ? this.strategicObjectiveForm.value.minimum: '',
      maximum: this.strategicObjectiveForm.value.maximum ? this.strategicObjectiveForm.value.maximum: '',
      // strategy_profile_focus_area_id : this.strategicObjectiveForm.value.strategy_profile_focus_area_id ? this.strategicObjectiveForm.value.strategy_profile_focus_area_id : StrategyStore.focusAreaId,
    };
    this._helperService.getArrayProcessed
   
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      delete saveData.organization_ids;
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

    return saveData;
  }

  save(close: boolean = false){
    AppStore.enableLoading();
    let save 
     if(this.strategyAreaSource.type =="Edit"){
      save = this._service.updateObjectives(this.processData(),this.strategyAreaSource.value.id)
     }else{
       save = this._service.saveObjectives(this.processData())
     }
     save.subscribe(res=>{
       StrategyStore.setObjectiveId(res.id);
      if(close) 
      // this.cancel();
      this.openObjectiveTargetModal();
      else 
      this.resetForm();
      this.openObjectiveTargetModal();
      this.patchDates()
      AppStore.disableLoading();
     }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
         this.cancel();;
        }
        else if (err.status == 423) {
          this._utilityService.showErrorMessage("error",err.error.message ) 
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
  
  }

  setTopObjective(event) {
    this.strategicObjectiveForm.patchValue({
      is_dashboard: event.target.checked
    })
  }

  getDepartment(){
    if (this.strategicObjectiveForm.value.organization_ids) {
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids : '')
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DepartmentStore.setAllDepartment([]);
    }
  }


  getDivision(){
    if(this.strategicObjectiveForm.value.organization_ids){
      let parameters = this.strategicObjectiveForm.value.organization_ids;
      this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DivisionStore.setAllDivision([]);
    }
  }

  getSection(){
    if(this.strategicObjectiveForm.value.organization_ids){
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids : '')
      +'&department_ids='+(this.strategicObjectiveForm.value.department_ids ? this.strategicObjectiveForm.value.department_ids : '')
      this._sectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SectionStore.setAllSection([]);
      this.strategicObjectiveForm.controls["section_ids"].reset()
    }
  }


  getSubSection(){
    if(this.strategicObjectiveForm.value.organization_ids){
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids : '')
      +'&department_ids='+(this.strategicObjectiveForm.value.department_ids ? this.strategicObjectiveForm.value.department_ids : '')
      +'&section_ids='+(this.strategicObjectiveForm.value.section_ids ? this.strategicObjectiveForm.value.section_ids : '')
      this._subSectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SubSectionStore.setAllSubSection([]);
    }
  } 

  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this.strategicObjectiveForm.patchValue({organization_ids:[res.data[0]]});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSubsidiary(e) {
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  
  searchDepartment(e){
  
    if(this.strategicObjectiveForm.value.organization_id){
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids[0].id : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids[0].id : '');
      this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchDivision(e){
    if(this.strategicObjectiveForm.value.organization_ids){
      let parameters = this.strategicObjectiveForm.value.organization_ids[0]?.id;
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchSection(e){
    if(this.strategicObjectiveForm.value.organization_ids){
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids[0].id : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids[0].id : '')
      +'&department_ids='+(this.strategicObjectiveForm.value.department_ids ? this.strategicObjectiveForm.value.department_ids[0].id : '')
      this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e){
    if(this.strategicObjectiveForm.value.organization_ids){
      var params = '';
      params = '&organization_ids='+(this.strategicObjectiveForm.value.organization_ids ? this.strategicObjectiveForm.value.organization_ids[0].id : '')
      +'&division_ids='+(this.strategicObjectiveForm.value.division_ids ? this.strategicObjectiveForm.value.division_ids[0].id : '')
      +'&department_ids='+(this.strategicObjectiveForm.value.department_ids ? this.strategicObjectiveForm.value.department_ids[0].id : '')
      +'&section_ids='+(this.strategicObjectiveForm.value.section_ids ? this.strategicObjectiveForm.value.section_ids[0].id : '')
      this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = true;
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.strategicObjectiveForm.patchValue({
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
  
  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  openTargetUnit(){
    this._unitService.getItems(true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchUnit(e,patchValue:boolean = false){
    this._unitService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.strategicObjectiveForm.patchValue({ target_unit_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchAggregationType(e,patchValue:boolean = false){
    this._aggregationTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.type == e.term){
            this.strategicObjectiveForm.patchValue({ aggregation_type_id: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchObjectiveType(e,patchValue:boolean = false){
    this._strategyObjectiveTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.strategicObjectiveForm.patchValue({ strategy_objective_type_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openObjectiveType(){
    this._strategyObjectiveTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFrequncy(){
    this._strategyInitiativeReviewFrequencyService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getAggrigationType(){
    this._aggregationTypesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  // selectedAggregationTypeChange(event){
  //   if(this.strategicObjectiveForm.value.aggregation_type_id == 2){
  //     for(let i of UnitMasterStore.allItems){
  //       if(i.title == '%' || i.title == 'percentage'){
  //         this.searchAggregationType({term : i.id},true)
  //       }
  //     }
  //     this._utilityService.detectChanges(this._cdr)
  //   }
  // }

  selectedTargetUnitChange(event){
    let unit = this.strategicObjectiveForm.value.target_unit_id?.title.toLowerCase();
    if(unit == 'percentage22' || unit == '%'){
      this._aggregationTypesService.getItems(false, null, true).subscribe(res =>{
        for(let i of res.data){
          if(i.type == 'average'){
            this.searchAggregationType({term : i.type},true)
          }
        }
        this._utilityService.detectChanges(this._cdr)
      })
      
      this._utilityService.detectChanges(this._cdr)
    }
  }

  targetUnitValidation() {
    let unit = this.strategicObjectiveForm.value.target_unit_id?.title.toLowerCase();

    if(unit == 'percentage' || this.strategicObjectiveForm.value.target_unit_id?.title == '%')
    return false
    else
    return true
  }

  openFocus(){
    this._service.focusAreaList(false,'?is_closed=0').subscribe(res=>{
     this._utilityService.detectChanges(this._cdr);
    })
   }

  ngOnDestroy(){
    this.objectiveMasterSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    OrganizationalSettingsStore.isMultiple = false;
  }
}
