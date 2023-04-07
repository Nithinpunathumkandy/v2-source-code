import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetOptionValuesService } from 'src/app/core/services/masters/asset-management/asset-option-values/asset-option-values.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetOptionValuesMasterStore } from 'src/app/stores/masters/asset-management/asset-option-values-store';


declare var $: any;
@Component({
  selector: 'app-asset-option-values',
  templateUrl: './asset-option-values.component.html',
  styleUrls: ['./asset-option-values.component.scss']
})


export class AssetOptionValuesComponent implements OnInit, OnDestroy {

  AssetOptionValuesMasterStore = AssetOptionValuesMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_asset_option_values_message';

  constructor(
    private _utilityService: UtilityService,
    private _assetOptionValuesService: AssetOptionValuesService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'ASSET_OPTION_VALUE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_ASSET_OPTION_VALUE', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'asset-management' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);



      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "export_to_excel":
            this._assetOptionValuesService.exportToExcel();
            break;
          case "search":
            AssetOptionValuesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;


          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })


    this.pageChange(1);

  }


  pageChange(newPage: number = null) {
    if (newPage) AssetOptionValuesMasterStore.setCurrentPage(newPage);
    this._assetOptionValuesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  // for sorting
  sortTitle(type: string) {

    this._assetOptionValuesService.sortAssetOptionValuesList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }



  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetOptionValuesMasterStore.searchText = '';
    AssetOptionValuesMasterStore.currentPage = 1 ;
  }
}
