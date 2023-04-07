import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsRiskRatingService } from 'src/app/core/services/masters/Isms/isms-risk-rating/isms-risk-rating.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IsmsRiskRatingMasterStore } from 'src/app/stores/masters/Isms/isms-risk-rating-master-store';

declare var $: any;
@Component({
  selector: 'app-isms-risk-rating',
  templateUrl: './isms-risk-rating.component.html',
  styleUrls: ['./isms-risk-rating.component.scss']
})
export class IsmsRiskRatingComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  IsmsRiskRatingMasterStore = IsmsRiskRatingMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_isms_risk_rating_message';

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
    private _ismsRiskRatingService: IsmsRiskRatingService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ISMS_RISK_RATING_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_ISMS_RISK_RATING', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_ISMS_RISK_RATING', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'isms'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._ismsRiskRatingService.exportToExcel();
                break;
              case "search":
                IsmsRiskRatingMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_isms_risk_rating_title');
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
            this._ismsRiskRatingService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) IsmsRiskRatingMasterStore.setCurrentPage(newPage);
    this._ismsRiskRatingService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  } 

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'Activate': this.activateIsmsRiskRating(status)
          break;
  
        case 'Deactivate': this.deactivateIsmsRiskRating(status)
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
  
    activateIsmsRiskRating(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._ismsRiskRatingService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateIsmsRiskRating(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._ismsRiskRatingService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Isms Risk Rating?';
      this.popupObject.subtitle = 'common_activate_subtitle';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      // event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Isms Risk Rating?';
      this.popupObject.subtitle = 'common_deactivate_subtitle';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

  sortTitle(type: string) {
    this._ismsRiskRatingService.sortIsmsRiskRatingList(type, null);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IsmsRiskRatingMasterStore.searchText = '';
    IsmsRiskRatingMasterStore.currentPage = 1 ;
    this.popupControlEventSubscription.unsubscribe();
  }

}
