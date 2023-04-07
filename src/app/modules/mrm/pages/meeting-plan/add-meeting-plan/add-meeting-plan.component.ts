import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IReactionDisposer, autorun } from "mobx";
import { Router } from '@angular/router';
import { MeetingCategoryService } from 'src/app/core/services/masters/mrm/meeting-category/meeting-category.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingAgendaService } from 'src/app/core/services/masters/mrm/meeting-agenda/meeting-agenda.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { MeetingTypeService } from 'src/app/core/services/masters/mrm/meeting-type/meeting-type.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { MappingService } from 'src/app/core/services/mrm/mapping/mapping.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { VenueService } from 'src/app/core/services/masters/general/venue/venue.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { MeetingObjectiveMasterStore } from 'src/app/stores/masters/mrm/meeting-objective-store';
import { MeetingCriteriaMasterStore } from 'src/app/stores/masters/mrm/meeting-criteria-store';
import { MeetingCategoryMasterStore } from 'src/app/stores/masters/mrm/meeting-category-store';
import { MeetingAgendaMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { MeetingTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-type-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { VenueMasterStore } from 'src/app/stores/masters/general/venue-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-meeting-plan',
  templateUrl: './add-meeting-plan.component.html',
  styleUrls: ['./add-meeting-plan.component.scss']
})
export class AddMeetingPlanComponent implements OnInit, OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('addAgenda') addAgenda: ElementRef;
  @ViewChild('addCriteria') addCriteria: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('addObjective') addObjective: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('riskFormModal') riskFormModal: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('findingFormModal') findingFormModal: ElementRef;
  @ViewChild('nonConformityFormModal') nonConformityFormModal: ElementRef;
  @ViewChild('addVenue', { static: true }) addVenue: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('addCategory', { static: true }) addCategory: ElementRef;
  @ViewChild('meetingAgenda', { static: true }) meetingAgenda: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('agendaForm', { static: false }) agendaForm: ElementRef;
  
  
  @ViewChild('newAgendaInput') newAgendaInput: ElementRef;
  @ViewChild('newAgendaInput2') newAgendaInput2: ElementRef;

  hoverButton=false;

  //ck editor configuration
  config = {
    toolbar: [
        'BlockQuote',
        'Bold',
        'Essentials',
        'FontBackgroundColor',
        'FontColor',
        'FontFamily',
        'FontSize',
        'Heading',
        'Image',
        'ImageCaption',
        'ImageResize',
        'ImageStyle',
        'ImageToolbar',
        'ImageUpload',
        'Indent',
        'Italic',
        'Link',
        'List',
        'Paragraph',
        'pasteFromOffice',
        'insertTable',
        'Table',
        'TableCellProperties',
        'TableProperties',
        'TableToolbar',
        'TableResize'
  
  
      ],
      language:'id'
    };
    public Editor;
    public Config;

  currentTab = 0;
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  newAgendaEdit: string;
  nextButtonText = "next";
  toggleClassAgendas = true;
  toggleClassCrieteria = false;
  toggleClassObjectives = false;
  previousButtonText = "previous";
  selectedMeetingUsers=[];

// Agenda Variables
  subItemOpened = false
  subItemDescription = null;
  saveClicked = false;
  observationIndex = null;
  mainIndex = 0;
  addMainClicked = false;
  editFlag = null;
  observationArray=[];
  activeIndex = null;
  hover = false;
  subItemIndex = null;
  meeting_agenda_subtitle: string;
  subItemButtonClicked=false;
// Agenda Variables
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  MsTypeStore = MsTypeStore;
  UsersStore = UsersStore;
  ProcessStore = ProcessStore;
  MappingStore = MappingStore;
  ControlStore = ControlStore;
  MeetingsStore = MeetingsStore;
  IssueListStore = IssueListStore;
  SubsidiaryStore = SubsidiaryStore;
  MeetingPlanStore = MeetingPlanStore;
  SubMenuItemStore = SubMenuItemStore;
  VenueMasterStore = VenueMasterStore;
  SectionMasterStore = SectionMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  BusinessProjectsStore = BusinessProjectsStore;
  DepartmentMasterStore = DepartmentMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  BusinessProductsStore = BusinessProductsStore;
  MeetingTypeMasterStore = MeetingTypeMasterStore;
  BusinessCustomersStore = BusinessCustomersStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  MeetingAgendaMasterStore = MeetingAgendaMasterStore;
  MeetingCategoryMasterStore = MeetingCategoryMasterStore;
  MeetingCriteriaMasterStore = MeetingCriteriaMasterStore;
  MeetingObjectiveMasterStore = MeetingObjectiveMasterStore;
  StrategicObjectivesMasterStore = StrategicObjectivesMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuditFindingsStore = AuditFindingsStore;
  FindingsStore = FindingsStore;

  subscription: any;
  selectedIndex = null;
  selectedAgendas = [];
  fileUploadsArray = []; // for multiple file uploads
  selectedSection = 'issue';
  todayDate: any = new Date();
  
  addAgendaEvent: any;
  addCriteriaEvent: any;
  addObjectiveEvent: any;
  riskSelectSubscription: any;
  cancelEventSubscription: any;
  issueSelectSubscription: any;
  idleTimeoutSubscription: any;
  productSelectSubscription: any
  projectSelectSubscription: any;
  controlSelectSubscription: any;
  networkFailureSubscription: any;
  customerSelectSubscription: any;
  objectiveSelectSubscription: any;
  findingSelectSubscription:any;
  nonConformitySelectSubscription:any;
  venueSubscriptionEvent: any = null;
  meetingAgendaSubscriptionEvent: any = null;
  meetingCategorySubscriptionEvent: any = null;
  fileUploadPopupSubscriptionEvent: any = null;
  agendaFormModalSubscription:any=null;

  modalObject = {
    component : 'meeting_plan',
  }

  venuelabels={
    main_title:'new_meeting_plan_venue',
    title:'title_of_the_meeting_plan_venue',
    description:'write_a_short_description_of_the_meeting_plan_venue'
  }

  cancelObject = {
    type: '',
    title: '',
    subtitle: '',
    position:null,
    sub_position:null
  }

  meetingAgendaObject={
    type:'',
    values:''
  }

  newAgenda: string;
  // subAgenda:string;
  // meetingAgendas = [];
  addIsOpen = false;
  meetingAgendaId = null;
  MeetingAgendaSameDataError = false;
  // meetingTypeObjectModal=[];

  formObject = {
    0: [
      'to',
      'from',
      'title',
      'meeting_category_id',
    ],
    1: [
      'section_ids',
      'division_ids',
      'organizer_id',
      'department_ids',
      'sub_section_ids',
      'organization_ids',
    ],
    3:['meeting_agendas']
  };
  
  offlineEnable:boolean=false;
  onlineEnable:boolean=false;

  venueArray:any=[];

  initNotWorkAndEdit:boolean=false;
   clockFormat='24-hour clock'
  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _venueService: VenueService,
    private _msTypeService: MstypesService,
    private _mappingService: MappingService,
    private _sectionService: SectionService,
    private _utilityService: UtilityService,
    private _meetingsService: MeetingsService,
    private _divisionService: DivisionService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _subSectionService: SubSectionService,
    private _departmentService: DepartmentService,
    private _subsidiaryService: SubsidiaryService,
    private _meetingTypeService: MeetingTypeService,
    private _meetingPlanService: MeetingPlanService,
    private _humanCapitalService: HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _meetingAgendaService: MeetingAgendaService,
    private _meetingPlanFileService: MeetingPlanFileService,
    private _meetingCategoryService: MeetingCategoryService,
    private _fileUploadPopupService: FileUploadPopupService,
  ) { 
    this.Editor = myCkEditor;
   }
  
   public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
    this.getPreviousMeetings();
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({ title: "issues_nodata_title_selected" });
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    setTimeout(() => {
      window.addEventListener("scroll", this.scrollEvent, true);  // scroll event
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);
    
    

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);

    //Event Subscription for handling modal output events
    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      var modalNumber: number = item;
      switch (modalNumber) {
        case 7: this.closeProcesses();
          break;
      }
      this._utilityService.detectChanges(this._cdr);
    })

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelMeetingPlan(item);
    })

    // add control event subscription
    this.addCriteriaEvent = this._eventEmitterService.criteriaItemAddModalControl.subscribe(element => {
      this.closeCriteriaAddModal();
    });

    this.addAgendaEvent = this._eventEmitterService.agendaItemAddModalControl.subscribe(item => { 
      this.closeAgendaAddModal();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.addObjectiveEvent = this._eventEmitterService.objectiveItemAddModalControl.subscribe(element => {
      this.closeObjectiveAddModal();
    })

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })

    this.riskSelectSubscription = this._eventEmitterService.riskSelect.subscribe(item => {
      this.closeRiskModal();
    })

    this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControlsModal();
		})

    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
			this.closeProjectsModal();
		})

    this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
			this.closeProducts();
		})

    this.customerSelectSubscription = this._eventEmitterService.customerControl.subscribe(item => {
			this.closeCustomers();
		})

    this.objectiveSelectSubscription = this._eventEmitterService.strategicObjectivesMapping.subscribe(item => {
			this.closeObjectives();
		})

    this.findingSelectSubscription = this._eventEmitterService.findingItemAddModalControl.subscribe(item => {
			this.closeFinding();
		})

    this.nonConformitySelectSubscription = this._eventEmitterService.NonConformityItemAddModalControl.subscribe(item => {
			this.closeNonConformity();
		})
   
    this.meetingAgendaSubscriptionEvent = this._eventEmitterService.meetingAgenda.subscribe(res => {
      this.closeMeetingAgenda();
    })

    this.meetingCategorySubscriptionEvent = this._eventEmitterService.meetingCategory.subscribe(res => {
      this.closecategoryAdd();
      this.searchMeetingCategory({ term: MeetingCategoryMasterStore.lastInsertedId });
    })

    this.venueSubscriptionEvent = this._eventEmitterService.venue.subscribe(res => {
      this.closeVenueAdd();
      this.searchVenue({ term: VenueMasterStore.lastInsertedId });
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

    this.agendaFormModalSubscription=this._eventEmitterService.agendaFormModal.subscribe(res=>{
      this.closeAgendaFormModal()
    })

    this.form = this._formBuilder.group({
      id: [null],
      reference_code: [null],
      meeting_category_id: [null, [Validators.required]],
      previous_meeting: [],
      title: ['', [Validators.required]],
      description: [''],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      is_all_day: 1,
      meeting_type_ids: [[]],
      meeting_objective_ids: [[]],
      meeting_criterion_ids: [[]],
      meeting_agenda_ids: [[]],
      meeting_agendas: [[],[Validators.required]],
      ms_type_organization_ids: [],
      venue_id: [null],
      organizer_id: [null, [Validators.required]],
      organization_ids: [[]],
      division_ids: [[]],
      department_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      meeting_plan_users: [[]],
      meeting_id: [null],
      meeting_link: [''],
    })

    IssueListStore.selectedIssuesList = [];
    MeetingPlanStore.selectedRiskList = [];
    ControlStore.selectedControlsList = [];
    ProcessStore.selectedProcessesList = [];
    BusinessProjectsStore.selectedProjectList= [];
    BusinessProductsStore.selectedProductList= [];
    BusinessCustomersStore.selectedCustomerList = [];
    StrategicObjectivesMasterStore.selectedStrategic= [];
    MeetingCriteriaMasterStore._selectedMeetingCriteriaAll = [];
    MeetingObjectiveMasterStore._selectedMeetingObjectiveAll = [];
    MeetingAgendaMasterStore._selectedMeetingAgendaAll = [];
    AuditFindingsStore._selectedFindingItemAll = [];
    FindingsStore._selectedNonConformityItemAll = [];

    MeetingPlanStore.newMeetingAgenda = [];

    // for showing initial tab
    setTimeout(() => {
      this.showTab(this.currentTab,1);
    }, 100);

    this.getOrganization();
    this.getMeetingType();
    // this.getMeetingAgenda();

    this.form.get('from').valueChanges.subscribe(val => {//one houre extra set end date/time
      if (val) {
        let milliseconds = val.getTime() + (1 * 60 * 60 * 1000);
        let date = new Date(milliseconds);
        this.form.controls['to'].setValue(date);
      }

    });
    
    if (!MeetingPlanStore.meetingPlanId) {
      this.form.get('meeting_id').valueChanges.subscribe(val => {// prv meeting_title set title

        if (val?.title) {
          this.form.controls['title'].setValue(`Follow Up-${val?.title}`);
        } else {
          if (!MeetingPlanStore.editFlag) {
            this.form.controls['title'].setValue("");
          }
        }
      });
    }

    
    this.form.get('meeting_type_ids').valueChanges.subscribe(res=>{
      
      if(res?.length>0){
        const offiline = res.find(item=>item.type=='offline');
        const online = res.find(item=>item.type=='online');

          if(offiline){
            this.offlineEnable=true;
          } else{
            this.offlineEnable=false;
          }

          if(online){
            this.onlineEnable=true;
          } else{
            this.onlineEnable=false;
          }
                
      }else{
        this.offlineEnable=false;
        this.onlineEnable=false;
      }
      
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section){
      this.form.get('section_ids').valueChanges.subscribe(res=>{
        if(res){
          if(MeetingPlanStore.editFlag){
            if(this.initNotWorkAndEdit){
              this.form.patchValue({ "organizer_id": [] });
            }
          }else{
            this.form.patchValue({ "organizer_id": [] });
          }
        }
      });
    }

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section){
      this.form.get('sub_section_ids').valueChanges.subscribe(res=>{
        if(res){
          if(MeetingPlanStore.editFlag){
            if(this.initNotWorkAndEdit){
              this.form.patchValue({ "organizer_id": [] });
            }
          }else{
            this.form.patchValue({ "organizer_id": [] });
          }
        }
      });
    }

    if (this._router.url.indexOf('edit-meeting-plan') != -1) {
      if (MeetingPlanStore.editFlag && MeetingPlanStore.meetingPlanId) {
        this._meetingPlanService.getItem(MeetingPlanStore.meetingPlanId).subscribe(res => {
          this.meetingPlanEdit(res);
        })
      }
      else {
        this._router.navigateByUrl('/mrm/meeting-plans');
      }
    } else {
      this.setInitialOrganizationLevels();
    }
  }

  getMeetingPlan()
  {
    this._meetingPlanService.getItem(MeetingPlanStore.selecetdMeetingPlanId).subscribe(res => {
      this.setDocuments(res.documents);
    })
  }

  changeZIndex() {
    if ($(this.addCategory.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addCategory.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addCategory.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.addVenue.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addVenue.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addVenue.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.meetingAgenda.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.meetingAgenda.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.meetingAgenda.nativeElement, 'overflow', 'auto');
    }
  }

  setInitialOrganizationLevels() {
    this.form.patchValue({
      // organization_ids:[AuthStore.user?.organization],
      // division_ids: [AuthStore.user?.division],
      // department_ids:[AuthStore.user?.department],
      // section_ids:[AuthStore.user?.section],
      // sub_section_ids: [AuthStore.user?.sub_section],
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: [AuthStore.user?.organization]});
    // }
    this.searchParticipants({ term: AuthStore.user?.id }, 'auth');
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
    this.searchDepartment({ term: this.form.value.department_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids });
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
    this._utilityService.detectChanges(this._cdr);
  }


  // setInitalOrganiztion(type){

  //   switch (type) {
  //     case 'division':
  //       this.form.patchValue({
  //         division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],       
  //       });
  //       break;
  //       case 'department':
  //         this.form.patchValue({
  //           department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
  //         });
  //       break;
  //       case 'section':
  //         this.form.patchValue({        
  //           section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
  //         });
  //         break;
  //         case 'sub_section':
  //           this.form.patchValue({
  //             sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
  //           });
  //           break;
  //           case 'organization':
  //             this.form.patchValue({
  //               organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
  //             });
  //             break;
  //     default:
  //       break;
  //   }

  //   this.searchParticipants({ term: AuthStore.user?.id }, 'auth');
  //   if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
  //   this.searchDepartment({ term: this.form.value.department_ids });
  //   if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids });
  //   if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
  //   this._utilityService.detectChanges(this._cdr);


  // }

  

  createDateTimeValidator(flag) {
    if (MeetingPlanStore.editFlag && flag==0)
      return this.form.value.from?this.form.value.from:this.todayDate;
    else
      return this.todayDate;
  }

  passDateChecking(){
    return !this.form.controls['from'].valid;
  }

  meetingPlanEdit(res) {
   
    if (MeetingPlanStore.individualLoaded) {

      // MeetingPlanStore.clearDocumentDetails();
      // this.setMeetingPlanDocumentsForEdit();
      var meetingPlanItem =JSON.parse(JSON.stringify(MeetingPlanStore.individualMeetingPlanDetails)); 
      
      this.clearCommonFilePopupDocuments();
      if (meetingPlanItem.documents.length > 0) {
              
        this.setDocuments(meetingPlanItem.documents);
      }
      this.setValuesForEdit();
      this.getAllMappings();
      this.searchMeetingCategory({ term: res?.meeting_category?.id });
      this.searchVenue({ term: res?.venue?.id });
      this.setMeetingCriteria();
      this.setMeetingObjective();
      // this.setMeetingAgenda();
      this.setMeetingPlanAgenda();
      this.searchPreviousMeetings({ term: res?.meeting?.id });//res.meeting.title
      MeetingPlanStore.selecetdMeetingPlanId = MeetingPlanStore.individualMeetingPlanDetails.id ? MeetingPlanStore.individualMeetingPlanDetails.id:null
      this.form.patchValue({
        id: MeetingPlanStore.individualMeetingPlanDetails.id? MeetingPlanStore.individualMeetingPlanDetails.id:null,
        reference_code: MeetingPlanStore.individualMeetingPlanDetails.reference_code ? MeetingPlanStore.individualMeetingPlanDetails?.reference_code : '',
        meeting_category_id: MeetingPlanStore.individualMeetingPlanDetails?.meeting_category ? MeetingPlanStore.individualMeetingPlanDetails?.meeting_category : null,
        title: MeetingPlanStore.individualMeetingPlanDetails.title ? MeetingPlanStore.individualMeetingPlanDetails?.title : '',
        description: MeetingPlanStore.individualMeetingPlanDetails.description ? MeetingPlanStore.individualMeetingPlanDetails?.description : '',
        from: MeetingPlanStore.individualMeetingPlanDetails.start_date ? new Date(MeetingPlanStore.individualMeetingPlanDetails?.start_date) : '',
        to: MeetingPlanStore.individualMeetingPlanDetails.end_date ? new Date(MeetingPlanStore.individualMeetingPlanDetails?.end_date) : '',
        ms_type_organization_ids: MeetingPlanStore.individualMeetingPlanDetails.ms_type_organizations ? this.processMsTypeOrganizations() : null,
        venue_id: MeetingPlanStore.individualMeetingPlanDetails?.venue ? MeetingPlanStore.individualMeetingPlanDetails?.venue : null,
        meeting_type_ids: MeetingPlanStore.individualMeetingPlanDetails.meeting_types ? MeetingPlanStore.individualMeetingPlanDetails.meeting_types : [],
        organizer_id: MeetingPlanStore.individualMeetingPlanDetails.organizer ? MeetingPlanStore.individualMeetingPlanDetails.organizer :AuthStore?.user,
        //organization_ids: MeetingPlanStore.individualMeetingPlanDetails.organizations?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.organizations, null) : [AuthStore?.user?.department],/* more than 15 dep need to give search option */
        organization_ids: MeetingPlanStore.individualMeetingPlanDetails.organizations?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.organizations, null) : [AuthStore?.user?.organization],
        division_ids: MeetingPlanStore.individualMeetingPlanDetails.divisions?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.divisions, null) :[AuthStore?.user?.division],
        department_ids: MeetingPlanStore.individualMeetingPlanDetails.departments?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.departments, null) : [AuthStore?.user?.department] ,
        section_ids: MeetingPlanStore.individualMeetingPlanDetails.sections?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.sections, null) :  [AuthStore?.user?.section],
        sub_section_ids: MeetingPlanStore.individualMeetingPlanDetails.sub_sections?.length > 0 ? this._helperService.getArrayProcessed(MeetingPlanStore.individualMeetingPlanDetails.sub_sections, null) : [AuthStore?.user?.sub_section],
        meeting_plan_users: MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users ? this._helperService.getArrayProcessed(JSON.parse(JSON.stringify(MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users)), 'user') : [],
        meeting_id: MeetingPlanStore.individualMeetingPlanDetails.previous_meeting ? MeetingPlanStore.individualMeetingPlanDetails.previous_meeting : null,
        meeting_link: MeetingPlanStore.individualMeetingPlanDetails?.meeting_link? MeetingPlanStore.individualMeetingPlanDetails?.meeting_link : '',
      });
    }
    this.initNotWorkAndEdit=true;
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  processMsTypeOrganizations() {
    let processedMsTypes = [];
    if (MeetingPlanStore.individualMeetingPlanDetails?.ms_type_organizations) {
      for (let i of MeetingPlanStore.individualMeetingPlanDetails.ms_type_organizations) {
        let msTypes = { id: i.id, ms_type_title: i.ms_type?.title, ms_type_version_title: i.ms_type_version?.title };
        processedMsTypes.push(msTypes);
      }
    }
    return processedMsTypes;
  }

  getEmployeePopupDetails(users, auth?: string) {
    if (users) {
      let userDetailEmployeeObject: any = {};
      userDetailEmployeeObject['first_name'] = users.first_name ? users.first_name : users.name;
      userDetailEmployeeObject['last_name'] = users.last_name;
      userDetailEmployeeObject['image_token'] = users.image_token ? users.image_token : users.image?.token ? users.image?.token : null;
      userDetailEmployeeObject['email'] = users.email;
      userDetailEmployeeObject['mobile'] = users.mobile;
      userDetailEmployeeObject['department'] = typeof (users.department) == 'string' ? users.department : users.department?.title ? users.department?.title : null;
      userDetailEmployeeObject['id'] = users.id;
      userDetailEmployeeObject['created_at'] = auth ? new Date() : null;
      if (auth == 'auth') {
        userDetailEmployeeObject['designation'] = users.designation.title;
      } 
      else {
        userDetailEmployeeObject['designation'] = users.designation ? users.designation : users.designation_title;
      }
      return userDetailEmployeeObject;
    }
  }

  changeStep(step) {
    if(step==3)
    {
      if(this.form.valid && MeetingPlanStore.meetingPlanAgendas.length)
      {
        this.gotoMappingSection('agenda')
      }
    }
    else
    this.gotoMappingSection('issue')
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }
  }

  checkDinamicaly(){
    let enable:boolean=true;
    if(this.offlineEnable || this.onlineEnable){
      enable=true;
        if(this.offlineEnable && this.onlineEnable){
          enable=true;
          if(this.form.value.venue_id && this.form.value.meeting_link){
            enable=false;
          }
      }else if(this.offlineEnable){
        enable=true;
        if(this.form.value.venue_id){
          enable=false;
        }
      }else{
        enable=true;
        if(this.form.value.meeting_link){
          enable=false;
        }
      }
    } else{
      enable=false;
    }
    
    return enable;
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if(MeetingPlanStore.meetingPlanAgendas.length)
    {
        this.form.patchValue({
          meeting_agendas:MeetingPlanStore.meetingPlanAgendas
        })
    }
    else
    {
      this.form.patchValue({
        meeting_agendas:[]
      })
    }
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.form.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.form.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  getAllMappings() {
    this._mappingService.getItems().subscribe(res => {
      this.setValuesForMapping(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setValuesForMapping(mapping) {
    if (mapping?.processes?.length > 0) {
      this.setProcesses(mapping.processes);
    }
    if (mapping?.organization_issues?.length > 0) {
      this.setIssues(mapping.organization_issues);
    }
    if (mapping?.risks?.length > 0) {
      this.setRisk(mapping.risks);
    }

    if (mapping?.controls?.length > 0) {
      this.setControls(mapping.controls);
    }
    if (mapping?.projects?.length > 0) {
      this.setProjects(mapping.projects);
    }
    if (mapping?.products?.length > 0) {
      this.setProducts(mapping.products);
    }
    if (mapping?.customers?.length > 0) {
      this.setCustomers(mapping.customers);
    }
    if (mapping?.strategic_objectives?.length > 0) {
      this.setStrategicObjectives(mapping.strategic_objectives);
    }
    if (mapping?.findings?.length > 0) {
      this.setStrategicfindings(mapping.findings);
    }

    if(mapping?.noc_findings?.length > 0){
      this.setNonConformity(mapping.noc_findings);
    }

  }

  setMeetingPlanDocumentsForEdit() {
    for (let i of MeetingPlanStore.individualMeetingPlanDetails.documents) {
      let docurl = this._meetingPlanFileService.getThumbnailPreview('meeting-plan-document', i.token);
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
      this._meetingPlanService.setDocumentDetails(docDetails, docurl);
      setTimeout(() => {
        this.checkForFileUploadsScrollbar();
      }, 200);
    }
  }

  setIssues(item) {
    IssueListStore.selectedIssuesList = [];
    let tempItem = item;
    for (let i of tempItem) {
      i['issue_categories'] = this.getArrayFormatedString('title', i.organization_issue_categories);
      i['departments'] = this.getArrayFormatedString('title', i.organization_issue_departments);
      i['issue_domains'] = this.getArrayFormatedString('title', i.organization_issue_domains);
      i['issue_types_list'] = [];
      for (let j of i.organization_issue_types) {
        i['issue_types_list'].push(j.title);
      }
      IssueListStore.selectedIssuesList.push(i);
    }
  }

  setProcesses(items) {
    ProcessStore.selectedProcessesList = [];
    let processItem = items;
    for (let i of processItem) {
      i['process_group_title'] = i.process_group?.title;
      i['department'] = i.department?.title;
      i['process_category_title'] = i.process_category?.title;
      ProcessStore.selectedProcessesList.push(i);
    }
  }

  setRisk(items) {
    MeetingPlanStore.selectedRiskList = items;
  }

  setControls(items){
    ControlStore.selectedControlsList = items;
  }

  setProjects(items){
    BusinessProjectsStore.selectedProjectList = items;
  }

  setProducts(items){
    BusinessProductsStore.selectedProductList = items;
  }

  setCustomers(items){
    BusinessCustomersStore.selectedCustomerList = items;
  }

  setStrategicObjectives(items){
    StrategicObjectivesMasterStore.selectedStrategic = items;
  }

  setStrategicfindings(items){
    AuditFindingsStore._selectedFindingItemAll = items;
  }

  setNonConformity(items){
    FindingsStore._selectedNonConformityItemAll = items;
  }

  setMeetingCriteria() {

    MeetingCriteriaMasterStore._selectedMeetingCriteriaAll = [];
    for (let i of MeetingPlanStore.individualMeetingPlanDetails.meeting_criteria) {
      MeetingCriteriaMasterStore._selectedMeetingCriteriaAll.push(i);
    }
  }

  setMeetingObjective() {

    MeetingObjectiveMasterStore._selectedMeetingObjectiveAll = [];
    for (let i of MeetingPlanStore.individualMeetingPlanDetails.meeting_objectives) {
      MeetingObjectiveMasterStore._selectedMeetingObjectiveAll.push(i);
    }
  }

  setMeetingAgenda() {

    MeetingAgendaMasterStore._selectedMeetingAgendaAll = [];
    for (let i of MeetingPlanStore.individualMeetingPlanDetails.meeting_agendas) {
      MeetingAgendaMasterStore._selectedMeetingAgendaAll.push(i);
    }
  }

  setMeetingPlanAgenda() {

    MeetingPlanStore.clearMeetingPlanAgendas()
    for (let meeting_agenda of MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_meeting_agendas) {

      let processedObject={
        ...meeting_agenda,
        start_time:meeting_agenda.start_time?this._helperService.processTime(meeting_agenda.start_time,true):meeting_agenda.start_time,
        display_agenda_type:meeting_agenda.meeting_agenda_type,
        display_owner:meeting_agenda.owner,
        is_editable:true
      }
      MeetingPlanStore.setMeetingPlanAgenda(processedObject)
    }
  }
  
  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(MeetingPlanStore.meetingPlanAgendas, event.previousIndex, event.currentIndex);
    MeetingPlanStore.meetingPlanAgendas.forEach((agenda, idx) => {
      agenda.order = idx + 1;
    });
  }

  deleteMeetingObjective(objective) {

    MeetingObjectiveMasterStore.deleteMeetingObjectiveById(objective.id);
  }

  deleteMeetingCriteria(criteria) {

    MeetingCriteriaMasterStore.deleteMeetingCriteriaById(criteria.id);
  }

  deleteMeetingAgenda(agenda) {

    MeetingAgendaMasterStore.deleteMeetingAgendaById(agenda.id);
  }

  removeAgenda(position){
   // MeetingPlanStore.meetingPlanAgendas.splice(position, 1);
    MeetingPlanStore.removeAgenda(position);
    this._utilityService.showSuccessMessage('success','agenda_removed')

  }
   
  addMeetingPlanAgenda(){
    this.meetingAgendaObject.type='add'
    this.meetingAgendaObject.values=null
    setTimeout(() => {
      this.openAgendaFormModal()
    }, 150);
  }

  editMeetingPlanAgenda(agendaTobeEdited){

this.meetingAgendaObject.type='edit'
this.meetingAgendaObject.values=agendaTobeEdited

setTimeout(() => {
  this.openAgendaFormModal()
}, 250);
  }


  //mapping delete
  deleteselectedMappingList(MappingArray, index){
    MappingArray.splice(index,1);
    this.deleteMasseage();
  }

  deleteMasseage(){
    switch(this.selectedSection){
      case 'issue':
        this._utilityService.showSuccessMessage('success', 'issue_deleted_successfully');
        break;
      case 'process':
        this._utilityService.showSuccessMessage('success', 'process_deleted_successfully');
        break;
      case 'risk':
        this._utilityService.showSuccessMessage('success', 'risk_deleted_successfully');
        break;
      case 'control':
        this._utilityService.showSuccessMessage('success', 'control_deleted_successfully');
        break;
      case 'projects':
        this._utilityService.showSuccessMessage('success', 'project_deleted_successfully');
        break;
      case 'product':
        this._utilityService.showSuccessMessage('success', 'product_deleted_successfully');
        break;
      case 'customer':
        this._utilityService.showSuccessMessage('success', 'customer_deleted_successfully');
        break;
      case 'objective':
        this._utilityService.showSuccessMessage('success', 'strategic_objective_deleted_successfully');
        break;
      case 'audit_finding':
        this._utilityService.showSuccessMessage('success', 'audit_finding_deleted_successfully');
        break;
      case 'non-conformity':
        this._utilityService.showSuccessMessage('success', 'non_conformity_deleted_successfully');
        break;
    }
  }  
  //**mapping delete

  getMeetingCategory() {

    this._meetingCategoryService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getVenue() {
    this._venueService.getItems().subscribe(res => {
      this.venueArray=res.data;
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getOrganization() {
    this._subsidiaryService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getPreviousMeetings() {
    this._meetingsService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchPreviousMeetings(event) {
    this._meetingsService.getSearchItems('q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMeetingCategory(event) {
    this._meetingCategoryService.getSearchItems('q=' + event.term).subscribe(res => {
      if (MeetingCategoryMasterStore.lastInsertedId) {
        for (let item of res.data) {
          if (MeetingCategoryMasterStore.lastInsertedId == item.id) {
            this.form.patchValue({ meeting_category_id: item });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchVenue(event) {
    this._venueService.getSearchItems('q=' + event.term).subscribe(res => {
      if (VenueMasterStore.lastInsertedId) {
        for (let item of res.data) {
          if (VenueMasterStore.lastInsertedId == item.id) {
            this.venueArray=[];
            this.venueArray=res.data;
            this.form.patchValue({ venue_id: item });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchOrganization(event) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + event.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  searchMsType(event) {
    this._msTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchParticipants(e, auth?) {

    var params = '';
    if (auth) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
        + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value);
    }

    this._usersService.searchUsers('?q=' + e.term + params).subscribe(res => {
      if (auth) {
        for (let item of res.data) {
          if (e.term == item.id) {
            this.form.patchValue({ organizer_id: item });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchDepartment(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSection(e) {

    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e) {

    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
      if (this.form.get('division_ids').value)
        params += '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      if (this.form.get('department_ids').value)
        params += '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  resetFormSelectClose(clear: number) { //this are using ng-select close reset all fromcontrol(form part-2)
    switch (clear) {
      case 1: this.form.patchValue({ "division_ids": [], "department_ids": [], "section_ids": [], "sub_section_ids": [], "organizer_id": [], "meeting_plan_users": [] });
        break;
      case 2: this.form.patchValue({ "department_ids": [], "section_ids": [], "sub_section_ids": [], "organizer_id": [], "meeting_plan_users": [] });
        break;
      case 3: this.form.patchValue({ "section_ids": [], "sub_section_ids": [], "organizer_id": [], "meeting_plan_users": [] });
        break;
      case 4: this.form.patchValue({ "sub_section_ids": [], "organizer_id": [], "meeting_plan_users": [] });
        break;
      case 5: this.form.patchValue({ "organizer_id": [], "meeting_plan_users": [] });
        break;

    }

  }
//this code depend(divistion,deparment ,sec, sub sention, ect..) clear . is there api side object missing 

  // removeFormItemSelectRemove() {//single data remove dependent All removeing

  //   let divtionIdArray = [];
  //   let departmentIDArrayDinamic = [];

  //   for (var organizationId in this.form.value.organization_ids.map(a => a.id)) {
  //     for (var divtionOrganiztionId in this.form.value.division_ids.map(a => a.organization_id)) {
  //       if (this.form.value.organization_ids.map(a => a.id)[organizationId] == this.form.value.division_ids.map(a => a.organization_id)[divtionOrganiztionId]) {

  //         divtionIdArray.push(this.form.value.division_ids.map(a => a.id)[divtionOrganiztionId]); //"org_id" equalto div inside "org_id" if-statement use collect "real div id" 
  //       }
  //     }
  //     if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division == 0) {//dinamic
  //       for (var departmentID in this.form.value.department_ids.map(a => a.organization_id)) {
  //         if (this.form.value.organization_ids.map(a => a.id)[organizationId] == this.form.value.department_ids.map(a => a.organization_id)[departmentID]) {
  //           departmentIDArrayDinamic.push(this.form.value.department_ids.map(a => a.organization_id)[departmentID]);
  //         }
  //       }
  //     }
  //   }

  //   let divitionDataArray = [];
  //   for (let data in this.form.value.division_ids.map(a => a.id)) {
  //     for (let id in divtionIdArray) {
  //       if (divtionIdArray[id] == this.form.value.division_ids.map(a => a.id)[data]) {
  //         divitionDataArray.push(this.form.value.division_ids[data]);//div id equal collect array id crrent "formValue array inside object" push divitionDataArray
  //       }
  //     }
  //   }
  //   this.form.patchValue({ "division_ids": divitionDataArray });




  //   let departmentDataArray = [];
  //   let departmentIdArray = [];
  //   if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division == 1) {
  //     for (let data in this.form.value.department_ids.map(a => a.division_id)) {
  //       for (let id in divtionIdArray) {
  //         if (divtionIdArray[id] == this.form.value.department_ids.map(a => a.division_id)[data]) {
  //           departmentDataArray.push(this.form.value.department_ids[data]);//alreay get divsionIdArray in orgatation that array are using department
  //           departmentIdArray.push(this.form.value.department_ids.map(a => a.id)[data]);
  //         }
  //       }
  //     }
  //   } else {//dinamic
  //     for (let data in this.form.value.department_ids.map(a => a.organization_id)) {
  //       for (let id in departmentIDArrayDinamic) {
  //         if (departmentIDArrayDinamic[id] == this.form.value.department_ids.map(a => a.organization_id)[data]) {
  //           departmentDataArray.push(this.form.value.department_ids[data]);//alreay get divsionIdArray in orgatation that array are using department
  //           departmentIdArray.push(this.form.value.department_ids.map(a => a.id)[data]);
  //         }
  //       }
  //     }
  //   }
  //   this.form.patchValue({ "department_ids": departmentDataArray });




  //   let sectionDataArray = [];
  //   let sectionIdArray = [];
  //   for (let data in this.form.value.section_ids.map(a => a.department_id)) {
  //     for (let id in departmentIdArray) {
  //       if (departmentIdArray[id] == this.form.value.section_ids.map(a => a.department_id)[data]) {
  //         sectionDataArray.push(this.form.value.section_ids[data]);
  //         sectionIdArray.push(this.form.value.section_ids.map(a => a.id)[data])
  //       }
  //     }
  //   }
  //   this.form.patchValue({ "section_ids": sectionDataArray });

  //   let subSectionDataArray = [];
  //   if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section == 1) {
  //     for (let data in this.form.value.sub_section_ids.map(a => a.section_id)) {
  //       for (let id in sectionIdArray) {
  //         if (sectionIdArray[id] == this.form.value.sub_section_ids.map(a => a.section_id)[data]) {
  //           subSectionDataArray.push(this.form.value.sub_section_ids[data]);
  //         }
  //       }
  //     }
  //   } else {//dinamic

  //     // for(let data in this.form.value.sub_section_ids.map(a=>a.department_id)){
  //     //   for(let id in departmentIdArray){
  //     //     if(departmentIdArray[id]==this.form.value.sub_section_ids.map(a=>a.department_id)[data]){
  //     //       subSectionDataArray.push(this.form.value.sub_section_ids[data]);
  //     //     }
  //     //   }
  //     // }
  //   }

  //   this.form.patchValue({ "sub_section_ids": subSectionDataArray });

  //   if (this.form.value.sub_section_ids.length == 0) {
  //     this.resetFormSelectClose(5);
  //   }

  // }

  getMeetingType() {
    this._meetingTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

  searchSubsidiary(e) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary) {
      this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  searchDivision(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // for getting  division
  getDivision() {
    let params = '';
    if (Object.keys(this.form.value.organization_ids).length != 0) {
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.value.organization_ids);
      this._divisionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      DivisionMasterStore.setAllDivision([]);
    }
    return true;
  }

  // geting department
  getDepartment() {
    let params = '';
    if (Object.keys(this.form.value.organization_ids).length != 0) {
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

  // getting section
  getSection() {
    let params = '';
    if (Object.keys(this.form.value.organization_ids).length != 0) {
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
    if (Object.keys(this.form.value.organization_ids).length != 0) {
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

  // Get leader users
  getUsers(clear: boolean) {
    if (clear) {
      UsersStore.setAllUsers([]);
      if (Object.keys(this.form.value.department_ids).length == 0) {
        UsersStore.setAllUsers([]);
      } else {
        var params = '';
        params = '?organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
          + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
          + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
          + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
          + '&sub_section_ids=' + this._helperService.createParameterFromArray(this.form.get('sub_section_ids').value);
        this._usersService.getAllItems(params).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
      }
    } else {
      this.form.patchValue({ "organizer_id": [] });
    }
  }

  // Get leader users
  getAllUsers() {
    UsersStore.setAllUsers([]);
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getMeetingAgenda() {
    this._meetingAgendaService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoMappingSection(type) {
    if (type == 'issue') {
      NoDataItemStore.setNoDataItems({ title: "issues_nodata_title_selected" });
    } else if (type == 'process') {
      NoDataItemStore.setNoDataItems({ title: "process_nodata_title_selected" });
    } else if (type == 'risk') {
      NoDataItemStore.setNoDataItems({ title: "risk_nodata_title_selected" });
    } else if (type == 'control') {
      NoDataItemStore.setNoDataItems({ title: "control_nodata_title_selected" });
		} else if (type == 'projects') {
      NoDataItemStore.setNoDataItems({ title: "projects_nodata_title_selected" });
		} else if (type == 'product') {
      NoDataItemStore.setNoDataItems({ title: "product_nodata_title_selected" });
		} else if (type == 'customer') {
      NoDataItemStore.setNoDataItems({ title: "customer_nodata_title_selected" });
		} else if (type == 'objective') {
      NoDataItemStore.setNoDataItems({ title: "objective_nodata_title_selected" });
		} else if (type == 'audit_finding') {
      NoDataItemStore.setNoDataItems({ title: "finding_nodata_title_selected" });
		} else if (type == 'non-conformity'){
      NoDataItemStore.setNoDataItems({ title: "non_conformity_nodata_title_selected" });
    }
    else if (type == 'agenda'){
      NoDataItemStore.setNoDataItems({ title: "agenda_nodata_added" });
    }
    this.selectedSection = type;
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageUrl(type,token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  // Returns default image
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  selectIssues() {
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select issues
  closeIssues() {
    IssueListStore.issue_select_form_modal = false;
    $(this.issueFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Opens Modal to Select Processes
  selectProcesses() {
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select processes
  closeProcesses() {
    IssueListStore.processes_form_modal = false;
    $(this.processFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Opens Modal to Select Processes
  selectRiskModal() {
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select processes
  closeRiskModal() {
    MappingStore.risk_select_form_modal = false;
    $(this.riskFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Opens Modal to Select Controls
  selectControlsModal() {
    MappingStore.control_select_form_modal = true;
    $(this.controlFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select Controls
  closeControlsModal() {
    MappingStore.control_select_form_modal = false;
    $(this.controlFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // Opens Modal to Select projects
  selectProjectsModal() {
    BusinessProjectsStore.project_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select Projects
  closeProjectsModal() {
    BusinessProjectsStore.project_select_form_modal = false;
    $(this.projectFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  //select modal for projects
	selectProducts() {
		BusinessProductsStore.product_select_form_modal = true;
		//ProjectsStore.issue_select_form_modal = true;
		$(this.productFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	//close modal for select projects
	closeProducts() {
		BusinessProductsStore.product_select_form_modal = false;
		$(this.productFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  	//select modal for projects
	selectCustomers() {
		BusinessCustomersStore.customer_select_form_modal = true
		//ProjectsStore.issue_select_form_modal = true;
		$(this.customerFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  //close modal for select projects
	closeCustomers() {
		BusinessCustomersStore.customer_select_form_modal = false;
		$(this.customerFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	//select modal for objective
	selectObjectives() {
		StrategicObjectivesMasterStore.objective_select_form_modal = true
		$(this.objectiveFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeObjectives() {
		StrategicObjectivesMasterStore.objective_select_form_modal = false;
		$(this.objectiveFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  	//select modal for audit_finding
	selectFinding() {
		AuditFindingsStore.finding_select_form_modal = true
		$(this.findingFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeFinding() {   
		AuditFindingsStore.finding_select_form_modal = false;
		$(this.findingFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  	//select modal for Non Conformity
  selectNonConformity() {
		FindingsStore.no_Conformity_finding_select_form_modal = true
		$(this.nonConformityFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeNonConformity() {   
		FindingsStore.no_Conformity_finding_select_form_modal = false;
		$(this.nonConformityFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  onCheckboxChange(e, data) {
    const meeting_type_ids: any = this.form.get('meeting_type_ids').value;
    if (e.target.checked) {
      meeting_type_ids.push(data);
      
      if(data.type == 'offline') this.form.controls["venue_id"].setValidators(Validators.required);
      else if(data.type == 'online') this.form.controls["meeting_link"].setValidators(Validators.required);
    
    } else {
      const index = meeting_type_ids.findIndex(x => x.id === data.id);
      meeting_type_ids.splice(index, 1);
      if(data.type == 'offline') this.form.patchValue({venue_id : null})
      else if(data.type == 'online') this.form.patchValue({meeting_link : ''})
    }
    this.form.patchValue({
      meeting_type_ids: meeting_type_ids
    })

  }

  getMeetingTypeStatus(id: number) {
    const meeting_type_ids = this.form.get('meeting_type_ids').value;
    const index = meeting_type_ids.findIndex(x => x.id === id);
    if (index != -1) return true;
    else return false;
  }

  // getMeetingTypeStatusByTitle(type: string) {
  //   console.log('hi');
    
  //   const meeting_type_ids = this.form.get('meeting_type_ids').value;
  //   if(meeting_type_ids){
  //     const index = meeting_type_ids.findIndex(x => x.type === type);
  //     if (index != -1) return true;
  //     else return false;
  //   }
  // }

  getSelectedValues() {
    this.setSaveData();
  }


  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getArrayFormatedString(type, items) {
 
    if(items.length && items[0])
    {
      return this._helperService.getArraySeperatedString(',', type, items);
    }
    
  }

  // nextPrev(n?: number) { //next button and prv button
  //   // This function will figure out which tab to display
  //   var x: any = document.getElementsByClassName("tab");
  //   // Exit the function if any field in the current tab is invalid:
  //   // if (n == 1 && !validateForm()) return false;
  //   if (document.getElementsByClassName("step")[this.currentTab]) {
  //     document.getElementsByClassName("step")[this.currentTab].className +=
  //       " finish";
  //   }

  //   // Hide the current tab:
  //   x[this.currentTab].style.display = "none";
  //   this.currentTab = this.currentTab + n;

  //   // if you have reached the end of the form...
  //   if (this.currentTab >= x.length) {
  //     // ... the form gets submitted:
  //     this.currentTab =
  //       this.currentTab > 0 ? this.currentTab - n : this.currentTab;
  //     x[this.currentTab].style.display = "block";
  //     this.submitForm();
  //     return false;
  //   }
  //   // Otherwise, display the correct tab:
  //   this.showTab(this.currentTab);
  // }

  // showTab(n) {
  //   // This function will display the specified tab of the form...
  //   var x: any = document.getElementsByClassName("tab");
  //   if (x[n]) x[n].style.display = "block";
  //   //... and fix the Previous/Next buttons:
  //   if (n == 0) {
  //     if (document.getElementById("prevBtn"))
  //       document.getElementById("prevBtn").style.display = "none";
  //   } else {
  //     if (document.getElementById("prevBtn"))
  //       document.getElementById("prevBtn").style.display = "inline";
  //   }

  //   if (n == (x.length - 1)) {
  //     this.showMap();
  //     this.getSelectedValues();
  //     if (document.getElementById("nextBtn")) this.nextButtonText = "save";
  //     // document.getElementById("nextBtn").innerHTML = "Save";
  //   } else {

  //     if (document.getElementById("nextBtn")) this.nextButtonText = "next";
  //     //document.getElementById("nextBtn").innerHTML = "Next";
  //   }
  //   //... and run a function that will display the correct step indicator:
  //   this.fixStepIndicator(n);
  // }

  showMap(){
    if(IssueListStore?.selectedIssuesList.length != 0){
      this.gotoMappingSection('issue');
    } else if (ProcessStore?.selectedProcessesList.length != 0){
      this.gotoMappingSection('process');
    } else if (MeetingPlanStore?.selectedRiskList.length != 0){
      this.gotoMappingSection('risk');
    } else if (ControlStore?.selectedControlsList.length != 0){
      this.gotoMappingSection('control');
    } else if (BusinessProjectsStore?.selectedProjectsList.length != 0){
      this.gotoMappingSection('projects');
    } else if (BusinessProductsStore?.selectedProductList.length != 0){
      this.gotoMappingSection('product');
    } else if (BusinessCustomersStore?.selectedCustomerList.length != 0){
      this.gotoMappingSection('customer');
    } else if (StrategicObjectivesMasterStore?.selectedStrategic.length != 0){
      this.gotoMappingSection('objective');
    } else if (AuditFindingsStore?._selectedFindingItemAll.length != 0){
      this.gotoMappingSection('audit_finding');
    } else if (FindingsStore?._selectedNonConformityItemAll?.length != 0){
      this.gotoMappingSection('non-conformity');
    }
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

  addAgendaTitle(title) {
    let checksametitle = true;

    if (MeetingPlanStore.updateItem) {
      for (let i of this.MeetingPlanStore.newMeetingAgenda) {
        if (i.title == MeetingPlanStore.updateItem.title) {
          i.title = title;
        }
      }
      MeetingPlanStore.updateItem = null;
      MeetingPlanStore.selectedMeeting = null;
      this.newAgenda = null;
    }
    else {

      for (let i of this.MeetingPlanStore.newMeetingAgenda) {//this are same title check
        if (i.title == title) {
          checksametitle = false;
        }
      }

      if (checksametitle) {
        this.MeetingPlanStore.newMeetingAgenda.push({ title: title, meeting_agendas: [], id: Date.now(), class: '', text_box_value: null });
        this.newAgenda = null;
        this.MeetingAgendaSameDataError = false;
      } else {
        this.MeetingAgendaSameDataError = true;
      }
      // this.MeetingPlanStore.newMeetingAgenda.push({ title : title, meeting_agendas:[], id: Date.now(), class: '', text_box_value: null});
      // this.newAgenda = null;
    }
    this.subItemButtonClicked=false;
    // this.cancelAgenda()
    // this.addIsOpen=false;
    if(this.hoverButton){
      this.addIsOpen=true;
      this.hoverButton=false;
      let input=this.newAgendaInput.nativeElement;
      input.focus();
      input.select();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  mousepPointerOver(){
    this.hoverButton=true;
  }
  mousepPointerOut(){
    this.hoverButton=false;
  }

  meetingAgendaSameDataErrorClick(event: any) {//error message input filed click remove error message
    if (event) {
      this.MeetingAgendaSameDataError = false;
    }

  }

  addMinutesClicked(meetingItem) {
    this.subItemButtonClicked=true;
    MeetingPlanStore.selectedMeeting = meetingItem;
    setTimeout(() => {
      let input=this.newAgendaInput2.nativeElement;
      input.focus();
      input.select();
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  addToMeetingAgenda(meetingItem) {

    if (meetingItem && meetingItem.text_box_value) {
      if (MeetingPlanStore.updateItem) {
        MeetingPlanStore.updateItem.title = meetingItem.text_box_value;
        var resp = this.findObjectAndUpdate(MeetingPlanStore.newMeetingAgenda, MeetingPlanStore.updateItem, MeetingPlanStore.selectedMeeting);
      }
      else {
        let itemToPush = { title: meetingItem.text_box_value, meeting_agendas: [], id: Date.now(), class: 'ml-4', text_box_value: null };
        var res = this.findObjectAndPush(this.MeetingPlanStore.newMeetingAgenda, meetingItem, itemToPush);
      }
    }
    // this.cancelAgenda(meetingItem)
    if(this.hoverButton){
      MeetingPlanStore.selectedMeeting = meetingItem;
      this.hoverButton=false;
      let input=this.newAgendaInput2.nativeElement;
      input.focus();
      input.select();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  cancelAgenda(data?) {
    this.MeetingAgendaSameDataError=false;
    this.newAgenda = null;
    MeetingPlanStore.selectedMeeting = null;
    MeetingPlanStore.updateItem = null;
    if (data) {
      data.text_box_value = null;
    }
  }

  findObjectAndPush(obj, label, data) {
    if (obj.id === label.id) { obj.meeting_agendas.push(data); obj.text_box_value = null; return obj }
    else {
      for (let i of obj) {
        if (i.id == label.id) { i.meeting_agendas.push(data); i.text_box_value = null; return obj }
        else if (i.meeting_agendas.length > 0) {
          var foundLabel = this.findObjectAndPush(i.meeting_agendas, label, data);
          if (foundLabel) {
            return foundLabel;
          }
        }
      }
    }
    return null;
  }

  findObjectAndUpdate(obj, itemToUpdate, parentItem) {
    for (let i of obj) {
      if (i.id == itemToUpdate.id) {
        i = itemToUpdate;
        parentItem.text_box_value = null;
        MeetingPlanStore.updateItem = null;
        MeetingPlanStore.selectedMeeting = null;
        return obj;
      }
      else if (i.meeting_agendas.length > 0) {
        var foundLabel = this.findObjectAndUpdate(i.meeting_agendas, itemToUpdate, parentItem);
        if (foundLabel) {
          break;
        }
      }
    }
  }

  deleteMinutes(item, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == item.id) {
        array.splice(i, 1);
        return true;
      }
      // else {
      //   var deleteRes = this.deleteMinutes(item, array[i].meeting_agendas);
      //   break;
      //   // if(deleteRes)
      //   //   exit;
      // }
    }
  }

  createSaveData() {
    var meetingAgendaListString = JSON.stringify(MeetingPlanStore.newMeetingAgenda);
    var meetingAgendaParsed = JSON.parse(meetingAgendaListString);
    for (let i of meetingAgendaParsed) {
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if (i.meeting_agendas.length > 0) {
        this.processObjectsForSave(i.meeting_agendas);
      }
    }
    if (meetingAgendaParsed.length) {
      return meetingAgendaParsed;
    }
  }

  processObjectsForSave(list) {
    for (let i of list) {
      delete i.id;
      delete i.class;
      delete i.text_box_value;
      if (i.meeting_agendas.length > 0) {
        this.processObjectsForSave(i.meeting_agendas);
      }
    }
  }

  keyboardEvent(event, item) {
    var code = (event.keyCode ? event.keyCode : event.which);
    if (code == 13) {
      this.addToMeetingAgenda(item);
    }
  }

  editValue(items) {
    this.findEditPosition(items, MeetingPlanStore.newMeetingAgenda)
  }

  findEditPosition(item, dataArray, parentArray?) {
    for (let i of dataArray) {
      if (i.id == item.id) {
        MeetingPlanStore.updateItem = item;
        MeetingPlanStore.selectedMeeting = parentArray;
        this.newAgendaEdit = item.title;
        if (parentArray) parentArray.text_box_value = item.title;
        else {
          this.newAgendaEdit = item.title;
        }
      }
      else {
        if (i.meeting_agendas.length > 0) {
          this.findEditPosition(item, i.meeting_agendas, i);
        }
      }
    }

  }

  setValuesForEdit() {
    if (MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_meeting_agendas) {
      this.addIsOpen = true;
      MeetingPlanStore.newMeetingAgenda = [];
      let newDataObject;
      for (let j of MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_meeting_agendas) {
        newDataObject = { title: j.title, meeting_agendas: [], id: j.id, class: '', text_box_value: null }
        MeetingPlanStore.newMeetingAgenda.push(newDataObject);
        if (j.children.length > 0) {
          for (let i of j.children) {
            this.processValuesForEdit(i, newDataObject);
          }
        }
      }
    }
  }

  processValuesForEdit(item, parentArray) {
    if (item) {
      let newDataObject = { title: item.title, meeting_agendas: [], id: item.id, class: 'ml-4', text_box_value: null }
      parentArray.meeting_agendas.push(newDataObject);
      if (item.children.length > 0) {
        for (let i of item.children) {
          this.processValuesForEdit(i, parentArray.meeting_agendas[parentArray.meeting_agendas.length - 1]);
        }
      }
    }

  }

  cancelMeetingPlan(status) {
    if (status) {
      if (MeetingPlanStore.meetingPlanId) {
        // if( MeetingPlanStore.editListCancelFlag=='list'){
        //   this._router.navigateByUrl('mrm/meeting-plans');
        // }else{  
          this._router.navigateByUrl('mrm/meeting-plans/' + MeetingPlanStore.meetingPlanId);
        // }
      }else{
        this._router.navigateByUrl('mrm/meeting-plans');
      }
      AppStore.disableLoading();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
      this.clearCancelObject();
    }, 250);
  }

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }


  addMeetingAgenda() {
    setTimeout(() => {
      $(this.meetingAgenda.nativeElement).modal('show');
    }, 50);
  }

  closeMeetingAgenda() {
    $(this.meetingAgenda.nativeElement).modal('hide');
    // if(!this.form.value.meeting_agenda_ids)
    // {
    //   this.selectedAgendas=[];
    // }
    // else
    // {
    //   this.selectedAgendas=this.form.value.meeting_agenda_ids;
    // }

    if (MeetingAgendaMasterStore.lastInsertedId) {
      // this.selectedAgendas.push(MeetingAgendaMasterStore.lastInsertedId);
      let nmeetingAgendaArray: any[] = this.form.value.meeting_agenda_ids ? this.form.value.meeting_agenda_ids : [];
      nmeetingAgendaArray.push(MeetingAgendaMasterStore.lastInsertedId);
      this.form.patchValue({ meeting_agenda_ids: nmeetingAgendaArray });
    }
    this._utilityService.detectChanges(this._cdr);
  }

  openMeetingAgenda() {
    this.addIsOpen = true;
    setTimeout(() => {
      let input=this.newAgendaInput.nativeElement;
      input.focus();
      input.select();     
    }, 100);
  }

  VenueAdd() {
    $(this.addVenue.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeVenueAdd() {
    $(this.addVenue.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  categoryAdd() {
    $(this.addCategory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closecategoryAdd() {
    $(this.addCategory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  criteriaAdd() {
    MeetingPlanStore.criteria_form_modal = true;
    $(this.addCriteria.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  agendasAdd() {
    MeetingPlanStore.agenda_form_modal = true;
    $(this.addAgenda.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  objectiveAdd() {
    MeetingPlanStore.objectives_form_modal = true;
    $(this.addObjective.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'cancel_meeting_plan_creation';
    this.cancelObject.subtitle = '';
    $(this.cancelPopup.nativeElement).modal('show');

  }
  
  closeCriteriaAddModal() {
    MeetingPlanStore.criteria_form_modal = false;
    $(this.addCriteria.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeObjectiveAddModal() {
    MeetingPlanStore.objectives_form_modal = false;
    $(this.addObjective.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeAgendaAddModal() {
    MeetingPlanStore.agenda_form_modal = false;
    $(this.addAgenda.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  openAgendaFormModal(){
    $(this.agendaForm.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }
  closeAgendaFormModal(){
    $(this.agendaForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    this.meetingAgendaObject.type=null;
    this.meetingAgendaObject.values=null;
  }

	// *Common  File Upload/Attach Modal Functions Starts Here

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	setDocuments(documents) {
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {

					if (innerElement.is_latest) {

						khDocuments.push({
							...innerElement,
              title:element?.kh_document.title,
							'is_kh_document': true
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement

						})
					}

				});
			}
			else {
				if (element && element.token) {
					var purl = this._meetingPlanFileService.getThumbnailPreview('meeting-plan-document', element.token)
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
					}
				}
        
				this._fileUploadPopupService.setSystemFile(lDetails, purl)

			}

		});

		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]

		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	}

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

  removeDocument(doc) {
    
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

	// *Common  File Upload/Attach Modal Functions Ends Here

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // scrollbar function
  checkForFileUploadsScrollbar() {
    if (MeetingPlanStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
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

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // Check if logo is being uploaded
  checkLogoIsUploading() {
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._meetingPlanService.setDocumentDetails(imageDetails, type);
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

  getTypesUsers(users) {
    let user = [];
    if (MeetingPlanStore.editFlag) {
      let selectedUsers = this.form.value.meeting_plan_users;
      // if(selectedUsers.length > 0){
      //   for(let i of selectedUsers){
      //     const index = MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users.findIndex(e => e.user.id === i.id); 
      //     if(index == -1){
      //       user.push({"user_id":i.id,"is_new":true});
      //     }
      //     else if(index != -1){
      //       user.push({"user_id":i.id});
      //     }
      //     else{
      //       user.push({"user_id":i.id,"is_deleted":true,"id":MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users[index].id});
      //     }
      //   }
      //   for(let i of MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users){
      //     const index = user.findIndex(e => e.user_id === i.user.id); 
      //     if(index == -1){
      //       user.push({"user_id":i.user.id,"is_deleted":true,"id":MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users[index].user.id});
      //     }
      //   }
      // }
      if (MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users.length > 0) {
        for (let i of MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users) {
          const index = selectedUsers.findIndex(e => e.id === i.user.id);
          if (index == -1) {
            user.push({ "user_id": i.user.id, "is_deleted": true, "id": i.id });
          }
          else {
            user.push({ "user_id": i.user.id});
          }
        }
        for (let i of selectedUsers) {
          const index = MeetingPlanStore.individualMeetingPlanDetails.meeting_plan_users.findIndex(e => e.user.id === i.id);
          if (index == -1) {
            user.push({ "user_id": i.id, "is_new": true });
          }
        }
      }
      else {
        for (let i of selectedUsers) {
          user.push({ "user_id": i.id, "is_new": true });
        }
      }
    }
    else {
     
     if(this.selectedMeetingUsers.length)
     {
        for (let i of this.selectedMeetingUsers) {
          const index = users.findIndex(e => e.id === i.id);
          if (index == -1) {
            user.push({ "user_id": i.id, "is_deleted": true });
          }
          else{
            user.push({ "user_id": i.id });
          }
        }
        for (let i of users) {
          const index = this.selectedMeetingUsers.findIndex(e => e.id === i.id);
          if (index == -1) {
            user.push({ "user_id": i.id, "is_new": true });
          }
        }
     }
     else
     {
        for (let i of users) {
          user.push({ "user_id": i.id, "is_new": true});

        }
     }
      
    }
    return user;
  }

  setSaveData() {
    this.saveData = {
      meeting_link:this.form.value?.meeting_link ? this.form.value.meeting_link : null,
      meeting_id: this.form.value?.meeting_id ? this.form.value.meeting_id.id : null,
      meeting_category_id: this.form.value.meeting_category_id ? this.form.value.meeting_category_id.id : null,
      title: this.form.value.title ? this.form.value.title : '',
      description: this.form.value.description ? this.form.value.description : '',
      from: this.form.value.from ? this._helperService.passSaveFormatDate(this.form.value.from) : '',
      to: this.form.value.to ? this._helperService.passSaveFormatDate(this.form.value.to) : '',
      is_all_day: 1,
      meeting_type_ids: this._helperService.getArrayProcessed(this.form.value.meeting_type_ids, 'id'),
      meeting_objective_ids: MeetingObjectiveMasterStore?._selectedMeetingObjectiveAll ? this._helperService.getArrayProcessed(MeetingObjectiveMasterStore?._selectedMeetingObjectiveAll, 'id') : [],
      meeting_criterion_ids: MeetingCriteriaMasterStore?._selectedMeetingCriteriaAll ? this._helperService.getArrayProcessed(MeetingCriteriaMasterStore?._selectedMeetingCriteriaAll, 'id') : [],
      // meeting_agenda_ids: this.form.value.meeting_agenda_ids ? this.form.value.meeting_agenda_ids : null,
      // meeting_agenda_ids: MeetingAgendaMasterStore?._selectedMeetingAgendaAll ? this._helperService.getArrayProcessed(MeetingAgendaMasterStore?._selectedMeetingAgendaAll, 'id') : [],
      // meeting_agendas: this.createSaveData() ? this.createSaveData() : [],
      meeting_agendas: MeetingPlanStore.meetingPlanAgendas.length>0?MeetingPlanStore.meetingPlanAgendas:[],
      ms_type_organization_ids: this.form.value.ms_type_organization_ids ? this._helperService.getArrayProcessed(this.form.value.ms_type_organization_ids, 'id') : [],
      venue_id: this.form.value.venue_id ? this.form.value.venue_id.id : null,
      organizer_id: this.form.value.organizer_id.id ? this.form.value.organizer_id.id : '',
      organization_ids: this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : null,
      division_ids: this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : null,
      department_ids: this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : null,
      section_ids: this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : null,
      sub_section_ids: this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : null,
      meeting_plan_users: this.form.value.meeting_plan_users ? this.getTypesUsers(this.form.value.meeting_plan_users) : null,
      // documents: MeetingPlanStore.docDetails,
      process_ids: ProcessStore.selectedProcessesList ? this._helperService.getArrayProcessed(ProcessStore.selectedProcessesList, 'id') : [],
      organization_issue_ids: IssueListStore.selectedIssuesList ? this._helperService.getArrayProcessed(IssueListStore.selectedIssuesList, 'id') : [],
      risk_ids: MeetingPlanStore.selectedRiskList ? this._helperService.getArrayProcessed(MeetingPlanStore.selectedRiskList, 'id') : [],
      control_ids: ControlStore.selectedControlsList ?  this._helperService.getArrayProcessed(ControlStore.selectedControlsList, 'id') : [],
      project_ids: BusinessProjectsStore?.selectedProjectsList ?  this._helperService.getArrayProcessed(BusinessProjectsStore?.selectedProjectsList, 'id') : [],
      product_ids: BusinessProductsStore?.selectedProductList ?  this._helperService.getArrayProcessed(BusinessProductsStore?.selectedProductList, 'id') : [],
      customer_ids:BusinessCustomersStore?.selectedCustomerList ?  this._helperService.getArrayProcessed(BusinessCustomersStore?.selectedCustomerList, 'id') : [],
      strategic_objective_ids: StrategicObjectivesMasterStore?.selectedStrategic ?  this._helperService.getArrayProcessed(StrategicObjectivesMasterStore?.selectedStrategic, 'id') : [],
      finding_ids: AuditFindingsStore?._selectedFindingItemAll ?this._helperService.getArrayProcessed(AuditFindingsStore?._selectedFindingItemAll, 'id') : [],
      noc_finding_ids: FindingsStore?._selectedNonConformityItemAll ? this._helperService.getArrayProcessed(FindingsStore?._selectedNonConformityItemAll, 'id') : [],
    }
    
    if (this.form.value.id) {
			this.saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
			this.saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
      
		}
  }

  submitForm() {
    this.formErrors =null;
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    let save;
    if (MeetingPlanStore.meetingPlanId) {
      save = this._meetingPlanService.updateItem(MeetingPlanStore.meetingPlanId, this.saveData);
    }
    else {
      save = this._meetingPlanService.saveItem(this.saveData);
    }

    save.subscribe(res => {
      AppStore.disableLoading();
      this._router.navigateByUrl('mrm/meeting-plans/' + res['id']);
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "next";
        this.previousButtonText = "previous";
        this.setIntialTab();
        this.showTab(this.currentTab,1);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  checkDepartment(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  checkRiskCategory(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  checkRiskType(department) {
    if (typeof department === 'object') {
      let e;
      e = this._helperService.getArrayProcessed(department, 'is_external').toString();
      if (e === "1") {
        return "External";
      }
      let i = this._helperService.getArrayProcessed(department, 'is_internal').toString();
      if (i === "1") {
        return "Internal"
      }
      else {
        return "External,Internal"
      }
    }
    else {
      return department;
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

  // Agenda New Design Change Starts Here

  addObservation(index){
    if(index!=null)
    this.mainIndex = index+1;
    else
    this.mainIndex=0;
    this.addMainClicked = true;
  
  }

  getObservationLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.meeting_agendas.replace(regex, "");
    return result.length;
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  removeItem(index){
    if(this.observationArray[index].id){
      this.observationArray[index]['is_deleted'] = true;
    }
    else
    this.observationArray.splice(index,1);
  }

  editItem(index){
    this.mainIndex = index;
    this.addMainClicked = true;
    this.editFlag = index;
    this.form.patchValue({
      meeting_agendas:this.observationArray[index].data

    })
  }
  removeSubItem(index,subIndex){
    if(this.observationArray[index].subItem[subIndex].id){
      this.observationArray[index].subItem[subIndex]['is_deleted'] = true;
    }
    else
    this.observationArray[index].subItem.splice(subIndex,1)

  }

  addSubItem(index){
    this.subItemDescription = null;
    this.subItemOpened = true;
    this.observationIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }


  editSubItem(index,subIndex){
    this.observationIndex=index;
    this.subItemIndex=subIndex;
    this.subItemOpened = true;
    this.subItemDescription  = this.observationArray[index].subItem[subIndex].sub;
    this.form.patchValue({
      sub_item_description:this.observationArray[index].subItem[subIndex].sub

    })
  }
  
  cancelObservation(){
    this.addMainClicked = false;
    this.editFlag=null;
    this.form.patchValue({
      meeting_agendas:null
    })
  }

  addObservationToList(index){
    let tempArray=[];

    if(index==null){
      if(this.observationArray[0]!=null){
        for(let i of this.observationArray)
        tempArray.push(i);
      }
      this.observationArray = [];
      this.observationArray[0]={title:this.form.value.meeting_agendas,meeting_agendas:[]};

    for(let j of tempArray){
      this.observationArray.push(j);
    }
    }
    else{
      if(this.editFlag!=null && this.mainIndex==this.editFlag){
        this.observationArray[index].title=this.form.value.meeting_agendas;
        this.editFlag = null;
      }
      else{
        if(this.observationArray[index+1] && this.observationArray[index+1]!=null)
        {
          for(let i=0;i<this.observationArray.length;i++){
            if((i+1)>=(index+1)){
              tempArray.push(this.observationArray[i+1]);
              this.observationArray.splice(i+1,1);
            }
          }
        }
        this.observationArray[index+1]={title:this.form.value.meeting_agendas,meeting_agendas:[]};
        for(let k of tempArray){
          this.observationArray.push(k)
        }
  
      }  
    }
   
    this.form.patchValue({
      meeting_agendas:''
    })
    this.addMainClicked = false;

  }

//   confirmMainDelete(index){
  
//     this.cancelObject.type = '';
//     this.cancelObject.title = 'main';
//     this.cancelObject.position=index;
//     this.cancelObject.subtitle = 'Are you sure you want to delete this item?';
//     $(this.cancelPopup.nativeElement).modal('show');
  
// }

// confirmSubDelete(index,subIndex){

//   this.cancelObject.type = '';
//   this.cancelObject.title = 'sub';
//   this.cancelObject.position=index;
//   this.cancelObject.sub_position=subIndex;
//   this.cancelObject.subtitle = 'Are you sure you want to delete this item?';
//   $(this.cancelPopup.nativeElement).modal('show');

// }

closeObservationModal(type) {
  if(type=='cancel'){
    if(!this.saveClicked){
    this.subItemDescription=null;
    }
    this.fileUploadsArray = [];
    this.subItemOpened = false;
    this.saveClicked = false;
    this.subItemIndex=null;
  }
  else if(type=='close'){

    this.fileUploadsArray = [];
    this.subItemOpened = false;
    this.saveClicked = false;
    if(this.subItemIndex!=null){
      let subIndexId = this.observationArray[this.observationIndex].meeting_agendas[this.subItemIndex]?.id?this.observationArray[this.observationIndex].meeting_agendas[this.subItemIndex]?.id:null;
    
      this.observationArray[this.observationIndex].meeting_agendas[this.subItemIndex]={
        id:subIndexId,
        title:this.subItemDescription,
      }
    }
    else{
      let indexId = this.observationArray[this.observationIndex]?.id?this.observationArray[this.observationIndex]?.id:null
      this.observationArray[this.observationIndex].meeting_agendas.push({
        id:indexId,
        title:this.subItemDescription,
      }) 
    }
    this.subItemIndex=null;
   
    // this.form.patchValue({
    //   sub_item_description:null
    // })
    this.meeting_agenda_subtitle=null;

  }
  else if(type=='save'){
    this.saveClicked = true;
    this.subItemOpened = false;
    this.observationArray[this.observationIndex].meeting_agendas
    if(this.subItemIndex!=null){
      this.observationArray[this.observationIndex].meeting_agendas[this.subItemIndex]={
        title:this.subItemDescription,
      }
    }
    else{
      this.observationArray[this.observationIndex].meeting_agendas.push({
        title:this.subItemDescription,
      }) 
    }
    this.subItemIndex=null;
   

  }
  this._utilityService.detectChanges(this._cdr);

}

setDescription(event){
  this.subItemDescription = event.target.value;
}

// Save and Next Code Starts Here

saveTabDetails(){
  if(this.currentTab==0){
    this.saveMeetingPlanInfo('save');
  }
  if(this.currentTab==1){
     this.saveMeetingParticipants('save');
  }
  if(this.currentTab==2){
     this.saveMapping()
  }   
  if(this.currentTab==3){
    this.saveTopic()
  }
}

planInfoSaveData(){
  let saveData = {
    ms_type_organization_ids:this.form.value.ms_type_organization_ids ? this._helperService.getArrayProcessed(this.form.value.ms_type_organization_ids, 'id') : [],
    meeting_link:this.form.value?.meeting_link ? this.form.value.meeting_link : null,
    meeting_id: this.form.value?.meeting_id ? this.form.value.meeting_id.id : null,
    meeting_category_id: this.form.value.meeting_category_id ? this.form.value.meeting_category_id.id : null,
    title: this.form.value.title ? this.form.value.title : '',
    description: this.form.value.description ? this.form.value.description : '',
    purpose: this.form.value.purpose ? this.form.value.purpose : '',
    from: this.form.value.from ? this._helperService.passSaveFormatDate(this.form.value.from) : '',
    to: this.form.value.to ? this._helperService.passSaveFormatDate(this.form.value.to) : '',
    is_all_day: 1,
    venue_id: this.form.value.venue_id ? this.form.value.venue_id.id : null,
    meeting_type_ids: this._helperService.getArrayProcessed(this.form.value.meeting_type_ids, 'id'),
    meeting_objective_ids: MeetingObjectiveMasterStore?._selectedMeetingObjectiveAll ? this._helperService.getArrayProcessed(MeetingObjectiveMasterStore?._selectedMeetingObjectiveAll, 'id') : [],
    meeting_criterion_ids: MeetingCriteriaMasterStore?._selectedMeetingCriteriaAll ? this._helperService.getArrayProcessed(MeetingCriteriaMasterStore?._selectedMeetingCriteriaAll, 'id') : [],
  }
  if (MeetingPlanStore.selecetdMeetingPlanId) {
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
  } else{
    saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
  }
  return saveData
}




saveMeetingPlanInfo(type){
  this.formErrors =null;
  AppStore.enableLoading();
  let save;
  if (MeetingPlanStore.selecetdMeetingPlanId) {
    save = this._meetingPlanService.updatePlanInfo(MeetingPlanStore.selecetdMeetingPlanId,this.planInfoSaveData());
  }
  else {
    save = this._meetingPlanService.savePlanInfo(this.planInfoSaveData());
  }

  save.subscribe(res => {
    
    AppStore.disableLoading();
    // this._router.navigateByUrl('mrm/meeting-plans/' + res['id']);
    MeetingPlanStore.selecetdMeetingPlanId = res['id'];
    this.clearCommonFilePopupDocuments();
    this.getMeetingPlan();
    this._utilityService.detectChanges(this._cdr);
  }, (err: HttpErrorResponse) => {
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    if (err.status == 422) {
      this.formErrors = err.error.errors;
      if(type!='save')
      {
        this.nextPrev(-1)
      }
      this._utilityService.detectChanges(this._cdr);
    }
  })
}

processDataForPatricipants(){
  let saveData = {
    meeting_plan_id : MeetingPlanStore.selecetdMeetingPlanId,
    organization_ids: this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : null,
    division_ids: this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : null,
    department_ids: this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : null,
    section_ids: this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : null,
    sub_section_ids: this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : null,
    // organizer_ids: this.form.value.organizer_ids ? this._helperService.getArrayProcessed(this.form.value.organizer_ids, 'id'):[],
    organizer_id: this.form.value.organizer_id ? this.form.value.organizer_id.id:null,
    meeting_plan_users: this.form.value.meeting_plan_users ? this.getTypesUsers(this.form.value.meeting_plan_users) : null,
  }
  return saveData
}
saveMeetingParticipants(type){
  this.formErrors =null;
  AppStore.enableLoading();
  let save;
  if (MeetingPlanStore.selecetdMeetingPlanId) {
    save = this._meetingPlanService.saveParticipents(this.processDataForPatricipants());
  }

  save.subscribe(res => {
    if(!MeetingPlanStore.editFlag)
    {
      this.selectedMeetingUsers=this.form.value.meeting_plan_users
    }
    AppStore.disableLoading();
    // this._router.navigateByUrl('mrm/meeting-plans/' + res['id']);
    this._utilityService.detectChanges(this._cdr);
  }, (err: HttpErrorResponse) => {
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    if (err.status == 422) {
      this.formErrors = err.error.errors;
      if(type!='save')
      {
        this.nextPrev(-1)
      }
      this._utilityService.detectChanges(this._cdr);
    }
  })
}

processDataForMappings(){
  let saveData = {
    meeting_plan_id : MeetingPlanStore.selecetdMeetingPlanId,
    process_ids: ProcessStore.selectedProcessesList ? this._helperService.getArrayProcessed(ProcessStore.selectedProcessesList, 'id') : [],
    organization_issue_ids: IssueListStore.selectedIssuesList ? this._helperService.getArrayProcessed(IssueListStore.selectedIssuesList, 'id') : [],
    risk_ids: MeetingPlanStore.selectedRiskList ? this._helperService.getArrayProcessed(MeetingPlanStore.selectedRiskList, 'id') : [],
    control_ids: ControlStore.selectedControlsList ?  this._helperService.getArrayProcessed(ControlStore.selectedControlsList, 'id') : [],
    project_ids: BusinessProjectsStore?.selectedProjectsList ?  this._helperService.getArrayProcessed(BusinessProjectsStore?.selectedProjectsList, 'id') : [],
    product_ids: BusinessProductsStore?.selectedProductList ?  this._helperService.getArrayProcessed(BusinessProductsStore?.selectedProductList, 'id') : [],
    customer_ids:BusinessCustomersStore?.selectedCustomerList ?  this._helperService.getArrayProcessed(BusinessCustomersStore?.selectedCustomerList, 'id') : [],
    strategic_objective_ids: StrategicObjectivesMasterStore?.selectedStrategic ?  this._helperService.getArrayProcessed(StrategicObjectivesMasterStore?.selectedStrategic, 'id') : [],
    finding_ids: AuditFindingsStore?._selectedFindingItemAll ?this._helperService.getArrayProcessed(AuditFindingsStore?._selectedFindingItemAll, 'id') : [],
    noc_finding_ids: FindingsStore?._selectedNonConformityItemAll ? this._helperService.getArrayProcessed(FindingsStore?._selectedNonConformityItemAll, 'id') : [],
    // previous_meeting_ids: MeetingsStore.selectedMeetingForMapping ? this._helperService.getArrayProcessed(MeetingsStore.selectedMeetingForMapping, 'id') : [],
    // policy_ids:PolicyStore.selectedPoliciesForMapping ? this._helperService.getArrayProcessed(PolicyStore.selectedPoliciesForMapping, 'id') : [],
    // objective_ids:ObjectiveMasterStore.selectedItmesForMapping ? this._helperService.getArrayProcessed(ObjectiveMasterStore.selectedItmesForMapping, 'id') : [],
    // corrective_action_ids:CorrectiveActionsStore.selectedItmesForMapping ? this._helperService.getArrayProcessed(CorrectiveActionsStore.selectedItmesForMapping, 'id') : [],
    // internal_issue_ids: IssueListStore.selectedInternalItmesForMapping ? this._helperService.getArrayProcessed( IssueListStore.selectedInternalItmesForMapping, 'id') : [],
    // external_issue_ids: IssueListStore.selectedExtrenalItmesForMapping ? this._helperService.getArrayProcessed( IssueListStore.selectedExtrenalItmesForMapping, 'id') : [],
    // ms_audit_result_ids: MsAuditStore.selectedItmesForMapping ? this._helperService.getArrayProcessed( MsAuditStore.selectedItmesForMapping, 'id') : [],
    // finding_ids: MsAuditNonConfirmitiesStore.selectedItmesForMapping ? this._helperService.getArrayProcessed( MsAuditNonConfirmitiesStore.selectedItmesForMapping, 'id') : [],
    // risk_ids: FanrRiskStore.selectedItmesForMapping ? this._helperService.getArrayProcessed( FanrRiskStore.selectedItmesForMapping, 'id') : [],
    // kpi_ids: FanrRiskStore.selectedItmesForMapping ? this._helperService.getArrayProcessed( KpiMasterStore.selectedItmesForMapping, 'id') : [],
  }
  return saveData
}
saveMapping(){
  this.formErrors =null;
  AppStore.enableLoading();
  let save;
  if (MeetingPlanStore.selecetdMeetingPlanId) {
    save = this._meetingPlanService.saveMappings(this.processDataForMappings());
  }

  save.subscribe(res => {
    AppStore.disableLoading();
    // this._router.navigateByUrl('mrm/meeting-plans/' + res['id']);
    this._utilityService.detectChanges(this._cdr);
  }, (err: HttpErrorResponse) => {
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    if (err.status == 422) {
      this.formErrors = err.error.errors;
      this.nextPrev(-1)
      this._utilityService.detectChanges(this._cdr);
    }
  })
}
saveTopic(){
  this.formErrors =null;
  let obj = {
    meeting_agendas: MeetingPlanStore.meetingPlanAgendas.length>0?MeetingPlanStore.meetingPlanAgendas:[],
  }
  AppStore.enableLoading();
  let save;
  if (MeetingPlanStore.selecetdMeetingPlanId) {
    save = this._meetingPlanService.saveAgendas(obj);
  }

  save.subscribe(res => {
    AppStore.disableLoading();
    // this._router.navigateByUrl('mrm/meeting-plans/' + res['id']);
    this._utilityService.detectChanges(this._cdr);
  }, (err: HttpErrorResponse) => {
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    if (err.status == 422) {
      this.formErrors = err.error.errors;
      this._utilityService.detectChanges(this._cdr);
    }
  })
}

nextPrev(n?: number) { //next button and prv button
  // This function will figure out which tab to display
  var x: any = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (document.getElementsByClassName("step")[this.currentTab]) {
    document.getElementsByClassName("step")[this.currentTab].className +=
      " finish";
  }

  // Hide the current tab:
  x[this.currentTab].style.display = "none";
  this.currentTab = this.currentTab + n;

  // if you have reached the end of the form...
  if (this.currentTab >= x.length) {
    // ... the form gets submitted:
    this.currentTab =
      this.currentTab > 0 ? this.currentTab - n : this.currentTab;
    x[this.currentTab].style.display = "block";
    // this.submitForm();
    if(!MeetingPlanStore?.editFlag)
    {
      this._utilityService.showSuccessMessage('sucess','meeting_plan_saved_successfully');
    }
    else
    {
      this._utilityService.showSuccessMessage('sucess','meeting_plan_updated_successfully');
    }
        this._router.navigateByUrl('mrm/meeting-plans/' + MeetingPlanStore.selecetdMeetingPlanId);
    return false;
  }
  // Otherwise, display the correct tab:
  this.showTab(this.currentTab,n);
}

showTab(n,prev) {
  // This function will display the specified tab of the form...
  var x: any = document.getElementsByClassName("tab");
  if (x[n]) x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    if (document.getElementById("prevBtn"))
      document.getElementById("prevBtn").style.display = "none";
  } else {
    if (document.getElementById("prevBtn"))
      document.getElementById("prevBtn").style.display = "inline";
  }

  if (n == (x.length - 1)) {
    this.showMap();
    // this.getSelectedValues();
    this.saveTopic()
    if (document.getElementById("saveNext")) 
    // this.nextButtonText = "save";
    document.getElementById("nextBtn").style.display = "none";
    if (document.getElementById("saveNext")) this.nextButtonText = "Save";


  } else {
    
    document.getElementById("nextBtn").style.display = "inline-block";

    if (document.getElementById("saveNext")) this.nextButtonText = "Save & Next";

    if(n==1 && prev==1){
      this.saveMeetingPlanInfo('save_and_next')
    }
    if(n==2&& prev==1){
      this.saveMeetingParticipants('save_and_next')
    }
    if(n==3 && prev==1){
      this.saveMapping()
    }
   
    // if (document.getElementById("nextBtn")) this.nextButtonText = "next";
  }
  //... and run a function that will display the correct step indicator:
  this.fixStepIndicator(n);
}

// Save and Next Code ends here

  // Agena New Design Change Ends Here

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    MeetingPlanStore.newMeetingAgenda = [];
    SubMenuItemStore.makeEmpty();
    MeetingsStore.unSetMeetings();//meeting list
    MeetingPlanStore.unsetEditFlag();
    NoDataItemStore.unsetNoDataItems();
    MeetingPlanStore.clearDocumentDetails();
    MeetingPlanStore.selecetdMeetingPlanId = null
    this.subscription.unsubscribe();
    this.addAgendaEvent.unsubscribe();
    this.addCriteriaEvent.unsubscribe();
    this.venueSubscriptionEvent.unsubscribe();
    this.riskSelectSubscription.unsubscribe();
    this.venueSubscriptionEvent.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.controlSelectSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.customerSelectSubscription.unsubscribe();
    this.objectiveSelectSubscription.unsubscribe();
    this.meetingAgendaSubscriptionEvent.unsubscribe();
    this.meetingCategorySubscriptionEvent.unsubscribe();
    this.meetingCategorySubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.findingSelectSubscription.unsubscribe();
    this.nonConformitySelectSubscription.unsubscribe();

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
    
    this.initNotWorkAndEdit=false;
    MeetingPlanStore.clearMeetingPlanAgendas();
  }

}
