import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { CustomerComplaintActionPlanService } from 'src/app/core/services/customer-satisfaction/customer-complaint-action-plan/customer-complaint-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $:any
@Component({
  selector: 'app-customer-complaint-action-plans-list',
  templateUrl: './customer-complaint-action-plans-list.component.html',
  styleUrls: ['./customer-complaint-action-plans-list.component.scss']
})
export class CustomerComplaintActionPlansListComponent implements OnInit {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  customerComplaintActionPLanObject = {
    type:null,
    values: null,
    page: false,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  filterSubscription: Subscription = null;
  modalEventSubscription:any;
  networkFailureSubscription:any;
  idleTimeoutSubscription: any;
  popupControlEventSubscription: any;
  fileUploadPopupSubscriptionEvent:any;
  
  constructor(
    private _customerComplaintActionPlanService: CustomerComplaintActionPlanService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService

  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof CustomerComplaintActionPlansListComponent
   */
  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CustomerComplaintActionPlanStore.loaded = false;
      this.pageChange(1);
    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_customer_complaint_action_plan'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_ACTION_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'CUSTOMER_COMPLAINT_ACTION_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_CUSTOMER_COMPLAINT_ACTION_PLAN', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_CUSTOMER_COMPLAINT_ACTION_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_ACTION_PLAN', submenuItem: {type: 'export_to_excel'}},

      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_CUSTOMER_COMPLAINT_ACTION_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":        
          this.addCustomerComplaintActionPlan();
          break;
        case "template":
          this._customerComplaintActionPlanService.generateTemplate();
          break;
        case "export_to_excel":
          this._customerComplaintActionPlanService.exportToExcel();
          break;
        case "search":
          CustomerComplaintActionPlanStore.searchText = SubMenuItemStore.searchText;
          this.pageChange(1);
          break;
        case "refresh":
          CustomerComplaintActionPlanStore.unsetCustomerComplaintActionPlans();
          this.pageChange(1)
          break; 
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }
    if(NoDataItemStore.clikedNoDataItem){
      this.addCustomerComplaintActionPlan();
     NoDataItemStore.unSetClickedNoDataItem();
   }
 
  })

  this.modalEventSubscription = this._eventEmitterService.addCustomerComplaintActionPlanModal.subscribe(res => {
    this.closeFormModal();
  });
  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })
  this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
    this.changeZIndex();
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

  RightSidebarLayoutStore.filterPageTag = 'action-plan';
  this._rightSidebarFilterService.setFiltersForCurrentPage([
    'customer_complaint_action_plan_status_ids',
    'responsible_user_ids',
    'customer_complaint_action_type_ids',
    
  ]);

    this.pageChange();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  gotoCustomerComplaintDetails(id){
    this._router.navigateByUrl('/customer-engagement/complaint-action-plan/' + id);
  }

  pageChange(newPage: number = null) {
    if (newPage) CustomerComplaintActionPlanStore.setCurrentPage(newPage);
    this._customerComplaintActionPlanService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  addCustomerComplaintActionPlan(){
    this.customerComplaintActionPLanObject.page = false;
    CustomerComplaintActionPlanStore.setSubMenuHide(false);
    this.customerComplaintActionPLanObject.type = 'Add';
    this.customerComplaintActionPLanObject.values=null;
     this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
    }

  // for opening modal
  openFormModal() {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
  }

  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.customerComplaintActionPLanObject.type = null;
    this.pageChange();
  } 

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }


  sortTitle(type: string) {
    this._customerComplaintActionPlanService.sortCustomerComplaintActionPlanList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'delete_customer_complaint_action_plan';
      this.popupObject.subtitle = 'common_delete_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
  
      // for popup object clearing
      clearPopupObject() {
        this.popupObject.id = null;
      }
  
     // modal control event
     modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.deleteCustomerComplaintActionPlan(status)
          break;
      }
  
    }
  
    // delete function call
    deleteCustomerComplaintActionPlan(status: boolean) {
      if (status && this.popupObject.id) {
        this._customerComplaintActionPlanService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          this.pageChange(1);
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
      this.pageChange();
    }


    editCustomerComplaintActionPlan(id) {
      event.stopPropagation();
      CustomerComplaintActionPlanStore.setSubMenuHide(false);
      this.customerComplaintActionPLanObject.page = false;
      this._customerComplaintActionPlanService.getItem(id).subscribe(res => {
        if(res){
          this.customerComplaintActionPLanObject.values = res;
          this.customerComplaintActionPLanObject.type = 'Edit';
          this._utilityService.detectChanges(this._cdr);
          this.openFormModal();
        }
      })
    }


  

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof CustomerComplaintActionPlansListComponent
   */
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CustomerComplaintActionPlanStore.searchText = null;
    SubMenuItemStore.searchText = '';
    CustomerComplaintActionPlanStore.unsetCustomerComplaintActionPlans();
    this.modalEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
