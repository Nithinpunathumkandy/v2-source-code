import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyReportsService } from 'src/app/core/services/strategy-management/reports/strategy-reports.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyReportStore } from 'src/app/stores/strategy-management/strategy-report.store';
declare var $: any;

@Component({
  selector: 'app-strategy-count-list',
  templateUrl: './strategy-count-list.component.html',
  styleUrls: ['./strategy-count-list.component.scss']
})

export class StrategyCountListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  StrategyReportStore = StrategyReportStore
  id: string;
  riskcountType: string;
  reactionDisposer: IReactionDisposer;
  filterDateObject: { startDate: string, endDate: string };


  constructor(private _router: Router,
		private _route: ActivatedRoute,
		private _strategyReportDetailsService: StrategyReportsService,
		private _humanCapitalService: HumanCapitalService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2) { 
      this._route.params.subscribe(params => {
        this.id = params.id;
        this.riskcountType = params.riskcountType;
      });
    }

  ngOnInit(): void {
    if (!StrategyReportStore.selectedReportObject)
			this._router.navigateByUrl('/strategy-management/report');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any profiles here!" });
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
					{ activityName: this.StrategyReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/strategy-management/report/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.StrategyReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							//this._strategyReportDetailsService.exportToExcel(this.StrategyReportStore.selectedReportObject, params);
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

  pageChange(newPage: number = null) {
	let params = null;
	if (this.filterDateObject.startDate) {
		params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
	}
		if (newPage) StrategyReportStore.setCurrentPage(newPage);
		this._strategyReportDetailsService.getIncidentItemsDetails(this.id, this.StrategyReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}
  passDates(dateObject): any {
		StrategyReportStore.StrategyManagementReportDetailslistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

  getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

  createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}

  getStrategy(id: any): void {

		// if (this.StrategyReportStore.selectedReportObject.reportType === 'profile') {
		// 	this._router.navigateByUrl('strategy-management/strategy-profiles/'+id);
		// }
		if (this.StrategyReportStore.selectedReportObject.reportType === 'profile') {
			this._router.navigateByUrl(`strategy-management/strategy-reports/${id}`);
		}
		else if (this.StrategyReportStore.selectedReportObject.reportType === 'initiative') {
			this._router.navigateByUrl(`strategy-management/strategy-initiatives/${id}`);
		}
		else if(this.StrategyReportStore.selectedReportObject.reportType === 'kpi') {
			this._router.navigateByUrl(`strategy-management/strategy-kpis/${id}`);
		}else if(this.StrategyReportStore.selectedReportObject.reportType === 'action_plan') {
			this._router.navigateByUrl(`strategy-management/strategy-action-plan/${id}`);
		}

	}

  createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

  processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			StrategyReportStore.StrategyManagementReportDetailslistmakeEmpty();
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

  ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		SubMenuItemStore.searchText = '';
	}

}
