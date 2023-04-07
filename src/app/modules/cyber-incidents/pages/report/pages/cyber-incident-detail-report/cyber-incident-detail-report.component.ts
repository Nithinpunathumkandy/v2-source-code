import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CyberIncidentReportService } from 'src/app/core/services/cyber-incident/cyber-incident-report/cyber-incident-report.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-detail-report',
  templateUrl: './cyber-incident-detail-report.component.html',
  styleUrls: ['./cyber-incident-detail-report.component.scss']
})
export class CyberIncidentDetailReportComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  CyberReportStore  = CyberReportStore ;
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
		private _cyberIncidentReportService: CyberIncidentReportService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
    private _humanCapitalService: HumanCapitalService
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.riskcountType = params.riskcountType;
		});
	}

	ngOnInit(): void {
		if (!CyberReportStore.selectedReportObject)
			this._router.navigateByUrl('/cyber-incident/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_data_title" });
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
					{ activityName: this.CyberReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/cyber-incident/reports/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.CyberReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._cyberIncidentReportService.exportToExcelList(this.CyberReportStore.selectedReportObject, params);
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
			CyberReportStore.externalRisktlistmakeEmpty();
			this.pageChange(1);
		}
	}

	// for moving to each risk when we click on them
	getRisk(id: any): void {
    if(this.CyberReportStore.selectedReportObject.type=='cyber-incident-by-statuses'  
      || this.CyberReportStore.selectedReportObject.type=='cyber_incident_by_classification' || this.CyberReportStore.selectedReportObject.type=='cyber_incident_by_department')
    {
      this._router.navigateByUrl(`cyber-incident/cyber-incidents/${id}`);
    }
    else
    {
      this._router.navigateByUrl(`cyber-incident/cyber-incident-corrective-actions/${id}`);
    }
		
	}

	getCADetails(item)
	{
		this._router.navigateByUrl('cyber-incident/cyber-incident-corrective-actions/'+item?.id);
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		CyberReportStore.externalRisktlistmakeEmpty();
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
		if (newPage) CyberReportStore.setCurrentPage(newPage);
		this._cyberIncidentReportService.getCyberItemsDetails(this.id, this.CyberReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
	}

}
