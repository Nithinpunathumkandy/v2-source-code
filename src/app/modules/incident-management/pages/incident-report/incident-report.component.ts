import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentManagementReportList } from 'src/app/core/models/incident-management/incident-report/incident-report';
import { IncidentManagementReportStore } from 'src/app/stores/incident-management/incident-report/incident-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-incident-report',
	templateUrl: './incident-report.component.html',
	styleUrls: ['./incident-report.component.scss']
})
export class IncidentReportComponent implements OnInit {
	
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	IncidentManagementReportStore = IncidentManagementReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationModulesStore = OrganizationModulesStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeIncidentList: IncidentManagementReportList[];
	initializeInvestigationList: IncidentManagementReportList[];
	initializeCorrectiveList: IncidentManagementReportList[];
	Report_loader: boolean = false;
	constructor(
		private _router: Router,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef, private _renderer2: Renderer2
	) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.Report_loader = true;
			this._utilityService.detectChanges(this._cdr);
		}, 100);

		this.reactionDisposer = autorun(() => {
			if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
				this.incidentList();
				this.investigationList();
				this.correctiveList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
		setTimeout(() => {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			this._utilityService.detectChanges(this._cdr);
		  }, 250);
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

	// for moveing to next page
	getReport(obj) {
		IncidentManagementReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('incident-management/reports/' + obj.type);
	}
	// for getting the list of data shows in audit section
	incidentList(): void {
		this.initializeIncidentList = this.IncidentManagementReportStore.IncidentManagementReportListArray.filter(function (i) {
			return i.reportType == 'incident';
		});

	}
	investigationList(): void {
		this.initializeInvestigationList = this.IncidentManagementReportStore.IncidentManagementReportListArray.filter(function (i) {
			return i.reportType == 'investigation';
		});
	}
	correctiveList(): void {
		this.initializeCorrectiveList = this.IncidentManagementReportStore.IncidentManagementReportListArray.filter(function (i) {
			return i.reportType == 'corrective';
		});
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent, true);
	}

}
