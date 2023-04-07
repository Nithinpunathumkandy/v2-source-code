import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IssueDomainMasterStore } from 'src/app/stores/masters/organization/issue-domain-master.store'
import { IssueDomainService } from 'src/app/core/services/masters/organization/issue-domain/issue-domain.service';
import { ReportFrequencyMasterStore } from 'src/app/stores/masters/human-capital/report-frequency-store';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { BranchService } from "src/app/core/services/organization/business_profile/branches/branch.service";
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RiskClassificationService } from 'src/app/core/services/masters/risk-management/risk-classification/risk-classification.service';
import { RiskClassificationMasterStore } from 'src/app/stores/masters/risk-management/risk-classification-store';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { RiskTypeMasterStore } from 'src/app/stores/masters/risk-management/risk-type-store';
import { RiskAreaService } from 'src/app/core/services/masters/risk-management/risk-area/risk-area.service';
import { RiskAreaMasterStore } from 'src/app/stores/masters/risk-management/risk-area-store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { RiskReviewFrequencyService } from 'src/app/core/services/masters/risk-management/risk-review-frequency/risk-review-frequency.service';
import { RiskReviewFrequencyMasterStore } from 'src/app/stores/masters/risk-management/risk-review-frequency-store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IssueTypeMasterStore } from 'src/app/stores/masters/organization/issue-type-master.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ProcessGroupsMasterStore } from 'src/app/stores/masters/bpm/process-groups-master.store';
import { IssueCategoryMasterStore } from 'src/app/stores/masters/organization/issue-category-master.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { ProcessCategoryMasterStore } from 'src/app/stores/masters/bpm/prcoess-category.master.store';
// import { IssueListRatingsStore } from "src/app/stores/organization/context/issue-risk-ratings.store";
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IssueDomainPaginationResponse } from 'src/app/core/models/masters/organization/issue-domain';
import { RiskAreaPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-area';
import { RiskCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-category';
import { RiskControlPlanPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-control-plan';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RiskSourcePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-source';
import { RiskLibraryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-library';
import { RiskSourceService } from 'src/app/core/services/masters/risk-management/risk-source/risk-source.service';
import { RiskLibraryService } from 'src/app/core/services/masters/risk-management/risk-library/risk-library.service';
import { RiskSourceMasterStore } from 'src/app/stores/masters/risk-management/risk-source-store';
import { RiskLibraryMasterStore } from 'src/app/stores/masters/risk-management/risk-library-store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { BusinessProjectsStore } from "src/app/stores/organization/business_profile/business-projects.store";
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { RiskSubCategoryService } from 'src/app/core/services/masters/risk-management/risk-sub-category/risk-sub-category.service';
import { RiskSubCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-sub-category-store';
import { RiskSubCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-sub-category';
// import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ControlsService } from "src/app/core/services/bpm/controls/controls.service";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RiskMappingStore } from 'src/app/stores/risk-management/risks/risk-mapping.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

declare var $: any;
@Component({
	selector: 'app-add-risk',
	templateUrl: './add-risk.component.html',
	styleUrls: ['./add-risk.component.scss']
})
export class AddRiskComponent implements OnInit {
	@ViewChild('formSteps') formSteps: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	@ViewChild('cancelPopup') cancelPopup: ElementRef;
	@ViewChild('issueFormModal') issueFormModal: ElementRef;
	@ViewChild('locationFormModal') locationFormModal: ElementRef;
	@ViewChild('projectFormModal') projectFormModal: ElementRef;
	@ViewChild('productFormModal') productFormModal: ElementRef;
	@ViewChild('customerFormModal') customerFormModal: ElementRef;
	@ViewChild('controlFormModal') controlFormModal: ElementRef;
	@ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
	@ViewChild('incidentFormModal') incidentFormModal: ElementRef;
	// @ViewChild('processModal') processModal: ElementRef;
	@ViewChild('processFormModal') processFormModal: ElementRef;
	@ViewChild('issueDomainFormModal') issueDomainFormModal: ElementRef;
	@ViewChild('riskLibraryFormModal') riskLibraryFormModal: ElementRef;
	@ViewChild('riskCategoryFormModal') riskCategoryFormModal: ElementRef;
	@ViewChild('riskAreaModal') riskAreaModal: ElementRef;
	@ViewChild('riskSubCategoryModal') riskSubCategoryModal: ElementRef;
	@ViewChild('riskSourceModal') riskSourceModal: ElementRef;
	@ViewChild('controlAddFormModal') controlAddFormModal: ElementRef;
	@ViewChild('popup') popup: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;

	public title: string = 'title'
	public risk_management_rr_addform_title: string = 'risk_management_rr_addform_title'
	public risk_observation: string = 'risk_observation'
	public rm_risk_description: string = 'rm_risk_description'
	public risk_management_rr_addform_description: string = 'risk_management_rr_addform_description'
	public risk_management_rr_addform_impacts: string = 'risk_management_rr_addform_impacts'
	public risk_causes: string = 'risk_causes'
	public risk_management_rr_addform_risk_causes: string = 'risk_management_rr_addform_risk_causes'

	riskForm: FormGroup;
	formErrors: any;
	currentTab = 0;
	subscription: any;
	riskCategorySubscription: any;
	controlPlanSubscription: any;
	issueSelectSubscription: any;
	locationSelectSubscription: any;
	librarySelectSubscription: any;
	subCategorySubscription: any
	riskSourceSubscription: any;
	areaSubscription: any = null;
	AppStore = AppStore;
	SubMenuItemStore = SubMenuItemStore;
	reactionDisposer: IReactionDisposer;
	IssueDomainMasterStore = IssueDomainMasterStore;
	ReportFrequencyMasterStore = ReportFrequencyMasterStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	StrategicObjectiveMasterStore = StrategicObjectivesMasterStore;
	RiskSubCategoryMasterStore = RiskSubCategoryMasterStore;
	IncidentStore = IncidentStore;
	UsersStore = UsersStore
	nextButtonText = 'Next';
	previousButtonText = "Previous";
	cancelEventSubscription: any;
	SubsidiaryStore = SubsidiaryStore;
	BranchesStore = BranchesStore;
	DepartmentStore = DepartmentMasterStore;
	DivisionStore = DivisionMasterStore;
	SectionStore = SectionMasterStore;
	SubSectionStore = SubSectionMasterStore;
	RiskClassificationStore = RiskClassificationMasterStore;
	RiskTypeStore = RiskTypeMasterStore;
	RiskAreaStore = RiskAreaMasterStore;
	MsTypeOrganizationStore = MsTypeStore;
	RiskReviewFrequencyStore = RiskReviewFrequencyMasterStore;
	RiskCategoryStore = RiskCategoryMasterStore;
	RiskControlPlanStore = RiskControlPlanMasterStore;
	IssueListStore = IssueListStore;
	AuthStore = AuthStore;
	IssueTypeStore = IssueTypeMasterStore;
	ProcessGroupsMasterStore = ProcessGroupsMasterStore
	ProcessStore = ProcessStore;
	IssueCategoryStore = IssueCategoryMasterStore;
	ProcessCategoryMasterStore = ProcessCategoryMasterStore;
	IssueListRatingsStore = RiskRatingMasterStore;
	RiskSourceMasterStore = RiskSourceMasterStore;
	RiskLibraryMasterStore = RiskLibraryMasterStore;
	LocationMasterStore = LocationMasterStore;
	BusinessProjectsStore = BusinessProjectsStore;
	BusinessProductsStore = BusinessProductsStore;
	BusinessCustomersStore = BusinessCustomersStore;
	ControlStore = ControlStore;
	OrganizationModulesStore = OrganizationModulesStore;
	// ProcessStore = ProcessStore;
	saveData: any = null;
	repetativeRisk: boolean = false;
	projectSelectSubscription: any
	productSelectSubscription: any
	controlSelectSubscription: any
	customerSelectSubscription: any;
	objectiveSelectSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	controlModalEventSubscription: any;
	setModalStyleSubscription: any;
	incidentSelectSubscription: any;
	commonEmptyList = "common_nodata_title";
	// customerModalTitle = 'risk_customer_modal_message';
	// projectsModalTitle = 'risk_projects_modal_message';
	// issuesModalTitle = 'risk_issues_modal_message';
	// processModalTitle = 'risk_process_modal_message';
	// locationModalTitle = 'risk_location_modal_message';
	// productModalTitle = 'risk_product_modal_message';
	// strategicModalTitle = 'risk_strategic_modal_message';
	// controlsModalTitle = 'risk_controls_modal_message';

	modalObject = {
		component: 'risk',
	}

	RisksStore = RisksStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

	selectedSection = 'control';
	issueFilter = { category: null, type: null, domain: null, department: null, text: null }
	cancelObject = {
		type: '',
		title: '',
		subtitle: ''
	};

	riskCategoryObject = {
		component: 'Master',
		values: null,
		type: null
	};

	controlObject = {
		values: null,
		type: null,
		page: 'add-risk'
	}

	riskAreaObject = {
		component: 'Master',
		values: null,
		type: null
	};

	riskSubCategoryObject = {
		component: 'Master',
		values: null,
		type: null
	};

	riskSourceObject = {
		component: 'Master',
		values: null,
		type: null
	};


	issueDomainObject = {
		component: 'Master',
		values: null,
		type: null
	};

	riskLibraryObject = {
		component: 'Master',
		values: null,
		type: null
	};
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

	ownerDetailObject = {
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
	//ck editor configuration
	config = {
		// toolbar: [
		//   { name: 'document', items: ['Source', '-', 'Preview'] },
		//   { name: 'clipboard', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
		//   { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
		//   { name: 'links', items: ['Link', 'Unlink', 'Anchor'] }, '/',
		//   { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
		//   { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
		//   { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
		//   { name: 'tools', items: ['Maximize'] },
		//   { name: 'about', items: ['About'] }
		// ]
		toolbar: [
			'undo',
			'redo',
			'|',
			'heading',

			'|',
			'bold',
			'italic',

			'|',
			'link',
			'imageUpload',
			'|',

			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'insertTable',
			'blockQuote',

		],
		language: 'id',
		image: {
			toolbar: [
				'imageTextAlternative',
				'imageStyle:full',
				'imageStyle:side'
			]
		}
	};
	activeIndex = null;
	hover = false;
	formObject = {
		0: [
			'reference_code', 'risk_classification_id', 'title', 'description', 'risk_category_id', 'risk_sub_category_id', 'impact', 'risk_date', 'risk_observation', 'last_review_note', 'risk_cause',
			'risk_review_frequency_id', 'risk_type_ids', 'risk_area_ids', 'risk_source_ids', 'risk_library_id', 'ms_type_organization_ids'
		],
		1: [
			'department_ids', 'organization_ids', 'division_ids', 'section_ids', 'sub_section_ids', 'user_ids', 'risk_owner_id', 'branch_ids'

		],
		2: [
			'process_ids', 'product_ids', 'project_ids', 'customer_ids', 'stakeholder_ids', 'organization_issue_ids', 'control_ids'
		]
	}
	selectedRiskLibrary: boolean = false;
	// selectedIssues = [];
	// tempSelectedIssues = [];
	public Editor;
	public Config;
	constructor(private _formBuilder: FormBuilder,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2,
		private _router: Router,
		private _eventEmitterService: EventEmitterService,
		private _issueDomainService: IssueDomainService,
		private _subsidiaryService: SubsidiaryService,
		private _departmentService: DepartmentService,
		private _divisionService: DivisionService,
		private _sectionService: SectionService,
		private _subSectionService: SubSectionService,
		private _usersService: UsersService,
		private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService,
		private _riskClassificationService: RiskClassificationService,
		private _riskTypeService: RiskTypeService,
		private _riskAreaService: RiskAreaService,
		private _msTypeOrganizationService: MstypesService,
		private _riskReviewFrequencyService: RiskReviewFrequencyService,
		private _riskCategoryService: RiskCategoryService,
		private _helperService: HelperServiceService,
		private _riskService: RisksService,
		private _riskSourceService: RiskSourceService,
		private _riskLibraryService: RiskLibraryService,
		private _riskSubCategoryService: RiskSubCategoryService,
		private _controlService: ControlsService,
		private _http: HttpClient,
		private _branchesService: BranchService
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
		let type = "control";

		// ClassicEditor
		// 	.create(document.querySelector('#risk_observation'), {
		// 		extraPlugins: [MyUploadAdapter],

		// 		// ...
		// 	})
		// 	.catch(error => {
		// 		// console.log( error );
		// 	});

		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "add_control" });
		if(RisksStore.individualRiskDetails?.is_analysis_performed == 1){
		  NoDataItemStore.deleteObject('subtitle');
		  NoDataItemStore.deleteObject('buttonText');
		}
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


				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			setTimeout(() => {

				this.riskForm.pristine;
			}, 250);
		});

		SubMenuItemStore.setNoUserTab(true);

		SubMenuItemStore.setSubMenuItems([
			{ type: 'close', path: '../' },
		]);
		AppStore.showDiscussion = false;

		setTimeout(() => {
			window.addEventListener('scroll', this.scrollEvent, true);
		}, 250);


		this.riskForm = this._formBuilder.group({
			reference_code: [null],
			risk_classification_id: [null],
			risk_category_id: [null, [Validators.required]],
			risk_sub_category_id: [null],
			title: [null, [Validators.required]],
			description: [''],
			risk_observation: [''],
			last_review_note: [''],
			risk_cause: [''],
			impact: [''],
			risk_date: [null, [Validators.required]],
			risk_review_frequency_id: [null],
			next_review_date: [''],
			ms_type_organization_ids: [[]],
			department_ids: [null, [Validators.required]],
			organization_ids: [null],
			division_ids: [null],
			risk_type_ids: [[]],
			risk_area_ids: [[]],
			is_corporate: [''],
			section_ids: [null],
			branch_ids: [null],
			sub_section_ids: [null],
			process_ids: [[]],
			product_ids: [[]],
			project_ids: [[]],
			customer_ids: [[]],
			strategic_objective_ids: [[]],
			control_ids: [[]],
			organization_issue_ids: [[]],
			location_ids: [[]],
			risk_source_ids: [[]],
			risk_library_id: [null],
			service_ids: [[]],
			stakeholder_ids: [[]],
			user_ids: [[]],
			risk_owner_id: [null, [Validators.required]]

		});

		// if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
		// this.regForm.controls['branch_id'].setValidators(Validators.required);
		if (this.riskForm.value.risk_review_frequency_id) {
			this.riskForm.controls['next_review_date'].setValidators(Validators.required);

		}
		if (!this.riskForm.value.is_corporate && !RisksStore.editFlag) {
			this.setRequiredLevels();
		}

		IssueListStore.selectedIssuesList = [];
		ProcessStore.selectedProcessesList = [];
		LocationMasterStore.selectedLocationList = [];
		BusinessProjectsStore.selectedProjectList = [];
		BusinessProductsStore.selectedProductList = [];
		BusinessCustomersStore.selectedCustomerList = [];
		ControlStore.selectedControlsList = [];
		StrategicObjectivesMasterStore.selectedStrategic = [];
		IncidentStore.selectedIincidentForMapping = [];
		this.riskForm.patchValue({
			risk_date: this._helperService.getTodaysDateObject()
		})

		//Event Subscription for handling modal output events
		this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
			var modalNumber: number = item;
			// console.log(modalNumber);
			switch (modalNumber) {

				case 3: this.closeIssueDomainModal();
					break;

				case 7: this.closeProcesses();
					break;
			}
			this._utilityService.detectChanges(this._cdr);
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

		this.areaSubscription = this._eventEmitterService.riskArea.subscribe(res => {
			this.closeRiskAreaModal();
		})

		this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
			if (this.controlObject.type) {
				this.closeControlModal();
			}
		})

		this.setModalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'overflow', 'auto');
		})

		this.subCategorySubscription = this._eventEmitterService.riskSubCategory.subscribe(res => {
			this.closeRiskSubCategoryModal();
		})
		this.riskCategorySubscription = this._eventEmitterService.riskCategory.subscribe(item => {
			this.closeRiskCategoryModal();
		})

		this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
			this.closeIssues();
		})

		this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
			this.closeProjects();
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
		this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControls();
		})

		this.incidentSelectSubscription = this._eventEmitterService.incidentMappingModal.subscribe(item => {
			this.closeincident();
		  })

		this.librarySelectSubscription = this._eventEmitterService.riskLibrary.subscribe(item => {
			this.closeLibrary();
		})


		this.riskSourceSubscription = this._eventEmitterService.riskSource.subscribe(item => {
			this.closeRiskSourceModal();
		})

		this.objectiveSelectSubscription = this._eventEmitterService.strategicObjectivesMapping.subscribe(item => {
			this.closeObjectives();
		})

		this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancelRisk(item);
		})


		this._riskClassificationService.getItems().subscribe(res => {

			this.riskForm.patchValue({
				risk_classification_id: res['data'][0].id
			})
			this._utilityService.detectChanges(this._cdr);
		});
		setTimeout(() => {
			this.showTab(this.currentTab);
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			// window.addEventListener('click', this.clickEvent, false);
			this._utilityService.detectChanges(this._cdr);

		}, 250);

		if (RisksStore.editFlag) {
			this.setEditValues();
			this._utilityService.detectChanges(this._cdr);
		}
		else {
			RisksStore.unsetIndiviudalRiskDetails();
			if (RisksStore.addCorporate) {
				this.riskForm.patchValue({
					is_corporate: true
				})
			}
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.getPrimaryOrganization();
			}
			this.setInitialOrganizationLevels();
		}
		this.gotoMappingSection('control');
	}

	removeImpact(index) {
		RisksStore.impactList.splice(index, 1);
	}

	removeRiskCause(index) {
		RisksStore.riskCauseList.splice(index, 1);
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

		else if ($(this.issueDomainFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.riskLibraryFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.riskAreaModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.riskSubCategoryModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.riskCategoryFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.riskSourceModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.controlAddFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.incidentFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'overflow', 'auto');
		}
	}



	setEditValues() {

		this._riskService.getItem(RisksStore.riskId).subscribe(res => {
			if (RisksStore.individual_risk_loaded) {
				if (RisksStore.individualRiskDetails?.risk_library?.title) {
					this.selectedRiskLibrary = true;
				}
				this.riskForm.patchValue({
					reference_code: RisksStore.individualRiskDetails.reference_code ? RisksStore.individualRiskDetails.reference_code : '',
					risk_classification_id: RisksStore.individualRiskDetails.risk_classification.id ? RisksStore.individualRiskDetails.risk_classification.id : null,
					risk_category_id: RisksStore.individualRiskDetails.risk_category ? RisksStore.individualRiskDetails.risk_category : null,
					risk_sub_category_id: RisksStore.individualRiskDetails.risk_sub_category ? RisksStore.individualRiskDetails?.risk_sub_category : null,
					title: RisksStore.individualRiskDetails.title ? RisksStore.individualRiskDetails.title : '',
					description: RisksStore.individualRiskDetails.description ? RisksStore.individualRiskDetails.description : '',
					// impact: RisksStore.individualRiskDetails.risk_impacts ? RisksStore.individualRiskDetails.impact : '',
					risk_observation: RisksStore.individualRiskDetails.risk_observation ? RisksStore.individualRiskDetails.risk_observation : '',
					last_review_note: RisksStore.individualRiskDetails.last_review_note ? RisksStore.individualRiskDetails.last_review_note : '',
					// risk_cause: RisksStore.individualRiskDetails.risk_cause ? RisksStore.individualRiskDetails.risk_cause : '',

					risk_date: RisksStore.individualRiskDetails.risk_date ? this._helperService.processDate(RisksStore.individualRiskDetails.risk_date, 'split') : null,
					risk_review_frequency_id: RisksStore.individualRiskDetails.risk_review_frequency ? RisksStore.individualRiskDetails.risk_review_frequency.id : null,
					next_review_date: RisksStore.individualRiskDetails.next_review_date ? this._helperService.processDate(RisksStore.individualRiskDetails.next_review_date, 'split') : null,
					ms_type_organization_ids: RisksStore.individualRiskDetails.ms_type_organizations ? this.getTypes(RisksStore.individualRiskDetails.ms_type_organizations) : [],
					department_ids: RisksStore.individualRiskDetails.departments ? this.setType(RisksStore.individualRiskDetails.departments, 'corporate') : null,
					organization_ids: RisksStore.individualRiskDetails.organizations ? this.setType(RisksStore.individualRiskDetails.organizations, 'corporate') : [],
					division_ids: RisksStore.individualRiskDetails.divisions ? this.setType(RisksStore.individualRiskDetails.divisions, 'corporate') : [],
					risk_type_ids: RisksStore.individualRiskDetails.risk_types ? this.getTypes(RisksStore.individualRiskDetails.risk_types) : [],
					risk_area_ids: RisksStore.individualRiskDetails.risk_areas ? this.setType(RisksStore.individualRiskDetails.risk_areas) : [],
					is_corporate: RisksStore.individualRiskDetails.is_corporate ? RisksStore.individualRiskDetails.is_corporate : false,
					section_ids: RisksStore.individualRiskDetails.sections ? this.setType(RisksStore.individualRiskDetails.sections, 'corporate') : [],
					sub_section_ids: RisksStore.individualRiskDetails.sub_sections ? this.setType(RisksStore.individualRiskDetails.sub_sections, 'corporate') : [],
					branch_ids: RisksStore.individualRiskDetails.branches ? this.setType(RisksStore.individualRiskDetails.branches, 'corporate') : [],
					process_ids: RisksStore.individualRiskDetails.processes ? this.setType(RisksStore.individualRiskDetails.processes, 'process') : [],
					product_ids: RisksStore.individualRiskDetails.products ? this.setType(RisksStore.individualRiskDetails.products, 'product') : [],

					project_ids: RisksStore.individualRiskDetails.projects ? this.setType(RisksStore.individualRiskDetails.projects, 'project') : [],
					customer_ids: RisksStore.individualRiskDetails.customers ? this.setType(RisksStore.individualRiskDetails.customers, 'customer') : [],
					control_ids: RisksStore.individualRiskDetails.controls ? this.setType(RisksStore.individualRiskDetails.controls, 'control') : [],
					strategic_objective_ids: RisksStore.individualRiskDetails.strategic_objectives ? this.setType(RisksStore.individualRiskDetails.strategic_objectives, 'objective') : [],

					location_ids: RisksStore.individualRiskDetails.locations ? this.setType(RisksStore.individualRiskDetails.locations, 'location') : [],
					organization_issue_ids: RisksStore.individualRiskDetails.organization_issues ? this.setType(RisksStore.individualRiskDetails.organization_issues, 'issue') : [],
					// issue_domain_ids: RisksStore.individualRiskDetails.issueDomains ? this.setType(RisksStore.individualRiskDetails.issueDomains) : [],
					risk_source_ids: RisksStore.individualRiskDetails.risk_sources ? this.setType(RisksStore.individualRiskDetails.risk_sources) : [],
					risk_library_id: RisksStore.individualRiskDetails.risk_library ? RisksStore.individualRiskDetails.risk_library?.id : null,

					service_ids: [],
					stakeholder_ids: [],
					user_ids: RisksStore.individualRiskDetails.responsible_users ? this.setType(RisksStore.individualRiskDetails.responsible_users) : [],
					risk_owner_id: RisksStore.individualRiskDetails.risk_owner ? RisksStore.individualRiskDetails.risk_owner : null
				})

				this._riskClassificationService.getItems().subscribe(res => {
					this._utilityService.detectChanges(this._cdr);
				})
				if (RisksStore.individualRiskDetails?.risk_library?.id) {

					this.setLibraryProperties(RisksStore.individualRiskDetails?.risk_library?.id);
					this._riskLibraryService.getItems(false, 'q=' + RisksStore.individualRiskDetails?.risk_library?.id).subscribe(res => {
						this._utilityService.detectChanges(this._cdr)
					})
				}
				if (RisksStore.individualRiskDetails.is_corporate) {
					// console.log('inside');
					this.unsetRequiredLevels();

				}
				else {
					this.setRequiredLevels();
				}

				if (this.riskForm.value.next_review_date) {
					this.repetativeRisk = true;
				}

				this.editRisk();
			}

		})
	}

	setInitialOrganizationLevels() {
		this.riskForm.patchValue({
			organization_ids: AuthStore.user.organization && OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary ? RisksStore.addCorporate ? [AuthStore.user.organization] : AuthStore.user.organization : null,
			branch_ids: AuthStore.user.branch && OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch ? RisksStore.addCorporate ? [AuthStore.user.branch] : AuthStore.user.branch : null,
			division_ids: AuthStore.user.division && OrganizationLevelSettingsStore.organizationLevelSettings?.is_division ? RisksStore.addCorporate ? [AuthStore.user.division] : AuthStore.user.division : null,
			department_ids: AuthStore.user.department && OrganizationLevelSettingsStore.organizationLevelSettings?.is_department ? RisksStore.addCorporate ? [AuthStore.user.department] : AuthStore.user.department : null,
			section_ids: AuthStore.user.section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_section ? RisksStore.addCorporate ? [AuthStore.user.section] : AuthStore.user.section : null,
			sub_section_ids: AuthStore.user.sub_section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section ? RisksStore.addCorporate ? [AuthStore.user.sub_section] : AuthStore.user.sub_section : null,
			// branch_ids: AuthStore.user.branch && OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch ? RisksStore.addCorporate ? [AuthStore.user.branch] : AuthStore.user.branch : null
		});
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this.searchSubsidiary({ term: this.riskForm.value.organization_ids });
		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.riskForm.value.division_ids });
		this.searchDepartment({ term: this.riskForm.value.department_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.riskForm.value.section_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.riskForm.value.sub_section_ids });
		// if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({ term: this.riskForm.value.branch_ids })
		this._utilityService.detectChanges(this._cdr);
	}

	getBranches() {
		if (this.riskForm.get('organization_ids').value || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let parameters = RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id
			this._branchesService.getAllItems(false, '?organization_ids=' + parameters).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.BranchesStore.clearBranchList();
		}
	}

	searchBranches(e) {
		if (this.riskForm.get('organization_ids').value) {
			let parameters = RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id
			this._branchesService.getAllItems(false, '?organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.BranchesStore.clearBranchList();
		}
	}

	checkFormObject(tabNumber?: number) {

		var setValid = true;
		if (!tabNumber) {
			if (this.formObject.hasOwnProperty(this.currentTab)) {
				for (let i of this.formObject[this.currentTab]) {
					if (!this.riskForm.controls[i].valid) {
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
						if (!this.riskForm.controls[k].valid) {
							setValid = false;
							break;
						}
					}
				}
			}
		}

		if (this.riskForm.value.risk_review_frequency_id) {
			if (!this.riskForm.value.next_review_date) {
				setValid = false;
			}
		}
		// console.log(setValid);
		return setValid;
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
			case 'incident':
				IncidentStore.selectedIincidentForMapping.splice(index, 1)
				break;
		}
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

	// pushTitle(title) {
	//   RiskLibraryMasterStore.allItems.push({ id: null, title: title, description: null, status_id: null, status: null, status_label: null })
	//   this._utilityService.detectChanges(this._cdr);
	//   return title;
	// }

	setType(item, type?) {
		let items = [];
		if (type == 'issue') {
			this.setIssues(item);

		}
		if (type == 'process') {
			this.setProcesses(item);
		}
		if (type == 'location') {
			this.setLocations(item);
		}
		if (type == 'project') {
			this.setProjects(item);
		}
		if (type == 'product') {
			this.setProducts(item);
		}
		if (type == 'customer') {
			this.setCustomers(item);
		}
		if (type == 'control') {
			this.setControls(item);
		}
		if (type == 'objective') {
			this.setObjectives(item);
		}
		if (!RisksStore.addCorporate && type == 'corporate') {

			items = item[0];

		}

		else {
			for (let i of item) {

				items.push(i)
			}
		}


		return items;
	}

	setNextReview() {

		var tempDate = new Date();
		if (this.riskForm.value.risk_review_frequency_id) {

			tempDate = new Date(this._helperService.processDate(this.riskForm.value.risk_date, 'join'));

			switch (this.riskForm.value.risk_review_frequency_id) {

				case 1: tempDate.setDate(tempDate.getDate() + 1)
					break;
				case 2: tempDate.setDate(tempDate.getDate() + 7);
					break;
				case 3:
					tempDate.setMonth(tempDate.getMonth() + 1)
					break;
				case 4:
					tempDate.setMonth(tempDate.getMonth() + 3);
					break;

				case 5: tempDate.setFullYear(tempDate.getFullYear() + 1)
					break;
			}

			let dateObject = { 'year': tempDate.getFullYear(), 'month': tempDate.getMonth() + 1, 'day': tempDate.getDate() };
			this.riskForm.patchValue({
				next_review_date: dateObject
			})
			// console.log(tempDate);
			tempDate = null;
		}
	}

	editRisk() {
		for (let impact of RisksStore.individualRiskDetails.risk_impacts) {
			RisksStore.impactList.push(impact.title)
		}
		for (let cause of RisksStore.individualRiskDetails.risk_causes) {
			RisksStore.riskCauseList.push(cause.title)
		}

		this.getRiskType(true);
		this.getRiskReviewFrequency(true);
		this.getMsType(true);
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
		// console.log(items);
		ProcessStore.selectedProcessesList = [];
		let processItem = items;
		for (let i of processItem) {
			i['process_group_title'] = i.process_group ? i.process_group.title : '';
			i['department'] = i.department ? i.department.title : '';
			i['process_category_title'] = i.process_category ? i.process_category.title : '';
			ProcessStore.selectedProcessesList.push(i);
		}
	}
	setProjects(items) {
		// console.log(items);
		BusinessProjectsStore.selectedProjectList = [];
		let projectItem = items;
		for (let i of projectItem) {
			i['project_manager_first_name'] = i.project_manager?.first_name;
			i['project_manager_last_name'] = i.project_manager?.last_name;
			i['project_manager_image_token'] = i.project_manager?.image_token;
			i['location_title'] = i.location?.title;
			// i['project_manager_designation']=i.pr
			BusinessProjectsStore.selectedProjectList.push(i);
		}
	}

	setLocations(items) {
		// console.log(items);
		LocationMasterStore.selectedLocationList = [];
		let locationItem = items;
		for (let i of locationItem) {
			LocationMasterStore.selectedLocationList.push(i);
		}
	}

	setProducts(items) {
		// console.log(items);
		BusinessProductsStore.selectedProductList = [];
		let productItem = items;
		for (let i of productItem) {
			BusinessProductsStore.selectedProductList.push(i);
		}
	}

	setCustomers(items) {
		// console.log(items);
		BusinessCustomersStore.selectedCustomerList = [];
		let customerItem = items;
		for (let i of customerItem) {
			BusinessCustomersStore.selectedCustomerList.push(i);
		}
	}
	setObjectives(items) {
		// console.log(items);
		StrategicObjectivesMasterStore.selectedStrategic = [];
		let objectiveItem = items;
		for (let i of objectiveItem) {
			StrategicObjectivesMasterStore.selectedStrategic.push(i);
		}
	}

	setControls(items) {
		// console.log(items);
		ControlStore.selectedControlsList = [];
		let controlItem = items;
		for (let i of controlItem) {
			ControlStore.selectedControlsList.push(i);
		}
	}
	setResponsibleUsers() {
		RisksStore.users = [];
		if (RisksStore.individualRiskDetails?.responsible_users) {
			for (let i of RisksStore.individualRiskDetails.responsible_users) {
				RisksStore.users.push(i);

			}
		}
	}


	getCauseLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.riskForm.value.risk_cause.replace(regex, "");
		return result.length;
	}

	getDescriptionLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.riskForm.value.description.replace(regex, "");
		return result.length;
	}

	descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}

	getImpactLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.riskForm.value.impact.replace(regex, "");
		return result.length;
	}


	getObservationLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.riskForm.value.risk_observation.replace(regex, "");
		return result.length;
	}

	getReviewLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.riskForm.value.last_review_note.replace(regex, "");
		return result.length;
	}

	getTodaysDate() {
		return new Date();
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
			if(ControlStore?.selectedControlsList.length != 0)
			this.gotoMappingSection('control');
			else if(IssueListStore?.selectedIssuesList.length != 0)
			this.gotoMappingSection('issue');
			else if(ProcessStore?.selectedProcessesList.length != 0)
			this.gotoMappingSection('process');
			else if(BusinessProjectsStore?.selectedProjectsList.length!=0)
			this.gotoMappingSection('project');
			else if(BusinessProductsStore?.selectedProductList.length != 0)
			this.gotoMappingSection('product');
			else if(BusinessCustomersStore?.selectedCustomerList.length != 0)
			this.gotoMappingSection('customer');
			else if(StrategicObjectivesMasterStore?.selectedStrategic.length != 0)
			this.gotoMappingSection('objective');
			else if(IncidentStore?.selectedIincidentForMapping.length != 0)
			this.gotoMappingSection('incident');
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

		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
			this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', '45px');
			this._renderer2.addClass(this.formSteps?.nativeElement, 'small');
			this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
		}
		else {
			this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', 'auto');
			this._renderer2.removeClass(this.formSteps?.nativeElement, 'small');
			this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
		}
	}

	clickEvent = (event: any): void => {
		this.activeIndex = null;
		this.hover = false;
		this._utilityService.detectChanges(this._cdr);
	}


	getTypes(types) {
		let type = [];
		for (let i of types) {
			type.push(i.id);
		}
		return type;
	}

	setRiskLibrary(event) {

		this.riskForm.patchValue({
			risk_library_id: null,
			title: ''
		})


		this.selectedRiskLibrary = event.target.checked;
	}

	setSelectedUsers(event, type) {
		if (type == 'add')
			RisksStore.users.push(event);
		else {
			const index = RisksStore.users.findIndex(e => e.id == event.value.id);
			if (index != -1)
				RisksStore.users.splice(index, 1);
		}
	}

	getDataList(data) {
		let dataArray = [];
		for (let i of data) {
			dataArray.push({ title: i })
		}
		return dataArray;
	}
	setSaveData() {
		this.saveData = {
			reference_code: this.riskForm.value.reference_code ? this.riskForm.value.reference_code : '',
			risk_classification_id: this.riskForm.value.risk_classification_id ? this.riskForm.value.risk_classification_id : null,
			risk_category_id: this.riskForm.value.risk_category_id?.id ? this.riskForm.value.risk_category_id.id : null,
			risk_sub_category_id: this.riskForm.value.risk_sub_category_id ? this.riskForm.value.risk_sub_category_id.id : null,

			title: this.riskForm.value.title ? this.riskForm.value.title : '',
			description: this.riskForm.value.description ? this.riskForm.value.description : '',
			risk_impacts: RisksStore.impactList ? this.getDataList(RisksStore.impactList) : [],
			risk_observation: this.riskForm.value.risk_observation ? this.riskForm.value.risk_observation : '',
			last_review_note: this.riskForm.value.last_review_note ? this.riskForm.value.last_review_note : '',
			risk_causes: RisksStore.riskCauseList ? this.getDataList(RisksStore.riskCauseList) : [],

			risk_date: this.riskForm.value.risk_date ? this._helperService.processDate(this.riskForm.value.risk_date, 'join') : null,
			risk_review_frequency_id: this.riskForm.value.risk_review_frequency_id ? this.riskForm.value.risk_review_frequency_id : null,
			next_review_date: this.riskForm.value.next_review_date ? this._helperService.processDate(this.riskForm.value.next_review_date, 'join') : null,
			ms_type_organization_ids: this.riskForm.value.ms_type_organization_ids ? this.riskForm.value.ms_type_organization_ids : [],
			department_ids: this.riskForm.value.department_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.department_ids) : [this.riskForm.value.department_ids.id] : null,
			organization_ids: this.riskForm.value.organization_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.organization_ids) : [this.riskForm.value.organization_ids.id] : null,
			division_ids: this.riskForm.value.division_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.division_ids) : [this.riskForm.value.division_ids.id] : null,
			risk_type_ids: this.riskForm.value.risk_type_ids ? this.riskForm.value.risk_type_ids : [],
			risk_area_ids: this.riskForm.value.risk_area_ids ? this.getTypes(this.riskForm.value.risk_area_ids) : [],
			is_corporate: this.riskForm.value.is_corporate ? this.riskForm.value.is_corporate : false,
			section_ids: this.riskForm.value.section_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.section_ids) : [this.riskForm.value.section_ids.id] : null,
			sub_section_ids: this.riskForm.value.sub_section_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.sub_section_ids) : [this.riskForm.value.sub_section_ids.id] : null,
			branch_ids: this.riskForm.value.branch_ids ? RisksStore.addCorporate ? this.getTypes(this.riskForm.value.branch_ids) : [this.riskForm.value.branch_ids.id] : null,
			process_ids: ProcessStore?.selectedProcessesList ? this.getTypes(ProcessStore?.selectedProcessesList) : [],
			product_ids: BusinessProductsStore?.selectedProductList ? this.getTypes(BusinessProductsStore?.selectedProductList) : [],
			project_ids: BusinessProjectsStore?.selectedProjectsList ? this.getTypes(BusinessProjectsStore?.selectedProjectsList) : [],
			customer_ids: BusinessCustomersStore?.selectedCustomerList ? this.getTypes(BusinessCustomersStore?.selectedCustomerList) : [],
			control_ids: ControlStore?.selectedControlsList ? this.getTypes(ControlStore?.selectedControlsList) : [],
			strategic_objective_ids: StrategicObjectivesMasterStore?.selectedStrategic ? this.getTypes(StrategicObjectivesMasterStore?.selectedStrategic) : [],
			incident_ids: IncidentStore?.selectedIincidentForMapping ? this.getTypes(IncidentStore?.selectedIincidentForMapping) : [],

			organization_issue_ids: IssueListStore.selectedIssuesList ? this.getTypes(IssueListStore.selectedIssuesList) : [],
			location_ids: LocationMasterStore.selectedLocationList ? this.getTypes(LocationMasterStore.selectedLocationList) : [],
			// issue_domain_ids: this.riskForm.value.issue_domain_ids ? this.getTypes(this.riskForm.value.issue_domain_ids) : [],
			risk_source_ids: this.riskForm.value.risk_source_ids ? this.getTypes(this.riskForm.value.risk_source_ids) : [],
			risk_library_id: this.selectedRiskLibrary ? this.riskForm.value.risk_library_id ? this.riskForm.value.risk_library_id : null : null,


			service_ids: [],
			stakeholder_ids: [],
			user_ids: this.riskForm.value.user_ids ? this.getTypes(this.riskForm.value.user_ids) : [],
			risk_owner_id: this.riskForm.value.risk_owner_id?.id ? this.riskForm.value.risk_owner_id.id : null
		}
		// if(!RisksStore.editFlag)
		//   this.getPrimaryOrganization();
		// console.log(this.saveData);

	}

	getPrimaryOrganization() {
		this._subsidiaryService.getAllItems(false).subscribe(res => {
			if (!OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary) {
				if (RisksStore.addCorporate) {
					this.riskForm.patchValue({ organization_ids: [res['data'][0]] });

				}
				else {
					this.riskForm.patchValue({ organization_ids: res['data'][0] });

				}
			}

			this._utilityService.detectChanges(this._cdr);
		});
	}

	getSelectedValues() {
		// console.log(this.riskForm.value.risk_owner_id);
		// this.selectedSection='issue';
		this.setSaveData();
		// console.log(this.riskForm.value);
		// this.editRisk();
		if (this.riskForm.value.ms_type_organization_ids) {
			RisksStore.msTypes = [];
			for (let i of this.riskForm.value.ms_type_organization_ids) {
				const index = this.MsTypeOrganizationStore.msTypeDetails.findIndex(e => e.id == i);
				if (index > -1) {
					RisksStore.msTypes.push(this.MsTypeOrganizationStore.msTypeDetails[index]);
				}
			}
		}

		if (this.riskForm.value.risk_type_ids) {
			RisksStore.riskTypes = [];
			for (let i of this.riskForm.value.risk_type_ids) {
				const index = this.RiskTypeStore.allItems.findIndex(e => e.id == i);
				if (index > -1) {
					RisksStore.riskTypes.push(this.RiskTypeStore.allItems[index]);
				}
			}
		}
		if (this.riskForm.value.risk_review_frequency_id) {
			const index = this.RiskReviewFrequencyStore.allItems.findIndex(e => e.id == this.riskForm.value.risk_review_frequency_id);
			if (index > -1) {
				RisksStore.riskReviewFrequency = this.RiskReviewFrequencyStore.allItems[index];
			}
		}

	}

	formatDate(date) {
		if (date) {
			// if (this.externalAuidtForm.value.start_date) {
			let tempRiskDate = this._helperService.processDate(date, 'join')
			return tempRiskDate;
		}
	}

	gotoUser(id) {
		this._router.navigateByUrl('/human-capital/users/' + id);
	}

	setClassification(id) {
		this.riskForm.patchValue({
			risk_classification_id: id
		})
	}

	setFieldnames(value) {
		console.log(value)
		if (value.is_risk == 1) {
			this.title = 'title'
			this.risk_management_rr_addform_title = 'risk_management_rr_addform_title'
			this.risk_observation = 'risk_observation'
			this.rm_risk_description = 'rm_risk_description'
			this.risk_management_rr_addform_description = 'risk_management_rr_addform_description'
			this.risk_management_rr_addform_impacts = 'risk_management_rr_addform_impacts'
			this.risk_causes = 'risk_causes'
			this.risk_management_rr_addform_risk_causes = 'risk_management_rr_addform_risk_causes'
		} else {
			this.title = 'opportunity'
			this.risk_management_rr_addform_title = 'rm_opportunity_placeholder'
			this.risk_observation = 'observation'
			this.rm_risk_description = 'description'
			this.risk_management_rr_addform_description = 'rm_addform_description_placeholder'
			this.risk_management_rr_addform_impacts = 'rm_addform_impacts_placeholder'
			this.risk_causes = 'causes'
			this.risk_management_rr_addform_risk_causes = 'rm_addform_causes_placeholder'
		}
	}

	submitForm() {
		AppStore.enableLoading();
		this.nextButtonText = "Loading..";
		this.previousButtonText = "Loading..";

		let save;
		if (RisksStore.riskId) {
			save = this._riskService.updateItem(RisksStore.riskId, this.saveData);
		}
		else {
			// console.log(this.saveData);

			save = this._riskService.saveItem(this.saveData);
		}

		save.subscribe(res => {
			AppStore.disableLoading();
			this._router.navigateByUrl('risk-management/risks/' + res['id']);
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "Next";
				this.previousButtonText = "Previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}
	getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

	setRepetative(event) {
		if (event.target.checked)
			this.repetativeRisk = true;
		else
			this.repetativeRisk = false;
	}


	getButtonText(text) {

		return this._helperService.translateToUserLanguage(text);
	}

	MyCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			// Configure the URL to the upload script in your back-end here!
			return new MyUploadAdapter(loader, this._http);
		};
	}


	setRequiredLevels() {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
			this.riskForm.controls['organization_ids'].setValidators(Validators.required);

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
			this.riskForm.controls['department_ids'].setValidators(Validators.required);

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.riskForm.controls['division_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.riskForm.controls['section_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.riskForm.controls['sub_section_ids'].setValidators(Validators.required);
	}

	unsetRequiredLevels() {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
			this.riskForm.controls['organization_ids'].setValidators(null);

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
			this.riskForm.controls['department_ids'].setValidators(null);

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.riskForm.controls['division_ids'].setValidators(null);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.riskForm.controls['section_ids'].setValidators(null);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.riskForm.controls['sub_section_ids'].setValidators(null);
	}

	setCorporate(event) {
		if (event.target.checked) {
			this.riskForm.patchValue({
				is_corporate: true
			})
			RisksStore.addCorporate = true;
			this.unsetRequiredLevels();


		}

		else {
			this.riskForm.patchValue({
				is_corporate: false
			})
			RisksStore.addCorporate = false;

			this.setRequiredLevels();




		}
		if (RisksStore.editFlag) {
			this.riskForm.patchValue({
				organization_ids: RisksStore.individualRiskDetails.organizations ? this.setType(RisksStore.individualRiskDetails.organizations, 'corporate') : null,
				branch_ids: RisksStore.individualRiskDetails.branches ? this.setType(RisksStore.individualRiskDetails.branches, 'corporate') : null,
				division_ids: RisksStore.individualRiskDetails.divisions ? this.setType(RisksStore.individualRiskDetails.divisions, 'corporate') : null,
				department_ids: RisksStore.individualRiskDetails.departments ? this.setType(RisksStore.individualRiskDetails.departments, 'corporate') : null,
				section_ids: RisksStore.individualRiskDetails.sections ? this.setType(RisksStore.individualRiskDetails.sections, 'corporate') : null,
				sub_section_ids: RisksStore.individualRiskDetails.sub_sections ? this.setType(RisksStore.individualRiskDetails.sub_sections, 'corporate') : null,

			})
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.getPrimaryOrganization();
			}

		}
		else {
			this.riskForm.patchValue({
				organization_ids: AuthStore.user.organization && OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary ? RisksStore.addCorporate ? [AuthStore.user.organization] : AuthStore.user.organization : null,
				// branch_ids: AuthStore.user.branch && OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch ? RisksStore.addCorporate ? [AuthStore.user.branch] : AuthStore.user.branch : null,
				division_ids: AuthStore.user.division && OrganizationLevelSettingsStore.organizationLevelSettings?.is_division ? RisksStore.addCorporate ? [AuthStore.user.division] : AuthStore.user.division : null,

				department_ids: AuthStore.user.department && OrganizationLevelSettingsStore.organizationLevelSettings?.is_department ? RisksStore.addCorporate ? [AuthStore.user.department] : AuthStore.user.department : null,
				section_ids: AuthStore.user.section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_section ? RisksStore.addCorporate ? [AuthStore.user.section] : AuthStore.user.section : null,
				sub_section_ids: AuthStore.user.sub_section && OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section ? RisksStore.addCorporate ? [AuthStore.user.sub_section] : AuthStore.user.sub_section : null,
			})
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.getPrimaryOrganization();
			}
		}


	}

	addImpact() {
		if (this.riskForm.value.impact) {
			RisksStore.impactList.push(this.riskForm.value.impact);
		}
		this.riskForm.patchValue({
			impact: null
		})
		this._utilityService.detectChanges(this._cdr);
	}

	addRiskCause() {
		if (this.riskForm.value.risk_cause) {
			RisksStore.riskCauseList.push(this.riskForm.value.risk_cause);
		}
		this.riskForm.patchValue({
			risk_cause: null
		})
		this._utilityService.detectChanges(this._cdr);
	}

	mouseHover(event, index?) {

		if (index != undefined) {

			this.activeIndex = index;
		}
		else {
			this.activeIndex = null;
		}
		this.hover = true;
		if (this.popup) {
			this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
		}

	}

	clear(type) {
		if (type == 'risk_date') {
			this.riskForm.patchValue({
				risk_date: null
			})
		}
		else {
			this.riskForm.patchValue({
				next_review_date: null
			})
		}

	}

	mouseOut(event) {
		this.activeIndex = null;
		this.hover = false;
		if (this.popup) {
			this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
		}

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

	addControl() {

		setTimeout(() => {
			this.controlObject.type = 'Add'
			this.controlObject.values = null;
			$(this.controlAddFormModal.nativeElement).modal('show');
			this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'display', 'block');
			this._utilityService.detectChanges(this._cdr);
			// $('.modal-backdrop').add();
			// document.body.classList.add('modal-open')
			// this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'display', 'block');
			// this._renderer2.removeAttribute(this.controlAddFormModal.nativeElement, 'aria-hidden');
			// setTimeout(() => {
			//   this._renderer2.addClass(this.controlAddFormModal.nativeElement, 'show')
			//   this._utilityService.detectChanges(this._cdr)
			// }, 100);
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
								let pos = ControlStore?.selectedControlsList.findIndex(e => e.id == ControlStore.lastInsertedId);
								if (pos == -1)
									ControlStore?.selectedControlsList.push(i);
								break;
							}
						}
						ControlStore.setLastInsertedId(null);
					}
				})
			}
			this._utilityService.detectChanges(this._cdr);
			//   this.controlObject.type = null;
			//   document.body.classList.remove('modal-open')
			//   this._renderer2.setStyle(this.controlAddFormModal.nativeElement, 'display', 'none');
			//   this._renderer2.setAttribute(this.controlAddFormModal.nativeElement, 'aria-hidden', 'true');
			//   $('.modal-backdrop').remove();
			// setTimeout(() => {
			//   this._renderer2.removeClass(this.controlAddFormModal.nativeElement, 'show')
			//   this._utilityService.detectChanges(this._cdr)
			// }, 200);
		}, 100);

	}


	/**
	* Search Risk Area
	* @param e e.term - character to search
	* @param patchValue boolean value - to patch form value
	*/
	searchRiskArea(e, patchValue: boolean = false) {
		this._riskAreaService.getItems(false, '&q=' + e.term).subscribe((res: RiskAreaPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let risk_areas = this.riskForm.value.risk_area_ids ? this.riskForm.value.risk_area_ids : [];
						risk_areas.push(i);
						this.riskForm.patchValue({ risk_area_ids: risk_areas });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}
	getRiskArea() {
		this._riskAreaService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}


	/**
  * Search Risk Category
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
	searchRiskCategory(e, patchValue: boolean = false) {
		this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe((res: RiskCategoryPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.riskForm.patchValue({ risk_category_id: i });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}
	getRiskCategory() {
		this._riskCategoryService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

	/**
  * Search Risk Category
  * @param e e.term - character to search
  * @param patchValue boolean value - to patch form value
  */
	searchRiskSubCategory(e, patchValue: boolean = false) {
		if (this.riskForm.value.risk_category_id) {
			this._riskSubCategoryService.getItems(false, 'q=' + e.term + '&risk_category_ids=' + this.riskForm.value.risk_category_id.id).subscribe((res: RiskSubCategoryPaginationResponse) => {
				if (res.data.length > 0 && patchValue) {
					for (let i of res.data) {
						if (i.id == e.term) {

							this.riskForm.patchValue({ risk_sub_category_id: i });
							break;
						}
					}
				}
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}
	getRiskSubCategory() {
		if (this.riskForm.value.risk_category_id) {
			this._riskSubCategoryService.getItems(false, 'risk_category_ids=' + this.riskForm.value.risk_category_id?.id).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		}


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

	getDomain() {
		this._issueDomainService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}


	getRiskSource() {
		this._riskSourceService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}


	searchRiskSource(e, patchValue: boolean = false) {
		this._riskSourceService.getItems(false, '&q=' + e.term).subscribe((res: RiskSourcePaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let risk_sources = this.riskForm.value.risk_source_ids ? this.riskForm.value.risk_source_ids : [];
						risk_sources.push(i);
						this.riskForm.patchValue({ risk_source_ids: risk_sources });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}


	getRiskLibrary() {
		this._riskLibraryService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}
	/**
	  * Search Issue Domain
	  * @param e e.term - character to search
	  * @param patchValue boolean value - to patch form value
	  */
	searchDomain(e, patchValue: boolean = false) {
		this._issueDomainService.getItems(false, 'q=' + e.term).subscribe((res: IssueDomainPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let issue_domains = this.riskForm.value.issue_domain_ids ? this.riskForm.value.issue_domain_ids : [];
						issue_domains.push(i);
						this.riskForm.patchValue({ issue_domain_ids: issue_domains });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	searchRiskLibrary(e, patchValue: boolean = false) {
		this._riskLibraryService.getItems(false, '&q=' + e.term).subscribe((res: RiskLibraryPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						// let riskLib = this.riskForm.value.issue_domain_ids ? this.riskForm.value.issue_domain_ids : [];
						// issue_domains.push(i);
						this.riskForm.patchValue({
							title: i,
							risk_library_id: i.id,
						});
						this._riskLibraryService.getItem(i.id).subscribe(res => {
							this.riskForm.patchValue({

								description: res['description'] ? res['description'] : '',


							})
						})
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	getPopupDetails(user) {
		// $('.modal-backdrop').remove();
		if (user) {
			this.userDetailObject.first_name = user.first_name;
			this.userDetailObject.last_name = user.last_name;
			this.userDetailObject.designation = user.designation ? user.designation : user.designation_title;
			this.userDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
			this.userDetailObject.email = user.email;
			this.userDetailObject.mobile = user.mobile;
			this.userDetailObject.id = user.id;
			this.userDetailObject.department = user.department?.title ? user.department?.title : null;
			this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
			return this.userDetailObject;
		}

	}

	getOwnerPopupDetails(user) {
		if (user) {
			this.ownerDetailObject.first_name = user.first_name;
			this.ownerDetailObject.last_name = user.last_name;
			this.ownerDetailObject.designation = user.designation ? user.designation : user.designation_title;
			this.ownerDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
			this.ownerDetailObject.email = user.email;
			this.ownerDetailObject.mobile = user.mobile;
			this.ownerDetailObject.id = user.id;
			this.ownerDetailObject.department = user.department?.title ? user.department?.title : null;
			this.ownerDetailObject.status_id = user.status_id ? user.status_id : 1;
			return this.ownerDetailObject;
		}
		// $('.modal-backdrop').remove();

	}



	getMsType(fetch: boolean = false) {
		this._msTypeOrganizationService.getItems(fetch).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}
	searchMsType(e) {
		this._msTypeOrganizationService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

	searchSubsidiary(e) {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		}
	}

	getSubsidiary() {
		this._subsidiaryService.getAllItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
			// this.riskForm.value.division_ids = null;
			// this.DivisionStore.setAllDivision([]);
			this._utilityService.detectChanges(this._cdr);
		});
	}

	// searchBranch(e) {
	//   this._branchService.searchBranch('?q=' + e.term).subscribe(res => {
	//     this.riskForm.value.division_ids = [];
	//     this.DivisionStore.setAllDivision([]);
	//     this._utilityService.detectChanges(this._cdr);
	//   })
	// }

	// getBranch() {
	//   this._branchService.getAllItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
	//     this._utilityService.detectChanges(this._cdr);
	//   });
	// }

	getUsers() {
		var params = '';
		if (this.riskForm.get('organization_ids').value) {
			if (RisksStore?.addCorporate)
				params = '?organization_ids=' + this.getTypes(this.riskForm.value.organization_ids)
			else
				params = '?organization_ids=' + this.riskForm.value.organization_ids.id

			if (this.riskForm.value.division_ids && RisksStore?.addCorporate)
				params += '&division_ids=' + this.getTypes(this.riskForm.value.division_ids);
			else if (this.riskForm.value.division_ids && !RisksStore?.addCorporate)
				params += '&division_ids=' + this.riskForm.value.division_ids.id;

			if (this.riskForm.value.department_ids && RisksStore?.addCorporate)
				params += '&department_ids=' + this.getTypes(this.riskForm.value.department_ids);
			else if (this.riskForm.value.department_ids && !RisksStore?.addCorporate)
				params += '&department_ids=' + this.riskForm.value.department_ids.id;

			if (this.riskForm.value.section_ids && RisksStore?.addCorporate)
				params += '&section_ids=' + this.getTypes(this.riskForm.value.section_ids);
			else if (this.riskForm.value.section_ids && !RisksStore?.addCorporate)
				params += '&section_ids=' + this.riskForm.value.section_ids.id;


			if (this.riskForm.value.sub_section_ids && RisksStore?.addCorporate)
				params += '&sub_section_ids=' + this.getTypes(this.riskForm.value.sub_section_ids);
			else if (this.riskForm.value.sub_section_ids && !RisksStore?.addCorporate)
				params += '&sub_section_ids=' + this.riskForm.value.sub_section_ids.id;

		}
		this._usersService.getAllItems(params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	searchUsers(e) {
		let params = '';
		if (this.riskForm.get('organization_ids').value) {
			if (RisksStore?.addCorporate)
				params = '?organization_ids=' + this.getTypes(this.riskForm.value.organization_ids)
			else
				params = '?organization_ids=' + this.riskForm.value.organization_ids.id

			if (this.riskForm.value.division_ids && RisksStore?.addCorporate)
				params += '&division_ids=' + this.getTypes(this.riskForm.value.division_ids);
			else if (this.riskForm.value.division_ids && !RisksStore?.addCorporate)
				params += '&division_ids=' + this.riskForm.value.division_ids.id;

			if (this.riskForm.value.department_ids && RisksStore?.addCorporate)
				params += '&department_ids=' + this.getTypes(this.riskForm.value.department_ids);
			else if (this.riskForm.value.department_ids && !RisksStore?.addCorporate)
				params += '&department_ids=' + this.riskForm.value.department_ids.id;

			if (this.riskForm.value.section_ids && RisksStore?.addCorporate)
				params += '&section_ids=' + this.getTypes(this.riskForm.value.section_ids);
			else if (this.riskForm.value.section_ids && !RisksStore?.addCorporate)
				params += '&section_ids=' + this.riskForm.value.section_ids.id;


			if (this.riskForm.value.sub_section_ids && RisksStore?.addCorporate)
				params += '&sub_section_ids=' + this.getTypes(this.riskForm.value.sub_section_ids);
			else if (this.riskForm.value.sub_section_ids && !RisksStore?.addCorporate)
				params += '&sub_section_ids=' + this.riskForm.value.sub_section_ids.id;
		}
		if (params) params = params + '&q=' + e.term;
		else params = '?q=' + e.term;
		this._usersService.searchUsers(params ? params : '').subscribe(res => {
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


	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}


	setNull(type) {
		switch (type) {
			case 'division':
				this.riskForm.patchValue({
					branch_ids: null,
					division_ids: null,
					department_ids: null,
					section_ids: null,
					sub_section_ids: null,
					user_ids: [],
					risk_owner_id: null
				})
				break;
			case 'department':
				this.riskForm.patchValue({
					department_ids: null,
					section_ids: null,
					sub_section_ids: null,
					user_ids: [],
					risk_owner_id: null
				})
				break;
			case 'section':
				this.riskForm.patchValue({

					section_ids: null,
					sub_section_ids: null,
					user_ids: [],
					risk_owner_id: null
				})
				break;
			case 'sub_section':
				this.riskForm.patchValue({
					sub_section_ids: null,
					user_ids: [],
					risk_owner_id: null
				})
				break;

		}
	}

	/**
	 * Search Division
	 * @param e e.term - character to search
	 */
	searchDivision(e) {
		let parameters = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if ((this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
				parameters = parameters + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)
		}
		this._divisionService.getItems(false, '&q=' + e.term + parameters).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	// Get Division
	getDivision() {
		let parameters = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if ((this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
				parameters = parameters + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)
		}
		this._divisionService.getItems(false, parameters).subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		});

	}

	/**
	* Search Department
	* @param e e.term - character to search
	*/
	searchDepartment(e) {
		var params = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if ((this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value?.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value?.id)
		}
		this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	// Get Department
	getDepartment() {
		var params = '';
		// console.log('department');
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if (this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id))
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value.id)

		}
		this._departmentService.getItems(false, params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});


	}

	// Get Section
	getSection() {
		var params = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if (this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id))
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
			params = params + '&department_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('department_ids').value) : this.riskForm.get('department_ids').value.id)

		}
		this._sectionService.getItems(false, params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	/**
	* Search Section
	* @param e e.term - character to search
	*/
	searchSection(e) {
		var params = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if (this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id))
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
			params = params + '&department_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('department_ids').value) : this.riskForm.get('department_ids').value.id)

		} this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
			// this.riskForm.value.sub_section_ids = null;
			// this.SubSectionStore.setAllSubSection([]);
			this._utilityService.detectChanges(this._cdr);
		});

	}

	// Get Sub Section
	getSubSection() {
		var params = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if (this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id))
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
			params = params + '&department_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('department_ids').value) : this.riskForm.get('department_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
			params = params + '&section_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('section_ids').value) : this.riskForm.get('section_ids').value.id)
		}
		this._subSectionService.getItems(false, params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	/**
	* Search Sub Section
	* @param e e.term - character to search
	*/
	searchSubSection(e) {
		var params = '';
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			if (this.riskForm.get('organization_ids').value && (this.riskForm.get('organization_ids').value.length > 0 || this.riskForm.get('organization_ids').value.id))
				params = params + '&organization_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('organization_ids').value) : this.riskForm.get('organization_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) {
			params = params + '&division_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('division_ids').value) : this.riskForm.get('division_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department) {
			params = params + '&department_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('department_ids').value) : this.riskForm.get('department_ids').value.id)

		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
			params = params + '&section_ids=' + (RisksStore.addCorporate ? this._helperService.createParameterFromArray(this.riskForm.get('section_ids').value) : this.riskForm.get('section_ids').value.id)
		}
		this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}


	cancelRisk(status) {
		if (status) {
			if (RisksStore.addCorporate)
				this._router.navigateByUrl('risk-management/corporate-risks');
			else
				this._router.navigateByUrl('risk-management/risks');
			AppStore.disableLoading();
			this.clearCancelObject();
		}
		else {
			this.clearCancelObject();
		}
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('hide');
		}, 250);
	}


	confirmCancel() {
		this.cancelObject.type = 'Cancel';
		this.cancelObject.title = 'Cancel?';
		this.cancelObject.subtitle = 'risk_cancel_confirmation';
		$(this.cancelPopup.nativeElement).modal('show');
	}

	clearCancelObject() {
		this.cancelObject.title = '';
		this.cancelObject.subtitle = '';

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
		else if (type == 'control') {
			this.selectControls();

		}
		else if (type == 'incident') {
			this.selectincident();
		}

	}


	// Opens Modal to Select Processes
	selectProcesses() {
		// this.selectedType="process";

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


	//select modal for projects
	selectControls() {
		ControlStore.control_select_form_modal = true;
		//ProjectsStore.issue_select_form_modal = true;
		$(this.controlFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
		this._utilityService.detectChanges(this._cdr);
	}

	//close modal for select projects
	closeControls() {
		ControlStore.control_select_form_modal = false;
		$(this.controlFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

// incident open
	selectincident() {
		IncidentStore.incident_select_form_modal = true;
		$(this.incidentFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.incidentFormModal.nativeElement,'z-index',999999);
		this._renderer2.setStyle(this.incidentFormModal.nativeElement,'overflow','auto');
		this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}
	//close incident modal for select projects
	closeincident() {
		IncidentStore.incident_select_form_modal = false;
		$(this.incidentFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	gotoMappingSection(type) {
		if (type == 'issue') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });


		}
		else if (type == 'process') {
			if (RisksStore.individualRiskDetails?.is_analysis_performed != 1) {
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
			}
			else
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "process_mapping_restriction" });
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
			if (RisksStore.individualRiskDetails?.is_analysis_performed == 1) {
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "control_mapping_restriction" })
			}
			else
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });


		}
		else if (type == 'incident') {
			NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_incident" });
		}
		this.selectedSection = type;
	}




	// Opens Modal to add New Issue Domain
	addIssueDomain() {
		this.issueDomainObject.type = 'Add';
		this.issueDomainObject.values = null; // for clearing the value
		IssueListStore.issue_domain_form_modal = true;
		this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.issueDomainFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	/**
	* Close Modal to add New Issue Domain.
	* If new issue domain created, search for issue domain by id and patches the form
	*/
	closeIssueDomainModal() {
		if (IssueDomainMasterStore.lastInsertedId) {
			this.searchDomain({ term: IssueDomainMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.issueDomainObject.type = null;
			IssueListStore.issue_domain_form_modal = false;
			this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.issueDomainFormModal.nativeElement, 'show');
			this._renderer2.setStyle(this.issueDomainFormModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();
			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}



	// Opens Modal to add New Issue Domain
	addLibrary() {
		this.riskLibraryObject.type = 'Add';
		this.riskLibraryObject.values = null; // for clearing the value
		RiskLibraryMasterStore.risk_library_form_modal = true;
		this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'overflow', 'auto');
		this._renderer2.addClass(this.riskLibraryFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	/**
	* Close Modal to add New Issue Domain.
	* If new issue domain created, search for issue domain by id and patches the form
	*/
	closeLibrary() {
		if (RiskLibraryMasterStore.lastInsertedId) {
			this.searchRiskLibrary({ term: RiskLibraryMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskLibraryObject.type = null;
			RiskLibraryMasterStore.risk_library_form_modal = false;
			this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'z-index', 99999);
			this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'overflow', 'none');
			this._renderer2.removeClass(this.riskLibraryFormModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskLibraryFormModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();
			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	// Opens Modal to add New Risk Area
	addRiskArea() {
		this.riskAreaObject.type = 'Add';
		this.riskAreaObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.riskAreaModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	/**
	* Close Modal to add New Risk Area.
	* If new Risk Area created, search for Risk Area by id and patches the form
	*/
	closeRiskAreaModal() {
		if (RiskAreaMasterStore.lastInsertedId) {
			this.searchRiskArea({ term: RiskAreaMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskAreaObject.type = null;
			// $(this.riskAreaModal.nativeElement).modal('hide');
			this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.riskAreaModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskAreaModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}


	// Opens Modal to add New Risk Sub Category
	addRiskSubCategory() {
		this.riskSubCategoryObject.type = 'Add';
		this.riskSubCategoryObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.riskSubCategoryModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}



	/**
	* Close Modal to add New Risk Sub Category.
	* If new Risk Sub Category created, search for Risk Sub cATEGORY by id and patches the form
	*/
	closeRiskSubCategoryModal() {
		if (RiskSubCategoryMasterStore.lastInsertedId) {
			this.searchRiskSubCategory({ term: RiskSubCategoryMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskSubCategoryObject.type = null;

			this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.riskSubCategoryModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskSubCategoryModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}


	// Opens Modal to add New Risk surce
	addRiskSource() {
		this.riskSourceObject.type = 'Add';
		this.riskSourceObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.riskSourceModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	/**
	* Close Modal to add New Risk source.
	* If new Risk source created, search for Risk source by id and patches the form
	*/
	closeRiskSourceModal() {
		if (RiskSourceMasterStore.lastInsertedId) {
			this.searchRiskSource({ term: RiskSourceMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskSourceObject.type = null;
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.riskSourceModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	setLibraryProperties(event, returnValue?) {
		// console.log(event);
		this._riskLibraryService.getItem(event).subscribe(res => {

			if (returnValue) {
				return res['title'];
			}
			else {
				this.riskForm.patchValue({
					title: res['title'] ? res['title'] : '',

				})
			}



		})

	}

	// Opens Modal to add New Risk Category
	addRiskCategory() {
		this.riskCategoryObject.type = 'Add';
		this.riskCategoryObject.values = null; // for clearing the value
		// $(this.riskCategoryFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.riskCategoryFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	/**
	* Close Modal to add New Risk Category.
	* If new Risk Category created, search for Risk Category by id and patches the form
	*/
	closeRiskCategoryModal() {
		if (RiskCategoryMasterStore.lastInsertedId) {
			this.searchRiskCategory({ term: RiskCategoryMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskCategoryObject.type = null;
			// $(this.riskCategoryFormModal.nativeElement).modal('hide');
			this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.riskCategoryFormModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskCategoryFormModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();
			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	getStringsFormatted(stringArray, characterLength, seperator) {
		return this._helperService.getFormattedName(stringArray, characterLength, seperator);
	}

	//Right left scroll starts
	prev(){
		var container = document.getElementById('container');
		this.sideScroll(container,'left',0,1000,10);
	}

	next(){
		var container = document.getElementById('container');
		this.sideScroll(container,'right',0,1000,10);
	}
	
	sideScroll(element,direction,speed,distance,step){
		let scrollAmount = 0;
		var slideTimer = setInterval(function(){
			if(direction == 'left'){
				element.scrollLeft -= step;
			} else {
				element.scrollLeft += step;
			}
			scrollAmount += step;
			if(scrollAmount >= distance){
				window.clearInterval(slideTimer);
			}
		}, speed);
	  }
	  //Right left scroll ends
	
	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		NoDataItemStore.unsetNoDataItems();
		RisksStore.impactList = [];
		RisksStore.riskCauseList = [];
		window.removeEventListener('scroll', this.scrollEvent);
		this.setModalStyleSubscription.unsubscribe();
		this.controlModalEventSubscription.unsubscribe();
		this.cancelEventSubscription.unsubscribe();
		this.subscription.unsubscribe();
		this.areaSubscription.unsubscribe();
		this.subCategorySubscription.unsubscribe();
		this.riskCategorySubscription.unsubscribe();
		this.projectSelectSubscription.unsubscribe();
		this.productSelectSubscription.unsubscribe();
		this.locationSelectSubscription.unsubscribe();
		this.customerSelectSubscription.unsubscribe();
		this.objectiveSelectSubscription.unsubscribe();
		this.controlSelectSubscription.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.incidentSelectSubscription.unsubscribe();
		RisksStore.msTypes = [];
		RisksStore.riskTypes = [];
		RisksStore.riskReviewFrequency = null;
		RisksStore.users = [];
		RisksStore.unsetEditFlag();
		RisksStore.addCorporate = false;
	}

}
