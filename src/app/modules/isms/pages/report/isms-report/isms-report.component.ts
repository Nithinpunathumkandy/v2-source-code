import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportList } from 'src/app/core/models/isms/report/report-details';
import { IsmsReportStore } from 'src/app/stores/isms/report/report-details-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
	selector: 'app-isms-report',
	templateUrl: './isms-report.component.html',
	styleUrls: ['./isms-report.component.scss']
})
export class IsmsReportComponent implements OnInit {

	IsmsReportStore = IsmsReportStore;
	AuthStore = AuthStore;
	reactionDisposer: IReactionDisposer;
	OrganizationModulesStore = OrganizationModulesStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeReportRegisterlist: ReportList[];
	initializeReportTreatmentList: ReportList[];
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
				this.riskRegisterList();
				this.riskTreatmentList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	// for moveing to next page
	getReport(obj) {
		IsmsReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('isms/reports/' + obj.type);
	}

	// for getting the list of data shows in Risk Register section
	riskRegisterList(): void {
		const checkLevelKey = 'checkLevel';

		this.initializeReportRegisterlist = this.IsmsReportStore.ReportListArray.filter(function (i) {
			return i.reportType == 'riskRegister';
		});
		
		for (var i = 0; i < this.initializeReportRegisterlist.length; i++) {
			if (this.initializeReportRegisterlist[i].hasOwnProperty('checkLevel')) {
				if (this.initializeReportRegisterlist[i].checkLevel != 'is_ms_type' && (!this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeReportRegisterlist[i].checkLevel])) {
					this.initializeReportRegisterlist.splice(i, 1);
					i--;
				}
				else if (this.initializeReportRegisterlist[i].checkLevel == 'is_ms_type' && (!this.OrganizationGeneralSettingsStore.organizationSettings[this.initializeReportRegisterlist[i].checkLevel])) {
					this.initializeReportRegisterlist.splice(i, 1);
					i--;
				}
			}
		}
	}

	// for getting the list of data shows in Risk Treatment section
	riskTreatmentList(): void {
		this.initializeReportTreatmentList = this.IsmsReportStore.ReportListArray.filter(function (i) {
			return i.reportType == 'riskTreatment';
		});
	}

}
