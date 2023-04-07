import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { BpmProcessMappingService } from 'src/app/core/services/bpm/process/BpmProcessMapping/bpm-process-mapping.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { BpmProcessMappingStore } from 'src/app/stores/bpm/process/bpm-process-mapping-store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
declare var $: any;

@Component({
  selector: 'app-bpm-process-mapping',
  templateUrl: './bpm-process-mapping.component.html',
  styleUrls: ['./bpm-process-mapping.component.scss']
})
export class BpmProcessMappingComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('assetsFormModal') assetsFormModal: ElementRef;
  @ViewChild('complianceFormModal') complianceFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('incidentFormModal') incidentFormModal: ElementRef;
  @ViewChild('meetingFormModal') meetingFormModal: ElementRef;
  @ViewChild('trainingFormModal') trainingFormModal: ElementRef;
  @ViewChild('controlsFormModal') controlsFormModal: ElementRef;
  @ViewChild('kpiFormModal') kpiFormModal: ElementRef;

  OrganizationModulesStore = OrganizationModulesStore;
  NoDataItemStore = NoDataItemStore;
  SubMenuItemStore = SubMenuItemStore;

  BpmProcessMappingStore = BpmProcessMappingStore;
  BusinessProductsStore = BusinessProductsStore;
  ProcessStore = ProcessStore;
  IssueListStore = IssueListStore
  AssetRegisterStore = AssetRegisterStore;
  BusinessServiceStore = BusinessServiceStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  IncidentStore = IncidentStore;
  MeetingsStore = MeetingsStore;
  TrainingsStore = TrainingsStore
  ControlStore = ControlStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  KpisStore = KpisStore;

  reactionDisposer: IReactionDisposer;
  productModalTitle = 'compliance_risk_modal_message';
  issuesModalTitle = 'compliance_issues_modal_message';
  assetModalTitle = 'compliance_finding_modal_message';
  complianceModalTitle = 'compliance_finding_modal_message';
  incidentModalTitle = 'compliance_finding_modal_message';
  meetingModalTitle = 'compliance_process_modal_message';
  trainingModalTitle = 'compliance_process_modal_message';
  serviceModalTitle = 'compliance_process_modal_message';
  commonEmptyList = "common_nodata_title";
  kpiModalTitle='compliance_process_modal_message';

  selectedSection = 'issue';
  issues = [];
  product = [];
  asset = [];
  service = [];
  compliance = [];

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  modalObject = {
    component: 'bpm_process_map',
  }

  assetsSelectSubscription: Subscription;
  meetingSelectSubscription: Subscription;

  incidentSelectSubscription: Subscription;
  complianceSelectSubscription: Subscription;
  trainingSelectSubscription: Subscription;
  issueSelectSubscription: Subscription;
  controlSelectSubscription: Subscription;
  serviceSelectSubscription: Subscription;
  productSelectSubscription: Subscription;
  deleteEventSubscription: Subscription;
  networkFailureSubscription: Subscription;
  idleTimeoutSubscription: Subscription;
  kpiSelectSubscription: Subscription;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _bpmProcessMappingService: BpmProcessMappingService
  ) { }

  ngOnInit(): void {
    this.getBpmProcessMappingDetails(ProcessStore.process_id)
    this.checkForInitialTab();
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: '../' }]);

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })

    this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControls();
		})

    this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
      this.closeProducts();
    })

    this.incidentSelectSubscription = this._eventEmitterService.incidentMappingModal.subscribe(item => {
      this.closeIncident();
    })

    this.assetsSelectSubscription = this._eventEmitterService.assetsMappingModal.subscribe(item => {
      this.closeAssets();
    })

    this.meetingSelectSubscription = this._eventEmitterService.meetingMappingModal.subscribe(item => {
      this.closeMeeeting();
    })

    this.trainingSelectSubscription = this._eventEmitterService.TrainingMappingModal.subscribe(item => {
      this.closeTraining();
    })

    this.kpiSelectSubscription = this._eventEmitterService.KpiMappingModal.subscribe(item => {
      this.closeKpi();
    })

    this.complianceSelectSubscription = this._eventEmitterService.complianceMappingModal.subscribe(item => {
      this.closeCompliance();
    })

    this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
      this.closeService();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });

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
  }


  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'issue':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        break;
      case 'control':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
        break;
      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        break;
      case 'asset':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_assets" });
        break;
      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_services" });
        break;
      case 'compliance':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_compliance" });
        break;
      case 'incident':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_incidents" });
        break;
      case 'meeting':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_meetings" });
        break;
      case 'training':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_trainings" });
        break;
      case 'kpi':
          NoDataItemStore.setNoDataItems({ title: "common_no_data_bpm_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_kpi" });
          break;
    }
  }

  changeZIndex() {
    if ($(this.issueFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.productFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.assetsFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.serviceFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.complianceFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.incidentFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.meetingFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.trainingFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.kpiFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'overflow', 'auto');
    }
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'product': this.selectProducts(); break;
      case 'issue': this.selectIssues(); break;
      case 'asset': this.selectAssests(); break;
      case 'service': this.selectServiceMapping(); break;
      case 'compliance': this.selectComplianceMapping(); break;
      case 'incident': this.selectIncidentMapping(); break;
      case 'meeting': this.selectMeetingMapping(); break;
      case 'training': this.selectTrainingMapping(); break;
      case 'kpi': this.selectKPIMapping(); break;
      case 'control': this.selectcontrolsMapping(); break;

    }
  }

  checkForInitialTab() {
    if (OrganizationModulesStore.checkOrganizationSubModulesPermission(100, 21901)) {
      this.selectedSection = 'issue';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(100, 2901)) {
      this.selectedSection = 'product';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(3300, 54301)) {
      this.selectedSection = 'asset';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(100, 3201)) {
      this.selectedSection = 'service';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(2500, 40401)) {
      this.selectedSection = 'compliance';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(1900, 34801)) {
      this.selectedSection = 'incident';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(1600, 28101)) {
      this.selectedSection = 'meeting';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(3400, 56301)) {
      this.selectedSection = 'training';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(3400, 56301)) {
      this.selectedSection = 'control';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(3800, 73501)) {
      this.selectedSection = 'kpi';
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getArrayProcessed(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  selectIssues() {
    IssueListStore.saveSelected = false;
    IssueListStore.selectedIssuesList = BpmProcessMappingStore.mappingItemList.issues;
    IssueListStore.issue_select_form_modal = true;
    setTimeout(() => {
      $(this.issueFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectProducts() {
    BusinessProductsStore.saveSelected = false
    BusinessProductsStore.selectedProductList = BpmProcessMappingStore.mappingItemList.products;
    BusinessProductsStore.product_select_form_modal = true;
    setTimeout(() => {
      $(this.productFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectAssests() {
    AssetRegisterStore.saveSelected = false
    AssetRegisterStore.selectedAssets = BpmProcessMappingStore.mappingItemList.processAssets;
    AssetRegisterStore.assets_select_form_modal = true;
    setTimeout(() => {
      $(this.assetsFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectServiceMapping() {
    BusinessServiceStore.saveSelected = false
    BusinessServiceStore.selectedBusinessServicesList = BpmProcessMappingStore.mappingItemList.services;
    BusinessServiceStore.service_select_form_modal = true
    setTimeout(() => {
      $(this.serviceFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectComplianceMapping() {
    ComplianceRegisterStore.saveSelected = false;
    ComplianceRegisterStore.selectedCompliance = BpmProcessMappingStore.mappingItemList.compliances;
    ComplianceRegisterStore.compliance_select_form_modal = true
    setTimeout(() => {
      $(this.complianceFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectIncidentMapping() {
    IncidentStore.saveSelected = false;
    IncidentStore.selectedIincidentForMapping = BpmProcessMappingStore.mappingItemList.incidents;
    IncidentStore.incident_select_form_modal = true
    setTimeout(() => {
      $(this.incidentFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectMeetingMapping() {
    MeetingsStore.saveSelected = false;
    MeetingsStore.selectedMeetingForMapping = BpmProcessMappingStore.mappingItemList.mrm;
    MeetingsStore.meeting_select_form_modal = true
    setTimeout(() => {
      $(this.meetingFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  selectTrainingMapping() {
    TrainingsStore.saveSelected = false;
    TrainingsStore.selectedTrainingForMapping = BpmProcessMappingStore.mappingItemList.trainings;
    TrainingsStore.training_select_form_modal = true
    setTimeout(() => {
      $(this.trainingFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  selectKPIMapping()
  {
    KpisStore.saveSelected = false;
    KpisStore.selectedKpiForMapping = BpmProcessMappingStore.mappingItemList.kpis;
    KpisStore.kpi_select_form_modal = true
    setTimeout(() => {
      $(this.kpiFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  selectcontrolsMapping() {
    ControlStore.saveSelected = false;
    ControlStore.selectedControlsList = BpmProcessMappingStore.mappingItemList.controls;
    ControlStore.control_select_form_modal = true
    setTimeout(() => {
      $(this.controlsFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._bpmProcessMappingService.saveIssueMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        IssueListStore.issue_select_form_modal = false;
        // $(this.issueFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IssueListStore.issue_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.issueFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.issueFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
   
  }
  closeProducts() {
    if (BusinessProductsStore?.saveSelected) {
      let saveData = {
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      }
      this._bpmProcessMappingService.saveProductMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        BusinessProductsStore.product_select_form_modal = true;
        // $(this.productFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      BusinessProductsStore.product_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.productFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.productFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.productFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  closeAssets() {
    if (AssetRegisterStore?.saveSelected) {
      let saveData = {
        asset_ids: this.getIds(AssetRegisterStore?.selectedAssets)
      }
      this._bpmProcessMappingService.saveAssetMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        AssetRegisterStore.assets_select_form_modal = true;
        // $(this.assetsFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      AssetRegisterStore.assets_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.assetsFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.assetsFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  closeService() {
    if (BusinessServiceStore?.saveSelected) {
      let saveData = {
        service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
      }
      this._bpmProcessMappingService.saveServiceMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        BusinessServiceStore.service_select_form_modal = false;
        // $(this.serviceFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      BusinessServiceStore.service_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.serviceFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.serviceFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  closeCompliance() {
    if (ComplianceRegisterStore?.saveSelected) {
      let saveData = {
        compliance_ids: this.getIds(ComplianceRegisterStore?.selectedCompliance)
      }
      this._bpmProcessMappingService.saveComplianceMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        ComplianceRegisterStore.compliance_select_form_modal = false;
        // $(this.complianceFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      ComplianceRegisterStore.compliance_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.complianceFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.complianceFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  closeIncident() {
    if (IncidentStore?.saveSelected) {
      let saveData = {
        incident_ids: this.getIds(IncidentStore?.selectedIincidentForMapping)
      }
      this._bpmProcessMappingService.saveIncidentMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        IncidentStore.incident_select_form_modal = false;
        // $(this.incidentFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IncidentStore.incident_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.incidentFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.incidentFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  closeMeeeting() {
    if (MeetingsStore?.saveSelected) {
      let saveData = {
        meeting_ids: this.getIds(MeetingsStore?.selectedMeetingForMapping)
      }
      this._bpmProcessMappingService.saveMeetingMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        MeetingsStore.meeting_select_form_modal = false;
        // $(this.meetingFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      MeetingsStore.meeting_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.meetingFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.meetingFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeTraining() {
    if (TrainingsStore?.saveSelected) {
      let saveData = {
        training_ids: this.getIds(TrainingsStore?.selectedTrainingForMapping)
      }
      this._bpmProcessMappingService.saveTrainingMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        TrainingsStore.training_select_form_modal = false;
        // $(this.trainingFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      TrainingsStore.training_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.trainingFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.trainingFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeKpi() {
    if (KpisStore?.saveSelected) {
      let saveData = {
        kpi_ids: this.getIds(KpisStore?.selectedKpiForMapping)
      }
      this._bpmProcessMappingService.saveKpiMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        KpisStore.kpi_select_form_modal = false;
        // $(this.kpiFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      KpisStore.kpi_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.kpiFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.kpiFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.kpiFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeControls() {
    if (ControlStore?.saveSelected) {
      let saveData = {
        control_ids: this.getIds(ControlStore?.selectedControlsList)
      }
      this._bpmProcessMappingService.saveControlMapping(saveData).subscribe(res => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        ControlStore.control_select_form_modal = false;
        // $(this.controlsFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      ControlStore.control_select_form_modal = false;
      this.getBpmProcessMappingDetails(ProcessStore.process_id)
      // $(this.controlsFormModal.nativeElement).modal('hide');
      // this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.controlsFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.controlsFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  getBpmProcessMappingDetails(id) {
    this._bpmProcessMappingService.getBpmProcessMaping(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.setValues(res);
    })
  }

  setValues(Mapping) {
    let issueItem = Mapping.issues;
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
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }


  deleteIssueMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteProductMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteAssetMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'asset';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteServiceMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'service';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteComplianceMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'compliance';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteIncidentMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'incident';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }
  deleteMeetingMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'meeting';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteTrainingMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'training';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteControlMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'control';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  deleteKpiMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'kpi';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;
    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);
      switch (this.deleteObject.title) {
        case 'product':
          let data1 = {
            product_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteProductMapping(data1);
          break;
        case 'issue':
          let data2 = {
            issue_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteIssueMapping(data2);
          break;
        case 'asset':
          let data3 = {
            asset_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteAssetMapping(data3);
          break;
        case 'service':
          let data4 = {
            service_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteServiceMapping(data4);
          break;
        case 'compliance':
          let data5 = {
            compliance_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteComplianceMapping(data5);
          break;
        case 'incident':
          let data6 = {
            incident_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteIncidentMapping(data6);
          break;
        case 'meeting':
          let data7 = {
            meeting_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteMeetingMapping(data7);
          break;

        case 'training':
          let data8 = {
            training_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteTrainingMapping(data8);
          break;
        case 'kpi':
          let data10 = {
            kpi_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteKpiMapping(data10);
          break;
        case 'control':
          let data9 = {
            control_ids: deleteId
          };
          deleteData = this._bpmProcessMappingService.deleteControlMapping(data9);
          break;


      }
      deleteData.subscribe(resp => {
        this.getBpmProcessMappingDetails(ProcessStore.process_id)
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearDeleteObject() {//delete
    this.deleteObject.id = null;
  }
  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    // ProcessStore.unsetProcessDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.BpmProcessMappingStore.unsetBpmProcessMapingDetails();
    this.assetsSelectSubscription.unsubscribe();
    this.incidentSelectSubscription.unsubscribe();
    this.complianceSelectSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.serviceSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.meetingSelectSubscription.unsubscribe();
    this.trainingSelectSubscription.unsubscribe();
    this.kpiSelectSubscription.unsubscribe();
  }
}
