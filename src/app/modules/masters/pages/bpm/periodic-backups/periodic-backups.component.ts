import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { PeriodicBackup } from 'src/app/core/models/bpm/process/advance-process';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { PeriodicBackupService } from 'src/app/core/services/masters/bpm/periodic-backup/periodic-backup.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { PeriodicBackupMasterStore } from 'src/app/stores/masters/bpm/periodic-backup.store';
declare var $: any;

@Component({
  selector: 'app-periodic-backups',
  templateUrl: './periodic-backups.component.html',
  styleUrls: ['./periodic-backups.component.scss']
})
export class PeriodicBackupsComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_periodic_backup_message';
  PeriodicBackupMasterStore = PeriodicBackupMasterStore;

  periodicBackupObject = {
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

  controlPeriodicBackupSubscriptionEvent: any = null;
  popupControlPeriodicBackupEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _periodicBackupService: PeriodicBackupService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'periodic_backup' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'PERIODIC_BACKUP_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_PERIODIC_BACKUP', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_PERIODIC_BACKUP_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_PERIODIC_BACKUP', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_PERIODIC_BACKUP', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_PERIODIC_BACKUP', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bpm' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_PERIODIC_BACKUP')) {
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
            this._periodicBackupService.generateTemplate();
            break;
          case "export_to_excel":
            this._periodicBackupService.exportToExcel();
            break;
          case "search":
            PeriodicBackupMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.search_business_application_type(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_periodic_backup');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_periodic_backup');
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
        this._periodicBackupService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._periodicBackupService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.popupControlPeriodicBackupEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal

    this.controlPeriodicBackupSubscriptionEvent = this._eventEmitterService.periodicBackup.subscribe(res => {
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
    this.periodicBackupObject.type = 'Add';
    this.periodicBackupObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  pageChange(newPage: number = null) {
    if (newPage) PeriodicBackupMasterStore.setCurrentPage(newPage);
    this._periodicBackupService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.periodicBackupObject.type = null;
  }
  getPeriodicBackup(id: number) {
    const PeriodicBackup: PeriodicBackup = PeriodicBackupMasterStore.getPeriodicBackupById(id);
    //set form value
    this.periodicBackupObject.values = {
      id: PeriodicBackup.id,
      title: PeriodicBackup.title
    }
    this.periodicBackupObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deletePeriodicBackup(status)
        break;

      case 'Activate': this.activatePeriodicBackup(status)
        break;

      case 'Deactivate': this.deactivatePeriodicBackup(status)
        break;

    }

  }

  // delete function call

  deletePeriodicBackup(status: boolean) {
    if (status && this.popupObject.id) {
      this._periodicBackupService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && PeriodicBackupMasterStore.getPeriodicBackupById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

  activatePeriodicBackup(status: boolean) {
    if (status && this.popupObject.id) {

      this._periodicBackupService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivatePeriodicBackup(status: boolean) {
    if (status && this.popupObject.id) {

      this._periodicBackupService.deactivate(this.popupObject.id).subscribe(resp => {
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
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Periodic Backup?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Periodic Backup?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Periodic Backup?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting

  sortTitle(type: string) {
    //
    this._periodicBackupService.sortPeriodicBackupList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchPeriodicBackup(term: string) {
    this._periodicBackupService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlPeriodicBackupSubscriptionEvent.unsubscribe();
    this.popupControlPeriodicBackupEventSubscription.unsubscribe();
    PeriodicBackupMasterStore.searchText = '';
    PeriodicBackupMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}
