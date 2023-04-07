import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyInitiativeMilestoneStatusService } from 'src/app/core/services/masters/strategy/strategy-initiative-milestone-status/strategy-initiative-milestone-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyInitiativeMilestoneStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-milestone-status-store';

declare var $: any;

@Component({
  selector: 'app-strategy-initiative-milestone-status',
  templateUrl: './strategy-initiative-milestone-status.component.html',
  styleUrls: ['./strategy-initiative-milestone-status.component.scss']
})
export class StrategyInitiativeMilestoneStatusComponent implements OnInit {

  // @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_storage_location_message';
  StrategyInitiativeMilestoneStatusMasterStore = StrategyInitiativeMilestoneStatusMasterStore;

  strategyInitiativeMilestoneStatusObject = {
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

  // controlStrategyInitiativeMilestoneStatusSubscriptionEvent: any = null;
  popupControlStrategyInitiativeMilestoneStatusEventSubscription: any;
  // idleTimeoutSubscription: any;
  // networkFailureSubscription: any;

  constructor(

    private _strategyInitiativeMilestoneStatusService: StrategyInitiativeMilestoneStatusService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'STRATEGY_INITIATIVE_MILESTONE_STATUS_LIST', submenuItem: { type: 'search' } },
        // { activityName: 'CREATE_STRATEGY_INITIATIVE_MILESTONE_STATUS', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_STRATEGY_INITIATIVE_MILESTONE_STATUS_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_STRATEGY_INITIATIVE_MILESTONE_STATUS', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_STRATEGY_INITIATIVE_MILESTONE_STATUS', submenuItem: { type: 'share' } },
        // { activityName: 'IMPORT_STRATEGY_INITIATIVE_MILESTONE_STATUS', submenuItem: { type: 'import' } },
        {activityName: null, submenuItem: {type: 'close', path: 'strategy-management'}},
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_STRATEGY_INITIATIVE_MILESTONE_STATUS')) {
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
          //   this._strategyInitiativeMilestoneStatusService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._strategyInitiativeMilestoneStatusService.exportToExcel();
            break;
          case "search":
            StrategyInitiativeMilestoneStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
        this._strategyInitiativeMilestoneStatusService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._strategyInitiativeMilestoneStatusService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.popupControlStrategyInitiativeMilestoneStatusEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal

    // this.controlStrategyInitiativeMilestoneStatusSubscriptionEvent = this._eventEmitterService.storageLocation.subscribe(res => {
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
  //   this.strategyInitiativeMilestoneStatusObject.type = 'Add';
  //   this.strategyInitiativeMilestoneStatusObject.values = null; // for clearing the value
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openFormModal();
  // }

  // openFormModal() {
  //   setTimeout(() => {
  //     $(this.formModal.nativeElement).modal('show');
  //   }, 50);
  // }

  pageChange(newPage: number = null) {
    if (newPage) StrategyInitiativeMilestoneStatusMasterStore.setCurrentPage(newPage);
    this._strategyInitiativeMilestoneStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // closeFormModal() {
  //   $(this.formModal.nativeElement).modal('hide');
  //   this.strategyInitiativeMilestoneStatusObject.type = null;
  // }
  // getStrategyInitiativeMilestoneStatus(id: number) {
  //   const StrategyInitiativeMilestoneStatus: StrategyInitiativeMilestoneStatus = StrategyInitiativeMilestoneStatusMasterStore.getStrategyInitiativeMilestoneStatusById(id);
    
  //   this.strategyInitiativeMilestoneStatusObject.values = {
  //     id: StrategyInitiativeMilestoneStatus.id,
  //     title: StrategyInitiativeMilestoneStatus.title
  //   }
  //   this.strategyInitiativeMilestoneStatusObject.type = 'Edit';
  //   this.openFormModal();
  // }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStrategyInitiativeMilestoneStatus(status)
        break;

      case 'Activate': this.activateStrategyInitiativeMilestoneStatus(status)
        break;

      case 'Deactivate': this.deactivateStrategyInitiativeMilestoneStatus(status)
        break;

    }

  }

  // delete function call

  deleteStrategyInitiativeMilestoneStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategyInitiativeMilestoneStatusService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && StrategyInitiativeMilestoneStatusMasterStore.getStrategyInitiativeMilestoneStatusById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

  activateStrategyInitiativeMilestoneStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._strategyInitiativeMilestoneStatusService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateStrategyInitiativeMilestoneStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._strategyInitiativeMilestoneStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate

  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Business Application Type?';
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
    this._strategyInitiativeMilestoneStatusService.sortStrategyInitiativeMilestoneStatusList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchStrategyInitiativeMilestoneStatus(term: string) {
    this._strategyInitiativeMilestoneStatusService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // this.controlStrategyInitiativeMilestoneStatusSubscriptionEvent.unsubscribe();
    this.popupControlStrategyInitiativeMilestoneStatusEventSubscription.unsubscribe();
    StrategyInitiativeMilestoneStatusMasterStore.searchText = '';
    StrategyInitiativeMilestoneStatusMasterStore.currentPage = 1 ;
    // this.idleTimeoutSubscription.unsubscribe();
    // this.networkFailureSubscription.unsubscribe();
  }


}
