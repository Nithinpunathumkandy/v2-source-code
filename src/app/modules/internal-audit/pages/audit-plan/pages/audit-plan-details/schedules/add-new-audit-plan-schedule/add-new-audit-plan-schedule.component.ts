import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import {AuditPlanScheduleMasterStore} from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse} from '@angular/common/http';
import { AuditorsStore } from 'src/app/stores/internal-audit/auditors/auditors-store';
import { AuditorsService } from 'src/app/core/services/internal-audit/auditors/auditors.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { DatePipe } from '@angular/common';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;
@Component({
  selector: 'app-add-new-audit-plan-schedule',
  templateUrl: './add-new-audit-plan-schedule.component.html',
  styleUrls: ['./add-new-audit-plan-schedule.component.scss']
})
export class AddNewAuditPlanScheduleComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('checklistPopup') checklistPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  formObject = {
    0:[
      'audit_plan_id',
      'auditor_ids',
      'auditee_ids',
      'sub_section_id',
      'section_id',
      'organization_id',
      'division_id',
      'department_id'
    ],
    1:[
      'auditable_item_ids'
    ],
    2:[
      'checklist_ids'
    ]
  }
  form: FormGroup;
  formErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  auditableItemObject = {
    component: 'Master',
    values: null,
    type: null
  };

  checklistObject = {
    component: 'Master',
    values: null,
    type: null
  };

  pipe = new DatePipe('en-US');

  SubsidiaryStore = SubsidiaryStore;
  DivisionMasterStore = DivisionMasterStore;  
  DepartmentMasterStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;

  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  AuditPlanStore = AuditPlanStore;
  AuditPlanScheduleMasterStore = AuditPlanScheduleMasterStore;
  UsersStore = UsersStore;
  AuditorsStore = AuditorsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;


  cancelEventSubscription: any;
  auditableItemEvent;
  addCheckListEvent: any;
  checklistChildEvent: any;
 

  fileUploadsArray = []; // for multiple file uploads

  isReadOnly: boolean = false;
  auditProgramId: number;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  auditableItemEmptyList = "Looks like there are no auditable items. Add auditable items and it will show up here.";
  checklistEmptyList = "Looks like there are no checklists. Add checklists and it will show up here.";

  isEditAuditPlan: boolean = false;
  constructor( private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _userService: UsersService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _auditPlanService: AuditPlanService,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _auditorsService:AuditorsService,
    private _formBuilder: FormBuilder,
    private _divisionService: DivisionService,        
    private _departmentService: DepartmentService,
    private _subsidiaryService: SubsidiaryService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
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
        this.form.pristine;
      }, 250);
    });
    // scroll event
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener("scroll", this.scrollEvent, true);
    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
    

  // event calling for cancel pop up using delete popup
  this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.cancelByUser(item);
  })

  this.auditableItemEvent = this._eventEmitterService.importAuditableItemModal.subscribe(res => {
    this.closeModal();
  })

   // add checklist event

   this.addCheckListEvent = this._eventEmitterService.addCheckListModal.subscribe(res => {
    this.closeChecklistModal();
  })

  this.checklistChildEvent = this._eventEmitterService.newChecklistAddModal.subscribe(res => {
    this.setStyle();
  })

  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })

  this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })




    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      audit_plan_id: [null,[Validators.required]],
      end_date: [''],
      start_date: [''],
      auditable_item_ids: [],
      checklist_ids: [],
      auditor_ids: ['',[Validators.required]],
      auditee_ids: ['',[Validators.required]],
      sub_section_id: [null,''],
      section_id: [null,''],
      organization_id: [null],
      division_id: [null,''],
      department_id: [null,[Validators.required]],
      documents: ['']
    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
      this.form.controls['organization_id'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_id'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_id'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_id'].setValidators(Validators.required);

    // in case of edit
    if (this._router.url.indexOf('/edit-audit-plan-schedule') != -1) {
      AuditPlanScheduleMasterStore.clearDocumentDetails();
      AuditPlanStore.auditPlan_id = null;
      if (AuditPlanScheduleMasterStore.auditPlanScheduleDetails)
        this.setAuditPlanScheduleDataForEdit();
      else
        this._router.navigateByUrl('/internal-audit/audit-plan-schedules');
    }
 


     // loading data initially
    if(AuditPlanScheduleMasterStore.auditProgramId){
     this.getAuditors();}
     this.getAuditees();
     this.getAuditPlan();

     // for showing initial tab

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);


     // patching form value

     if (AuditPlanStore.auditPlan_id) {
      this.getAuditPlanDetails(AuditPlanStore.auditPlan_id);
      this.form.patchValue({
      division_id: AuthStore.user.division ? AuthStore.user.division : null,
      department_id:AuthStore.user.department ? AuthStore.user.department : null,            
      organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization : null,
      audit_plan_id:AuditPlanStore.auditPlanDetails        
      })
      this.getAuditPlanDetails(AuditPlanStore.auditPlan_id);
      this.isReadOnly = true;
      this._utilityService.detectChanges(this._cdr);
    } else  if (this.form.value.id){
      this.isReadOnly = true;
    } else {
      this.isReadOnly = false;
      this.form.patchValue({
        division_id: AuthStore.user.division ? AuthStore.user.division : null,
        department_id:AuthStore.user.department ? AuthStore.user.department : null,                
        organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization : null,                    
        })
    }

    AuditPlanScheduleMasterStore.auditPlanTitle = null;

  }

  // ngDoCheck(){
  //   console.log(this.form.valid);
  // }

   // get auditors

   getAuditors() {
    if(AuditPlanScheduleMasterStore.auditProgramId){
      this._auditorsService.getAllItems(AuditPlanScheduleMasterStore.auditProgramId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        if(this.isEditAuditPlan){
          this.setAuditor()
        }
      });} else {
        this.form.value.auditor_ids = [];
        AuditorsStore.setAllAuditors(null);
      }
  }

  setAuditor(){
    let auditor = [];
    var auditorPlanScheduleAuditors = AuditPlanScheduleMasterStore.auditPlanScheduleDetails?.auditors
    if(AuditPlanScheduleMasterStore.auditPlanScheduleDetails && AuditorsStore.allItems){
      auditorPlanScheduleAuditors.forEach(auditors=>{
        AuditorsStore.allItems.forEach(element=>{
          if(element.user.id == auditors.id){
            auditor.push(element);
          }
        })
      })
    }
    this.form.patchValue({
      auditor_ids: auditor
    });
  }

  auditorValue(auditors) {
    let auditor = [];
    auditor.push(auditor);
    return auditor;
  }

  // get auditees

  getAuditees() {
    if(this.form.value.department_id){
    let params = `?department_ids=${this.form.value.department_id.id}`;
    this._userService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  } else {
    this.form.value.auditee_ids = [];
    this.form.controls["auditee_ids"].reset();
  }
  }


   // serach Auditors
   searchAuditors(e) {
    this._auditorsService.getAllItems(AuditPlanScheduleMasterStore.auditProgramId,'?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // serach Auditees
  searchAuditees(e) {
    if(this.form.value.department_id){
      let params = `&department_ids=${this.form.value.department_id.id}`;
    this._userService.searchUsers('?q=' + e.term+params).subscribe(res => {
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
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getAuditPlanDetails(auditPlanID){
    AuditPlanScheduleMasterStore.clearPlanDetails();
    if(auditPlanID){
      this._auditPlanService.getItem(auditPlanID).subscribe(res=>{
        AuditPlanScheduleMasterStore.auditProgramId = res.audit_program.id;
        if(AuditPlanScheduleMasterStore.auditPlanScheduleDetails && AuditPlanScheduleMasterStore.auditProgramId){
          this.getAuditors();
        }
        AuditPlanScheduleMasterStore.auditProgramTitle = res.audit_program.title;
        AuditPlanScheduleMasterStore.auditPlanTitle = res.title;
        AuditPlanScheduleMasterStore.organizations = res.organizations;
        AuditPlanScheduleMasterStore.sections = res.sections;
        AuditPlanScheduleMasterStore.planActualStartDate = this.formatDate(res.start_date);
        AuditPlanScheduleMasterStore.planActualEndDate = this.formatDate(res.end_date);
        AuditPlanScheduleMasterStore.subSections = res.sub_sections;
        AuditPlanScheduleMasterStore.departments = res.departments;
        AuditPlanScheduleMasterStore.divisions = res.divisions;
        AuditPlanScheduleMasterStore.auditLeaderID = res.audit_leader?.id;
        if(!this.form.value.id){
        this.form.patchValue({
          start_date: this.formatDate(res.start_date),
          end_date: this.formatDate(res.end_date),
        })
      }
        AuditPlanScheduleMasterStore.audit_program_id = AuditPlanScheduleMasterStore.auditProgramId;
        AuditPlanScheduleMasterStore.auditPlanStartDate = this._helperService.processDate(res.start_date,'join');
        AuditPlanScheduleMasterStore.auditPlanEndDate = this._helperService.processDate(res.end_date,'join');
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.form.controls["start_date"].reset();
      this.form.controls["end_date"].reset();
      this.form.controls["organization_id"].reset();
      this.form.controls["division_id"].reset();
      this.form.controls["department_id"].reset();
      this.form.controls["section_id"].reset();
      this.form.controls["sub_section_id"].reset();
      this.form.controls["auditee_ids"].reset();
      this.form.controls["auditor_ids"].reset();
      AuditPlanScheduleMasterStore.auditProgramId = null;
      AuditPlanScheduleMasterStore.clearPlanDetails();
    }
  }

  getAuditPlan(){
    this._auditPlanService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditPlan(e){
    this._auditPlanService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  formatDate(date)
  {
    let dormatted= this.pipe.transform(date, 'short');
    return new Date(new Date(dormatted));
    
  }
 

   // delete checklist from list
   deleteCheckList(checklist) {
    var index = AuditPlanScheduleMasterStore.checklistToDisplay.indexOf(checklist);
    AuditPlanScheduleMasterStore.checklistToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'CheckList Deleted');
  }

  // delete auditableItem from list
  deleteAuditableItem(auditableItem) {
    var index = AuditPlanScheduleMasterStore.auditableItemToDisplay.indexOf(auditableItem);
    AuditPlanScheduleMasterStore.auditableItemToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Auditable Item Deleted');
  }

  // formating date

  formatDateInputs() {
    AuditPlanScheduleMasterStore.startDate = null;
    AuditPlanScheduleMasterStore.endDate = null;
    // converting start date
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;

      AuditPlanScheduleMasterStore.startDate = this._helperService.processDate(tempstartdate, 'join');

    }

    // converting end date
    if (this.form.value.end_date) {
      let tempenddate = this.form.value.end_date;

      AuditPlanScheduleMasterStore.endDate = this._helperService.processDate(tempenddate, 'join')

    }

  }



  // for opening modal
  openAuditableItemModal() {
    AuditPlanStore.allItems.forEach(res=>{

    })
    this.auditableItemObject.values = {
     auditSchedules :  AuditPlanScheduleMasterStore.auditPlanScheduleDetails?.audit_plan?AuditPlanScheduleMasterStore.auditPlanScheduleDetails?.audit_plan:this.form.value.audit_plan_id,
     auditLeaderId : AuditPlanScheduleMasterStore.auditLeaderID
    }
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
    this.auditableItemObject.type = 'auditPlan';
  }
  // for close modal
  closeModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.auditableItemObject.type = null;
    
  }

  addCheckList() {
    this.checklistObject.type ='auditPlan';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.checklistPopup.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.checklistPopup.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.checklistPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
   
  }

  closeChecklistModal() {
   
    this.checklistObject.type = null;
    this._renderer2.removeClass(this.checklistPopup.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.checklistPopup.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.checklistPopup.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.checklistPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  changeZIndex(){
    if($(this.checklistPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.checklistPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.checklistPopup.nativeElement,'overflow','auto');
    }
    else if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  setStyle() {
    this._renderer2.setStyle(this.checklistPopup.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.checklistPopup.nativeElement, 'overflow', 'auto');
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  confirmCancel() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }

  cancelByUser(status) {    
    if (status && !AuditPlanStore.auditPlan_id) {      
      this._router.navigateByUrl("/internal-audit/audit-plan-schedules");      
    }else if(AuditPlanStore.auditPlan_id && status){      
      this._router.navigateByUrl("internal-audit/audit-plans/"+AuditPlanStore.auditPlan_id+"/schedules");
    } 
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }



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
    this.submitAuditPlanScheduleForm();
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
      this.formatDateInputs();
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (n == x.length - 1) {

      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      // document.getElementById("nextBtn").innerHTML = "Save";
    } else {
      // this.assignUserValues(any);
      // this.getValues();
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

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  changeStep(step){
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  
  }

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i].valid){
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
            if(!this.form.controls[k].valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  // // function to call to getting the title of audit program and aduit category from store
  // getValues() {
  //   this.auditPlanTitle = null;
  //   if (this.form.value.audit_plan_id && AuditPlanStore.loaded == true) {
  //     var singleAuditPlan = AuditPlanStore.getAuditPlanById(this.form.value.audit_plan_id);
  //     this.auditPlanTitle = singleAuditPlan?.title;
  //   }
  // }

  passSaveFormatDate(date)
 {
  const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
  return fromdate;
 }


  // for user previrews
  assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name?user?.first_name:user?.user?.first_name;
    userInfoObject.last_name = user?.last_name?user?.last_name:user?.user?.last_name;
    userInfoObject.designation = user?.designation_title ? user?.designation_title: user?.designation ? user?.designation: user?.user?.designation ? user?.user?.designation?.title: null;
    userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.user?.department?.title ? user?.user?.department?.title: null;
     return userInfoObject;
  }
  }


  setAuditPlanScheduleDataForEdit(){
    this.isEditAuditPlan = true;
    var auditPlanSchedule = AuditPlanScheduleMasterStore.auditPlanScheduleDetails;
    this.getAuditPlanDetails(auditPlanSchedule.audit_plan.id);
    // Setting the format similar to while adding checklist from popup to show
    let checklists = [];
    if(auditPlanSchedule.checklists){
    for (let i of auditPlanSchedule.checklists) {
      var objs = {
        id: i.id, title: i.title
      }
      checklists.push(objs)
    }

    this.checklistEditValue(checklists)}
    // Setting the format similar to while adding auditable item from popup to show Category Properly in Accordion.
    let auditbaleItems = []

    if(auditPlanSchedule.auditable_items){
    for (let i of auditPlanSchedule.auditable_items) {
      let obj = { id:i.id,title: i.title, reference_code:i.reference_code, auditable_item_type:i.auditableItemType?.title,risk_rating:i.risk_rating?.language[0].pivot.title
          , auditable_item_category:i.auditable_item_category?.title, status_id:i.status_id}
        auditbaleItems.push(obj)
    }

    this.auditableItemEdiValue(auditbaleItems);}
    // patch form values
    this.form.patchValue({
      id: auditPlanSchedule.id ? auditPlanSchedule.id : '',
      audit_plan_id: auditPlanSchedule.audit_plan ? auditPlanSchedule.audit_plan : '',
      end_date: auditPlanSchedule.end_date ? this.formatDate(auditPlanSchedule.end_date) : '',
      start_date: auditPlanSchedule.start_date ? this.formatDate(auditPlanSchedule.start_date) : '',
      // auditor_ids: auditPlanSchedule.auditors ? this.UserValue(auditPlanSchedule.auditors) : [],
      auditee_ids: auditPlanSchedule.auditees ? this.UserValue(auditPlanSchedule.auditees) : [],
      sub_section_id: auditPlanSchedule.sub_section ? auditPlanSchedule.sub_section : '',
      section_id: auditPlanSchedule.section ? auditPlanSchedule.section : '',
      organization_id: auditPlanSchedule.organization? auditPlanSchedule.organization: '',
      division_id: auditPlanSchedule.division ? auditPlanSchedule.division: '',
      department_id: auditPlanSchedule.department ? auditPlanSchedule.department : '',

    }) 

    this._utilityService.detectChanges(this._cdr);

  }


  // Set checklist
  checklistEditValue(checklist) {
    this._auditPlanScheduleService.selectRequiredCheckList(checklist);
  }

  // set auditableItem
  auditableItemEdiValue(auditableItem) {
    this._auditPlanScheduleService.selectRequiredAuditableItem(auditableItem);
  }

  // processing datas for save
  processDataForSave() {
   let saveData = {
      audit_plan_id: this.form.value.audit_plan_id?.id ? this.form.value.audit_plan_id.id : this.form.value.audit_plan_id,
      end_date: this.form.value.end_date ? this.passSaveFormatDate(this.form.value.end_date) : '',
      start_date: this.form.value.start_date ? this.passSaveFormatDate(this.form.value.start_date) : '',
      auditor_ids: this.form.value.auditor_ids ? this.getEditValue(this.form.value.auditor_ids) : [],
      auditee_ids: this.form.value.auditee_ids ? this.getEditValue(this.form.value.auditee_ids) : [],
      sub_section_id: this.form.value.sub_section_id ? this.form.value.sub_section_id.id : '',
      section_id: this.form.value.section_id ? this.form.value.section_id.id : '',
      organization_id: this.form.value.organization_id ? this.form.value.organization_id.id : '',
      division_id: this.form.value.division_id ? this.form.value.division_id.id : '',
      department_id: this.form.value.department_id ? this.form.value.department_id.id : '',
      auditable_item_ids: [],
      checklist_ids: []

    };
    

    var auditableItemIdArray = [];
    this.AuditPlanScheduleMasterStore.auditableItemToDisplay.forEach(element => {

      auditableItemIdArray.push(element.id);
      saveData.auditable_item_ids = auditableItemIdArray;
    });

    var cheklistArray = [];
    this.AuditPlanScheduleMasterStore.checklistToDisplay.forEach(item => {

      cheklistArray.push(item.id);
      saveData.checklist_ids = cheklistArray;
    });
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division){
      delete saveData.division_id;
    } 
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
      delete saveData.section_id;
    } 
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section){
      delete saveData.sub_section_id;
    }


    return saveData;
  }

  submitAuditPlanScheduleForm(){


    let save;

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    if (this.form.value.id) {
      save = this._auditPlanScheduleService.updateItem(this.form.value.id, this.processDataForSave());
    } else if(AuditPlanStore.auditPlan_id) {
      save = this._auditPlanScheduleService.saveFromAuditPlan(this.processDataForSave());
    } else {
      save = this._auditPlanScheduleService.saveItem(this.processDataForSave());
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
      AuditPlanScheduleMasterStore.new_schedule_id = res.id;}
      this.resetForm();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(AuditPlanStore.auditPlan_id){
        this._router.navigateByUrl("internal-audit/audit-plans/"+AuditPlanStore.auditPlan_id+"/schedules");
      } else {

        this._router.navigateByUrl("/internal-audit/audit-plan-schedules/"+res.id);
      }
      
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

  processFormErrors(){
    if(this.form.value.auditee_ids && this.form.value.auditee_ids.length>0){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.startsWith('auditee_ids.')){
           let keyValueSplit = key.split('.');
           let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['auditee_ids'] = this.formErrors['auditee_ids']? this.formErrors['auditee_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('auditor_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
           this.formErrors['auditor_ids'] = this.formErrors['auditor_ids']? this.formErrors['auditor_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
           
           }

           if(key.startsWith('organization_id.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['organization_id'] = this.formErrors['organization_id']? this.formErrors['organization_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('division_id.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['division_id'] = this.formErrors['division_id']? this.formErrors['division_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('department_id.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['department_id'] = this.formErrors['department_id']? this.formErrors['department_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('section_id.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['section_id'] = this.formErrors['section_id']? this.formErrors['section_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('sub_section_id.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['sub_section_id'] = this.formErrors['sub_section_id']? this.formErrors['sub_section_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }

      }
    }
   }
    this._utilityService.detectChanges(this._cdr);
  }



  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      if(i.id){
        returnValues.push(i.id);
      }else{
        returnValues.push(i.user.id);
      }
    }
    return returnValues;
  }

  // for users array
   UserValue(auditors) {
    let auditor = [];
    for (let i of auditors) {
      auditor.push(i);
    }
    return auditor;
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  getOrganization() {
    this._subsidiaryService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for getting  division
  getDivision() {    
    this._divisionService.getItems(false, null).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })    
  }

  // geting department
  getDepartment() {    
    this._departmentService.getItems(false, null).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })    
  }
  
  searchDepartment(e) {    
    this._departmentService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });    
  }

  searchOrganization(e) {    
    this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })    
  }

  searchDivision(e) {    
    this._divisionService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });  
  }
  
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    window.addEventListener('scroll', this.scrollEvent, null);
    this.cancelEventSubscription.unsubscribe();
    this.auditableItemEvent.unsubscribe();
    this.checklistChildEvent.unsubscribe();
    this.addCheckListEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditPlanScheduleMasterStore.audit_program_id = null;

  }

}
