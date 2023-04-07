import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingActionPlanStatusService } from 'src/app/core/services/masters/mrm/meeting-action-plan-status/meeting-action-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingActionPlanStatusMasterStore } from 'src/app/stores/masters/mrm/meeting-action-plan-status-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
@Component({
  selector: 'app-meeting-action-plan-status',
  templateUrl: './meeting-action-plan-status.component.html',
  styleUrls: ['./meeting-action-plan-status.component.scss']
})
export class MeetingActionPlanStatusComponent implements OnInit {

  MeetingActionPlanStatusMasterStore = MeetingActionPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  constructor(private _actionPlanStatusService:MeetingActionPlanStatusService,
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MEETING_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mrm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});

      if (SubMenuItemStore.clikedSubMenuItem) {
        MeetingActionPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1);

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.getItems(1);
  }

  getItems(newPage: number = null){
    if (newPage) MeetingActionPlanStatusMasterStore.setCurrentPage(newPage);
    this._actionPlanStatusService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._actionPlanStatusService.sortMeetingActionPlanStatusList(type);
    this.getItems();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MeetingActionPlanStatusMasterStore.searchText = '';
    MeetingActionPlanStatusMasterStore.currentPage = 1 ;
  }

}
