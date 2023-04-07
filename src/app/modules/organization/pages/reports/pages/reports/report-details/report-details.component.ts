import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router, ActivatedRoute } from "@angular/router";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationReportStore } from "src/app/stores/organization/organization-reports/organization-reports-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ReportService } from "src/app/core/services/organization/report/report.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit,OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationReportStore = OrganizationReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  reactionDisposer:IReactionDisposer;
  reportType = null;
	filterDateObject: { startDate: string, endDate: string };
  constructor(
    private _helperService: HelperServiceService,
    private _router: Router, private _activatedRoute: ActivatedRoute,
    private _organizationReportService: ReportService,
    private _renderer2: Renderer2, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.reactionDisposer = autorun(() => {
      // var subMenuItems = [
      //   {activityName: null, submenuItem: {type: 'close', path: "../"}},
      // ]
      // this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
    });
    this._activatedRoute.params.subscribe(params => {
      this.reportType = params['id']; 
    });
    if (!OrganizationReportStore.selectedReportObject)
			this._router.navigateByUrl('/organization/reports');
		else {
			OrganizationReportStore.OrganizationReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_organization_issue_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
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
					{ activityName: this.OrganizationReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/organization/reports' } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if(this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._organizationReportService.exportToExcel(this.OrganizationReportStore.selectedReportObject, params);
							break;
						default:
							break;
					}
					
					if (SubMenuItemStore.clikedSubMenuItem.type!='export_to_excel') {
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

  gotoIssuesList(){
    this._router.navigateByUrl('/organization/reports/details/'+this.reportType);
  }

  getReportList(dateObj) {
	let params=null;
	  if(dateObj.startDate){
		  params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
	  }
		this._organizationReportService.getItems(this.OrganizationReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
	typeValue(row: any): string {
		const TypeValueTypeValue = this.OrganizationReportStore.selectedReportObject.typeValue;
    return `${row[TypeValueTypeValue]}`;
		// if (this.OrganizationReportStore.selectedReportObject.hasOwnProperty("nonComformityTypeValue2")) {
		// 	const TypeValueTypeValue2 = this.OrganizationReportStore.selectedReportObject.nonComformityTypeValue2;
		// 	return `${row[TypeValueTypeValue]} ${row[TypeValueTypeValue2]}`;
		// }
		// else {
		// 	return `${row[TypeValueTypeValue]}`;
		// }

	}

	// for navigating to NonConformity listing page
	getOrganizationReportList(row: any) {
		OrganizationReportStore.setOrganizationReportDetailsListingTableTitle(this.typeValue(row));
		this._router.navigateByUrl(`organization/reports/${this.OrganizationReportStore.selectedReportObject.type}/${row[this.OrganizationReportStore.selectedReportObject.paramsId]}`);
	}

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {
			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			OrganizationReportStore.OrganizationReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		OrganizationReportStore.OrganizationReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof NonComformityCountTypeComponent
   */
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
