import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetSubCategory } from 'src/app/core/models/masters/asset-management/asset-sub-category';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetSubCategoryService } from 'src/app/core/services/masters/asset-management/asset-sub-category/asset-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetSubCategoryStore } from 'src/app/stores/masters/asset-management/asset-sub-category-store';

declare var $: any;
@Component({
  selector: 'app-asset-sub-category',
  templateUrl: './asset-sub-category.component.html',
  styleUrls: ['./asset-sub-category.component.scss']
})
export class AssetSubCategoryComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  AssetSubCategoryStore = AssetSubCategoryStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_asset_sub_category_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  assetSubCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };
  assetSubCategorySubscriptionEvent: any = null;
  popupControlEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _assetSubCategoryService: AssetSubCategoryService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_asset_sub_category'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ASSET_SUB_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_ASSET_SUB_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_ASSET_SUB_CATEGORY', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_ASSET_SUB_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_ASSET_SUB_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_ASSET_SUB_CATEGORY', submenuItem: {type: 'import'}},
        { activityName: null, submenuItem: { type: 'close', path: 'asset-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_ASSET_SUB_CATEGORY')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._assetSubCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._assetSubCategoryService.exportToExcel();
            break;
          case "search":
            AssetSubCategoryStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_asset_sub_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_asset_sub_category');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._assetSubCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._assetSubCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.assetSubCategorySubscriptionEvent = this._eventEmitterService.AssetSubCategory.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
    this.pageChange(1);
  }
   //for adding new details

   addNewItem(){
    this.assetSubCategoryObject.type = 'Add';
    this.assetSubCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  // for opening modal
  openFormModal() {
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');  
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.assetSubCategoryObject.type = null;
  }

  pageChange(newPage: number = null) {
    if (newPage) AssetSubCategoryStore.setCurrentPage(newPage);
    this._assetSubCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getAssetCategory(id: number) {
    const assetSubCategory: AssetSubCategory = AssetSubCategoryStore.getAssetSubCategoryById(id);
    //set form value
    this.assetSubCategoryObject.values = {
      id: assetSubCategory.id,
      title: assetSubCategory.title,
      asset_category_id: assetSubCategory.asset_category_id,
      description: assetSubCategory.description
    }
    this.assetSubCategoryObject.type = 'Edit';
    this.openFormModal();
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAssetSubCategory(status)
        break;

      case 'Activate': this.activateAssetSubCategory(status)
        break;

      case 'Deactivate': this.deactivateAssetSubCategory(status)
        break;

    }

  }


  // delete function call
  deleteAssetSubCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._assetSubCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && AssetSubCategoryStore.getAssetSubCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
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

  activateAssetSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._assetSubCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAssetSubCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._assetSubCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Asset Sub Category?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Asset Sub Category?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Asset Sub Category?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

   // for sorting
   sortTitle(type: string) {
    this._assetSubCategoryService.sortAssetSubCategoryList(type, SubMenuItemStore.searchText);
    this.pageChange();
   }
   ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetSubCategoryStore.searchText = '';
    AssetSubCategoryStore.currentPage = 1 ;
    this.popupControlEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
