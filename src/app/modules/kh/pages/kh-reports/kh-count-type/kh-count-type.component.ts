import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KHReportStore } from 'src/app/stores/knowledge-hub/kh-report/kh-report-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { KhReportDetailsService } from 'src/app/core/services/knowledge-hub/kh-report/kh-report-details.service';
declare var $: any;

@Component({
  selector: 'app-kh-count-type',
  templateUrl: './kh-count-type.component.html',
  styleUrls: ['./kh-count-type.component.scss']
})
export class KhCountTypeComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AuthStore = AuthStore;
  KHReportStore = KHReportStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reportType = null;
  filterDateObject: { startDate: string, endDate: string };

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _khReportDetailsService: KhReportDetailsService,
  ) {
    this._route.params.subscribe(params => {
      this.reportType = params.riskcountType;
    });
  }

  ngOnInit(): void {

    if (!KHReportStore.selectedReportObject)
      this._router.navigateByUrl('/knowledge-hub/reports');
    else {
      KHReportStore.khReportlistmakeEmpty();
      if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
      this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

      NoDataItemStore.setNoDataItems({ title: "common_no_kh_title" });
      this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      if (SubMenuItemStore.DatefilterValue != '') {
				if(SubMenuItemStore.DatefilterValue != 'custom')
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				else {
					this.filterDateObject = SubMenuItemStore.filterDateObject;
					this.getReportList(1);
				}
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			}
      this.reactionDisposer = autorun(() => {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'datefilter' } },
          { activityName: this.KHReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
          { activityName: null, submenuItem: { type: 'close', path: '/knowledge-hub/reports' } },
        ]

        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "export_to_excel":
              let params = '';
              if (this.filterDateObject.startDate) {
                params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
              }
              this._khReportDetailsService.exportToExcel(this.KHReportStore.selectedReportObject, params);
              break;
            default:
              break;
          }

          if (SubMenuItemStore.clikedSubMenuItem.type != 'export_to_excel') {
            this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        }

      })
    }
  }

  getReportList(dateObj) {
    let params = null;
    if (dateObj.startDate) {
      params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
    }
    this._khReportDetailsService.getItems(this.KHReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }
  // for listing data of table dynamically

  risktypeValue(row: any): string {
    const riskTypeValue = this.KHReportStore.selectedReportObject.riskTypeValue;
    if (this.KHReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
      const riskTypeValue2 = this.KHReportStore.selectedReportObject.riskTypeValue2;
      return `${row[riskTypeValue]}${row[riskTypeValue2]}`;
    }
    else {
      return `${row[riskTypeValue]}`;
    }

  }
  // for navigating to Risk listing page

  getRiskList(row: any) {
    KHReportStore.setKHRiskListingTableTitle(this.risktypeValue(row));
    this._router.navigateByUrl(`knowledge-hub/reports/${this.KHReportStore.selectedReportObject.type}/${row.id}`);
  }

  // selecting type of date range need to apply on the filtering of the data

  processDateFilterSelected(dateType: any): void {
    if (dateType === "custom") {

      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else {
      this.filterDateObject = this._helperService.getStartEndDate(dateType);
      KHReportStore.khReportlistmakeEmpty();
      this.getReportList(this.filterDateObject);
    }
  }

  // output from custom-date-popup recieved here
  passDates(dateObject): any {
    this.filterDateObject = dateObject;
    SubMenuItemStore.filterDateObject = dateObject;
    KHReportStore.khReportlistmakeEmpty();
    this.getReportList(this.filterDateObject);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();

  }

}
