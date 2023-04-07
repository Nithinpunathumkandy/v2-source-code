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
import { ReportService } from "src/app/core/services/organization/report/report.service";
import { OrganizationReportStore } from "src/app/stores/organization/organization-reports/organization-reports-store";

declare var $: any;

@Component({
  selector: 'app-report-by-category',
  templateUrl: './report-by-category.component.html',
  styleUrls: ['./report-by-category.component.scss']
})
export class ReportByCategoryComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	OrganizationReportStore = OrganizationReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	id: string;
	reportCountType: string;
	reactionDisposer: IReactionDisposer;
	filterDateObject: { startDate: string, endDate: string };

  constructor(private _router: Router,
		private _route: ActivatedRoute,
		private _organizationReportService: ReportService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2) { 
      this._route.params.subscribe(params => {
        this.id = params.id;
        this.reportCountType = params.type;
      });
     }

     ngOnInit(): void {
      if (!OrganizationReportStore.selectedReportObject)
        this._router.navigateByUrl('/organization/reports');
      else {
        if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
        this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
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
  
        NoDataItemStore.setNoDataItems({ title: "no_issues_available" });
        this.reactionDisposer = autorun(() => {
          var subMenuItems = [
            { activityName: null, submenuItem: { type: 'datefilter' } },
            { activityName: this.OrganizationReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: `/organization/reports/${this.reportCountType}` } },
          ]
          this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                let params = '';
                if (this.filterDateObject.startDate) {
                  params = `?${this.OrganizationReportStore.selectedReportObject.itemId}=${this.reportCountType}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
                }
                this._organizationReportService.exportToExcelList(this.OrganizationReportStore.selectedReportObject, params);
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
  
    // selecting type of date range need to apply on the filtering of the data
    processDateFilterSelected(dateType: any): void {
      if (dateType === "custom") {
  
        $(this.confirmationPopUp.nativeElement).modal('show');
      }
      else {
        this.filterDateObject = this._helperService.getStartEndDate(dateType);
        OrganizationReportStore.OrganizationReportDetailslistmakeEmpty();
        this.pageChange(1);
      }
    }
  
    // for moving to each non conformity when we click on them
    gotoIssueDetailsPage(id: any): void {
      this._router.navigateByUrl(`/organization/issue-details/${id}`);
    }
  
    // output from custom-date-popup recieved here
    passDates(dateObject): any {
      OrganizationReportStore.OrganizationReportDetailslistmakeEmpty();
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
      if (newPage) OrganizationReportStore.setCurrentPage(newPage);
      this._organizationReportService.getItemsDetails(this.reportCountType, this.OrganizationReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

     /**
     * @description
     * Called once, before the instance is destroyed.
     * Add 'implements OnDestroy' to the class.
     *
     * @memberof NonComformityCountListComponent
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
