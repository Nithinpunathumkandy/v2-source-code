import { Component, ElementRef, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { IReactionDisposer, autorun } from "mobx";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
// import { InitiativeStore } from '../../../initiative.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { StrategyInitiativeActionsService } from 'src/app/core/services/masters/strategy/strategy-initiative-actions/strategy-initiative-actions.service';
import { StrategyInitiativeActionsMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-actions.store';
import { StrategyInitiativeReviewFrequencyService } from 'src/app/core/services/masters/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.service';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { StrategyInitiativeReviewFrequencyMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { HttpErrorResponse } from '@angular/common/http';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';

declare var $: any;

@Component({
  selector: 'app-add-initiative',
  templateUrl: './add-initiative.component.html',
  styleUrls: ['./add-initiative.component.scss']
})
export class AddInitiativeComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('milestoneModal', {static: true}) milestoneModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('formActionModal', { static: true }) formActionModal: ElementRef;
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;
  @ViewChild('actionPlanModal', {static: true}) actionPlanModal: ElementRef;




  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationModulesStore = OrganizationModulesStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  SubsidiaryStore = SubsidiaryStore
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  SectionMasterStore = SectionMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  NoDataItemStore = NoDataItemStore;
  AppStore = AppStore 
  AuthStore = AuthStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  UsersStore = UsersStore
  // InitiativeStore = InitiativeStore
  StrategyStore = StrategyStore
  StrategyInitiativeReviewFrequencyMasterStore = StrategyInitiativeReviewFrequencyMasterStore
  is_save: boolean=false;
  nextButtonText = "Next";
  currentTab = 0;
  confirmationEventSubscription: any = null;
  mileStoneModalSubscription: any = null;
  reviewUserEnabled:boolean = false;

  actionPlanObject = {
    milestoneID:null,
    type: null,
    value: null
  }

  milestoneObject = {
    type: null,
    value: null
  }

  otherResponsibleUsersObject = {
    type: null,
    value: null
  }

  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  unitObject = {
    component: 'Master',
    values: null,
    type: null
  };
  strategyInitiativeActionsObject = {
    component: 'Master',
    values: null,
    type: null
  };

  form: FormGroup;
  formErrors: any;
  formObject = {
    0:[
      'strategy_profile_id',
      // 'strategy_profile_focus_area_id',
      // 'strategy_profile_objective_id',
      'start_date',
      'end_date',
      'budget',
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'target',
      'target_unit_id',
      'weightage',
      'responsible_user_ids',
      'strategy_review_frequency_id'
    ],
    1:[
      
    ],
  }

 
  kpiArray: any[] = [];
  organisationChangesModalSubscription: any;
  openModelPopup: boolean;
  StrategyInitiativeActionsMasterStore = StrategyInitiativeActionsMasterStore
  UnitMasterStore = UnitMasterStore
  startDate: any;
  endDate: any;
  StrategyInitiativeStore =  StrategyInitiativeStore
  unitSubscriptionEvent: any;
  strategyInitiativeActionsSubscriptionEvent: any;
  otherResponsibleUsersSubscription: any;
  actionPlanModalSubscription: any;
  actionPlanArray: any[]=[];
  selectedObjectiveStartDate: any = '';
  selectedObjectiveEndDate: any = '';
  dateExceeded: boolean = false;
  milestoneReq = "1";
  
  constructor(private _renderer2: Renderer2, private _utilityService: UtilityService,private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef, private _router: Router, private _eventEmitterService: EventEmitterService,

    private _userService: UsersService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _profileService : StrategyService,
    private _initiativeService : InitiativeService,
    private _initiativeActionService:StrategyInitiativeActionsService,
    private _strategyInitiativeReviewFrequencyService: StrategyInitiativeReviewFrequencyService,
    private _unitService: UnitService,




    ) { }
 
  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: StrategyInitiativeStore.is_mileStoneReq == 1 ? 'New Milestones' : 'New Action Plans'});
    if(!AuthStore.getActivityPermission(3200,'CREATE_STRATEGY_INITIATIVE_MILESTONE')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    this.reactionDisposer = autorun(() => { 
      if(NoDataItemStore.clikedNoDataItem){
        this.openActionPlanOrMileStone();
       NoDataItemStore.unSetClickedNoDataItem();
     }
     })
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: "../" }
    ]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    setTimeout(() => {
      if(!StrategyInitiativeStore.is_actionPlan){
        this.showTab(this.currentTab);
      }
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      this.delete(item);
    })

    this.mileStoneModalSubscription = this._eventEmitterService.mileStoneModal.subscribe(res=>{
      this.closeMileStoneModal();
      this.getMilestoneList()
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      });

      this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res=>{
        this.closeResponsibleUsersModal();
      })

       // for closing the modal
       this.unitSubscriptionEvent = this._eventEmitterService.humanCapitalUnitControl.subscribe(res => {
        this.closeFormModal();
      })

        // for closing the modal
    this.strategyInitiativeActionsSubscriptionEvent = this._eventEmitterService.strategyInitiativeAction.subscribe(res => {
      this.closeActionFormModal();
    })

    this.actionPlanModalSubscription = this._eventEmitterService.actionPlanModal.subscribe(res=>{
      this.closeactionPlanModal();
    });

    this.form = this._formBuilder.group({
      id: [''],
      strategy_profile_id: [null,[Validators.required] ],
      strategy_profile_focus_area_ids : [[]],
      strategy_profile_objective_ids : [[]],
      kpi: ['',],
      strategy_initiative_action_id : [null],
      start_date : ['',[Validators.required]],
      title  : ['',[Validators.required]],
      end_date : ['',[Validators.required]],
      organization_ids : [[]],
      division_ids : [[]],
      department_ids : [[]],
      section_ids : [[]],
      sub_section_ids : [[]],
      budget : ['',[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      target : ['',[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      minimum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maximum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      target_unit_id : [null],
      weightage : StrategyManagementSettingStore?.strategyManagementSettings?.is_weightage == 1 ? [null,[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]] : [null],
      responsible_user_ids : [null,[Validators.required]],
      review_user_ids : [[]],
      description : '',
      strategy_review_frequency_id : [null,[Validators.required]],
      strategy_profile_status_id : null
      // incident_witness_other_users : [],
      // incident_involved_other_users : [],
      // incident_category_ids : [null],
      // incident_sub_category_ids : [null],
    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.form.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.form.controls['section_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.form.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
    this.form.controls['department_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    this.form.controls['organization_ids'].setValidators(Validators.required);

    if (this._router.url.indexOf('edit') != -1) {
      if (StrategyInitiativeStore.induvalInitiative){
        this.setInitiativeDataForEdit();
        // this.getKpis();
      }
      if(StrategyInitiativeStore.is_actionPlan && StrategyInitiativeStore.is_mileStoneReq == 2){
        this.showTab(1);
        this.currentTab = 1
        this.getMilestoneList();
        this.getActionPlans();
      }
    }else{
      StrategyInitiativeStore._selectedInitiativeId = null
       this.setInitialOrganizationLevels()
       StrategyStore.unsetKpis();

      if(StrategyInitiativeStore.modalFrom == 'profiles')
      this.setProfile();
    }

    this.openProfile();
    this.openFocus();
    // this.openObjective();
    // this.getKpis();
    this.getUsers();


  }

  setProfile(){
    this.form.patchValue({
      strategy_profile_id: StrategyStore.induvalStrategyProfile ? StrategyStore.induvalStrategyProfile : [],
    })
  }

  openReviewUser(){
    if(this.form.value?.strategy_profile_id != null)
    this._profileService.getItem(this.form.value?.strategy_profile_id?.id).subscribe(()=>this._utilityService.detectChanges(this._cdr));
  }

  saveTabDetails(){
    if(this.currentTab==0){
      this.save();
    }
 
  }

  nextPrev(n,status:boolean=false) {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: StrategyInitiativeStore.is_mileStoneReq == 1 ? 'New Milestones' : 'New Action Plans'});
    this.is_save = status
    var x: any = document.getElementsByClassName("tab");
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
        if(this.currentTab==2 && n == 1){
          this._router.navigateByUrl('strategy-management/strategy-initiatives/'+StrategyInitiativeStore.selectedInitiativeId)        }
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    if (this.currentTab >= x.length) {
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      // this.saveAdvancedProcess()
      return false;
    }
    this.showTab(this.currentTab);
  }

  showTab(n) {
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (this.currentTab == 2) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
      // if (document.getElementById("nextBtn"))
      //   document.getElementById("nextBtn").style.display = "none";
    } else {
      this.formatDateInputs();
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
      // if (document.getElementById("nextBtn"))
      //   document.getElementById("nextBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      // if(n==2 && this.is_save && StrategyInitiativeStore.is_mileStoneReq == 2){
      //   this.saveActionPlan();
      // }
      // this.saveDependencies();
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
    } else {
      if(n==1 && this.is_save){
        this.save();
        //  this.isNoteLoaded = true
      }
     
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    }
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

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        this._renderer2.addClass(this.formSteps.nativeElement,'small');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        this._renderer2.removeClass(this.formSteps.nativeElement,'small');
      }
    }
  }

  formatDateInputs() {
    this.startDate = null;
    this.endDate = null;
    // converting start date
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;

      this.startDate = this._helperService.processDate(tempstartdate, 'join');

    }

    // converting end date
    if (this.form.value.end_date) {
      let tempenddate = this.form.value.end_date;

      this.endDate = this._helperService.processDate(tempenddate, 'join')

    }

  }
  // cancel(){
  //   $(this.confirmationPopup.nativeElement).modal('show');
  // }

  deleteMileStone(id){//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'Milestone';
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "Are you sure want to Delete"
   setTimeout(() => {
    $(this.confirmationPopup.nativeElement).modal('show');

   }, 250);
  }

  cancel(){
    // this._router.navigateByUrl('/incident-management/incidents')
    this.deleteObjects.title = 'Cancel?';
    this.deleteObjects.type = 'Cancel';
    this.deleteObjects.subtitle = 'This action cannot be undone'
    setTimeout(() => {
      $(this.confirmationPopup.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  
  delete(status) {//delete
    let deleteId = [];
    let deleteData;

    if (status) {  
      switch(this.deleteObjects.title){
        case 'Milestone':
              deleteData = this._initiativeService.deleteMileStone(this.deleteObjects.id);
          break;
          case 'Cancel?':
            setTimeout(() => {
              $(this.confirmationPopup.nativeElement).modal('hide');
            }, 250);
               this._router.navigateByUrl('/strategy-management/strategy-initiatives')
          break;
      }

      deleteData.subscribe(resp => {
        // if(this.deleteObjects.title == 'notes'){
        //   this.getStrategyNotes();
        // }else if(this.deleteObjects.title == 'focusarea'){
        //   this.getFocusAreas()
        // }else if(this.deleteObjects.title == 'objective'){
        //   this.getObjectives(this.selectedFocusAreaId)
        // }else if(this.deleteObjects.title == 'kpi'){
        //   this.getKpiList()
        // }
          this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopup.nativeElement).modal('hide');
    }, 250);
  
  }

  clearDeleteObject() {//delete
    this.deleteObjects.id = null;
  }

  // cancelIssueForm(status){
  //   $(this.confirmationPopup.nativeElement).modal('hide');
  //   if(status)
  //     this._router.navigateByUrl('/strategy-management/strategy-initiatives');
  // }

  openActionPlanOrMileStone(){
    if(StrategyInitiativeStore.is_mileStoneReq == 1){
      this.openMileStoneModal()
    }else if(StrategyInitiativeStore.is_mileStoneReq == 2){
      this.openActionPlanModal()
    }
  }

  openActionPlanModal(mileStoneId?){
    this.actionPlanObject.milestoneID = mileStoneId ? mileStoneId : null;
    this.actionPlanObject.type = 'Add';
    this.openActionPlan()

  }

  openActionPlan(){
    StrategyInitiativeStore.selectedEndDate = this.form.value.end_date;
    StrategyInitiativeStore.selectedStrartDate = this.form.value.start_date;
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.actionPlanModal.nativeElement,'show');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'z-index',99999);
  }

  closeactionPlanModal(){
    this.setActionPlans()
      this.getActionPlans();
      this.getMilestoneList();
    setTimeout(() => {
      // $(this.actionPlanModal.nativeElement).modal('hide');
      this.actionPlanObject.type = null;
      this.actionPlanObject.value = null;
      this._renderer2.removeClass(this.actionPlanModal.nativeElement,'show');
      this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editActionPlan(plan,mileStoneId?){
    this.actionPlanObject.milestoneID = mileStoneId ? mileStoneId : null;
    this.actionPlanObject.value = plan;
    this.actionPlanObject.type = "Edit";
    this.openActionPlan()

  }

  getActionPlans(){
    this._initiativeService.getActionPlan().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      this.setActionPlans()
    })
  }

  deletePlan(plans,num){
    var pos = this.actionPlanArray.findIndex(e => e.title == plans.title);
    if (pos != -1)
    this.actionPlanArray.splice(pos, 1);

  for(let data of StrategyInitiativeStore.actionPlans){
      if(plans.title == data.title && data.id){
        data.is_deleted = 1
      }else if(plans.title == data.title && !data.id){
        var pos = StrategyInitiativeStore.actionPlans.findIndex(e => e.title == plans.title);
       if (pos != -1)
        StrategyInitiativeStore.actionPlans.splice(pos, 1);
      }
    }
  }

  setActionPlans(){
    this.actionPlanArray = []
    if(StrategyInitiativeStore.actionPlans.length >0){
      StrategyInitiativeStore.actionPlans.map(data=>{
        this.actionPlanArray.push(data)
      })
    }
  }

  openMileStoneModal(){
    this.milestoneObject.type = 'Add';
    if(StrategyInitiativeStore.milesstones.length > 0){
      StrategyInitiativeStore.mileStoneStartDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].start_date,'split')
      StrategyInitiativeStore.mileStoneEndDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].end_date,'split')
    }
    this.openMileStone()
  }
  openMileStone(){
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.milestoneModal.nativeElement,'show');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'z-index',99999);
  }

  closeMileStoneModal(){
    setTimeout(() => {
      // $(this.milestoneModal.nativeElement).modal('hide');
      this.milestoneObject.type = null;
      this.milestoneObject.value = null;
      this._renderer2.removeClass(this.milestoneModal.nativeElement,'show');
      this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  changeProfile(){
    
    StrategyStore._strategyProfileId = this.form.value.strategy_profile_id.id
    this.reviewUserEnabled = true;
    this.form.patchValue({
      strategy_profile_focus_area_ids : null,
      strategy_profile_objective_ids : null
    })
    StrategyStore._kpis = [];
    this._utilityService.detectChanges(this._cdr);

  }

  closeProfile(){
    this.reviewUserEnabled = false;
    this.form.patchValue({
      strategy_profile_focus_area_ids : null,
      strategy_profile_objective_ids : null
    })
    StrategyStore._kpis = [];
    this.openProfile();
    this._utilityService.detectChanges(this._cdr);
  }

  openProfile(){
     
   this._profileService.getItems(false,'&is_closed=0').subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);

   })
  }

  serarchProfile(e){
    let params = '&is_closed=0&q=' + e.term
    this._profileService.getItems(false, params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
  
     })
  }
  openFocus(){
   this._profileService.focusAreaList(false,'?is_closed=0').subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
   })
  }

  // changeFocusArea(){
  //   StrategyStore.setFocusAreaId(this.form.value.strategy_profile_focus_area_id.id)
  //   this.form.value.strategy_profile_objective_id = [];
  //   StrategyStore._kpis = [];
  //   this._utilityService.detectChanges(this._cdr);
  // }

  changeObjective(){
    this.selectedObjectiveStartDate = this._helperService.processDate(this.form.value.strategy_profile_objective_ids.start_date,'split');
    this.selectedObjectiveEndDate = this._helperService.processDate(this.form.value.strategy_profile_objective_ids.end_date,'split')
    StrategyStore.setObjectiveId(this.form.value.strategy_profile_objective_ids.id)
    StrategyStore._kpis = [];
    if (this._router.url.indexOf('edit') == -1){
      this.form.patchValue({
        start_date : this._helperService.processDate(this.form.value.strategy_profile_objective_ids.start_date,'split'),
        end_date: this._helperService.processDate(this.form.value.strategy_profile_objective_ids.end_date,'split')
      })
      this._utilityService.detectChanges(this._cdr);
    }
    this.getKpis()
    this._utilityService.detectChanges(this._cdr);

  }
  
  openObjective(){
    // if(this.form.value.strategy_profile_focus_area_id[0].id){
    //   this._profileService.objectivesList(this.form.value.strategy_profile_focus_area_ids[0].id,false,'?is_closed=0' ).subscribe(res=>{
    //     this._utilityService.detectChanges(this._cdr);
    //    })
    // }
    this._profileService.getObjectiveList('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
     })
  }
  
  openAction(){
    this._initiativeActionService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openTargetUnit(){
    this._unitService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  openFrequncy(){
    this._strategyInitiativeReviewFrequencyService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getKpis(){
    this._profileService.getAllKpis(false,'?is_closed=0').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getUsers(){
    let params = '?department_ids=' +this._helperService.createParameterFromArray(this.form.get('department_ids').value)
    this._userService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setInitiativeDataForEdit(){
    this.form.patchValue({
      title: StrategyInitiativeStore.induvalInitiative.title ? StrategyInitiativeStore.induvalInitiative.title : '',
      description: StrategyInitiativeStore.induvalInitiative.description ? StrategyInitiativeStore.induvalInitiative.description : '',
      start_date: StrategyInitiativeStore.induvalInitiative.start_date ? this._helperService.processDate( StrategyInitiativeStore.induvalInitiative.start_date,'split') : '',
      end_date: StrategyInitiativeStore.induvalInitiative.end_date  ? this._helperService.processDate(StrategyInitiativeStore.induvalInitiative.end_date,'split') : '',
      budget: StrategyInitiativeStore.induvalInitiative.budget ? StrategyInitiativeStore.induvalInitiative.budget : '',
      // organization_ids: StrategyInitiativeStore.induvalInitiative.organization ? StrategyInitiativeStore.induvalInitiative.organization : null,
      // division_ids: StrategyInitiativeStore.induvalInitiative.division ? StrategyInitiativeStore.induvalInitiative.division : null,
      // department_ids: StrategyInitiativeStore.induvalInitiative.department ? StrategyInitiativeStore.induvalInitiative.department : null,
      // section_ids: StrategyInitiativeStore.induvalInitiative.section ? StrategyInitiativeStore.induvalInitiative.section : null,
      // sub_section_ids: StrategyInitiativeStore.induvalInitiative.sub_section ? StrategyInitiativeStore.induvalInitiative.sub_section : null,
      division_ids: this.getData(StrategyInitiativeStore.induvalInitiative.divisions),
      department_ids: this.getData(StrategyInitiativeStore.induvalInitiative.departments),
      section_ids: this.getData(StrategyInitiativeStore.induvalInitiative.sections),
      sub_section_ids: this.getData(StrategyInitiativeStore.induvalInitiative.sub_sections),
      organization_ids: this.getData(StrategyInitiativeStore.induvalInitiative.organizations),
      minimum: StrategyInitiativeStore.induvalInitiative?.minimum ? StrategyInitiativeStore.induvalInitiative?.minimum: '',
      maximum:  StrategyInitiativeStore.induvalInitiative?.maximum ?  StrategyInitiativeStore.induvalInitiative?.maximum: '',
      target_unit_id : StrategyInitiativeStore.induvalInitiative.target_unit_id ? StrategyInitiativeStore.induvalInitiative.target_unit_id : [],
      target : StrategyInitiativeStore.induvalInitiative.target ? StrategyInitiativeStore.induvalInitiative.target : [],
      weightage : StrategyInitiativeStore.induvalInitiative.weightage ? Number(StrategyInitiativeStore.induvalInitiative.weightage) : [],
      responsible_user_ids : StrategyInitiativeStore.induvalInitiative.responsible_users ? this.getEditValue(StrategyInitiativeStore.induvalInitiative.responsible_users) : [],
      review_user_ids : StrategyInitiativeStore.induvalInitiative.review_users ? this.getEditValue(StrategyInitiativeStore.induvalInitiative.review_users) : [],
      strategy_review_frequency_id : StrategyInitiativeStore.induvalInitiative.strategy_review_frequency ? this.setFrequncy() : [],
      strategy_profile_id: StrategyInitiativeStore.induvalInitiative.strategy_profile ? StrategyInitiativeStore.induvalInitiative.strategy_profile : [],
      strategy_profile_focus_area_ids : StrategyInitiativeStore.induvalInitiative.strategy_profile_focus_areas ? this.getArrayData(StrategyInitiativeStore.induvalInitiative.strategy_profile_focus_areas,'focusArea') : [],
      strategy_profile_objective_ids : StrategyInitiativeStore.induvalInitiative.strategy_profile_objectives ?  this.getArrayData(StrategyInitiativeStore.induvalInitiative.strategy_profile_objectives,'objectives'): [],   
      strategy_initiative_action_id : StrategyInitiativeStore.induvalInitiative.strategy_initiative_action ? StrategyInitiativeStore.induvalInitiative.strategy_initiative_action : [],
      strategy_profile_status_id : StrategyInitiativeStore.induvalInitiative.strategy_initiative_status ? StrategyInitiativeStore.induvalInitiative.strategy_initiative_status.id : 1
    })
     if(StrategyInitiativeStore.induvalInitiative){
      StrategyInitiativeStore.induvalInitiative.kpis.map(data=>{
        this.kpiArray.push(data);
        this.checkSelectedStatus(data.id)
      })
     }
    //  this.selectedObjectiveStartDate = this._helperService.processDate(StrategyInitiativeStore.induvalInitiative.strategy_profile_objective.start_date,'split');
    //  this.selectedObjectiveEndDate = this._helperService.processDate(StrategyInitiativeStore.induvalInitiative.strategy_profile_objective.end_date,'split');
     StrategyInitiativeStore.is_mileStoneReq = StrategyInitiativeStore.induvalInitiative.is_milestone ? StrategyInitiativeStore.induvalInitiative.is_milestone : null;
     this.getKpis();
    this._utilityService.detectChanges(this._cdr);
    
  }

  getData(value, user?) {
    let data = [];
    for(let i of value) {
      if (user)
      data.push(user == 'user' ? i.user : i.id);
      else
      data.push(i);
    }
    return data;
  }

  getArrayData(value, item){
    let data = [];
    for(let i of value) {
      if (item == 'focusArea')
      i['title']= i?.focus_area?.title;
      else if(item == 'objectives')
      i['title']= i?.objective?.title

      data.push(i);
    }
    return data;
  }

  getEditKpi(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.id );
    }
    return returnValues;
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i);
    }
    return returnValues;
  }

  setObjecctiveId(){
    let objectiveDet ={
      title : StrategyInitiativeStore.induvalInitiative.strategy_profile_objective.objective.title,
      id : StrategyInitiativeStore.induvalInitiative.strategy_profile_objective.id
    }
    return objectiveDet
      
  }

  setFocusAreaId(){
    let focusAreaDet ={
      title : StrategyInitiativeStore.induvalInitiative.strategy_profile_focus_area.focus_area.title,
      id : StrategyInitiativeStore.induvalInitiative.strategy_profile_focus_area.id
    }
    return focusAreaDet
      
  }

  setFrequncy(){
    let frequncyDet ={
      title : StrategyInitiativeStore.induvalInitiative.strategy_review_frequency.strategy_kpi_data_type_language[0].pivot.title,
      id : StrategyInitiativeStore.induvalInitiative.strategy_review_frequency.id
    }
    return frequncyDet
      
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  

  setInitialOrganizationLevels(){
    let user= AuthStore.user
    user.first_name = user.name
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division]: [],
      department_ids:AuthStore?.user?.department ? [AuthStore?.user?.department]: [],
      section_ids:AuthStore?.user?.section ? [AuthStore?.user?.section]: [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section]: [],
      organization_ids : AuthStore.user?.organization ? [AuthStore.user?.organization] : [],
    });
    
    this._utilityService.detectChanges(this._cdr);
  }


  processDataForSave() {
    let saveData = {
      strategy_profile_id: this.form.value.strategy_profile_id ? this.form.value.strategy_profile_id.id : null,
      strategy_profile_focus_area_ids : this.form.value.strategy_profile_focus_area_ids ? this._helperService.getArrayProcessed(this.form.value.strategy_profile_focus_area_ids,'id') : [],
      strategy_profile_objective_ids : this.form.value.strategy_profile_objective_ids ? this._helperService.getArrayProcessed(this.form.value.strategy_profile_objective_ids,'id') : [],
      // kpi: this.kpiArray ? this.kpiArray : [],
      strategy_initiative_action_id : this.form.value.strategy_initiative_action_id ? this.form.value.strategy_initiative_action_id.id : null,
      start_date : this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date,'join') : '',
      title  : this.form.value.title ? this.form.value.title : '',
      end_date : this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date,'join') : '',
      sub_section_ids: this.form.value.sub_section_ids?.id ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.organization.id],
      section_ids: this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.organization.id],
      organization_ids: this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids: this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.organization.id],
      department_ids: this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.organization.id],
      budget : this.form.value.budget ? this.form.value.budget : '',
      target : this.form.value.target ? this.form.value.target : null,
      target_unit_id : this.form.value.target_unit_id ? this.form.value.target_unit_id.id : null,
      minimum: this.form.value.minimum ? this.form.value.minimum: '',
      maximum: this.form.value.maximum ? this.form.value.maximum: '',
      weightage : this.form.value.weightage ? this.form.value.weightage : null,
      review_user_ids : this.form.value.review_user_ids ?  this._helperService.getArrayProcessed(this.form.value.review_user_ids,'id') : [],
      responsible_user_ids : this.form.value.responsible_user_ids ?  this._helperService.getArrayProcessed(this.form.value.responsible_user_ids,'id') : [],
      description : this.form.value.description ? this.form.value.description : null,
      strategy_review_frequency_id : this.form.value.strategy_review_frequency_id ? this.form.value.strategy_review_frequency_id.id : null,
      strategy_profile_objective_kpi_ids : this.kpiArray ? this.getEditKpi(this.kpiArray) : [],
      strategy_profile_status_id : this.form.value.strategy_profile_status_id ? this.form.value.strategy_profile_status_id : 1,
      is_milestone : StrategyInitiativeStore.is_mileStoneReq
     };

     this._helperService.getArrayProcessed
 
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

   save(close : boolean = false){
     StrategyInitiativeStore.profilemileStoneStartDate = this.form.value.start_date
     StrategyInitiativeStore.profilemileStoneEndDate = this.form.value.end_date
    let save 
    if(StrategyInitiativeStore.selectedInitiativeId || this._router.url.indexOf('edit') != -1 ){
      save = this._initiativeService.updateStrategyInitiatives(this.processDataForSave(),StrategyInitiativeStore.selectedInitiativeId  );
    }else{
      save = this._initiativeService.saveStrategyInitiatives(this.processDataForSave());

    }
     save.subscribe(res=>{
        if(res.id){
           StrategyInitiativeStore.setInitiativeId(res.id);
        }
        this.getMilestoneList()

        StrategyInitiativeStore._actionPlans = []
        if(StrategyInitiativeStore.actionPlans.length == 0){
          this.getActionPlans()
        }
        this._utilityService.detectChanges(this._cdr);
        // this.strategyForm.reset();
     }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
        //  this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
   }

 


   getActionPlanProcessedData(){
     let data = []
     if(StrategyInitiativeStore.actionPlans){
       for(let i of StrategyInitiativeStore.actionPlans){
        let obj = {
          "id":i.id,
          "is_new" : i.is_new ? i.is_new : 2,
          "is_deleted" : i.is_deleted ? i.is_deleted : 2,
          "title":i.title,
          "start_date": i.start_date,
          "description":i.description ? i.description : null ,
          "end_date": i.end_date,
          "target":i.target,
          "target_unit_id" : i.target_unit_id,
          "responsible_user_ids": i.responsible_users ? this._helperService.getArrayProcessed(i.responsible_users,'id') : []
        }
        if(i.is_deleted==1){
          delete obj.is_new
        }
        
        data.push(obj)
       }
     }
     return data;
   }

  saveActionPlan() {
    if (StrategyInitiativeStore.is_mileStoneReq == 2 && StrategyInitiativeStore.actionPlans.length > 0) {
      let saveObj = {
        strategy_initiative_id: StrategyInitiativeStore.selectedInitiativeId,
        strategy_initiative_action_plans: this.getActionPlanProcessedData().length > 0 ? this.getActionPlanProcessedData() : []
      }
      let save
      save = this._initiativeService.saveActionPlans(saveObj);
      save.subscribe(res => {
        this.setInitialOrganizationLevels()
        StrategyInitiativeStore._actionPlans = [];
        this.getActionPlans();
        this._utilityService.detectChanges(this._cdr);
        // this.strategyForm.reset();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          //  this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      })

    }
  }

   changeMileStone(event){
    StrategyInitiativeStore.is_mileStoneReq = event;
   }


   
  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i]?.valid){
            setValid = false;
            break;
          }
        }
      }
    }
    else{
      for(var i = 0; i < tabNumber; i++){
        if(this.formObject.hasOwnProperty(i)){
          for(let k of this.formObject[i]){
            if(!this.form.controls[k]?.valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

   getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  findOddEven(index){
   let i = index
   
   return i % 2 == 0
   

  }

  checkboxChange(data,event){
    if(event.target.checked){
      this.kpiArray.push(data)

    }else{
     var b_pos = this.kpiArray.findIndex(e=>e.id == data.id)
     if(b_pos != -1){
      this.kpiArray.splice(b_pos,1);
     }
    }
  }

  getMilestoneList(){
    this._initiativeService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
      if(res['data'].length>0){
        StrategyInitiativeStore.mileStoneStartDate = this._helperService.processDate(res['data'].slice(-1)[0].start_date,'split')
        StrategyInitiativeStore.mileStoneEndDate = this._helperService.processDate(res['data'].slice(-1)[0].end_date,'split')
      let date = res['data'].slice(-1)[0].end_date
      let date1 = this._helperService.processDate(StrategyInitiativeStore.profilemileStoneEndDate,'join')
      if( date == date1){
        this.dateExceeded = true
      }
    }
    })

  }

  checkSelectedStatus(id: number) {
    var pos = null;
    pos = this.kpiArray.findIndex(e => e.id == id);
    if (pos != -1) return true;
    else return false;

  }

  selectKpi(event, doc, index) {
    
    var pos = this.kpiArray.findIndex(e => e.id == doc.id);
    if (pos != -1)
    this.kpiArray.splice(pos, 1);
    else
    this.kpiArray.push(doc);

}


checkedAll(){
  if(StrategyStore.kpis.length == this.kpiArray.length) return true
  else return false
}
selectAllKpi(event){
  this.kpiArray = [];
  if(event.target.checked){
    StrategyStore.kpis.map(data=>{
      this.selectKpi(null,data,null);
      this.checkSelectedStatus(data.id)
    })
  }else{
    this.kpiArray = [];
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

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  editMileStone(id){
    this._initiativeService.getInduvalMilestons(id).subscribe(res=>{
      this.milestoneObject.type = 'Edit';
      this.milestoneObject.value = res;
      StrategyInitiativeStore.mileStoneStartDate = StrategyInitiativeStore.profilemileStoneStartDate
      StrategyInitiativeStore.mileStoneEndDate = StrategyInitiativeStore.profilemileStoneEndDate
      res.action_plans.map(data=>{
        StrategyInitiativeStore.setActionPlan(data)
      })
      this.openMileStone()
      this._utilityService.detectChanges(this._cdr);

    })
  }

  changeStep(step){
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
      this.changetab(step)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
      this.changetab(step)
    }  
  }
  changetab(step){
    if(step == 1){
      this.getMilestoneList();
      StrategyInitiativeStore._actionPlans = []
      if (StrategyInitiativeStore.actionPlans.length == 0) {
        this.getActionPlans()
      }
      this._utilityService.detectChanges(this._cdr);
    }
  }

  addNewUnitItem(){
    this.unitObject.type = 'Add';
    this.unitObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

    // for opening modal
    openFormModal() {

      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);
    }
    // for close modal
    closeFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.unitObject.type = null;
      this.searchUnit({term : UnitMasterStore.lastInsertedId},true)

    }

    addNewActioItem(){
      this.strategyInitiativeActionsObject.type = 'Add';
      this.strategyInitiativeActionsObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openActionFormModal();
    }
    
  // for opening modal
  openActionFormModal() { 
    setTimeout(() => {
      $(this.formActionModal.nativeElement).modal('show');
    }, 100);
  }
  
  // for close modal
  closeActionFormModal() {
    $(this.formActionModal.nativeElement).modal('hide');
    this.strategyInitiativeActionsObject.type = null;
    this.strategyInitiativeActionsObject.values = null;
    this.searchAction({term : StrategyInitiativeActionsMasterStore.lastInsertedId},true)

  }

  searchAction(e,patchValue:boolean = false){
    this._initiativeActionService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ strategy_initiative_action_id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUnit(e,patchValue:boolean = false){
    this._unitService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ target_unit_id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  createImageUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  responsibleOthers(users){
    let item = users.slice(0,3)
  return item
 }

 openResponsibleUsersModal(users){
  this.otherResponsibleUsersObject.type = 'Add';
  this.otherResponsibleUsersObject.value = users
  this.openResponsibleUsers()
}
openResponsibleUsers(){
  // $(this.milestoneModal.nativeElement).modal('show');
  this._renderer2.addClass(this.otherResponsibleUsers.nativeElement,'show');
  this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','block');
  this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'z-index',99999);
}

closeResponsibleUsersModal(){
  setTimeout(() => {
    // $(this.otherResponsibleUsers.nativeElement).modal('hide');
    this.otherResponsibleUsersObject.type = null;
    this.otherResponsibleUsersObject.value = null;
    this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement,'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }, 200);
}

  disableReviewUser() {
    // if (this.form.value.strategy_profile_id){
    //   return false;  
    // }
    // else{
    //   return true;
    // }
      
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.confirmationEventSubscription.unsubscribe();
    this.mileStoneModalSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    StrategyStore._kpis = [];
    this.unitSubscriptionEvent.unsubscribe();
    this.strategyInitiativeActionsSubscriptionEvent.unsubscribe();
    this.otherResponsibleUsersSubscription.unsubscribe();
    StrategyInitiativeStore.is_mileStoneReq = 1;
    this.actionPlanModalSubscription.unsubscribe();
    StrategyInitiativeStore._actionPlans = []
    StrategyInitiativeStore.is_actionPlan = false;
    this.dateExceeded = false

  }

}
