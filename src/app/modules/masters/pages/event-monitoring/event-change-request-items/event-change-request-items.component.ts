import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { EventChangeRequestItemsStore } from 'src/app/stores/masters/event-monitoring/event-change-request-items.store';
import { ChangeRequestItemsService } from 'src/app/core/services/masters/event-monitoring/change-request-items/change-request-items.service';

declare var $: any;

@Component({
  selector: 'app-event-change-request-items',
  templateUrl: './event-change-request-items.component.html',
  styleUrls: ['./event-change-request-items.component.scss']
})
export class EventChangeRequestItemsComponent implements OnInit {

  SubMenuItemStore = SubMenuItemStore;
  EventChangeRequestItemsStore = EventChangeRequestItemsStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _changeRequestItemsService: ChangeRequestItemsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_CHANGE_REQUEST_ITEM_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_EVENT_CHANGE_REQUEST_ITEM', submenuItem: {type: 'export_to_excel'}},

        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          case "export_to_excel":
            this._changeRequestItemsService.exportToExcel();
            break;
          case "search":
            EventChangeRequestItemsStore.searchText  = SubMenuItemStore.searchText;
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
    if (newPage)EventChangeRequestItemsStore.setCurrentPage(newPage);
    this._changeRequestItemsService.getItems(null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventChangeRequestItemsStore.searchText = '';
    EventChangeRequestItemsStore.currentPage = 1 ;
  }

// for sorting
 sortTitle(type: string) {
  EventChangeRequestItemsStore.setCurrentPage(1);
  this._changeRequestItemsService.sortChangeRequestItemList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
