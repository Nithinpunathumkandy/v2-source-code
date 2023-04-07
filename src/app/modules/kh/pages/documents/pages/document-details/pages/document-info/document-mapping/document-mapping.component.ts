import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-document-mapping',
  templateUrl: './document-mapping.component.html',
  styleUrls: ['./document-mapping.component.scss']
})
export class DocumentMappingComponent implements OnInit {
  @ViewChild('riskFormModal') riskFormModal: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('findingFormModal') findingFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  selectedSection = 'issue';
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  DocumentsStore=DocumentsStore;
  OrganizationModulesStore=OrganizationModulesStore;
  AuditFindingsStore = AuditFindingsStore;
  FindingsStore = FindingsStore;
  NoDataItemStore=NoDataItemStore;
  MeetingPlanStore=MeetingPlanStore;
  AppStore=AppStore;
  AuthStore=AuthStore;
  ProcessStore = ProcessStore;
  IssueListStore = IssueListStore;
  SubMenuItemStore=SubMenuItemStore;
  MappingStore=MappingStore;
  riskSelectSubscription:any;
  deleteEventSubscription:any;
  ProcessesSelectSubscription:any;
  findingSelectSubscription:any;
  issueSelectSubscription:any;

  risk=[];
  issues=[];
  processes=[];
  findings=[];
 

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  modalObject = {
    component : 'knowledge_hub',
  }
  issuesModalTitle = 'compliance_issues_modal_message';

  openModal=false;


  constructor(
    private route: ActivatedRoute,
    private _renderer2:Renderer2,
    private _documentService: DocumentsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    
  ) { }

  ngOnInit(): void {
    //console.log(document.URL.split("/").slice(-2)[0]);
    let id: number;
    id = +document.URL.split("/").slice(-2)[0];
    DocumentsStore.documentId = id;
      setTimeout(() => {
        this.getDocumentMappingDetails();
      }, 300);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      
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

    
    this.findingSelectSubscription = this._eventEmitterService.findingItemAddModalControl.subscribe(item => {
			this.closeFindings();
		})

  }

  getDocumentMappingDetails() {

    this._documentService.getMappingDetails(DocumentsStore.documentId).subscribe(res => {
      if (res) {
        this.setValues(res);
        this.gotoSection(this.selectedSection);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setValues(DocumentMapping){
    // if(RiskMappingStore.loaded){
      this.issues=[];
      this.processes=[];
      let processItem=DocumentMapping.processes;
      let issueItem=DocumentMapping.organization_issues;
      this.risk=DocumentMapping.risks;
     
      this.findings=DocumentMapping.findings;

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
    }
    else if(this.selectedSection=='audit_finding'){
      this.selectFindings();
    }
  }

  gotoSection(type) {
    
    if (type == 'issue') {
      
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_issue",subtitle:"mapped_nodata_sutitle_issue",buttonText:"add_issue"});
     
    
    } else if (type == 'process') {
     
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"mapped_process_subtitle",buttonText:"add_process"});

    
    } else if(type == 'risk'){
      
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_risk",subtitle:"mapped_subtitle_risk",buttonText:"add_risk"});
      
    
    }  else if(type == 'audit_finding'){
      
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_findings",subtitle:"mapped_subtitle_findings",buttonText:"add_finding"})
    
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
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_delete_this_issue_from_knowledge_hub';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteProcessMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_process_from_knowledge_hub';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteRiskMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'risk';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_risk_from_knowledge_hub';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  

  deleteFindingsMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'audit_finding';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_detach_this_audit_finding_from_knowledge_hub';

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
              deleteData = this._documentService.deleteProcessMapping(data1);
          break;
        case 'issue':
              let data2 = {
                is_deleted:true,
                organization_issue_ids:deleteId
              };
              deleteData = this._documentService.deleteIssueMapping(data2);
          break;
        case 'risk':
            let data3 = {
              is_deleted:true,
              risk_ids:deleteId
            };
            deleteData = this._documentService.deleteRiskMapping(data3);
          break;
       
        case 'audit_finding':
          let data9 = {
            is_deleted:true,
            finding_ids:deleteId
          };
          deleteData = this._documentService.deleteFindingsMapping(data9);
          break;
       
      }

      deleteData.subscribe(resp => {
        this.getDocumentMappingDetails();
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
    IssueListStore.saveSelected = false;
    IssueListStore.selectedIssuesList = DocumentsStore._documentMappingDetails?.organization_issues;
    IssueListStore.issue_select_form_modal = true;
  
    setTimeout(() => {
      $(this.issueFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  selectProcesses() {
    ProcessStore.saveSelected = false;
    ProcessStore.selectedProcessesList = DocumentsStore._documentMappingDetails?.processes;
    DocumentsStore.processes_select_form_modal = true

    setTimeout(() => {
      $(this.processFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  selectRisk(){
    MappingStore.saveSelected = false;
    MeetingPlanStore.selectedRiskList = this.risk;
    DocumentsStore.risk_select_form_modal = true;
    setTimeout(() => {
      $(this.riskFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

 
  selectFindings(){
    AuditFindingsStore._selectedFindingItemAll  = this.findings;
    AuditFindingsStore.finding_select_form_modal = true;
    setTimeout(() => {
      $(this.findingFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  closeIssues() {
    
    if (IssueListStore?.saveSelected) {
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._documentService.saveIssueForMapping(saveData).subscribe(res => {
        this.getDocumentMappingDetails()
        IssueListStore.issue_select_form_modal = false;
        // $(this.issueFormModal.nativeElement).modal('hide');
        // this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      IssueListStore.issue_select_form_modal = false;
      this.getDocumentMappingDetails()
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


  closeProcesses() {
    if(ProcessStore?.saveSelected){
      let saveData={
        process_ids: this.getIds(ProcessStore?.selectedProcessesList)
      };
      this._documentService.saveProcessForMapping(saveData).subscribe(res=>{
        this.getDocumentMappingDetails();
        DocumentsStore.processes_select_form_modal = false;
       
      })
    }
    else{
      this.getDocumentMappingDetails();
      DocumentsStore.processes_select_form_modal = false;
    }
    setTimeout(() => {
      $(this.processFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    
  }

  closeRisks(){
    if(MappingStore?.saveSelected){
      let saveData={
        risk_ids: this.getIds(MeetingPlanStore?.selectedRiskList)
      };
      this._documentService.saveRiskForMapping(saveData).subscribe(res=>{
        this.getDocumentMappingDetails();
        DocumentsStore.risk_select_form_modal = false;
      })
    }
    else{
      this.getDocumentMappingDetails();
      DocumentsStore.risk_select_form_modal = false;
    }
    setTimeout(() => {
      $(this.riskFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.riskFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFindings(){
    if(AuditFindingsStore?.saveSelected){
      let saveData={
        finding_ids: this.getIds(AuditFindingsStore?._selectedFindingItemAll)
      };
      this._documentService.saveFindingsForMapping(saveData).subscribe(res=>{
        this.getDocumentMappingDetails();
        this.closeFindingsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeFindingsMappingModal();
        }
      })
      )
    }
    else{
      this.getDocumentMappingDetails();
      this.closeFindingsMappingModal();
    }
  }

  closeFindingsMappingModal(){
    AuditFindingsStore.finding_select_form_modal = false;
    AuditFindingsStore.saveSelected =  false;
    setTimeout(() => {
      $(this.findingFormModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.findingFormModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  getIds(data){
    let idArray = [];
    for(let i of data){
      idArray.push(i.id)
    }
    return idArray;
  }

  
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    DocumentsStore.unsetMappingDetails();//mapping Details
    this.riskSelectSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.ProcessesSelectSubscription.unsubscribe();
    this.findingSelectSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
