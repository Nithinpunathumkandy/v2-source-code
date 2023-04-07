import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyProfileStatusService } from 'src/app/core/services/masters/strategy/strategy-profile-status/strategy-profile-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyProfileStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-profile-status-store';

declare var $: any;

@Component({
  selector: 'app-strategy-profile-status',
  templateUrl: './strategy-profile-status.component.html',
  styleUrls: ['./strategy-profile-status.component.scss']
})
export class StrategyProfileStatusComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  StrategyProfileStatusMasterStore = StrategyProfileStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_strategy_profile_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription:any

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _strategyProfileStatusService: StrategyProfileStatusService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STRATEGY_PROFILE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_STRATEGY_PROFILE_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'strategy-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._strategyProfileStatusService.exportToExcel();
                break;
              case "search":
                StrategyProfileStatusMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
          
            NoDataItemStore.unSetClickedNoDataItem();
          }
          
        })  
        
        // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) StrategyProfileStatusMasterStore.setCurrentPage(newPage);
    this._strategyProfileStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  } 

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'Activate': this.activateStrategyProfileStatus(status)
          break;
  
        case 'Deactivate': this.deactivateStrategyProfileStatus(status)
          break;
  
      }
  
    }
  
  
    closeConfirmationPopUp(){
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
  
    activateStrategyProfileStatus(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._strategyProfileStatusService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateStrategyProfileStatus(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._strategyProfileStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Strategy Profile Status?';
      this.popupObject.subtitle = 'common_activate_subtitle';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Strategy Profile Status?';
      this.popupObject.subtitle = 'common_deactivate_subtitle';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

  sortTitle(type: string) {
    this._strategyProfileStatusService.sortStrategyProfileStatusList(type, null);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    StrategyProfileStatusMasterStore.searchText = '';
    StrategyProfileStatusMasterStore.currentPage = 1 ;
    this.popupControlEventSubscription.unsubscribe();
  }

}
  