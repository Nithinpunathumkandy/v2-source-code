import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditManagementLikelihoodService } from 'src/app/core/services/masters/audit-management/audit-management-likelihood/audit-management-likelihood.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditManagementLikelihoodMasterStore } from 'src/app/stores/masters/audit-management/audit-management-likelihood-store';
declare var $: any;

@Component({
  selector: 'app-audit-management-likelihood',
  templateUrl: './audit-management-likelihood.component.html',
  styleUrls: ['./audit-management-likelihood.component.scss']
})
export class AuditManagementLikelihoodComponent implements OnInit {

  // @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_am_likelihood_message';
  AuditManagementLikelihoodMasterStore = AuditManagementLikelihoodMasterStore;

  auditManagementLikelihoodObject = {
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

  // controlAuditManagementLikelihoodMasterStoreSubscriptionEvent: any = null;
  popupControlAuditManagementLikelihoodMasterStoreEventSubscription: any;
  // idleTimeoutSubscription: any;
  // networkFailureSubscription: any;

  constructor(

    private _auditManagementLikelihoodService: AuditManagementLikelihoodService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'AM_LIKELIHOOD_LIST', submenuItem: { type: 'search' } },
        // { activityName: 'CREATE_AM_LIKELIHOOD', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_AM_LIKELIHOOD_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_AM_LIKELIHOOD', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_AM_LIKELIHOOD', submenuItem: { type: 'share' } },
        // { activityName: 'IMPORT_AM_LIKELIHOOD', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'audit-management' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_AM_LIKELIHOOD')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   setTimeout(() => {
          //     this.addNewItem();
          //   }, 1000);
          //   break;
          // case "template":
          //   this._auditManagementLikelihoodService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditManagementLikelihoodService.exportToExcel();
            break;
          case "search":
            AuditManagementLikelihoodMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.search_business_application_type(SubMenuItemStore.searchText);
            break;
          // case "share":
          //   ShareItemStore.setTitle('share_storage_locations');
          //   ShareItemStore.formErrors = {};
          //   break;
          // case "import":
          //   ImportItemStore.setTitle('import_storage_locations');
          //   ImportItemStore.setImportFlag(true);
          //   break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        // this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._auditManagementLikelihoodService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._auditManagementLikelihoodService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.popupControlAuditManagementLikelihoodMasterStoreEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal

    // this.controlAuditManagementLikelihoodMasterStoreSubscriptionEvent = this._eventEmitterService.storageLocation.subscribe(res => {
    //   this.closeFormModal();
    // })

    // this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
    //   if (!status && $(this.formModal.nativeElement).hasClass('show')) {
    //     this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
    //     this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    //   }
    // })

    // this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
    //   if (!status && $(this.formModal.nativeElement).hasClass('show')) {
    //     this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
    //     this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    //   }
    // })


    this.pageChange(1);
  }
  // addNewItem() {
  //   this.auditManagementLikelihoodObject.type = 'Add';
  //   this.auditManagementLikelihoodObject.values = null; // for clearing the value
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openFormModal();
  // }

  // openFormModal() {
  //   setTimeout(() => {
  //     $(this.formModal.nativeElement).modal('show');
  //   }, 50);
  // }

  pageChange(newPage: number = null) {
    if (newPage) AuditManagementLikelihoodMasterStore.setCurrentPage(newPage);
    this._auditManagementLikelihoodService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // closeFormModal() {
  //   $(this.formModal.nativeElement).modal('hide');
  //   this.auditManagementLikelihoodObject.type = null;
  // }
  // getAuditManagementLikelihoodMasterStore(id: number) {
  //   const AuditManagementLikelihoodMasterStore: AuditManagementLikelihoodMasterStore = AuditManagementLikelihoodMasterStore.getAuditManagementLikelihoodMasterStoreById(id);

  //   this.auditManagementLikelihoodObject.values = {
  //     id: AuditManagementLikelihoodMasterStore.id,
  //     title: AuditManagementLikelihoodMasterStore.title
  //   }
  //   this.auditManagementLikelihoodObject.type = 'Edit';
  //   this.openFormModal();
  // }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditManagementLikelihoodMasterStore(status)
        break;

      case 'Activate': this.activateAuditManagementLikelihoodMasterStore(status)
        break;

      case 'Deactivate': this.deactivateAuditManagementLikelihoodMasterStore(status)
        break;

    }

  }

  // delete function call

  deleteAuditManagementLikelihoodMasterStore(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditManagementLikelihoodService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && AuditManagementLikelihoodMasterStore.getAuditManagementLikelihoodById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

  activateAuditManagementLikelihoodMasterStore(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditManagementLikelihoodService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditManagementLikelihoodMasterStore(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditManagementLikelihoodService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Business Application Type?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate

  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Business Application Type?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Business Application Type?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting

  sortTitle(type: string) {
    //
    this._auditManagementLikelihoodService.sortAuditManagementLikelihoodList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchAuditManagementLikelihoodMasterStore(term: string) {
    this._auditManagementLikelihoodService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // this.controlAuditManagementLikelihoodMasterStoreSubscriptionEvent.unsubscribe();
    this.popupControlAuditManagementLikelihoodMasterStoreEventSubscription.unsubscribe();
    AuditManagementLikelihoodMasterStore.searchText = '';
    AuditManagementLikelihoodMasterStore.currentPage = 1;
    // this.idleTimeoutSubscription.unsubscribe();
    // this.networkFailureSubscription.unsubscribe();
  }


}
