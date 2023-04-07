import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { HttpErrorResponse } from '@angular/common/http';
import { StrategyProfileMappingStore } from 'src/app/stores/strategy-management/strategy-profile-mapping-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { BpmProcessMappingStore } from 'src/app/stores/bpm/process/bpm-process-mapping-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { Subscription } from 'rxjs';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
declare var $: any;
@Component({
  selector: 'app-strategy-objectives',
  templateUrl: './strategy-objectives.component.html',
  styleUrls: ['./strategy-objectives.component.scss']
})
export class StrategyObjectivesComponent implements OnInit {
  @ViewChild('strategyAreaModal') strategyAreaModal: ElementRef;
  @ViewChild('strategyKpiModal') strategyKpiModal: ElementRef;
  @ViewChild('strategyKpiDetailsModal') strategyKpiDetailsModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('addReviewFrequency') addReviewFrequency: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('trainingFormModal') trainingFormModal: ElementRef;
  @ViewChild('assetsFormModal') assetsFormModal: ElementRef;
  @ViewChild('riskFormModal') riskFormModal: ElementRef;
  @ViewChild('findingFormModal') findingFormModal: ElementRef;
  @ViewChild('incidentFormModal') incidentFormModal: ElementRef;
  @ViewChild('projectMonitoringFormModal') projectMonitoringFormModal: ElementRef;
  @ViewChild('projectManagementFormModal') projectManagementFormModal: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ProcessStore = ProcessStore;
  MappingStore = MappingStore;
  StrategyStore = StrategyStore;
  NoDataItemStore = NoDataItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  StrategyProfileMappingStore = StrategyProfileMappingStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  IssueListStore = IssueListStore;
  TrainingsStore = TrainingsStore;
  ProjectsStore = ProjectsStore;
  IncidentStore = IncidentStore;
  AssetRegisterStore = AssetRegisterStore;
  AuditFindingsStore = AuditFindingsStore;
  BusinessServiceStore = BusinessServiceStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessProjectsStore = BusinessProjectsStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  
  selectedFocusAreaId: any;
  selectedObjectiveIndex = 0;
  reactionDisposer: IReactionDisposer;
  openReviewFrequencyPopup: boolean = false;

  risks = [];
  issues = [];
  services = [];
  products = [];
  processes = [];
  documents = [];
  audit_findings = [];
  incidents = [];
  project_monitoring = [];
  project_management = [];

  selectedTab:string = 'kpi';
  selectedSection = 'process';
  strategyEmptyList: string = 'common_nodata_title';
  chooseButtonTitle = 'Map ' + this.selectedSection + ' with strategy';

  strategyModalObject = {
    type: null,
    value: null
  };
  reviewFrequencyObject = {
    id: null,
    value: null
  };
  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };
  deleteMappingObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };
  historyObject = {
    type: null,
    value: null,
    id: null
  };
  kpiDetailsObject = {
    type: null,
    value: null
  };
  strategyKpiObject = {
    type: null,
    value: null
  };
  modalObject = {
    component: 'strategy',
  };

  confirmationEventSubscription: any;
  historyModalEventSubscription: any;
  reviewFrequencySubscriptionEvent: any;
  strategyKpiModalEventSubscription: any;
  strategyObjectiveModalEventSubscription: any;
  strategyKpiDetailsModalEventSubscription: any;

  subscription: any;
  issueSelectSubscription: any;
  assetsSelectSubscription: any;
  productSelectSubscription: any;
  serviceSelectSubscription: any;
  trainingSelectSubscription: any;
  incidentSelectSubscription: any;
  projectMonitoringSelectSubscription: any;
  projectManagementSelectSubscription: any;
  riskSelectSubscription: Subscription
  findingSelectSubscription: Subscription

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _helperService: HelperServiceService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _strategyMappingService: StrategyMappingService, private _service: StrategyService,
    private _route: Router, private _renderer2: Renderer2, private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      this.gotoSection(this.selectedSection);
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    });
    SubMenuItemStore.setSubMenuItems([

      { type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../" }
    ]);

    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if (this.deleteObjects.id != null)
        this.delete(item);
      else if (this.deleteMappingObject.id != null)
        this.deleteMapping(item)
    })
    this.strategyObjectiveModalEventSubscription = this._eventEmitterService.strategyObjectiveModal.subscribe(item => {
      if (this.strategyModalObject.type == "Edit") {
        // this.getInduObjectives(StrategyStore.objectiveId, StrategyStore.focusAreaId)
        this.getObjectiveDetails(StrategyStore.objectiveId);
      }
      this.closeStrategyModal();
      this.selectedFocusAreaId = StrategyStore.focusAreaId
      // StrategyStore.setFocusAreaId(this.selectedFocusAreaId)
      // this.getObjectives(StrategyStore.focusAreaId);
      this.getObjectiveList();
    })
    this.strategyKpiModalEventSubscription = this._eventEmitterService.strategyKpiModal.subscribe(item => {
      this.closeStrategyKpiModal();
      this.getKpiList();
    })
    this.strategyKpiDetailsModalEventSubscription = this._eventEmitterService.strategyKpiDetailsModal.subscribe(item => {
      this.closeStrategyKpiDetailsModal();
    })
    this.reviewFrequencySubscriptionEvent = this._eventEmitterService.reviewFrequencyModal.subscribe(res => {
      this.closeReviewFrequencyPopup();
    })
    this.historyModalEventSubscription = this._eventEmitterService.profileHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })
    this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
      this.closeService();
    })
    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })
    this.trainingSelectSubscription = this._eventEmitterService.TrainingMappingModal.subscribe(item => {
      this.closeTraining();
    })
    this.assetsSelectSubscription = this._eventEmitterService.assetsMappingModal.subscribe(item => {
      this.closeAssets();
    })
    this.riskSelectSubscription = this._eventEmitterService.riskSelect.subscribe(item => {
      this.closeRisks();
    });
    this.findingSelectSubscription = this._eventEmitterService.findingItemAddModalControl.subscribe(item => {
      this.closeFindings();
    })
    this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
      this.closeProducts();
    })
    this.incidentSelectSubscription = this._eventEmitterService.incidentMappingModal.subscribe(item => {
      this.closeIncident();
    })
    this.projectMonitoringSelectSubscription = this._eventEmitterService.projectMonitoringMappingModal.subscribe(item => {
      this.closeProjectMonitoring();
    })
    this.projectManagementSelectSubscription = this._eventEmitterService.projectManagementMappingModal.subscribe(item => {
      this.closeProjectManagment();
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

    StrategyStore.unsetFocusAreaId();
    StrategyStore.selectedKpiItem = 0;
    // this.getFocusArea();
    this.getObjectiveList();
    setTimeout(() => {
      if(!OrganizationModulesStore.checkOrganizationSubModulesPermission(3200,56901)) this.ChangeKPITab('mapping');
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  gotoSection(type) {
    this.selectedSection = type;
    this.chooseButtonTitle = 'Map ' + this.selectedSection + ' with strategy';
    switch (type) {
      case 'issue':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issues" });
        break;

      case 'training':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_trainings" });
        break;

      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_services" });
        break;

      case 'process':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_processes" });
        break;

      case 'asset':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_assets" });
        break;

      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        break;

      case 'risk':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_risks" });
        break;

      case 'audit_finding':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_audit_finding" });
        break;

      case 'document':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_documents" });
        break;

      case 'project_monitoring':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_project_monitoring" });
        break;

      case 'project_management':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_project_management" });
        break;

      case 'incident':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_strategy_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_incident_management" });
        break;
    }
  }

  getStrategyProfileMapping(tab?) {
    if(tab)this.selectedTab = tab;
    this._strategyMappingService.getItems().subscribe(res => {
      this.setValues(res);
      this._utilityService.detectChanges(this._cdr);
    })
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
      this._strategyMappingService.saveProcessForMapping(saveData).subscribe(res => {
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
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

  selectTraining() {
    TrainingsStore.saveSelected = false;
    TrainingsStore.selectedTrainingForMapping = StrategyProfileMappingStore.trainings;
    TrainingsStore.training_select_form_modal = true;
    $(this.trainingFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectServices() {
    BusinessServiceStore.saveSelected = false;
    BusinessServiceStore.selectedBusinessServicesList = this.services;
    BusinessServiceStore.service_select_form_modal = true;
    $(this.serviceFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectAssets() {
    AssetRegisterStore.saveSelected = false;
    // StrategyProfileMappingStore.selectedAssetList = StrategyProfileMappingStore.assets;
    AssetRegisterStore.selectedAssets = StrategyProfileMappingStore.assets;
    AssetRegisterStore.assets_select_form_modal = true;
    $(this.assetsFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProducts() {
    BusinessProductsStore.saveSelected = false;
    BusinessProductsStore.selectedProductList = StrategyProfileMappingStore.products;
    BusinessProductsStore.product_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectAuditFinding() {
    // BusinessProjectsStore.saveSelected=false;
    AuditFindingsStore._selectedFindingItemAll = this.audit_findings;
    AuditFindingsStore.finding_select_form_modal = true;
    $(this.findingFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectRisks() {
    // BusinessProjectsStore.saveSelected=false;
    MeetingPlanStore.selectedRiskList = this.risks;
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectDocuments() {
    // BusinessProjectsStore.saveSelected=false;
    StrategyProfileMappingStore.selectedDocumentList = this.documents;
    StrategyProfileMappingStore.document_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectIncident() {
    IncidentStore.saveSelected = false;
    IncidentStore.selectedIincidentForMapping = this.incidents;
    IncidentStore.incident_select_form_modal = true;
    $(this.incidentFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.incidentFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.incidentFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProjectManagement() {
    ProjectsStore.saveSelected = false;
    ProjectsStore.selectedProjectManagmentForMapping = this.project_management;
    ProjectsStore.project_management_select_form_modal = true;
    $(this.projectManagementFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.projectManagementFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProjectMonitoring() {
    ProjectMonitoringStore.saveSelected = false;
    ProjectMonitoringStore.selectedProjectMonitoringForMapping = this.project_monitoring;
    ProjectMonitoringStore.project_monitoring_select_form_modal = true;
    $(this.projectMonitoringFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select issues
  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      IssueListStore.saveSelected = false;
      this._strategyMappingService.saveIssueForMapping(saveData).subscribe(res => {

        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      IssueListStore.issue_select_form_modal = false;
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  // Close Modal to select Training
  closeTraining() {
    if (TrainingsStore.saveSelected) {
      let saveData = {
        training_ids: this.getIds(TrainingsStore.selectedTrainingForMapping)
      }
      TrainingsStore.saveSelected = false;
      this._strategyMappingService.saveTrainingMapping(saveData).subscribe(res => {
        TrainingsStore.training_select_form_modal = false;
        $(this.trainingFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      TrainingsStore.training_select_form_modal = false;
      $(this.trainingFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.trainingFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select service
  closeService() {
    if (BusinessServiceStore.saveSelected) {
      let saveData = {
        service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
      }
      BusinessServiceStore.saveSelected = false;
      this._strategyMappingService.saveServiceForMapping(saveData).subscribe(res => {
        BusinessServiceStore.service_select_form_modal = false;
        $(this.serviceFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      BusinessServiceStore.service_select_form_modal = false;
      $(this.serviceFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeAssets() {
    if (AssetRegisterStore?.saveSelected) {
      let saveData = {
        asset_ids: this.getIds(AssetRegisterStore?.selectedAssets)
      }
      this._strategyMappingService.saveAssetForMapping(saveData).subscribe(res => {
        this.getStrategyProfileMapping()
        AssetRegisterStore.assets_select_form_modal = false;
        $(this.assetsFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      AssetRegisterStore.assets_select_form_modal = false;
      this.getStrategyProfileMapping()
      $(this.assetsFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select issues
  closeRisks() {
    if (MappingStore?.saveSelected) {
      let saveData = {
        risk_ids: this.getIds(MeetingPlanStore?.selectedRiskList)
      }
      this._strategyMappingService.saveRiskForMapping(saveData).subscribe(res => {
        MappingStore.risk_select_form_modal = false;
        $(this.riskFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      MappingStore.risk_select_form_modal = false;
      $(this.riskFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeFindings() {
    if (AuditFindingsStore?.saveSelected) {
      let saveData = {
        audit_finding_ids: this.getIds(AuditFindingsStore?._selectedFindingItemAll)
      }
      this._strategyMappingService.saveAuditFindingForMapping(saveData).subscribe(res => {
        AuditFindingsStore.finding_select_form_modal = false;
        $(this.findingFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      AuditFindingsStore.finding_select_form_modal = false;
      $(this.findingFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeProducts() {
    if (BusinessProductsStore?.saveSelected) {
      let saveData = {
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      }
      BusinessProductsStore.saveSelected = false;
      this._strategyMappingService.saveProductForMapping(saveData).subscribe(res => {
        BusinessProductsStore.product_select_form_modal = false;
        $(this.productFormModal.nativeElement).modal('hide');
        this.getStrategyProfileMapping();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      BusinessProductsStore.product_select_form_modal = false;
      $(this.productFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeIncident() {
    if (IncidentStore?.saveSelected) {
      let saveData = {
        incident_ids: this.getIds(IncidentStore?.selectedIincidentForMapping)
      }
      IncidentStore.saveSelected = false;
      this._strategyMappingService.saveIncidentForMapping(saveData).subscribe(res => {
        
        this.getStrategyProfileMapping();
        IncidentStore.incident_select_form_modal = false;
        this._renderer2.setStyle(this.incidentFormModal.nativeElement,'z-index',9);
        this._renderer2.setStyle(this.incidentFormModal.nativeElement,'overflow','none');
        $(this.incidentFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      IncidentStore.incident_select_form_modal = false;
      $(this.incidentFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeProjectManagment() {
    if (ProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(ProjectsStore?.selectedProjectManagmentForMapping)
      }
      ProjectsStore.saveSelected = false;
      this._strategyMappingService.saveProjectManagementForMapping(saveData).subscribe(res => {
        
        this.getStrategyProfileMapping();
        ProjectsStore.project_management_select_form_modal = false;
        this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'z-index',9);
        this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'overflow','none');
        $(this.projectManagementFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      ProjectsStore.project_management_select_form_modal = false;
      $(this.projectManagementFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectManagementFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeProjectMonitoring() {
    if (ProjectMonitoringStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(ProjectMonitoringStore?.selectedProjectMonitoringForMapping)
      }
      ProjectMonitoringStore.saveSelected = false;
      this._strategyMappingService.saveProjectMonitoringForMapping(saveData).subscribe(res => {
        
        this.getStrategyProfileMapping();
        ProjectMonitoringStore.project_monitoring_select_form_modal = false;
        this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'z-index',9);
        this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'overflow','none');
        $(this.projectMonitoringFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getStrategyProfileMapping();
      ProjectMonitoringStore.project_monitoring_select_form_modal = false;
      $(this.projectMonitoringFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  setValues(ProfileMapping) {
    console.log('ProfileMapping',ProfileMapping)
    IssueListStore.selectedIssuesList = [];
    ProcessStore.selectedProcessesList = [];
    // BusinessProjectsStore.selectedProjectList = [];
    BusinessProductsStore.selectedProductList = [];
    // BusinessApplicationsMasterStore.selectedBusinessApplicationsList = [];
    BusinessServiceStore.selectedBusinessServicesList = [];

    StrategyProfileMappingStore.assets = [];
    StrategyProfileMappingStore.products = [];
    StrategyProfileMappingStore.trainings = [];
    this.issues = [];
    this.processes = [];
    this.services = [];
    this.audit_findings = [];
    this.risks = [];
    this.documents = [];
    this.incidents = [];
    this.project_monitoring = [];
    this.project_management = [];

    this.processes = ProfileMapping.processes;
    this.issues = ProfileMapping.issues;
    StrategyProfileMappingStore.assets = ProfileMapping.assets;
    StrategyProfileMappingStore.trainings = ProfileMapping.trainings;
    this.services = ProfileMapping.services;
    StrategyProfileMappingStore.products = ProfileMapping.products;
    this.documents = ProfileMapping.documents;
    this.risks = ProfileMapping.risks;
    this.audit_findings = ProfileMapping.audit_findings;
    this.incidents = ProfileMapping.incident_management;
    this.project_monitoring = ProfileMapping.project_monitoring;
    this.project_management = ProfileMapping.project_management;
    // for (let p of processItem) {
    //   p['process_group_title'] = p.process_group.title;
    //   p['department'] = p.department.title;
    //   // p['process_category']=p.process_category.title;
    //   this.processes.push(p);
    // }

    // for (let b of businessApplicationItem) {
    //   b['business_application_type_title'] = b.business_application_type?.language[0]?.pivot?.title;
    //   this.businessApplications.push(b);
    // }

    // for (let i of issueItem) {
    //   i['issue_categories'] = this.getArrayFormatedString('title', i.organization_issue_categories);
    //   i['departments'] = this.getArrayFormatedString('title', i.organization_issue_departments);
    //   i['issue_domains'] = this.getArrayFormatedString('title', i.organization_issue_domains);
    //   i['issue_types_list'] = [];
    //   for (let j of i.organization_issue_types) {
    //     i['issue_types_list'].push(j.title);
    //   }
    //   this.issues.push(i);
    // }

    // for (let i of projectItem) {
    //   i['project_manager_first_name'] = i.project_manager?.first_name;
    //   i['project_manager_last_name'] = i.project_manager?.last_name;
    //   i['project_manager_image_token'] = i.project_manager?.image_token;
    //   i['location_title'] = i.location?.title;
    //   AssetMappingStore.projects.push(i);
    // }


    this._utilityService.detectChanges(this._cdr);

  }

  // getObjectives(id) {
  //   this._service.objectivesList(id).subscribe(res => {
  //     this.selectObjectiveIndexChange(0, res.data[0].id, true)
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  selectKpiItem(pos, id) {
    this.selectedFocusAreaId = id
    StrategyStore.setFocusAreaId(this.selectedFocusAreaId)
    this.StrategyStore.selectedKpiItem = pos;
    // this.getObjectives(this.selectedFocusAreaId);
    this.getObjectiveList();
    this._utilityService.detectChanges(this._cdr);
  }

  selectObjectiveIndexChange(index, id, initial: boolean = false) {
    StrategyStore.induvalObjectivesLoaded = false;
    StrategyStore.setObjectiveId(id)
    if(!OrganizationModulesStore.checkOrganizationSubModulesPermission(3200,56901)) this.selectedTab = 'mapping';
    else this.selectedTab = 'kpi';
    // StrategyStore.setFocusAreaId(this.selectedFocusAreaId)
    if (this.selectedObjectiveIndex == index) {
      if (!initial) this.selectedObjectiveIndex = null;
    } else {
      this.selectedObjectiveIndex = index
    }
    this.getObjectiveDetails(id);
  }

  getKpiList() {
    this._service.getAllKpis().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  editObjective(object) {
    if (object) {
      this._service.induvalObjectives(object.id, null).subscribe(res => {
        this.strategyModalObject.value = res;
        this.strategyModalObject.type = "Edit"
        this.openStrategyPopup()
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  openStrategyModal() {
    this.strategyModalObject.type = 'Add';
    StrategyStore.remainingWeightage = 100 - this.caluculateObjectWeightage();
    this.openStrategyPopup()
    this._utilityService.detectChanges(this._cdr);

  }

  openStrategyPopup() {
    // $(this.strategyAreaModal.nativeElement).modal('show');
    this._renderer2.addClass(this.strategyAreaModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement, 'overflow', 'auto');
  }

  closeStrategyModal() {
    this.strategyModalObject.type = null;
    // $(this.strategyAreaModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.strategyAreaModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyAreaModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  editKpi(id) {
    if (id) {
      let areas
      this._service.induvalKpi(id).subscribe(res => {
        areas = res;
        this.strategyKpiObject.value = areas;
        this.strategyKpiObject.type = "Edit"
        this.openStrategyKpi();
        this._utilityService.detectChanges(this._cdr);
      })

    }
  }

  openStrategyKpiModal(objective, ind?,) {
    // StrategyStore.setFocusAreaId(focusAreaId);
    StrategyStore.setObjectiveId(objective.id)
    StrategyStore.setObjectiveStartDate(objective.start_date);
    StrategyStore.setObjectiveEndDate(objective.end_date);
    this.strategyKpiObject.type = 'Add';
    this.openStrategyKpi()
  }

  openStrategyKpi() {

    // if(ind) StrategyDemoStore.seletectedKpi = ind;
    // $(this.strategyKpiModal.nativeElement).modal('show');
    this._renderer2.addClass(this.strategyKpiModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement, 'z-index', 99999);
  }

  closeStrategyKpiModal() {
    this.strategyKpiObject.type = null;
    // $(this.strategyKpiModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.strategyKpiModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  closeStrategyKpiDetailsModal() {
    this.kpiDetailsObject.type = null;
    // $(this.strategyKpiDetailsModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.strategyKpiDetailsModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openStrategyKpiDetailsModal(id) {
    if (id) {
      this._service.induvalKpi(id).subscribe(res => {
        this.kpiDetailsObject.value = res;
        this.openStrategyKpiDetails()
      })
    }
  }

  openStrategyKpiDetails() {
    this.kpiDetailsObject.type = 'Add';
    this._renderer2.addClass(this.strategyKpiDetailsModal.nativeElement, 'show');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.strategyKpiDetailsModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
    // $(this.strategyKpiDetailsModal.nativeElement).modal('show');
  }

  deleteProfileObjectives(id) {//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'objective';
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "sm_objective_delete_confirm_msg"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');

    }, 250);
  }

  closeProfileObjectives(id) {//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'closeObjective';
    this.deleteObjects.type = 'Close';
    this.deleteObjects.subtitle = "close_confirmation_popup_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');

    }, 250);
  }

  deleteProfileKpi(id) {//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'kpi';
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "delete_confirmation_popup_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');

    }, 250);
  }

  closeProfileKpi(id) {//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'closeKPI';
    this.deleteObjects.type = 'Close';
    this.deleteObjects.subtitle = "close_confirmation_popup_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');

    }, 250);
  }

  activateKPI(id: number) {
    event.stopPropagation();
    this.deleteObjects.type = 'Activate';
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'activateKPI';
    // this.deleteObjects.model = 'activate'
    this.deleteObjects.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passiveKPI(id: number) {
    // event.stopPropagation();
    this.deleteObjects.type = 'Passivate';
    this.deleteObjects.id = id;
    // this.deleteObjects.model = 'passivate'
    this.deleteObjects.title = 'passivateKPI';
    this.deleteObjects.subtitle = 'common_passive_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateProfileObjectives(id: number) {
    event.stopPropagation();
    this.deleteObjects.type = 'Activate';
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'activateObjectives';
    // this.deleteObjects.model = 'activate'
    this.deleteObjects.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passivateProfileObjectives(id: number) {
    // event.stopPropagation();
    this.deleteObjects.type = 'Passivate';
    this.deleteObjects.id = id;
    // this.deleteObjects.model = 'passivate'
    this.deleteObjects.title = 'passivateObjectives';
    this.deleteObjects.subtitle = 'common_passive_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;
    let dataObject = {
      comment: null
    }
    if (status && this.deleteObjects.id) {
      switch (this.deleteObjects.title) {
        case 'objective':

          deleteData = this._service.deleteObjective(this.deleteObjects.id);
          break;
        case 'kpi':
          deleteData = this._service.deleteKpi(this.deleteObjects.id);
          break;
        case 'closeObjective':
          deleteData = this._service.closeObjective(this.deleteObjects.id);
          break;
        case 'closeKPI':
          deleteData = this._service.closeKpi(this.deleteObjects.id);
          break;
        case 'activateKPI':
          deleteData = this._service.activateKpi(this.deleteObjects.id, dataObject);
          break;
        case 'passivateKPI':
          deleteData = this._service.passivateKpi(this.deleteObjects.id, dataObject);
          break;
        case 'activateObjectives':
          deleteData = this._service.activateObjectives(this.deleteObjects.id, dataObject);
          break;
        case 'passivateObjectives':
          deleteData = this._service.passivateObjectives(this.deleteObjects.id, dataObject);
          break;
      }

      deleteData.subscribe(resp => {
        if (this.deleteObjects.title == 'objective' || this.deleteObjects.title == 'closeObjective' || this.deleteObjects.title == 'activateObjectives' || this.deleteObjects.title == 'passivateObjectives') {
          // this.getObjectives(this.selectedFocusAreaId)
          this.getObjectiveList();
        } else if (this.deleteObjects.title == 'kpi' || this.deleteObjects.title == 'closeKPI' || this.deleteObjects.title == 'activateKPI' || this.deleteObjects.title == 'passivateKPI') {
          this.getKpiList()
        }
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
      }, (err: HttpErrorResponse) => {
        if (err.status == 423) {
          this._utilityService.showErrorMessage("error", err.error.message)
        }
      });
    }
    else {
      this.clearDeleteObject();
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }


  }

  clearDeleteObject() {//delete
    this.deleteObjects.id = null;
  }

  // History Modal
  openHistoryModal(id, item) {
    // this.historyPageChange(1);
    this.historyObject.type = item;
    this.historyObject.id = id;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    this.historyObject.type = null;
    this.historyObject.id = null;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    StrategyStore.unsetHistory();
  }

  caluculateObjectWeightage() {
    let sum = 0;
    if (StrategyStore.objectives?.length > 0) {
      for (let i of StrategyStore.objectives) {
        sum = sum + parseInt(i.weightage);
      }
    }
    return sum;
  }

  reviewFrequencyPopupOpen(id) {
    this.openReviewFrequencyPopup = true;
    this.reviewFrequencyObject.id = id;
    this._renderer2.addClass(this.addReviewFrequency.nativeElement, 'show');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeReviewFrequencyPopup() {
    this.openReviewFrequencyPopup = false;
    this._renderer2.removeClass(this.addReviewFrequency.nativeElement, 'show');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addReviewFrequency.nativeElement, 'display', 'none');
  }

  changeZIndex() {
    if ($(this.issueFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
    }
    // else if($(this.businessApplicationFormModal.nativeElement).hasClass('show')){
    //   this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement,'z-index',999999);
    //   this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement,'overflow','auto');
    // }
    else if ($(this.serviceFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'overflow', 'auto');
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
    else if($(this.incidentFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.incidentFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.incidentFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.projectMonitoringFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.projectMonitoringFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.projectManagementFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.projectManagementFormModal.nativeElement,'overflow','auto');
    }
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'issue': this.selectIssues(); break;
      case 'asset': this.selectAssets(); break;
      case 'service': this.selectServices(); break;
      case 'training': this.selectTraining(); break;
      case 'product': this.selectProducts(); break;
      // case 'document': this.selectServices(); break;
      case 'audit_finding': this.selectAuditFinding(); break;
      case 'risk': this.selectRisks(); break;
      case 'incident': this.selectIncident(); break;
      case 'project_monitoring': this.selectProjectMonitoring(); break;
      case 'project_management': this.selectProjectManagement(); break;
    }
  }

  deleteProcessMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'process';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearDeleteMappingObject() {
    this.deleteMappingObject.id = null;
  }

  deleteIssueMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'issue';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteServiceMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'service';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteTrainingMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'training';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteAssetMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'asset';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProductMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'product';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteDocumentMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'document';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteRiskMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'risk';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteAuditFindingMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'audit_finding';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteIncidentMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'incident';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProjectManagementMapping(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'project_management';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  deleteProjectMonitoring(id) {
    this.deleteMappingObject.id = id;
    this.deleteMappingObject.title = 'project_monitoring';
    this.deleteMappingObject.type = '';
    this.deleteMappingObject.subtitle = "detach_item_confirmation_strategy"

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteMapping(status) {
    let deleteId = [];
    let deleteData;
    if (status && this.deleteMappingObject.id) {
      deleteId.push(this.deleteMappingObject.id);
      let data = null;
      switch (this.deleteMappingObject.title) {

        case 'process':
          data = {
            // is_deleted: true,
            process_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteProcessMapping(data)
          break;
        case 'issue':
          data = {
            // is_deleted: true,
            issue_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteIssueMapping(data)
          break;
        case 'training':
          data = {
            // is_deleted: true,
            training_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteTrainingMapping(data)
          break;
        case 'service':
          data = {
            // is_deleted: true,
            service_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteServiceMapping(data)
          break;
        case 'asset':
          data = {
            // is_deleted: true,
            asset_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteAssetMapping(data)
          break;
        case 'product':
          data = {
            // is_deleted: true,
            product_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteProductMapping(data)
          break;
        case 'document':
          data = {
            // is_deleted: true,
            document_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteDocumentMapping(data)
          break;
        case 'risk':
          data = {
            // is_deleted: true,
            risk_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteRiskMapping(data)
          break;
        case 'audit_finding':
          data = {
            // is_deleted: true,
            audit_finding_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteAuditFindingMapping(data)
          break;
        case 'incident':
          data = {
            // is_deleted: true,
            incident_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteIncidentMapping(data)
          break;
        case 'project_management':
          data = {
            // is_deleted: true,
            project_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteIProjectManagementMapping(data)
          break;
        case 'project_monitoring':
          data = {
            // is_deleted: true,
            project_ids: deleteId
          }
          deleteData = this._strategyMappingService.deleteProjectMonitoringMapping(data)
          break;
      }

      deleteData.subscribe(resp => {
        this.getStrategyProfileMapping()
        this._utilityService.detectChanges(this._cdr);

        this.clearDeleteMappingObject();

      });
    }
    else {
      this.clearDeleteMappingObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

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

  getArrayProcessed(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  // *------ new changes start------*

  getObjectiveList(){
    this._service.getObjectiveList('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      if(res.data?.length > 0)this.selectObjectiveIndexChange(0, res.data[0].id, true)
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  getObjectiveDetails(id){
    StrategyStore.setObjectiveId(id)
    this._service.induvalObjectives(id, null).subscribe(res => { this._utilityService.detectChanges(this._cdr) })
    this.getKpiList();
    this.getStrategyProfileMapping()
  }
  // *------ new changes end------*

  ChangeKPITab(item){
    this.selectedTab = item;
  }

  getArrayFormatedString(type, items) {
    items.forEach((element, index) => {
      element['title'] = element['focus_area'].title;
    });
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();

    this.subscription.unsubscribe();
    this.riskSelectSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.assetsSelectSubscription.unsubscribe();
    this.findingSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.serviceSelectSubscription.unsubscribe();
    this.trainingSelectSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.incidentSelectSubscription.unsubscribe();
    this.historyModalEventSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    this.reviewFrequencySubscriptionEvent.unsubscribe();
    this.strategyKpiModalEventSubscription.unsubscribe();
    this.projectMonitoringSelectSubscription.unsubscribe();
    this.projectManagementSelectSubscription.unsubscribe();
    this.strategyObjectiveModalEventSubscription.unsubscribe();
    this.strategyKpiDetailsModalEventSubscription.unsubscribe();
    
    StrategyStore.objectivesLoaded = false;
    StrategyStore.objectives
  }
}
