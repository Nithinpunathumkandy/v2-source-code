import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessReportStore } from 'src/app/stores/bpm/process-report/process-report-store';
import { ProcessReportDetailsService } from 'src/app/core/services/bpm/process-report/process-report-details.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;

@Component({
	selector: 'app-process-count-type',
	templateUrl: './process-count-type.component.html',
	styleUrls: ['./process-count-type.component.scss']
})
export class ProcessCountTypeComponent implements OnInit {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

	ProcessReportStore = ProcessReportStore;
	SubMenuItemStore = SubMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	reportType = null;
	filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _processReportDetailsService: ProcessReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
	) {
		this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
		});
	}

	ngOnInit(): void {

		if (!ProcessReportStore.selectedReportObject)
			this._router.navigateByUrl('/bpm/reports');
		else {
			ProcessReportStore.processReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_process_title" });
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
					{ activityName: this.ProcessReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/bpm/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if(this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._processReportDetailsService.exportToExcel(this.ProcessReportStore.selectedReportObject, params);
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
			this._processReportDetailsService.getItems(this.ProcessReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
		}

		// for listing data of table dynamically

		risktypeValue(row: any): string {
			const riskTypeValue = this.ProcessReportStore.selectedReportObject.riskTypeValue;
			if (this.ProcessReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
				const riskTypeValue2 = this.ProcessReportStore.selectedReportObject.riskTypeValue2;
				return `${row[riskTypeValue]}${row[riskTypeValue2]}`;
			}
			else {
				return `${row[riskTypeValue]}`;
			}

		}

		// for navigating to Risk listing page

		getRiskList(row: any) {
			ProcessReportStore.setProcessRiskListingTableTitle(this.risktypeValue(row));
			this._router.navigateByUrl(`bpm/reports/${this.ProcessReportStore.selectedReportObject.type}/${row.id}`);
		}

		// selecting type of date range need to apply on the filtering of the data

		processDateFilterSelected(dateType: any): void {
			if(dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			ProcessReportStore.processReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		ProcessReportStore.processReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {

		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();

	}

}
