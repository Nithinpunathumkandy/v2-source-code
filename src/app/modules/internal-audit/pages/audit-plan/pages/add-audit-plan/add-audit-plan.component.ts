import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun, toJS } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ControlCategoryService } from 'src/app/core/services/masters/bpm/control-category/control-category.service';
import { AuditableItemCategoryService } from 'src/app/core/services/masters/internal-audit/auditable-item-category/auditable-item-category.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { AuditItemCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-item-category-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { AuditorsStore } from 'src/app/stores/internal-audit/auditors/auditors-store';
import { AuditorsService } from 'src/app/core/services/internal-audit/auditors/auditors.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
declare var $: any;
@Component({
  selector: 'app-add-audit-plan',
  templateUrl: './add-audit-plan.component.html',
  styleUrls: ['./add-audit-plan.component.scss']
})
export class AddAuditPlanComponent implements OnInit, OnDestroy {
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('criteriaPopup') criteriaPopup: ElementRef;
  @ViewChild('objectivePopup') objectivePopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('criteriaModal', { static: true }) criteriaModal: ElementRef;
  @ViewChild('auditableItemCategoryAddPopup') auditableItemCategoryAddPopup: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  formObject = {
    0:[
      'title',
      'audit_program_id',
      'audit_leader_id',
      'auditee_leader_id',
      'sub_section_ids',
      'section_ids',
      'organization_ids',
      'division_ids',
      'department_ids'
    ],
    1:[
      'audit_objective_ids',
      'audit_criteria_ids',
    ],
    2:[
      'documents'
    ]
  }
  

  addCriteriaObject = {
    type : null
  }

  addObjectiveObject = {
    type : null
  }

  addObjectiveFormObject = {
    type : null
  }

  addCriteriaFormObject = {
    type : null
  }

  form: FormGroup;
  formErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";

  checkListArray = [];
  tempArrayPreview=[]

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  startDate;
  endDate;
  auditCategoryTitle;

  Risk_Title;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  auditObjectiveSubscriptionEvent: any = null;
  auditProgramTitle;
  AuditorsStore = AuditorsStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  MsTypeStore = MsTypeStore;
  AuditPlanStore = AuditPlanStore;
  DivisionMasterStore = DivisionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  AuditItemCategoryMasterStore = AuditItemCategoryMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  AuditCategoryMasterStore = AuditCategoryMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  UsersStore = UsersStore;
  AuthStore = AuthStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore; 
  fileUploadsArray = []; // for multiple file uploads

  isReadOnly: boolean = false;
  cancelEventSubscription: any;
  addObjectiveEvent: any;
  addCriteriaEvent: any;
  checklistChildEvent: any;
  auditItemcontrolCategSubscriptionEvent: any = null;
  fileUploadPopupSubscriptionEvent: any = null;
  organisationChangesModalSubscription: any = null;
  openModelPopup: boolean = false;
  auditProgramId: number;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


   startDateForIfoPopup = null;
   endDateForIfoPopup = null;
   auditCriteriaSubscriptionEvent: any = null;
  criteriaEmptyList = "Looks like there are no criteria added. Add criteria and it will show up here.";
  objectiveEmptyList = "Looks like there are no objectives added. Add objectives and it will show up here.";
  auditProgramStartDate: any;
  auditProgramEndDate: any;
  reference_code: any;
  isEditAuditPlan: boolean = false;
  constructor(

    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _auditCategoryService: AuditCategoriesService,
    private _userService: UsersService,
    private _cdr: ChangeDetectorRef,
    private _internalAuditFileService: InternalAuditFileService,
    private _utilityService: UtilityService,
    public _controlCategService: ControlCategoryService,
    private _auditableItemCategoryService: AuditableItemCategoryService,
    private _subSectionService: SubSectionService,
    private _sectionService: SectionService,
    private _subsiadiaryService: SubsidiaryService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _auditProgramService: AuditProgramService,
    private _auditPlanService: AuditPlanService,
    private _helperService: HelperServiceService,
    private _msTypeService: MstypesService,
    private _auditorsService:AuditorsService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    OrganizationalSettingsStore.showBranch = false;
    AppStore.disableLoading();
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

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
    
    setTimeout(() => {

      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');

    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
    // scroll event
    window.addEventListener("scroll", this.scrollEvent, true);

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    // add control event subscription

    this.addObjectiveEvent = this._eventEmitterService.addObjectiveModal.subscribe(element => {

      this.closeObjectiveModal();

    })

    // // add audit category 

    // for closing the modal
    this.auditItemcontrolCategSubscriptionEvent = this._eventEmitterService.auditCategoriesControl.subscribe(res => {
      this.closeAuditItemCategoryFormModal();
    })


    // add checklist event

    this.addCriteriaEvent = this._eventEmitterService.addCriteriaModal.subscribe(res => {
      this.closeCriteriaModal();
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

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );


    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      audit_program_id: [null, [Validators.required]],
      end_date: [''],
      start_date: [''],
      ms_type_organization_ids: [],
      audit_leader_id: [null, [Validators.required]],
      auditee_leader_id: [null, [Validators.required]],
      audit_objective_ids: [],
      audit_criteria_ids: [],
      sub_section_ids: [],
      section_ids: [],
      audit_category_id:[null],
      organization_ids: ['', [Validators.required]],
      division_ids: [],
      description: [''],
      department_ids: ['',[Validators.required]],
      documents: ['']
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.form.controls['division_ids'].setValidators(Validators.required);
   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.form.controls['section_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.form.controls['sub_section_ids'].setValidators(Validators.required);

    // in case of edit
    if (this._router.url.indexOf('edit-audit-plan') != -1) {
      AuditPlanStore.clearDocumentDetails();
      if (AuditPlanStore.auditPlanDetails){
        this.setAuditPlanDataForEdit();
      }
      else
        this._router.navigateByUrl('/internal-audit/audit-plans');
    }  else{
      this.setInitialOrganizationLevels();
    }



    // loading data initially
    this.getAuditableItemCategory();
    this.getOrganization();
    this.getAuditPrograms();
    if(this.auditProgramId){
    this.getAuditLeader();}
    this.getAuditeesLeader();
    this.getMsType();

    // for showing initial tab

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);

    // patching form value

    if (AuditProgramMasterStore.auditProgramId) {
      this.form.patchValue({
        audit_program_id: AuditProgramMasterStore.auditProgramId
      })
      this.getAuditProgramDetails(AuditProgramMasterStore.auditProgramId);

      this.isReadOnly = true;
    } else  if (this.form.value.id){
      this.isReadOnly = true;
    } else {
      this.isReadOnly = false;

    }

    // reseting initially
    this.auditProgramTitle = null;
    this.auditCategoryTitle = '';
    this.auditObjectiveSubscriptionEvent = this._eventEmitterService.auditObjectiveControl.subscribe(res => {
      this.closeFormModal();
    })
    this.auditCriteriaSubscriptionEvent = this._eventEmitterService.auditCriteriaControl.subscribe(res => {
      this.closeCriteriaFormModal();
    })
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.addObjectiveFormObject.type = null;
  }

  openFormModal() {
    this.addObjectiveFormObject.type = "Add"
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }
  openCriteriaModal() {
    this.addCriteriaFormObject.type = "Add"
    setTimeout(() => {
      $(this.criteriaModal.nativeElement).modal('show');
    }, 50);
  }

  closeCriteriaFormModal() {
    $(this.criteriaModal.nativeElement).modal('hide');
    this.addCriteriaFormObject.type = null;
  }
  // calling required datas for form
// for getting auditable item category
getAuditableItemCategory() {
  this._auditCategoryService.getItems().subscribe(res => {

    this._utilityService.detectChanges(this._cdr);
  })

}

// for searching auditable item category
searchAuditableItemCategory(e,patchValue:boolean = false) {
  this._auditCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ audit_category_id: i });
          break;
        }
      }
      AuditItemCategoryMasterStore.lastInsertedId = null;
    }
    this._utilityService.detectChanges(this._cdr);
  });

}

  // getting organization
  getOrganization() {
    this._subsiadiaryService.getAllItems(false).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this.form.patchValue({organization_ids:[res.data[0]]});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids:AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : []
    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this.form.patchValue({ organization_ids: [AuthStore.user?.organization]});
    }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_ids});
    this.searchDepartment({term: this.form.value.department_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.form.value.section_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.form.value.sub_section_ids});
    this._utilityService.detectChanges(this._cdr);
  }

  getAuditProgramDetails(auditProgram){
    if(auditProgram){
      this._auditProgramService.getItem(auditProgram).subscribe(res=>{
        this.auditProgramId = res.id;
        if(AuditPlanStore.auditPlanDetails && this.auditProgramId){
          this.getAuditLeader();
        }
        this.reference_code = res.reference_code;
        this.auditProgramStartDate = this._helperService.processDate(res.start_date, 'split');// for date range control
        this.auditProgramEndDate = this._helperService.processDate(res.end_date, 'split');// for date range control
        this.startDateForIfoPopup = this._helperService.processDate(res.start_date, 'join'); // for tooltip
        this.endDateForIfoPopup = this._helperService.processDate(res.end_date, 'join');// for tool tip
        if(!this.form.value.id){
        this.form.patchValue({
          start_date: this._helperService.processDate(res.start_date, 'split'),
          end_date: this._helperService.processDate(res.end_date, 'split')
        })
      }
        this._utilityService.detectChanges(this._cdr);
      })
   }  else {
    this.form.controls["start_date"].reset();
    this.form.controls["end_date"].reset();
    this.auditProgramId = null;
    this.startDateForIfoPopup = null;
    this.endDateForIfoPopup = null;
    }
  }

  // get auditable Item
  getAuditPrograms() {
    this._auditProgramService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // serach for ms type
  searchMsType(e) {
    this._msTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for getting ms type
  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // get auditor leader

  getAuditLeader() {

    if(this.auditProgramId){
    this._auditorsService.getAllItems(this.auditProgramId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(this.isEditAuditPlan){
        this.setAuditLeader()
      }
    });} else {
      this.form.controls["audit_leader_id"].reset();
      AuditorsStore.unsetAuditors();
    }
  }

  setAuditLeader(){
    if(AuditPlanStore.auditPlanDetails && AuditorsStore.allItems){
      AuditorsStore.allItems.forEach(element=>{
        if(element.user.id == AuditPlanStore.auditPlanDetails.audit_leader.id){
          this.form.patchValue({
            audit_leader_id:element
          })
        }
      })
    }
  }

  // get auditees leader

  getAuditeesLeader() {
    if(this.form.value.department_ids){
      //let params = '?department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      this._userService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.form.value.auditee_leader_id = null;
      this.form.controls["auditee_leader_id"].reset();
    }
  }




  // serach auditable Item
  searchAuditPrograms(e) {
    this._auditProgramService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // serach AuditLeaders
  searcAuditLeaders(e) {
    this._auditorsService.getAllItems(this.auditProgramId,'?q=' + e.term).subscribe(res => {
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
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }


  // serach Auditee Leaders
  searchAuditeeLeaders(e) {
    if(this.form.value.department_ids){
      //let params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  handleDropDownClear(type){
    switch(type){
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
      case 'section_id':  this.form.controls['sub_section_ids'].reset();
                          
        break;
      default: '';
        break;
    }
  }

  handleDropDownItemClear(event,type){
    switch(type){
      case 'organization_id':   if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
                                  this.checkDivision(event.value.id,type);
                                this.checkDepartment(event.value.id,type);
                                if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
                                  this.checkSection(event.value.id,type);
                                if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
                                  this.checkSubSection(event.value.id,type);
                               
        break;
      case 'division_id': this.checkDepartment(event.value.id,type);
                         
        break;
      case 'department_id': if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
                              this.checkSection(event.value.id,type);
                            
        break;
      case 'section_id':  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
                            this.checkSubSection(event.value.id,type);
                          
        break;
      
      default: '';
        break;
    }
  }

  checkDivision(organizationId: number,type:string){
    let divisionValue:[] = this.form.value.division_ids;
    for(var i = 0; i< divisionValue?.length; i++){
      let divOrganizationId = divisionValue[i][type];
      if(organizationId == divOrganizationId){
        divisionValue.splice(i,1);
        i--;
      }
    }
    this.form.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number,type:string){
    let departmentValue:[] = this.form.value.department_ids;
    for(var i = 0; i< departmentValue?.length; i++){
      let deptDivisionId = departmentValue[i][type];
      if(divisionId == deptDivisionId){
        if(type == 'division_id') this.checkSection(departmentValue[i]['id'],'department_id');
        departmentValue.splice(i,1);
        i--;
      }
    }
    this.form.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSection(departmentId: number,type:string){
    let sectionValue:[] = this.form.value.section_ids;
    for(var i = 0; i< sectionValue?.length; i++){
      let sectionDepartmentId = sectionValue[i][type];
      if(departmentId == sectionDepartmentId){
        if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.checkSubSection(sectionValue[i]['id'],'section_id');
        sectionValue.splice(i,1);
        i--;
      }
    }
    this.form.controls['section_ids'].setValue(sectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkSubSection(sectionId: number,type:string){
    let subSectionValue:[] = this.form.value.sub_section_ids;
    for(var i = 0; i< subSectionValue?.length; i++){
      let subSectionSectionId = subSectionValue[i][type];
      if(sectionId == subSectionSectionId){
        subSectionValue.splice(i,1);
        i--;
      }
    }
    this.form.controls['sub_section_ids'].setValue(subSectionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  getDepartment() {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }


      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      DepartmentMasterStore.setAllDepartment([]);
    }
  }
  // for searching the department

  searchDepartment(event) {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }


      this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // for getting  division

  getDivision() {
    let params = '';
    if (this.form.value.organization_ids) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.value.organization_ids);

      this._divisionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      DivisionMasterStore.setAllDivision([]);
    }

  }


  // getting section
  getSection() {

    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }
      if (this.form.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      }


      this._sectionService.getItems(false, params).subscribe(res => {

        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      SectionMasterStore.setAllSection([]);
    }
  }

  // getting sub section
  getSubSection() {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }
      if (this.form.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      }

      if (this.form.get('section_ids').value) {
        if (params)
          params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
        else
          params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
      }


      this._subSectionService.getItems(false, params).subscribe(res => {

        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      SubSectionMasterStore.setAllSubSection([]);
    }

  }


  // search sub section

  searchSubSection(e) {

    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }
      if (this.form.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      }

      if (this.form.get('section_ids').value) {
        if (params)
          params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
        else
          params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
      }

      this._subSectionService.getItems(false, '&q=' + e.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }



  // for searching the Section

  searchSection(event) {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value) {
        if (params)
          params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        else
          params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      }
      if (this.form.get('department_ids').value) {
        if (params)
          params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        else
          params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      }

      this._sectionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // seraching division

  searchDivision(event) {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);

      this._divisionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }


  // for searching organization

  searchOrganization(event) {
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
      }


  }


  // scrollbar function
  checkForFileUploadsScrollbar() {

    if (AuditableItemMasterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }



  // closeAuditItemCategoryFormModal() {
  //   $(this.auditableItemCategoryAddPopup.nativeElement).modal('hide');

  //   if (AuditItemCategoryMasterStore.lastInsertedId) {
  //     this.form.patchValue({ auditable_item_category_id: AuditItemCategoryMasterStore.lastInsertedId });
  //     this.getAuditableItemCategory()
  //   }
  // }

  closeObjectiveModal() {
    this.addObjectiveObject.type= null;
    $(this.objectivePopup.nativeElement).modal('hide');
    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'display', 'none'); // For Modal to Get Focus
    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  closeCriteriaModal() {
    this.addCriteriaObject.type = null;
    $(this.criteriaPopup.nativeElement).modal('hide');
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'display', 'none'); // For Modal to Get Focus
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
   
  }

  addAuditableItemCategory() {
    setTimeout(() => {
      $(this.auditableItemCategoryAddPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.auditableItemCategoryAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  closeAuditItemCategoryFormModal() {
    $(this.auditableItemCategoryAddPopup.nativeElement).modal('hide');

    if (AuditCategoryMasterStore.lastInsertedId) {
      // this.form.patchValue({ auditable_item_category_id: AuditItemCategoryMasterStore.lastInsertedId });
      this.searchAuditableItemCategory({term: AuditCategoryMasterStore.lastInsertedId},true);
      // AuditItemCategoryMasterStore.lastInsertedId = null;
    }
  }

  addobjective() {


    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'display', 'block'); // For Modal to Get Focus
    this._renderer2.setStyle(this.objectivePopup.nativeElement, 'overflow', 'auto');
    $(this.objectivePopup.nativeElement).modal('show');
    this.addObjectiveObject.type = "add";
    this._utilityService.detectChanges(this._cdr);
  }

  addCriteria() {
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'display', 'block'); // For Modal to Get Focus
    this._renderer2.setStyle(this.criteriaPopup.nativeElement, 'overflow', 'auto');
    $(this.criteriaPopup.nativeElement).modal('show');
    this.addCriteriaObject.type = "add";
    this._utilityService.detectChanges(this._cdr);
  }


  changeZIndex(){
    if($(this.criteriaPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.criteriaPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.criteriaPopup.nativeElement,'overflow','auto');
    }
    else if($(this.objectivePopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.objectivePopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.objectivePopup.nativeElement,'overflow','auto');
    }
    else if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.criteriaModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.criteriaModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.criteriaModal.nativeElement,'overflow','auto');
    }
  }


  deleteObjective(objective) {
    var index = AuditPlanStore.objectiveToDisplay.indexOf(objective);
    AuditPlanStore.objectiveToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Objective Deleted');
  }

  deleteCriteria(criteria) {
    var index = AuditPlanStore.criteriaToDisplay.indexOf(criteria);
    AuditPlanStore.criteriaToDisplay.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Criteria Deleted');
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

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }


  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._auditPlanService.setDocumentDetails(imageDetails, type);
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



  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  // checkAcceptFileTypes(type){
  //   return this._imageService.getAcceptFileTypes(type); 
  // }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AuditPlanStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }





  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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
      this.submitAuditPlanForm();
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
      this.getValues();
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
    if(step==3){      
      this.msTypeFn(this.form?.value.ms_type_organization_ids)
    }
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

  subsidiariesChange(){
    if(this.form.value.organization_ids.length==0){
      this.form.controls['division_ids'].reset();
      this.form.controls['department_ids'].reset();
      this.form.controls['section_ids'].reset();
      this.form.controls['sub_section_ids'].reset();
    }
  }

  // edit section 

  setAuditPlanDataForEdit() {

    this.isEditAuditPlan = true;
    var auditPlan = AuditPlanStore.auditPlanDetails;
     this.getAuditProgramDetails(auditPlan.audit_program.id);
     fileUploadPopupStore.setFilestoDisplay(auditPlan.documents);
     this.clearCommonFilePopupDocuments();
     if(auditPlan.documents)
     this.setDocuments(auditPlan.documents)

     for (let i of auditPlan.documents) {

       let docurl = this._internalAuditFileService.getThumbnailPreview('audit-plan', i.token);
       let docDetails = {
        created_at: i.created_at,
         created_by: i.created_by,
         updated_at: i.updated_at,
         updated_by: i.updated_by,
         name: i.title,
         ext: i.ext,
         size: i.size,
         url: i.url,
         thumbnail_url: i.url,
         token: i.token,
         preview: docurl,
         id: i.id
       };
       this._auditPlanService.setDocumentDetails(docDetails, docurl);
       setTimeout(() => {
         this.checkForFileUploadsScrollbar();
       }, 200);

     }


    // Setting the format similar to while adding criteria from popup to show

    let criterias = [];

    if(auditPlan.audit_criterion){
    for (let i of auditPlan.audit_criterion) {

      var objs = {
        id: i.id, title: i.title
      }
      criterias.push(objs)
    }

    this.criteriaEditValue(criterias)}


    // Setting the format similar to while adding objective from popup to show Category Properly in Accordion.
    let objectives = []

    if(auditPlan.audit_objective){
    for (let i of auditPlan.audit_objective) {

      var objs = {
        id: i.id, title: i.title
      }
      objectives.push(objs)
    }

    this.objectiveEdiValue(objectives);}

    

    // patch form values
    this.form.patchValue({
      id: auditPlan.id ? auditPlan.id : '',
      title: auditPlan.title ? auditPlan.title : '',
      description: auditPlan.description ? auditPlan.description : '',
      audit_program_id:auditPlan.audit_program ? auditPlan.audit_program.id : '',
      end_date: auditPlan.end_date ? this._helperService.processDate(auditPlan.end_date, 'split') : '',
      start_date: auditPlan.start_date ? this._helperService.processDate(auditPlan.start_date, 'split') : '',
      // audit_leader_id: auditPlan.audit_leader ? auditPlan.audit_leader : '',
      audit_category_id: auditPlan.auditCategory ? auditPlan.auditCategory[0] : '',
      auditee_leader_id: auditPlan.auditee_leader ? auditPlan.auditee_leader: '',
      sub_section_ids: auditPlan.sub_sections ? this.getEditValue(auditPlan.sub_sections) : [],
      section_ids: auditPlan.sections ? this.getEditValue(auditPlan.sections) : [],
      organization_ids: auditPlan.organizations ? this.getEditValue(auditPlan.organizations) : [],
      division_ids: auditPlan.divisions ? this.getEditValue(auditPlan.divisions) : [],
      department_ids: auditPlan.departments ? this.getEditValue(auditPlan.departments) : [],
      ms_type_organization_ids: auditPlan.ms_type_organizations ? this.getEditMsTypeValue(auditPlan.ms_type_organizations) : [],


    })

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
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents){
    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._internalAuditFileService.getThumbnailPreview('audit-plan', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  // Returns Values as Array for multiple select case
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i);
    }
    return returnValue;

  }

  getEditMsTypeValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i.id);
    }
    return returnValues;
  }


  // Set Criteria
  criteriaEditValue(criteria) {
    this._auditPlanService.selectRequiredCriteria(criteria);
  }

  // set Objectives
  objectiveEdiValue(objective) {
    this._auditPlanService.selectRequiredObjective(objective);
  }

  // processing datas for save
  processDataForSave() {
    let saveData = {
      title: this.form.value.title ? this.form.value.title : '',
      description: this.form.value.description ? this.form.value.description : '',
      //documents: AuditPlanStore.docDetails,
      // documents : this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save'),
      audit_program_id: this.form.value.audit_program_id ? this.form.value.audit_program_id : '',
      end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date, 'join') : '',
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
      ms_type_organization_ids: [],
      audit_leader_id: this.form.value.audit_leader_id.id?this.form.value.audit_leader_id.id:this.form.value.audit_leader_id ? this.form.value.audit_leader_id.user.id : '',
      auditee_leader_id: this.form.value.auditee_leader_id ? this.form.value.auditee_leader_id.id : '',
      audit_category_id: this.form.value.audit_category_id ? this.form.value.audit_category_id.id : '',
      audit_objective_ids: [],
      audit_criteria_ids: [],
      sub_section_ids: [],
      section_ids: [],
      organization_ids: [],
      division_ids: [],
      department_ids: [],
    };

    if(this.form.value.id){
      saveData['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
    }else
     saveData['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    if (this.form.value.organization_ids) {
      this.form.value.organization_ids.forEach(element => {
        saveData.organization_ids.push(element.id);
      });
    }
    if (this.form.value.ms_type_organization_ids) {
      this.form.value.ms_type_organization_ids.forEach(items => {

        saveData.ms_type_organization_ids.push(items);
      });
    }

    if (this.form.value.division_ids) {
      this.form.value.division_ids.forEach(element => {
        saveData.division_ids.push(element.id);
      });
    }

    if (this.form.value.department_ids) {
      this.form.value.department_ids.forEach(element => {
        saveData.department_ids.push(element.id);
      });

    }

    if (this.form.value.section_ids) {
      this.form.value.section_ids.forEach(element => {
        saveData.section_ids.push(element.id);
      });
    }

    if (this.form.value.sub_section_ids) {
      this.form.value.sub_section_ids.forEach(element => {
        saveData.sub_section_ids.push(element.id);
      });
    }

    var objectiveIdArray = [];
    this.AuditPlanStore.objectiveToDisplay.forEach(element => {

      objectiveIdArray.push(element.id);
      saveData.audit_objective_ids = objectiveIdArray;
    });


    var criteriaArray = [];
    this.AuditPlanStore.criteriaToDisplay.forEach(item => {

      criteriaArray.push(item.id);
      saveData.audit_criteria_ids = criteriaArray;

    });

    console.log(toJS(saveData))

    return saveData;


  }

  // form submit function
  submitAuditPlanForm() {

    let save;

    AppStore.enableLoading();
    this.nextButtonText = "Loading...";
    this.previousButtonText = "Loading...";

    if (this.form.value.id) {
      save = this._auditPlanService.updateItem(this.form.value.id, this.processDataForSave());
    } else {

      save = this._auditPlanService.saveItem(this.processDataForSave());
    }
    save.subscribe((res: any) => {
      this.resetForm();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl("/internal-audit/audit-plans/"+res.id);
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
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
      
           if(key.startsWith('organization_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
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

  // function to call to getting the title of audit program and aduit category from store
  getValues() {
    this.auditProgramTitle = null;

    if (this.form.value.audit_program_id && AuditProgramMasterStore.loaded == true) {
      var singleAuditProgram = AuditProgramMasterStore.getAuditProgramById(this.form.value.audit_program_id);
      this.auditProgramTitle = singleAuditProgram.title;

    }


  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.fileUploadsArray = [];
    this.formErrors = null;
  }

  cancelByUser(status) {
    if (status) {
      if (AuditProgramMasterStore.auditProgramId) {

        this._router.navigateByUrl('/internal-audit/audit-programs/' + AuditProgramMasterStore.auditProgramId + '/audit-plan');}
        else {
      this._router.navigateByUrl('/internal-audit/audit-plans'); }

    } else {
      
    }

    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  confirmCancel() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }


  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }


  // * File Upload/Attach Modal

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
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
        // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);
    
  }
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
      $(this.previewUploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  msTypeFn(value){
    value.forEach(element => {
      MsTypeStore.msTypeDetails.filter(x => x.id === element).map(x => this.tempArrayPreview.push(x));
    });
  }

  ngOnDestroy() {
    this.auditCriteriaSubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.auditObjectiveSubscriptionEvent.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    window.addEventListener('scroll', this.scrollEvent, null);
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    this.addCriteriaEvent.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.addObjectiveEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.AuditPlanStore.unsetDocumentDetails();
    this.auditItemcontrolCategSubscriptionEvent.unsubscribe();
    AuditPlanStore.clearDocumentDetails()    
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }


}
