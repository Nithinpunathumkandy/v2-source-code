import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetMappingService } from 'src/app/core/services/asset-management/asset-register/asset-mapping/asset-mapping.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMappingStore } from 'src/app/stores/asset-management/asset-register/asset-mapping-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;

@Component({
  selector: 'app-asset-mapping',
  templateUrl: './asset-mapping.component.html',
  styleUrls: ['./asset-mapping.component.scss']
})
export class AssetMappingComponent implements OnInit {
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('businessApplicationFormModal') businessApplicationFormModal: ElementRef;
  @ViewChild('serviceFormModal') serviceFormModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('productFormModal') productFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  IssueListStore = IssueListStore;
  BusinessProjectsStore = BusinessProjectsStore;
  BusinessProductsStore = BusinessProductsStore;
  BusinessApplicationsMasterStore = BusinessApplicationsMasterStore;
  BusinessServiceStore = BusinessServiceStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  
  selectedSection = 'process';
  AssetRegisterStore = AssetRegisterStore;
  AssetMappingStore = AssetMappingStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  issues = [];
  processes = [];
  businessApplications= [];
  services= [];

  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  modalObject = {
    component : 'asset',
  }

  issueEmptyList = "Looks like asset doesn't mapped with any issue";
  processEmptyList = "Looks like asset doesn't mapped with any process";
  // projectsModalTitle = 'risk_projects_modal_message';
  // issuesModalTitle = 'asset_issues_modal_message';
  // businessApplicationModalTitle = 'asset_business_application_modal_message';
  // processModalTitle = 'asset_process_modal_message';
  // productModalTitle = 'asset_product_modal_message';
  // serviceModalTitle = 'asset_service_modal_message';

  chooseButtonTitle = 'Map ' +this.selectedSection +' with asset';

  issueSelectSubscription: any;
  businessApplicationSelectSubscription: any;
  serviceSelectSubscription: any;
  subscription: any;
  projectSelectSubscription: any;
  productSelectSubscription: any;
  BusinessProductStore = BusinessProductsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  ProcessStore = ProcessStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,
    private _assetMappingService:AssetMappingService,
    private _imageService: ImageServiceService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '/asset-management/assets' } },
      ]
      setTimeout(() => {
        // this._usersService.editSubmenu();
      }, 300);

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      this.gotoSection(this.selectedSection);
      // NoDataItemStore.setNoDataItems({title: "Looks like we don't have issues added here",subtitle:"To add issue, Simply tap the button below",buttonText:"Add issue"});
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // this.gotoSection(this.selectedSection);
    //   if (NoDataItemStore.clikedNoDataItem) {
    //     this.openSelectPopup();
    //     NoDataItemStore.unSetClickedNoDataItem();
    //   }
  
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;
    this.getAssetMapping();

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      this.closeIssues();
    })

    this.businessApplicationSelectSubscription = this._eventEmitterService.businessApplicationSelect.subscribe(item => {
      this.closeBusinessApplications();
    })

    this.serviceSelectSubscription = this._eventEmitterService.serviceSelect.subscribe(item => {
      this.closeService();
    })

    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })


    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
      this.closeProjects();
    })

    this.productSelectSubscription = this._eventEmitterService.productControl.subscribe(item => {
      this.closeProducts();
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
  }

  changeZIndex(){
    if($(this.issueFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.issueFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.issueFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.businessApplicationFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement,'overflow','auto');
    }
    else if($(this.serviceFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.serviceFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.serviceFormModal.nativeElement,'overflow','auto');
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
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': 
      this.selectProcesses();
       break;
      case 'issue': this.selectIssues(); break;
      case 'business-application': this.selectBusinessApplication(); break;
      case 'service': this.selectServices(); break;
      case 'project': this.selectProjects(); break;
      case 'product': this.selectProducts(); break;
    }
  }

  getAssetMapping() {
    this._assetMappingService.getItems().subscribe(res => {
      this.setValues(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }


  setValues(AssetMapping) {
    IssueListStore.selectedIssuesList = [];
    ProcessStore.selectedProcessesList = [];
    BusinessProjectsStore.selectedProjectList = [];
    BusinessProductsStore.selectedProductList = [];
    BusinessApplicationsMasterStore.selectedBusinessApplicationsList = [];
    BusinessServiceStore.selectedBusinessServicesList = [];

    AssetMappingStore.projects = [];
    AssetMappingStore.products = [];
    this.issues = [];
    this.processes = [];
    this.businessApplications = [];
    this.services = [];

    let processItem = AssetMapping.processes;
    let issueItem = AssetMapping.organization_issues;
    let projectItem = AssetMapping.projects;
    let businessApplicationItem = AssetMapping.business_applications;
    this.services = AssetMapping.services;
    AssetMappingStore.products = AssetMapping.products;

    for (let p of processItem) {
      p['process_group_title'] = p.process_group.title;
      p['department'] = p.department.title;
      // p['process_category']=p.process_category.title;
      this.processes.push(p);
    }

    for (let b of businessApplicationItem) {
      b['business_application_type_title'] = b.business_application_type?.language[0]?.pivot?.title;
      this.businessApplications.push(b);
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
      AssetMappingStore.projects.push(i);
    }


    this._utilityService.detectChanges(this._cdr);

  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  gotoSection(type) {
    this.selectedSection = type;
    this.chooseButtonTitle = 'Map ' +this.selectedSection +' with asset';
    switch (type) {
      case 'issue':
        // if(AssetRegisterStore.isProperEditUser())
        NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_issues" });
        // else
        // NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping"});
        break;

      case 'business-application':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_business_applications" });
        break;

      case 'service':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_services" });
        break;

      case 'process':
        // if (RisksStore.individualRiskDetails?.is_analysis_performed != 1 && RisksStore.individualRiskDetails?.risk_status?.type!='closed' && RisksStore.isProperEditUser()) {
          NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_processes" });
        // }
        // else {
        //   NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle:"process_mapping_restriction" });
        // }
        break;

      case 'project':
        // if(RisksStore.isProperEditUser())
        NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_projects" });
        // else
        // NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping"});
        break;

      case 'product':
        // if(RisksStore.isProperEditUser())
        NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_products" });
        // else
        // NoDataItemStore.setNoDataItems({ title: "common_no_data_asset_mapping"});
        break;  
    }
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
      this._assetMappingService.saveProcessForMapping(saveData).subscribe(res => {
        
        this.getAssetMapping();
        this.getAsset();
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
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

  selectBusinessApplication() {
    BusinessApplicationsMasterStore.saveSelected = false;
    BusinessApplicationsMasterStore.selectedBusinessApplicationsList = this.businessApplications;
    BusinessApplicationsMasterStore.business_application_select_form_modal = true;
    $(this.businessApplicationFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement, 'display', 'block');
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

  selectProjects() {
    BusinessProjectsStore.saveSelected=false;
    BusinessProjectsStore.selectedProjectList = AssetMappingStore.projects;
    BusinessProjectsStore.project_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  selectProducts() {
    BusinessProductsStore.saveSelected=false;
    BusinessProductsStore.selectedProductList = AssetMappingStore.products;
    BusinessProductsStore.product_select_form_modal = true;
    $(this.productFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  getAsset(){
    // this._risksService.getItem(RisksStore.riskId).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  // Close Modal to select issues
  closeIssues() {
    if (IssueListStore?.saveSelected) {
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      IssueListStore.saveSelected = false;
      this._assetMappingService.saveIssueForMapping(saveData).subscribe(res => {
       
        this.getAssetMapping();
       
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
      IssueListStore.issue_select_form_modal = false;
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();


  }

  // Close Modal to select Business Applications
  closeBusinessApplications() {
    if (BusinessApplicationsMasterStore.saveSelected) {
      let saveData = {
        business_application_ids: this.getIds(BusinessApplicationsMasterStore?.selectedBusinessApplicationsList)
      }
      BusinessApplicationsMasterStore.saveSelected = false;
      this._assetMappingService.saveBusinessApplicationForMapping(saveData).subscribe(res => {
       
        this.getAssetMapping();
        BusinessApplicationsMasterStore.business_application_select_form_modal = false;
        $(this.businessApplicationFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
      BusinessApplicationsMasterStore.business_application_select_form_modal = false;
      $(this.businessApplicationFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.businessApplicationFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select service
  closeService() {
    if (BusinessServiceStore.saveSelected) {
      let saveData = {
        service_ids: this.getIds(BusinessServiceStore?.selectedBusinessServicesList)
      }
      BusinessServiceStore.saveSelected = false;
      this._assetMappingService.saveServiceForMapping(saveData).subscribe(res => {
       
        this.getAssetMapping();
        BusinessServiceStore.service_select_form_modal = false;
        $(this.serviceFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
      BusinessServiceStore.service_select_form_modal = false;
      $(this.serviceFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.serviceFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select issues
  closeProjects() {
    if (BusinessProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
      }
      BusinessProjectsStore.saveSelected = false;
      this._assetMappingService.saveProjectForMapping(saveData).subscribe(res => {
       
        this.getAssetMapping();
        BusinessProjectsStore.project_select_form_modal = false;
        $(this.projectFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
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
      this._assetMappingService.saveProductForMapping(saveData).subscribe(res => {
        
        this.getAssetMapping();
        BusinessProductsStore.product_select_form_modal = false;
        $(this.productFormModal.nativeElement).modal('hide');

        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getAssetMapping();
      BusinessProductsStore.product_select_form_modal = false;
      $(this.productFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.productFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

  }

  deleteProcessMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'process';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
  }

  deleteIssueMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteServiceMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'service';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteBusinessApplicationsMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'business-application';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteProjectMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'project';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

  deleteProductMapping(id) {
    this.deleteObject.id = id;
    this.deleteObject.title = 'product';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "detach_item_confirmation_asset"

    $(this.deletePopup.nativeElement).modal('show');
  }

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

          deleteData = this._assetMappingService.deleteProcessMapping(data)
          break;
        case 'issue':
          data = {
            is_deleted: true,
            organization_issue_ids: deleteId
          }
          deleteData = this._assetMappingService.deleteIssueMapping(data)
          break;
        case 'business-application':
          data = {
            is_deleted: true,
            business_application_ids: deleteId
          }
          deleteData = this._assetMappingService.deleteBusinessApplicationMapping(data)
          break;
        case 'service':
          data = {
            is_deleted: true,
            service_ids: deleteId
          }
          deleteData = this._assetMappingService.deleteServiceMapping(data)
          break;
        case 'project':
          data = {
            is_deleted: true,
            project_ids: deleteId
          }
          deleteData = this._assetMappingService.deleteProjectMapping(data)
          break;
        case 'product':
          data = {
            is_deleted: true,
            product_ids: deleteId
          }
          deleteData = this._assetMappingService.deleteProductMapping(data)
          break; 
      }

      deleteData.subscribe(resp => {
        this.getAssetMapping()
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
    this.businessApplicationSelectSubscription.unsubscribe();
    this.serviceSelectSubscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.productSelectSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
  }

}
