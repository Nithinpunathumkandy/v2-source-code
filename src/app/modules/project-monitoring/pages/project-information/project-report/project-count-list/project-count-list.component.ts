import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProjectReportService } from 'src/app/core/services/project-monitoring/project-report/project-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectReportStore } from 'src/app/stores/project-monitoring/project-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-project-count-list',
  templateUrl: './project-count-list.component.html',
  styleUrls: ['./project-count-list.component.scss']
})
export class ProjectCountListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

  ProjectReportStore = ProjectReportStore;
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
		private _projectReportService: ProjectReportService,
		private _humanCapitalService: HumanCapitalService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.riskcountType = params.riskcountType;
		});
	}

  ngOnInit(): void {
    if (!ProjectReportStore.selectedReportObject)
			this._router.navigateByUrl('/project-monitoring/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			if(this.ProjectReportStore.selectedReportObject.reportType == 'project') NoDataItemStore.setNoDataItems({ title: "common_no_project_title" });
      else if(this.ProjectReportStore.selectedReportObject.reportType == 'change_request') NoDataItemStore.setNoDataItems({ title: "common_no_change_request_title" });
      else if(this.ProjectReportStore.selectedReportObject.reportType == 'project_closure') NoDataItemStore.setNoDataItems({ title: "common_no_project_closure_title" });
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
					{ activityName: this.ProjectReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/project-monitoring/reports/${this.riskcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate) {
								params = `?${this.ProjectReportStore.selectedReportObject.riskItemId}=${this.id}&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._projectReportService.exportToExcelList(this.ProjectReportStore.selectedReportObject, params);
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
	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
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
			ProjectReportStore.ProjectReportDetailslistmakeEmpty();
			this.pageChange(1);
		}
	}

	// for moving to each risk when we click on them
	getRisk(id: any): void {

		if (this.ProjectReportStore.selectedReportObject.reportType === 'project') {
			this._router.navigateByUrl(`project-monitoring/projects/${id}`);
		}
		else if (this.ProjectReportStore.selectedReportObject.reportType === 'change_request') {
			this._router.navigateByUrl(`project-monitoring/projects/${id}/project-change-request/${id}`);
		}
    else if (this.ProjectReportStore.selectedReportObject.reportType === 'project_closure') {
			this._router.navigateByUrl(`project-monitoring/projects/${id}/project-closure/${id}`);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		ProjectReportStore.ProjectReportDetailslistmakeEmpty();
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
		if (newPage) ProjectReportStore.setCurrentPage(newPage);
		this._projectReportService.getProjectItemsDetails(this.id, this.ProjectReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		SubMenuItemStore.searchText = '';
	}

}
