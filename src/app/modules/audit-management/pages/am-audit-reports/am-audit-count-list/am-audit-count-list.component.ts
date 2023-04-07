import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditReportDetailsService } from 'src/app/core/services/audit-management/am-audit-report-details/am-audit-report-details.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditReportStore } from 'src/app/stores/audit-management/am-audit-report/am-audit-report-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-am-audit-count-list',
  templateUrl: './am-audit-count-list.component.html',
  styleUrls: ['./am-audit-count-list.component.scss']
})
export class AmAuditCountListComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	AmAuditReportStore = AmAuditReportStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	id: string;
	amAuditcountType: string;
	reactionDisposer: IReactionDisposer;
	filterDateObject: { startDate: string, endDate: string };
	noDataMsg="common_nodata_title";
  

  constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _amAuditReportDetailsService: AmAuditReportDetailsService,
		private _humanCapitalService: HumanCapitalService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			this.amAuditcountType = params.amAuditcountType;
		});
	}

  ngOnInit(): void {
		if (!AmAuditReportStore.selectedReportObject)
			this._router.navigateByUrl('/audit-management/reports');
		else {
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			// NoDataItemStore.setNoDataItems({ title: "common_no_asset_title" });
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
					{ activityName: this.AmAuditReportStore.selectedReportObject.listPermission, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: `/audit-management/reports/${this.amAuditcountType}` } },
				]
				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = `?${this.AmAuditReportStore.selectedReportObject.amAuditItemId}=${this.id}`;
							if(params){
								params=params+`&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							else{
								params=params+`?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._amAuditReportDetailsService.exportToExcelList(this.AmAuditReportStore.selectedReportObject, params);
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
			AmAuditReportStore.AmAuditReportDetailslistmakeEmpty();
			this.pageChange(1);
		}
	}

	// for moving to each training when we click on them
	getAmAudit(id: any,audit_id?): void {

		if (this.AmAuditReportStore.selectedReportObject.reportType === 'am_annual_plans') {
			this._router.navigateByUrl(`audit-management/am-audit-plans/${id}`);
		}
		else if (this.AmAuditReportStore.selectedReportObject.reportType === 'am_audits') {
			this._router.navigateByUrl(`audit-management/am-audits/${id}`);
		}
        else if (this.AmAuditReportStore.selectedReportObject.reportType === 'am_audit_findings') {
			this._router.navigateByUrl(`audit-management/am-audit-field-works/${audit_id}/am-audit-findings/${id}`);
		}
		}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		AmAuditReportStore.AmAuditReportDetailslistmakeEmpty();
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		this.pageChange(1);
	}

	getPopupDetails(user) {
		// $('.modal-backdrop').remove(); 
		let userDetailObject: any = {};
		userDetailObject['id'] = user.created_by;
		userDetailObject['first_name'] = user.created_by_first_name;
		userDetailObject['last_name'] = user.created_by_last_name;
		userDetailObject['designation'] = user.created_by_designation;
		userDetailObject['department'] = user.created_by_department;
		userDetailObject['image_token'] = user.created_by_image_token;
		userDetailObject['email'] = user.created_by_email?user.created_by_email:'';
		userDetailObject['mobile'] = user.created_by_mobile?user.created_by_mobile:'';

		return userDetailObject;
	
	  }

	// setting pagination
	pageChange(newPage: number = null) {
		if (newPage) AmAuditReportStore.setCurrentPage(newPage);
		let params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
		this._amAuditReportDetailsService.getAmAuditItemsDetails(this.id, this.AmAuditReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	createImageUrl(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AssetCountListComponent
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
