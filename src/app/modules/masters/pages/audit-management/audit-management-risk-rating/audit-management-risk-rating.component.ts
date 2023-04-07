import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditManagementRiskRatingService } from 'src/app/core/services/masters/audit-management/audit-management-risk-rating/audit-management-risk-rating.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditManagementRiskRatingMasterStore } from 'src/app/stores/masters/audit-management/audit-management-risk-rating-store';
declare var $: any;

@Component({
  selector: 'app-audit-management-risk-rating',
  templateUrl: './audit-management-risk-rating.component.html',
  styleUrls: ['./audit-management-risk-rating.component.scss']
})
export class AuditManagementRiskRatingComponent implements OnInit {

  // @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_am_risk_rating_message';
  AuditManagementRiskRatingMasterStore = AuditManagementRiskRatingMasterStore;

  auditManagementRiskRatingObject = {
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

  // controlAuditManagementRiskRatingMasterStoreSubscriptionEvent: any = null;
  popupControlAuditManagementRiskRatingMasterStoreEventSubscription: any;
  // idleTimeoutSubscription: any;
  // networkFailureSubscription: any;

  constructor(

    private _auditManagementRiskRatingService: AuditManagementRiskRatingService,
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
        { activityName: 'AM_RISK_RATING_LIST', submenuItem: { type: 'search' } },
        // { activityName: 'CREATE_AM_RISK_RATING', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_AM_RISK_RATING_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_AM_RISK_RATING', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'SHARE_AM_RISK_RATING', submenuItem: { type: 'share' } },
        // { activityName: 'IMPORT_AM_RISK_RATING', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'audit-management' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_AM_RISK_RATING')) {
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
          //   this._auditManagementRiskRatingService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditManagementRiskRatingService.exportToExcel();
            break;
          case "search":
            AuditManagementRiskRatingMasterStore.searchText = SubMenuItemStore.searchText;
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
        this._auditManagementRiskRatingService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._auditManagementRiskRatingService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.popupControlAuditManagementRiskRatingMasterStoreEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) AuditManagementRiskRatingMasterStore.setCurrentPage(newPage);
    this._auditManagementRiskRatingService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditManagementRiskRatingMasterStore(status)
        break;

      case 'Activate': this.activateAuditManagementRiskRatingMasterStore(status)
        break;

      case 'Deactivate': this.deactivateAuditManagementRiskRatingMasterStore(status)
        break;

    }

  }

  // delete function call

  deleteAuditManagementRiskRatingMasterStore(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditManagementRiskRatingService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && AuditManagementRiskRatingMasterStore.getAuditManagementRiskRatingById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

  activateAuditManagementRiskRatingMasterStore(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditManagementRiskRatingService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditManagementRiskRatingMasterStore(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditManagementRiskRatingService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this._auditManagementRiskRatingService.sortAuditManagementRiskRatingList(type, null);
    this.pageChange();
  }

  // Sub-Menu Search

  searchAuditManagementRiskRatingMasterStore(term: string) {
    this._auditManagementRiskRatingService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // this.controlAuditManagementRiskRatingMasterStoreSubscriptionEvent.unsubscribe();
    this.popupControlAuditManagementRiskRatingMasterStoreEventSubscription.unsubscribe();
    AuditManagementRiskRatingMasterStore.searchText = '';
    AuditManagementRiskRatingMasterStore.currentPage = 1;
    // this.idleTimeoutSubscription.unsubscribe();
    // this.networkFailureSubscription.unsubscribe();
  }


}
