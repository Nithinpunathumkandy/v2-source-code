import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HighAvialabilityStatusService } from 'src/app/core/services/masters/bpm/high-availability-status/high-avialability-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HighAvailabilityStatusMasterStore } from 'src/app/stores/masters/bpm/high-availabilty-status.store';
declare var $: any;
@Component({
  selector: 'app-high-availability-status',
  templateUrl: './high-availability-status.component.html',
  styleUrls: ['./high-availability-status.component.scss']
})
export class HighAvailabilityStatusComponent implements OnInit {

  // @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  // @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer:IReactionDisposer;
  // mailConfirmationData = 'share_business_application_type_message';
  HighAvailabilityStatusMasterStore = HighAvailabilityStatusMasterStore;
  
  AuthStore = AuthStore;
  AppStore = AppStore;

  // controlHighAvailabilityStatusSubscriptionEvent: any = null;
  // popupControlHighAvailabilityStatusEventSubscription: any;
  // idleTimeoutSubscription: any;
  // networkFailureSubscription: any;

  // popupObject = {
  //   type: '',
  //   title: '',
  //   id: null,
  //   subtitle: ''
  // };


  constructor(
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _highAvialabilityStatusService:HighAvialabilityStatusService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        // { activityName: 'HIGH_AVAILABILITY_STATUS_LIST', submenuItem: { type: 'search' } },
        // { activityName: 'CREATE_HIGH_AVAILABILITY_STATUSES', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_HIGH_AVAILABILITY_STATUSES_TEMPLATE', submenuItem: { type: 'template' } },
        // { activityName: 'EXPORT_HIGH_AVAILABILITY_STATUSES', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_HIGH_AVAILABILITY_STATUSES', submenuItem: { type: 'share' } },
        // { activityName: 'IMPORT_HIGH_AVAILABILITY_STATUSES', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bpm' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_BUSINESS_HIGH_AVAILABILITY_STATUSES')) {
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
          //   this._businessApplicationTypeService.generateTemplate();
          //   break;
          // case "export_to_excel":
          //   this._highAvialabilityStatusService.exportToExcel();
          //   break;
          // case "search":
          //   HighAvailabilityStatusMasterStore.searchText = SubMenuItemStore.searchText;
          //   this.pageChange(1);
            // this.search_business_application_type(SubMenuItemStore.searchText);
            // break;
          // case "share":
          //   ShareItemStore.setTitle('share_high_availability_status');
          //   ShareItemStore.formErrors = {};
          //   break;
          // case "import":
          //   ImportItemStore.setTitle('import_business_application_types');
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
      // if (ShareItemStore.shareData) {
      //   this._highAvialabilityStatusService.shareData(ShareItemStore.shareData).subscribe(res => {
      //     ShareItemStore.unsetShareData();
      //     ShareItemStore.setTitle('');
      //     ShareItemStore.unsetData();
      //     $('.modal-backdrop').remove();
      //     document.body.classList.remove('modal-open');
      //     setTimeout(() => {
      //       $(this.mailConfirmationPopup.nativeElement).modal('show');
      //     }, 200);
      //   }, (error) => {
      //     if (error.status == 422) {
      //       ShareItemStore.processFormErrors(error.error.errors);
      //     }
      //     ShareItemStore.unsetShareData();
      //     this._utilityService.detectChanges(this._cdr);
      //     $('.modal-backdrop').remove();
      //     console.log(error);
      //   });
      // }
      // if (ImportItemStore.importClicked) {
      //   ImportItemStore.importClicked = false;
      //   this._highAvialabilityStatusService.importData(ImportItemStore.getFileDetails).subscribe(res => {
      //     ImportItemStore.unsetFileDetails();
      //     ImportItemStore.setTitle('');
      //     ImportItemStore.setImportFlag(false);
      //     $('.modal-backdrop').remove();
      //     this._utilityService.detectChanges(this._cdr);
      //   }, (error) => {
      //     if (error.status == 422) {
      //       ImportItemStore.processFormErrors(error.error.errors);
      //     }
      //     else if (error.status == 500 || error.status == 403) {
      //       ImportItemStore.unsetFileDetails();
      //       ImportItemStore.setImportFlag(false);
      //       $('.modal-backdrop').remove();
      //     }
      //     this._utilityService.detectChanges(this._cdr);
      //   })
      // }

    })

    // for deleting/activating/deactivating using delete modal

    // this.popupControlHighAvailabilityStatusEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    //   this.modalControl(item);
    // })

    // for closing the modal

    // this.controlBusinessApplicationTypeSubscriptionEvent = this._eventEmitterService.businessApplicationType.subscribe(res => {
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
  pageChange(newPage: number = null) {
    if (newPage) HighAvailabilityStatusMasterStore.setCurrentPage(newPage);
    this._highAvialabilityStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    //
    this._highAvialabilityStatusService.sortanyList(type, null);
    this.pageChange();
  }


   // modal control event
  //  modalControl(status: boolean) {
  //   switch (this.popupObject.type) {
  //     case '': this.deleteBusinessApplicationType(status)
  //       break;

  //     case 'Activate': this.activateHighAvailabilityStatus(status)
  //       break;

  //     case 'Deactivate': this.deactivateHighAvailabilityStatus(status)
  //       break;

  //   }

  // }

  // // calling activcate function

  // activateHighAvailabilityStatus(status: boolean) {
  //   if (status && this.popupObject.id) {

  //     this._highAvialabilityStatusService.activate(this.popupObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.clearPopupObject();
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   }, 250);

  // }

  // // calling deactivate function

  // deactivateHighAvailabilityStatus(status: boolean) {
  //   if (status && this.popupObject.id) {

  //     this._highAvialabilityStatusService.deactivate(this.popupObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.clearPopupObject();
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   }, 250);

  // }

  // // for activate

  // activate(id: number) {
  //   // event.stopPropagation();
  //   this.popupObject.type = 'Activate';
  //   this.popupObject.id = id;
  //   this.popupObject.title = 'Activate High Availability Status?';
  //   this.popupObject.subtitle = 'are_you_sure_activate';

  //   $(this.confirmationPopUp.nativeElement).modal('show');
  // }

  // // for deactivate

  // deactivate(id: number) {
  //   // event.stopPropagation();
  //   this.popupObject.type = 'Deactivate';
  //   this.popupObject.id = id;
  //   this.popupObject.title = 'Deactivate High Availability Status?';
  //   this.popupObject.subtitle = 'are_you_sure_deactivate';

  //   $(this.confirmationPopUp.nativeElement).modal('show');
  // }

  //  // for popup object clearing

  //  clearPopupObject() {
  //   this.popupObject.id = null;
  //   // this.popupObject.title = '';
  //   // this.popupObject.subtitle = '';
  //   // this.popupObject.type = '';

  // }
  

}
