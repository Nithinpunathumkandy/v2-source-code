import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { BCMReportService } from 'src/app/core/services/bcm/bcm-report/bcm-report.service';
import { BCMReportStore } from 'src/app/stores/bcm/bcm-report/bcm-report-store';
declare var $: any;

@Component({
	selector: 'app-bcm-count-type',
	templateUrl: './bcm-count-type.component.html'
})
export class BCMCountTypeComponent implements OnInit {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	BCMReportStore = BCMReportStore;
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
		private _bcmReportService: BCMReportService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
			console.log(params);
		});
	}

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BCMCountTypeComponent
   */
	ngOnInit(): void {
		console.log(BCMReportStore.allItems);
		console.log(AuthStore.user.organization?.title);
		
		if (!BCMReportStore.selectedReportObject)
			this._router.navigateByUrl('/bcm/reports');
		else {
			BCMReportStore.BCMReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_bcm_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
			if (SubMenuItemStore.DatefilterValue != '') {
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				if(SubMenuItemStore.DatefilterValue != 'custom')
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				else {
					this.filterDateObject = SubMenuItemStore.filterDateObject;
					this.getReportList(this.filterDateObject);
				}
			}
			this.reactionDisposer = autorun(() => {
				if (this.BCMReportStore.selectedReportObject.type == 'bcm-bia-performed-reports')
				{
				var subMenuItems = [
					{ activityName: this.BCMReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/bcm/reports' } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				}
				else {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.BCMReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/bcm/reports' } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
			}
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							if (this.BCMReportStore.selectedReportObject.type == 'bcm-bia-performed-reports')
							this._bcmReportService.exportToExcel(this.BCMReportStore.selectedReportObject, '');
							else
							this._bcmReportService.exportToExcel(this.BCMReportStore.selectedReportObject, params);
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
			params = `&from=${dateObj.startDate}&to=${dateObj.endDate}`;
		}
		if (this.BCMReportStore.selectedReportObject.type == 'bcm-bia-performed-reports')
		this._bcmReportService.getItems(false,this.BCMReportStore.selectedReportObject, null).subscribe(() => this._utilityService.detectChanges(this._cdr));
		else
		this._bcmReportService.getItems(false,this.BCMReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

	sortTitle(type: string) {
		this._bcmReportService.sortBcmReport(type, SubMenuItemStore.searchText);
		if (SubMenuItemStore.DatefilterValue != '') {
			this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			
		}
		// this.pageChange()
		// let params;
		// this._bcmReportService.getItems(false,this.BCMReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
	bcmTypeValue(row: any): string {
		const bcmTypeValue = this.BCMReportStore.selectedReportObject.bcmTypeValue;
		if (this.BCMReportStore.selectedReportObject.hasOwnProperty("bcmTypeValue2")) {
			const bcmTypeValue2 = this.BCMReportStore.selectedReportObject.bcmTypeValue2;
			return `${row[bcmTypeValue]}${row[bcmTypeValue2]}`;
		}
		else {
			return `${row[bcmTypeValue]}`;
		}

	}

	// for navigating to Risk listing page
	// getRiskList(row: any) {
	// 	BCMReportStore.setBCMReportDetailsListingTableTitle(this.bcmTypeValue(row));
	// 	this._router.navigateByUrl(`bcm/reports/${this.BCMReportStore.selectedReportObject.type}/${row.id}`);
	// }

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {
			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			BCMReportStore.BCMReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		BCMReportStore.BCMReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BCMCountTypeComponent
   */
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
