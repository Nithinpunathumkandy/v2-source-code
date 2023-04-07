import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetRatingsService } from 'src/app/core/services/masters/asset-management/asset-ratings/asset-ratings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetRatingsMasterStore } from 'src/app/stores/masters/asset-management/asset-ratings-store';

declare var $: any;
@Component({
  selector: 'app-asset-ratings',
  templateUrl: './asset-ratings.component.html',
  styleUrls: ['./asset-ratings.component.scss']
})

export class AssetRatingsComponent implements OnInit, OnDestroy {

  AssetRatingsMasterStore = AssetRatingsMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_asset_option_values_message';


  constructor(
    private _utilityService: UtilityService,
    private _assetRatingsService: AssetRatingsService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'ASSET_RATING_LIST', submenuItem: { type: 'search' } },

        { activityName: 'EXPORT_ASSET_RATING', submenuItem: { type: 'export_to_excel' } },

        { activityName: null, submenuItem: { type: 'close', path: 'asset-management' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);



      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "export_to_excel":
            this._assetRatingsService.exportToExcel();
            break;
          case "search":
            AssetRatingsMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;

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
    if (newPage) AssetRatingsMasterStore.setCurrentPage(newPage);
    this._assetRatingsService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }




  // for sorting
  sortTitle(type: string) {

    this._assetRatingsService.sortAssetRatingsList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetRatingsMasterStore.searchText = '';
    AssetRatingsMasterStore.currentPage = 1 ;

  }
}

