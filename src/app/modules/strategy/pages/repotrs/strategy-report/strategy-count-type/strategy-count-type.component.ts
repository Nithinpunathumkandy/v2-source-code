import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyReportsService } from 'src/app/core/services/strategy-management/reports/strategy-reports.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyReportStore } from 'src/app/stores/strategy-management/strategy-report.store';
declare var $: any;


@Component({
  selector: 'app-strategy-count-type',
  templateUrl: './strategy-count-type.component.html',
  styleUrls: ['./strategy-count-type.component.scss']
})
export class StrategyCountTypeComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  StrategyReportStore = StrategyReportStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuthStore = AuthStore;
  reportType = null;
  filterDateObject: { startDate: string, endDate: string };

  constructor(private _router: Router,
		private _route: ActivatedRoute,
		private _strategyReportDetailsService: StrategyReportsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
		private _renderer2: Renderer2) { 
      this._route.params.subscribe(params => {
        this.reportType = params.riskcountType;
      });
    }

  ngOnInit(): void {
    if (!StrategyReportStore.selectedReportObject)
    this._router.navigateByUrl('/strategy-management/report');
    else {
      StrategyReportStore.StrategyManagementReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any profiles here!" });
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
					{ activityName: this.StrategyReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/strategy-management/report' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._strategyReportDetailsService.exportToExcel(this.StrategyReportStore.selectedReportObject, params);
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
	this._strategyReportDetailsService.getItems(this.StrategyReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

  
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {

			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
            StrategyReportStore.StrategyManagementReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

  	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
         StrategyReportStore.StrategyManagementReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}

  getRiskList(row: any) {
		StrategyReportStore.setStrategyManagementReportDetailsListingTableTitle(this.risktypeValue(row));
		this._router.navigateByUrl(`strategy-management/report/${this.StrategyReportStore.selectedReportObject.type}/${row.id}`);
	}

  risktypeValue(row: any): string {
		const riskTypeValue = this.StrategyReportStore.selectedReportObject.riskTypeValue;
		if (this.StrategyReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
			const riskTypeValue2 = this.StrategyReportStore.selectedReportObject.riskTypeValue2;
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

	ngOnDestroy(){
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
	}

}
