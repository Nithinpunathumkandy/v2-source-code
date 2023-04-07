import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { StrategyInitiativeReviewFrequencyMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store';
import { StrategyInitiativeReviewFrequencyService } from 'src/app/core/services/masters/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-strategy-initiative-review-frequencies',
  templateUrl: './strategy-initiative-review-frequencies.component.html',
  styleUrls: ['./strategy-initiative-review-frequencies.component.scss']
})
export class StrategyInitiativeReviewFrequencyComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  

  reactionDisposer: IReactionDisposer;
  StrategyInitiativeReviewFrequencyMasterStore = StrategyInitiativeReviewFrequencyMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_incident_corrective_action_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  popupIncidentCorrectiveActionStatusEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _strategyInitiativeReviewFrequencyService: StrategyInitiativeReviewFrequencyService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof StrategyInitiativeReviewFrequencyComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STRATEGY_REVIEW_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_STRATEGY_REVIEW_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'strategy-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._strategyInitiativeReviewFrequencyService.exportToExcel();
                break;
                case "search":
                  StrategyInitiativeReviewFrequencyMasterStore.searchText = SubMenuItemStore.searchText;
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
      this.popupIncidentCorrectiveActionStatusEventSubscription = 
      this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategyInitiativeReviewFrequencyMasterStore.setCurrentPage(newPage);
    this._strategyInitiativeReviewFrequencyService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Strategy InitiativeReview Frequency?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Strategy InitiativeReview Frequency?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
    /**
   * @description
   * this method is used for modal control event
   *
   * @param {*} [event]
   * @memberof StrategyInitiativeReviewFrequencyComponent
   */
  modalControl(status: boolean) {
    switch (this.popupObject.type) {      
      case 'Activate': this.activateStrategyInitiativeReviewFrequency(status)
        break;
      case 'Deactivate': this.deactivateStrategyInitiativeReviewFrequency(status)
        break;
    }
  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

   /**
   * @description
   * this method is used for activcate
   * @param {*} 
   * @memberof StrategyInitiativeReviewFrequencyComponent
   */
  activateStrategyInitiativeReviewFrequency(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._strategyInitiativeReviewFrequencyService.activate(this.popupObject.id)
      .subscribe(resp => { setTimeout(() => {
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

   /**
   * @description
   * this method is used for deactivate
   * @param {*} 
   * @memberof StrategyInitiativeReviewFrequencyComponent
   */
  deactivateStrategyInitiativeReviewFrequency(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategyInitiativeReviewFrequencyService.deactivate(this.popupObject.id)
      .subscribe(resp => { setTimeout(() => {
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
  
    sortTitle(type: string) {
      this._strategyInitiativeReviewFrequencyService.sortStrategyInitiativeReviewFrequencyList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof StrategyInitiativeReviewFrequencyComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupIncidentCorrectiveActionStatusEventSubscription.unsubscribe();
      StrategyInitiativeReviewFrequencyMasterStore.searchText = '';
      StrategyInitiativeReviewFrequencyMasterStore.currentPage = 1 ;
    }
    
}
