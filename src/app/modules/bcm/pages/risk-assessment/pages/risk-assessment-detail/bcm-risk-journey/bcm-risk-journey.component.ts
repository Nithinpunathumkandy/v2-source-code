import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmRiskJourneyService } from 'src/app/core/services/bcm/bcm-risk-journey/bcm-risk-journey.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BcmRiskJourneyStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-journey.store';
import { BcmResidualRiskStore } from 'src/app/stores/bcm/risk-assessment/bcm-residual-risk.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BcmRiskMappingStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-mapping.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;

@Component({
  selector: 'app-bcm-risk-journey',
  templateUrl: './bcm-risk-journey.component.html',
  styleUrls: ['./bcm-risk-journey.component.scss']
})
export class BcmRiskJourneyComponent implements OnInit {

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
  @ViewChild('serviceShow') serviceShow: ElementRef;
  @ViewChild('assetShow') assetShow: ElementRef;
  @ViewChild('customerShow') customerShow: ElementRef;
  @ViewChild('strategicShow') strategicShow: ElementRef;
  @ViewChild('rcaShow') rcaShow: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  BcmRiskAssessmentStore = BcmRiskAssessmentStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  ResidualRiskStore = BcmResidualRiskStore;
  BcmRiskJourneyStore = BcmRiskJourneyStore
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  issues = [];
  processes = [];
  emptyItem = "common_nodata_title";
  downloadMessage: string = 'downloading';
  openAll = false;
  selectedIndex: any = null;
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
  workflowCommentEventSubscription:any;

  constructor(
    private bcmRiskJourneyService: BcmRiskJourneyService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/bcm/risk-assessment' } },
      ];
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this.bcmRiskJourneyService.exportJourney();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getRiskJourney();
  }

  getRiskJourney(){
    this.bcmRiskJourneyService.getItem(BcmRiskAssessmentStore.selectedId).subscribe(res=>{
      this.setValues(res);
    })
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

  setValues(RiskMapping) {
    IssueListStore.selectedIssuesList = [];
    ProcessStore.selectedProcessesList = [];
    BusinessProjectsStore.selectedProjectList = [];
    LocationMasterStore.selectedLocationList = [];
    ControlStore.selectedControlsList = [];
    BusinessCustomersStore.selectedCustomerList = [];
    BusinessProductsStore.selectedProductList = [];
    StrategicObjectivesMasterStore.selectedStrategic = [];
    BcmRiskMappingStore.projects = [];
    BcmRiskMappingStore.locations = [];
    BcmRiskMappingStore.controls = [];
    BcmRiskMappingStore.customers = [];
    BcmRiskMappingStore.products = [];
    BcmRiskMappingStore.objectives = [];
    this.issues = [];
    this.processes = [];
    // if(BcmRiskMappingStore.loaded){
    let processItem = RiskMapping.processes;
    let issueItem = RiskMapping.organization_issues;
    let projectItem = RiskMapping.projects;
    BcmRiskMappingStore.locations = RiskMapping.locations;
    BcmRiskMappingStore.products = RiskMapping.products;
    BcmRiskMappingStore.customers = RiskMapping.customers;
    BcmRiskMappingStore.objectives = RiskMapping.strategic_objectives;
    BcmRiskMappingStore.controls = RiskMapping.controls;


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
      BcmRiskMappingStore.projects.push(i);
    }

    this._utilityService.detectChanges(this._cdr);
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

      if (this.serviceShow)
        this._renderer2.addClass(this.serviceShow?.nativeElement, 'show');

      if (this.assetShow)
        this._renderer2.addClass(this.assetShow?.nativeElement, 'show');

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
        this._renderer2.removeClass(this.projectShow?.nativeElement, 'show');

      if (this.productShow)
        this._renderer2.removeClass(this.productShow?.nativeElement, 'show');

      if (this.serviceShow)
        this._renderer2.removeClass(this.serviceShow?.nativeElement, 'show');
      
      if (this.assetShow)
        this._renderer2.removeClass(this.assetShow?.nativeElement, 'show');

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


  openWorkflowPopup() {
    // this._riskJourneyWorkflowService.getItems(RisksStore.riskId).subscribe(res => {
    //   this.workflowModalOpened = true;
    //   this._utilityService.detectChanges(this._cdr);
    //   $(this.workflowModal.nativeElement).modal('show');
    //   this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
    //   this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    // })
  }

  closeWorkflowPopup() {

    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }


  openHistoryPopup() {
    // RiskJourneyWorkflowStore.setCurrentPage(1);
    // this._riskJourneyWorkflowService.getHistory(RisksStore.riskId).subscribe(res => {
    //   this.workflowHistoryOpened = true;
    //   this._utilityService.detectChanges(this._cdr);
    //   $(this.workflowHistory.nativeElement).modal('show');
    // });



  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
