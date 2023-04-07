import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { ReportsService } from "src/app/core/services/hira/reports/reports.service";
import { HiraReportStore } from "src/app/stores/hira/reports/hira-reports.store";
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
  	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	OrganizationModulesStore = OrganizationModulesStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
  	HiraReportStore = HiraReportStore;
	id: string;
	riskcountType: string;
	reactionDisposer: IReactionDisposer;
	startEndDate: any; filterDateObject: { startDate: string, endDate: string };
  
  constructor(private _router: Router,
		private _route: ActivatedRoute,
    private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
    private _reportsService: ReportsService,
    private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService) { 
    this._route.params.subscribe(params => {
			this.id = params.id;
			this.riskcountType = params.riskcountType;
		});
  }

  ngOnInit(): void {
    if (!HiraReportStore.selectedReportObject)
			this._router.navigateByUrl('/risk-management/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_risk_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: this.HiraReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/risk-management/reports/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = `?${this.HiraReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							this._reportsService.exportTolistExcel(this.HiraReportStore.selectedReportObject, params);
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
			this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
		}
		setTimeout(() => {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			this._utilityService.detectChanges(this._cdr);
		}, 250);
  }

  processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			HiraReportStore.risktlistmakeEmpty();
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
		HiraReportStore.risktlistmakeEmpty();
		this.filterDateObject = dateObject;
		this.pageChange(1);
	}

	// for moving to each risk when we click on them
	getRisk(id: any): void {
		this._router.navigateByUrl(`risk-management/risks/${id}`);
	}

	// setting pagination
	pageChange(newPage: number = null) {
		if (newPage) HiraReportStore.setCurrentPage(newPage);
		let params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		this._reportsService.getRiskItemsDetails(this.id, this.HiraReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
