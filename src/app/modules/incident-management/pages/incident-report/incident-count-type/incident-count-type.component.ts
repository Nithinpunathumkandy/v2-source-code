import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentManagementReportStore } from 'src/app/stores/incident-management/incident-report/incident-report-store';
import { IncidentReportDetailsService } from 'src/app/core/services/incident-management/incident-report/incident-report-details.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;

@Component({
	selector: 'app-incident-count-type',
	templateUrl: './incident-count-type.component.html',
	styleUrls: ['./incident-count-type.component.scss']
})
export class IncidentCountTypeComponent implements OnInit {
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	IncidentManagementReportStore = IncidentManagementReportStore;
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
		private _incidentReportDetailsService: IncidentReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
		});
	}

	ngOnInit(): void {
		if (!IncidentManagementReportStore.selectedReportObject)
			this._router.navigateByUrl('/incident-management/reports');
		else {
			IncidentManagementReportStore.IncidentManagementReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_incident_title" });
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
					{ activityName: this.IncidentManagementReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/incident-management/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._incidentReportDetailsService.exportToExcel(this.IncidentManagementReportStore.selectedReportObject, params);
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
		this._incidentReportDetailsService.getItems(this.IncidentManagementReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}
	// for listing data of table dynamically

	risktypeValue(row: any): string {
		const riskTypeValue = this.IncidentManagementReportStore.selectedReportObject.riskTypeValue;
		if (this.IncidentManagementReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
			const riskTypeValue2 = this.IncidentManagementReportStore.selectedReportObject.riskTypeValue2;
			return `${row[riskTypeValue]}${row[riskTypeValue2]}`;
		}
		else {
			return `${row[riskTypeValue]}`;
		}

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

	// for navigating to Risk listing page

	getRiskList(row: any) {
		IncidentManagementReportStore.setIncidentManagementReportDetailsListingTableTitle(this.risktypeValue(row));
		this._router.navigateByUrl(`incident-management/reports/${this.IncidentManagementReportStore.selectedReportObject.type}/${row.id}`);
	}

	// selecting type of date range need to apply on the filtering of the data

	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			IncidentManagementReportStore.IncidentManagementReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		IncidentManagementReportStore.IncidentManagementReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {

		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);

	}

}
