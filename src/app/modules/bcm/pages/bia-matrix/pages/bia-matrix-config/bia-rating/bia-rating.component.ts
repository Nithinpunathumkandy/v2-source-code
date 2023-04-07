import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BiaRating } from 'src/app/core/models/bcm/bia-rating/bia-rating';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-bia-rating',
  templateUrl: './bia-rating.component.html',
  styleUrls: ['./bia-rating.component.scss']
})
export class BiaRatingComponent implements OnInit {

  @ViewChild('ratingModal', { static: true }) ratingModal: ElementRef;
  @ViewChild('biaScaleModal', { static: true }) biaScaleModal: ElementRef;
  @ViewChild('tierConfigModal', { static: true }) tierConfigModal: ElementRef;
  @ViewChild('impactAreaModal', { static: true }) impactAreaModal: ElementRef;
  @ViewChild('impactScenarioModal', { static: true }) impactScenarioModal: ElementRef;
  @ViewChild('impactCategoryModal', { static: true }) impactCategoryModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  // deleteObject = {
  //   id: null,
  //   type: '',
  //   subtitle:''
  // };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  biaRatingObject = {
    type: null,
    values: null
  }
  mailConfirmationData = 'share_bia_rating_message';
  biaModalSubscription: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BiaMatrixStore = BiaMatrixStore;
  BiaRatingStore = BiaRatingStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _biaRatingService: BiaRatingService,
    private _languageService: LanguageService,
    private _renderer2: Renderer2,
    private _biaSettingService: BiaSettingsService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "apr_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_bia'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BIA_IMPACT_RATING_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BIA_IMPACT_RATING', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_BIA_IMPACT_RATING', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BIA_IMPACT_RATING', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_BIA_IMPACT_RATING', submenuItem: {type: 'import'}},
        {activityName: 'SHARE_BIA_IMPACT_RATING', submenuItem: {type: 'share'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_BIA_IMPACT_RATING')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            // setTimeout(() => {
              this.openRatingNewModal()
              this.pageChange();
              this._utilityService.detectChanges(this._cdr);
            // }, 100);
            break;
          case "template":
              this._biaRatingService.generateTemplate();
            break;
          case "export_to_excel":
            this._biaRatingService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_bia_rating');
            ImportItemStore.setImportFlag(true);
            break;
            case "share":
              ShareItemStore.setTitle('share_bia_rating_title');
              ShareItemStore.formErrors = {};
              break;
          case "search":
              BiaRatingStore.searchText = SubMenuItemStore.searchText;
              this.searchBiaRatingList();
              break;
          case "refresh":
              this.pageChange(1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openRatingNewModal()
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if(ShareItemStore.shareData){
        this._biaRatingService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
  
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._biaRatingService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
  
    })
   
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this._biaSettingService.getItems().subscribe()
    this.biaModalSubscription = this._eventEmitterService.biaRatingModal.subscribe(res=>{
      this.closeFormRatingNewModal();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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

    // console.log("RatingData",BiaMatrixStore.BiaRating)
    this.pageChange();
  }

  searchBiaRatingList(){
    BiaRatingStore.setCurrentPage(1);
    this._biaRatingService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  changeZIndex(){
    if($(this.ratingModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.ratingModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.ratingModal.nativeElement,'overflow','auto');
    }
  }

  sortTitle(type: string) {
    this._biaRatingService.sortBiaRatingList(type, SubMenuItemStore.searchText);
    this.pageChange()
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
    this.biaRatingObject.values = null
    $(this.ratingModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  pageChange(newPage: number = null) {

    if (newPage) BiaRatingStore.setCurrentPage(newPage);
    this._biaRatingService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.delete(status)
          break;
  
        case 'Activate': this.activateBiaRating(status)
          break;
  
        case 'Deactivate': this.deactivateBiaRating(status)
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

   // calling activcate function

   activateBiaRating(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaRatingService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
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

  deactivateBiaRating(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaRatingService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
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

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // for activate 
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Bia Rating?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Bia Rating?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
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

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.biaModalSubscription.unsubscribe();
    BiaRatingStore.searchText = '';
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
