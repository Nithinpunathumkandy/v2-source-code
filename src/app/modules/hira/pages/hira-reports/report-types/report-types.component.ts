import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { HiraReportStore } from "src/app/stores/hira/reports/hira-reports.store";
import { ReportsList } from "src/app/core/models/hira/reports/reports";

@Component({
  selector: 'app-report-types',
  templateUrl: './report-types.component.html',
  styleUrls: ['./report-types.component.scss']
})
export class ReportTypesComponent implements OnInit {

  HiraReportStore = HiraReportStore;
  OrganizationModulesStore = OrganizationModulesStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeReportRegisterlist: ReportsList[];
  reportLoader: boolean = false;

  constructor(
    private _router: Router,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
			this.reportLoader = true;
			this._utilityService.detectChanges(this._cdr);
    }, 100);
    this.reactionDisposer = autorun(() => {
			if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
				this.riskRegisterList();
				// this.riskTreatmentList();
				this._utilityService.detectChanges(this._cdr);
			}
		})
  }

  // for moveing to next page
	getReport(obj) {
		HiraReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('risk-management/reports/' + obj.type);
	}

	// for getting the list of data shows in Risk Register section
	riskRegisterList(): void {
		const checkLevelKey = 'checkLevel';

		this.initializeReportRegisterlist = this.HiraReportStore.ReportListArray.filter(function (i) {
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

}
