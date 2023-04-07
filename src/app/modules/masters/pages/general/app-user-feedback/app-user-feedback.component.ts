import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { AppUserFeedback,AppUserFeedbackPaginationResponse } from 'src/app/core/models/masters/general/app-user-feedback';
import {AppUserFeedbackMasterStore} from 'src/app/stores/masters/general/app-user-feedback-store';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppUserFeedbackService } from 'src/app/core/services/masters/general/app-user-feedback/app-user-feedback.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-app-user-feedback',
  templateUrl: './app-user-feedback.component.html',
  styleUrls: ['./app-user-feedback.component.scss']
})
export class AppUserFeedbackComponent implements OnInit , OnDestroy {

  AppUserFeedbackMasterStore = AppUserFeedbackMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _appUserFeedbackService:AppUserFeedbackService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'APP_USER_FEEDBACK_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            AppUserFeedbackMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) AppUserFeedbackMasterStore.setCurrentPage(newPage);
    this._appUserFeedbackService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  

  // for sorting
  sortTitle(type: string) {
    // AppUserFeedbackMasterStore.setCurrentPage(1);
    this._appUserFeedbackService.sortAppUserFeedbackList(type, null);
    this.pageChange();
  }

  ngOnDestroy(){
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
     AppUserFeedbackMasterStore.searchText = '';
  }

}

