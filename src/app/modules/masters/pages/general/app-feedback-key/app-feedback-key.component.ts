import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppFeedbackKey,AppFeedbackKeyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-key';
import {AppFeedbackKeyMasterStore} from 'src/app/stores/masters/general/app-feedback-key-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppFeedbackKeyService } from 'src/app/core/services/masters/general/app-feedback-key/app-feedback-key.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-app-feedback-key',
  templateUrl: './app-feedback-key.component.html',
  styleUrls: ['./app-feedback-key.component.scss']
})
export class AppFeedbackKeyComponent implements OnInit , OnDestroy{

  AppFeedbackKeyMasterStore = AppFeedbackKeyMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _appFeedbackKeyService: AppFeedbackKeyService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'APP_FEEDBACK_KEY_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            AppFeedbackKeyMasterStore.searchText = SubMenuItemStore.searchText;
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

  

  // page change event
  pageChange(newPage: number = null) {
    if (newPage) AppFeedbackKeyMasterStore.setCurrentPage(newPage);
    this._appFeedbackKeyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for sorting
  sortTitle(type: string) {
    // AppFeedbackKeyMasterStore.setCurrentPage(1);
    this._appFeedbackKeyService.sortAppFeedbackSmileylList(type, null);
    this.pageChange();
  }

  ngOnDestroy(){
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
    AppFeedbackKeyMasterStore.searchText = '';

  }

}
