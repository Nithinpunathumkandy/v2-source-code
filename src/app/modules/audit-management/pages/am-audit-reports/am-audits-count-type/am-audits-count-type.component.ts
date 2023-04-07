import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditReportDetailsService } from 'src/app/core/services/audit-management/am-audit-report-details/am-audit-report-details.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditReportStore } from 'src/app/stores/audit-management/am-audit-report/am-audit-report-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-am-audits-count-type',
  templateUrl: './am-audits-count-type.component.html',
  styleUrls: ['./am-audits-count-type.component.scss']
})

export class AmAuditsCountTypeComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

  AmAuditReportStore = AmAuditReportStore;
	SubMenuItemStore = SubMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	reportType = null;
	noDataMsg="common_nodata_title";
	filterDateObject: { startDate: string, endDate: string };

  constructor(
    private _router: Router,
		private _route: ActivatedRoute,
		private _amAuditReportDetailsService: AmAuditReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
  ) { 
    this._route.params.subscribe(params => {
			this.reportType = params.amAuditcountType;
		});
  }

  ngOnInit(): void {
		if (!AmAuditReportStore.selectedReportObject)
			this._router.navigateByUrl('/audit-management/reports');
		else {
			AmAuditReportStore.AmAuditReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			// NoDataItemStore.setNoDataItems({ title: "common_no_asset_title" });
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
					{ activityName: this.AmAuditReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/audit-management/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							this._amAuditReportDetailsService.exportToExcel(this.AmAuditReportStore.selectedReportObject, params);
							break;
						default:
							break;
					}
					// Don't forget to unset clicked item immediately after using it
					SubMenuItemStore.unSetClickedSubMenuItem();
				}
				if (SubMenuItemStore.DatefilterValue != '') {
					this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
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
		let params = `&from=${dateObj.startDate}&to=${dateObj.endDate}`;
		this._amAuditReportDetailsService.getItems(false,this.AmAuditReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
	amAuditTypeValue(row: any): string {
		const assetTypeValue = this.AmAuditReportStore.selectedReportObject.amAuditTypeValue;
		if (this.AmAuditReportStore.selectedReportObject.hasOwnProperty("amAuditTypeValue2")) {
			const assetTypeValue2 = this.AmAuditReportStore.selectedReportObject.amAuditTypeValue2;
			return `${row[assetTypeValue]} ${row[assetTypeValue2]}`;
		}
		else {
			return `${row[assetTypeValue]}`;
		}

	}

	sortTitle(type: string) {
		this._amAuditReportDetailsService.sortAmAuditReportList(type, SubMenuItemStore.searchText);
		if (SubMenuItemStore.DatefilterValue != '') {
			this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			
		}

	  }

	// for navigating to Asset listing page
	getAmAuditList(row: any,type?) {		
		AmAuditReportStore.setAmAuditReportDetailsListingTableTitle(this.amAuditTypeValue(row));
		if(type=='am-audit-by-year'){
			this._router.navigateByUrl(`audit-management/reports/${this.AmAuditReportStore.selectedReportObject.type}/${row.year}`);	
		}else{
			this._router.navigateByUrl(`audit-management/reports/${this.AmAuditReportStore.selectedReportObject.type}/${row.id}`);
		}		
	}

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {
			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			AmAuditReportStore.AmAuditReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		AmAuditReportStore.AmAuditReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AssetCountTypeComponent
   */
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
