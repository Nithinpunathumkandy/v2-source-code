import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CyberIncidentReportService } from 'src/app/core/services/cyber-incident/cyber-incident-report/cyber-incident-report.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-report-details',
  templateUrl: './cyber-incident-report-details.component.html',
  styleUrls: ['./cyber-incident-report-details.component.scss']
})
export class CyberIncidentReportDetailsComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  CyberReportStore  = CyberReportStore ;
	SubMenuItemStore = SubMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	reportType = null;
	filterDateObject: { startDate: string, endDate: string };
  constructor(
    private _router: Router,
		private _route: ActivatedRoute,
		private _cyberIncidentReportService: CyberIncidentReportService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService
  ) {
    this._route.params.subscribe(params => {
			this.reportType = params.riskcountType;
		});
   }

  ngOnInit(): void {

    if (!CyberReportStore.selectedReportObject)
			this._router.navigateByUrl('cyber-incident/reports');
		else {
			CyberReportStore.cyberReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_data_title" });
			this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      if (SubMenuItemStore.DatefilterValue != '') {
				if(SubMenuItemStore.DatefilterValue != 'custom')
					this.cyberDateFilterSelected(SubMenuItemStore.DatefilterValue);
				else {
					this.filterDateObject = SubMenuItemStore.filterDateObject;
					this.getReportList(1);
				}
				// this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
			}
			this.reactionDisposer = autorun(() => {
				var subMenuItems = [
					{ activityName: null, submenuItem: { type: 'datefilter' } },
					{ activityName: CyberReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '../' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
              let params = '';
							if(this.filterDateObject.startDate) {
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._cyberIncidentReportService.exportToExcel(CyberReportStore.selectedReportObject, params);
							break;
						default:
							break;
					}
					// Don't forget to unset clicked item immediately after using it
          if (SubMenuItemStore.clikedSubMenuItem.type!='export_to_excel') {
            this.cyberDateFilterSelected(SubMenuItemStore.DatefilterValue);
          }
          SubMenuItemStore.unSetClickedSubMenuItem();
					
				}
       

			})
      
		}
  }

  getReportList(dateObj) {
    let params=null;
	  if(dateObj.startDate){
		  params = `?from=${dateObj.startDate}&to=${dateObj.endDate}`;
	  }

    this._cyberIncidentReportService.getItems(CyberReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  // for listing data of table dynamically

  risktypeValue(row: any): string {
    const riskTypeValue = CyberReportStore.selectedReportObject.riskTypeValue;
    if (CyberReportStore.selectedReportObject.hasOwnProperty("riskTypeValue2")) {
      const riskTypeValue2 = CyberReportStore.selectedReportObject.riskTypeValue2;
      return `${row[riskTypeValue]} ${row[riskTypeValue2]}`;
    }
    else {
      return `${row[riskTypeValue]}`;
    }

  }

  // for navigating to Risk listing page

  getRiskList(row: any) {
    CyberReportStore.setCyberRiskListingTableTitle(this.risktypeValue(row));
    let id;
    // if(row.ms_audit_finding_status_id)
    // {
    //   id=row.ms_audit_finding_status_id
    // }
    // else if(row.ms_audit_plan_status_id){
    //   id=row.ms_audit_plan_status_id
    // }
    // else
    // {
      id=row.id
    // }
    this._router.navigateByUrl(`cyber-incident/reports/${CyberReportStore.selectedReportObject.type}/${id}`);
  }

  // selecting type of date range need to apply on the filtering of the data

  cyberDateFilterSelected(dateType: any): void {
    if(dateType === "custom") {

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  else {
    this.filterDateObject = this._helperService.getStartEndDate(dateType);
    CyberReportStore.cyberReportlistmakeEmpty();
    this.getReportList(this.filterDateObject);
  }
}

// output from custom-date-popup recieved here
passDates(dateObject): any {
  this.filterDateObject = dateObject;
  SubMenuItemStore.filterDateObject = dateObject;
  CyberReportStore.cyberReportlistmakeEmpty();
  this.getReportList(this.filterDateObject);
}

ngOnDestroy() {

  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();

}

}
