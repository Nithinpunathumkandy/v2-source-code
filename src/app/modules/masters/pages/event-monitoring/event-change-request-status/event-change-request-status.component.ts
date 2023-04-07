import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventChangeRequestStatusService } from 'src/app/core/services/masters/event-monitoring/event-change-request-status/event-change-request-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventChaneRequestStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-change-request-status-store';

@Component({
  selector: 'app-event-change-request-status',
  templateUrl: './event-change-request-status.component.html',
  styleUrls: ['./event-change-request-status.component.scss']
})
export class EventChangeRequestStatusComponent implements OnInit {
  EventChaneRequestStatusMasterStore = EventChaneRequestStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  constructor(private _eventChangeRequestStatusService: EventChangeRequestStatusService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

ngOnInit(): void {

this.reactionDisposer = autorun(() => {

var subMenuItems = [
{activityName: 'EVENT_CHANGE_REQUEST_STATUS_LIST', submenuItem: { type: 'search' }},
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
        EventChaneRequestStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
if (newPage) EventChaneRequestStatusMasterStore.setCurrentPage(newPage);
this._eventChangeRequestStatusService.getItems(false,null,true).subscribe(() => 
setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}
sortTitle(type: string) {
this._eventChangeRequestStatusService.sortEventChangeRequestStatusList(type, null);
this.pageChange();
}

ngOnDestroy() {
if (this.reactionDisposer) this.reactionDisposer();
SubMenuItemStore.makeEmpty();
EventChaneRequestStatusMasterStore.searchText = '';
EventChaneRequestStatusMasterStore.currentPage = 1 ;
}

}
