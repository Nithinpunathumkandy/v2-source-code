import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { BCMReportStore } from 'src/app/stores/bcm/bcm-report/bcm-report-store';
import { BCMReportService } from 'src/app/core/services/bcm/bcm-report/bcm-report.service';
declare var $: any;

@Component({
	selector: 'app-bcm-count-list',
	templateUrl: './bcm-count-list.component.html'
})
export class BCMCountListComponent implements OnInit {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	BCMReportStore = BCMReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	id: string;
	bcmCountType: string;
	reactionDisposer: IReactionDisposer;
	filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _humanCapitalService: HumanCapitalService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
		private _bcmReportService: BCMReportService,
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.bcmCountType = params.riskcountType;
		});
	}

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BCMCountListComponent
   */
	ngOnInit(): void {
		if (!BCMReportStore.selectedReportObject)
			this._router.navigateByUrl('/bcm/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_bcm_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

			if (SubMenuItemStore.DatefilterValue != '') {
				if(SubMenuItemStore.DatefilterValue != 'custom')
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
				else {
					this.filterDateObject = SubMenuItemStore.filterDateObject;
					this.pageChange(1);
				}
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			}
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.BCMReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/bcm/reports/${this.bcmCountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = `?${this.BCMReportStore.selectedReportObject.bcmItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							this._bcmReportService.exportToExcelList(this.BCMReportStore.selectedReportObject, params);
							break;
						default:
							break;
					}
					// Don't forget to unset clicked item immediately after using it
					SubMenuItemStore.unSetClickedSubMenuItem();
					if (SubMenuItemStore.DatefilterValue != '') {
						this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
					}
				}
			});
		}
		if (SubMenuItemStore.DatefilterValue != '') {
			if(SubMenuItemStore.DatefilterValue != 'custom')
				this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			else {
				this.filterDateObject = SubMenuItemStore.filterDateObject;
				this.pageChange(1);
			}
			// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
		}
		setTimeout(() => {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			this._utilityService.detectChanges(this._cdr);
		}, 250);
	}
	getTimezoneFormatted(time) {
		return this._helperService.timeZoneFormatted(time);
	}
	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
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

	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			BCMReportStore.BCMReportDetailslistmakeEmpty();
			this.pageChange(1);
		}
	}

	// for moving to each bcm when we click on them
	getRisk(id: any): void {
			this._router.navigateByUrl(`bcm/risk-assessment/${id}`);
		}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		BCMReportStore.BCMReportDetailslistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

	// setting pagination
	pageChange(newPage: number = null) {
		if (newPage) BCMReportStore.setCurrentPage(newPage);
		let params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		this._bcmReportService.getBCMItemsDetails(this.id, this.BCMReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BCMCountListComponent
   */
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		SubMenuItemStore.searchText = '';
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
