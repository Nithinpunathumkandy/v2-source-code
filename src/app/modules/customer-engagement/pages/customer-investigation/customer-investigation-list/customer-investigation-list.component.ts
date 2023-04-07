import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { CustomerInvestigationService } from 'src/app/core/services/customer-satisfaction/customer-investigation/customer-investigation.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-customer-investigation-list',
  templateUrl: './customer-investigation-list.component.html',
  styleUrls: ['./customer-investigation-list.component.scss']
})
export class CustomerInvestigationListComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  CustomerInvestigationStore = CustomerInvestigationStore;


  customerInvestigationObject = {
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
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  constructor(
    private _customerInvestigationService: CustomerInvestigationService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _renderer2: Renderer2,
    private _customerComplaintService: CustomerComplaintService,
    private _router: Router,
    private _fileService: CustomerEngagementFileServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService

  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CustomerInvestigationStore.loaded = false;
      this.pageChange(1);
    })

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_complaint_investigation' });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_INVESTIGATION_LIST', submenuItem: {type: 'search'}},
        {activityName: 'CUSTOMER_COMPLAINT_INVESTIGATION_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_CUSTOMER_COMPLAINT_INVESTIGATION', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_CUSTOMER_COMPLAINT_INVESTIGATION_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_INVESTIGATION', submenuItem: {type: 'export_to_excel'}},

      ]
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100, 'CREATE_CUSTOMER_COMPLAINT_INVESTIGATION')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            // CustomerInvestigationStore.clearDocumentDetails();// clear document details
            this.addCustomerInvestigation();
            break;
          case "template":
            this._customerInvestigationService.generateTemplate();
            break;
          case "export_to_excel":
            this._customerInvestigationService.exportToExcel();
            break;
          case "search":
            CustomerInvestigationStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            CustomerInvestigationStore.unsetCustomerInvestigationList();
            this.pageChange(1)
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addCustomerInvestigation();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this.modalEventSubscription = this._eventEmitterService.addCustomerInvestigation.subscribe(res => {
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

    RightSidebarLayoutStore.filterPageTag = 'investigation';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'customer_complaint_investigation_status_ids',
    ]);

    this.pageChange();
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) CustomerInvestigationStore.setCurrentPage(newPage);
    this._customerInvestigationService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addCustomerInvestigation() {
    CustomerInvestigationStore.setSubMenuHide(false);
    this.customerInvestigationObject.type = 'Add';
    this.customerInvestigationObject.values = null;
    // this.CustomerComplaintStore.clearDocumentDetails();
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
    this.customerInvestigationObject.type = null;
    this.pageChange();
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_customer_investigation';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCustomerInvestigation(status)
        break;
    }

  }

  // delete function call
  deleteCustomerInvestigation(status: boolean) {
    if (status && this.popupObject.id) {
      this._customerInvestigationService.delete(this.popupObject.id).subscribe(resp => {
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

  sortTitle(type: string) {
    this._customerInvestigationService.sortCustomerInvestigationList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  editCustomerInvestigation(id) {
    CustomerInvestigationStore.setSubMenuHide(false);
    event.stopPropagation();
    this._customerInvestigationService.getItem(id).subscribe(res => {
      this.CustomerInvestigationStore.clearDocumentDetails();
      let ActionDetails = res;
      if (res) {
        setTimeout(() => {
          if (ActionDetails.documents.length > 0) {
            this.setDocuments(ActionDetails.documents)
          }
        }, 200);
        this.customerInvestigationObject.values = {
          id: ActionDetails.id,
          // title: ActionDetails.customer_complaint.title,  
          description: ActionDetails.description,
          customer_complaint_id: ActionDetails.customer_complaint.title,
          is_previous_non_conformity: ActionDetails.is_previous_non_conformity,

        }
        this.customerInvestigationObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
    })
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._fileService.getThumbnailPreview('customer-investigation-document', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    console.log('qwert', submitedDocuments);

    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }
  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CustomerInvestigationStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this.popupControlEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}
