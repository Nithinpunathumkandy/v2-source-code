import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { InformationRequestStatusesService } from 'src/app/core/services/masters/audit-management/information-request-statuses/information-request-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { InformationRequestStatusMasterStore } from 'src/app/stores/masters/audit-management/information-request-statuses-store';

declare var $: any;

@Component({
  selector: 'app-information-request-statuses',
  templateUrl: './information-request-statuses.component.html',
  styleUrls: ['./information-request-statuses.component.scss']
})
export class InformationRequestStatusesComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;

  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupEventSubscription:any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  InformationRequestStatusMasterStore = InformationRequestStatusMasterStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _informationRequestStatusesService: InformationRequestStatusesService

  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'AM_AUDIT_INFORMATION_REQUEST_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'close', path: 'audit-management' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            InformationRequestStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        if (NoDataItemStore.clikedNoDataItem) {
          NoDataItemStore.unSetClickedNoDataItem();
        }
      }
      })

      this.popupEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
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

  pageChange(newPage: number = null) {
    if (newPage) InformationRequestStatusMasterStore.setCurrentPage(newPage);
    this._informationRequestStatusesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  
  sortTitle(type: string) {
    this._informationRequestStatusesService.sortCorrectiveActionStatusList(type, null);
    this.pageChange();
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
  
        this._informationRequestStatusesService.activate(this.popupObject.id).subscribe(resp => {
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
  
        this._informationRequestStatusesService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Information Request Status?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp?.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Information Request Status?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp?.nativeElement).modal('show');
    }
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      InformationRequestStatusMasterStore.searchText = '';
      InformationRequestStatusMasterStore.currentPage = 1;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
      this.popupEventSubscription.unsubscribe();
  
    }


}
