import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaImpactCategoryInformationService } from 'src/app/core/services/masters/bcm/bia-impact-category-information/bia-impact-category-information.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BiaImpactCategoryInformationMasterStore } from 'src/app/stores/masters/bcm/bia-impact-category-information';
declare var $: any;

@Component({
  selector: 'app-bia-impact-category-information',
  templateUrl: './bia-impact-category-information.component.html',
  styleUrls: ['./bia-impact-category-information.component.scss']
})
export class BiaImpactCategoryInformationComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('biaImpactCategoryInformationModal') biaTireModal: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  BiaImpactCategoryInformationMasterStore = BiaImpactCategoryInformationMasterStore;
  BiaCategoryStore=BiaCategoryStore;
  BiaRatingStore=BiaRatingStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_bia_impact_category_information_message';

  biaModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  biaImpactCategoryInformationObject = {
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
    private _biaImpactCategoryInformationService: BiaImpactCategoryInformationService,
    private _biaCategoryService:BiaCategoryService
    ) { }


  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof BiaTireComponent
  */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BIA_IMPACT_CATEGORY_INFORMATION_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BIA_IMPACT_CATEGORY_INFORMATION', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_BIA_IMPACT_CATEGORY_INFORMATION_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_BIA_IMPACT_CATEGORY_INFORMATION', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_BIA_IMPACT_CATEGORY_INFORMATION', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_BIA_IMPACT_CATEGORY_INFORMATION', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bia_impact_category' });
      if (!AuthStore.getActivityPermission(100, 'CREATE_BIA_IMPACT_CATEGORY_INFORMATION')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openNewModal()
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "template":
            this._biaImpactCategoryInformationService.generateTemplate();
            break;
          case "import":
            ImportItemStore.setTitle('import_bia_impact_category_information');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._biaImpactCategoryInformationService.exportToExcel();
            break;
          case "search":
            BiaImpactCategoryInformationMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_bia_impact_category_information');
            ShareItemStore.formErrors = {};
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._biaImpactCategoryInformationService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
        this._biaImpactCategoryInformationService.shareData(ShareItemStore.shareData).subscribe(res => {
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
    this.biaModalSubscription = this._eventEmitterService.BiaImpactCategoryInformationModal.subscribe(res=>{
      this.closeBiaTireNewModal();
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
    if (newPage) BiaImpactCategoryInformationMasterStore.setCurrentPage(newPage);
    this._biaImpactCategoryInformationService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }
  changeZIndex(){
    if($(this.biaTireModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.biaTireModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.biaTireModal.nativeElement,'overflow','auto');
    }
  }
  openNewModal() {
    this.biaImpactCategoryInformationObject.type = "Add";
    this.biaImpactCategoryInformationObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.biaTireModal.nativeElement).modal('show');
    }, 100);
  }
  closeBiaTireNewModal() {
    this.biaImpactCategoryInformationObject.type = null
    $(this.biaTireModal.nativeElement).modal('hide');
  }

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Bia Tire?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Bia Tire?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
          break;
      case 'Activate': this.activateArea(status)
        break;
      case 'Deactivate': this.deactivateArea(status)
        break;
    }
  }


  delete(status) {
    if (status && this.popupObject.id) {
  
      this._biaImpactCategoryInformationService.delete(this.popupObject.id).subscribe(resp => {
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
  
  deleteBiaTire(id){
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
  activateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._biaImpactCategoryInformationService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._biaImpactCategoryInformationService.deactivate(this.popupObject.id).subscribe(resp => {
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

  editImpactCategoryInformation(id){
    this._biaImpactCategoryInformationService.getItem(id).subscribe(res=>{
  
      let ImpactCategoryInfo = res;
      if(res){
        this.biaImpactCategoryInformationObject.values = {
          id: ImpactCategoryInfo.id,
          description: ImpactCategoryInfo.description,
          bia_impact_category_id:ImpactCategoryInfo.bia_impact_category?.id,
          bia_impact_rating_id:ImpactCategoryInfo.bia_impact_rating.id,
          amount:ImpactCategoryInfo.amount,
          
          // bia_impact_rating_rating:ImpactCategoryInfo.

         
          // from:ImpactCategoryInfo?.bia_scale[0]?.from,
          // to:ImpactCategoryInfo?.bia_scale[0]?.to,
          // bia_scale_category:ImpactCategoryInfo?.bia_scale[0]?.bia_scale_category.type

        }
      this.biaImpactCategoryInformationObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.biaTireModal.nativeElement).modal('show');
      }, 100);
    
      }
    })
  }

  sortTitle(type: string) {
    this._biaImpactCategoryInformationService.sortBiaImpactCategoryInformationList(type, null);
    this.pageChange();
  }


  /**
  * @description
  * Called once, before the instance is destroyed.
  * Add 'implements OnDestroy' to the class.
  *
  * @memberof BiaTireComponent
  */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.biaModalSubscription.unsubscribe();
    BiaImpactCategoryInformationMasterStore.searchText = '';
    BiaImpactCategoryInformationMasterStore.currentPage = 1 ;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
