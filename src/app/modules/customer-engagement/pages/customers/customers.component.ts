import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { CustomersService } from 'src/app/core/services/customer-satisfaction/customers/customers.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Customers } from 'src/app/core/models/customer-satisfaction/customers/customers';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $:any;
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  customersStore = CustomersStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;

  customersObject = {
    type: null,
    values: null
  }

   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  filterSubscription: Subscription = null;

  deleteEventSubscription: any;
  customersSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _customersService: CustomersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router : Router,
    private _organizationFileService: OrganizationfileService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.customersStore.loaded = false;
      this.pageChange(1);
    })
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_customer'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CUSTOMER_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_CUSTOMER', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_CUSTOMER_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CUSTOMER', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'import'}}
      ]

      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_CUSTOMER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addCustomer();
            }, 1000);
            break;
          case "template":
            this._customersService.generateTemplate();
            break;
          case "export_to_excel":
            this._customersService.exportToExcel();
            break;
            case "search":
              CustomersStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "refresh":
              CustomersStore.unsetCustomersList();
              this.pageChange(1)
              break;
              case "import":
              ImportItemStore.setTitle('import_customer');
              ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addCustomer();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._customersService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }

      // RightSidebarLayoutStore.filterPageTag = 'customers';
      // this._rightSidebarFilterService.setFiltersForCurrentPage([
      //   'organization_ids',
      //   'division_ids',
      //   'department_ids',
      //   'section_ids',
      //   'sub_section_ids',
      //   'process_group_ids',
      //   'process_category_ids',
      //   'risk_rating_ids',
      //   'accountable_user_ids',
      //   'responsible_user_ids',
      //   'consulted_user_ids',
      //   'informed_user_ids',
      // ]);
      // this.pageChange(1);
    })

    this.customersSubscriptionEvent = this._eventEmitterService.customers.subscribe((res:any)=>{
      this.closeFormModal();
      if(res) this._router.navigateByUrl('/customer-engagement/customer/' + res?.id); //navigate|customers
      // this._router.navigateByUrl('/customer-engagement/customer/' + res?.id); //navigate|customers
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalCustomer(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.pageChange(1);
  }
  gotoCustomersDetails(id){
    this._router.navigateByUrl('/customer-engagement/customer/' + id);
  }

  addCustomer(){
    this.customersObject.type = 'Add';
    this.customersObject.values = null; // for clearing the value
    this._customersService.setFileDetails(null,'','logo');
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) CustomersStore.setCurrentPage(newPage);
    this._customersService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Customer event
modalCustomer(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteCustomer(status)
      break;

    case 'Activate': this.activateCustomer(status)
      break;

    case 'Deactivate': this.deactivateCustomer(status)
      break;

  }

}


 // delete function call
 deleteCustomer(status: boolean) {
  if (status && this.popupObject.id) {
    this._customersService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && CustomersStore.getCustomersById(this.popupObject.id).status_id == AppStore.activeStatusId){
        let id = this.popupObject.id;
        this.closeConfirmationPopUp();
        this.clearPopupObject();
        setTimeout(() => {
          this.deactivate(id);
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }
      else{
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }
    })
    );
  }
  else {
    this.closeConfirmationPopUp();
    this.clearPopupObject();
  }
}

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
}

// calling activcate function

activateCustomer(status: boolean) {
  if (status && this.popupObject.id) {

    this._customersService.activate(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);

}

// calling deactivate function

deactivateCustomer(status: boolean) {
  if (status && this.popupObject.id) {

    this._customersService.deactivate(this.popupObject.id).subscribe(resp => {
 
        this._utilityService.detectChanges(this._cdr);
      
      this.clearPopupObject();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);

}

// for activate 
activate(id: number) {
 event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_customer';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_customer';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_customer';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.customersObject.type = null;
  }

  // delete(id: number) {
  //   if (confirm("Are you sure to delete " + id)) {
  //     this._customersService.delete(id).subscribe();
  //   }
  // }

  
  
    /**
   * Get particular ControType item
   * @param id  id of ControType 
   */
  getCustomer(id: number) {
    event.stopPropagation()
    this._customersService.setFileDetails(null,'','logo');
    const Customer: Customers = CustomersStore.getCustomersById(id);
    if(Customer.hasOwnProperty('image_token') && Customer.image_token){
      var previewUrl = this._organizationFileService.getThumbnailPreview('customer-logo',Customer.image_token);
      var logoDetails = {
                        name: Customer['image_title'], 
                        ext: Customer['image_ext'],
                        size: Customer['image_size'],
                        url: Customer['image_url'],
                        token: Customer['image_token'],
                        preview: previewUrl,
                        thumbnail_url: Customer['image_url']
                    };
      // this._organizationCustomerService.setFileDetails(logoDetails,previewUrl,'logo');
      this._customersService.setFileDetails(logoDetails,previewUrl,'logo');
    } 
    //set form value
    this.customersObject.values = {
      id : Customer.id,
      title: Customer.title,
      contact_person_number: Customer.contact_person_number,
      contact_person: Customer.contact_person,
      email: Customer.email,
      website: Customer.website,
      contact_person_role: Customer.contact_person_role,
      mobile: Customer.mobile,
      contact_person_email: Customer.contact_person_email,
      address: Customer.address,
    }
    this.customersObject.type = 'Edit';
    this.openFormModal();
   // setTimeout(() => this.titleInput.nativeElement.focus(), 150);
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.customersSubscriptionEvent.unsubscribe();
    CustomersStore.searchText = '';
    CustomersStore.unsetCustomersList();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

   // for sorting
 sortTitle(type: string) {
  // CustomersStore.setCurrentPage(1);
  this._customersService.sortCustomersList(type, SubMenuItemStore.searchText);
  this.pageChange();
}



}
