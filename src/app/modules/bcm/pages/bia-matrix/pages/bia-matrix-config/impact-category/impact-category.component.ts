import { number } from '@amcharts/amcharts4/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-impact-category',
  templateUrl: './impact-category.component.html',
  styleUrls: ['./impact-category.component.scss']
})
export class ImpactCategoryComponent implements OnInit {

  @ViewChild('ratingModal', { static: true }) ratingModal: ElementRef;
  @ViewChild('biaScaleModal', { static: true }) biaScaleModal: ElementRef;
  @ViewChild('tierConfigModal', { static: true }) tierConfigModal: ElementRef;
  @ViewChild('impactAreaModal', { static: true }) impactAreaModal: ElementRef;
  @ViewChild('impactScenarioModal', { static: true }) impactScenarioModal: ElementRef;
  @ViewChild('impactCategoryModal', { static: true }) impactCategoryModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  biaCategoryObject = {
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  mailConfirmationData = 'share_impact_category_message';
  biaModalSubscription: any;
  popupControlEventSubscription:any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  BiaMatrixStore = BiaMatrixStore;
  BiaCategoryStore = BiaCategoryStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _biaCategoryService: BiaCategoryService,
    private _renderer2: Renderer2,
    private _biaSettingService: BiaSettingsService
  ) { }
  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_impact_category'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BIA_IMPACT_CATEGORY_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BIA_IMPACT_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_BIA_IMPACT_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BIA_IMPACT_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_BIA_IMPACT_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: 'SHARE_BIA_IMPACT_CATEGORY', submenuItem: {type: 'share'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_BIA_IMPACT_CATEGORY')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRatingNewModal();
              this.pageChange();
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
            case "template":

              this._biaCategoryService.generateTemplate();
            break;
          case "export_to_excel":

            this._biaCategoryService.exportToExcel();
            break;
            case "import":
            ImportItemStore.setTitle('import_impact_category');
            ImportItemStore.setImportFlag(true);
            break;
            case "share":
              ShareItemStore.setTitle('share_impact_category_title');
              ShareItemStore.formErrors = {};
              break;
            case "search":
              BiaCategoryStore.searchText = SubMenuItemStore.searchText;
              this.searchBiaCategoryList();
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
        this.openRatingNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if(ShareItemStore.shareData){
        this._biaCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._biaCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
   
    this._biaSettingService.getItems().subscribe()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);

    this.biaModalSubscription = this._eventEmitterService.ImpactCategoryModal.subscribe(res=>{
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

    // console.log("impCatData",BiaMatrixStore.impactCategory)
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {

    if (newPage) BiaCategoryStore.setCurrentPage(newPage);
    this._biaCategoryService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  changeZIndex(){
    if($(this.impactCategoryModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.impactCategoryModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.impactCategoryModal.nativeElement,'overflow','auto');
    }
  }

  sortTitle(type: string) {
    this._biaCategoryService.sortBiaCategoryList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  searchBiaCategoryList(){
    BiaCategoryStore.setCurrentPage(1);
    this._biaCategoryService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  openRatingNewModal() {
    this.biaCategoryObject.type="Add"
    this.biaCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    // this.openFormModal();
    setTimeout(() => {
      $(this.impactCategoryModal.nativeElement).modal('show');
    }, 100);
    
  }
  closeFormRatingNewModal() {
    this.biaCategoryObject.type=null
    $(this.impactCategoryModal.nativeElement).modal('hide');
  }

  openFormModal(){
    setTimeout(() => {
      $(this.impactCategoryModal.nativeElement).modal('show');
    }, 100);
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
        break;

      case 'Activate': this.activateBiaCategory(status)
        break;

      case 'Deactivate': this.deactivateBiaCategory(status)
        break;

    }

  }

delete(status) {
  if (status && this.popupObject.id) {

    this._biaCategoryService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this.pageChange();
        this._utilityService.detectChanges(this._cdr);
      
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

deleteBiaCategory(id){
  this.popupObject.id = id;
  this.popupObject.type = '';
  this.popupObject.subtitle='it_will_be_removed_from_the_bia_matrix'

  $(this.confirmationPopUp.nativeElement).modal('show');
}

clearDeleteObject() {

  this.popupObject.id = null;
  this.popupObject.type = '';
  this.popupObject.subtitle='';

}

 // calling activcate function

 activateBiaCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._biaCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateBiaCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._biaCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate Bia Category?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Bia Category?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

editBiaCategory(id){

  this._biaCategoryService.getItem(id).subscribe(res=>{

    let RatingDetails = res;
    if(res){
      this.biaCategoryObject.values = {
        id: RatingDetails.id,
        title: RatingDetails.title,
        bia_impact_rating_id: RatingDetails.bia_impact_rating?.id,
        
      }
    this.biaCategoryObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.impactCategoryModal.nativeElement).modal('show');
    }, 100);
  
    }
  })
}

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.biaModalSubscription.unsubscribe();
    BiaCategoryStore.searchText = '';
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
