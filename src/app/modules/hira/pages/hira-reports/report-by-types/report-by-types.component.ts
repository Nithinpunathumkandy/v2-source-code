import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HiraReportStore } from "src/app/stores/hira/reports/hira-reports.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ReportsService } from "src/app/core/services/hira/reports/reports.service";

declare var $: any;

@Component({
  selector: 'app-report-by-types',
  templateUrl: './report-by-types.component.html',
  styleUrls: ['./report-by-types.component.scss']
})
export class ReportByTypesComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

  HiraReportStore = HiraReportStore;
  SubMenuItemStore = SubMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	reportType = null;
	filterDateObject: { startDate: string, endDate: string };
  
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2, private _reportsService: ReportsService) { 
    this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
		});
  }

  ngOnInit(): void {
    if (!HiraReportStore.selectedReportObject)
			this._router.navigateByUrl('/risk-management/reports');
		else {
			HiraReportStore.reportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_risk_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.HiraReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/risk-management/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = `from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							this._reportsService.exportToExcel(this.HiraReportStore.selectedReportObject, params);
							break;
						default:
							break;
					}
					// Don't forget to unset clicked item immediately after using it
					SubMenuItemStore.unSetClickedSubMenuItem();
				}

				if (SubMenuItemStore.DatefilterValue != '') {
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				}

			})
		}
		setTimeout(() => {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			this._utilityService.detectChanges(this._cdr);
		}, 250);
  }

  scrollEvent = (event: any): void => {
		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
		  this._renderer2.addClass(this.navBar.nativeElement, 'affix');
		}
		else {
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
		}
	}

	getReportList(dateObj) {
		let params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
		this._reportsService.getItems(this.HiraReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}
	// for listing data of table dynamically

	risktypeValue(row: any): string {
		const riskTypeValue = this.HiraReportStore.selectedReportObject.riskTypeValue;
		if (this.HiraReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
			const riskTypeValue2 = this.HiraReportStore.selectedReportObject.riskTypeValue2;
			return `${row[riskTypeValue]}${row[riskTypeValue2]}`;
		}
		else {
			return `${row[riskTypeValue]}`;
		}

	}
	// for navigating to Risk listing page

	getRiskList(row: any) {
		HiraReportStore.setRiskListingTableTitle(this.risktypeValue(row));
		if (this.HiraReportStore.selectedReportObject.hasOwnProperty("analysisId") && ((this.HiraReportStore.selectedReportObject.type === "risks-by-risk-score-inherent") || (this.HiraReportStore.selectedReportObject.type === "risks-by-risk-score-residual"))) {
			const analysisId = this.HiraReportStore.selectedReportObject.analysisId;
			this._router.navigateByUrl(`risk-management/reports/${this.HiraReportStore.selectedReportObject.type}/${row[analysisId]}`);
		}
		else {
			this._router.navigateByUrl(`risk-management/reports/${this.HiraReportStore.selectedReportObject.type}/${row.id}`);
		}
	}

	// selecting type of date range need to apply on the filtering of the data

	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			HiraReportStore.reportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		HiraReportStore.reportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
	}

}
