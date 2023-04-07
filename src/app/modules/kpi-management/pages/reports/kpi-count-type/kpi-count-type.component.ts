import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiReportService } from 'src/app/core/services/kpi-management/report/kpi-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiReportStore } from 'src/app/stores/kpi-management/report/kpi-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-kpi-count-type',
  templateUrl: './kpi-count-type.component.html',
  styleUrls: ['./kpi-count-type.component.scss']
})
export class KpiCountTypeComponent implements OnInit {
	@ViewChild('navBar') navBar: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

	reactionDisposer: IReactionDisposer;
	AuthStore = AuthStore;
	KpiReportStore = KpiReportStore;
	SubMenuItemStore = SubMenuItemStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	
	reportType = null;
	filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _renderer2: Renderer2,
		private _route: ActivatedRoute,
		private _cdr: ChangeDetectorRef,
		private _utilityService: UtilityService,
		private _kpiReportService: KpiReportService,
		private _helperService: HelperServiceService,
	) {
		this._route.params.subscribe(params => {
			this.reportType = params.kpiCountType;
		});
	}

	ngOnInit(): void {

		if (!KpiReportStore.selectedReportObject)
			this._router.navigateByUrl('/kpi-management/reports');
		else {
			KpiReportStore.kpiReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			if(KpiReportStore.selectedReportObject.type =='kpi-score-count-by-status'){
				NoDataItemStore.setNoDataItems({ title: "common_kpi_score_title" });
			}else{
				NoDataItemStore.setNoDataItems({ title: "common_kpi_title" });
			}
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
					{ activityName: this.KpiReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/kpi-management/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._kpiReportService.exportToExcel(this.KpiReportStore.selectedReportObject, params);
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
	getReportList(dateObj) {
		let params = null;
		if (dateObj.startDate) {
			params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
		}
		this._kpiReportService.getItems(this.KpiReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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

	// for listing data of table dynamically
	TypeValue(row: any): string {
		const TypeValueTypeValue = this.KpiReportStore.selectedReportObject.kpiTypeValue;
		if (this.KpiReportStore.selectedReportObject.hasOwnProperty("kpiTypeValue2")) {
			const TypeValueTypeValue2 = this.KpiReportStore.selectedReportObject.kpiTypeValue;
			return `${row[TypeValueTypeValue]} ${row[TypeValueTypeValue2]}`;
		}
		else {
			return `${row[TypeValueTypeValue]}`;
		}

	}

	// for navigating to NonConformity listing page
	getNonConformityList(row: any) {
		KpiReportStore.setKpiReportDetailsListingTableTitle(this.TypeValue(row));
		this._router.navigateByUrl(`kpi-management/reports/${this.KpiReportStore.selectedReportObject.type}/${row.id}`);
	}

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {
			setTimeout(() => {
				$(this.confirmationPopUp.nativeElement).modal('show');
			}, 100);
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			KpiReportStore.kpiReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		KpiReportStore.kpiReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
