import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentReportService } from 'src/app/core/services/incident-management/report/incident-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { data } from 'jquery';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';

declare var $: any;

@Component({
	selector: 'app-main-report',
	templateUrl: './main-report.component.html',
	styleUrls: ['./main-report.component.scss']
})
export class MainReportComponent implements OnInit {
	@ViewChild('container') container: ElementRef;
	@ViewChild('bbBookblock') bbBookblock: ElementRef;
	@ViewChild('bbNavPrev') bbNavPrev: ElementRef;
	@ViewChild('bbNavNext') bbNavNext: ElementRef;
	@ViewChild('tblContents') tblContents: ElementRef;

	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	IncidentReportStore = IncidentReportStore
	reactionDisposer: IReactionDisposer;
	AuthStore = AuthStore;
	AppStore = AppStore;
	AuditStore = AuditStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

	incidentReportObject = {
		reportId: null,
		fullView: true,
		bookView: false
	};

	constructor(
		private _incidentReportService: IncidentReportService, private _imageService: ImageServiceService,
		private _helperService: HelperServiceService, private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef, private _renderer2: Renderer2, private _eventEmitterService: EventEmitterService,
		private _router: Router, private _incidentService: IncidentService,
		private _IncidentReportService: IncidentReportService,
		private route: ActivatedRoute,

	) { }

	ngOnInit(): void {
		// NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_report'});
		this.reactionDisposer = autorun(() => {
			if (!AuthStore.getActivityPermission(1900, 'CREATE_INCIDENT_REPORT')) {
				NoDataItemStore.deleteObject('subtitle');
				NoDataItemStore.deleteObject('buttonText');
			}
			if (SubMenuItemStore.clikedSubMenuItem) {

				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "full_view":
						this.incidentReportObject.bookView = true;
						this.incidentReportObject.fullView = false;
						IncidentReportStore.fullView = true;
						this._IncidentReportService.getItem(this.incidentReportObject.reportId).subscribe(res => {
							this._utilityService.detectChanges(this._cdr);
						});
						this.setSubMenu();
						console.log(IncidentReportStore.fullView,'val1');
						this._utilityService.detectChanges(this._cdr);
						break;
					case "book_view":
						this.incidentReportObject.bookView = false;
						this.incidentReportObject.fullView = true;
						IncidentReportStore.fullView = false;
						this._IncidentReportService.getItem(this.incidentReportObject.reportId).subscribe(res => {
							this._utilityService.detectChanges(this._cdr);
						});
						this.setSubMenu();
						console.log(IncidentReportStore.fullView,'val1');
						this._utilityService.detectChanges(this._cdr);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}

			if (NoDataItemStore.clikedNoDataItem) {
				// IncidentStore.clearDocumentDetails();
				//   this.addIncidentReport();
				NoDataItemStore.unSetClickedNoDataItem();
			}
		})
		this.route.params.subscribe(params => {
			this.incidentReportObject.reportId = +params['id']; // (+) converts string 'id' to a number
			this._utilityService.detectChanges(this._cdr);
		});
		this.setSubMenu();
	}

	setSubMenu() {
		if (this.incidentReportObject.bookView == false) {
			let subMenuItems = [
				// { activityName: null, submenuItem: { type: 'full_view' } },
				{ activityName: null, submenuItem: { type: 'close', path: '../' } }
			]
			this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
		}
		else if (this.incidentReportObject.fullView == false) {
			let subMenuItems = [
				// { activityName: null, submenuItem: { type: 'book_view' } },
				{ activityName: null, submenuItem: { type: 'close', path: '../' } }
			]
			this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
		}
	}




	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		IncidentReportStore.searchText = null;
		IncidentReportStore.unsetAllIncidents();
		IncidentReportStore.fullView = false;


	}

}
