import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventReportService } from 'src/app/core/services/event-monitoring/event-report/event-report.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventReportStore } from 'src/app/stores/event-monitoring/event-report-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
@ViewChild('plainDev') plainDev: ElementRef;
@ViewChild('navBar') navBar: ElementRef;


SubMenuItemStore = SubMenuItemStore;
OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
reactionDisposer: IReactionDisposer;
BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
EventReportStore = EventReportStore;
AuthStore = AuthStore;
reportType = null;
filterDateObject: { startDate: string, endDate: string };

  constructor(
    private _router: Router,
	private _route: ActivatedRoute,
	private _eventReportService: EventReportService,
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
	   setTimeout(()=>{
		console.log(EventReportStore?.reportloaded,EventReportStore.allItems.length)
	   },5000)
    if (!EventReportStore.selectedReportObject)
			this._router.navigateByUrl('/event-monitoring/reports');
		else {
			EventReportStore.reportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			if(this.EventReportStore.selectedReportObject.reportType == 'eventRegister') NoDataItemStore.setNoDataItems({ title: "common_no_event_title" });
            else if(this.EventReportStore.selectedReportObject.reportType == 'eventTreatment') NoDataItemStore.setNoDataItems({ title: "common_no_change_request_title" });
			else if (this.EventReportStore.selectedReportObject.reportType == 'eventClosure')NoDataItemStore.setNoDataItems({ title: "common_no_event_closure_title" });
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
					{ activityName: this.EventReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/event-monitoring/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._eventReportService.exportToExcel(this.EventReportStore.selectedReportObject, params);
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
		if (this.filterDateObject.startDate) {
			params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
		}
		this._eventReportService.getItems(this.EventReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
	riskTypeValue(row: any): string {
		const eventTypeValue = this.EventReportStore.selectedReportObject.eventTypeValue;
		if (this.EventReportStore.selectedReportObject.hasOwnProperty("eventTypeValue2")) {
			const eventTypeValue2 = this.EventReportStore.selectedReportObject.eventTypeValue2;
			return `${row[eventTypeValue]} ${row[eventTypeValue2]}`;
		}
		if (this.EventReportStore.selectedReportObject.hasOwnProperty("eventTypeValue3") ){
			const eventTypeValue3 = this.EventReportStore.selectedReportObject.eventTypeValue3;
			return `${row[eventTypeValue]}-(${row[eventTypeValue3]})`;
		}
		else {
			return `${row[eventTypeValue]}`;
		}

	}
	// for navigating to Risk listing page

	getRiskList(row: any) {
		EventReportStore.setEventReportDetailsListingTableTitle(this.riskTypeValue(row));
		this._router.navigateByUrl(`event-monitoring/reports/${this.EventReportStore.selectedReportObject.type}/${row.id}`);
	}

	// selecting type of date range need to apply on the filtering of the data

	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			EventReportStore.reportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		EventReportStore.reportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

	ngOnDestroy() {

		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
	}

}
