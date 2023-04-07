import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReportList } from 'src/app/core/models/external-audit/external-report/external-report';
import { ExternalReportStore } from 'src/app/stores/external-audit/external-report/external-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-external-report',
	templateUrl: './external-report.component.html',
	styleUrls: ['./external-report.component.scss']
})
export class ExternalReportComponent implements OnInit {

	ExternalReportStore = ExternalReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeAuditList: ExternalReportList[];
	initializeFindingsList: ExternalReportList[];
	Report_loader: boolean = false;
	OrganizationModulesStore = OrganizationModulesStore
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
				this.externalReportList();
				this.externalFindingList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	// for moveing to next page
	getReport(obj) {
		ExternalReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('external-audit/reports/' + obj.type);
	}
	// for getting the list of data shows in audit section
	externalReportList(): void {
		this.initializeAuditList = this.ExternalReportStore.ExternalReportListArray.filter(function (i) {
			return i.reportType == 'externalAudit';
		});
		for (var i = 0; i < this.initializeAuditList.length; i++) {
			if (this.initializeAuditList[i].hasOwnProperty('checkLevel')) {
				if (this.initializeAuditList[i].checkLevel != 'is_ms_type' && (!this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAuditList[i].checkLevel])) {
					this.initializeAuditList.splice(i, 1);
					i--;
				}
				else if (this.initializeAuditList[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializeAuditList[i].checkLevel])) {
					this.initializeAuditList.splice(i, 1);
					i--;
				}
			}
		}

	}

	// for getting the list of data shows in auditFinding section
	externalFindingList(): void {
		this.initializeFindingsList = this.ExternalReportStore.ExternalReportListArray.filter(function (i) {
			return i.reportType == 'finding';
		});
	}

}
