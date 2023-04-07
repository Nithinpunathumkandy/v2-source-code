import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { AppFeedbackSmiley,AppFeedbackSmileyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-smiley';
import {AppFeedbackSmileyMasterStore} from 'src/app/stores/masters/general/app-feedback-smiley-store';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppFeedbackSmileyService } from 'src/app/core/services/masters/general/app-feedback-smiley/app-feedback-smiley.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-app-feedback-smiley',
  templateUrl: './app-feedback-smiley.component.html',
  styleUrls: ['./app-feedback-smiley.component.scss']
})
export class AppFeedbackSmileyComponent implements OnInit , OnDestroy {
  AppFeedbackSmileyMasterStore = AppFeedbackSmileyMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _appFeedbackSmileyService: AppFeedbackSmileyService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'APP_FEEDBACK_SMILEY_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            AppFeedbackSmileyMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) AppFeedbackSmileyMasterStore.setCurrentPage(newPage);
    this._appFeedbackSmileyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for sorting
  sortTitle(type: string) {
    // AppFeedbackSmileyMasterStore.setCurrentPage(1);
    this._appFeedbackSmileyService.sortAppFeedbackKeyList(type, null);
    this.pageChange();
  }

  ngOnDestroy(){
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
     AppFeedbackSmileyMasterStore.searchText = '';
  }

}
