import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentMappingService } from 'src/app/core/services/incident-management/incident-mapping/incident-mapping.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
declare var $: any;

@Component({
  selector: 'app-incident-mapping',
  templateUrl: './incident-mapping.component.html',
  styleUrls: ['./incident-mapping.component.scss']
})
export class IncidentMappingComponent implements OnInit {
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('asssetFormModal') asssetFormModal: ElementRef;
  @ViewChild('riskFormModal') riskFormModal: ElementRef;

  OrganizationModulesStore = OrganizationModulesStore;
  IncidentStore = IncidentStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  IssueListStore = IssueListStore;
  ProcessStore = ProcessStore;
  ControlStore = ControlStore
  BusinessCustomersStore = BusinessCustomersStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessProductsStore = BusinessProductsStore
  StrategicObjectiveMasterStore = StrategicObjectivesMasterStore;
  BusinessServiceStore = BusinessServiceStore;
  AssetRegisterStore = AssetRegisterStore;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;
  MappingStore = MappingStore;

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  modalObject = {
    component : 'incident',
  }

  selectedSection = 'issue';
  issues = [];
  processes = [];
  services= [];
  issueSelectSubscription: any;
  subscription: any;
  projectSelectSubscription: any;
  customerSelectSubscription: any;
  selectedTab: any = null;
  deleteEventSubscription: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;
  objectiveSelectSubscription:any;
  controlSelectSubscription:any;
  productSelectSubscription:any;
  serviceSelectSubscription: any;
  assetsSelectSubscription: any;
  riskSelectSubscription: any;
  risk=[];
  constructor(private _incidentService : IncidentService,  private _utilityService: UtilityService,
              private  _cdr: ChangeDetectorRef,private _renderer2: Renderer2, 
              private _incidentMappingService : IncidentMappingService,     private _eventEmitterService: EventEmitterService,
              private _humanCapitalService: HumanCapitalService,
              private _imageService: ImageServiceService, private _helperService:HelperServiceService
              ) { }

  ngOnInit(): void {
   this.getIncidentMappingDetails(IncidentStore.selectedId)
   this.checkForInitialTab();
  //  this.gotoSection(this.selectedSection);
   this.reactionDisposer = autorun(() => {
    if(NoDataItemStore.clikedNoDataItem){
      this.openSelectPopup();   
      NoDataItemStore.unSetClickedNoDataItem();
   }

   })

     SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../incidents' }

    ]);

 this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
  this.closeIssues();
})

this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
  this.closeProcesses();
})

this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
  this.closeProjects();
})

this.customerSelectSubscription = this._eventEmitterService.customerControl.subscribe(item => {
  this.closeCustomers();
})
this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
  this.delete(item);
});

this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
  this.closeProducts();
})

this.controlSelectSubscription = this._eventEmitterService.commonModal.subscribe(item => {
  this.closeControls();
})

this.objectiveSelectSubscription = this._eventEmitterService.strategicObjectivesMapping.subscribe(item => {
  this.closeObjectives();
})

this.riskSelectSubscription = this._eventEmitterService.riskSelect.subscribe(item => {
  this.closeRisks();
})

this.assetsSelectSubscription = this._eventEmitterService.assetsMappingModal.subscribe(item => {
  this.saveMappedAssets();
})

this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
  if(!status){
    this.changeZIndex();
  }
  })
  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
  if(!status){
    this.changeZIndex();
  }
  })
  this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
    this.closeService();
  })

  }

  checkForInitialTab(){
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21901)){
      this.selectedTab = 'issue';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(600,12801)){
      this.selectedTab = 'process';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21301)){
      this.selectedTab = 'project';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21201)){
      this.selectedTab = 'customer';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(600,11501)){
      this.selectedTab = 'control'
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,2901)){
      this.selectedTab = 'product'
    }
    else if(OrganizationModulesStore.checkOrganizationModules(3200)){
      this.selectedTab = 'objective'
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(3300,54301)){
      this.selectedTab = 'asset'
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,3201)){
      this.selectedTab = 'service'
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,24401)){
      this.selectedTab = 'risk'
    }
    this.selectedSection = this.selectedTab;
    this.gotoSection(this.selectedSection);
    this._utilityService.detectChanges(this._cdr);
  }

  switchTab(tab){
    this.selectedTab = tab;
    this._utilityService.detectChanges(this._cdr);
  }

  getIncidentMappingDetails(id){
    this._incidentMappingService.getIncidentIssueMaping(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      this.setValues(res);
    })
  }

  changeZIndex(){
		if($(this.processFormModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.processFormModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.processFormModal.nativeElement,'overflow','auto');
		}
		if($(this.issueFormModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.issueFormModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.issueFormModal.nativeElement,'overflow','auto');
		}
    if($(this.projectFormModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.projectFormModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.projectFormModal.nativeElement,'overflow','auto');
		}
    if($(this.customerFormModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.customerFormModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.customerFormModal.nativeElement,'overflow','auto');
		}
	  }

  setValues(MRMMapping){
    //IncidentStore.mappingItemList.controls=[]
    //IncidentStore.mappingItemList.products=[]
    //IncidentStore.mappingItemList.Strategic_objectives=[]
    // if(IncidentStore.mappingItemList.loaded){
      let processItem=MRMMapping.processes;
      let issueItem=MRMMapping.organization_issues;
      this.services = MRMMapping.services;
      this.risk=MRMMapping.risks;
      // this.risk=MRMMapping.risks;

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

  getArrayProcessed(itemArray) {
    if (typeof itemArray === 'object') {
      return this._helperService.getArrayProcessed(itemArray, 'title').toString();
    }
    else {
      return itemArray;
    }
  }

  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'issue':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issue" });
        break;
      case 'process':
        
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });

        break;
      case 'location':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_location" });
        break;
      case 'project':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_projects" });
        break;

      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        break;

      case 'customer':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_customer" });
        break;

      case 'control':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
        break;

      case 'objective':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_strategic_objectives" });
        break;

      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_service" });
        break;

      case 'asset':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_asset" });
        break;

      case 'risk':
        NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_risk",subtitle:"mapped_subtitle_risk",buttonText:"add_risk"});
        break;
    }
    

  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'issue': this.selectIssues(); break;
      // case 'location': this.selectLocations(); break;
      case 'project': this.selectProjects(); break;
      case 'control': this.selectControls(); break;
      case 'customer': this.selectCustomers(); break;
      case 'product': this.selectProducts(); break;
      case 'objective': this.selectObjectives(); break;
      case 'asset': this.selectAssests(); break;
      case 'service': this.selectServices(); break;
      case 'risk' : this.selectRisk(); break;


    }
  }

  selectIssues() {
    IssueListStore.saveSelected = false;
    IssueListStore.selectedIssuesList = IncidentStore.mappingItemList.organization_issues;
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }


  deleteIssueMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incidenta_issue"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }
  deleteServiceMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'service';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incident_service"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  deleteProcessMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incident_process"

    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);
      }
  deleteProjectMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'project';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incident_project"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
     }, 250); 
  }

  deleteCustomerMapping(id){//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'customer';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incident_customer"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);  
  }
  
  deleteProductMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_incident_product"
    $(this.confirmationPopUp.nativeElement).modal('show');
}

    deleteControlMapping(id) {
      this.deleteObject.id = id;
      this.deleteObject.title = 'control';
      this.deleteObject.type = '';
      this.deleteObject.subtitle = "delete_incident_control"
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    deleteObjectiveMapping(id) {
      this.deleteObject.id = id;
      this.deleteObject.title = 'objective';
      this.deleteObject.type = '';
      this.deleteObject.subtitle = "delete_incident_objective"
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    deleteAssetMapping(id) {
      this.deleteObject.id = id;
      this.deleteObject.title = 'asset';
      this.deleteObject.type = '';
      this.deleteObject.subtitle = "delete_incident_asset"
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    deleteRiskMapping(id){//delete
      this.deleteObject.id = id;
      this.deleteObject.title = 'risk';
      this.deleteObject.type = '';
      this.deleteObject.subtitle = 'incident_risk_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

  selectProjects() {
    BusinessProjectsStore.saveSelected=false;
    BusinessProjectsStore.selectedProjectList = IncidentStore.mappingItemList.projects;
    BusinessProjectsStore.project_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.projectFormModal.nativeElement,'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);

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
              deleteData = this._incidentMappingService.deleteProcessMapping(data1);
          break;
        case 'issue':
              let data2 = {
                is_deleted:true,
                organization_issue_ids:deleteId
              };
              deleteData = this._incidentMappingService.deleteIssueMapping(data2);
          break;
        case 'project':
            let data3 = {
              is_deleted:true,
              project_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteProjectMapping(data3);
          break;
          case 'customer':
            let data4 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteCustomerMapping(data4);
          break;
          case 'control':
            let data5 = {
              is_deleted:true,
              control_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteControlMapping(data5);
          break;
          case 'product':
            let data6 = {
              is_deleted:true,
              product_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteProductMapping(data6);
          break;
          case 'objective':
            let data7 = {
              is_deleted:true,
              strategic_objective_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteObjectivetMapping(data7);
          break;

          case 'service':
            let data8 = {
              is_deleted:true,
              service_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteServicetMapping(data8);
          break;

          case 'asset':
            let data9 = {
              is_deleted:true,
              asset_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteAssetMapping(data9);
          break;

          case 'risk':
            let data10 = {
              is_deleted:true,
              risk_ids:deleteId
            };
            deleteData = this._incidentMappingService.deleteRiskMapping(data10);
          break;
      }

      // if(this.deleteObject.title=='process'){
      //   let data = {
      //     is_deleted:true,
      //     process_ids:deleteId
      //   }
      //   deleteData = this._mappingService.deleteProcessMapping(data);

      // }if(this.deleteObject.title=='issue'){
      //   let data = {
      //     is_deleted:true,
      //     organization_issue_ids:deleteId
      //   }
      //   deleteData = this._mappingService.deleteIssueMapping(data);

      // }else{
      //   let data = {
      //     is_deleted:true,
      //     risk_ids:deleteId
      //   }
      //   deleteData = this._mappingService.deleteRiskMapping(data)
      // }
      deleteData.subscribe(resp => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)
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

  selectProcesses() {
    ProcessStore.saveSelected=false;
    ProcessStore.selectedProcessesList = IncidentStore.mappingItemList.processes;
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    // $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  selectCustomers() {
    BusinessCustomersStore.saveSelected=false;
    BusinessCustomersStore.selectedCustomerList = IncidentStore.mappingItemList.customers;
    BusinessCustomersStore.customer_select_form_modal = true;
    $(this.customerFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProducts() {
    BusinessProductsStore.saveSelected=false;
    BusinessProductsStore.selectedProductList = IncidentStore.mappingItemList.products;
    BusinessProductsStore.product_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectAssests() {
		AssetRegisterStore.assets_select_form_modal = true
		AssetRegisterStore.selectedAssets = IncidentStore.mappingItemList.assets;
		$(this.asssetFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.asssetFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  closeAssets() {
		AssetRegisterStore.assets_select_form_modal = false;
		$(this.asssetFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.asssetFormModal.nativeElement, 'display', 'none');
		$('.modal-backdrop').remove();
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

  selectRisk(){
    MeetingPlanStore.selectedRiskList = this.risk;
    MappingStore.risk_select_form_modal = true;
    $(this.riskFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'z-inndex', '99999');
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  saveMappedAssets(){
    if(AssetRegisterStore?.saveSelected){
      let saveData={
        asset_ids: this.getIds(AssetRegisterStore?.selectedAssets)
      };
      this._incidentMappingService.saveAssetForMapping(saveData).subscribe(res=>{
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        this.closeAssets();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeAssets();
        }
      })
      )
    }
    else{
      this.getIncidentMappingDetails(IncidentStore.selectedId)
      this.closeAssets();
    }
  }

  // Close Modal to select issues
  closeRisks() {
    if (MappingStore?.saveSelected) {
      let saveData = {
        risk_ids: this.getIds(MeetingPlanStore?.selectedRiskList)
      }
      this._incidentMappingService.saveRiskMapping(saveData).subscribe(res => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        MappingStore.risk_select_form_modal = false;
        $(this.riskFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getIncidentMappingDetails(IncidentStore.selectedId)
      MappingStore.risk_select_form_modal = false;
      $(this.riskFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.riskFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeService() {
    if (BusinessServiceStore.saveSelected) {
      let saveData = {
        service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
      }
      BusinessServiceStore.saveSelected = false;
      this._incidentMappingService.saveServicesForMapping(saveData).subscribe(res => {
       
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        BusinessServiceStore.service_select_form_modal = false;
        $(this.serviceFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getIncidentMappingDetails(IncidentStore.selectedId)
      BusinessServiceStore.service_select_form_modal = false;
      $(this.serviceFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  closeProducts(){
    if(BusinessProductsStore?.saveSelected){
      let saveData={
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      };
      this._incidentMappingService.saveProductsForMapping(saveData).subscribe(res=>{
        //this.getMapping();
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        this.closeProductsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeProductsMappingModal();
        }
      })
      )
    }
    else{
      //this.getMapping();
      this.getIncidentMappingDetails(IncidentStore.selectedId)
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

  selectObjectives() {
    StrategicObjectivesMasterStore.saveSelected=false;
    StrategicObjectivesMasterStore.selectedStrategic = IncidentStore.mappingItemList.Strategic_objectives;
    StrategicObjectivesMasterStore.objective_select_form_modal = true;
    $(this.objectiveFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeObjectives(){
    if(StrategicObjectivesMasterStore?.saveSelected){
      let saveData={
        strategic_objective_ids: this.getIds(StrategicObjectivesMasterStore?.selectedStrategic)
      };
      this._incidentMappingService.saveObjectiveForMapping(saveData).subscribe(res=>{
        //this.getMapping();
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        this.closeObjectivesMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeObjectivesMappingModal();
        }
      })
      )
    }
    else{
      //this.getMapping();
      this.getIncidentMappingDetails(IncidentStore.selectedId)
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

  selectControls() {
    ControlStore.saved=false;
    ControlStore.selectedControlsList = IncidentStore.mappingItemList.controls;
    ControlStore.control_select_form_modal = true;
    $(this.controlFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeControls() {
    
    if(ControlStore?.saveSelected){
      let saveData={
        control_ids: this.getIds(ControlStore?.selectedControlsList)
      };
      this._incidentMappingService.saveControlsForMapping(saveData).subscribe(res=>{
        //this.getMapping();
        this.getIncidentMappingDetails(IncidentStore.selectedId)
        this.closeControlsMappingModal();
      },(error =>{
        if(error.status == 500 || error.status == 404){
          this.closeControlsMappingModal();
        }
      })
      )
    }
    else{
      //this.getMapping();
      this.getIncidentMappingDetails(IncidentStore.selectedId)
      this.closeControlsMappingModal();
    }
    
  }

  closeControlsMappingModal(){
    ControlStore.control_select_form_modal = false;
    $(this.controlFormModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    ControlStore.saveSelected =  false;
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove(); 
  }

  // Close Modal to select issues
  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._incidentMappingService.saveIssueForMapping(saveData).subscribe(res => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)       
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      // this.getRiskMapping();
      IssueListStore.issue_select_form_modal = false;
      this.getIncidentMappingDetails(IncidentStore.selectedId)       
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
      this._incidentMappingService.saveProcessForMapping(saveData).subscribe(res => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)       
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getIncidentMappingDetails(IncidentStore.selectedId)       
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }


    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

  }

  // Close Modal to select issues
  closeProjects() {
    if (BusinessProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
      }
      this._incidentMappingService.saveProjectForMapping(saveData).subscribe(res => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)       
        BusinessProjectsStore.project_select_form_modal = false;
        $(this.projectFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getIncidentMappingDetails(IncidentStore.selectedId)       
      BusinessProjectsStore.project_select_form_modal = false;
      $(this.projectFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeCustomers() {
    if (BusinessCustomersStore?.saveSelected) {
      let saveData = {
        customer_ids: this.getIds(BusinessCustomersStore?.selectedCustomerList)
      }
      this._incidentMappingService.saveCustomerForMapping(saveData).subscribe(res => {
        this.getIncidentMappingDetails(IncidentStore.selectedId)       
        BusinessCustomersStore.customer_select_form_modal = false;
        $(this.customerFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getIncidentMappingDetails(IncidentStore.selectedId)       
      BusinessCustomersStore.customer_select_form_modal = false;
      $(this.customerFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'none');
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

  select(row){
    console.log(row);
    
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.issueSelectSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.customerSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    IncidentStore.searchText=null;
    SubMenuItemStore.searchText = '';
    this.objectiveSelectSubscription.unsubscribe();
    this.controlSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.serviceSelectSubscription.unsubscribe();
    this.assetsSelectSubscription.unsubscribe();
  }

}
