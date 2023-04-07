import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventClosureStatusService } from 'src/app/core/services/masters/event-monitoring/event-closure-status/event-closure-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventClosureStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-closure-status-store';

@Component({
  selector: 'app-event-closure-status',
  templateUrl: './event-closure-status.component.html',
  styleUrls: ['./event-closure-status.component.scss']
})
export class EventClosureStatusComponent implements OnInit {

  EventClosureStatusMasterStore = EventClosureStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  // AuthStore = AuthStore;
  // AppStore = AppStore;

  constructor(private _eventClosureStatusService: EventClosureStatusService,
              private _helperService: HelperServiceService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_CLOSURE_STATUS_LIST', submenuItem: { type: 'search' }},
        // {activityName: '', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              // case "export_to_excel":
              //   this._eventClosureStatusService.exportToExcel();
              //   break;
                case "search":
                  EventClosureStatusMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
  
    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) EventClosureStatusMasterStore.setCurrentPage(newPage);
    this._eventClosureStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    this._eventClosureStatusService.sortEventClosureStatusList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventClosureStatusMasterStore.searchText = '';
    EventClosureStatusMasterStore.currentPage = 1 ;
  }

}
