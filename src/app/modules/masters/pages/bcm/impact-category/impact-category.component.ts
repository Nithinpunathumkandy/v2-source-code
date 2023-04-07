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
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-category',
  templateUrl: './impact-category.component.html',
  styleUrls: ['./impact-category.component.scss']
})
export class ImpactCategoryComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('impactCategoryModal', { static: true }) impactCategoryModal: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  BiaCategoryStore = BiaCategoryStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_impact_category_message';
  biaModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

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


  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _biaCategoryService: BiaCategoryService) { }


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
        { activityName: 'BIA_IMPACT_CATEGORY_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BIA_IMPACT_CATEGORY', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_BIA_IMPACT_CATEGORY_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_BIA_IMPACT_CATEGORY', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_BIA_IMPACT_CATEGORY', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_BIA_IMPACT_CATEGORY', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bia_impact_category' });
      if (!AuthStore.getActivityPermission(100, 'CREATE_BIA_IMPACT_CATEGORY')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
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
          case "import":
            ImportItemStore.setTitle('import_impact_category');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._biaCategoryService.exportToExcel();
            break;
          case "search":
            BiaCategoryStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_impact_category_title');
            ShareItemStore.formErrors = {};
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openRatingNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._biaCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
        this._biaCategoryService.shareData(ShareItemStore.shareData).subscribe(res => {
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



    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) BiaCategoryStore.setCurrentPage(newPage);
    this._biaCategoryService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }


  changeZIndex() {
    if ($(this.impactCategoryModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.impactCategoryModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.impactCategoryModal.nativeElement, 'overflow', 'auto');
    }
  }

  openRatingNewModal() {
    this.biaCategoryObject.type = "Add"
    this.biaCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    // this.openFormModal();
    setTimeout(() => {
      $(this.impactCategoryModal.nativeElement).modal('show');
    }, 100);

  }
  closeFormRatingNewModal() {
    this.biaCategoryObject.type = null
    $(this.impactCategoryModal.nativeElement).modal('hide');
  }



  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Impact Category?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Category?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
        break;

      case 'Activate': this.activateImpactCategory(status)
        break;

      case 'Deactivate': this.deactivateImpactCategory(status)
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
  activateImpactCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaCategoryService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateImpactCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._biaCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this._biaCategoryService.sortBiaCategoryList(type, null);
    this.pageChange();
  }

  editBiaCategory(id){

    this._biaCategoryService.getItem(id).subscribe(res=>{
  
      let RatingDetails = res;
      if(res){
        this.biaCategoryObject.values = {
          id: RatingDetails.id,
          title: RatingDetails.title,
          bia_impact_rating_id: RatingDetails.bia_impact_rating?.rating,
          
        }
      this.biaCategoryObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.impactCategoryModal.nativeElement).modal('show');
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
    this.popupControlEventSubscription.unsubscribe();
    BiaCategoryStore.searchText = '';
    BiaCategoryStore.currentPage = 1 ;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
