import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { KpiReportService } from 'src/app/core/services/kpi-management/report/kpi-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiReportStore } from 'src/app/stores/kpi-management/report/kpi-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-kpi-count-list',
  templateUrl: './kpi-count-list.component.html',
  styleUrls: ['./kpi-count-list.component.scss'],
  providers: [DatePipe]
})
export class KpiCountListComponent implements OnInit {
	@ViewChild('navBar') navBar: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

	AppStore = AppStore;
	AuthStore = AuthStore;
  	KpiReportStore = KpiReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	
	id: string;
	kpicountType: string;
	reactionDisposer: IReactionDisposer;
	startEndDate: any; filterDateObject: { startDate: string, endDate: string };

	constructor(
		private _router: Router,
		private _renderer2: Renderer2,
		private _route: ActivatedRoute,
		private _cdr: ChangeDetectorRef,
		private _utilityService: UtilityService,
		private _imageService: ImageServiceService,
    	private _kpiReportService: KpiReportService,
		private _helperService: HelperServiceService,
		private _humanCapitalService: HumanCapitalService,
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.kpicountType = params.kpicountType;
		});
	}

	ngOnInit(): void {
		if (!KpiReportStore.selectedReportObject)
			this._router.navigateByUrl('/kpi-management/reports');
		else {
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
					this.pageChange(1);
				}
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			}
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.KpiReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/kpi-management/reports/${this.kpicountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.KpiReportStore.selectedReportObject.kpiItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._kpiReportService.exportTolistExcel(this.KpiReportStore.selectedReportObject, params);
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
			setTimeout(() => {
				$(this.confirmationPopUp.nativeElement).modal('show');
			}, 100);
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			KpiReportStore.kpiReportlistmakeEmpty();
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
		KpiReportStore.kpiReportlistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

	// for moving to each risk when we click on them
	getDetails(id: any): void {
		this._router.navigateByUrl(`kpi-management/kpis/${id}`);
	}

	// setting pagination
	pageChange(newPage: number = null) {
		let params = null;
		if (this.filterDateObject.startDate) {
			params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		}		
		if (newPage) KpiReportStore.setCurrentPage(newPage);
		this._kpiReportService.getKpiItemsDetails(this.id, this.KpiReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImagePreview(type, token) {
		return this._humanCapitalService.getThumbnailPreview(type, token);
	}

	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
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
