import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerMappingService } from 'src/app/core/services/customer-satisfaction/customer-mapping/customer-mapping.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerMappingStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-mapping-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $:any;
@Component({
  selector: 'app-customer-complaint-mapping',
  templateUrl: './customer-complaint-mapping.component.html',
  styleUrls: ['./customer-complaint-mapping.component.scss']
})
export class CustomerComplaintMappingComponent implements OnInit {
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('locationFormModal') locationFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('customerFormModal') customerFormModal: ElementRef;
  @ViewChild('objectiveFormModal') objectiveFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  issues = [];
  processes = [];
  selectedSection = 'control';
  reactionDisposer: IReactionDisposer

  AppStore = AppStore;
  AuthStore = AuthStore;
  ControlStore = ControlStore;
  ProcessStore = ProcessStore;
  IssueListStore = IssueListStore;
  LocationMasterStore = LocationMasterStore;
  BusinessProjectsStore = BusinessProjectsStore;
  StrategicObjectiveMasterStore = StrategicObjectivesMasterStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessCustomersStore = BusinessCustomersStore;
  OrganizationModulesStore = OrganizationModulesStore;
  CustomerMappingStore = CustomerMappingStore;
  CustomerComplaintStore = CustomerComplaintStore;

  controlsModalTitle = 'controls_modal_message';
  processModalTitle = 'process_modal_message';
  customerModalTitle = 'customer_modal_message';
  projectsModalTitle = 'projects_modal_message';
  locationModalTitle = 'location_modal_message';
  productModalTitle = 'product_modal_message';
  strategicModalTitle = 'strategic_modal_message';

  modalObject = {
    component : 'customer compliant',
  }
  
  controlSubscription:any;
  processSubscription: any;
  locationSubscription: any;
  projectSubscription: any;
  productSubscription: any;
  customerSubscription: any;
  objectiveSubscription: any;
  deleteEventSubscription:any;

  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  constructor(
    private _mappingService: CustomerMappingService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _customerComplaintService: CustomerComplaintService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {
    this.getMappingDetails()
    this.checkForInitialTab();
    this.gotoSection(this.selectedSection);
    CustomerMappingStore.loaded=false;
    
    this.reactionDisposer = autorun(() => {
      if(NoDataItemStore.clikedNoDataItem){
        this.openSelectPopup();
       NoDataItemStore.unSetClickedNoDataItem();
     }
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
  })

    this.controlSubscription = this._eventEmitterService.commonModal.subscribe(item => {
      this.closeControls();
    })

    this.processSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })

    this.projectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
      this.closeProjects();
    })

    this.locationSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
      this.closeLocations();
    })

    this.productSubscription = this._eventEmitterService.productControl.subscribe(item => {
      this.closeProducts();
    })
    this.customerSubscription = this._eventEmitterService.customerControl.subscribe(item => {
      this.closeCustomers();
    })
    this.objectiveSubscription = this._eventEmitterService.strategicObjectivesMapping.subscribe(item => {
      this.closeObjectives();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
  }

  getMappingDetails(){
    this._mappingService.getCustomerMapping().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
        this.setValues(res);
    });
  }


  checkForInitialTab(){
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(600,11501)){
      this.selectedSection = 'control';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(600,12801)){
      this.selectedSection = 'process';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(1100,801)){
      this.selectedSection = 'location';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21301)){
      this.selectedSection = 'project';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,2901)){
      this.selectedSection = 'product';
    }
    else if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,21201)){
      this.selectedSection = 'customer';
    }
    else{
      this.selectedSection = 'objective';
    }
    this._utilityService.detectChanges(this._cdr);
  }



 
  setValues(Mapping) {
   
    ProcessStore.selectedProcessesList = [];
    BusinessProjectsStore.selectedProjectList = [];
    LocationMasterStore.selectedLocationList = [];
    ControlStore.selectedControlsList = [];
    BusinessCustomersStore.selectedCustomerList = [];
    BusinessProductsStore.selectedProductList = [];
    StrategicObjectivesMasterStore.selectedStrategic = [];
    CustomerMappingStore.projects = [];
    CustomerMappingStore.locations = [];
    CustomerMappingStore.controls = [];
    CustomerMappingStore.customers = [];
    CustomerMappingStore.products = [];
    CustomerMappingStore.objectives = [];
    this.issues = [];
    this.processes = [];
    
    let processItem = Mapping.processes;
    let issueItem = Mapping.organization_issues;
    let projectItem = Mapping.projects;
    CustomerMappingStore.locations = Mapping.locations;
    CustomerMappingStore.products = Mapping.products;
    CustomerMappingStore.customers = Mapping.customers;
    CustomerMappingStore.objectives = Mapping.strategic_objectives;
    CustomerMappingStore.controls = Mapping.controls;


    for (let p of processItem) {
      p['process_group_title'] = p.process_group.title;
      p['department'] = p.department.title;
      // p['process_category']=p.process_category.title;
      this.processes.push(p);
    }


    for (let i of projectItem) {
      i['project_manager_first_name'] = i.project_manager?.first_name;
      i['project_manager_last_name'] = i.project_manager?.last_name;
      i['project_manager_image_token'] = i.project_manager?.image_token;
      i['location_title'] = i.location?.title;
      CustomerMappingStore.projects.push(i);
    }
    this._utilityService.detectChanges(this._cdr);
 

  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'control':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_control_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_controls" });
        break;
      case 'process':    
          NoDataItemStore.setNoDataItems({ title: "common_no_data_process_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
        break;
      case 'location':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_location_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_locations" });
        break;
      case 'project':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_project_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_projects" });
        break;

      case 'product':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_product_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        break;

      case 'customer':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_customer_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_customer" });
        break;

      case 'objective':         
        NoDataItemStore.setNoDataItems({ title: "common_no_data_objective_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_strategic_objective" });
        break;

     
    }

  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'control': this.selectControl(); break;
      case 'location': this.selectLocations(); break;
      case 'project': this.selectProjects(); break;
      case 'customer': this.selectCustomers(); break;
      case 'product': this.selectProducts(); break;
      case 'objective': this.selectObjectives(); break;
    }
  }

  selectControl() {
    ControlStore.saved=false;
    ControlStore.selectedControlsList = CustomerMappingStore.controls;
    ControlStore.control_select_form_modal = true;
    $(this.controlFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectProcesses() {
    ProcessStore.saveSelected=false;
    ProcessStore.selectedProcessesList = this.processes;
    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    // $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  selectLocations() {
    LocationMasterStore.saveSelected = false;
    LocationMasterStore.selectedLocationList = CustomerMappingStore.locations;
    LocationMasterStore.location_select_form_modal = true;
    $(this.locationFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectProjects() {
    BusinessProjectsStore.saveSelected=false;
    BusinessProjectsStore.selectedProjectList = CustomerMappingStore.projects;
    BusinessProjectsStore.project_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectProducts() {
    BusinessProductsStore.saveSelected=false;
    BusinessProductsStore.selectedProductList = CustomerMappingStore.products;
    BusinessProductsStore.product_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectCustomers() {
    BusinessCustomersStore.saveSelected=false;
    BusinessCustomersStore.selectedCustomerList = CustomerMappingStore.customers;
    BusinessCustomersStore.customer_select_form_modal = true;
    $(this.customerFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.customerFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  selectObjectives() {
    StrategicObjectivesMasterStore.saveSelected=false;
    StrategicObjectivesMasterStore.selectedStrategic = CustomerMappingStore.objectives;
    StrategicObjectivesMasterStore.objective_select_form_modal = true;
    $(this.objectiveFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  closeControls() {
    if (ControlStore?.saved) {
      let saveData = {
        control_ids: this.getIds(ControlStore?.selectedControlsList)
      }
      ControlStore.saved = false;
      this._mappingService.saveControlForMapping(saveData).subscribe(res => {
        
        this.getMappingDetails()  
        this.getCustomerComplaint();
        ControlStore.control_select_form_modal = false;
        this._renderer2.setStyle(this.controlFormModal.nativeElement,'z-index',9);
        this._renderer2.setStyle(this.controlFormModal.nativeElement,'overflow','none');
        $(this.controlFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
      ControlStore.control_select_form_modal = false;
      $(this.controlFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeProcesses() {
    if (ProcessStore?.saveSelected) {
      let saveData = {
        process_ids: this.getIds(ProcessStore?.selectedProcessesList)
      }
      ProcessStore.saveSelected = false;
      this._mappingService.saveProcessForMapping(saveData).subscribe(res => {
        
        this.getMappingDetails()  
        this.getCustomerComplaint();
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()  
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }

    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

  }

  closeLocations() {
    if (LocationMasterStore?.saveSelected) {
      let saveData = {
        location_ids: this.getIds(LocationMasterStore?.selectedLocationList)
      }
      LocationMasterStore.saveSelected = false;
      this._mappingService.saveLocationForMapping(saveData).subscribe(res => {
        
        this.getMappingDetails()
        LocationMasterStore.location_select_form_modal = false;
        $(this.locationFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
      LocationMasterStore.location_select_form_modal = false;
      $(this.locationFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  closeProjects() {
    if (BusinessProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
      }
      BusinessProjectsStore.saveSelected = false;
      this._mappingService.saveProjectForMapping(saveData).subscribe(res => {
       
        this.getMappingDetails()
        BusinessProjectsStore.project_select_form_modal = false;
        $(this.projectFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
      BusinessProjectsStore.project_select_form_modal = false;
      $(this.projectFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }


  closeProducts() {
    if (BusinessProductsStore?.saveSelected) {
      let saveData = {
        product_ids: this.getIds(BusinessProductsStore?.selectedProductList)
      }
      BusinessProductsStore.saveSelected = false;
      this._mappingService.saveProductForMapping(saveData).subscribe(res => {
        
        this.getMappingDetails()
        BusinessProductsStore.product_select_form_modal = false;
        $(this.productFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
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
      this._mappingService.saveCustomerForMapping(saveData).subscribe(res => {
       
        this.getMappingDetails()
        BusinessCustomersStore.customer_select_form_modal = false;
        $(this.customerFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
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
      this._mappingService.saveObjectiveForMapping(saveData).subscribe(res => {
        
        this.getMappingDetails()
        StrategicObjectivesMasterStore.objective_select_form_modal = false;
        $(this.objectiveFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getMappingDetails()
      StrategicObjectivesMasterStore.objective_select_form_modal = false;
      $(this.objectiveFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.objectiveFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  getCustomerComplaint(){
    this._customerComplaintService.getItem(CustomerComplaintStore.selectedCustomerComplaintId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  delete(status) {
    let deleteId = [];

    let deleteData;
    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);
      let data = null;
      switch (this.deleteObject.title) {

        case 'control':
          data = {
            is_deleted: true,
            control_ids: deleteId
          }
          deleteData = this._mappingService.deleteControlMapping(data)
          break;
        case 'process':
          data = {
            is_deleted: true,
            process_ids: deleteId
          }

          deleteData = this._mappingService.deleteProcessMapping(data)
          break;
        case 'location':
          data = {
            is_deleted: true,
            location_ids: deleteId
          }
          deleteData = this._mappingService.deleteLocationMapping(data)
          break;
        case 'project':
          data = {
            is_deleted: true,
            project_ids: deleteId
          }
          deleteData = this._mappingService.deleteProjectMapping(data)
          break;
        case 'product':
          data = {
            is_deleted: true,
            product_ids: deleteId
          }
          deleteData = this._mappingService.deleteProductMapping(data)
          break;
        case 'customer':
          data = {
            is_deleted: true,
            customer_ids: deleteId
          }
          deleteData = this._mappingService.deleteCustomerMapping(data)
          break;
      
          case 'objective':
          data = {
            is_deleted: true,
            strategic_objective_ids: deleteId
          }
          deleteData = this._mappingService.deleteObjectiveMapping(data)
          break;
      }

      deleteData.subscribe(resp => {
        this.getMappingDetails();
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

  clearDeleteObject() {
    this.deleteObject.id = null;
  }

  deleteControlMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'control';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "control_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  deleteProcessMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "process_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  deleteLocationMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'location';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "location_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }


  deleteProjectMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'project';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "project_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  deleteProductMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "product_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  deleteCustomerMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'customer';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "customer_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  
  deleteObjectiveMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'objective';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "objective_delete_subtitle"
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250); 
  }

  ngOnDestry(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.controlSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.processSubscription.unsubscribe();
    this.objectiveSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    CustomerMappingStore.unsetCustomerComplaintMapping();
    SubMenuItemStore.makeEmpty();
    CustomerMappingStore.loaded=false;
  }
}
