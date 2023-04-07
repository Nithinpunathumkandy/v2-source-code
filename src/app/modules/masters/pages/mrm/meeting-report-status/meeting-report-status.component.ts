import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MeetingReportStatusService } from 'src/app/core/services/masters/mrm/meeting-report-status/meeting-report-status.service';
import { MeetingReportStatusMasterStore } from 'src/app/stores/masters/mrm/meeting-report-status-store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-meeting-report-status',
  templateUrl: './meeting-report-status.component.html',
  styleUrls: ['./meeting-report-status.component.scss']
})
export class MeetingReportStatusComponent implements OnInit {

  MeetingReportStatusMasterStore = MeetingReportStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  constructor(private _meetingReportStatusService:MeetingReportStatusService,
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MEETING_REPORT_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mrm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});

      if (SubMenuItemStore.clikedSubMenuItem) {
        MeetingReportStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) MeetingReportStatusMasterStore.setCurrentPage(newPage);
    this._meetingReportStatusService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._meetingReportStatusService.sortMeetingReportStatusList(type, null);
    this.getItems();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MeetingReportStatusMasterStore.searchText = '';
    MeetingReportStatusMasterStore.currentPage = 1 ;
  }
}
