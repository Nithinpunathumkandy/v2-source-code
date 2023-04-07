import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { TimeTrackerReportStore } from 'src/app/stores/project-management/reports/reports.store';
import { ReportsService } from 'src/app/core/services/project-management/reports/reports.service';
import { TimeTrackerReport } from "src/app/core/models/project-management/reports/reports";

declare var $: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  TimeTrackerReportStore = TimeTrackerReportStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  filterDateObject: { startDate: string, endDate: string };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _reportsService: ReportsService) { }

  ngOnInit(): void {
    if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
    this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
    if (SubMenuItemStore.DatefilterValue != '') {
      this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
    }
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'refresh' } },
        { activityName: null, submenuItem: { type: 'datefilter' } },

        { activityName: 'PROJECT_TIME_TRACKER_REPORT_EXPORT', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'PROJECT_TIME_TRACKER_REPORT', submenuItem: { type: 'search' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "refresh":
            TimeTrackerReportStore.loaded = false;
            SubMenuItemStore.datefilterValue = 'year';
            this.filterDateObject.startDate = "";
            this.filterDateObject.endDate = "";
            this.pageChange(1)
            break;
          case "export_to_excel":
            //this._reportsService.exportToExcel();
            let params = '';
            if (this.filterDateObject.startDate) {
              params = `from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
            }
            this._reportsService.exportToExcel(params);
            break;
          case "search":
            TimeTrackerReportStore.loaded = false;
            TimeTrackerReportStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        if (SubMenuItemStore.clikedSubMenuItem.type != 'export_to_excel' && SubMenuItemStore.clikedSubMenuItem.type != 'refresh') {
          TimeTrackerReportStore.loaded = false;
          this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.pageChange();
  }

  passDates(dateObject): any {
    this.filterDateObject = dateObject;
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    let params = null;
    if (this.filterDateObject.startDate) {
      params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
    }
    if (newPage) TimeTrackerReportStore.setCurrentPage(newPage);
    this._reportsService.getItems(false, params, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._reportsService.sortTimeTrackerReportList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  processDateFilterSelected(dateType: any): void {
    if (dateType === "custom") {

      $(this.confirmationPopUp?.nativeElement).modal('show');
    }
    else {
      this.filterDateObject = this._helperService.getStartEndDate(dateType);
      //console.log(this.filterDateObject)
      this.pageChange(1);
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    TimeTrackerReportStore.searchText = null;
    SubMenuItemStore.searchText = '';
    TimeTrackerReportStore.currentPage = 1;
  }

}
