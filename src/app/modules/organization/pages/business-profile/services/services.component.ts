import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { BusinessServicesService } from "src/app/core/services/organization/business_profile/business_services/business-services.service";
import { BusinessServiceStore } from "src/app/stores/organization/business_profile/business-services.store";
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";

import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

import { ServiceCategoryService } from 'src/app/core/services/masters/organization/service-category/service-category.service';
import { ServiceCategoryMasterStore } from 'src/app/stores/masters/organization/service-category-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import * as introJs from 'intro.js/intro.js'; // importing introjs library

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('serviceCategoryFormModal') serviceCategoryFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('serviceItemsDiv',{static:false}) serviceItemsDiv: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ServiceCategoryMasterStore = ServiceCategoryMasterStore;
  BusinessServiceStore = BusinessServiceStore;

  serviceItem = null;
  serviceItemsList = [];
  serviceItemMessage = null;
  initialLoad: boolean = false;
  serviceSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  filterSubscription: any;
  networkFailureSubscription: any;

  deleteObject = { 
    title: 'Delete Service?',
    subtitle: 'are_you_sure_delete',
    id: null,
    type: ''
  };

  serviceCategoryObject = {
    component: 'Organization',
    values: null,
    type: null
  };

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#new_modal',
      intro: 'Add New Service',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Service List',
      position: 'bottom'
    },
  ]

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, private _businessService: BusinessServicesService,
    private _eventEmitterService: EventEmitterService, private _organizationFileService: OrganizationfileService,
    private _helperService: HelperServiceService,
    private _serviceCategoryService: ServiceCategoryService) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "service_nodata_title", subtitle: 'service_nodata_subtitle', buttonText: 'new_service_button'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CREATE_SERVICE', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_SERVICE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_SERVICE', submenuItem: {type: 'export_to_excel'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_SERVICE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
      }
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.createNewService();
            }, 1000);
            break;
          case "template": 
            var fileDetails = {
              ext: 'xlsx',
              title: 'service_template',
              size: null
            };
            this._organizationFileService.downloadFile('services-template',null,null,fileDetails.title,fileDetails);
            break;
          case "export_to_excel": 
              this._businessService.exportToExcel();              
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.createNewService();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // Event Emitter Subscription from Add Service Category Component
    this.serviceSubscriptionEvent = this._eventEmitterService.serviceCategoryMasterControl.subscribe(res=>{
      this.closeCategoryModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item=>{
      this.delete(item);
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
    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    this.form = this._formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      service_category_id: ['',[Validators.required]],
      service_items: []
    });
    SubMenuItemStore.setNoUserTab(true);
    this.pageChange()
    this.getServiceCategory();
  }

  showIntro(){
    var intro:any = introJs();
    intro.setOptions({
      steps: this.introSteps,
      showBullets: true,
      showButtons: true,
      exitOnOverlayClick: true,
      keyboardNavigation: true,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      nextToDone: true,
      hidePrev: true,
    });
    intro.start();
  }

  pageChange(newPage: number = null){
    if (newPage) BusinessServiceStore.setCurrentPage(newPage);
    this._businessService.getAllItems().subscribe(res=>{
      this.initialLoad = true;
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createNewService(){
    this.serviceItem = null;
    this.serviceItemsList = [];
    this.checkForServiceItemsScrollbar();
    BusinessServiceStore.addOrEditFlag = false;
    this.resetFormDetails();
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  // Open Modal to Add/Edit Service
  openFormModal(){
    $(this.formModal.nativeElement).modal('show');
  }

  // Close Modal
  closeFormModal() {
    AppStore.disableLoading();
    this.resetFormDetails();
    $(this.formModal.nativeElement).modal('hide');
  }

  cancel() {
    this.closeFormModal();
  }

  // Reset Form Details
  resetFormDetails(){
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.serviceItem = null;
    this.serviceItemsList = [];
    this.checkForServiceItemsScrollbar();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.serviceCategoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.serviceCategoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.serviceCategoryFormModal.nativeElement,'overflow','auto');
    }
  }

  // Open Modal Component to Add Service Category
  addServiceCategory(){
    this.serviceCategoryObject.type = 'Add';
    this._renderer2.addClass(this.serviceCategoryFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.serviceCategoryFormModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal Component
  closeCategoryModal(){
    this._renderer2.removeClass(this.serviceCategoryFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.serviceCategoryFormModal.nativeElement,'display','none');
    this.serviceCategoryObject.type = null;
    if(ServiceCategoryMasterStore.lastInsertedId) {
      let serviceCategoryId = JSON.parse(JSON.stringify(ServiceCategoryMasterStore.lastInsertedId))
      this.searchServiceCategory({term: serviceCategoryId})
      this.form.patchValue({service_category_id: serviceCategoryId});
      ServiceCategoryMasterStore.lastInsertedId = null;
    }
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','999999');
    this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * 
   * @param close True or false - Closes Modal Automatically after function
   */
  save(close:boolean=false){ 
    this.formErrors = null;
    if(this.serviceItemsList.length > 0)
      this.form.value.service_items = this.serviceItemsList;
    else
      this.form.value.service_items = [];
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
       save = this._businessService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._businessService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 250);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  /**
   * Edit Service details
   * @param serviceId Service Id
   */
  editService(serviceId){
    BusinessServiceStore.addOrEditFlag = true;
    this._businessService.getItem(serviceId).subscribe(res=>{
      this.resetFormDetails();
      AppStore.disableLoading();
      setTimeout(() => {
        this.form.setValue({
          id: res.id ? res.id : '',
          title: res.title ? res.title : '',
          service_category_id: res.service_category ? res.service_category.id : '',
          description: res.description ? res.description : '',
          service_items: res.service_items ? res.service_items : []
          // service_items: serviceDetails['service_items_string'] ? JSON.parse(serviceDetails['service_items_string']) : []
        });
        this.searchServiceCategory({term: res.service_category.id});
        this.serviceItemsList =  res.service_items
        this.checkForServiceItemsScrollbar();
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 500);
    })
  }

  // Add service Item
  addServiceItem(){
    if(this.serviceItem){
      var itemPosition = this.serviceItemsList.findIndex(e => e.title == this.serviceItem);
      if(itemPosition == -1){
        this.serviceItemsList.push({title: this.serviceItem});
        this.serviceItem = null;
        this._utilityService.detectChanges(this._cdr);
      }
      else{
        // this._utilityService.toast('Service Item Already Added','tl');
        this.serviceItemMessage = 'Service Item Already Added';
        setTimeout(() => {
          this.serviceItemMessage = null;
        }, 2000);
      }
      this.checkForServiceItemsScrollbar();
    }
  }

  /**
   * Remove service item
   * @param position Position of service item
   */
  removeServiceItem(position){
    this.serviceItemsList.splice(position,1);
    this.checkForServiceItemsScrollbar();
  }

  /**
   * Delete service after confirmation
   * @param serviceId Service Id
   */
  deleteService(serviceId){
    this.deleteObject.id = serviceId;
    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status){
    if(status && this.deleteObject.id){
      this._businessService.deleteItem(this.deleteObject.id).subscribe(resp=>{
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);
        this.clearDeleteObject();
      });
    }
    else{
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  clearDeleteObject(){
    this.deleteObject.id = null;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._businessService.clearServicesList();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.serviceSubscriptionEvent.unsubscribe();
    this.networkFailureSubscription.unsubscribe()
    this.introButtonSubscriptionEvent.unsubscribe();
  }

  // Search Service category
  searchServiceCategory(e){
    this._serviceCategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Get Service Category
  getServiceCategory(){
    this._serviceCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  checkForServiceItemsScrollbar(){
    setTimeout(() => {
      if(this.serviceItemsList.length > 0 && $(this.serviceItemsDiv?.nativeElement).height() >= 100){
        $(this.serviceItemsDiv.nativeElement).mCustomScrollbar();
      }
      else{
        if(this.serviceItemsList.length > 0) $(this.serviceItemsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  applicationAccordianClick(index) {
    this.initialLoad = false;
    BusinessServiceStore.servicesDetails.map((e:any,pos) => {
      if(pos == index) e['is_accordion_active'] = !e["is_accordion_active"];
      else e['is_accordion_active'] = false
    });
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
      if($(this.serviceCategoryFormModal.nativeElement).hasClass('show')){
        this.closeCategoryModal();
      }
      else{
        this.cancel();
      }
        
    }
  }
  
}
