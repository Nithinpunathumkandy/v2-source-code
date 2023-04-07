import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MsAuditPlanCriteriaMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-criteria-store';
import { MsAuditPlanCriteria } from 'src/app/core/models/masters/ms-audit-management/ms-audit-plan-criteria';
import { MsAuditPlanCriteriaService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-plan-criteria/ms-audit-plan-criteria.service';
declare var $: any;
@Component({
  selector: 'app-ms-audit-plan-criteria',
  templateUrl: './ms-audit-plan-criteria.component.html',
  styleUrls: ['./ms-audit-plan-criteria.component.scss']
})
export class MsAuditPlanCriteriaComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  MsAuditPlanCriteriaMasterStore = MsAuditPlanCriteriaMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_ms_audit_plan_criteria_message';
  msAuditPlanCriteriaObject = { component: 'Master', values: null, type: null };
  popupObject = { type: '', title: '', id: null, subtitle: '' };
  msAuditPlanCriteriaSubscriptionEvent: any = null;
  popupControlMsAuditPlanCriteriaEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _msAuditPlanCriteriaService: MsAuditPlanCriteriaService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_ms_audit_plan_criteria' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MS_AUDIT_PLAN_CRITERIA_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_MS_AUDIT_PLAN_CRITERIA', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_MS_AUDIT_PLAN_CRITERIA', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_MS_AUDIT_PLAN_CRITERIA', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mrm' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_MS_AUDIT_PLAN_CRITERIA')) {
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
          case "export_to_excel":
            this._msAuditPlanCriteriaService.exportToExcel();
            break;
          case "search":
            MsAuditPlanCriteriaMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_ms_audit_plan_criteria_title');
            ShareItemStore.formErrors = {};
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
        this._msAuditPlanCriteriaService.shareData(ShareItemStore.shareData).subscribe(res => {
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

        });
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlMsAuditPlanCriteriaEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.msAuditPlanCriteriaSubscriptionEvent = this._eventEmitterService.msAuditPlanCriteria.subscribe(res => {
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

  // Add New Item
  addNewItem() {
    this.msAuditPlanCriteriaObject.type = 'Add';
    this.msAuditPlanCriteriaObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  // Pagination
  pageChange(newPage: number = null) {
    if (newPage) MsAuditPlanCriteriaMasterStore.setCurrentPage(newPage);
    this._msAuditPlanCriteriaService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.msAuditPlanCriteriaObject.type = null;
  }

  // for activate
  activate(id: number) {
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate MsAuditPlan Criteria ?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate MsAuditPlan Criteria?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMsAuditPlanCriteria(status)
        break;

      case 'Activate': this.activateMsAuditPlanCriteria(status)
        break;

      case 'Deactivate': this.deactivateMsAuditPlanCriteria(status)
        break;

    }

  }

  // delete function call
  deleteMsAuditPlanCriteria(status: boolean) {
    if (status && this.popupObject.id) {
      this._msAuditPlanCriteriaService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && MsAuditPlanCriteriaMasterStore.getMsAuditPlanCriteriaById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

  // get perticuller msAuditPlan criteria
  getMsAuditPlanCriteria(id: number) {
    this._msAuditPlanCriteriaService.getItem(id).subscribe(res => {
      this.loadPopup();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //Load Pop
  loadPopup() {
    const msAuditPlanCriteriaSingle: MsAuditPlanCriteria = MsAuditPlanCriteriaMasterStore.individualMsAuditPlanCriteriaId;
    this.msAuditPlanCriteriaObject.values = {
      id: msAuditPlanCriteriaSingle.id,
      title: msAuditPlanCriteriaSingle.title,
      description: msAuditPlanCriteriaSingle.description,
    }
    this.msAuditPlanCriteriaObject.type = 'Edit';
    this.openFormModal();
  }

  // for delete
  delete(id: number) {
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete MsAuditPlan Criteria?';
    this.popupObject.subtitle = 'are_you_sure_delete';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // calling activcate function
  activateMsAuditPlanCriteria(status: boolean) {
    if (status && this.popupObject.id) {
      this._msAuditPlanCriteriaService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateMsAuditPlanCriteria(status: boolean) {
    if (status && this.popupObject.id) {

      this._msAuditPlanCriteriaService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // Sprt List
  sortTitle(type: string) {
    //MsAuditPlanCategoryMasterStore.setCurrentPage(1);
    this._msAuditPlanCriteriaService.sortMsAuditPlanCriteriaList(type, null);
    this.pageChange();
  }

  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.msAuditPlanCriteriaSubscriptionEvent.unsubscribe();
    this.popupControlMsAuditPlanCriteriaEventSubscription.unsubscribe();
    MsAuditPlanCriteriaMasterStore.searchText = '';
    MsAuditPlanCriteriaMasterStore.currentPage = 1;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
