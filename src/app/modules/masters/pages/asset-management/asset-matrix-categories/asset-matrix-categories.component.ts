import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetMatrixCategoriesService } from 'src/app/core/services/masters/asset-management/asset-matrix-categories/asset-matrix-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetMatrixCategoriesMasterStore } from 'src/app/stores/masters/asset-management/asset-matrix-categories';
declare var $: any;

@Component({
  selector: 'app-asset-matrix-categories',
  templateUrl: './asset-matrix-categories.component.html',
  styleUrls: ['./asset-matrix-categories.component.scss']
})
export class AssetMatrixCategoriesComponent implements OnInit {

  @ViewChild('assetMatrixCategoriesModal') assetMatrixCategoriesModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AssetMatrixCategoriesMasterStore = AssetMatrixCategoriesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_asset_matrix_category_message';
  AssetMatrixCategoriesModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;


  assetMatrixCategoriesObject = {
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
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _assetMatrixCategoriesService: AssetMatrixCategoriesService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
  ) { }

  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof PhysicalConditionRankingsComponent
  */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        // {activityName: '', submenuItem: { type: 'search' }},

        { activityName: 'ASSET_MATRIX_CATEGORY_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_ASSET_MATRIX_CATEGORY', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_ASSET_MATRIX_CATEGORY', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_ASSET_MATRIX_CATEGORY', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_ASSET_MATRIX_CATEGORY', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_ASSET_MATRIX_CATEGORY', submenuItem: { type: 'share' } },

        { activityName: null, submenuItem: { type: 'close', path: 'asset-management' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_asset_matrix_category' });
      if(!AuthStore.getActivityPermission(100,'CREATE_ASSET_MATRIX_CATEGORY')){
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
            this._assetMatrixCategoriesService.generateTemplate();
            break;
          case "import":
            ImportItemStore.setTitle('import_asset_matrix_categories');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._assetMatrixCategoriesService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_asset_matrix_categories');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            AssetMatrixCategoriesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
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
      if (ShareItemStore.shareData) {
        this._assetMatrixCategoriesService.shareData(ShareItemStore.shareData).subscribe(res => {
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
    this.AssetMatrixCategoriesModalSubscription = this._eventEmitterService.AssetMatrixCategories.subscribe(res => {
      this.closeNewModal();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) AssetMatrixCategoriesMasterStore.setCurrentPage(newPage);
    this._assetMatrixCategoriesService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex() {
    if ($(this.assetMatrixCategoriesModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.assetMatrixCategoriesModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.assetMatrixCategoriesModal.nativeElement, 'overflow', 'auto');
    }
  }

  sortTitle(type: string) {
    this._assetMatrixCategoriesService.sortAssetMatrixCategoriesList(type, null);
    this.pageChange();
  }


  openNewModal() {
    this.assetMatrixCategoriesObject.type = "Add";
    this.assetMatrixCategoriesObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.assetMatrixCategoriesModal.nativeElement).modal('show');
    }, 100);
  }

  closeNewModal() {
    this.assetMatrixCategoriesObject.type = null
    $(this.assetMatrixCategoriesModal.nativeElement).modal('hide');
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

      this._assetMatrixCategoriesService.delete(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Category?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Category?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteAssetMatrixCategory(id) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.subtitle = 'common_delete_subtitle'

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.popupObject.id = null;
    this.popupObject.type = '';
    this.popupObject.subtitle = '';

  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._assetMatrixCategoriesService.activate(this.popupObject.id).subscribe(resp => {
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
      this._assetMatrixCategoriesService.deactivate(this.popupObject.id).subscribe(resp => {
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

  getAssetMatrixCategory(id) {
    this._assetMatrixCategoriesService.getItem(id).subscribe(res => {
      let assetMatrixCategories = res;
      if (res) {
        this.assetMatrixCategoriesObject.values = {
          id: assetMatrixCategories.id,
          title: assetMatrixCategories.title,
          description: assetMatrixCategories.description,
        }
        this.assetMatrixCategoriesObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        setTimeout(() => {
          $(this.assetMatrixCategoriesModal.nativeElement).modal('show');
        }, 100);
      }
    })
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetMatrixCategoriesMasterStore.searchText = '';
    AssetMatrixCategoriesMasterStore.currentPage = 1 ;
  }

}