import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { MsAuditReportList } from 'src/app/core/models/ms-audit-management/ms-audit-report/ms-audit-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditReportStore } from 'src/app/stores/ms-audit-management/ms-audit-report/ms-audit-report.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';






@Component({
  selector: 'app-ms-audit-report-list',
  templateUrl: './ms-audit-report-list.component.html',
  styleUrls: ['./ms-audit-report-list.component.scss']
})
export class MsAuditReportListComponent implements OnInit {

	AuditReportStore  = AuditReportStore ;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeProcessRegisterlist: MsAuditReportList[];

	Report_loader:boolean =false;
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
		if(OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings){
			this.processRegisterList();
			this._utilityService.detectChanges(this._cdr);
		}
	})
}

// for moveing to next page
getReport(obj) {
	AuditReportStore.selectedReportObject = obj;
	SubMenuItemStore.datefilterValue = 'year';
	this._router.navigateByUrl('ms-audit-management/reports/' + obj.type);
}

// for getting the list of data shows in Risk Register section
processRegisterList(): void {

	this.initializeProcessRegisterlist = AuditReportStore.AuditReportListArray.filter(function (i) {
		return i.reportType == 'riskRegister';
	});

	for (var i = 0; i < this.initializeProcessRegisterlist.length; i++) {
		if (this.initializeProcessRegisterlist[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeProcessRegisterlist[i].checkLevel]) {
			this.initializeProcessRegisterlist.splice(i, 1);
			i--;
		}
	}
}


}
