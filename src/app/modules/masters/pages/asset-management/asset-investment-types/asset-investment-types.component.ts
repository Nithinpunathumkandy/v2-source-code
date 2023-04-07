import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AssetInvestmentTypesService } from 'src/app/core/services/masters/asset-management/asset-investment-types/asset-investment-types.service';
import { AssetInvestmentTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-investment-types-store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-asset-investment-types',
  templateUrl: './asset-investment-types.component.html',
  styleUrls: ['./asset-investment-types.component.scss']
})
export class AssetInvestmentTypesComponent implements OnInit, OnDestroy {
  
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AssetInvestmentTypesMasterStore = AssetInvestmentTypesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_ssset_investment_types_message';
 

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _assetInvestmentTypesService: AssetInvestmentTypesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AssetInvestmentTypesComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ASSET_INVESTMENT_TYPE_LIST', submenuItem: { type: 'search' }},
        // {activityName: 'EXPORT_ASSET_INVESTMENT_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'asset-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
                case "search":
                  AssetInvestmentTypesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
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
        })

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) AssetInvestmentTypesMasterStore.setCurrentPage(newPage);
    this._assetInvestmentTypesService.getItems(false,null,true).subscribe(() => setTimeout(() => 
    this._utilityService.detectChanges(this._cdr), 100));
  }


  sortTitle(type: string) {
    this._assetInvestmentTypesService.sortAssetInvestmentTypesList(type, null);
    this.pageChange();
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AssetInvestmentTypesComponent
   */
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetInvestmentTypesMasterStore.searchText = '';
    AssetInvestmentTypesMasterStore.currentPage = 1 ;
  }

}
