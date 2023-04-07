import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { ComplianceMappingStore } from 'src/app/stores/compliance-management/compliance-mapping/compliance-mapping-store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { ComplianceMappingService } from 'src/app/core/services/compliance-management/compliance-mapping/compliance-mapping.service';

declare var $: any;

@Component({
  selector: 'app-compliance-register-mapping',
  templateUrl: './compliance-register-mapping.component.html',
  styleUrls: ['./compliance-register-mapping.component.scss']
})
export class ComplianceRegisterMappingComponent implements OnInit {

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
  ComplianceMappingStore = ComplianceMappingStore;
  OrganizationModulesStore = OrganizationModulesStore;

  reactionDisposer: IReactionDisposer;
  riskModalTitle = 'compliance_risk_modal_message';  
  issuesModalTitle = 'compliance_issues_modal_message';
  findingsModalTitle = 'compliance_finding_modal_message';
  processMappingTitle = 'compliance_process_modal_message'    

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  modalObject = {
    component: 'compliance_register',
  }

  selectedSection = 'issue';
  issues = [];
  processes = [];
  selectedTab: any = null;

  riskSelectSubscription: Subscription
  deleteEventSubscription: Subscription
  idleTimeoutSubscription: Subscription
  issueSelectSubscription: Subscription
  findingSelectSubscription: Subscription
  processSelectSubscription: Subscription
  networkFailureSubscription: Subscription

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _complianceMappingService: ComplianceMappingService,
  ) { }

  ngOnInit(): void {
    this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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
      { type: 'close', path: '../' }

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

  getComplianceMappingDetails(id) {
    this._complianceMappingService.getComplianceMaping(id).subscribe(res => {
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

  getArrayProcessed(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  // checkRiskCategory(department) {
  //   if (typeof department === 'object') {
  //     return this._helperService.getArrayProcessed(department, 'title').toString();
  //   }
  //   else {
  //     return department;
  //   }
  // }

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
    //ComplianceMappingStore.mappingItemList.controls=[]
    //ComplianceMappingStore.mappingItemList.products=[]
    //ComplianceMappingStore.mappingItemList.Strategic_objectives=[]
    // if(ComplianceMappingStore.mappingItemList.loaded){
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
        NoDataItemStore.setNoDataItems({ title: "common_no_data_compliance_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        break;
      case 'process':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_compliance_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
        break;
      case 'audit_finding':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_compliance_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_audit_finding" });
        break;
      case 'risk':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_compliance_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_risks" });
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
    IssueListStore.selectedIssuesList = ComplianceMappingStore.mappingItemList.organization_issues;
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProcesses() {
    ProcessStore.saveSelected = false;
    ProcessStore.selectedProcessesList = ComplianceMappingStore.mappingItemList.processes;
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    // $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  selectRisks() {
    MeetingPlanStore.selectedRiskList = ComplianceMappingStore.mappingItemList.risks;
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  selectAuditFindings() {
    if (ComplianceMappingStore.mappingItemList.findings) {
      AuditFindingsStore._selectedFindingItemAll = ComplianceMappingStore?.mappingItemList?.findings;
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
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "delete_compliance_issue"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  deleteProcessMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "delete_compliance_process"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }
  deleteFindingsMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'audit_finding';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "delete_compliance_audit_finding_mapping"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  deleteRiskMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'risk';
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.subtitle = "delete_compliance_risk_mapping"
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
          deleteData = this._complianceMappingService.deleteProcessMapping(data1);
          break;
        case 'issue':
          let data2 = {
            is_deleted: true,
            organization_issue_ids: deleteId
          };
          deleteData = this._complianceMappingService.deleteIssueMapping(data2);
          break;
        case 'audit_finding':
          let data3 = {
            is_deleted: true,
            audit_finding_ids: deleteId
          };
          deleteData = this._complianceMappingService.deleteAuditFindingMapping(data3);
          break;
        case 'risk':
          let data4 = {
            is_deleted: true,
            risk_ids: deleteId
          };
          deleteData = this._complianceMappingService.deleteRiskMapping(data4);
          break;
      }
      deleteData.subscribe(resp => {
        this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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
      this._complianceMappingService.saveIssueMapping(saveData).subscribe(res => {
        this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      // this.getRiskMapping();
      IssueListStore.issue_select_form_modal = false;
      this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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
      this._complianceMappingService.saveProcessMapping(saveData).subscribe(res => {
        this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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
      this._complianceMappingService.saveRiskMapping(saveData).subscribe(res => {
        this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
        MappingStore.risk_select_form_modal = false;
        $(this.riskFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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
      this._complianceMappingService.saveAuditFindingMapping(saveData).subscribe(res => {
        this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
        AuditFindingsStore.finding_select_form_modal = false;
        $(this.findingFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
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

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.issueSelectSubscription.unsubscribe();
    this.processSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.riskSelectSubscription.unsubscribe()
    this.findingSelectSubscription.unsubscribe()
    ComplianceMappingStore.searchText = null;
    SubMenuItemStore.searchText = '';
  }
}