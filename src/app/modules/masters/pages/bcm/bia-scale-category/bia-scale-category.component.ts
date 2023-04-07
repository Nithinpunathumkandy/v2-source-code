import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BiaScaleCategoryService } from 'src/app/core/services/masters/bcm/bia-scale-category/bia-scale-category.service';
import { BiaScaleCategoryMasterStore } from 'src/app/stores/masters/bcm/bia-scale-category.master.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bia-scale-category',
  templateUrl: './bia-scale-category.component.html',
  styleUrls: ['./bia-scale-category.component.scss']
})
export class BiaScaleCategoryComponent implements OnInit, OnDestroy {

  reactionDisposer: IReactionDisposer;
  BiaScaleCategoryMasterStore = BiaScaleCategoryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
 
  
  constructor(  private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _biaScaleCategoryService: BiaScaleCategoryService){}
  

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BiaScaleCategoryComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BIA_SCALE_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'bcm'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "search":
                BiaScaleCategoryMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) BiaScaleCategoryMasterStore.setCurrentPage(newPage);
    this._biaScaleCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => 
    this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._biaScaleCategoryService.sortBiaScaleCategoryList(type, null);
    this.pageChange();
  }


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BiaScaleCategoryComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BiaScaleCategoryMasterStore.searchText = '';
    BiaScaleCategoryMasterStore.currentPage = 1 ;
  }

}
