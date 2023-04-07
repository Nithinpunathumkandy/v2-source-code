import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import{RiskReviewFrequencyMasterStore} from 'src/app/stores/masters/risk-management/risk-review-frequency-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskReviewFrequencyService } from 'src/app/core/services/masters/risk-management/risk-review-frequency/risk-review-frequency.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-review-frequency',
  templateUrl: './risk-review-frequency.component.html',
  styleUrls: ['./risk-review-frequency.component.scss']
})
export class RiskReviewFrequencyComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  reactionDisposer: IReactionDisposer;
  RiskReviewFrequencyMasterStore = RiskReviewFrequencyMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_review_frequency_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlRiskReviewFrequencyEventSubscription: any;
  
  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _riskReviewFrequencyService: RiskReviewFrequencyService){}

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_REVIEW_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_RISK_REVIEW_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_REVIEW_FREQUENCY', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._riskReviewFrequencyService.exportToExcel();
                break;
              case "search":
                RiskReviewFrequencyMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_review_frequency_title');
                ShareItemStore.formErrors = {};
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
          if(ShareItemStore.shareData){
            this._riskReviewFrequencyService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
              console.log(error);
            });
          }
        })

         // for deleting/activating/deactivating using delete modal
      this.popupControlRiskReviewFrequencyEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) RiskReviewFrequencyMasterStore.setCurrentPage(newPage);
    this._riskReviewFrequencyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Review Frequency?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Review Frequency?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      
      case 'Activate': this.activateRiskReviewFrequency(status)
        break;
  
      case 'Deactivate': this.deactivateRiskReviewFrequency(status)
        break;
  
    }
  
  }
  
  
  
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  
  }
  
  // calling activcate function
  
  activateRiskReviewFrequency(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskReviewFrequencyService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateRiskReviewFrequency(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskReviewFrequencyService.deactivate(this.popupObject.id).subscribe(resp => {
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
  
  
    sortTitle(type: string) {
      //RiskReviewFrequencyMasterStore.setCurrentPage(1);
      this._riskReviewFrequencyService.sortRiskReviewFrequencyList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupControlRiskReviewFrequencyEventSubscription.unsubscribe();
      RiskReviewFrequencyMasterStore.searchText = '';
      RiskReviewFrequencyMasterStore.currentPage = 1 ;
    }

}
