import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuditReportList } from 'src/app/core/models/internal-audit/audit-reports/audit-report';
import { AuditReportStore } from 'src/app/stores/internal-audit/audit-report/audit-report-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-reports-audit',
	templateUrl: './reports-audit.component.html',
	styleUrls: ['./reports-audit.component.scss']
})
export class ReportsAuditComponent implements OnInit {

	AuditReportStore = AuditReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeAuditProgramList: AuditReportList[];
	initializeAuditList: AuditReportList[];
	initializeAuditFindingsList: AuditReportList[];
	Report_loader: boolean = false;
	OrganizationModulesStore = OrganizationModulesStore;
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
				this.auditProgramReportList();
				this.auditReportList();
				this.auditFindingList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	// for moveing to next page
	getReport(obj) {
		AuditReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('internal-audit/reports/' + obj.type);
	}

	// for getting the list of data shows in audit program section
	auditProgramReportList(): void {

		this.initializeAuditProgramList = this.AuditReportStore.AuditReportListArray.filter(function (i) {
			return i.reportType == 'auditProgram';
		});
	}

	// for getting the list of data shows in audit section
	auditReportList(): void {
		this.initializeAuditList = this.AuditReportStore.AuditReportListArray.filter(function (i) {
			return i.reportType == 'audit';
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
	auditFindingList(): void {
		this.initializeAuditFindingsList = this.AuditReportStore.AuditReportListArray.filter(function (i) {
			return i.reportType == 'auditFinding';
		});
		for (var i = 0; i < this.initializeAuditFindingsList.length; i++) {
			if (this.initializeAuditFindingsList[i].hasOwnProperty('checkLevel')) {
				if (this.initializeAuditFindingsList[i].checkLevel != 'is_ms_type' && (!this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAuditFindingsList[i].checkLevel])) {
					this.initializeAuditFindingsList.splice(i, 1);
					i--;
				}
				else if (this.initializeAuditFindingsList[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializeAuditFindingsList[i].checkLevel])) {
					this.initializeAuditFindingsList.splice(i, 1);
					i--;
				}
			}
		}
	}


}
