import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsRiskMappingService } from 'src/app/core/services/isms/isms-risks/isms-risk-mapping/isms-risk-mapping.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IsmsRiskMappingStore } from 'src/app/stores/isms/isms-risks/isms-risk-mapping.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
declare var $: any;

@Component({
  selector: 'app-isms-risk-mapping',
  templateUrl: './isms-risk-mapping.component.html',
  styleUrls: ['./isms-risk-mapping.component.scss']
})
export class IsmsRiskMappingComponent implements OnInit {
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('locationFormModal') locationFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  // @ViewChild('processModal') processModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  IssueListStore = IssueListStore;
  LocationMasterStore = LocationMasterStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessProductsStore = BusinessProductsStore;
  StrategicObjectiveMasterStore = StrategicObjectivesMasterStore;
  selectedSection = 'control';
  IsmsRisksStore = IsmsRisksStore;
  IsmsRiskMappingStore = IsmsRiskMappingStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  issues = [];
  processes = [];
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };
  modalObject = {
    component : 'risk',
  }

  issueEmptyList = "Looks like risk doesn't mapped with any issue";
  processEmptyList = "Looks like risk doesn't mapped with any process";
  customerModalTitle = 'risk_customer_modal_message';
  projectsModalTitle = 'risk_projects_modal_message';
  // issuesModalTitle = 'risk_issues_modal_message';
  processModalTitle = 'risk_process_modal_message';
  locationModalTitle = 'risk_location_modal_message';
  productModalTitle = 'risk_product_modal_message';
  strategicModalTitle = 'risk_strategic_modal_message';
  controlsModalTitle = 'risk_controls_modal_message';

  chooseSection = 'controls'
  chooseButtonTitle = 'Map ' +this.chooseSection +' with risk';
  issueSelectSubscription: any;
  subscription: any;
  projectSelectSubscription: any;
  locationSelectSubscription: any;
  productSelectSubscription: any;
  controlSelectSubscription: any;
  customerSelectSubscription: any;
  objectiveSelectSubscription:any;
  BusinessProductStore = BusinessProductsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  BusinessCustomersStore = BusinessCustomersStore;
  ControlStore = ControlStore;
  ProcessStore = ProcessStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  constructor(private _riskMappingService: IsmsRiskMappingService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _risksService:IsmsRisksService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if(IsmsRisksStore.individualRiskDetails?.is_corporate){
      var subMenuItems = [
        // { activityName: 'ISSUE_ISMS_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
        // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
      ]
    }
    else{
      subMenuItems = [
        // { activityName: 'ISSUE_ISMS_RISK_MAPPING_CREATE', submenuItem: { type: 'new_modal' } },
        // { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
      ]
    }
      setTimeout(() => {
        // this._usersService.editSubmenu();

      }, 300);

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this.gotoSection(this.selectedSection);
      // NoDataItemStore.setNoDataItems({title: "Looks like we don't have issues added here",subtitle:"To add issue, Simply tap the button below",buttonText:"Add issue"});
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();

        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              // IsmsRisksStore.setEditFlag();
              // this._router.navigateByUrl('/risk-management/risks/edit-risk');
            }, 1000);
            break;
            case "export_to_excel":

              this._riskMappingService.exportToExcel();
              break;
          case "delete":
            // this.deleteRisk(IsmsRisksStore.riskId);
            break;


          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;
    this.getRiskMapping();

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })


    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })

    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })


    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
      this.closeProjects();
    })

    this.locationSelectSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
      this.closeLocations();
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
    this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
      this.closeControls();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    // setTimeout(() => {

    // }, 500);
  }

  changeZIndex(){
    if($(this.issueFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.issueFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.locationFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.locationFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.locationFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.projectFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.projectFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.projectFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.productFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.productFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.productFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.processFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.processFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.customerFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.customerFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.customerFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.objectiveFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.objectiveFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.objectiveFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.controlFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','auto');
    }
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'issue': this.selectIssues(); break;
      case 'location': this.selectLocations(); break;
      case 'project': this.selectProjects(); break;
      case 'control': this.selectControls(); break;
      case 'customer': this.selectCustomers(); break;
      case 'product': this.selectProducts(); break;
      case 'objective': this.selectObjectives(); break;
    }
  }

  getRiskMapping() {
    this._riskMappingService.getItems().subscribe(res => {
      this.setValues(res);
      this._utilityService.detectChanges(this._cdr);
      // setTimeout(() => {

      // }, 100);

    })
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

    for (let i of projectItem) {
      i['project_manager_first_name'] = i.project_manager?.first_name;
      i['project_manager_last_name'] = i.project_manager?.last_name;
      i['project_manager_image_token'] = i.project_manager?.image_token;
      i['location_title'] = i.location?.title;
      IsmsRiskMappingStore.projects.push(i);
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
        this.chooseSection ='issues';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'process':
        this.chooseSection ='processes';
        if (IsmsRisksStore.individualRiskDetails?.is_analysis_performed != 1 && IsmsRisksStore.individualRiskDetails?.risk_status?.type != 'closed' && IsmsRisksStore.isProperEditUser()) {
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
        }
        else {
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "process_mapping_restriction" });
        }
        break;
      case 'location':
        this.chooseSection ='locations';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_locations" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'project':
        this.chooseSection ='projects';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_projects" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'product':
        this.chooseSection ='products';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'customer':
        this.chooseSection ='customers';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_customers" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'objective':
        this.chooseSection ='objectives';
        if (IsmsRisksStore.isProperEditUser())
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_strategic_objectives" });
        else
          NoDataItemStore.setNoDataItems({ title: "", subtitle: "common_no_data_mapping" });
        break;
      case 'control':
        this.chooseSection ='controls';
        if (IsmsRisksStore.individualRiskDetails?.is_analysis_performed != 1 && IsmsRisksStore.individualRiskDetails?.risk_status?.type != 'closed' && IsmsRisksStore.isProperEditUser()) {
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
        }
        else {
          NoDataItemStore.setNoDataItems({ title: "common_no_data_mapping", subtitle: "control_mapping_restriction" })
        }
        break;
    }
    this.chooseButtonTitle = 'Map ' + this.chooseSection + ' with risk';
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  // Opens Modal to Select Processes
  selectProcesses() {
    ProcessStore.saveSelected=false;
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
      this._riskMappingService.saveProcessForMapping(saveData).subscribe(res => {
        
        this.getRiskMapping();
        this.getRisk();
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
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
  selectLocations() {
    LocationMasterStore.saveSelected = false;
    LocationMasterStore.selectedLocationList = IsmsRiskMappingStore.locations;
    LocationMasterStore.location_select_form_modal = true;
    $(this.locationFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }
  selectProjects() {
    BusinessProjectsStore.saveSelected=false;
    BusinessProjectsStore.selectedProjectList = IsmsRiskMappingStore.projects;
    BusinessProjectsStore.project_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectProducts() {
    BusinessProductsStore.saveSelected=false;
    BusinessProductsStore.selectedProductList = IsmsRiskMappingStore.products;
    BusinessProductsStore.product_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectCustomers() {
    BusinessCustomersStore.saveSelected=false;
    BusinessCustomersStore.selectedCustomerList = IsmsRiskMappingStore.customers;
    BusinessCustomersStore.customer_select_form_modal = true;
    $(this.customerFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectObjectives() {
    StrategicObjectivesMasterStore.saveSelected=false;
    StrategicObjectivesMasterStore.selectedStrategic = IsmsRiskMappingStore.objectives;
    StrategicObjectivesMasterStore.objective_select_form_modal = true;
    $(this.objectiveFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectControls() {
    ControlStore.saved=false;
    ControlStore.selectedControlsList = IsmsRiskMappingStore.controls;
    ControlStore.control_select_form_modal = true;
    $(this.controlFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  getRisk(){
    this._risksService.getItem(IsmsRisksStore.riskId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Close Modal to select issues
  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      IssueListStore.saveSelected = false;
      this._riskMappingService.saveIssueForMapping(saveData).subscribe(res => {
       
        this.getRiskMapping();
       
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      IssueListStore.issue_select_form_modal = false;
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }
  // Close Modal to select issues
  closeLocations() {
    if (LocationMasterStore?.saveSelected) {
      let saveData = {
        location_ids: this.getIds(LocationMasterStore?.selectedLocationList)
      }
      LocationMasterStore.saveSelected = false;
      this._riskMappingService.saveLocationForMapping(saveData).subscribe(res => {
        
        this.getRiskMapping();
        LocationMasterStore.location_select_form_modal = false;
        $(this.locationFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      LocationMasterStore.location_select_form_modal = false;
      $(this.locationFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }


  // Close Modal to select issues
  closeProjects() {
    if (BusinessProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
      }
      BusinessProjectsStore.saveSelected = false;
      this._riskMappingService.saveProjectForMapping(saveData).subscribe(res => {
       
        this.getRiskMapping();
        BusinessProjectsStore.project_select_form_modal = false;
        $(this.projectFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      BusinessProjectsStore.project_select_form_modal = false;
      $(this.projectFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeControls() {
    if (ControlStore?.saved) {
      let saveData = {
        control_ids: this.getIds(ControlStore?.selectedControlsList)
      }
      ControlStore.saved = false;
      this._riskMappingService.saveControlForMapping(saveData).subscribe(res => {
        
        this.getRiskMapping();
        this.getRisk();
        ControlStore.control_select_form_modal = false;
        this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',9);
        this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','none');
        $(this.controlFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      ControlStore.control_select_form_modal = false;
      $(this.controlFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeProducts() {
    if (BusinessProductsStore?.saveSelected) {
      let saveData = {
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      }
      BusinessProductsStore.saveSelected = false;
      this._riskMappingService.saveProductForMapping(saveData).subscribe(res => {
        
        this.getRiskMapping();
        BusinessProductsStore.product_select_form_modal = false;
        $(this.productFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      BusinessProductsStore.product_select_form_modal = false;
      $(this.productFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeCustomers() {
    if (BusinessCustomersStore?.saveSelected) {
      let saveData = {
        customer_ids: this.getIds(BusinessCustomersStore?.selectedCustomerList)
      }
      BusinessCustomersStore.saveSelected = false;
      this._riskMappingService.saveCustomerForMapping(saveData).subscribe(res => {
       
        this.getRiskMapping();
        BusinessCustomersStore.customer_select_form_modal = false;
        $(this.customerFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      BusinessCustomersStore.customer_select_form_modal = false;
      $(this.customerFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeObjectives() {
    if (StrategicObjectivesMasterStore?.saveSelected) {
      let saveData = {
        strategic_objective_ids: this.getIds(StrategicObjectivesMasterStore?.selectedStrategic)
      }
      StrategicObjectivesMasterStore.saveSelected = false;
      this._riskMappingService.saveObjectiveForMapping(saveData).subscribe(res => {
        
        this.getRiskMapping();
        StrategicObjectivesMasterStore.objective_select_form_modal = false;
        $(this.objectiveFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getRiskMapping();
      StrategicObjectivesMasterStore.objective_select_form_modal = false;
      $(this.objectiveFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }



  deleteProcessMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;

  }
  deleteIssueMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteLocationMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'location';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }


  deleteProjectMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'project';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteProductMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteControlMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'control';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteCustomerMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'customer';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }

  
  deleteObjectiveMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'objective';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation"

    $(this.deletePopup.nativeElement).modal('show');
  }


  /**
* Delete the risk
* @param id -risk id
*/
  delete(status) {
    let deleteId = [];

    let deleteData;
    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);
      let data = null;
      switch (this.deleteObject.title) {

        case 'process':
          data = {
            is_deleted: true,
            process_ids: deleteId
          }

          deleteData = this._riskMappingService.deleteProcessMapping(data)
          break;
        case 'issue':
          data = {
            is_deleted: true,
            organization_issue_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteIssueMapping(data)
          break;
        case 'location':
          data = {
            is_deleted: true,
            location_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteLocationMapping(data)
          break;
        case 'project':
          data = {
            is_deleted: true,
            project_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteProjectMapping(data)
          break;
        case 'product':
          data = {
            is_deleted: true,
            product_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteProductMapping(data)
          break;
        case 'customer':
          data = {
            is_deleted: true,
            customer_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteCustomerMapping(data)
          break;
        case 'control':
          data = {
            is_deleted: true,
            control_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteControlMapping(data)
          break;
          case 'objective':
          data = {
            is_deleted: true,
            strategic_objective_ids: deleteId
          }
          deleteData = this._riskMappingService.deleteObjectiveMapping(data)
          break;
      }

      deleteData.subscribe(resp => {
        this.getRiskMapping()
        this._utilityService.detectChanges(this._cdr);

        this.clearDeleteObject();

      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }


  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    NoDataItemStore.unsetNoDataItems();
    this.deleteEventSubscription.unsubscribe();
    this.issueSelectSubscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.locationSelectSubscription.unsubscribe();
    this.customerSelectSubscription.unsubscribe();
    this.controlSelectSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.objectiveSelectSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();

  }


}
