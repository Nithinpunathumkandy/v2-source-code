import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { JsoReportList } from 'src/app/core/models/jso/jso-report/jso-report';
import { JsoReportStore } from 'src/app/stores/jso/jso-report/jso-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-jso-report',
	templateUrl: './jso-report.component.html',
	styleUrls: ['./jso-report.component.scss']
})
export class JsoReportComponent implements OnInit {

	JsoReportStore = JsoReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationModulesStore = OrganizationModulesStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeJsoList: JsoReportList[];
	initializeJsoUnsafeList: JsoReportList[];
	Report_loader: boolean = false;

	constructor(
		private _router: Router,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.Report_loader = true;
			this._utilityService.detectChanges(this._cdr);
		  }, 100);

		this.reactionDisposer = autorun(() => {
			if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
				this.jsoList();
				this.jsoUnsafeList();
				this._utilityService.detectChanges(this._cdr);
			}
		})

	}

	// for moveing to next page
	getReport(obj) {
		JsoReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('jso/reports/' + obj.type);
	}
	// for getting the list of data shows in audit section
	jsoList(): void {
		this.initializeJsoList = this.JsoReportStore.JsoReportListArray.filter(function (i) {
			return i.reportType == 'jso';
		});
		for (var i = 0; i < this.initializeJsoList.length; i++) {
			if (this.initializeJsoList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeJsoList[i].checkLevel]) {
				this.initializeJsoList.splice(i, 1);
				i--;
			}
		}

	}
	jsoUnsafeList(): void {
		this.initializeJsoUnsafeList = this.JsoReportStore.JsoReportListArray.filter(function (i) {
			return i.reportType == 'jsoUnsafe';
		});
	}


}
