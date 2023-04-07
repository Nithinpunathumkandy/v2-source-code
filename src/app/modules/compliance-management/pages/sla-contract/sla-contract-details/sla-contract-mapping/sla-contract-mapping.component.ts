import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { SLAContractMappingStore } from 'src/app/stores/compliance-management/sla-contract-mapping/sla-contract-mapping-store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { SlaContractMappingService } from 'src/app/core/services/compliance-management/sla-contract-mapping/sla-contract-mapping.service';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;
@Component({
  selector: 'app-sla-contract-mapping',
  templateUrl: './sla-contract-mapping.component.html',
  styleUrls: ['./sla-contract-mapping.component.scss']
})
export class SlaContractMappingComponent implements OnInit, OnDestroy {
  @ViewChild('riskFormModal') riskFormModal: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('findingFormModal') findingFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MappingStore = MappingStore;
  ProcessStore = ProcessStore;
  IssueListStore = IssueListStore;
  AuditFindingsStore = AuditFindingsStore
  SLAContractMappingStore = SLAContractMappingStore;
  OrganizationModulesStore = OrganizationModulesStore;

  reactionDisposer: IReactionDisposer;
  riskModalTitle = 'sla_contract_risk_modal_message';
  issuesModalTitle = 'sla_contract_issues_modal_message';
  findingsModalTitle = 'sla_contract_finding_modal_message';
  processMappingTitle = 'sla_contract_process_modal_message'

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  modalObject = {
    component: 'sla_contract',
  }

  selectedSection = 'issue';
  issues = [];
  processes = [];
  selectedTab: any = null;

  private id: number

  riskSelectSubscription: Subscription
  deleteEventSubscription: Subscription
  idleTimeoutSubscription: Subscription
  issueSelectSubscription: Subscription
  findingSelectSubscription: Subscription
  processSelectSubscription: Subscription
  networkFailureSubscription: Subscription

  constructor(
    private _route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _slaContractMappingService: SlaContractMappingService,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true
    // this._route.params.subscribe(params => {
    //   this.id = params.id;      
    //   SLAContractStore.sla_contract_id = this.id      
    //   this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
    // });       
    this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id) 
    this.checkForInitialTab();
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/compliance-management/sla-and-contracts' }

    ]);

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })

    this.processSelectSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })

    this.riskSelectSubscription = this._eventEmitterService.riskSelect.subscribe(item => {
      this.closeRisks();
    });

    this.findingSelectSubscription = this._eventEmitterService.findingItemAddModalControl.subscribe(item => {
      this.closeFindings();
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

  checkForInitialTab() {
    if (OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21901)) {
      this.selectedTab = 'issue_tab';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(600,12801)) {
      this.selectedTab = 'processes_tab';
    }
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(1000,15101)) {
      this.selectedTab = 'audit_finding';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,24401)){
      this.selectedTab = 'risk';
    }
    this._utilityService.detectChanges(this._cdr);
  }


  switchTab(tab) {
    this.selectedTab = tab;
    this._utilityService.detectChanges(this._cdr);
  }

  getSLAContractMappingDetails(id) {
    this._slaContractMappingService.getContractMapping(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.setValues(res);
    })
  }

  changeZIndex() {
    if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.issueFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.findingFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.findingFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'auto');
    }
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

  setValues(MRMMapping) {
    //SLAContractMappingStore.mappingItemList.controls=[]
    //SLAContractMappingStore.mappingItemList.products=[]
    //SLAContractMappingStore.mappingItemList.Strategic_objectives=[]
    // if(SLAContractMappingStore.mappingItemList.loaded){
    let processItem = MRMMapping.processes;
    let issueItem = MRMMapping.organization_issues;
    // this.risk=MRMMapping.risks;

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
    switch (type) {
      case 'issue':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_sla_contract_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        break;
      case 'process':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_sla_contract_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
        break;
      case 'audit_finding':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_sla_contract_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_audit_finding" });
        break;
      case 'risk':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_sla_contract_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_risks" });
        break;
    }
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'issue': this.selectIssues(); break;
      case 'risk': this.selectRisks(); break;
      case 'audit_finding': this.selectAuditFindings(); break;
    }
  }

  selectIssues() {
    IssueListStore.saveSelected = false;
    IssueListStore.selectedIssuesList = SLAContractMappingStore.mappingItemList.organization_issues;
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProcesses() {
    ProcessStore.saveSelected = false;
    ProcessStore.selectedProcessesList = SLAContractMappingStore.mappingItemList.processes;
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    // $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  selectRisks() {
    MeetingPlanStore.selectedRiskList = SLAContractMappingStore.mappingItemList.risks;
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  selectAuditFindings() {
    if (SLAContractMappingStore.mappingItemList.findings) {
      AuditFindingsStore._selectedFindingItemAll = SLAContractMappingStore?.mappingItemList?.findings;
    } else {
      AuditFindingsStore._selectedFindingItemAll = [];
    }
    AuditFindingsStore.finding_select_form_modal = true;
    $(this.findingFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }


  deleteIssueMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_sla_contract_issue"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  deleteProcessMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_sla_contract_process"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteFindingsMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'audit_finding';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_sla_contract_audit_finding_mapping"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  deleteRiskMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'risk';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_sla_contract_risk_mapping"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  clearDeleteObject() {//delete
    this.deleteObject.id = null;
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;
    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);
      switch (this.deleteObject.title) {
        case 'process':
          let data1 = {
            is_deleted: true,
            process_ids: deleteId
          };
          deleteData = this._slaContractMappingService.deleteProcessMapping(data1);
          break;
        case 'issue':
          let data2 = {
            is_deleted: true,
            organization_issue_ids: deleteId
          };
          deleteData = this._slaContractMappingService.deleteIssueMapping(data2);
          break;
        case 'audit_finding':
          let data3 = {
            is_deleted: true,
            audit_finding_ids: deleteId
          };
          deleteData = this._slaContractMappingService.deleteAuditFindingMapping(data3);
          break;
        case 'risk':
          let data4 = {
            is_deleted: true,
            risk_ids: deleteId
          };
          deleteData = this._slaContractMappingService.deleteRiskMapping(data4);
          break;
      }
      deleteData.subscribe(resp => {
        this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
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

  // Close Modal to select issues
  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._slaContractMappingService.saveIssueMapping(saveData).subscribe(res => {
        this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      // this.getRiskMapping();
      IssueListStore.issue_select_form_modal = false;
      this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select processes
  closeProcesses() {
    if (ProcessStore?.saveSelected) {
      let saveData = {
        process_ids: this.getIds(ProcessStore?.selectedProcessesList)
      }
      this._slaContractMappingService.saveProcessMapping(saveData).subscribe(res => {
        this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

  }

  // Close Modal to select issues
  closeRisks() {
    if (MappingStore?.saveSelected) {
      let saveData = {
        risk_ids: this.getIds(MeetingPlanStore?.selectedRiskList)
      }
      this._slaContractMappingService.saveRiskMapping(saveData).subscribe(res => {
        this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
        MappingStore.risk_select_form_modal = false;
        $(this.riskFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
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
      this._slaContractMappingService.saveAuditFindingMapping(saveData).subscribe(res => {
        this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
        AuditFindingsStore.finding_select_form_modal = false;
        $(this.findingFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getSLAContractMappingDetails(SLAContractStore.sla_contract_id)
      AuditFindingsStore.finding_select_form_modal = false;
      $(this.findingFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  getArrayProcessed(data) {
    if (typeof data === 'object') {
      return this._helperService.getArrayProcessed(data, 'title').toString();
    }
    else {
      return data;
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // SLAContractStore.sla_contract_id = null;
    this.issueSelectSubscription.unsubscribe();
    this.processSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.riskSelectSubscription.unsubscribe()
    this.findingSelectSubscription.unsubscribe()
    SLAContractMappingStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false
  }
}
