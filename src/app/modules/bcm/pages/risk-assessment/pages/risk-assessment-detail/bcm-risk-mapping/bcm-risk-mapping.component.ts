import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmRiskMappingService } from 'src/app/core/services/bcm/bcm-risk-mapping/bcm-risk-mapping.service';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BcmRiskMappingStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-mapping.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
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
	selector: 'app-bcm-risk-mapping',
	templateUrl: './bcm-risk-mapping.component.html',
	styleUrls: ['./bcm-risk-mapping.component.scss']
})
export class BcmRiskMappingComponent implements OnInit {

	@ViewChild('issueFormModal') issueFormModal: ElementRef;
	@ViewChild('locationFormModal') locationFormModal: ElementRef;
	@ViewChild('projectFormModal') projectFormModal: ElementRef;
	@ViewChild('productFormModal') productFormModal: ElementRef;
	@ViewChild('customerFormModal') customerFormModal: ElementRef;
	@ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
	@ViewChild('controlFormModal') controlFormModal: ElementRef;
	@ViewChild('assetsFormModal') assetsFormModal: ElementRef;
	@ViewChild('strategicFocusAreaModal') strategicFocusAreaModal: ElementRef;
	@ViewChild('processFormModal') processFormModal: ElementRef;
	@ViewChild('serviceFormModal') serviceFormModal: ElementRef;
	@ViewChild('deletePopup') deletePopup: ElementRef;
	IssueListStore = IssueListStore;
	LocationMasterStore = LocationMasterStore;
	BusinessProjectsStore = BusinessProjectsStore;
	BusinessProductsStore = BusinessProductsStore;
	StrategicObjectiveMasterStore = StrategicObjectivesMasterStore;
	FocusAreaMasterStore = FocusAreaMasterStore
	BusinessServiceStore = BusinessServiceStore
	AssetRegisterStore = AssetRegisterStore
	selectedSection = 'control';
	OrganizationModulesStore = OrganizationModulesStore;
	BcmRiskAssessmentStore = BcmRiskAssessmentStore
	BcmRiskMappingStore = BcmRiskMappingStore;
	AppStore = AppStore;
	AuthStore = AuthStore;
	issues = [];
	processes = [];
	services= [];
	controls = []
	reactionDisposer: IReactionDisposer;
	deleteEventSubscription: any;
	deleteObject = {
		id: null,
		title: '',
		type: '',
		subtitle: ''
	};
	modalObject = {
		component : 'risk',
	  }
	chooseButtonTitle = 'Map ' +this.selectedSection +' with risk';
	issueEmptyList = "Looks like risk doesn't mapped with any issue";
	processEmptyList = "Looks like risk doesn't mapped with any process";
	strategicFocusAreaTitle = 'risk_strategic_focusarea_message';
	customerModalTitle = 'risk_customer_modal_message';
	projectsModalTitle = 'risk_projects_modal_message';
	issuesModalTitle = 'risk_issues_modal_message';
	processModalTitle = 'risk_process_modal_message';
	locationModalTitle = 'risk_location_modal_message';
	productModalTitle = 'risk_product_modal_message';
	strategicModalTitle = 'risk_strategic_modal_message';
	controlsModalTitle = 'risk_controls_modal_message';
	serviceModalTitle = 'asset_service_modal_message';
	assetsModalTitle = 'asset_modal_message'

	issueSelectSubscription: any;
	subscription: any;
	projectSelectSubscription: any;
	locationSelectSubscription: any;
	productSelectSubscription: any;
	controlSelectSubscription: any;
	customerSelectSubscription: any;
	objectiveSelectSubscription: any;
	serviceSelectSubscription: any;
	BusinessProductStore = BusinessProductsStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	BusinessCustomersStore = BusinessCustomersStore;
	ControlStore = ControlStore;
	ProcessStore = ProcessStore;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	focusAreaSelectSubscription: any;
	assetsSelectSubscription: any;
	
	constructor(private _bcmRiskMappingService: BcmRiskMappingService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
		private _renderer2: Renderer2,
		private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService,
		private _bcmRiskAssessmentService: BcmRiskAssessmentService) { }

	ngOnInit(): void {
		BcmRiskMappingStore.loaded = false
		this.reactionDisposer = autorun(() => {
			var subMenuItems = [
				{ activityName: null, submenuItem: { type: 'export_to_excel' } },
				{ activityName: null, submenuItem: { type: 'close', path: '../' } },
			]

			this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
			this.gotoSection(this.selectedSection);
			// NoDataItemStore.setNoDataItems({title: "Looks like we don't have issues added here",subtitle:"To add issue, Simply tap the button below",buttonText:"Add issue"});
			if (NoDataItemStore.clikedNoDataItem) {
				this.openSelectPopup();

				NoDataItemStore.unSetClickedNoDataItem();
			}
			if (SubMenuItemStore.clikedSubMenuItem) {
				//submenu selection
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "edit_modal":
						setTimeout(() => {

							this._utilityService.detectChanges(this._cdr);
							// BcmRiskAssessmentStore.setEditFlag();
							// this._router.navigateByUrl('/risk-management/risks/edit-risk');
						}, 1000);
						break;
					case "export_to_excel":

						this._bcmRiskMappingService.exportToExcel();
						break;
					case "delete":
						// this.deleteRisk(BcmRiskAssessmentStore.riskId);
						break;


					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();


			}
		})
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		AppStore.showDiscussion = false;

		this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.delete(item);
		})

		this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
			this.closeService();
		  })

		this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
			this.closeIssues();
		})

		this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
			this.closeProcesses();
		})


		this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
			this.closeProjects();
		})

		this.locationSelectSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
			this.closeLocations();
		})

		this.assetsSelectSubscription = this._eventEmitterService.assetsMappingModal.subscribe(item => {
			this.closeAssets();
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
		this.focusAreaSelectSubscription = this._eventEmitterService.strategicFocusAreaMapping.subscribe(item => {
			this.closeFocusArea();
		})
		this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControls();
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
		this.getRiskMapping();
		// setTimeout(() => {

		// }, 500);
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
		else if ($(this.assetsFormModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'overflow', 'auto');
		}
	}

	openSelectPopup() {
		switch (this.selectedSection) {
			case 'process': this.selectProcesses(); break;
			case 'issue': this.selectIssues(); break;
			case 'location': this.selectLocations(); break;
			case 'project': this.selectProjects(); break;
			case 'control': this.selectControls(); break;
			case 'customer': this.selectCustomers(); break;
			case 'product': this.selectProducts(); break;
			case 'objective': this.selectObjectives(); break;
			case 'focus-area': this.selectFocusArea(); break;
			case 'assets': this.selectAssets(); break;
			case 'service': this.selectServices(); break;
		}
	}

	getRiskMapping() {
		this._bcmRiskMappingService.getItems().subscribe(res => {
			this.setValues(res);
			this._utilityService.detectChanges(this._cdr);
			// setTimeout(() => {

			// }, 100);

		})
	}

	setValues(RiskMapping) {
		console.log("Riskmapp",RiskMapping)
		IssueListStore.selectedIssuesList = [];
		ProcessStore.selectedProcessesList = [];
		BusinessProjectsStore.selectedProjectList = [];
		LocationMasterStore.selectedLocationList = [];
		ControlStore.selectedControlsList = [];
		BusinessCustomersStore.selectedCustomerList = [];
		BusinessProductsStore.selectedProductList = [];
		BusinessServiceStore.selectedBusinessServicesList = [];
		StrategicObjectivesMasterStore.selectedStrategic = [];
		FocusAreaMasterStore.selectedStrategic = [];
		BcmRiskMappingStore.projects = [];
		BcmRiskMappingStore.locations = [];
		BcmRiskMappingStore.controls = [];
		BcmRiskMappingStore.customers = [];
		BcmRiskMappingStore.products = [];
		BcmRiskMappingStore.objectives = [];
		BcmRiskMappingStore.focusAreas = [];
		this.issues = [];
		this.processes = [];
		this.services = [];
		// if(BcmRiskMappingStore.loaded){
		let processItem = RiskMapping.processes;
		let issueItem = RiskMapping.organization_issues;
		let projectItem = RiskMapping.projects;
		this.services = RiskMapping.services;
		this.controls =RiskMapping.controls
		BcmRiskMappingStore.locations = RiskMapping.locations;
		BcmRiskMappingStore.products = RiskMapping.products;
		BcmRiskMappingStore.customers = RiskMapping.customers;
		BcmRiskMappingStore.objectives = RiskMapping.strategic_objectives;
		BcmRiskMappingStore.controls = RiskMapping.controls;
		BcmRiskMappingStore.focusAreas = RiskMapping.focus_areas;
		BcmRiskMappingStore.assets = RiskMapping.risk_assets;


		for (let p of processItem) {
			p['process_group_title'] = p.process_group.title;
			p['department'] = p.department.title;
			// p['process_category']=p.process_category.title;
			this.processes.push(p);
		}


		for (let i of issueItem) {
			i['issue_categories'] = this.getArrayFormatedString('title', i.organization_issue_categories);
			i['departments'] = this.getArrayFormatedString('title', i.organization_issue_departments);
			i['issue_domains'] = this.getArrayFormatedString('title', i.organization_issue_domains);
			i['issue_types_list'] = [];
			for (let j of i.organization_issue_types) {
				i['issue_types_list'].push(j.title);
			}
			this.issues.push(i);
		}


		this._utilityService.detectChanges(this._cdr);
		// }

	}

	getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

	gotoSection(type) {
		this.selectedSection = type;
		this.chooseButtonTitle = 'Map ' +this.selectedSection +' with risk';
		switch (type) {
			case 'issue':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });
				break;
			case 'process':
				if (BcmRiskAssessmentStore.bcmRiskDetails?.is_analysis_performed != 1 && BcmRiskAssessmentStore.bcmRiskDetails?.risk_status?.type != 'closed' && BcmRiskAssessmentStore.isProperEditUser()) {
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });

				}
				else {
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "process_mapping_restriction" });

				}
				break;
			case 'location':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_location" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;
			case 'project':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_project" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;

			case 'product':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_product" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;

			case 'customer':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_customer" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;

			case 'objective':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_strategic_objective" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;

			case 'assets':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_assets" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });

				break;

			case 'control':
				if (BcmRiskAssessmentStore.bcmRiskDetails?.is_analysis_performed != 1 && BcmRiskAssessmentStore.bcmRiskDetails?.risk_status?.type != 'closed' && BcmRiskAssessmentStore.isProperEditUser()) {
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
				}
				else {
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "control_mapping_restriction" })
				}
				break;
			case 'focus-area':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "choose_focus_area" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });
				break;

			case 'service':
				if (BcmRiskAssessmentStore.isProperEditUser())
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_service" });
				else
					NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping" });
				break;
		}

	}



	getIds(data) {
		let idArray = [];
		for (let i of data) {
			idArray.push(i.id)
		}
		return idArray;
	}

	selectServices() {
		BusinessServiceStore.saveSelected = false;
		BusinessServiceStore.selectedBusinessServicesList = this.services;
		BusinessServiceStore.service_select_form_modal = true;
		$(this.serviceFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	  }

	// Opens Modal to Select Processes
	selectProcesses() {
		ProcessStore.saveSelected = false;
		ProcessStore.selectedProcessesList = this.processes;
		IssueListStore.processes_form_modal = true;
		$(this.processFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
		// $('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr);
	}

	// Close Modal to select processes
	closeProcesses() {
		if (ProcessStore?.saveSelected) {
			let saveData = {
				process_ids: this.getIds(ProcessStore?.selectedProcessesList)
			}
			ProcessStore.saveSelected = false;
			this._bcmRiskMappingService.saveProcessForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				this.getRisk();
				IssueListStore.processes_form_modal = false;
				$(this.processFormModal.nativeElement).modal('hide');
				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			IssueListStore.processes_form_modal = false;
			$(this.processFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}


		this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();

	}

	selectIssues() {
		IssueListStore.saveSelected = false;
		IssueListStore.selectedIssuesList = this.issues;
		IssueListStore.issue_select_form_modal = true;
		$(this.issueFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}
	selectLocations() {
		LocationMasterStore.saveSelected = false;
		LocationMasterStore.selectedLocationList = BcmRiskMappingStore.locations;
		LocationMasterStore.location_select_form_modal = true;
		$(this.locationFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}
	selectProjects() {
		BusinessProjectsStore.saveSelected = false;
		BusinessProjectsStore.selectedProjectList = BcmRiskMappingStore.projects;
		BusinessProjectsStore.project_select_form_modal = true;
		$(this.projectFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectProducts() {
		BusinessProductsStore.saveSelected = false;
		BusinessProductsStore.selectedProductList = BcmRiskMappingStore.products;
		BusinessProductsStore.product_select_form_modal = true;
		$(this.productFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectCustomers() {
		BusinessCustomersStore.saveSelected = false;
		BusinessCustomersStore.selectedCustomerList = BcmRiskMappingStore.customers;
		BusinessCustomersStore.customer_select_form_modal = true;
		$(this.customerFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectObjectives() {
		StrategicObjectivesMasterStore.saveSelected = false;
		StrategicObjectivesMasterStore.selectedStrategic = BcmRiskMappingStore.objectives;
		StrategicObjectivesMasterStore.objective_select_form_modal = true;
		$(this.objectiveFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectAssets() {
		AssetRegisterStore.saveSelected = false;
		AssetRegisterStore.selectedAssets = BcmRiskMappingStore.assets;
		AssetRegisterStore.assets_select_form_modal = true;
		$(this.assetsFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectControls() {
		ControlStore.saved = false;
		ControlStore.selectedControlsList = BcmRiskMappingStore.controls;
		ControlStore.control_select_form_modal = true;
		$(this.controlFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);

	}

	selectFocusArea() {
		FocusAreaMasterStore.selectedStrategic = BcmRiskMappingStore.focusAreas;
		FocusAreaMasterStore.objective_select_form_modal = true
		FocusAreaMasterStore.saveSelected = false;
		console.log("BcmRiskMappingStore",FocusAreaMasterStore.selectedStrategic)
		$(this.strategicFocusAreaModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	getRisk() {
		this._bcmRiskAssessmentService.getItem(BcmRiskAssessmentStore.selectedId).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	// Close Modal to select issues
	closeService() {
		if (BusinessServiceStore.saveSelected) {
		  let saveData = {
			service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
		  }
		  BusinessServiceStore.saveSelected = false;
		  this._bcmRiskMappingService.saveServiceForMapping(saveData).subscribe(res => {
		   
			this.getRiskMapping();
		   
			BusinessServiceStore.service_select_form_modal = false;
			$(this.serviceFormModal.nativeElement).modal('hide');
	
			this._utilityService.detectChanges(this._cdr);
		  })
		}
		else {
		  this.getRiskMapping();
		  BusinessServiceStore.service_select_form_modal = false;
		  $(this.serviceFormModal.nativeElement).modal('hide');
		  this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
	  }

	closeIssues() {
		if (IssueListStore?.saveSelected) {
			let saveData = {
				organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
			}
			IssueListStore.saveSelected = false;
			this._bcmRiskMappingService.saveIssueForMapping(saveData).subscribe(res => {

				this.getRiskMapping();

				IssueListStore.issue_select_form_modal = false;
				$(this.issueFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			IssueListStore.issue_select_form_modal = false;
			$(this.issueFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}
	// Close Modal to select issues
	closeLocations() {
		if (LocationMasterStore?.saveSelected) {
			let saveData = {
				location_ids: this.getIds(LocationMasterStore?.selectedLocationList)
			}
			LocationMasterStore.saveSelected = false;
			this._bcmRiskMappingService.saveLocationForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				LocationMasterStore.location_select_form_modal = false;
				$(this.locationFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			LocationMasterStore.location_select_form_modal = false;
			$(this.locationFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}


	// Close Modal to select issues
	closeProjects() {
		if (BusinessProjectsStore?.saveSelected) {
			let saveData = {
				project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
			}
			BusinessProjectsStore.saveSelected = false;
			this._bcmRiskMappingService.saveProjectForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				BusinessProjectsStore.project_select_form_modal = false;
				$(this.projectFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			BusinessProjectsStore.project_select_form_modal = false;
			$(this.projectFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeControls() {
		if (ControlStore?.saved) {
			let saveData = {
				control_ids: this.getIds(ControlStore?.selectedControlsList)
			}
			ControlStore.saved = false;
			this._bcmRiskMappingService.saveControlForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				this.getRisk();
				ControlStore.control_select_form_modal = false;
				this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 9);
				this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'none');
				$(this.controlFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			ControlStore.control_select_form_modal = false;
			$(this.controlFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeProducts() {
		if (BusinessProductsStore?.saveSelected) {
			let saveData = {
				product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
			}
			BusinessProductsStore.saveSelected = false;
			this._bcmRiskMappingService.saveProductForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				BusinessProductsStore.product_select_form_modal = false;
				$(this.productFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			BusinessProductsStore.product_select_form_modal = false;
			$(this.productFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeCustomers() {
		if (BusinessCustomersStore?.saveSelected) {
			let saveData = {
				customer_ids: this.getIds(BusinessCustomersStore?.selectedCustomerList)
			}
			BusinessCustomersStore.saveSelected = false;
			this._bcmRiskMappingService.saveCustomerForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				BusinessCustomersStore.customer_select_form_modal = false;
				$(this.customerFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			BusinessCustomersStore.customer_select_form_modal = false;
			$(this.customerFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeObjectives() {
		if (StrategicObjectivesMasterStore?.saveSelected) {
			let saveData = {
				strategic_objective_ids: this.getIds(StrategicObjectivesMasterStore?.selectedStrategic)
			}
			StrategicObjectivesMasterStore.saveSelected = false;
			this._bcmRiskMappingService.saveObjectiveForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				StrategicObjectivesMasterStore.objective_select_form_modal = false;
				$(this.objectiveFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			StrategicObjectivesMasterStore.objective_select_form_modal = false;
			$(this.objectiveFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeAssets() {
		if (AssetRegisterStore?.saveSelected) {
			let saveData = {
				asset_ids: this.getIds(AssetRegisterStore?.selectedAssets)
			}
			AssetRegisterStore.saveSelected = false;
			this._bcmRiskMappingService.saveAssetsForMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				AssetRegisterStore.assets_select_form_modal = false;
				$(this.assetsFormModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			AssetRegisterStore.assets_select_form_modal = false;
			$(this.assetsFormModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();


	}

	closeFocusArea() {

		if (FocusAreaMasterStore?.saveSelected) {
			let saveData = {
				focus_area_ids: this.getIds(FocusAreaMasterStore?.selectedStrategic)
			}
			FocusAreaMasterStore.saveSelected = false;
			this._bcmRiskMappingService.saveFocusAreaMapping(saveData).subscribe(res => {

				this.getRiskMapping();
				FocusAreaMasterStore.objective_select_form_modal = false;
				$(this.strategicFocusAreaModal.nativeElement).modal('hide');

				this._utilityService.detectChanges(this._cdr);
			})
		}
		else {
			this.getRiskMapping();
			FocusAreaMasterStore.objective_select_form_modal = false;
			$(this.strategicFocusAreaModal.nativeElement).modal('hide');
			this._utilityService.detectChanges(this._cdr);
		}
		this._renderer2.setStyle(this.strategicFocusAreaModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
	}

	deleteServiceMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'service';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation_asset"
	
		$(this.deletePopup.nativeElement).modal('show');
	  }

	deleteProcessMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'process';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	clearDeleteObject() {

		this.deleteObject.id = null;

	}
	deleteIssueMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'issue';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteAssets(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'assets';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteLocationMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'location';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}


	deleteProjectMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'project';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteProductMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'product';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteControlMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'control';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteCustomerMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'customer';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}


	deleteObjectiveMapping(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'objective';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	deleteFocusArea(id) {
		this.deleteObject.id = id;
		this.deleteObject.title = 'focus-area';
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "detach_item_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}


	/**
  * Delete the risk
  * @param id -risk id
  */
	delete(status) {
		let deleteId = [];

		let deleteData;
		if (status && this.deleteObject.id) {
			deleteId.push(this.deleteObject.id);
			let data = null;
			switch (this.deleteObject.title) {

				case 'process':
					data = {
						is_deleted: true,
						process_ids: deleteId
					}

					deleteData = this._bcmRiskMappingService.deleteProcessMapping(data)
					break;
				case 'issue':
					data = {
						is_deleted: true,
						organization_issue_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteIssueMapping(data)
					break;
				case 'service':
					data = {
						is_deleted: true,
						service_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteServiceMapping(data)
					break;
				case 'location':
					data = {
						is_deleted: true,
						location_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteLocationMapping(data)
					break;
				case 'project':
					data = {
						is_deleted: true,
						project_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteProjectMapping(data)
					break;
				case 'product':
					data = {
						is_deleted: true,
						product_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteProductMapping(data)
					break;
				case 'customer':
					data = {
						is_deleted: true,
						customer_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteCustomerMapping(data)
					break;
				case 'control':
					data = {
						is_deleted: true,
						control_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteControlMapping(data)
					break;
				case 'objective':
					data = {
						is_deleted: true,
						strategic_objective_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteObjectiveMapping(data)
					break;
				case 'assets':
					data = {
						is_deleted: true,
						asset_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteAssetsMapping(data)
					break;
				case 'focus-area':
					data = {
						is_deleted: true,
						focus_area_ids: deleteId
					}
					deleteData = this._bcmRiskMappingService.deleteFocusArea(data)
					break;
			}

			deleteData.subscribe(resp => {
				this.getRiskMapping()
				this._utilityService.detectChanges(this._cdr);

				this.clearDeleteObject();

			});
		}
		else {
			this.clearDeleteObject();
		}
		setTimeout(() => {
			$(this.deletePopup.nativeElement).modal('hide');
		}, 250);

	}


	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	ngOnDestroy() {
		NoDataItemStore.unsetNoDataItems();
		this.deleteEventSubscription.unsubscribe();
		this.issueSelectSubscription.unsubscribe();
		this.projectSelectSubscription.unsubscribe();
		this.productSelectSubscription.unsubscribe();
		this.locationSelectSubscription.unsubscribe();
		this.customerSelectSubscription.unsubscribe();
		this.controlSelectSubscription.unsubscribe();
		this.subscription.unsubscribe();
		this.serviceSelectSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.focusAreaSelectSubscription.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
		this.assetsSelectSubscription.unsubscribe()
		this.objectiveSelectSubscription.unsubscribe();
		if (this.reactionDisposer) this.reactionDisposer();
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		SubMenuItemStore.makeEmpty();

	}

}
