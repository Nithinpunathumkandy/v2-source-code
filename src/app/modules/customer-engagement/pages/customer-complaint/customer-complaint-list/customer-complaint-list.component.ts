import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any
@Component({
  selector: 'app-customer-complaint-list',
  templateUrl: './customer-complaint-list.component.html',
  styleUrls: ['./customer-complaint-list.component.scss']
})
export class CustomerComplaintListComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  CustomerComplaintStore = CustomerComplaintStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AuthStore = AuthStore;

  customerComplaintObject = {
    type: null,
    values: null,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  filterSubscription: Subscription = null;

  modalEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  popupControlEventSubscription: any;

  constructor(
    private _customerComplaintService: CustomerComplaintService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _fileUploadPopupService: FileUploadPopupService,
    private _fileService: CustomerEngagementFileServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService

  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CustomerComplaintStore.loaded = false;
      this.pageChange(1);
    })

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_customer_complaint' });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CUSTOMER_COMPLAINT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CUSTOMER_COMPLAINT_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_CUSTOMER_COMPLAINT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_CUSTOMER_COMPLAINT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_CUSTOMER_COMPLAINT', submenuItem: { type: 'export_to_excel' } },

      ]
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100, 'CREATE_CUSTOMER_COMPLAINT')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            CustomerComplaintStore.clearDocumentDetails();// clear document details
            this.addCustomerComplaint();
            break;
          case "template":
            this._customerComplaintService.generateTemplate();
            break;
          case "export_to_excel":
            this._customerComplaintService.exportToExcel();
            break;
          case "search":
            CustomerComplaintStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            CustomerComplaintStore.unsetCustomerComplaints();
            this.pageChange(1)
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addCustomerComplaint();
        NoDataItemStore.unSetClickedNoDataItem();
      }


    })

    this.modalEventSubscription = this._eventEmitterService.addCustomerComplaint.subscribe(res => {
      this.closeFormModal();
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    RightSidebarLayoutStore.filterPageTag = 'customers';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'customer_complaint_type_ids',
      'customer_complaint_source_ids',
      'customer_ids',
      'responsible_user_ids',
      'customer_complaint_status_ids',
    ]);

    this.pageChange();
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  gotoCustomerComplaintDetails(id) {

    CustomerComplaintStore.unsetIndivitualCustomerComplaint();
    if (AuthStore.getActivityPermission(100, 'CUSTOMER_COMPLAINT_DETAILS')) {
      this._router.navigateByUrl('/customer-engagement/complaint/' + id + '/info');
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) CustomerComplaintStore.setCurrentPage(newPage);
    this._customerComplaintService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addCustomerComplaint() {
    this.customerComplaintObject.type = 'Add';
    this.customerComplaintObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  // for opening modal
  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.customerComplaintObject.type = null;
    this.pageChange();
  }


  sortTitle(type: string) {
    this._customerComplaintService.sortCustomerComplaintList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_customer_complaint';
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
      case '': this.deleteCustomerComplaint(status)
        break;
    }

  }

  // delete function call
  deleteCustomerComplaint(status: boolean) {
    if (status && this.popupObject.id) {
      this._customerComplaintService.delete(this.popupObject.id).subscribe(resp => {
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


  editCustomerComplaint(id) {
    event.stopPropagation();
    this._customerComplaintService.getItem(id).subscribe(res => {
      this.CustomerComplaintStore.clearDocumentDetails();
      let ActionDetails = res;
      if (res) {
        this.customerComplaintObject.values = {
          id: ActionDetails.id,
          title: ActionDetails.title,
          responsible_user_id: ActionDetails.responsible_user,
          customer_complaint_source_id: ActionDetails.customer_complaint_source,
          description: ActionDetails.description,
          organization: ActionDetails.organization,
          division: ActionDetails.division,
          department: ActionDetails.department,
          section: ActionDetails.section,
          sub_section: ActionDetails.sub_section,
          branch: ActionDetails.branch,
          customer: ActionDetails.customer,
          customer_complaint_type: ActionDetails.customer_complaint_type,
          receiving_date: ActionDetails.receiving_date,
          is_non_conformity: ActionDetails.is_non_conformity,
          documents: ActionDetails.documents
        }
        this.customerComplaintObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
    })
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CustomerComplaintStore.searchText = null;
    SubMenuItemStore.searchText = '';
    CustomerComplaintStore.unsetCustomerComplaints();
    this.modalEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
