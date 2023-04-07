import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditFindingCaStatusesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MSAuditFindingCAStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-statuses-store';

declare var $: any;

@Component({
  selector: 'app-ms-audit-finding-ca-statuses',
  templateUrl: './ms-audit-finding-ca-statuses.component.html',
  styleUrls: ['./ms-audit-finding-ca-statuses.component.scss']
})
export class MsAuditFindingCaStatusesComponent implements OnInit, OnDestroy {

  // @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  // @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  MSAuditFindingCAStatusesMasterStore = MSAuditFindingCAStatusesMasterStore;

  // mailConfirmationData = 'share_audit_finding_corrective_action_types_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  // popupStatusEventSubscription: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    // private _eventEmitterService: EventEmitterService,
    private _msAuditFindingCaStatusesService: MsAuditFindingCaStatusesService,
    ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_FINDING_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_MS_AUDIT_FINDING_CORRECTIVE_ACTION_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'ms-audit-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._msAuditFindingCaStatusesService.exportToExcel();
                break;
                case "search":
                  MSAuditFindingCAStatusesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
         // for deleting/activating/deactivating using delete modal
      // this.popupStatusEventSubscription = 
      // this._eventEmitterService.deletePopup.subscribe(item => {
      //   this.modalControl(item);
      // })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MSAuditFindingCAStatusesMasterStore.setCurrentPage(newPage);
    this._msAuditFindingCaStatusesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // activate(id: number) {
  //   event.stopPropagation();
  //   this.popupObject.type = 'Activate';
  //   this.popupObject.id = id;
  //   this.popupObject.title = 'activate_audit_finding_corrective_action_types';
  //   this.popupObject.subtitle = 'common_activate_subtitle';
  
  //   $(this.confirmationPopUp.nativeElement).modal('show');
  // }

  // deactivate(id: number) {
  //   event.stopPropagation();
  //   this.popupObject.type = 'Deactivate';
  //   this.popupObject.id = id;
  //   this.popupObject.title = 'deactivate_audit_finding_corrective_action_types';
  //   this.popupObject.subtitle = 'common_deactivate_subtitle';
  
  //   $(this.confirmationPopUp.nativeElement).modal('show');
  // }
  
  // modalControl(status: boolean) {
  //   switch (this.popupObject.type) {      
  //     case 'Activate': this.activateItem(status);
  //       break;
  //     case 'Deactivate': this.deactivateItem(status)
  //       break;
  //   }
  // }

  //  for popup object clearing
  // clearPopupObject() {
  //   this.popupObject.id = null;
  // }

  // activateItem(status: boolean) {
  //   if (status && this.popupObject.id) {
  
  //     this._msAuditFindingCaStatusesService.activate(this.popupObject.id)
  //     .subscribe(resp => { setTimeout(() => {
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

  // deactivateItem(status: boolean) {
  //   if (status && this.popupObject.id) {
  //     this._msAuditFindingCaStatusesService.deactivate(this.popupObject.id)
  //     .subscribe(resp => { setTimeout(() => {
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
  
    sortTitle(type: string) {
      this._msAuditFindingCaStatusesService.sortList(type, null);
      this.pageChange();
    }

    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      // this.popupStatusEventSubscription.unsubscribe();
      MSAuditFindingCAStatusesMasterStore.searchText = '';
      MSAuditFindingCAStatusesMasterStore.currentPage = 1 ;
    }
}