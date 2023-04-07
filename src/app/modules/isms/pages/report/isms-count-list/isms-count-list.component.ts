import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsReportStore } from 'src/app/stores/isms/report/report-details-store';
import { ReportDetailsService } from 'src/app/core/services/isms/report/report-details/report-details.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DatePipe } from '@angular/common';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';


declare var $: any;

@Component({
	selector: 'app-isms-count-list',
	templateUrl: './isms-count-list.component.html',
	styleUrls: ['./isms-count-list.component.scss'],
	providers: [DatePipe]
})
export class IsmsCountListComponent implements OnInit {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	IsmsReportStore = IsmsReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	id: string;
	riskcountType: string;
	reactionDisposer: IReactionDisposer;
	startEndDate: any; filterDateObject: { startDate: string, endDate: string };

	constructor(
		private datePipe: DatePipe,
		private _router: Router,
		private _route: ActivatedRoute,
		private _reportDetailsService: ReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
		private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService,
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.riskcountType = params.ismscountType;
		});
	}

	ngOnInit(): void {

		if (!IsmsReportStore.selectedReportObject)
			this._router.navigateByUrl('/isms/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
			console.log(this.filterDateObject,'date');

			NoDataItemStore.setNoDataItems({ title: "common_no_risk_title" });
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
					{ activityName: this.IsmsReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/isms/reports/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.IsmsReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._reportDetailsService.exportTolistExcel(this.IsmsReportStore.selectedReportObject, params);
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

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			IsmsReportStore.risktlistmakeEmpty();
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

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		IsmsReportStore.risktlistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

	// for moving to each risk when we click on them
	getRisk(id: any): void {
		if (this.IsmsReportStore.selectedReportObject.reportType == "riskTreatment") {
			this._router.navigateByUrl(`isms/isms-risk-treatment/${id}`)
		}
		else {
			this._router.navigateByUrl(`isms/isms-risks/${id}`);
		}
	}

	// setting pagination
	pageChange(newPage: number = null) {
		let params = null;
		if (this.filterDateObject.startDate) {
			params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		}
		if (newPage) IsmsReportStore.setCurrentPage(newPage);
		this._reportDetailsService.getRiskItemsDetails(this.id, this.IsmsReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImagePreview(type, token) {
		return this._humanCapitalService.getThumbnailPreview(type, token);
	  }
	
	  getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	  }

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		SubMenuItemStore.searchText = '';
	}

}
