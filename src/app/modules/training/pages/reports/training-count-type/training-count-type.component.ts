import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { TrainingReportStore } from 'src/app/stores/training/training-report/training-report-store';
import { TrainingReportDetailsService } from 'src/app/core/services/training/training-report/training-report-details.service';
declare var $: any;

@Component({
	selector: 'app-training-count-type',
	templateUrl: './training-count-type.component.html',
	styleUrls: ['./training-count-type.component.scss']
})
export class TrainingCountTypeComponent implements OnInit {

	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	TrainingReportStore = TrainingReportStore;
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
		private _trainingReportDetailsService: TrainingReportDetailsService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2
	) {
		this._route.params.subscribe(params => {
			console.log(params);
			this.reportType = params.trainingcountType;
			TrainingReportStore.countType = params.riskcountType;
		});
	}

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TrainingCountTypeComponent
   */
	ngOnInit(): void {
		if (!TrainingReportStore.selectedReportObject)
			this._router.navigateByUrl('/trainings/reports');
		else {
			TrainingReportStore.TrainingReportlistmakeEmpty();
			if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
			this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

			NoDataItemStore.setNoDataItems({ title: "common_no_training_title" });
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
					{ activityName: this.TrainingReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
					{ activityName: null, submenuItem: { type: 'close', path: '/trainings/reports' } },
				]

				this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
				if (SubMenuItemStore.clikedSubMenuItem) {
					switch (SubMenuItemStore.clikedSubMenuItem.type) {
						case "export_to_excel":
							let params = '';
							if (this.filterDateObject.startDate){
								params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
							}
							this._trainingReportDetailsService.exportToExcel(this.TrainingReportStore.selectedReportObject, params);
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
		this._trainingReportDetailsService.getItems(this.TrainingReportStore.selectedReportObject, params).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
	trainingTypeValue(row: any): string {
		const trainingTypeValue = this.TrainingReportStore.selectedReportObject.trainingTypeValue;
		if (this.TrainingReportStore.selectedReportObject.hasOwnProperty("trainingTypeValue2")) {
			const trainingTypeValue2 = this.TrainingReportStore.selectedReportObject.trainingTypeValue2;
			return `${row[trainingTypeValue]}${row[trainingTypeValue2]}`;
		}
		else {
			return `${row[trainingTypeValue]}`;
		}

	}

	// for navigating to Risk listing page
	getRiskList(row: any) {
		TrainingReportStore.setTrainingReportDetailsListingTableTitle(this.trainingTypeValue(row));
		this._router.navigateByUrl(`trainings/reports/${this.TrainingReportStore.selectedReportObject.type}/${row.id}`);
	}

	// selecting type of date range need to apply on the filtering of the data
	processDateFilterSelected(dateType: any): void {
		if (dateType === "custom") {
			$(this.confirmationPopUp.nativeElement).modal('show');
		}
		else {
			this.filterDateObject = this._helperService.getStartEndDate(dateType);
			TrainingReportStore.TrainingReportlistmakeEmpty();
			this.getReportList(this.filterDateObject);
		}
	}

	// output from custom-date-popup recieved here
	passDates(dateObject): any {
		this.filterDateObject = dateObject;
		SubMenuItemStore.filterDateObject = dateObject;
		TrainingReportStore.TrainingReportlistmakeEmpty();
		this.getReportList(this.filterDateObject);
	}


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TrainingCountTypeComponent
   */
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent, true);
		this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
	}

}
