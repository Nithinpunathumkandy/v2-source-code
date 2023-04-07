import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import{RiskMatrixRatingLevelsMasterStore} from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskMatrixRatingLevelsService } from 'src/app/core/services/masters/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-matrix-rating-levels',
  templateUrl: './risk-matrix-rating-levels.component.html',
  styleUrls: ['./risk-matrix-rating-levels.component.scss']
})
export class RiskMatrixRatingLevelsComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskMatrixRatingLevelsMasterStore = RiskMatrixRatingLevelsMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_matrix_rating_level_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlRiskMatrixRatingLevelsEventSubscription: any;


  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _riskMatrixRatingLevelsService: RiskMatrixRatingLevelsService){}

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_MATRIX_RATING_LEVEL_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_RISK_MATRIX_RATING_LEVEL', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_MATRIX_RATING_LEVEL', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._riskMatrixRatingLevelsService.exportToExcel();
                break;
              case "search":
                RiskMatrixRatingLevelsMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_matrix_rating_level_title');
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
            this._riskMatrixRatingLevelsService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this.popupControlRiskMatrixRatingLevelsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
          this.modalControl(item);
        })

        this.pageChange(1);
  }

  
  pageChange(newPage: number = null) {
    if (newPage) RiskMatrixRatingLevelsMasterStore.setCurrentPage(newPage);
    this._riskMatrixRatingLevelsService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for activate 
activate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Risk Matrix Rating Level ?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Risk Matrix Rating Level ?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    
    case 'Activate': this.activateRiskMatrixRatingLevels(status)
      break;

    case 'Deactivate': this.deactivateRiskMatrixRatingLevels(status)
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

activateRiskMatrixRatingLevels(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskMatrixRatingLevelsService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateRiskMatrixRatingLevels(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskMatrixRatingLevelsService.deactivate(this.popupObject.id).subscribe(resp => {
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
    //RiskMatrixRatingLevelsMasterStore.setCurrentPage(1);
    this._riskMatrixRatingLevelsService.sortRiskMatrixRatingLevelsList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlRiskMatrixRatingLevelsEventSubscription.unsubscribe();
    RiskMatrixRatingLevelsMasterStore.searchText = '';
    RiskMatrixRatingLevelsMasterStore.currentPage = 1 ;
  }


}
