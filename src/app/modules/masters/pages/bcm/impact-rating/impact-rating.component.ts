import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-rating',
  templateUrl: './impact-rating.component.html',
  styleUrls: ['./impact-rating.component.scss']
})
export class ImpactRatingComponent implements OnInit, OnDestroy {
  @ViewChild('ratingModal') ratingModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  BiaRatingStore = BiaRatingStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_impact_rating_message';
  biaModalSubscription: any;

  biaRatingObject = {
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupImpactRatingEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _biaRatingService: BiaRatingService) { }


  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof ImpactRatingComponent
  */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BIA_IMPACT_RATING_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BIA_IMPACT_RATING', submenuItem: { type: 'new_modal' } },
        {activityName: 'GENERATE_BIA_IMPACT_RATING', submenuItem: {type: 'template'}},
        { activityName: 'EXPORT_BIA_IMPACT_RATING', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_BIA_IMPACT_RATING', submenuItem: { type: 'import' } },
        { activityName: 'SHARE_BIA_IMPACT_RATING', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bia_impact_rating' });
      if (!AuthStore.getActivityPermission(100, 'CREATE_BIA_IMPACT_RATING')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRatingNewModal()
              // this.pageChange();
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "export_to_excel":
            this._biaRatingService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_bia_rating');
            ImportItemStore.setImportFlag(true);
            break;
          case "search":
            BiaRatingStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._biaRatingService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_impact_rating_title');
            ShareItemStore.formErrors = {};
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openRatingNewModal()
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._biaRatingService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
      if (ShareItemStore.shareData) {
        this._biaRatingService.shareData(ShareItemStore.shareData).subscribe(res => {
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
    })

    // for deleting/activating/deactivating using delete modal
    this.popupImpactRatingEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.biaModalSubscription = this._eventEmitterService.biaRatingModal.subscribe(res=>{
      this.closeFormRatingNewModal();
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })


    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) BiaRatingStore.setCurrentPage(newPage);
    this._biaRatingService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  openRatingNewModal() {
    this.biaRatingObject.type="Add"
    this.biaRatingObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.ratingModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormRatingNewModal() {
    this.biaRatingObject.type=null
    $(this.ratingModal.nativeElement).modal('hide');
  }

  changeZIndex(){
    if($(this.ratingModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.ratingModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.ratingModal.nativeElement,'overflow','auto');
    }
  }


  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Impact Rating?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Rating?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
      break;

      case 'Activate': this.activateImpactRating(status)
        break;

      case 'Deactivate': this.deactivateImpactRating(status)
        break;

    }

  }


  delete(status) {
    if (status && this.popupObject.id) {
  
      this._biaRatingService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.pageChange();
        }, 500);
        this.clearDeleteObject();
  
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  deleteBiaRating(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.subtitle='common_delete_subtitle'

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.popupObject.id = null;
    this.popupObject.type = '';
    this.popupObject.subtitle='';

  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateImpactRating(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaRatingService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateImpactRating(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaRatingService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this._biaRatingService.sortBiaRatingList(type, null);
    this.pageChange();
  }

    // for edit function

editBiaRating(id){
  this._biaRatingService.getItem(id).subscribe(res=>{

    let RatingDetails = res;
    if(res){
      this.biaRatingObject.values = {
        id: RatingDetails.id,
        rating: RatingDetails.rating,
        level: RatingDetails.level,
        color_code:RatingDetails.color_code
      }
    this.biaRatingObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.ratingModal.nativeElement).modal('show');
    }, 100);
  
    }
  })
}


  /**
  * @description
  * Called once, before the instance is destroyed.
  * Add 'implements OnDestroy' to the class.
  *
  * @memberof ImpactRatingComponent
  */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupImpactRatingEventSubscription.unsubscribe();
    BiaRatingStore.searchText = '';
    BiaRatingStore.currentPage = 1 ;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
