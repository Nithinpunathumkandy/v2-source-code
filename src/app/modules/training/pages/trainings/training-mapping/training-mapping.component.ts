import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
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
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { TrainingMappingStore } from 'src/app/stores/training/trainings/training-mapping';
import { TrainingMappingService } from 'src/app/core/services/training/trainings/training-mapping.service';
declare var $: any;

@Component({
  selector: 'app-training-mapping',
  templateUrl: './training-mapping.component.html',
  styleUrls: ['./training-mapping.component.scss']
})
export class TrainingMappingComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('assetsFormModal') assetsFormModal: ElementRef;
  @ViewChild('complianceFormModal') complianceFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('incidentFormModal') incidentFormModal: ElementRef;
  @ViewChild('meetingFormModal') meetingFormModal: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  TrainingMappingStore = TrainingMappingStore;
  TrainingsStore = TrainingsStore;
  BusinessProductsStore = BusinessProductsStore;
  IssueListStore = IssueListStore
  AssetRegisterStore = AssetRegisterStore;
  BusinessServiceStore = BusinessServiceStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  IncidentStore = IncidentStore;
  MeetingsStore = MeetingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  Id: number;

  productModalTitle = 'compliance_risk_modal_message';
  issuesModalTitle = 'compliance_issues_modal_message';
  assetModalTitle = 'compliance_finding_modal_message';
  complianceModalTitle = 'compliance_finding_modal_message';
  incidentModalTitle = 'compliance_finding_modal_message';
  meetingModalTitle = 'compliance_process_modal_message';
  trainingModalTitle = 'compliance_process_modal_message';
  serviceModalTitle = 'compliance_process_modal_message';
  commonEmptyList = "common_nodata_title";

  OrganizationModulesStore = OrganizationModulesStore;
  NoDataItemStore = NoDataItemStore;
  SubMenuItemStore = SubMenuItemStore;


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
    component: 'training',
  }

  assetsSelectSubscription: Subscription;
  meetingSelectSubscription: Subscription;
  incidentSelectSubscription: Subscription;
  complianceSelectSubscription: Subscription;
  issueSelectSubscription: Subscription;
  serviceSelectSubscription: Subscription;
  productSelectSubscription: Subscription;
  deleteEventSubscription: Subscription;
  networkFailureSubscription: Subscription;
  idleTimeoutSubscription: Subscription;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _trainingMappingService: TrainingMappingService,
    private _route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      this.Id = params.id;
      TrainingsStore.training_id = this.Id;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
    });

    this.checkForInitialTab();
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: "/trainings/training" }]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
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
      if (!status) { this.changeZIndex(); }
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
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        break;
      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        break;
      case 'asset':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_assets" });
        break;
      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_services" });
        break;
      case 'compliance':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_compliance" });
        break;
      case 'incident':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_incidents" });
        break;
      case 'meeting':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_meetings" });
        break;
      case 'training':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_training_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_trainings" });
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
    IssueListStore.selectedIssuesList = TrainingMappingStore.mappingItemList.issues;
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectProducts() {
    BusinessProductsStore.saveSelected = false
    BusinessProductsStore.selectedProductList = TrainingMappingStore.mappingItemList.products;
    BusinessProductsStore.product_select_form_modal = true;
    //ProjectsStore.issue_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectAssests() {
    AssetRegisterStore.saveSelected = false
    AssetRegisterStore.selectedAssets = TrainingMappingStore.mappingItemList.assets;
    AssetRegisterStore.assets_select_form_modal = true;
    $(this.assetsFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectServiceMapping() {
    BusinessServiceStore.saveSelected = false
    BusinessServiceStore.selectedBusinessServicesList = TrainingMappingStore.mappingItemList.services;
    BusinessServiceStore.service_select_form_modal = true
    $(this.serviceFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectComplianceMapping() {
    ComplianceRegisterStore.saveSelected = false;
    ComplianceRegisterStore.selectedCompliance = TrainingMappingStore.mappingItemList.compliances;
    ComplianceRegisterStore.compliance_select_form_modal = true
    $(this.complianceFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectIncidentMapping() {
    IncidentStore.saveSelected = false;
    IncidentStore.selectedIincidentForMapping = TrainingMappingStore.mappingItemList.incidents;
    IncidentStore.incident_select_form_modal = true
    $(this.incidentFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectMeetingMapping() {
    MeetingsStore.saveSelected = false;
    MeetingsStore.selectedMeetingForMapping = TrainingMappingStore.mappingItemList.meetings;
    MeetingsStore.meeting_select_form_modal = true
    $(this.meetingFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._trainingMappingService.saveIssueMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IssueListStore.issue_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeProducts() {
    if (BusinessProductsStore?.saveSelected) {
      let saveData = {
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      }
      this._trainingMappingService.saveProductMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        BusinessProductsStore.product_select_form_modal = true;
        $(this.productFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      BusinessProductsStore.product_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.productFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeAssets() {
    if (AssetRegisterStore?.saveSelected) {
      let saveData = {
        asset_ids: this.getIds(AssetRegisterStore?.selectedAssets)
      }
      this._trainingMappingService.saveAssetMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        AssetRegisterStore.assets_select_form_modal = true;
        $(this.assetsFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      AssetRegisterStore.assets_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.assetsFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.assetsFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeService() {
    if (BusinessServiceStore?.saveSelected) {
      let saveData = {
        service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
      }
      this._trainingMappingService.saveServiceMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        BusinessServiceStore.service_select_form_modal = false;
        $(this.serviceFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      BusinessServiceStore.service_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.serviceFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeCompliance() {
    if (ComplianceRegisterStore?.saveSelected) {
      let saveData = {
        compliance_ids: this.getIds(ComplianceRegisterStore?.selectedCompliance)
      }
      this._trainingMappingService.saveComplianceMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        ComplianceRegisterStore.compliance_select_form_modal = false;
        $(this.complianceFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      ComplianceRegisterStore.compliance_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.complianceFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.complianceFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeIncident() {
    if (IncidentStore?.saveSelected) {
      let saveData = {
        incident_ids: this.getIds(IncidentStore?.selectedIincidentForMapping)
      }
      this._trainingMappingService.saveIncidentMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        IncidentStore.incident_select_form_modal = false;
        $(this.incidentFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IncidentStore.incident_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.incidentFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.incidentFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeMeeeting() {
    if (MeetingsStore?.saveSelected) {
      let saveData = {
        meeting_ids: this.getIds(MeetingsStore?.selectedMeetingForMapping)
      }
      this._trainingMappingService.saveMeetingMapping(saveData).subscribe(res => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
        MeetingsStore.meeting_select_form_modal = false;
        $(this.meetingFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      MeetingsStore.meeting_select_form_modal = false;
      this.getTrainingMappingDetails(TrainingsStore.training_id)
      $(this.meetingFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.meetingFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  getTrainingMappingDetails(id) {
    this._trainingMappingService.getTrainingMaping(id).subscribe(res => {
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
    }, 250);
  }
  deleteProductMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteAssetMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'asset';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteServiceMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'service';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteComplianceMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'compliance';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteIncidentMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'incident';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "common_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
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
          deleteData = this._trainingMappingService.deleteProductMapping(data1);
          break;
        case 'issue':
          let data2 = {
            issue_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteIssueMapping(data2);
          break;
        case 'asset':
          let data3 = {
            asset_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteAssetMapping(data3);
          break;
        case 'service':
          let data4 = {
            service_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteServiceMapping(data4);
          break;
        case 'compliance':
          let data5 = {
            compliance_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteComplianceMapping(data5);
          break;
        case 'incident':
          let data6 = {
            incident_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteIncidentMapping(data6);
          break;
        case 'meeting':
          let data7 = {
            meeting_ids: deleteId
          };
          deleteData = this._trainingMappingService.deleteMeetingMapping(data7);
          break;

      }
      deleteData.subscribe(resp => {
        this.getTrainingMappingDetails(TrainingsStore.training_id)
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    TrainingsStore.training_id = null;
    if (this.reactionDisposer) this.reactionDisposer();
    this.TrainingMappingStore.unsetTrainingMappingDetails();
    this.assetsSelectSubscription.unsubscribe();
    this.incidentSelectSubscription.unsubscribe();
    this.complianceSelectSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.serviceSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();

  }

}