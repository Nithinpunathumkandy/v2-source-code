import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { MappingService } from 'src/app/core/services/mrm/mapping/mapping.service';

import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { ElementRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-meeting-mapping',
  templateUrl: './meeting-mapping.component.html',
  styleUrls: ['./meeting-mapping.component.scss']
})
export class MeetingMappingComponent implements OnInit {
  @ViewChild('riskFormModal') riskFormModal: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('findingFormModal') findingFormModal: ElementRef;
  @ViewChild('nonConformityFormModal') nonConformityFormModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  selectedSection = 'issue';
  AppStore = AppStore;
  AuthStore = AuthStore;
  ProcessStore = ProcessStore;
  MappingStore = MappingStore;
  IssueListStore = IssueListStore;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationModulesStore = OrganizationModulesStore;
  
  ControlStore = ControlStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessCustomersStore = BusinessCustomersStore;
  StrategicObjectivesMasterStore = StrategicObjectivesMasterStore;
  AuditFindingsStore = AuditFindingsStore;
  FindingsStore = FindingsStore;

  
  riskSelectSubscription:any;
  deleteEventSubscription:any;
  issueSelectSubscription:any;
  controlSelectSubscription:any;
  projectSelectSubscription:any;
  productSelectSubscription:any;
  customerSelectSubscription:any;
  ProcessesSelectSubscription:any;
  objectiveSelectSubscription:any;
  findingSelectSubscription:any;
  nonConformitySelectSubscription:any;

  risk=[];
  issues=[];
  controls=[];
  projects=[];
  products=[];
  processes=[];
  customers=[];
  strategic_objectives=[];
  findings=[];
  nonConformity=[];

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  modalObject = {
    component : 'meeting_plan',
  }

  openModal=false;

  constructor(
    private _renderer2:Renderer2,
    private _router:Router,
    private _cdr:ChangeDetectorRef,
    private _mappingService:MappingService,
    private _utilityService:UtilityService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"meeting_plans",
      path:`/mrm/meeting-plans`
    });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if(MeetingPlanStore.meetingPlanId)
      {
        this.getMapping();
      }
      else{
        this._router.navigateByUrl('mrm/meetings');
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      SubMenuItemStore.unSetClickedSubMenuItem();
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    });

    this.ProcessesSelectSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    });

    this.riskSelectSubscription = this._eventEmitterService.riskSelect.subscribe(item => {
      this.closeRisks();
    });

    this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
			this.closeControls();
		})

    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
			this.closeProjects();
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
			this.closeFindings();
		})

    
    this.nonConformitySelectSubscription = this._eventEmitterService.NonConformityItemAddModalControl.subscribe(item => {
			this.closeNonConformity();
		})

    this.gotoSection(this.selectedSection);
  }

  getMapping(){
    this._mappingService.getItems().subscribe(res=>{
      this.setValues(res);
      if(res?.meeting_plan_status?.id==4){
        this.gotoSection(this.selectedSection);
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setValues(MRMMapping){
    // if(RiskMappingStore.loaded){
      let processItem=MRMMapping.processes;
      let issueItem=MRMMapping.organization_issues;
      this.risk=MRMMapping.risks;
      this.controls=MRMMapping.controls;
      this.projects=MRMMapping.projects;
      this.products=MRMMapping.products;
      this.customers=MRMMapping.customers;
      this.strategic_objectives=MRMMapping.strategic_objectives;
      this.findings=MRMMapping.findings;
      this.nonConformity=MRMMapping.noc_findings;

      for (let p of processItem) {
        p['process_group_title'] = p.process_group.title;
        p['department']=p.department.title;
        // p['process_category']=p.process_category.title;
  
        this.processes.push(p);
      }

      for(let i of issueItem){
          i['issue_categories']=this.getArrayFormatedString('title',i.organization_issue_categories);
          i['departments'] = this.getArrayFormatedString('title',i.organization_issue_departments);
          i['issue_domains']=this.getArrayFormatedString('title',i.organization_issue_domains);
          i['issue_types_list'] = [];
          for(let j of i.organization_issue_types){
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

  
  findingCategories(row){
    return row?.finding_category?.title? row?.finding_category?.title:AppStore.noContentText;
  }

  openSelectPopup(){
    if(this.selectedSection=='process'){
      this.selectProcesses();
    }else if(this.selectedSection=='issue'){
      this.selectIssues();
    }else if(this.selectedSection=='risk'){
      this.selectRisk();
    }else if(this.selectedSection=='control'){
      this.selectControls();
    }else if(this.selectedSection=='project'){
      this.selectProjects();
    }else if(this.selectedSection=='product'){
      this.selectProducts();
    }else if(this.selectedSection=='customer'){
      this.selectCustomers();
    }else if(this.selectedSection=='objective'){
      this.selectObjectives();
    }else if(this.selectedSection=='audit_finding'){
      this.selectFindings();
    }else if(this.selectedSection=='non-conformity'){
      this.selectNonConformityFindings();
    }
  }

  gotoSection(type) {
    
    if (type == 'issue') {
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_issue",subtitle:"mapped_nodata_sutitle_issue",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'ISSUE_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_issue",subtitle:"mapped_nodata_sutitle_issue",buttonText:"add_issue"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_issue",subtitle:"mapped_nodata_sutitle_issue",buttonText:null});
      }
    
    } else if (type == 'process') {
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"mapped_process_subtitle",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'PROCESS_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"mapped_process_subtitle",buttonText:"add_process"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"mapped_process_subtitle",buttonText:null});
      }
    
    } else if(type == 'risk'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_risk",subtitle:"mapped_subtitle_risk",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'RISK_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_risk",subtitle:"mapped_subtitle_risk",buttonText:"add_risk"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_risk",subtitle:"mapped_subtitle_risk",buttonText:null});
      }
    
    } else if(type == 'control'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_control",subtitle:"mapped_subtitle_control",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'CONTROL_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_control",subtitle:"mapped_subtitle_control",buttonText:"add_control"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_control",subtitle:"mapped_subtitle_control",buttonText:null});

      }
    
    } else if(type == 'project'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_project",subtitle:"mapped_subtitle_project",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'PROJECT_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_project",subtitle:"mapped_subtitle_project",buttonText:"add_project"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_project",subtitle:"mapped_subtitle_project",buttonText:null});
      }
    
    } else if(type == 'product'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_product",subtitle:"mapped_subtitle_product",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'PRODUCT_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_product",subtitle:"mapped_subtitle_product",buttonText:"add_product"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_product",subtitle:"mapped_subtitle_product",buttonText:null});
      }
    
    } else if(type == 'customer'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_customer",subtitle:"mapped_subtitle_customer",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'CUSTOMER_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_customer",subtitle:"mapped_subtitle_customer",buttonText:"add_customer"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_customer",subtitle:"mapped_subtitle_customer",buttonText:null});
      }
    
    } else if(type == 'objective'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_objective",subtitle:"mapped_subtitle_objective",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'STRATEGIC_OBJECTIVE_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_objective",subtitle:"mapped_subtitle_objective",buttonText:"add_objective"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_objective",subtitle:"mapped_subtitle_objective",buttonText:null});
      }
    
    } else if(type == 'audit_finding'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_findings",subtitle:"mapped_subtitle_findings",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'FINDINGS_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_findings",subtitle:"mapped_subtitle_findings",buttonText:"add_finding"});
      }else{
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_findings",subtitle:"mapped_subtitle_findings",buttonText:null});
      }
    
    } else if(type == 'non-conformity'){
      if(MappingStore.mappingDetails?.meeting_plan_status?.id==4){

        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_non_conformity",subtitle:"mapped_subtitle_non_conformity",buttonText:null});
      }
      else if(AuthStore.getActivityPermission(100,'FINDINGS_MEETING_PLAN_MAPPING_CREATE')){
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_non_conformity",subtitle:"mapped_subtitle_non_conformity",buttonText:"add_non_conformity_finding"});
      }else{        
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_non_conformity",subtitle:"mapped_subtitle_non_conformity",buttonText:null});
      }
    
    }
    this.selectedSection = type;
  }

  checkDepartment(department){
    if(typeof department==='object') {
      return this._helperService.getArrayProcessed(department,'title').toString();
      }
      else{
        return department;
      } 
  }

  checkRiskCategory(department){
    if(typeof department==='object') {
      return this._helperService.getArrayProcessed(department,'title').toString();
      }
      else{
        return department;
      } 
  }

  checkRiskType(department){
    if(typeof department==='object') {
      let e;
      e=this._helperService.getArrayProcessed(department,'is_external').toString();
      if(e==="1"){
        return "External";
      }
      let i=this._helperService.getArrayProcessed(department,'is_internal').toString();
      if(i==="1"){
        return "Internal"
      }
      else{
        return "External,Internal"
      }
      }
      else{
        return department;
      }
      
    
  }

  passOrganizationIssueIypes(organizationIssueTypes){
    let issue_types_list=[];

    for(let j of organizationIssueTypes){
      issue_types_list.push(j.title);
    }
    return issue_types_list;
  }

  passOrganizationIssueCategories(organizationIssueCategories){
    return this.getArrayFormatedString('title',organizationIssueCategories);
  }

  passIssueDomains(organizationIssueDomains){
    return this.getArrayFormatedString('title',organizationIssueDomains);
  }

  passdepartments(departments){
    return this.getArrayFormatedString('title',departments);
  }

  deleteIssueMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_issue_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProcessMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_process_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteRiskMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'risk';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_risk_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteControlMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'control';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_control_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProjectMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'project';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_project_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProductMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_product_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCustomertMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'customer';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_customer_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteObjectivetMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'objective';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_objective_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteFindingsMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'audit_finding';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_audit_finding_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteNonConformityMapping(id){
    this.deleteObject.id = id;
    this.deleteObject.title = 'non_conformity';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_non_conformity_finding_from_meeting';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearDeleteObject() {//delete
    this.deleteObject.id = null;
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;

    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);

      switch(this.deleteObject.title){
        case 'process':
              let data1 = {
                is_deleted:true,
                process_ids:deleteId
              };
              deleteData = this._mappingService.deleteProcessMapping(data1);
          break;
        case 'issue':
              let data2 = {
                is_deleted:true,
                organization_issue_ids:deleteId
              };
              deleteData = this._mappingService.deleteIssueMapping(data2);
          break;
        case 'risk':
            let data3 = {
              is_deleted:true,
              risk_ids:deleteId
            };
            deleteData = this._mappingService.deleteRiskMapping(data3);
          break;
        case 'control':
            let data4 = {
              is_deleted:true,
              control_ids:deleteId
            };
            deleteData = this._mappingService.deleteControlMapping(data4);
          break;
        case 'project':
            let data5 = {
              is_deleted:true,
              project_ids:deleteId
            };
            deleteData = this._mappingService.deleteProjectMapping(data5);
          break;
        case 'product':
            let data6 = {
              is_deleted:true,
              product_ids:deleteId
            };
            deleteData = this._mappingService.deleteProductMapping(data6);
          break;
        case 'customer':
            let data7 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._mappingService.deleteCustomertMapping(data7);
          break;
        case 'objective':
            let data8 = {
              is_deleted:true,
              strategic_objective_ids:deleteId
            };
            deleteData = this._mappingService.deleteObjectivetMapping(data8);
          break;
        case 'audit_finding':
          let data9 = {
            is_deleted:true,
            finding_ids:deleteId
          };
          deleteData = this._mappingService.deleteFindingsMapping(data9);
          break;
        case 'non_conformity':
          let data10 = {
            is_deleted:true,
            noc_finding_ids:deleteId
          };
          deleteData = this._mappingService.deleteNonConformityFindingsMapping(data10);
          break;
      }

      deleteData.subscribe(resp => {
        this.getMapping();
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

  selectIssues() {
    IssueListStore.selectedIssuesList = this.issues;
    MappingStore.issue_select_form_modal = true;

    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);  
  }

  selectProcesses() {
    ProcessStore.selectedProcessesList = this.processes;
    MappingStore.processes_select_form_modal = true;

    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectRisk(){
    MeetingPlanStore.selectedRiskList = this.risk;
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectControls() {
    ControlStore.selectedControlsList = this.controls;
    MappingStore.control_select_form_modal = true;

    $(this.controlFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProducts(){
    BusinessProductsStore.selectedProductList = this.products;
    BusinessProductsStore.product_select_form_modal = true;

    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProjects(){
    BusinessProjectsStore.selectedProjectList = this.projects;
    BusinessProjectsStore.project_select_form_modal = true;

    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectCustomers(){
    BusinessCustomersStore.selectedCustomerList = this.customers;
    BusinessCustomersStore.customer_select_form_modal = true;

    $(this.customerFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectObjectives(){
    StrategicObjectivesMasterStore.selectedStrategic = this.strategic_objectives;
    StrategicObjectivesMasterStore.objective_select_form_modal = true;

    $(this.objectiveFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectFindings(){
    AuditFindingsStore._selectedFindingItemAll  = this.findings;
    AuditFindingsStore.finding_select_form_modal = true;

    $(this.findingFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  selectNonConformityFindings(){
    FindingsStore._selectedNonConformityItemAll  = this.nonConformity;
    FindingsStore.no_Conformity_finding_select_form_modal = true;

    $(this.nonConformityFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeIssues() {
    if(IssueListStore?.saveSelected){ 
      let saveData={
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      };
      this._mappingService.saveIssueForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeIssueMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeIssueMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeIssueMappingModal();
    }
  }

  closeIssueMappingModal(){
    IssueListStore.issue_select_form_modal = false;
    $(this.issueFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    IssueListStore.saveSelected = false;
  }

  closeProcesses() {
    if(ProcessStore?.saveSelected){
      let saveData={
        process_ids: this.getIds(ProcessStore?.selectedProcessesList)
      };
      this._mappingService.saveProcessForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeProcessMappingModal()
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeProcessMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeProcessMappingModal();
    }
    
  }

  closeProcessMappingModal(){
    IssueListStore.processes_form_modal = false;
    $(this.processFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    ProcessStore.saveSelected =  false;
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeRisks(){
    if(MappingStore?.saveSelected){
      let saveData={
        risk_ids: this.getIds(MeetingPlanStore?.selectedRiskList)
      };
      this._mappingService.saveRiskForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeRiskMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeRiskMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeRiskMappingModal();
    }

  }

  closeRiskMappingModal(){
    MappingStore.risk_select_form_modal = false;
    MappingStore.saveSelected = false;
    $(this.riskFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
    this._utilityService.detectChanges(this._cdr);
  }

  closeControls() {
    
    if(ControlStore?.saveSelected){
      let saveData={
        control_ids: this.getIds(ControlStore?.selectedControlsList)
      };
      this._mappingService.saveControlsForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeControlsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeControlsMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeControlsMappingModal();
    }
    
  }

  closeControlsMappingModal(){
    MappingStore.control_select_form_modal = false;
    $(this.controlFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    ControlStore.saveSelected =  false;
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeProducts(){
    if(BusinessProductsStore?.saveSelected){
      let saveData={
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      };
      this._mappingService.saveProductsForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeProductsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeProductsMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeProductsMappingModal();
    }
  }

  closeProductsMappingModal(){
    BusinessProductsStore.product_select_form_modal = false;
    $(this.productFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    BusinessProductsStore.saveSelected =  false;
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeProjects(){
    if(BusinessProjectsStore?.saveSelected){
      let saveData={
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectList)
      };
      this._mappingService.saveProjectsForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeProjectsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeProjectsMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeProjectsMappingModal();
    }
  }

  closeProjectsMappingModal(){
    BusinessProjectsStore.project_select_form_modal = false;
    $(this.projectFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    BusinessProjectsStore.saveSelected =  false;
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeCustomers(){
    if(BusinessCustomersStore?.saveSelected){
      let saveData={
        customer_ids: this.getIds(BusinessCustomersStore?.selectedCustomerList)
      };
      this._mappingService.saveCustomersForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeCustomersMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeCustomersMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeCustomersMappingModal();
    }
  }

  closeCustomersMappingModal(){
    BusinessCustomersStore.customer_select_form_modal = false;
    $(this.customerFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    BusinessCustomersStore.saveSelected =  false;
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeObjectives(){
    if(StrategicObjectivesMasterStore?.saveSelected){
      let saveData={
        strategic_objective_ids: this.getIds(StrategicObjectivesMasterStore?.selectedStrategic)
      };
      this._mappingService.saveObjectiveForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeObjectivesMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeObjectivesMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeObjectivesMappingModal();
    }
  }

  closeObjectivesMappingModal(){
    StrategicObjectivesMasterStore.objective_select_form_modal = false;
    $(this.objectiveFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    StrategicObjectivesMasterStore.saveSelected =  false;
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeFindings(){
    if(AuditFindingsStore?.saveSelected){
      let saveData={
        finding_ids: this.getIds(AuditFindingsStore?._selectedFindingItemAll)
      };
      this._mappingService.saveFindingsForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeFindingsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeFindingsMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeFindingsMappingModal();
    }
  }

  closeFindingsMappingModal(){
    AuditFindingsStore.finding_select_form_modal = false;
    $(this.findingFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    AuditFindingsStore.saveSelected =  false;
    this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  closeNonConformity(){
    if(FindingsStore?.saveSelected){
      let saveData={
        noc_finding_ids: this.getIds(FindingsStore?._selectedNonConformityItemAll)
      };
      this._mappingService.saveNonConfomityFindingsForMapping(saveData).subscribe(res=>{
        this.getMapping();
        this.closeNonConfomityMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeNonConfomityMappingModal();
        }
      })
      )
    }
    else{
      this.getMapping();
      this.closeNonConfomityMappingModal();
    }
  }

  closeNonConfomityMappingModal(){
    FindingsStore.no_Conformity_finding_select_form_modal = false;
    $(this.nonConformityFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    FindingsStore.saveSelected =  false;
    this._renderer2.setStyle(this.nonConformityFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }



  getIds(data){
    let idArray = [];
    for(let i of data){
      idArray.push(i.id)
    }
    return idArray;
  }

  getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    MeetingPlanStore.unsetSelectedRisk();
    MappingStore.unsetMappingDetails();//mapping Details
    this.riskSelectSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.controlSelectSubscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.customerSelectSubscription.unsubscribe();
    this.ProcessesSelectSubscription.unsubscribe();
    this.objectiveSelectSubscription.unsubscribe();
    this.findingSelectSubscription.unsubscribe();
    this.nonConformitySelectSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}
