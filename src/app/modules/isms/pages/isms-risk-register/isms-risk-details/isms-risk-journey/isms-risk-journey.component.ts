import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RiskJourneyService } from 'src/app/core/services/risk-management/risks/risk-journey/risk-journey.service';
// import { IsmsRiskJourneyStore } from 'src/app/stores/risk-management/risks/risk-journey.store';
import { RiskJourney } from 'src/app/core/models/risk-management/risks/risk-journey';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import { IsmsRiskMappingStore } from 'src/app/stores/risk-management/risks/risk-mapping.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
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
// import { RiskJourneyWorkflowService } from 'src/app/core/services/risk-management/risks/risk-journey-workflow/risk-journey-workflow.service';
// import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
// import { IsmsRiskJourneyWorkflowStore } from 'src/app/stores/risk-management/risks/risk-journey-workflow.store';
// import { IsmsRiskSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskJourneyStore } from 'src/app/stores/isms/isms-risks/isms-risk-journey.store';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';
import { IsmsRiskMappingStore } from 'src/app/stores/isms/isms-risks/isms-risk-mapping.store';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { IsmsRiskJourneyService } from 'src/app/core/services/isms/isms-risks/isms-risk-journey/isms-risk-journey.service';
import { IsmsRiskJourneyWorkflowStore } from 'src/app/stores/isms/isms-risks/risk-journey-workflow.store';
import { IsmsRiskJourneyWorkflowService } from 'src/app/core/services/isms/isms-risks/isms-risk-journey-workflow/isms-risk-journey-workflow.service';
declare var $: any;
@Component({
  selector: 'app-isms-risk-journey',
  templateUrl: './isms-risk-journey.component.html',
  styleUrls: ['./isms-risk-journey.component.scss']
})
export class IsmsRiskJourneyComponent implements OnInit {

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

  IsmsRisksStore = IsmsRisksStore
  IsmsRiskJourneyStore = IsmsRiskJourneyStore
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  IsmsRiskJourneyWorkflowStore = IsmsRiskJourneyWorkflowStore;
  AppStore = AppStore;
  IsmsRiskSettingStore = ISMSRiskSettingStore;
  reactionDisposer: IReactionDisposer;
  issues = [];
  processes = [];
  emptyItem = "common_nodata_title";
  downloadMessage: string = 'downloading';
  openAll = false;

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

  constructor(
    private _riskJourneyService: IsmsRiskJourneyService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _riskJourneyWorkflowService: IsmsRiskJourneyWorkflowService,
    private _risksService: IsmsRisksService,
    private _eventEmitterService: EventEmitterService,
    private _riskControlPlanService: RiskControlPlanService,
    private _imageService: ImageServiceService
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [];
      if (IsmsRisksStore.individualRiskDetails?.is_corporate) {
        if ((!IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by || IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by == null) && IsmsRiskJourneyStore.individualRiskJourney?.journey_workflow_items?.length > 0 && IsmsRisksStore.isProperUser() && IsmsRisksStore.individualRiskDetails?.is_analysis_performed == 1) {
          subMenuItems = [
            // { activityName: 'ISSUE_ISMS_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
            // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
            { activityName: 'SUBMIT_ISMS_RISK_JOURNEY', submenuItem: { type: 'submit' } },
            { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
          ]
        }
        else {
          if (this.isUser() && IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by != null) {
            if (IsmsRiskJourneyStore.individualRiskJourney.journey_next_review_user_level == IsmsRiskJourneyWorkflowStore?.workflowDetails[IsmsRiskJourneyWorkflowStore?.workflowDetails?.length - 1]?.level) {
              subMenuItems = [
                { activityName: null, submenuItem: { type: 'approve' } },
                { activityName: null, submenuItem: { type: 'revert' } },
                { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
              ]
            }
            else {
              subMenuItems = [
                { activityName: null, submenuItem: { type: 'review_submit' } },
                { activityName: null, submenuItem: { type: 'revert' } },
                { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
              ]
            }

          }
          else {
            subMenuItems = [

              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
            ]
          }

        }

      }
      else {
        if ((!IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by || IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by == null) && IsmsRiskJourneyStore.individualRiskJourney?.journey_workflow_items?.length > 0 && IsmsRisksStore.isProperUser() && IsmsRisksStore.individualRiskDetails?.is_analysis_performed == 1) {

          subMenuItems = [
            // { activityName: 'ISSUE_ISMS_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
            // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
            { activityName: 'SUBMIT_ISMS_RISK_JOURNEY', submenuItem: { type: 'submit' } },
            { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
          ]
        }
        else {
          if (this.isUser() && IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by != null) {
            if (IsmsRiskJourneyStore.individualRiskJourney.journey_next_review_user_level == IsmsRiskJourneyWorkflowStore?.workflowDetails[IsmsRiskJourneyWorkflowStore?.workflowDetails?.length - 1]?.level) {

              subMenuItems = [
                { activityName: null, submenuItem: { type: 'approve' } },
                { activityName: null, submenuItem: { type: 'revert' } },
                { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
              ]
            }
            else {
              subMenuItems = [
                { activityName: null, submenuItem: { type: 'review_submit' } },
                { activityName: null, submenuItem: { type: 'revert' } },
                { activityName: null, submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
              ]
            }
          }
          else {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
            ]
          }
        }
      }
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
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

    this.workflowEventSubscription = this._eventEmitterService.ismsRiskJourneyWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.ismsRiskJourneyHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.ismsRiskJourneyWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })
  }

  getDetails() {
    this._riskJourneyService.getItem(null).subscribe(data => {
      this._utilityService.detectChanges(this._cdr);
      this.setValues(data);
    })
  }

  isUser() {

    if(IsmsRiskJourneyWorkflowStore?.workflowDetails?.length>0){
      for (let i of IsmsRiskJourneyWorkflowStore?.workflowDetails) {
        if (i.level == IsmsRiskJourneyStore.individualRiskJourney.journey_next_review_user_level) {
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
      IsmsRiskJourneyWorkflowStore.type='submit';

    }
    else
    IsmsRiskJourneyWorkflowStore.type='approve';

    IsmsRiskJourneyWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    // this._riskJourneyWorkflowService.approveRisk(IsmsRiskJourneyStore.riskId,{}).subscribe(res=>{
    //   this._risksService.getItem(IsmsRiskJourneyStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
     
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  closeCommentForm(){
    IsmsRiskJourneyWorkflowStore.type = '';
    IsmsRiskJourneyWorkflowStore.commentForm=false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr)
  }

  revertRisk(){
    IsmsRiskJourneyWorkflowStore.type='revert';
    IsmsRiskJourneyWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }


  submitForReview() {
    this._riskJourneyWorkflowService.submitRisk(IsmsRisksStore.riskId).subscribe(res => {
      this._risksService.getItem(IsmsRisksStore.riskId).subscribe(() => this._utilityService.detectChanges(this._cdr))
      // this._utilityService.detectChanges(this._cdr);
      this._riskJourneyService.getItem(IsmsRisksStore.riskId).subscribe(res => {
        SubMenuItemStore.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })

    })
  }

  getJourneyWorkflowDetails(){
      this._riskJourneyWorkflowService.getItems(IsmsRisksStore.riskId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  }


  openWorkflowPopup() {
    this._riskJourneyWorkflowService.getItems(IsmsRisksStore.riskId).subscribe(res => {
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
    IsmsRiskJourneyWorkflowStore.setCurrentPage(1);
    this._riskJourneyWorkflowService.getHistory(IsmsRisksStore.riskId).subscribe(res => {
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
    IsmsRiskMappingStore.projects = [];
    IsmsRiskMappingStore.locations = [];
    IsmsRiskMappingStore.controls = [];
    IsmsRiskMappingStore.customers = [];
    IsmsRiskMappingStore.products = [];
    IsmsRiskMappingStore.objectives = [];
    this.issues = [];
    this.processes = [];
    // if(IsmsRiskMappingStore.loaded){
    let processItem = RiskMapping.processes;
    let issueItem = RiskMapping.organization_issues;
    let projectItem = RiskMapping.projects;
    IsmsRiskMappingStore.locations = RiskMapping.locations;
    IsmsRiskMappingStore.products = RiskMapping.products;
    IsmsRiskMappingStore.customers = RiskMapping.customers;
    IsmsRiskMappingStore.objectives = RiskMapping.strategic_objectives;
    IsmsRiskMappingStore.controls = RiskMapping.controls;


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
      IsmsRiskMappingStore.projects.push(i);
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
    IsmsRiskJourneyStore.unsetIndividualRiskJourney();
    this.workflowEventSubscription.unsubscribe();
    this.historyEventSubscription.unsubscribe();
  }

}
