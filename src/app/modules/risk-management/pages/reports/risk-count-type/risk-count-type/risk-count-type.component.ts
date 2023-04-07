import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskReportStore } from 'src/app/stores/risk-management/reports/report-details-store';
import { ReportDetailsService } from 'src/app/core/services/risk-management/reports/report-details.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { ReportList } from 'src/app/core/models/risk-management/reports/report-details';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

declare var $: any;

@Component({
	selector: 'app-risk-count-type',
	templateUrl: './risk-count-type.component.html',
	styleUrls: ['./risk-count-type.component.scss']
})
export class RiskCountTypeComponent implements OnInit, OnDestroy {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	RiskReportStore = RiskReportStore;
	SubMenuItemStore = SubMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	reportType = null;
	filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _reportDetailsService: ReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
	) {
		this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
		});
	}

	ngOnInit(): void {

		if (!RiskReportStore.selectedReportObject)
			this._router.navigateByUrl('/risk-management/reports');
		else {
			RiskReportStore.reportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_risk_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
			if (SubMenuItemStore.DatefilterValue != '') {
				if(SubMenuItemStore.DatefilterValue != 'custom')
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				else {
					this.filterDateObject = SubMenuItemStore.filterDateObject;
					this.getReportList(this.filterDateObject);
				}
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			}
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.RiskReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/risk-management/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._reportDetailsService.exportToExcel(this.RiskReportStore.selectedReportObject, params);
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
		let params = null;
		if (dateObj?.startDate) {
			params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
		}
		this._reportDetailsService.getItems(this.RiskReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}
	// for listing data of table dynamically

	risktypeValue(row: any): string {
		const riskTypeValue = this.RiskReportStore.selectedReportObject.riskTypeValue;
		if (this.RiskReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
			const riskTypeValue2 = this.RiskReportStore.selectedReportObject.riskTypeValue2;
			return `${row[riskTypeValue]}${row[riskTypeValue2]}`;
		}
		else {
			return `${row[riskTypeValue]}`;
		}

	}
	// for navigating to Risk listing page

	getRiskList(row: any) {
		RiskReportStore.setRiskListingTableTitle(this.risktypeValue(row));
		if (this.RiskReportStore.selectedReportObject.hasOwnProperty("analysisId") && ((this.RiskReportStore.selectedReportObject.type === "risks-by-risk-score-inherent") || (this.RiskReportStore.selectedReportObject.type === "risks-by-risk-score-residual"))) {
			const analysisId = this.RiskReportStore.selectedReportObject.analysisId;
			this._router.navigateByUrl(`risk-management/reports/${this.RiskReportStore.selectedReportObject.type}/${row[analysisId]}`);
		}
		else {
			this._router.navigateByUrl(`risk-management/reports/${this.RiskReportStore.selectedReportObject.type}/${row.id}`);
		}
	}

	// selecting type of date range need to apply on the filtering of the data

	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			RiskReportStore.reportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		RiskReportStore.reportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {

		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();

	}

}
