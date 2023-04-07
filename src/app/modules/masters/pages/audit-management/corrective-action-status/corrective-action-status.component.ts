import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { title } from 'process';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CorrectiveActionStatusService } from 'src/app/core/services/masters/audit-management/corrective-action-status/corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CorrectiveActionStatusMasterStore } from 'src/app/stores/masters/audit-management/corrective-action-status-store';

declare var $: any;

@Component({
  selector: 'app-corrective-action-status',
  templateUrl: './corrective-action-status.component.html',
  styleUrls: ['./corrective-action-status.component.scss']
})
export class CorrectiveActionStatusComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;
      
  CorrectiveActionObject = {
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

  popupEventSubscription:any;
  correctiveActionStatusSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  CorrectiveActionStatusMasterStore = CorrectiveActionStatusMasterStore;
  
  constructor(    
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _correctiveActionStatusService: CorrectiveActionStatusService,    
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'AM_AUDIT_FINDING_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_AM_AUDIT_FINDING_CORRECTIVE_ACTION_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'audit-management' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._correctiveActionStatusService.exportToExcel();
            break;
          case "search":
            CorrectiveActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.popupEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.correctiveActionStatusSubscriptionEvent = this._eventEmitterService.correctiveActionStatus.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
 this.pageChange(1);
  }

  openFormModal(){
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.formModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }
  closeFormModal(){
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();
    this.CorrectiveActionObject.type = null;
  }

  pageChange(newPage: number = null) {
    if (newPage) CorrectiveActionStatusMasterStore.setCurrentPage(newPage);
    this._correctiveActionStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._correctiveActionStatusService.sortCorrectiveActionStatusList(type, null);
    this.pageChange();
  }

  getCorrectiveActionStatus(id: number, rtitle:string)  {
    this._correctiveActionStatusService.getItem(id).subscribe(res=>{
      this.CorrectiveActionObject.values=
      { 
        id:res.id,
        color_code:res.color_code,
        label:res.label,
        title:rtitle,
      }      
      this.CorrectiveActionObject.type = 'Edit';
      this.openFormModal();
      })
      this._utilityService.detectChanges(this._cdr);
  }

clearPopupObject() {
  this.popupObject.id = null;

}

modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case 'Activate': this.activateCorrectiveActionStatus(status)
      break;

    case 'Deactivate': this.deactivateCorrectiveActionStatus(status)
      break;

  }

}

  // calling activcate function
  activateCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._correctiveActionStatusService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateCorrectiveActionStatus(status: boolean) {
    if (status && this.popupObject.id) {

      this._correctiveActionStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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
    // event.s/topPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate  Competency Group?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp?.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate  Competency Group?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp?.nativeElement).modal('show');
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CorrectiveActionStatusMasterStore.searchText = '';
    CorrectiveActionStatusMasterStore.currentPage = 1;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.correctiveActionStatusSubscriptionEvent.unsubscribe();
    this.popupEventSubscription.unsubscribe();

  }

}
