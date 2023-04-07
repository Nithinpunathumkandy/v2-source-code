import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProcessOperationModes } from 'src/app/core/models/masters/bpm/process-operation-modes';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProcessModesMasterService } from 'src/app/core/services/masters/bpm/process-modes/process-modes-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OperationModesMasterStore } from 'src/app/stores/masters/bpm/process-operation-modes.store';
declare var $: any;

@Component({
  selector: 'app-process-operation-mode',
  templateUrl: './process-operation-mode.component.html',
  styleUrls: ['./process-operation-mode.component.scss']
})
export class ProcessOperationModeComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_process_operation_mode_message';
  OperationModesMasterStore = OperationModesMasterStore;

  processOperationModeObject = {
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

  processOperationModeSubscriptionEvent: any = null;
  popUpProcessOperationModeEventSubsceiption: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _processOperationModeService: ProcessModesMasterService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProcessOperationModeComponent
   */
  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', 
    buttonText: 'process_operation_mode' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'PROCESS_OPERATION_MODE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_PROCESS_OPERATION_MODE', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_PROCESS_OPERATION_MODE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_PROCESS_OPERATION_MODE', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_PROCESS_OPERATION_MODE', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_PROCESS_OPERATION_MODE', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bpm' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_PROCESS_OPERATION_MODE')) {
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
            this._processOperationModeService.generateTemplate();
            break;
          case "export_to_excel":
            this._processOperationModeService.exportToExcel();
            break;
          case "search":
            OperationModesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_process_operation_mode');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_process_operation_mode');
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
        this._processOperationModeService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._processOperationModeService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
    this.popUpProcessOperationModeEventSubsceiption = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.processOperationModeSubscriptionEvent = this._eventEmitterService.processOperationMode.subscribe(res => {
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
    this.processOperationModeObject.type = 'Add';
    this.processOperationModeObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  pageChange(newPage: number = null) {
    if (newPage) OperationModesMasterStore.setCurrentPage(newPage);
    this._processOperationModeService.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.processOperationModeObject.type = null;
  }
  getProcessOperationMode(id: number) {
    const ProcessOperationModes: ProcessOperationModes = OperationModesMasterStore.getProcessOperationModesById(id);
    //set form value
    this.processOperationModeObject.values = {
      id: ProcessOperationModes.id,
      title: ProcessOperationModes.title
    }
    this.processOperationModeObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteProcessOperationMode(status)
        break;

      case 'Activate': this.activateProcessOperationMode(status)
        break;

      case 'Deactivate': this.deactivateProcessOperationMode(status)
        break;

    }

  }

  // delete function call
  deleteProcessOperationMode(status: boolean) {
    if (status && this.popupObject.id) {
      this._processOperationModeService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && OperationModesMasterStore.getProcessOperationModesById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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
  }

  // calling activcate function
  activateProcessOperationMode(status: boolean) {
    if (status && this.popupObject.id) {
      this._processOperationModeService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateProcessOperationMode(status: boolean) {
    if (status && this.popupObject.id) {
      this._processOperationModeService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Process Operation Mode?';
    this.popupObject.subtitle = 'are_you_sure_activate';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Process Operation Mode?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Process Operation Mode?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for sorting
  sortTitle(type: string) {
    this._processOperationModeService.sortProcessOperationModesList(type, null);
    this.pageChange();
  }


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProcessOperationModeComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.processOperationModeSubscriptionEvent.unsubscribe();
    this.popUpProcessOperationModeEventSubsceiption.unsubscribe();
    OperationModesMasterStore.searchText = '';
    OperationModesMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
