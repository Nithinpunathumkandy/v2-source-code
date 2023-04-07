import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HiraJourneyService } from 'src/app/core/services/hira/hira/hira-journey/hira-journey.service';
import { RiskJourneyStore } from 'src/app/stores/hira/hira/hira-journey.store';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskMappingStore } from 'src/app/stores/hira/hira/hira-mapping.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { autorun, IReactionDisposer } from 'mobx';
import * as htmlToImage from 'html-to-image';
import { RiskJourneyWorkflowService } from 'src/app/core/services/risk-management/risks/risk-journey-workflow/risk-journey-workflow.service';
import { HiraService } from 'src/app/core/services/hira/hira/hira.service';
import { RiskJourneyWorkflowStore } from 'src/app/stores/risk-management/risks/risk-journey-workflow.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ResidualRiskStore } from 'src/app/stores/hira/hira/residual-hira.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-hira-journey',
  templateUrl: './hira-journey.component.html',
  styleUrls: ['./hira-journey.component.scss']
})
export class HiraJourneyComponent implements OnInit {

  @ViewChild('controlTab') controlTab: ElementRef;
  @ViewChild('issueTab') issueTab: ElementRef;
  @ViewChild('processTab') processTab: ElementRef;
  @ViewChild('locationTab') locationTab: ElementRef;
  @ViewChild('projectTab') projectTab: ElementRef;
  @ViewChild('productTab') productTab: ElementRef;
  @ViewChild('customerTab') customerTab: ElementRef;
  @ViewChild('strategicTab') strategicTab: ElementRef;
  @ViewChild('controlShow') controlShow: ElementRef;
  @ViewChild('issueShow') issueShow: ElementRef;
  @ViewChild('processShow') processShow: ElementRef;
  @ViewChild('locationShow') locationShow: ElementRef;
  @ViewChild('projectShow') projectShow: ElementRef;
  @ViewChild('productShow') productShow: ElementRef;
  @ViewChild('customerShow') customerShow: ElementRef;
  @ViewChild('strategicShow') strategicShow: ElementRef;
  @ViewChild('rcaShow') rcaShow: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  RisksStore = RisksStore
  RiskJourneyStore = RiskJourneyStore;
  ResidualRiskStore = ResidualRiskStore;
  
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  RiskJourneyWorkflowStore = RiskJourneyWorkflowStore;
  AppStore = AppStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  reactionDisposer: IReactionDisposer;
  issues = [];
  processes = [];
  emptyItem = "common_nodata_title";
  downloadMessage: string = 'downloading';
  openAll = false;

  selectedIndex: any = null;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  active;
  activeProcess = null;
  workflowModalOpened = false;
  workflowHistoryOpened = false;

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
  workflowEventSubscription: any;
  historyEventSubscription: any;
  currentTab = 'control';
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  workflowCommentEventSubscription:any;

  constructor(private _hiraJourneyService: HiraJourneyService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _riskJourneyWorkflowService: RiskJourneyWorkflowService,
    private _hiraService: HiraService,
    private _eventEmitterService: EventEmitterService,
    private _riskControlPlanService: RiskControlPlanService,
    private _imageService: ImageServiceService) { }

    ngOnInit(): void {

      this.reactionDisposer = autorun(() => {
  
        var subMenuItems = [];
        if (RisksStore.individualRiskDetails?.is_corporate) {
          if ((!RiskJourneyStore.individualRiskJourney?.journey_submitted_by || RiskJourneyStore.individualRiskJourney?.journey_submitted_by == null) && RiskJourneyStore.individualRiskJourney?.journey_workflow_items?.length > 0 && RisksStore.isProperUser() && RisksStore.individualRiskDetails?.is_analysis_performed == 1) {
            subMenuItems = [
              // { activityName: 'ISSUE_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
              // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
              { activityName: 'SUBMIT_RISK_JOURNEY', submenuItem: { type: 'submit' } },
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
            ]
          }
          else {
            if (this.isUser() && RiskJourneyStore.individualRiskJourney?.journey_submitted_by != null) {
              if (RiskJourneyStore.individualRiskJourney.journey_next_review_user_level == RiskJourneyWorkflowStore?.workflowDetails[RiskJourneyWorkflowStore?.workflowDetails?.length - 1]?.level) {
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'approve' } },
                  { activityName: null, submenuItem: { type: 'revert' } },
                  // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
                ]
              }
              else {
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'review_submit' } },
                  { activityName: null, submenuItem: { type: 'revert' } },
                  // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
                ]
              }
  
            }
            else {
              subMenuItems = [
  
                // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
              ]
            }
  
          }
  
        }
        else {
          if ((!RiskJourneyStore.individualRiskJourney?.journey_submitted_by || RiskJourneyStore.individualRiskJourney?.journey_submitted_by == null) && RiskJourneyStore.individualRiskJourney?.journey_workflow_items?.length > 0 && RisksStore.isProperUser() && RisksStore.individualRiskDetails?.is_analysis_performed == 1) {
  
            subMenuItems = [
              // { activityName: 'ISSUE_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
              // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
              { activityName: 'SUBMIT_RISK_JOURNEY', submenuItem: { type: 'submit' } },
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
            ]
          }
          else {
            if (this.isUser() && RiskJourneyStore.individualRiskJourney?.journey_submitted_by != null) {
              if (RiskJourneyStore.individualRiskJourney.journey_next_review_user_level == RiskJourneyWorkflowStore?.workflowDetails[RiskJourneyWorkflowStore?.workflowDetails?.length - 1]?.level) {
  
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'approve' } },
                  { activityName: null, submenuItem: { type: 'revert' } },
                  // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
                ]
              }
              else {
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'review_submit' } },
                  { activityName: null, submenuItem: { type: 'revert' } },
                  // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
                ]
              }
            }
            else {
              subMenuItems = [
                // { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
              ]
            }
          }
        }
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
  
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "export_to_excel":
              this.exportRiskJourney();
              break;
            case 'submit':
              SubMenuItemStore.submitClicked = true;
              this.submitForReview();
              break
              case 'approve':
                // SubMenuItemStore.submitClicked = true;
                this.approveRisk();
                break
              case 'review_submit':
                // SubMenuItemStore.submitClicked = true;
                this.approveRisk(true);
                break
              case 'revert':
                // SubMenuItemStore.submitClicked = true;
                this.revertRisk();
                break
            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
      })
  
      // setting submenu items
  
      SubMenuItemStore.setNoUserTab(true);
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      this.getDetails();
      this.getRiskControlPlan();
      this.getJourneyWorkflowDetails();
  
      this.workflowEventSubscription = this._eventEmitterService.riskJourneyWorkflow.subscribe(item => {
        this.closeWorkflowPopup();
      })
  
      this.historyEventSubscription = this._eventEmitterService.riskJourneyHistory.subscribe(item => {
        this.closeHistoryPopup();
      })
  
      this.workflowCommentEventSubscription = this._eventEmitterService.RiskJourneyWorkflowCommentModal.subscribe(item => {
        this.closeCommentForm();
      })
    }
  
    getDetails() {
      this._hiraJourneyService.getItem(null).subscribe(data => {
        this._utilityService.detectChanges(this._cdr);
        this.setValues(data);
      })
    }
  
    isUser() {
  
      if(RiskJourneyWorkflowStore?.workflowDetails?.length>0){
        for (let i of RiskJourneyWorkflowStore?.workflowDetails) {
          if (i.level == RiskJourneyStore.individualRiskJourney.journey_next_review_user_level) {
            var pos = i.risk_journey_workflow_item_users?.findIndex(e => e.id == AuthStore.user.id)
            if (pos != -1)
              return true;
            else
              return false
          }
        }
      }
      
    }
  
    approveRisk(type?){
      if(type){
        RiskJourneyWorkflowStore.type='submit';
  
      }
      else
      RiskJourneyWorkflowStore.type='approve';
  
      RiskJourneyWorkflowStore.commentForm = true;
      $(this.commentModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
        this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
      // this._riskJourneyWorkflowService.approveRisk(RiskJourneyStore.riskId,{}).subscribe(res=>{
      //   this._hiraService.getItem(RiskJourneyStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
       
      //   this._utilityService.detectChanges(this._cdr);
      // })
    }
  
    closeCommentForm(){
      RiskJourneyWorkflowStore.type = '';
      RiskJourneyWorkflowStore.commentForm=false;
      $(this.commentModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr)
    }
  
    revertRisk(){
      RiskJourneyWorkflowStore.type='revert';
      RiskJourneyWorkflowStore.commentForm = true;
      $(this.commentModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    }
  
  
    submitForReview() {
      this._riskJourneyWorkflowService.submitRisk(RisksStore.riskId).subscribe(res => {
        this._hiraService.getItem(RisksStore.riskId).subscribe(() => this._utilityService.detectChanges(this._cdr))
        // this._utilityService.detectChanges(this._cdr);
        this._hiraJourneyService.getItem(RisksStore.riskId).subscribe(res => {
          SubMenuItemStore.submitClicked = false;
          this._utilityService.detectChanges(this._cdr);
        })
  
      })
    }
  
    getJourneyWorkflowDetails(){
        this._riskJourneyWorkflowService.getItems(RisksStore.riskId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
    }
  
  
    openWorkflowPopup() {
      this._riskJourneyWorkflowService.getItems(RisksStore.riskId).subscribe(res => {
        this.workflowModalOpened = true;
        this._utilityService.detectChanges(this._cdr);
        $(this.workflowModal.nativeElement).modal('show');
        this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
        this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
      })
    }
  
    closeWorkflowPopup() {
  
      this.workflowModalOpened = false;
      $(this.workflowModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
    }
  
  
    openHistoryPopup() {
      RiskJourneyWorkflowStore.setCurrentPage(1);
      this._riskJourneyWorkflowService.getHistory(RisksStore.riskId).subscribe(res => {
        this.workflowHistoryOpened = true;
        this._utilityService.detectChanges(this._cdr);
        $(this.workflowHistory.nativeElement).modal('show');
      });
  
  
  
    }
  
    closeHistoryPopup() {
      this.workflowHistoryOpened = false;
      $(this.workflowHistory.nativeElement).modal('hide');
    }
  
  
    setValues(RiskMapping) {
      IssueListStore.selectedIssuesList = [];
      ProcessStore.selectedProcessesList = [];
      BusinessProjectsStore.selectedProjectList = [];
      LocationMasterStore.selectedLocationList = [];
      ControlStore.selectedControlsList = [];
      BusinessCustomersStore.selectedCustomerList = [];
      BusinessProductsStore.selectedProductList = [];
      StrategicObjectivesMasterStore.selectedStrategic = [];
      RiskMappingStore.projects = [];
      RiskMappingStore.locations = [];
      RiskMappingStore.controls = [];
      RiskMappingStore.customers = [];
      RiskMappingStore.products = [];
      RiskMappingStore.objectives = [];
      this.issues = [];
      this.processes = [];
      // if(RiskMappingStore.loaded){
      let processItem = RiskMapping.processes;
      let issueItem = RiskMapping.organization_issues;
      let projectItem = RiskMapping.projects;
      RiskMappingStore.locations = RiskMapping.locations;
      RiskMappingStore.products = RiskMapping.products;
      RiskMappingStore.customers = RiskMapping.customers;
      RiskMappingStore.objectives = RiskMapping.strategic_objectives;
      RiskMappingStore.controls = RiskMapping.controls;
  
  
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
  
      for (let i of projectItem) {
        i['project_manager_first_name'] = i.project_manager?.first_name;
        i['project_manager_last_name'] = i.project_manager?.last_name;
        i['project_manager_image_token'] = i.project_manager?.image_token;
        i['location_title'] = i.location?.title;
        RiskMappingStore.projects.push(i);
      }
  
      this._utilityService.detectChanges(this._cdr);
    }
  
    getArrayFormatedString(type, items, languageSupport?) {
      let item = [];
      if (languageSupport) {
        for (let i of items) {
          for (let j of i.language) {
            item.push(j.pivot);
          }
        }
        items = item;
      }
      return this._helperService.getArraySeperatedString(',', type, items);
    }
  
    exportRiskJourney() {
      this.openAll = true
      this.openAllTab();
  
      setTimeout(() => {
        $(this.loaderPopUp.nativeElement).modal('show');
      }, 100);
      setTimeout(() => {
        let element: HTMLElement;
        element = document.getElementById("risk-journey");
        let pthis = this;
        htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
          .then(function (dataUrl) {
            var reader = new FileReader();
            reader.readAsDataURL(dataUrl);
            reader.onloadend = function () {
              var base64data = reader.result;
              // console.log(base64data);
              pthis.downloadPdf(base64data);
            }
            // var link = document.createElement('a');
            // link.download = `risk-analysis.jpeg`;
            // link.href = dataUrl;
            // link.click();
            // SubMenuItemStore.exportClicked = false;
            // pthis.openAll=false;
            // pthis.closeLoaderPopUp();
          });
      }, 1000);
  
    }
  
    downloadPdf(file) {
      this._imageService.getPdf(file).subscribe(res => {
        SubMenuItemStore.exportClicked = false;
        this.openAll = false;
        this.openAllTab();
        this.closeLoaderPopUp();
      })
    }
  
    closeLoaderPopUp() {
      setTimeout(() => {
        $(this.loaderPopUp.nativeElement).modal('hide');
      }, 250);
    }
  
    getPopupDetails(user, auth?: string) {
      if (user) {
        this.userDetailObject.first_name = user.first_name;
        this.userDetailObject.last_name = user.last_name;
        //this.userDetailObject.designation = user.designation ? user.designation : user.designation ?user.designation?.title:null ;
        this.userDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
        this.userDetailObject.email = user.email;
        this.userDetailObject.mobile = user.mobile;
        this.userDetailObject.id = user.id;
        this.userDetailObject.department = user.department?.title ? user.department?.title : null;
        this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
        if (auth == 'auth') {
          this.userDetailObject.designation = user?.designation.title;
        } else {
          this.userDetailObject.designation = user?.designation ? user?.designation : user?.designation_title;
        }
        return this.userDetailObject;
      }
    }
  
  
    openAllTab() {
      if (this.openAll == true) {
  
        if (this.controlShow)
          this._renderer2.addClass(this.controlShow?.nativeElement, 'show');
  
        if (this.issueShow)
          this._renderer2.addClass(this.issueShow?.nativeElement, 'show');
  
        if (this.processShow)
          this._renderer2.addClass(this.processShow?.nativeElement, 'show');
  
        if (this.locationShow)
          this._renderer2.addClass(this.locationShow?.nativeElement, 'show');
  
        if (this.projectShow)
          this._renderer2.addClass(this.projectShow?.nativeElement, 'show');
  
        if (this.productShow)
          this._renderer2.addClass(this.productShow?.nativeElement, 'show');
  
        if (this.customerShow)
          this._renderer2.addClass(this.customerShow?.nativeElement, 'show');
  
        if (this.strategicShow)
          this._renderer2.addClass(this.strategicShow?.nativeElement, 'show');
  
        if (this.rcaShow)
          this._renderer2.addClass(this.rcaShow?.nativeElement, 'show');
      }
  
      else {
  
        if (this.controlShow)
          this._renderer2.removeClass(this.controlShow?.nativeElement, 'show');
  
        if (this.issueShow)
          this._renderer2.removeClass(this.issueShow?.nativeElement, 'show');
  
        if (this.processShow)
          this._renderer2.removeClass(this.processShow?.nativeElement, 'show');
  
        if (this.locationShow)
          this._renderer2.removeClass(this.locationShow?.nativeElement, 'show');
  
        if (this.projectShow)
          this._renderer2.addClass(this.projectShow?.nativeElement, 'show');
  
        if (this.productShow)
          this._renderer2.removeClass(this.productShow?.nativeElement, 'show');
  
        if (this.customerShow)
          this._renderer2.removeClass(this.customerShow?.nativeElement, 'show');
  
        if (this.strategicShow)
          this._renderer2.removeClass(this.strategicShow?.nativeElement, 'show');
  
        if (this.rcaShow)
          this._renderer2.removeClass(this.rcaShow?.nativeElement, 'show');
      }
    }
  
    toggleTab(tab) {
      // switch (tab) {
      // case "control":
      if (this.currentTab == tab) {
        this.currentTab = null;
      }
      else {
        this.currentTab = tab;
      }
    }
  
    openProcess(id) {
      this.setActiveProcess(id);
    }
  
    setActiveProcess(id) {
      if (this.activeProcess == id) {
        this.activeProcess = null;
      }
      else {
        this.activeProcess = id;
        this._utilityService.detectChanges(this._cdr);
      }
    }
  
    selectedIndexChange(index){
  
      if(this.selectedIndex == index){
        this.selectedIndex = null;
      } else{
        this.selectedIndex = index;
        this._utilityService.detectChanges(this._cdr);
      }
      
    }
  
    searchRiskControlPlan(event) {
      this._riskControlPlanService.getItems(false, '&q=' + event.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
    getRiskControlPlan() {
      this._riskControlPlanService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
      RiskJourneyStore.unsetIndividualRiskJourney();
      this.workflowEventSubscription.unsubscribe();
      this.historyEventSubscription.unsubscribe();
    }

}
