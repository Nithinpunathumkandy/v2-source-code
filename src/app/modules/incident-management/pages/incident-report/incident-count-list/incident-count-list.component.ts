import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentManagementReportStore } from 'src/app/stores/incident-management/incident-report/incident-report-store';
import { IncidentReportDetailsService } from 'src/app/core/services/incident-management/incident-report/incident-report-details.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DatePipe } from '@angular/common';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
declare var $: any;

@Component({
	selector: 'app-incident-count-list',
	templateUrl: './incident-count-list.component.html',
	styleUrls: ['./incident-count-list.component.scss']
})
export class IncidentCountListComponent implements OnInit {
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	IncidentManagementReportStore = IncidentManagementReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	id: string;
	riskcountType: string;
	reactionDisposer: IReactionDisposer;
	filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _incidentReportDetailsService: IncidentReportDetailsService,
		private _humanCapitalService: HumanCapitalService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.riskcountType = params.riskcountType;
		});
	}

	ngOnInit(): void {
		if (!IncidentManagementReportStore.selectedReportObject)
			this._router.navigateByUrl('/incident-management/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_incident_title" });
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
					{ activityName: this.IncidentManagementReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/incident-management/reports/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.IncidentManagementReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._incidentReportDetailsService.exportToExcelList(this.IncidentManagementReportStore.selectedReportObject, params);
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
			});
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
			IncidentManagementReportStore.IncidentManagementReportDetailslistmakeEmpty();
			this.pageChange(1);
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

	// for moving to each risk when we click on them
	getRisk(id: any): void {

		if (this.IncidentManagementReportStore.selectedReportObject.reportType === 'incident') {
			this._router.navigateByUrl(`incident-management/${id}/info`);
		}
		else if (this.IncidentManagementReportStore.selectedReportObject.reportType === 'investigation') {
			this._router.navigateByUrl(`incident-management/incident-investigations/${id}`);
		}
		else {
			this._router.navigateByUrl(`incident-management/incident-corrective-actions/${id}`);
		}

	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		IncidentManagementReportStore.IncidentManagementReportDetailslistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

	// setting pagination
	pageChange(newPage: number = null) {
		let params = null;
		if (this.filterDateObject.startDate) {
			params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		}
		if (newPage) IncidentManagementReportStore.setCurrentPage(newPage);
		this._incidentReportDetailsService.getIncidentItemsDetails(this.id, this.IncidentManagementReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		SubMenuItemStore.searchText = '';
	}

}
