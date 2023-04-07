import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { RiskLibraryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-library';
import { BiaService } from 'src/app/core/services/bcm/bia/bia.service';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { BiaTireService } from 'src/app/core/services/masters/bcm/bia-tire/bia-tire.service';
import { RiskLibraryService } from 'src/app/core/services/masters/risk-management/risk-library/risk-library.service';
import { RiskReviewFrequencyService } from 'src/app/core/services/masters/risk-management/risk-review-frequency/risk-review-frequency.service';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { BiaTireMasterStore } from 'src/app/stores/masters/bcm/bia-tire';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { RiskLibraryMasterStore } from 'src/app/stores/masters/risk-management/risk-library-store';
import { RiskReviewFrequencyMasterStore } from 'src/app/stores/masters/risk-management/risk-review-frequency-store';
import { RiskTypeMasterStore } from 'src/app/stores/masters/risk-management/risk-type-store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  selector: 'app-risk-assessment-add',
  templateUrl: './risk-assessment-add.component.html',
  styleUrls: ['./risk-assessment-add.component.scss']
})
export class RiskAssessmentAddComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('criteriaPopup') criteriaPopup: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('objectivePopup') objectivePopup: ElementRef;
  @ViewChild('assetsFormModal') assetsFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild("riskLibraryModal") riskLibraryModal: ElementRef;
	@ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('locationFormModal') locationFormModal: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('controlAddFormModal') controlAddFormModal: ElementRef;
  @ViewChild('strategicFocusAreaModal') strategicFocusAreaModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  StrategicObjectivesMasterStore = StrategicObjectivesMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  RiskReviewFrequencyStore = RiskReviewFrequencyMasterStore;
  BcmRiskAssessmentStore = BcmRiskAssessmentStore;
  RiskLibraryMasterStore = RiskLibraryMasterStore;
  BusinessCustomersStore = BusinessCustomersStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessServiceStore = BusinessServiceStore;
  FocusAreaMasterStore = FocusAreaMasterStore
  LocationMasterStore = LocationMasterStore;
  AssetRegisterStore = AssetRegisterStore;
  BiaTireMasterStore = BiaTireMasterStore;
  RiskTypeStore = RiskTypeMasterStore;
  IssueListStore = IssueListStore;
  ProcessStore = ProcessStore;
  ControlStore = ControlStore;
  UsersStore = UsersStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BiaStore = BiaStore;

  form: FormGroup;
  formErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  selectedSection = 'control';
  searchTerm: any;
  processItemEmptyList: string;
  selectedProcess: boolean = false;
  openModelPopup: boolean = false;
  cancelEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  reactionDisposer: IReactionDisposer;
  currentProcess: any;
  formObject = {
    0:[
      'processId',
    ],
    1:[
      'title',
      'risk_owner_id',
      'risk_date'
    ],
  }
  organisationChangesModalSubscription: any;
  controlObject = {
		values: null,
		type: null,
		page: 'add-risk'
	}
  riskLibraryObject = {
		component: 'Master',
		values: null,
		type: null
	};
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  modalObject = {
    component : 'risk',
  }
  issueSelectSubscription: any;
  projectSelectSubscription: any;
  locationSelectSubscription: any;
  productSelectSubscription: any;
  customerSelectSubscription: any;
  controlSelectSubscription: any;
  objectiveSelectSubscription: any;
  commonEmptyList = "common_nodata_title";
	customerModalTitle = 'risk_customer_modal_message';
	projectsModalTitle = 'risk_projects_modal_message';
	issuesModalTitle = 'risk_issues_modal_message';
	processModalTitle = 'risk_process_modal_message';
	locationModalTitle = 'risk_location_modal_message';
	productModalTitle = 'risk_product_modal_message';
	strategicModalTitle = 'risk_strategic_modal_message';
	controlsModalTitle = 'risk_controls_modal_message';
  strategicFocusAreaTitle = 'risk_strategic_focusarea_message';
  serviceModalTitle = 'asset_service_modal_message';
  assetsModalTitle = 'asset_modal_message'

  controlModalEventSubscription: any;
  librarySelectSubscription: any;
  focusAreaSelectSubscription: any;
  subscription: any;
  serviceSelectSubscription: any;
  assetsSelectSubscription: any;
  controlAddFormSubscription: any;

  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _controlService: ControlsService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _biaService: BiaService,
    private _biaTireService: BiaTireService,
    private _userService:UsersService,
    private _imageService: ImageServiceService,
    private _riskTypeService: RiskTypeService,
    private _riskLibraryService: RiskLibraryService,
    private _humanCapitalService: HumanCapitalService,
    private _bcmRiskAssessmentService: BcmRiskAssessmentService,
    private _riskReviewFrequencyService: RiskReviewFrequencyService,
    private _aprService:AprService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    NoDataItemStore.unsetNoDataItems()
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);
    this.reactionDisposer = autorun(() => {
			if (NoDataItemStore.clikedNoDataItem) {
				this.openIssueProcessModal(this.selectedSection);

				NoDataItemStore.unSetClickedNoDataItem();
			}
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					default:
						break;
				}
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			setTimeout(() => {
				this.form.pristine;
			}, 250);
		});
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(BcmRiskAssessmentStore.selectedProcessId&&BcmRiskAssessmentStore.selectedId&&BcmRiskAssessmentStore.is_from_info){
      SubMenuItemStore.setSubMenuItems([{ type: "close", path: '/bcm/risk-assessment/'+BcmRiskAssessmentStore.selectedId }])
    }else{
      SubMenuItemStore.setSubMenuItems([{ type: "close", path: '../' }])
    }
    window.addEventListener("scroll", this.scrollEvent, true);
    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
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
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
			if (this.controlObject.type) {
				this.closeControlModal();
			}
		})

    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
			var modalNumber: number = item;
			// console.log(modalNumber);
			switch (modalNumber) {

				case 7: this.closeProcesses();
					break;
			}
			this._utilityService.detectChanges(this._cdr);
		})
    
		this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
			this.closeIssues();
		})

    this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
			this.closeServiceMapping();
		  })

		this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
			this.closeProjects();
		})

    this.librarySelectSubscription = this._eventEmitterService.riskLibrary.subscribe(item => {
			this.closeLibrary();
		})

		this.locationSelectSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
			this.closeLocations();
		})
		this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
			this.closeProducts();
		})
		this.customerSelectSubscription = this._eventEmitterService.customerControl.subscribe(item => {
			this.closeCustomers();
		})

    this.assetsSelectSubscription = this._eventEmitterService.assetsMappingModal.subscribe(item => {
			this.closeAssets();
		})

		this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControls();
		})

    this.controlAddFormSubscription = this._eventEmitterService.addNewControlEvent.subscribe(item => {
			this.closeControlModal();
		})

    this.focusAreaSelectSubscription = this._eventEmitterService.strategicFocusAreaMapping.subscribe(item => {
			this.closeFocusArea();
		})

		this.objectiveSelectSubscription = this._eventEmitterService.strategicObjectivesMapping.subscribe(item => {
			this.closeObjectives();
		})
    this.form = this._formBuilder.group({
      id:[null],
      tire_id:[null],
      processId:[null,[Validators.required]],
      title:['',[Validators.required]],
      is_corporate: [false],
      sub_risk_ids:[],
      description:[''],
      user_ids:[null],
      risk_owner_id:[null,[Validators.required]],
      risk_type_ids:[null],
      risk_review_frequency_id:[null],
      risk_date:[null,[Validators.required]],
      organization_ids: [[]],
      department_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      process_ids: [[]],
			product_ids: [[]],
			project_ids: [[]],
			customer_ids: [[]],
			strategic_objective_ids: [[]],
			control_ids: [[]],
			organization_issue_ids: [[]],
      strategic_focusarea_ids: [[]],
      service_ids: [[]],
      asset_ids: [[]],
    })
    this.resetForm();
    if (this._router.url.indexOf('edit') != -1) {
      if(BcmRiskAssessmentStore.selectedProcessId){
        this.selectedProcess=true
        this.currentProcess = BcmRiskAssessmentStore.selectedProcessId
        this.form.patchValue({
          processId:BcmRiskAssessmentStore.selectedProcessId
        })
      }
      else
        this._router.navigateByUrl('/bcm/risk-assessment');
    }else{
      this.form.patchValue({
        risk_date: this._helperService.getTodaysDateObject()
      })
      this.setInitialOrganizationLevels();
    }
    setTimeout(() => {
      if(BcmRiskAssessmentStore.selectedProcessId&&BcmRiskAssessmentStore.selectedId&&BcmRiskAssessmentStore.is_from_info){
        this.currentTab=1
        this.showTab(this.currentTab);
        this.getProcessList()
      }else{
        this.showTab(this.currentTab);
        if(this.currentTab==0){
          this.getProcessList()
        }
      }
      
    }, 100);
    if(BcmRiskAssessmentStore.BcmRiskList.length==0){
      this._bcmRiskAssessmentService.getItems(false,null,true).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    this.getBiaTire()
    this.gotoMappingSection('control')
    if(BcmRiskAssessmentStore.selectedProcessId){
      ProcessStore.setProcessId(BcmRiskAssessmentStore.selectedProcessId) 
      this._aprService.getProcessRecoveries().subscribe(res=>{
        if(res?.process_assets.length!=0)this.setType(res?.process_assets,'assets')
      })
    }
    setTimeout(() => {
      if (BiaTireMasterStore.loaded && BiaTireMasterStore.allItems.length != 0) {
        this.form.patchValue({
          tire_id: [BiaTireMasterStore.allItems[0].id]
        })
        this.sortProcess()
      }
    }, 500);
  }

  ngAfterViewInit() {
    this.form.patchValue({
      processId: BcmRiskAssessmentStore.selectedProcessId
    })
  }

  setCorporate(event) {
		if (event.target.checked) {
			this.form.patchValue({
				is_corporate: true
			})
		}

		else {
			this.form.patchValue({
				is_corporate: false
			})
		}
	}

  clear(type){
    if(type=='risk_date'){
      this.form.patchValue({
        risk_date:null
      })
    }
  }

  checkError(err){
    console.log("errrr",err)
  }

  processExisting(id){
    if(!BcmRiskAssessmentStore.is_edit){
      let existing = false
    var pos = BcmRiskAssessmentStore.BcmRiskList.findIndex(e=>e.business_impact_analysis_id==id)
    if(pos!=-1)existing = true
    return existing
    }
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
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

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if(type=='default'){
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

  getTypes(types) {
		let type = [];
		for (let i of types) {
			type.push(i.id);
		}
		return type;
	}

  setEditSection(){
    this._bcmRiskAssessmentService.getItem(BcmRiskAssessmentStore.selectedId).subscribe(res=>{
      if(res&&res.id){
        this.form.patchValue({
          id: res.id,
          title: res.title,
          sub_risk_ids: this.getFilterById(res.sub_risks),
          description:res.description,
          risk_owner_id: res.risk_owner?res.risk_owner:null,
          risk_type_ids: res.risk_types.length!=0?this.getFilterById(res.risk_types):null,
          risk_review_frequency_id: res.risk_review_frequency?res.risk_review_frequency.id:null,
          risk_date: res.risk_date?this._helperService.processDate(res.risk_date, 'split'):this._helperService.getTodaysDateObject(),
          is_corporate: res.is_corporate==1?true:false,
          processId: res.processes[0].id,
          user_ids: res.responsible_users,
          section_ids: res.sections ? res.sections : null,
					sub_section_ids: res.sub_sections ? res.sub_sections : null,
					organization_ids: res.organizations ? res.organizations : null,
					division_ids: res.divisions ? res.divisions : null,
					department_ids: res.departments ? res.departments : null,
          customer_ids: res.customers ? this.setType(res.customers, 'customer') : [],
          strategic_objective_ids: res.strategic_objectives ? this.setType(res.strategic_objectives, 'objective') : [],
          organization_issue_ids: res.organization_issues ? this.setType(res.organization_issues, 'issue') : [],
          control_ids: res.controls ? this.setType(res.controls, 'control') : [],
          strategic_focusarea_ids: res.risk_focus_areas ? this.setType(res.risk_focus_areas, 'focus-area') : [],
          service_ids: res.services ? this.setType(res.services, 'service') : [],
          process_ids: res.processes ? this.setType(res.processes, 'process') : [],
          asset_ids:res.risk_assets.length!=0 ? this.setType(res.risk_assets, 'assets') : [],
        })
      }
    })
  }

  setType(item, type?) {
		let items = [];
    if (type == 'control') {
			this.setControls(item);

		}
		else if (type == 'issue') {
			this.setIssues(item);

		}
		else if (type == 'process') {
			this.setProcesses(item);
		}
		else if (type == 'location') {
			this.setLocations(item);
		}
		else if (type == 'project') {
			this.setProjects(item);
		}
		else if (type == 'product') {
			this.setProducts(item);
		}
		else if (type == 'customer') {
			this.setCustomers(item);
		}
		else if (type == 'objective') {
			this.setObjectives(item);
		}
    else if (type == 'assets') {
			this.setAssets(item);
		}
    else if (type == 'focus-area') {
			this.setFocusAreas(item);
		}
    else if (type == 'service') {
			this.setServiceMapping(item);
		}
		// if (!RisksStore.addCorporate && type == 'corporate') {

		// 	items = item[0];

		// }

		else {
			for (let i of item) {

				items.push(i)
			}
		}


		return items;
	}

  getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

  setIssues(item) {
		
		let tempItem = item;
		for (let i of tempItem) {
      if(IssueListStore.selectedIssuesList.length==0){
        i['issue_categories'] = this.getArrayFormatedString('title', i.organization_issue_categories);
        i['departments'] = this.getArrayFormatedString('title', i.organization_issue_departments);
        i['issue_domains'] = this.getArrayFormatedString('title', i.organization_issue_domains);
        i['issue_types_list'] = [];
        for (let j of i.organization_issue_types) {
          i['issue_types_list'].push(j.title);
        }
        IssueListStore.selectedIssuesList.push(i);
      }else{
        var pos = IssueListStore.selectedIssuesList.findIndex(e=>e.id==i.id)
        if(pos==-1){
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
		}
	}
	setProcesses(items) {
		// console.log(items);
		let processItem = items;
		for (let i of processItem) {
      if(ProcessStore.selectedProcessesList.length==0){
        i['process_group_title'] = i.process_group?.title;
        i['department'] = i.department?.title;
        i['process_category_title'] = i.process_category?.title;
        ProcessStore.selectedProcessesList.push(i);
      }else{
        var pos = ProcessStore.selectedProcessesList.findIndex(e=>e.id==i.id)
        if(pos==-1){
          i['process_group_title'] = i.process_group?.title;
          i['department'] = i.department?.title;
          i['process_category_title'] = i.process_category?.title;
          ProcessStore.selectedProcessesList.push(i);
        }
      }
		}
	}
	setProjects(items) {
		// console.log(items);
		let projectItem = items;
		for (let i of projectItem) {
      // if(ProcessStore.selectedProcessesList.length==0){
      //   i['project_manager_first_name'] = i.project_manager?.first_name;
      //   i['project_manager_last_name'] = i.project_manager?.last_name;
      //   i['project_manager_image_token'] = i.project_manager?.image_token;
      //   i['location_title'] = i.location?.title;
      //   ProcessStore.selectedProcessesList.push(i);
      // }else{
      //   var pos = ProcessStore.selectedProcessesList.findIndex(e=>e.id==i.id)
      //   if(pos==-1){
      //     i['project_manager_first_name'] = i.project_manager?.first_name;
      //     i['project_manager_last_name'] = i.project_manager?.last_name;
      //     i['project_manager_image_token'] = i.project_manager?.image_token;
      //     i['location_title'] = i.location?.title;
      //     ProcessStore.selectedProcessesList.push(i);
      //   }
      // }
		}
	}
  
	setLocations(items) {
		// console.log(items);
		let locationItem = items;
		for (let i of locationItem) {
			LocationMasterStore.selectedLocationList.push(i);
		}
	}
  
	setProducts(items) {
		// console.log(items);
		let productItem = items;
		for (let i of productItem) {
			BusinessProductsStore.selectedProductList.push(i);
		}
	}
  
	setCustomers(items) {
		// console.log(items);
		let customerItem = items;
		for (let i of customerItem) {
      if(BusinessCustomersStore.selectedCustomerList.length==0){
        BusinessCustomersStore.selectedCustomerList.push(i);
      }else{
        var pos = BusinessCustomersStore.selectedCustomerList.findIndex(e=>e.id==i.id)
        if(pos==-1){
          BusinessCustomersStore.selectedCustomerList.push(i);
        }
      }
		}
	}
	setObjectives(items) {
		// console.log(items);
		let objectiveItem = items;
		for (let i of objectiveItem) {
			StrategicObjectivesMasterStore.selectedStrategic.push(i);
		}
	}
  
  setAssets(items) {
		// console.log(items);
		let objectiveItem = items;
		for (let i of objectiveItem) {
			if(AssetRegisterStore.selectedAssets.length==0){
        AssetRegisterStore.selectedAssets.push(i);
      }else{
        var pos = AssetRegisterStore.selectedAssets.findIndex(e=>e.id==i.id)
        if(pos==-1){
          AssetRegisterStore.selectedAssets.push(i);
        }
      }
		}
	}

  setFocusAreas(items) {
		// console.log(items);
		
		let objectiveItem = items;
		for (let i of objectiveItem) {
			FocusAreaMasterStore.selectedStrategic.push(i);
		}
	}

  setServiceMapping(items) {
		// console.log(items);
		
		let objectiveItem = items;
		for (let i of objectiveItem) {
      if(BusinessServiceStore.selectedBusinessServicesList.length==0){
        BusinessServiceStore.selectedBusinessServicesList.push(i);
      }else{
        var pos = BusinessServiceStore.selectedBusinessServicesList.findIndex(e=>e.id==i.id)
        if(pos==-1){
          BusinessServiceStore.selectedBusinessServicesList.push(i);
        }
      }
		}
	}

	setControls(items) {
		let controlItem = items;
		for (let i of controlItem) {
      if(ControlStore.selectedControlsList.length==0){
        ControlStore.selectedControlsList.push(i);
      }else{
        var pos = ControlStore.selectedControlsList.findIndex(e=>e.id==i.id)
        if(pos==-1){
          ControlStore.selectedControlsList.push(i);
        }
      }
		}
	}

  clearMappingArray(){
    IssueListStore.selectedIssuesList = [];
    ProcessStore.selectedProcessesList = [];
    BusinessProjectsStore.selectedProjectList = [];
    LocationMasterStore.selectedLocationList = [];
    BusinessProductsStore.selectedProductList = [];
    BusinessCustomersStore.selectedCustomerList = [];
    StrategicObjectivesMasterStore.selectedStrategic = [];
    AssetRegisterStore.selectedAssets = [];
    FocusAreaMasterStore.selectedStrategic = [];
    BusinessServiceStore.selectedBusinessServicesList = [];
    ControlStore.selectedControlsList = [];
  }

  getFilterById(fields) {
		var returnValues = [];
		for (let i of fields) {
			returnValues.push(i.id);
		}
		return returnValues;
	}

  addLibrary() {
		this.riskLibraryObject.type = 'Add';
		this.riskLibraryObject.values = null; // for clearing the value
		RiskLibraryMasterStore.risk_library_form_modal = true;
		this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'overflow', 'auto');
		this._renderer2.addClass(this.riskLibraryModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  closeLibrary() {
		if (RiskLibraryMasterStore.lastInsertedId) {
			this.searchRiskLibrary({ term: RiskLibraryMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskLibraryObject.type = null;
			RiskLibraryMasterStore.risk_library_form_modal = false;
			this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'z-index', 99999);
			this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'overflow', 'none');
			this._renderer2.removeClass(this.riskLibraryModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskLibraryModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();
			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

  searchRiskLibrary(e, patchValue: boolean = false) {
    var array=[]
		this._riskLibraryService.getItems(false, '&q=' + e.term).subscribe((res: RiskLibraryPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
            if(this.form.value.sub_risk_ids&&this.form.value.sub_risk_ids.length!=0){
              setTimeout(() => {
                array = this.form.value.sub_risk_ids
                array.push(i.id)
                this.form.patchValue({
                  sub_risk_ids:array
                })
                this.getSubRisk()
                this._utilityService.detectChanges(this._cdr);
              }, 100);
            }else{
              array.push(i.id)
              this.form.patchValue({
                sub_risk_ids: array,
              });
              this.getSubRisk()
              break;
            }
						
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

  searchSubRisk(e) {
		this._riskLibraryService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

  getSubRisk(newPage: number = null) {
    this._riskLibraryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addControl() {

		setTimeout(() => {
			this.controlObject.type = 'Add'
			this.controlObject.values = null;
			$(this.controlAddFormModal.nativeElement).modal('show');
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'display', 'block');
			this._utilityService.detectChanges(this._cdr);
		}, 250);

	}

	closeControlModal() {
		setTimeout(() => {
			this.controlObject.type = null;
			$(this.controlAddFormModal.nativeElement).modal('hide');
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'display', 'none');
			if (ControlStore.lastInsertedId) {
				this._controlService.getAllItems(false, '&q=' + ControlStore.lastInsertedId).subscribe(res => {
					if (res.data.length > 0) {
						for (let i of res.data) {
							if (i.id == ControlStore.lastInsertedId) {
								ControlStore?.selectedControlsList.push(i);
								break;
							}
						}
						ControlStore.setLastInsertedId(null);
					}
				})
			}
			this._utilityService.detectChanges(this._cdr);
		}, 100);

	}

  createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

  openIssueProcessModal(type) {
		if (type == 'issue') {
			this.selectIssues();

		}
		else if (type == 'process') {
			this.selectProcesses();
		}
		else if (type == 'location') {
			this.selectLocations();
		}
		else if (type == 'project') {
			this.selectProjects();

		}
		else if (type == 'product') {
			this.selectProducts();

		}
		else if (type == 'customer') {
			this.selectCustomers();

		}
		else if (type == 'objective') {
			this.selectObjectives();

		}
    else if (type == 'assets') {
			this.selectAssests();

		}
		else if (type == 'control') {
			this.selectControls();

		}

    else if (type == 'focus-area') {
			this.selectFocusArea();
		}

    else if (type == 'service') {
			this.selectServiceMapping();
		}

	}

  selectServiceMapping() {
		BusinessServiceStore.service_select_form_modal = true
		//ProjectsStore.issue_select_form_modal = true;
		$(this.serviceFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}
  closeServiceMapping() {
		BusinessServiceStore.service_select_form_modal = false;
		$(this.serviceFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  selectFocusArea() {
		FocusAreaMasterStore.objective_select_form_modal = true
		//ProjectsStore.issue_select_form_modal = true;
		$(this.strategicFocusAreaModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}
closeFocusArea() {
		FocusAreaMasterStore.objective_select_form_modal = false;
		$(this.strategicFocusAreaModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  // Opens Modal to Select Processes
	selectProcesses() {

		IssueListStore.processes_form_modal = true;
		$(this.processFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	// Close Modal to select processes
	closeProcesses() {
		IssueListStore.processes_form_modal = false;
		$(this.processFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	selectIssues() {
		// this.selectedType="issue";

		IssueListStore.issue_select_form_modal = true;
		$(this.issueFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	// Close Modal to select issues
	closeIssues() {
		IssueListStore.issue_select_form_modal = false;
		$(this.issueFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	selectLocations() {
		// this.selectedType="issue";

		LocationMasterStore.location_select_form_modal = true;
		$(this.locationFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	// Close Modal to select issues
	closeLocations() {
		LocationMasterStore.location_select_form_modal = false;
		$(this.locationFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	//select modal for projects
	selectProjects() {
		BusinessProjectsStore.project_select_form_modal = true;
		//ProjectsStore.issue_select_form_modal = true;
		$(this.projectFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	//close modal for select projects
	closeProjects() {
		BusinessProjectsStore.project_select_form_modal = false
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

	//select modal for projects
	selectObjectives() {
		StrategicObjectivesMasterStore.objective_select_form_modal = true
		//ProjectsStore.issue_select_form_modal = true;
		$(this.objectiveFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  selectAssests() {
		AssetRegisterStore.assets_select_form_modal = true
		//ProjectsStore.issue_select_form_modal = true;
		$(this.assetsFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  closeAssets() {
		AssetRegisterStore.assets_select_form_modal = false;
		$(this.assetsFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
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

	closeObjectives() {
		StrategicObjectivesMasterStore.objective_select_form_modal = false;
		$(this.objectiveFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  selectControls() {
		ControlStore.control_select_form_modal = true;
		//ProjectsStore.issue_select_form_modal = true;
		$(this.controlFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

  closeControls() {
		ControlStore.control_select_form_modal = false;
		$(this.controlFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

  deleteItem(type, index) {
		switch (type) {
			case 'control':
				ControlStore?.selectedControlsList.splice(index, 1)
				break;
			case 'issue':
				IssueListStore?.selectedIssuesList.splice(index, 1)
				break;
			case 'process':
				ProcessStore?.selectedProcessesList.splice(index, 1)
				break;
			case 'location':
				LocationMasterStore?.selectedLocationList.splice(index, 1)
				break;
			case 'project':
				BusinessProjectsStore?.selectedProjectsList.splice(index, 1)
				break;
			case 'product':
				BusinessProductsStore?.selectedProductList.splice(index, 1)
				break;
			case 'customer':
				BusinessCustomersStore?.selectedCustomerList.splice(index, 1)
				break;
			case 'strategic':
				StrategicObjectivesMasterStore?.selectedStrategic.splice(index, 1)
				break;
      case 'focus-area':
				FocusAreaMasterStore?.selectedStrategic.splice(index, 1)
				break;
      case 'assets':
				AssetRegisterStore?.selectedAssets.splice(index, 1)
				break;
      case 'service':
				BusinessServiceStore?.selectedBusinessServicesList.splice(index, 1)
				break;
		}
	}

  gotoMappingSection(type) {
		if (type == 'issue') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });


		}
		else if (type == 'process') {
			// if (RisksStore.individualRiskDetails?.is_analysis_performed != 1) {, subtitle: "common_nodata_subtitle", buttonText: "choose_process"
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
			// }
			// else
			// 	NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "process_mapping_restriction" });
		}

		else if (type == 'location') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_location" });
		}

		else if (type == 'project') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_project" });
		}

		else if (type == 'product') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_product" });
		}

		else if (type == 'customer') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_customer" });
		}
		else if (type == 'objective') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_strategic_objective" });
		}

		else if (type == 'control') {
			// if (RisksStore.individualRiskDetails?.is_analysis_performed != 1) {
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
			// }
			// else
			// 	NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "control_mapping_restriction" })
		}
    else if(type == 'focus-area'){
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_focus_area" });
    }
    else if(type == 'service'){
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_service" });
    }
    else if (type == 'assets') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_assets" });
		}
		this.selectedSection = type;
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

  setInitialOrganizationLevels() {
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids: AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    this._utilityService.detectChanges(this._cdr);

  }

  organisationChanges() {
    if(this._router.url.indexOf('edit') == -1&&(!this.form.value.organization_ids||this.form.value.organization_ids.length==0)){
      this.setInitialOrganizationLevels();
    }
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  searchRiskReviewFrequency(e) {
		this._riskReviewFrequencyService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}
	getRiskReviewFrequency(fetch: boolean = false) {
		this._riskReviewFrequencyService.getItems(fetch).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

  searchRiskType(e) {
		this._riskTypeService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

  getRiskType(fetch: boolean = false) {
		this._riskTypeService.getItems(fetch).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

  // getting  user
  getUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // search users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
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
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }
  // Returns default image url
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  changeProcess(){
    this.selectedProcess=!this.selectedProcess
    this.currentProcess = null
    this.form.patchValue({
      processId:''
    })
  }

  sortProcess() {
    var params = '';
    if (this.form.value.tire_id) params = `bia_tire_ids=${this.form.value.tire_id}&include_tire=1&business_impact_analysis_status_ids=4&tire_is_mandatory=1`;
    this._biaService.getAllItems(false, params).subscribe(res => {
      if(res.data.length == 0){
        this.processItemEmptyList = "Your search did not match any process. Please make sure you typed the process name correctly, and then try again."
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchBiaTire(e){
    this._biaTireService.getItems(false,'q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getBiaTire(newPage: number = null) {
    if (newPage) BiaTireMasterStore.setCurrentPage(newPage);
    this._biaTireService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  getProcess(process){
    this.currentProcess = process?.process_id
    BcmRiskAssessmentStore.selectedProcessId = process?.process_id
    this.form.patchValue({
      processId:process?.process_id,
      is_corporate:false
    })
    if(this.currentProcess==process.process_id){
      this.selectedProcess = true;
    }else{
      this.selectedProcess = false
      this.currentProcess = null
      BcmRiskAssessmentStore.selectedProcessId=null
    }
  }

  searchProcessWithActivities() {
    AdvanceProcessStore.setCurrentPage(1);
     let params = "";
      if (this.searchTerm) {
        this._biaService
        .getAllItems(false, `${this.form.value.tire_id?'bia_tire_ids='+this.form.value.tire_id:''}&q=${this.searchTerm}&include_tire=1&business_impact_analysis_status_ids=4&tire_is_mandatory=1` + params).subscribe(res => {
          if(res&&res.data.length==0){
            this.processItemEmptyList = "Your search did not match any process. Please make sure you typed the process name correctly, and then try again."
          }
          this._utilityService.detectChanges(this._cdr);
        });
      } else {
        this.getProcessList();
      }
  }

  getProcessList(newPage: number = null) {
    if (newPage) BiaStore.setCurrentPage(newPage);
    BiaStore.loaded = false
    BiaStore.orderBy = 'desc'
    BiaStore.orderItem = 'processes.id'
    this._biaService.getAllItems(false,`${this.form.value.tire_id?'bia_tire_ids='+this.form.value.tire_id:''}include_tire=1&business_impact_analysis_status_ids=4&tire_is_mandatory=1`,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  clearSearchBar() {
    this.searchTerm = '';
    this.searchProcessWithActivities();
  }

  cancelByUser(status) {
    if (status) {
      this._router.navigateByUrl('/bcm/risk-assessment');
    } else {
      
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  setSaveDataFotInfo(){
    let saveData = {
      title: this.form.value.title,
      sub_risk_ids: this.form.value.sub_risk_ids,
      description: this.form.value.description,
      risk_owner_id: this.form.value.risk_owner_id.id?this.form.value.risk_owner_id.id:null,
      risk_type_ids:  this.form.value.risk_type_ids,
      risk_review_frequency_id: this.form.value.risk_review_frequency_id,
      risk_date: this.form.value.risk_date ? this._helperService.processDate(this.form.value.risk_date, 'join') : null,
      is_corporate: this.form.value.is_corporate,
      process_ids: [this.form.value.processId],
      user_ids: this.form.value.user_ids?this.getTypes(this.form.value.user_ids):null,
      organization_ids: this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids: this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids: this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids: this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids: this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
    }
    return saveData;
  }

  setSaveDataFotMapping(){
    let saveData = {
      organization_issue_ids: IssueListStore.selectedIssuesList ? this.getFilterById(IssueListStore.selectedIssuesList) : [],
      process_ids: ProcessStore?.selectedProcessesList ? this.getFilterById(ProcessStore?.selectedProcessesList) : [],
      project_ids: BusinessProjectsStore?.selectedProjectsList ? this.getFilterById(BusinessProjectsStore?.selectedProjectsList) : [],
      product_ids: BusinessProductsStore?.selectedProductList ? this.getFilterById(BusinessProductsStore?.selectedProductList) : [],
      customer_ids: BusinessCustomersStore?.selectedCustomerList ? this.getFilterById(BusinessCustomersStore?.selectedCustomerList) : [],
      asset_ids: AssetRegisterStore?.selectedAssets ? this.getFilterById(AssetRegisterStore?.selectedAssets) : [],
      strategic_focus_area_ids: FocusAreaMasterStore?.selectedStrategic ? this.getFilterById(FocusAreaMasterStore?.selectedStrategic) : [],
      service_ids:BusinessServiceStore?.selectedBusinessServicesList ? this.getFilterById(BusinessServiceStore?.selectedBusinessServicesList) : [],
      control_ids:ControlStore?.selectedControlsList ? this.getFilterById(ControlStore?.selectedControlsList) : [],
    }
    return saveData;
  }

  submitRiskMapping(){
    AppStore.enableLoading();
		this.formErrors = null;

		let save;
		// if (this.form.value.id || BcmRiskAssessmentStore.selectedId) {
		// 	save = this._bcmRiskAssessmentService.updateRiskInfo(this.form.value.id ? this.form.value.id : BcmRiskAssessmentStore.selectedId, this.setSaveDataFotInfo());
		// }
		// else {
			save = this._bcmRiskAssessmentService.saveRiskMapping(BcmRiskAssessmentStore.selectedId,this.setSaveDataFotMapping());
		// }
		// this.setCustodianTitle();

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "Select & Next";
				this.previousButtonText = "Previous";

				this.setIntialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
  }

  submitRiskInfo(){
    AppStore.enableLoading();
		this.formErrors = null;

		let save;
		if (this.form.value.id || BcmRiskAssessmentStore.selectedId) {
			save = this._bcmRiskAssessmentService.updateRiskInfo(this.form.value.id ? this.form.value.id : BcmRiskAssessmentStore.selectedId, this.setSaveDataFotInfo());
		}
		else {
			save = this._bcmRiskAssessmentService.saveRiskInfo(this.setSaveDataFotInfo());
		}
		// this.setCustodianTitle();

		save.subscribe(res => {
      if(res&&ProcessStore.selectedProcessesList.length==0){
        // console.log("resss",res)
        BcmRiskAssessmentStore.selectedId = res?.id
        this.setEditSection()
      }
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "Select & Next";
				this.previousButtonText = "Previous";

				this.setIntialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
  }

  showMappingSection(){
    NoDataItemStore.unsetNoDataItems()
    if(ControlStore?.selectedControlsList.length!=0){
      // console.log("issue")
      this.selectedSection = 'control'
      this.gotoMappingSection('control')
      this._utilityService.detectChanges(this._cdr);
    }
    else if(IssueListStore?.selectedIssuesList.length != 0){
      // console.log("issue")
      this.selectedSection = 'issue'
      this.gotoMappingSection('issue')
      this._utilityService.detectChanges(this._cdr);
    }
    else if(ProcessStore?.selectedProcessesList.length != 0){
      this.selectedSection = 'process'
      this.gotoMappingSection('process')
      // console.log("process1",ProcessStore?.selectedProcessesList)
      this._utilityService.detectChanges(this._cdr);
    }
    else if(BusinessCustomersStore?.selectedCustomerList.length != 0){
      // console.log("process2")
      this.selectedSection = 'customer'
      this.gotoMappingSection('customer')
      this._utilityService.detectChanges(this._cdr);
    }
    else if(BusinessServiceStore?.selectedBusinessServicesList.length != 0){
      // console.log("process3")
      this.selectedSection = 'service'
      this.gotoMappingSection('service')
      this._utilityService.detectChanges(this._cdr);
    }
    else if(AssetRegisterStore?.selectedAssets.length != 0){
      // console.log("process4")
      this.selectedSection = 'assets'
      this.gotoMappingSection('assets')
      this._utilityService.detectChanges(this._cdr);
    }
    else if(FocusAreaMasterStore?.selectedStrategic.length == 0){
      // console.log("process5")
      this.selectedSection = 'focus-area'
      this.gotoMappingSection('focus-area')
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // ================= TAB SETTINGS =====================
  saveClick(){
    switch (this.currentTab){
      case 1:
        this.submitRiskInfo()
        break;
      case 2:
        this.submitRiskMapping()
        break;
    }
  }
  nextPrev(n,is_save:boolean=false) {
    var x: any = document.getElementsByClassName("tab");
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    if (this.currentTab >= x.length) {
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      if(BcmRiskAssessmentStore.selectedId){
        this._utilityService.showSuccessMessage('success', 'Risk assessment updated successfully');
        this._router.navigateByUrl('/bcm/risk-assessment/'+BcmRiskAssessmentStore.selectedId)
      }else{
        this._utilityService.showSuccessMessage('success', 'Risk assessment created successfully');
        this._router.navigateByUrl('/bcm/risk-assessment');
      }
      return false;
    }
    this.showTab(this.currentTab,is_save);
  }

  showTab(n,is_save:boolean=false) {
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (n == 0) {
			if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
      if (document.getElementById("nextBtn")) this.nextButtonText = "Select & Next";
		} else {
			if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
		}
    if(n!=-1){
      switch (this.currentTab){
        case 1:
            this._utilityService.showSuccessMessage('success', 'BIA Selected successfully');
            BcmRiskAssessmentStore.unsetBcmRiskDetails()
            this.getSubRisk()
            this.getRiskType()
            this.getRiskReviewFrequency()
            this.getUsers()
            if(this._router.url.indexOf('edit') == -1&&(!this.form.value.organization_ids||this.form.value.organization_ids.length==0)){
              this.setInitialOrganizationLevels();
            }
            if(BcmRiskAssessmentStore.selectedId){
              this.setEditSection();
            }
            this._utilityService.detectChanges(this._cdr);
					break;
        case 2:
          if(is_save){
            this.submitRiskInfo()
          }
          this.selectedSection = 'control'
          this.gotoMappingSection('control')
          break;
        case 3:
          if(is_save){
            this.submitRiskMapping()
          }
          this.showMappingSection()
          break;
      }
    }
    if (n == x.length - 1) {
      this.selectedSection = 'control'
      this.gotoMappingSection('control');
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "none";
    }else{
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inline";
    }
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
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

// ================= END TAB SETTINGS =====================

confirmCancel() {
  setTimeout(() => {
    $(this.cancelPopup.nativeElement).modal('show');
  }, 100);
}

changeZIndex() {
  if ($(this.issueFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.locationFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.projectFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.productFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.processFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.customerFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.objectiveFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.controlFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.controlAddFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.strategicFocusAreaModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'overflow', 'auto');
  }
  else if ($(this.assetsFormModal.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'overflow', 'auto');
  }
}

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

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

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  ngOnDestroy(){
    BcmRiskAssessmentStore.selectedId = null
    BcmRiskAssessmentStore.selectedProcessId=null
    BcmRiskAssessmentStore.is_from_info = false
    BcmRiskAssessmentStore.selectedProcessId = null
    BcmRiskAssessmentStore.is_edit = false
    this.clearMappingArray()
    BiaStore.orderBy = 'desc'
    BiaStore.orderItem = 'ref_no'
    this.selectedProcess = false
    if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		NoDataItemStore.unsetNoDataItems();
    this.subscription.unsubscribe()
    this.assetsSelectSubscription.unsubscribe()
    this.cancelEventSubscription.unsubscribe()
    this.idleTimeoutSubscription.unsubscribe()
    this.networkFailureSubscription.unsubscribe()
    this.organisationChangesModalSubscription.unsubscribe();
		this.controlModalEventSubscription.unsubscribe();
		this.cancelEventSubscription.unsubscribe();
		this.projectSelectSubscription.unsubscribe();
		this.productSelectSubscription.unsubscribe();
		this.locationSelectSubscription.unsubscribe();
		this.customerSelectSubscription.unsubscribe();
		this.objectiveSelectSubscription.unsubscribe();
		this.controlSelectSubscription.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
    this.focusAreaSelectSubscription.unsubscribe()
    this.serviceSelectSubscription.unsubscribe()
    window.removeEventListener('scroll', this.scrollEvent);
  }


}
