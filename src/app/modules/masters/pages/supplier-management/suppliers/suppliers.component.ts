import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Suppliers } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { SupplierFileServiceService } from 'src/app/core/services/supplier-management/supplier-file-service/supplier-file-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';

declare var $: any;

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_supplier_message';
  SuppliersMasterStore = SuppliersMasterStore


  suppliersObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  controlSupplierSubscriptionEvent: any = null;
  popupControlSupplierEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(
    private _suppliersService: SuppliersService,
    private _supplierFileServiceService: SupplierFileServiceService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'suppliers' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'SUPPLIER_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_SUPPLIER', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_SUPPLIER_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_SUPPLIERS', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_SUPPLIER', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_SUPPLIERS', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'supplier-management' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_SUPPLIER')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._suppliersService.generateTemplate();
            break;
          case "export_to_excel":
            this._suppliersService.exportToExcel();
            break;
          case "search":
            SuppliersMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.search_business_application_type(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_suppliers');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_suppliers');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._suppliersService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._suppliersService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }

    })

    // for deleting/activating/deactivating using delete modal

    this.popupControlSupplierEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal

    this.controlSupplierSubscriptionEvent = this._eventEmitterService.supplier.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
    this.pageChange(1);
  }



  addNewItem() {
    this.suppliersObject.type = 'Add';
    this._suppliersService.setFileDetails(null, '', 'logo');
    this.suppliersObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  pageChange(newPage: number = null) {
    if (newPage) SuppliersMasterStore.setCurrentPage(newPage);
    this._suppliersService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.suppliersObject.type = null;
  }
  getSuppliers(id: number) {
    const Suppliers: Suppliers = SuppliersMasterStore.getSuppliersById(id);
    this._suppliersService.setFileDetails(null, '', 'logo');
    if (Suppliers.image_url) {
      var previewUrl = this._supplierFileServiceService.getThumbnailPreview(Suppliers.image_token);
      var logoDetails = {
        name: Suppliers.image_title,
        ext: Suppliers.image_ext,
        size: Suppliers.image_size,
        url: Suppliers.image_url,
        token: Suppliers.image_token,
        preview: previewUrl,
        thumbnail_url: Suppliers.image_url
      };
      this._suppliersService.setFileDetails(logoDetails, previewUrl, 'logo');
    }

    //set form value
    this.suppliersObject.values = {
      id: Suppliers.id,
      title: Suppliers.title,
      mobile: Suppliers.mobile,
      email: Suppliers.email,
      website: Suppliers.website,
      address: Suppliers.address,
      contact_name: Suppliers.contact_name,
      contact_role: Suppliers.contact_role,
      contact_number: Suppliers.contact_number,
      contact_email: Suppliers.contact_email,
      contact_address: Suppliers.contact_address,
      image_ext: Suppliers.image_ext,
      image_size: Suppliers.image_size,
      image_title: Suppliers.image_title,
      image_token: Suppliers.image_token,
      image_url: Suppliers.image_url
    }
    this.suppliersObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteSuppliers(status)
        break;

      case 'Activate': this.activateSuppliers(status)
        break;

      case 'Deactivate': this.deactivateSuppliers(status)
        break;

    }

  }

  // delete function call

  deleteSuppliers(status: boolean) {
    if (status && this.popupObject.id) {
      this._suppliersService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && SuppliersMasterStore.getSuppliersById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
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
  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // calling activcate function

  activateSuppliers(status: boolean) {
    if (status && this.popupObject.id) {

      this._suppliersService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateSuppliers(status: boolean) {
    if (status && this.popupObject.id) {

      this._suppliersService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Supplier?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate

  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Supplier?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Business Application Type?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting

  sortTitle(type: string) {
    //
    this._suppliersService.sortSuppliersList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchBusinessApplicationTypes(term: string) {
    this._suppliersService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlSupplierSubscriptionEvent.unsubscribe();
    this.popupControlSupplierEventSubscription.unsubscribe();
    SuppliersMasterStore.searchText = '';
    SuppliersMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}
